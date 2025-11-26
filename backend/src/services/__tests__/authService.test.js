const authService = require('../authService');
const { pool } = require('../../config/database');
const { hashPassword, comparePassword } = require('../../utils/passwordHelper');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwtHelper');

// Mock 설정
jest.mock('../../config/database');
jest.mock('../../utils/passwordHelper');
jest.mock('../../utils/jwtHelper');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validEmail = 'test@example.com';
    const validPassword = 'password123';
    const validUsername = 'testuser';

    describe('성공 케이스', () => {
      test('새 사용자를 성공적으로 등록해야 함', async () => {
        // Mock 설정
        pool.query
          .mockResolvedValueOnce({ rows: [] }) // 이메일 중복 체크
          .mockResolvedValueOnce({ // 사용자 생성
            rows: [{
              user_id: 'user-123',
              email: validEmail,
              username: validUsername,
              role: 'user',
              created_at: '2025-11-26T00:00:00Z'
            }]
          });
        hashPassword.mockResolvedValue('hashed_password_123');

        const result = await authService.register(validEmail, validPassword, validUsername);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(pool.query).toHaveBeenNthCalledWith(1,
          'SELECT email FROM users WHERE email = $1',
          [validEmail]
        );
        expect(hashPassword).toHaveBeenCalledWith(validPassword);
        expect(pool.query).toHaveBeenNthCalledWith(2,
          expect.stringContaining('INSERT INTO users'),
          [validEmail, 'hashed_password_123', validUsername, 'user']
        );
        expect(result).toEqual({
          userId: 'user-123',
          email: validEmail,
          username: validUsername,
          role: 'user'
        });
      });

      test('비밀번호가 해싱되어 저장되어야 함', async () => {
        pool.query
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce({
            rows: [{
              user_id: 'user-123',
              email: validEmail,
              username: validUsername,
              role: 'user'
            }]
          });
        hashPassword.mockResolvedValue('super_secure_hashed_password');

        await authService.register(validEmail, validPassword, validUsername);

        expect(hashPassword).toHaveBeenCalledWith(validPassword);
        expect(pool.query).toHaveBeenNthCalledWith(2,
          expect.any(String),
          expect.arrayContaining(['super_secure_hashed_password'])
        );
      });

      test('기본 role이 user로 설정되어야 함', async () => {
        pool.query
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce({
            rows: [{
              user_id: 'user-123',
              email: validEmail,
              username: validUsername,
              role: 'user'
            }]
          });
        hashPassword.mockResolvedValue('hashed_password');

        const result = await authService.register(validEmail, validPassword, validUsername);

        expect(result.role).toBe('user');
      });
    });

    describe('실패 케이스 - 이메일 중복', () => {
      test('이미 사용 중인 이메일로 등록 시도 시 에러 발생', async () => {
        pool.query.mockResolvedValueOnce({
          rows: [{ email: validEmail }]
        });

        await expect(
          authService.register(validEmail, validPassword, validUsername)
        ).rejects.toThrow('이미 사용 중인 이메일입니다');

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(hashPassword).not.toHaveBeenCalled();
      });

      test('중복 이메일 체크 시 여러 행 반환 시 에러 발생', async () => {
        pool.query.mockResolvedValueOnce({
          rows: [
            { email: validEmail },
            { email: validEmail }
          ]
        });

        await expect(
          authService.register(validEmail, validPassword, validUsername)
        ).rejects.toThrow('이미 사용 중인 이메일입니다');
      });
    });

    describe('실패 케이스 - 데이터베이스 에러', () => {
      test('이메일 중복 체크 중 DB 에러 발생 시 에러 전파', async () => {
        const dbError = new Error('Database connection failed');
        pool.query.mockRejectedValueOnce(dbError);

        await expect(
          authService.register(validEmail, validPassword, validUsername)
        ).rejects.toThrow('Database connection failed');

        expect(hashPassword).not.toHaveBeenCalled();
      });

      test('사용자 생성 중 DB 에러 발생 시 에러 전파', async () => {
        pool.query
          .mockResolvedValueOnce({ rows: [] })
          .mockRejectedValueOnce(new Error('Insert failed'));
        hashPassword.mockResolvedValue('hashed_password');

        await expect(
          authService.register(validEmail, validPassword, validUsername)
        ).rejects.toThrow('Insert failed');
      });

      test('DB 타임아웃 에러 시 에러 전파', async () => {
        const timeoutError = new Error('Connection timeout');
        pool.query.mockRejectedValueOnce(timeoutError);

        await expect(
          authService.register(validEmail, validPassword, validUsername)
        ).rejects.toThrow('Connection timeout');
      });
    });

    describe('실패 케이스 - 비밀번호 해싱 에러', () => {
      test('비밀번호 해싱 실패 시 에러 발생', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        hashPassword.mockRejectedValueOnce(new Error('Hashing failed'));

        await expect(
          authService.register(validEmail, validPassword, validUsername)
        ).rejects.toThrow('Hashing failed');

        expect(pool.query).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('login', () => {
    const validEmail = 'test@example.com';
    const validPassword = 'password123';
    const mockUser = {
      user_id: 'user-123',
      email: validEmail,
      password: 'hashed_password_123',
      username: 'testuser',
      role: 'user'
    };

    describe('성공 케이스', () => {
      test('유효한 이메일과 비밀번호로 로그인 성공', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });
        comparePassword.mockResolvedValueOnce(true);
        generateAccessToken.mockReturnValue('access_token_123');
        generateRefreshToken.mockReturnValue('refresh_token_123');

        const result = await authService.login(validEmail, validPassword);

        expect(pool.query).toHaveBeenCalledWith(
          'SELECT user_id, email, password, username, role FROM users WHERE email = $1',
          [validEmail]
        );
        expect(comparePassword).toHaveBeenCalledWith(validPassword, mockUser.password);
        expect(generateAccessToken).toHaveBeenCalledWith({
          userId: mockUser.user_id,
          email: mockUser.email,
          role: mockUser.role
        });
        expect(generateRefreshToken).toHaveBeenCalledWith({
          userId: mockUser.user_id,
          email: mockUser.email
        });
        expect(result).toEqual({
          accessToken: 'access_token_123',
          refreshToken: 'refresh_token_123',
          user: {
            userId: mockUser.user_id,
            email: mockUser.email,
            username: mockUser.username,
            role: mockUser.role
          }
        });
      });

      test('관리자 계정으로 로그인 성공', async () => {
        const adminUser = { ...mockUser, role: 'admin' };
        pool.query.mockResolvedValueOnce({ rows: [adminUser] });
        comparePassword.mockResolvedValueOnce(true);
        generateAccessToken.mockReturnValue('admin_access_token');
        generateRefreshToken.mockReturnValue('admin_refresh_token');

        const result = await authService.login(validEmail, validPassword);

        expect(result.user.role).toBe('admin');
        expect(generateAccessToken).toHaveBeenCalledWith({
          userId: adminUser.user_id,
          email: adminUser.email,
          role: 'admin'
        });
      });

      test('토큰에 비밀번호가 포함되지 않아야 함', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });
        comparePassword.mockResolvedValueOnce(true);
        generateAccessToken.mockReturnValue('access_token');
        generateRefreshToken.mockReturnValue('refresh_token');

        await authService.login(validEmail, validPassword);

        expect(generateAccessToken).toHaveBeenCalledWith(
          expect.not.objectContaining({ password: expect.anything() })
        );
        expect(generateRefreshToken).toHaveBeenCalledWith(
          expect.not.objectContaining({ password: expect.anything() })
        );
      });
    });

    describe('실패 케이스 - 사용자 없음', () => {
      test('존재하지 않는 이메일로 로그인 시도 시 에러 발생', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(
          authService.login(validEmail, validPassword)
        ).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다');

        expect(comparePassword).not.toHaveBeenCalled();
        expect(generateAccessToken).not.toHaveBeenCalled();
        expect(generateRefreshToken).not.toHaveBeenCalled();
      });

      test('사용자 없을 때 비밀번호 비교가 실행되지 않아야 함', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(
          authService.login(validEmail, validPassword)
        ).rejects.toThrow();

        expect(comparePassword).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 비밀번호 불일치', () => {
      test('잘못된 비밀번호로 로그인 시도 시 에러 발생', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });
        comparePassword.mockResolvedValueOnce(false);

        await expect(
          authService.login(validEmail, 'wrong_password')
        ).rejects.toThrow('이메일 또는 비밀번호가 올바르지 않습니다');

        expect(comparePassword).toHaveBeenCalledWith('wrong_password', mockUser.password);
        expect(generateAccessToken).not.toHaveBeenCalled();
        expect(generateRefreshToken).not.toHaveBeenCalled();
      });

      test('비밀번호 불일치 시 토큰이 생성되지 않아야 함', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });
        comparePassword.mockResolvedValueOnce(false);

        await expect(
          authService.login(validEmail, validPassword)
        ).rejects.toThrow();

        expect(generateAccessToken).not.toHaveBeenCalled();
        expect(generateRefreshToken).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 데이터베이스 에러', () => {
      test('DB 조회 중 에러 발생 시 에러 전파', async () => {
        const dbError = new Error('Database error');
        pool.query.mockRejectedValueOnce(dbError);

        await expect(
          authService.login(validEmail, validPassword)
        ).rejects.toThrow('Database error');

        expect(comparePassword).not.toHaveBeenCalled();
      });

      test('DB 연결 실패 시 에러 전파', async () => {
        pool.query.mockRejectedValueOnce(new Error('Connection failed'));

        await expect(
          authService.login(validEmail, validPassword)
        ).rejects.toThrow('Connection failed');
      });
    });

    describe('실패 케이스 - 비밀번호 비교 에러', () => {
      test('비밀번호 비교 중 에러 발생 시 에러 전파', async () => {
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });
        comparePassword.mockRejectedValueOnce(new Error('Compare failed'));

        await expect(
          authService.login(validEmail, validPassword)
        ).rejects.toThrow('Compare failed');

        expect(generateAccessToken).not.toHaveBeenCalled();
      });
    });
  });

  describe('refreshAccessToken', () => {
    const validRefreshToken = 'valid_refresh_token_123';
    const mockDecoded = {
      userId: 'user-123',
      email: 'test@example.com'
    };
    const mockUser = {
      user_id: 'user-123',
      email: 'test@example.com',
      role: 'user'
    };

    describe('성공 케이스', () => {
      test('유효한 리프레시 토큰으로 새 액세스 토큰 발급', async () => {
        verifyRefreshToken.mockReturnValue(mockDecoded);
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });
        generateAccessToken.mockReturnValue('new_access_token_123');

        const result = await authService.refreshAccessToken(validRefreshToken);

        expect(verifyRefreshToken).toHaveBeenCalledWith(validRefreshToken);
        expect(pool.query).toHaveBeenCalledWith(
          'SELECT user_id, email, role FROM users WHERE user_id = $1',
          [mockDecoded.userId]
        );
        expect(generateAccessToken).toHaveBeenCalledWith({
          userId: mockUser.user_id,
          email: mockUser.email,
          role: mockUser.role
        });
        expect(result).toEqual({
          accessToken: 'new_access_token_123'
        });
      });

      test('관리자 계정의 토큰 갱신', async () => {
        const adminUser = { ...mockUser, role: 'admin' };
        verifyRefreshToken.mockReturnValue(mockDecoded);
        pool.query.mockResolvedValueOnce({ rows: [adminUser] });
        generateAccessToken.mockReturnValue('admin_new_access_token');

        const result = await authService.refreshAccessToken(validRefreshToken);

        expect(generateAccessToken).toHaveBeenCalledWith({
          userId: adminUser.user_id,
          email: adminUser.email,
          role: 'admin'
        });
        expect(result.accessToken).toBe('admin_new_access_token');
      });

      test('새 액세스 토큰에 최신 사용자 정보가 반영되어야 함', async () => {
        verifyRefreshToken.mockReturnValue(mockDecoded);
        pool.query.mockResolvedValueOnce({ rows: [mockUser] });
        generateAccessToken.mockReturnValue('new_token');

        await authService.refreshAccessToken(validRefreshToken);

        expect(generateAccessToken).toHaveBeenCalledWith({
          userId: mockUser.user_id,
          email: mockUser.email,
          role: mockUser.role
        });
      });
    });

    describe('실패 케이스 - 유효하지 않은 토큰', () => {
      test('잘못된 형식의 리프레시 토큰으로 요청 시 에러 발생', async () => {
        verifyRefreshToken.mockImplementation(() => {
          throw new Error('Invalid token');
        });

        await expect(
          authService.refreshAccessToken('invalid_token')
        ).rejects.toThrow('유효하지 않은 리프레시 토큰입니다');

        expect(pool.query).not.toHaveBeenCalled();
        expect(generateAccessToken).not.toHaveBeenCalled();
      });

      test('만료된 리프레시 토큰으로 요청 시 에러 발생', async () => {
        const expiredError = new Error('Token expired');
        expiredError.name = 'TokenExpiredError';
        verifyRefreshToken.mockImplementation(() => {
          throw expiredError;
        });

        await expect(
          authService.refreshAccessToken(validRefreshToken)
        ).rejects.toThrow('유효하지 않은 리프레시 토큰입니다');

        expect(pool.query).not.toHaveBeenCalled();
      });

      test('잘못된 시크릿으로 생성된 토큰 사용 시 에러 발생', async () => {
        const jwtError = new Error('invalid signature');
        jwtError.name = 'JsonWebTokenError';
        verifyRefreshToken.mockImplementation(() => {
          throw jwtError;
        });

        await expect(
          authService.refreshAccessToken(validRefreshToken)
        ).rejects.toThrow('유효하지 않은 리프레시 토큰입니다');
      });
    });

    describe('실패 케이스 - 사용자 없음', () => {
      test('토큰은 유효하지만 사용자가 삭제된 경우 에러 발생', async () => {
        verifyRefreshToken.mockReturnValue(mockDecoded);
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(
          authService.refreshAccessToken(validRefreshToken)
        ).rejects.toThrow('사용자 정보가 존재하지 않습니다');

        expect(generateAccessToken).not.toHaveBeenCalled();
      });

      test('사용자가 없을 때 토큰이 생성되지 않아야 함', async () => {
        verifyRefreshToken.mockReturnValue(mockDecoded);
        pool.query.mockResolvedValueOnce({ rows: [] });

        await expect(
          authService.refreshAccessToken(validRefreshToken)
        ).rejects.toThrow();

        expect(generateAccessToken).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 데이터베이스 에러', () => {
      test('DB 조회 중 에러 발생 시 에러 전파', async () => {
        verifyRefreshToken.mockReturnValue(mockDecoded);
        const dbError = new Error('Database error');
        pool.query.mockRejectedValueOnce(dbError);

        await expect(
          authService.refreshAccessToken(validRefreshToken)
        ).rejects.toThrow('Database error');

        expect(generateAccessToken).not.toHaveBeenCalled();
      });

      test('DB 타임아웃 에러 시 에러 전파', async () => {
        verifyRefreshToken.mockReturnValue(mockDecoded);
        pool.query.mockRejectedValueOnce(new Error('Connection timeout'));

        await expect(
          authService.refreshAccessToken(validRefreshToken)
        ).rejects.toThrow('Connection timeout');
      });
    });

    describe('엣지 케이스', () => {
      test('빈 리프레시 토큰으로 요청 시 에러 발생', async () => {
        verifyRefreshToken.mockImplementation(() => {
          throw new Error('jwt must be provided');
        });

        await expect(
          authService.refreshAccessToken('')
        ).rejects.toThrow('유효하지 않은 리프레시 토큰입니다');
      });

      test('null 리프레시 토큰으로 요청 시 에러 발생', async () => {
        verifyRefreshToken.mockImplementation(() => {
          throw new Error('Token required');
        });

        await expect(
          authService.refreshAccessToken(null)
        ).rejects.toThrow('유효하지 않은 리프레시 토큰입니다');
      });

      test('undefined 리프레시 토큰으로 요청 시 에러 발생', async () => {
        verifyRefreshToken.mockImplementation(() => {
          throw new Error('Token required');
        });

        await expect(
          authService.refreshAccessToken(undefined)
        ).rejects.toThrow('유효하지 않은 리프레시 토큰입니다');
      });
    });
  });
});
