const { validationResult } = require('express-validator');
const authController = require('../authController');
const authService = require('../../services/authService');

// Mock 설정
jest.mock('express-validator');
jest.mock('../../services/authService');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    // Express req, res 모킹
    req = {
      body: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock 함수 초기화
    jest.clearAllMocks();

    // validationResult 기본 성공 설정
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });
  });

  describe('register', () => {
    const validRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser'
    };

    const mockCreatedUser = {
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user'
    };

    describe('성공 케이스', () => {
      test('유효한 데이터로 회원가입 성공 시 201 응답', async () => {
        req.body = validRegisterData;
        authService.register.mockResolvedValue(mockCreatedUser);

        await authController.register(req, res);

        expect(authService.register).toHaveBeenCalledWith(
          validRegisterData.email,
          validRegisterData.password,
          validRegisterData.username
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockCreatedUser
        });
      });

      test('생성된 사용자 정보가 응답에 포함되어야 함', async () => {
        req.body = validRegisterData;
        authService.register.mockResolvedValue(mockCreatedUser);

        await authController.register(req, res);

        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: expect.objectContaining({
            userId: 'user-123',
            email: 'test@example.com',
            username: 'testuser',
            role: 'user'
          })
        });
      });

      test('validation이 성공하면 서비스 호출', async () => {
        req.body = validRegisterData;
        authService.register.mockResolvedValue(mockCreatedUser);

        await authController.register(req, res);

        expect(validationResult).toHaveBeenCalledWith(req);
        expect(authService.register).toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - Validation 에러', () => {
      test('validation 실패 시 400 응답', async () => {
        const validationErrors = [
          { msg: '유효한 이메일 주소를 입력해주세요', param: 'email' },
          { msg: '비밀번호는 최소 8자 이상이어야 합니다', param: 'password' }
        ];
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => validationErrors
        });
        req.body = { email: 'invalid', password: '123' };

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '요청 데이터가 유효하지 않습니다',
            details: validationErrors
          }
        });
        expect(authService.register).not.toHaveBeenCalled();
      });

      test('이메일이 비어있을 때 validation 에러', async () => {
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => [{ msg: '유효한 이메일 주소를 입력해주세요', param: 'email' }]
        });
        req.body = { email: '', password: 'password123', username: 'test' };

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(authService.register).not.toHaveBeenCalled();
      });

      test('비밀번호가 8자 미만일 때 validation 에러', async () => {
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => [{ msg: '비밀번호는 최소 8자 이상이어야 합니다', param: 'password' }]
        });
        req.body = { email: 'test@example.com', password: 'short', username: 'test' };

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(authService.register).not.toHaveBeenCalled();
      });

      test('사용자 이름이 2자 미만일 때 validation 에러', async () => {
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => [{ msg: '사용자 이름은 2자 이상 100자 이하여야 합니다', param: 'username' }]
        });
        req.body = { email: 'test@example.com', password: 'password123', username: 'a' };

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(authService.register).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 이메일 중복', () => {
      test('이메일 중복 시 409 응답', async () => {
        req.body = validRegisterData;
        authService.register.mockRejectedValue(new Error('이미 사용 중인 이메일입니다'));

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: '이미 사용 중인 이메일입니다'
          }
        });
      });

      test('이메일 중복 에러 메시지 정확히 반환', async () => {
        req.body = validRegisterData;
        authService.register.mockRejectedValue(new Error('이미 사용 중인 이메일입니다'));

        await authController.register(req, res);

        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: expect.objectContaining({
            message: '이미 사용 중인 이메일입니다'
          })
        });
      });
    });

    describe('실패 케이스 - 서버 에러', () => {
      test('서비스 에러 발생 시 500 응답', async () => {
        req.body = validRegisterData;
        authService.register.mockRejectedValue(new Error('Database error'));

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Database error'
          }
        });
      });

      test('에러 메시지 없을 시 기본 메시지 반환', async () => {
        req.body = validRegisterData;
        authService.register.mockRejectedValue(new Error());

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: '회원가입 처리 중 오류가 발생했습니다'
          }
        });
      });

      test('DB 연결 실패 시 500 응답', async () => {
        req.body = validRegisterData;
        authService.register.mockRejectedValue(new Error('Connection failed'));

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: false,
            error: expect.objectContaining({
              code: 'INTERNAL_ERROR'
            })
          })
        );
      });
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockLoginResult = {
      accessToken: 'access_token_123',
      refreshToken: 'refresh_token_123',
      user: {
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user'
      }
    };

    describe('성공 케이스', () => {
      test('유효한 자격증명으로 로그인 성공 시 200 응답', async () => {
        req.body = validLoginData;
        authService.login.mockResolvedValue(mockLoginResult);

        await authController.login(req, res);

        expect(authService.login).toHaveBeenCalledWith(
          validLoginData.email,
          validLoginData.password
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockLoginResult
        });
      });

      test('로그인 응답에 토큰과 사용자 정보 포함', async () => {
        req.body = validLoginData;
        authService.login.mockResolvedValue(mockLoginResult);

        await authController.login(req, res);

        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
            user: expect.objectContaining({
              userId: 'user-123',
              email: 'test@example.com'
            })
          })
        });
      });

      test('관리자 로그인 성공', async () => {
        req.body = validLoginData;
        const adminResult = {
          ...mockLoginResult,
          user: { ...mockLoginResult.user, role: 'admin' }
        };
        authService.login.mockResolvedValue(adminResult);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              role: 'admin'
            })
          })
        });
      });
    });

    describe('실패 케이스 - Validation 에러', () => {
      test('validation 실패 시 400 응답', async () => {
        const validationErrors = [
          { msg: '유효한 이메일 주소를 입력해주세요', param: 'email' }
        ];
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => validationErrors
        });
        req.body = { email: 'invalid-email', password: 'password123' };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '요청 데이터가 유효하지 않습니다',
            details: validationErrors
          }
        });
        expect(authService.login).not.toHaveBeenCalled();
      });

      test('이메일이 비어있을 때 validation 에러', async () => {
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => [{ msg: '유효한 이메일 주소를 입력해주세요', param: 'email' }]
        });
        req.body = { email: '', password: 'password123' };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(authService.login).not.toHaveBeenCalled();
      });

      test('비밀번호가 비어있을 때 validation 에러', async () => {
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => [{ msg: '비밀번호를 입력해주세요', param: 'password' }]
        });
        req.body = { email: 'test@example.com', password: '' };

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(authService.login).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 인증 실패', () => {
      test('잘못된 자격증명으로 로그인 시 401 응답', async () => {
        req.body = validLoginData;
        authService.login.mockRejectedValue(new Error('이메일 또는 비밀번호가 올바르지 않습니다'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '이메일 또는 비밀번호가 올바르지 않습니다'
          }
        });
      });

      test('존재하지 않는 사용자 로그인 시 401 응답', async () => {
        req.body = validLoginData;
        authService.login.mockRejectedValue(new Error('이메일 또는 비밀번호가 올바르지 않습니다'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
      });

      test('비밀번호 불일치 시 401 응답', async () => {
        req.body = validLoginData;
        authService.login.mockRejectedValue(new Error('이메일 또는 비밀번호가 올바르지 않습니다'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
      });

      test('에러 메시지 없을 시 기본 메시지 반환', async () => {
        req.body = validLoginData;
        authService.login.mockRejectedValue(new Error());

        await authController.login(req, res);

        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '이메일 또는 비밀번호가 올바르지 않습니다'
          }
        });
      });
    });

    describe('실패 케이스 - 서버 에러', () => {
      test('DB 에러 발생 시에도 401 응답 (보안상 이유)', async () => {
        req.body = validLoginData;
        authService.login.mockRejectedValue(new Error('Database connection failed'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Database connection failed'
          }
        });
      });
    });
  });

  describe('refresh', () => {
    const validRefreshToken = 'valid_refresh_token_123';
    const mockRefreshResult = {
      accessToken: 'new_access_token_123'
    };

    describe('성공 케이스', () => {
      test('유효한 리프레시 토큰으로 액세스 토큰 갱신 성공 시 200 응답', async () => {
        req.body = { refreshToken: validRefreshToken };
        authService.refreshAccessToken.mockResolvedValue(mockRefreshResult);

        await authController.refresh(req, res);

        expect(authService.refreshAccessToken).toHaveBeenCalledWith(validRefreshToken);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: mockRefreshResult
        });
      });

      test('새로운 액세스 토큰이 응답에 포함되어야 함', async () => {
        req.body = { refreshToken: validRefreshToken };
        authService.refreshAccessToken.mockResolvedValue(mockRefreshResult);

        await authController.refresh(req, res);

        expect(res.json).toHaveBeenCalledWith({
          success: true,
          data: expect.objectContaining({
            accessToken: 'new_access_token_123'
          })
        });
      });
    });

    describe('실패 케이스 - 리프레시 토큰 없음', () => {
      test('refreshToken이 없을 때 401 응답', async () => {
        req.body = {};

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '리프레시 토큰이 필요합니다'
          }
        });
        expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      });

      test('refreshToken이 빈 문자열일 때 401 응답', async () => {
        req.body = { refreshToken: '' };

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      });

      test('refreshToken이 null일 때 401 응답', async () => {
        req.body = { refreshToken: null };

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      });

      test('refreshToken이 undefined일 때 401 응답', async () => {
        req.body = { refreshToken: undefined };

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 유효하지 않은 토큰', () => {
      test('유효하지 않은 리프레시 토큰으로 요청 시 401 응답', async () => {
        req.body = { refreshToken: 'invalid_token' };
        authService.refreshAccessToken.mockRejectedValue(new Error('유효하지 않은 리프레시 토큰입니다'));

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '유효하지 않은 리프레시 토큰입니다'
          }
        });
      });

      test('만료된 리프레시 토큰으로 요청 시 401 응답', async () => {
        req.body = { refreshToken: validRefreshToken };
        authService.refreshAccessToken.mockRejectedValue(new Error('유효하지 않은 리프레시 토큰입니다'));

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
      });

      test('사용자가 존재하지 않을 때 401 응답', async () => {
        req.body = { refreshToken: validRefreshToken };
        authService.refreshAccessToken.mockRejectedValue(new Error('사용자 정보가 존재하지 않습니다'));

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
      });

      test('에러 메시지 없을 시 기본 메시지 반환', async () => {
        req.body = { refreshToken: validRefreshToken };
        authService.refreshAccessToken.mockRejectedValue(new Error());

        await authController.refresh(req, res);

        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '토큰 갱신에 실패했습니다'
          }
        });
      });
    });

    describe('실패 케이스 - 서버 에러', () => {
      test('DB 에러 발생 시 401 응답', async () => {
        req.body = { refreshToken: validRefreshToken };
        authService.refreshAccessToken.mockRejectedValue(new Error('Database error'));

        await authController.refresh(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
      });
    });
  });

  describe('logout', () => {
    describe('성공 케이스', () => {
      test('로그아웃 요청 시 200 응답', async () => {
        await authController.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: '로그아웃 되었습니다'
        });
      });

      test('로그아웃 성공 메시지 반환', async () => {
        await authController.logout(req, res);

        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            message: '로그아웃 되었습니다'
          })
        );
      });

      test('로그아웃은 항상 성공해야 함', async () => {
        await authController.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('req 객체 없어도 로그아웃 성공', async () => {
        await authController.logout({}, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: '로그아웃 되었습니다'
        });
      });
    });
  });
});
