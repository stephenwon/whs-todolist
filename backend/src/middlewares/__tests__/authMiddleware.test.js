const { authenticate, requireAdmin } = require('../authMiddleware');
const { verifyAccessToken } = require('../../utils/jwtHelper');
const { pool } = require('../../config/database');

// Mock 설정
jest.mock('../../utils/jwtHelper');
jest.mock('../../config/database');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Express req, res, next 모킹
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();

    // Mock 함수 초기화
    jest.clearAllMocks();
  });

  describe('authenticate 미들웨어', () => {
    describe('성공 케이스', () => {
      const validUser = {
        user_id: 'test-user-id-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        created_at: '2025-11-26T00:00:00Z'
      };

      const validToken = 'valid.jwt.token';
      const decodedToken = { userId: 'test-user-id-123' };

      beforeEach(() => {
        req.headers.authorization = `Bearer ${validToken}`;
        verifyAccessToken.mockReturnValue(decodedToken);
        pool.query.mockResolvedValue({ rows: [validUser] });
      });

      test('유효한 토큰으로 인증 성공', async () => {
        await authenticate(req, res, next);

        expect(verifyAccessToken).toHaveBeenCalledWith(validToken);
        expect(pool.query).toHaveBeenCalledWith(
          'SELECT user_id, email, username, role, created_at FROM users WHERE user_id = $1',
          [decodedToken.userId]
        );
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });

      test('req.user에 올바른 사용자 정보 설정', async () => {
        await authenticate(req, res, next);

        expect(req.user).toEqual({
          userId: validUser.user_id,
          email: validUser.email,
          username: validUser.username,
          role: validUser.role
        });
      });

      test('next() 호출 확인', async () => {
        await authenticate(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
      });

      test('관리자 권한 사용자 인증 성공', async () => {
        const adminUser = { ...validUser, role: 'admin' };
        pool.query.mockResolvedValue({ rows: [adminUser] });

        await authenticate(req, res, next);

        expect(req.user.role).toBe('admin');
        expect(next).toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - Authorization 헤더 문제', () => {
      test('Authorization 헤더 없음', async () => {
        delete req.headers.authorization;

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증이 필요합니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('Bearer 형식이 아닌 헤더', async () => {
        req.headers.authorization = 'InvalidFormat token123';

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증이 필요합니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('Bearer만 있고 토큰 없음', async () => {
        req.headers.authorization = 'Bearer ';

        // 빈 토큰은 verifyAccessToken에서 JsonWebTokenError 발생
        const jwtError = new Error('jwt must be provided');
        jwtError.name = 'JsonWebTokenError';
        verifyAccessToken.mockImplementation(() => {
          throw jwtError;
        });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: '유효하지 않은 토큰입니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('빈 Authorization 헤더', async () => {
        req.headers.authorization = '';

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증이 필요합니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('소문자 bearer 형식 거부', async () => {
        req.headers.authorization = 'bearer token123';

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 토큰 검증 오류', () => {
      beforeEach(() => {
        req.headers.authorization = 'Bearer invalid.token';
      });

      test('만료된 토큰 (TokenExpiredError)', async () => {
        const expiredError = new Error('Token expired');
        expiredError.name = 'TokenExpiredError';
        verifyAccessToken.mockImplementation(() => {
          throw expiredError;
        });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: '토큰이 만료되었습니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
        expect(pool.query).not.toHaveBeenCalled();
      });

      test('잘못된 토큰 (JsonWebTokenError)', async () => {
        const jwtError = new Error('Invalid token');
        jwtError.name = 'JsonWebTokenError';
        verifyAccessToken.mockImplementation(() => {
          throw jwtError;
        });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: '유효하지 않은 토큰입니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
        expect(pool.query).not.toHaveBeenCalled();
      });

      test('기타 토큰 검증 에러', async () => {
        const genericError = new Error('Unknown token error');
        genericError.name = 'UnknownError';
        verifyAccessToken.mockImplementation(() => {
          throw genericError;
        });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증 토큰이 유효하지 않습니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('빈 토큰으로 검증 실패', async () => {
        req.headers.authorization = 'Bearer ';
        const jwtError = new Error('jwt must be provided');
        jwtError.name = 'JsonWebTokenError';
        verifyAccessToken.mockImplementation(() => {
          throw jwtError;
        });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: '유효하지 않은 토큰입니다'
          }
        });
      });
    });

    describe('실패 케이스 - 데이터베이스 조회 문제', () => {
      const validToken = 'valid.jwt.token';
      const decodedToken = { userId: 'test-user-id-123' };

      beforeEach(() => {
        req.headers.authorization = `Bearer ${validToken}`;
        verifyAccessToken.mockReturnValue(decodedToken);
      });

      test('DB에 사용자 없음 (빈 결과)', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '사용자 정보가 존재하지 않습니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('DB 쿼리 에러 발생', async () => {
        const dbError = new Error('Database connection failed');
        pool.query.mockRejectedValue(dbError);

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: '인증 처리 중 오류가 발생했습니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('DB 연결 타임아웃', async () => {
        const timeoutError = new Error('Connection timeout');
        pool.query.mockRejectedValue(timeoutError);

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: '인증 처리 중 오류가 발생했습니다'
          }
        });
      });

      test('DB 응답 형식 오류 (rows 없음)', async () => {
        pool.query.mockResolvedValue({});

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: '인증 처리 중 오류가 발생했습니다'
          }
        });
      });
    });

    describe('엣지 케이스', () => {
      test('토큰에 특수문자 포함', async () => {
        const specialToken = 'token.with.special!@#$%^&*()';
        req.headers.authorization = `Bearer ${specialToken}`;
        verifyAccessToken.mockReturnValue({ userId: 'test-user-id' });
        pool.query.mockResolvedValue({
          rows: [{
            user_id: 'test-user-id',
            email: 'test@example.com',
            username: 'testuser',
            role: 'user'
          }]
        });

        await authenticate(req, res, next);

        expect(verifyAccessToken).toHaveBeenCalledWith(specialToken);
        expect(next).toHaveBeenCalled();
      });

      test('매우 긴 토큰', async () => {
        const longToken = 'a'.repeat(1000);
        req.headers.authorization = `Bearer ${longToken}`;
        verifyAccessToken.mockReturnValue({ userId: 'test-user-id' });
        pool.query.mockResolvedValue({
          rows: [{
            user_id: 'test-user-id',
            email: 'test@example.com',
            username: 'testuser',
            role: 'user'
          }]
        });

        await authenticate(req, res, next);

        expect(verifyAccessToken).toHaveBeenCalledWith(longToken);
        expect(next).toHaveBeenCalled();
      });

      test('여러 Bearer 문자열이 있는 경우', async () => {
        req.headers.authorization = 'Bearer Bearer token123';

        const jwtError = new Error('Invalid token');
        jwtError.name = 'JsonWebTokenError';
        verifyAccessToken.mockImplementation(() => {
          throw jwtError;
        });

        await authenticate(req, res, next);

        expect(verifyAccessToken).toHaveBeenCalledWith('Bearer token123');
      });
    });
  });

  describe('requireAdmin 미들웨어', () => {
    describe('성공 케이스', () => {
      test('req.user가 admin인 경우 next() 호출', () => {
        req.user = {
          userId: 'admin-user-id-456',
          email: 'admin@example.com',
          username: 'adminuser',
          role: 'admin'
        };

        requireAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
      });

      test('관리자 권한으로 정상 통과', () => {
        req.user = {
          userId: 'admin-123',
          email: 'superadmin@example.com',
          username: 'superadmin',
          role: 'admin'
        };

        requireAdmin(req, res, next);

        expect(next).toHaveBeenCalledWith();
      });
    });

    describe('실패 케이스', () => {
      test('req.user 없음', () => {
        req.user = null;

        requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증이 필요합니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('req.user가 undefined', () => {
        req.user = undefined;

        requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증이 필요합니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('req.user.role이 user인 경우', () => {
        req.user = {
          userId: 'test-user-id-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        };

        requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'ADMIN_REQUIRED',
            message: '관리자 권한이 필요합니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('req.user.role이 undefined인 경우', () => {
        req.user = {
          userId: 'test-user-id-123',
          email: 'test@example.com',
          username: 'testuser'
          // role이 없음
        };

        requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'ADMIN_REQUIRED',
            message: '관리자 권한이 필요합니다'
          }
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('req.user.role이 빈 문자열인 경우', () => {
        req.user = {
          userId: 'test-user-id-123',
          email: 'test@example.com',
          username: 'testuser',
          role: ''
        };

        requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          error: {
            code: 'ADMIN_REQUIRED',
            message: '관리자 권한이 필요합니다'
          }
        });
      });

      test('req.user.role이 ADMIN (대문자)인 경우 거부', () => {
        req.user = {
          userId: 'test-user-id-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'ADMIN'
        };

        requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
      });

      test('req.user.role이 moderator인 경우 거부', () => {
        req.user = {
          userId: 'test-user-id-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'moderator'
        };

        requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
      });
    });
  });

  describe('통합 테스트', () => {
    const validUser = {
      user_id: 'test-user-id-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user',
      created_at: '2025-11-26T00:00:00Z'
    };

    const adminUser = {
      user_id: 'admin-user-id-456',
      email: 'admin@example.com',
      username: 'adminuser',
      role: 'admin',
      created_at: '2025-11-26T00:00:00Z'
    };

    test('authenticate 성공 후 requireAdmin 성공 (관리자)', async () => {
      req.headers.authorization = 'Bearer admin.token';
      verifyAccessToken.mockReturnValue({ userId: 'admin-user-id-456' });
      pool.query.mockResolvedValue({ rows: [adminUser] });

      // authenticate 실행
      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('admin');

      // next 호출 횟수 초기화
      next.mockClear();

      // requireAdmin 실행
      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('authenticate 성공 후 requireAdmin 실패 (일반 사용자)', async () => {
      req.headers.authorization = 'Bearer user.token';
      verifyAccessToken.mockReturnValue({ userId: 'test-user-id-123' });
      pool.query.mockResolvedValue({ rows: [validUser] });

      // authenticate 실행
      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('user');

      // res 모킹 초기화
      res.status.mockClear();
      res.json.mockClear();

      // requireAdmin 실행
      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'ADMIN_REQUIRED',
          message: '관리자 권한이 필요합니다'
        }
      });
    });

    test('authenticate 실패 시 requireAdmin 미실행', async () => {
      req.headers.authorization = 'Bearer invalid.token';
      const jwtError = new Error('Invalid token');
      jwtError.name = 'JsonWebTokenError';
      verifyAccessToken.mockImplementation(() => {
        throw jwtError;
      });

      // authenticate 실행 (실패할 것)
      await authenticate(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeNull();
      expect(res.status).toHaveBeenCalledWith(401);

      // requireAdmin을 실행하지 않아야 함 (실제 Express에서는 next가 호출되지 않았으므로)
      // 하지만 테스트를 위해 강제로 실행해보면 401 에러 발생
      res.status.mockClear();
      res.json.mockClear();

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다'
        }
      });
    });

    test('미들웨어 체인 실행 순서 검증', async () => {
      const executionOrder = [];

      req.headers.authorization = 'Bearer admin.token';
      verifyAccessToken.mockReturnValue({ userId: 'admin-user-id-456' });
      pool.query.mockResolvedValue({ rows: [adminUser] });

      // next 함수에 실행 순서 기록
      const authenticateNext = jest.fn(() => {
        executionOrder.push('authenticate-next');
      });
      const requireAdminNext = jest.fn(() => {
        executionOrder.push('requireAdmin-next');
      });

      // authenticate 실행
      await authenticate(req, res, authenticateNext);
      expect(executionOrder).toContain('authenticate-next');

      // requireAdmin 실행
      requireAdmin(req, res, requireAdminNext);
      expect(executionOrder).toContain('requireAdmin-next');

      // 순서 확인
      expect(executionOrder[0]).toBe('authenticate-next');
      expect(executionOrder[1]).toBe('requireAdmin-next');
    });
  });
});
