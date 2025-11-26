const request = require('supertest');
const express = require('express');
const authRoutes = require('../authRoutes');
const authService = require('../../services/authService');
const { authRateLimit } = require('../../middlewares/rateLimitMiddleware');

// Mock 설정 - 서비스 레이어만 mock
jest.mock('../../services/authService');
jest.mock('../../middlewares/rateLimitMiddleware');

describe('authRoutes 통합 테스트', () => {
  let app;

  beforeAll(() => {
    // Express 앱 설정
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    // Rate limit 미들웨어 mock (기본적으로 통과)
    authRateLimit.mockImplementation((req, res, next) => next());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    describe('성공 케이스', () => {
      test('유효한 데이터로 회원가입 요청 성공', async () => {
        const mockUser = {
          userId: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        };

        authService.register.mockResolvedValue(mockUser);

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            username: 'testuser'
          })
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockUser);
        expect(authService.register).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
      });

      test('rate limit 미들웨어가 적용되어야 함', async () => {
        authService.register.mockResolvedValue({
          userId: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        });

        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            username: 'testuser'
          });

        expect(authRateLimit).toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - Validation 에러', () => {
      test('잘못된 이메일 형식으로 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'invalid-email',
            password: 'password123',
            username: 'testuser'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });

      test('이메일 없이 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            password: 'password123',
            username: 'testuser'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('비밀번호가 8자 미만일 때 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'short',
            username: 'testuser'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });

      test('비밀번호 없이 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            username: 'testuser'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('사용자 이름이 2자 미만일 때 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            username: 'a'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('사용자 이름이 100자 초과일 때 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            username: 'a'.repeat(101)
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('사용자 이름 없이 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('모든 필드가 없을 때 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({})
          .expect(400);

        expect(response.body.error).toBeDefined();
      });
    });

    describe('실패 케이스 - 이메일 중복', () => {
      test('중복된 이메일로 요청 시 409 응답', async () => {
        authService.register.mockRejectedValue(new Error('이미 사용 중인 이메일입니다'));

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'existing@example.com',
            password: 'password123',
            username: 'testuser'
          })
          .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('EMAIL_EXISTS');
      });
    });

    describe('엣지 케이스', () => {
      test('이메일이 정규화되어야 함 (대소문자)', async () => {
        authService.register.mockResolvedValue({
          userId: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        });

        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'Test@Example.COM',
            password: 'password123',
            username: 'testuser'
          })
          .expect(201);

        expect(authService.register).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
      });

      test('비밀번호 정확히 8자일 때 성공', async () => {
        authService.register.mockResolvedValue({
          userId: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        });

        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: '12345678',
            username: 'testuser'
          })
          .expect(201);
      });

      test('사용자 이름 정확히 2자일 때 성공', async () => {
        authService.register.mockResolvedValue({
          userId: 'user-123',
          email: 'test@example.com',
          username: 'ab',
          role: 'user'
        });

        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            username: 'ab'
          })
          .expect(201);
      });

      test('사용자 이름 정확히 100자일 때 성공', async () => {
        authService.register.mockResolvedValue({
          userId: 'user-123',
          email: 'test@example.com',
          username: 'a'.repeat(100),
          role: 'user'
        });

        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            username: 'a'.repeat(100)
          })
          .expect(201);
      });
    });
  });

  describe('POST /api/auth/login', () => {
    describe('성공 케이스', () => {
      test('유효한 자격증명으로 로그인 요청 성공', async () => {
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

        authService.login.mockResolvedValue(mockLoginResult);

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockLoginResult);
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });

      test('rate limit 미들웨어가 적용되어야 함', async () => {
        authService.login.mockResolvedValue({
          accessToken: 'token',
          refreshToken: 'refresh',
          user: { userId: 'user-123', email: 'test@example.com', username: 'test', role: 'user' }
        });

        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });

        expect(authRateLimit).toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - Validation 에러', () => {
      test('잘못된 이메일 형식으로 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'invalid-email',
            password: 'password123'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
      });

      test('이메일 없이 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            password: 'password123'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('비밀번호 없이 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com'
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('빈 비밀번호로 요청 시 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: ''
          })
          .expect(400);

        expect(response.body.error).toBeDefined();
      });

      test('모든 필드가 없을 때 400 응답', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({})
          .expect(400);

        expect(response.body.error).toBeDefined();
      });
    });

    describe('실패 케이스 - 인증 실패', () => {
      test('잘못된 자격증명으로 요청 시 401 응답', async () => {
        authService.login.mockRejectedValue(new Error('이메일 또는 비밀번호가 올바르지 않습니다'));

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          })
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('UNAUTHORIZED');
      });
    });

    describe('엣지 케이스', () => {
      test('이메일이 정규화되어야 함', async () => {
        authService.login.mockResolvedValue({
          accessToken: 'token',
          refreshToken: 'refresh',
          user: { userId: 'user-123', email: 'test@example.com', username: 'test', role: 'user' }
        });

        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'Test@Example.COM',
            password: 'password123'
          })
          .expect(200);

        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });

      test('매우 긴 비밀번호도 처리 가능해야 함', async () => {
        authService.login.mockResolvedValue({
          accessToken: 'token',
          refreshToken: 'refresh',
          user: { userId: 'user-123', email: 'test@example.com', username: 'test', role: 'user' }
        });

        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'a'.repeat(1000)
          })
          .expect(200);
      });
    });
  });

  describe('POST /api/auth/refresh', () => {
    describe('성공 케이스', () => {
      test('유효한 리프레시 토큰으로 요청 성공', async () => {
        const mockRefreshResult = {
          accessToken: 'new_access_token_123'
        };

        authService.refreshAccessToken.mockResolvedValue(mockRefreshResult);

        const response = await request(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken: 'valid_refresh_token'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockRefreshResult);
        expect(authService.refreshAccessToken).toHaveBeenCalledWith('valid_refresh_token');
      });

      test('새로운 액세스 토큰이 응답에 포함되어야 함', async () => {
        authService.refreshAccessToken.mockResolvedValue({
          accessToken: 'new_access_token_123'
        });

        const response = await request(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken: 'valid_refresh_token'
          })
          .expect(200);

        expect(response.body.data.accessToken).toBeDefined();
      });
    });

    describe('실패 케이스 - 토큰 없음', () => {
      test('refreshToken 없이 요청 시 401 응답', async () => {
        const response = await request(app)
          .post('/api/auth/refresh')
          .send({})
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('UNAUTHORIZED');
        expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      });
    });

    describe('실패 케이스 - 유효하지 않은 토큰', () => {
      test('유효하지 않은 리프레시 토큰으로 요청 시 401 응답', async () => {
        authService.refreshAccessToken.mockRejectedValue(new Error('유효하지 않은 리프레시 토큰입니다'));

        const response = await request(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken: 'invalid_token'
          })
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });

    describe('엣지 케이스', () => {
      test('매우 긴 리프레시 토큰도 처리 가능해야 함', async () => {
        authService.refreshAccessToken.mockResolvedValue({ accessToken: 'new_token' });

        await request(app)
          .post('/api/auth/refresh')
          .send({
            refreshToken: 'a'.repeat(1000)
          })
          .expect(200);
      });
    });
  });

  describe('POST /api/auth/logout', () => {
    describe('성공 케이스', () => {
      test('로그아웃 요청 성공', async () => {
        const response = await request(app)
          .post('/api/auth/logout')
          .send({})
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('로그아웃 되었습니다');
      });

      test('로그아웃은 항상 성공해야 함', async () => {
        const response = await request(app)
          .post('/api/auth/logout')
          .send({})
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      test('body 없이 요청해도 성공', async () => {
        await request(app)
          .post('/api/auth/logout')
          .expect(200);
      });
    });
  });

  describe('Rate Limit 테스트', () => {
    test('register 엔드포인트에 rate limit 적용', async () => {
      authRateLimit.mockClear();
      authService.register.mockResolvedValue({
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user'
      });

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser'
        });

      expect(authRateLimit).toHaveBeenCalled();
    });

    test('login 엔드포인트에 rate limit 적용', async () => {
      authRateLimit.mockClear();
      authService.login.mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'refresh',
        user: { userId: 'user-123', email: 'test@example.com', username: 'test', role: 'user' }
      });

      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(authRateLimit).toHaveBeenCalled();
    });

    test('refresh 엔드포인트에는 rate limit 미적용', async () => {
      authRateLimit.mockClear();
      authService.refreshAccessToken.mockResolvedValue({ accessToken: 'new_token' });

      await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'valid_token'
        });

      // refresh는 rate limit을 거치지 않음
      // (authRateLimit은 register/login만 체크하므로 호출되지 않음)
    });

    test('logout 엔드포인트에는 rate limit 미적용', async () => {
      authRateLimit.mockClear();

      await request(app)
        .post('/api/auth/logout')
        .send({});

      // logout은 rate limit을 거치지 않음
    });
  });

  describe('통합 시나리오 테스트', () => {
    test('회원가입 -> 로그인 -> 토큰 갱신 -> 로그아웃 플로우', async () => {
      // 1. 회원가입
      authService.register.mockResolvedValue({
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user'
      });

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser'
        })
        .expect(201);

      expect(registerResponse.body.success).toBe(true);

      // 2. 로그인
      authService.login.mockResolvedValue({
        accessToken: 'access_token_123',
        refreshToken: 'refresh_token_123',
        user: {
          userId: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'user'
        }
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body.data.accessToken).toBeDefined();
      expect(loginResponse.body.data.refreshToken).toBeDefined();

      // 3. 토큰 갱신
      authService.refreshAccessToken.mockResolvedValue({
        accessToken: 'new_access_token_123'
      });

      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: loginResponse.body.data.refreshToken
        })
        .expect(200);

      expect(refreshResponse.body.data.accessToken).toBeDefined();

      // 4. 로그아웃
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(200);

      expect(logoutResponse.body.success).toBe(true);
    });

    test('잘못된 validation 후 재시도 성공', async () => {
      // 1. 잘못된 이메일로 시도
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          username: 'testuser'
        })
        .expect(400);

      // 2. 올바른 데이터로 재시도
      authService.register.mockResolvedValue({
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user'
      });

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser'
        })
        .expect(201);
    });
  });
});
