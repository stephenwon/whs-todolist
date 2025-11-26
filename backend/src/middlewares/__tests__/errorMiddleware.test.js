/**
 * 에러 핸들링 미들웨어 테스트
 * 목표: 80% 이상 커버리지 달성
 */
const errorHandler = require('../errorMiddleware');

describe('errorHandler 미들웨어', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let consoleErrorSpy;
  let originalEnv;

  beforeEach(() => {
    // 원본 환경 변수 백업
    originalEnv = process.env.NODE_ENV;

    // Express req, res, next 모킹
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();

    // console.error 스파이 설정
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // 환경 변수 복원
    process.env.NODE_ENV = originalEnv;

    // 모든 모킹 초기화
    jest.restoreAllMocks();
  });

  // ========================================
  // 1. 기본 에러 처리 테스트 (5개)
  // ========================================
  describe('기본 에러 처리', () => {
    test('일반 에러를 500 INTERNAL_ERROR로 처리해야 함', () => {
      const error = new Error('일반 에러');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 내부 오류가 발생했습니다'
        }
      });
    });

    test('응답 형식이 {success: false, error} 구조여야 함', () => {
      const error = new Error('테스트 에러');

      errorHandler(error, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('error');
      expect(response.error).toHaveProperty('code');
      expect(response.error).toHaveProperty('message');
    });

    test('console.error가 호출되어야 함', () => {
      const error = new Error('로깅 테스트');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error details:', error);
    });

    test('res.status().json() 체이닝이 올바르게 동작해야 함', () => {
      const error = new Error('체이닝 테스트');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
      // mockReturnThis()로 체이닝 구조 확인
      expect(mockRes.status).toHaveReturnedWith(mockRes);
    });

    test('에러 메시지가 없는 경우 기본 메시지를 사용해야 함', () => {
      const error = new Error();

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: '서버 내부 오류가 발생했습니다'
          })
        })
      );
    });
  });

  // ========================================
  // 2. 환경별 처리 테스트 (4개)
  // ========================================
  describe('환경별 스택 트레이스 처리', () => {
    test('개발 환경에서는 스택 트레이스를 포함해야 함', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('개발 환경 에러');

      errorHandler(error, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error).toHaveProperty('stack');
      expect(response.error.stack).toBe(error.stack);
    });

    test('프로덕션 환경에서는 스택 트레이스를 숨겨야 함', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('프로덕션 환경 에러');

      errorHandler(error, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error).not.toHaveProperty('stack');
    });

    test('NODE_ENV가 설정되지 않은 경우 스택 트레이스를 숨겨야 함', () => {
      delete process.env.NODE_ENV;
      const error = new Error('환경 미설정 에러');

      errorHandler(error, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error).not.toHaveProperty('stack');
    });

    test('test 환경에서는 스택 트레이스를 숨겨야 함', () => {
      process.env.NODE_ENV = 'test';
      const error = new Error('테스트 환경 에러');

      errorHandler(error, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error).not.toHaveProperty('stack');
    });
  });

  // ========================================
  // 3. 특정 에러 타입 테스트 (12개)
  // ========================================
  describe('ValidationError 처리', () => {
    test('ValidationError는 상태 코드 400을 반환해야 함', () => {
      const validationError = {
        name: 'ValidationError',
        errors: [
          { path: 'email', msg: '이메일 형식이 올바르지 않습니다', value: 'invalid' }
        ]
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('ValidationError는 VALIDATION_ERROR 코드를 반환해야 함', () => {
      const validationError = {
        name: 'ValidationError',
        errors: [
          { path: 'password', msg: '비밀번호는 8자 이상이어야 합니다', value: '123' }
        ]
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
            message: '요청 데이터가 유효하지 않습니다'
          })
        })
      );
    });

    test('ValidationError는 details 필드에 에러 정보를 포함해야 함', () => {
      const validationError = {
        name: 'ValidationError',
        errors: [
          { path: 'email', msg: '이메일 형식이 올바르지 않습니다', value: 'invalid' },
          { path: 'password', msg: '비밀번호는 8자 이상이어야 합니다', value: '123' }
        ]
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error.details).toEqual([
        { field: 'email', message: '이메일 형식이 올바르지 않습니다', value: 'invalid' },
        { field: 'password', message: '비밀번호는 8자 이상이어야 합니다', value: '123' }
      ]);
    });

    test('errors 배열만 있어도 ValidationError로 처리해야 함', () => {
      const validationError = {
        errors: [
          { path: 'username', msg: '사용자명은 필수입니다', value: '' }
        ]
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR'
          })
        })
      );
    });

    test('validation errors 배열이 빈 경우 details가 빈 배열이어야 함', () => {
      const validationError = {
        name: 'ValidationError',
        errors: []
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error.details).toEqual([]);
    });
  });

  describe('TokenExpiredError 처리', () => {
    test('TokenExpiredError는 상태 코드 401을 반환해야 함', () => {
      const tokenError = {
        name: 'TokenExpiredError',
        message: 'jwt expired'
      };

      errorHandler(tokenError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    test('TokenExpiredError는 TOKEN_EXPIRED 코드를 반환해야 함', () => {
      const tokenError = {
        name: 'TokenExpiredError',
        message: 'jwt expired'
      };

      errorHandler(tokenError, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: '토큰이 만료되었습니다'
        }
      });
    });
  });

  describe('JsonWebTokenError 처리', () => {
    test('JsonWebTokenError는 상태 코드 401을 반환해야 함', () => {
      const jwtError = {
        name: 'JsonWebTokenError',
        message: 'invalid token'
      };

      errorHandler(jwtError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    test('JsonWebTokenError는 INVALID_TOKEN 코드를 반환해야 함', () => {
      const jwtError = {
        name: 'JsonWebTokenError',
        message: 'invalid signature'
      };

      errorHandler(jwtError, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다'
        }
      });
    });
  });

  describe('커스텀 에러 처리', () => {
    test('err.status를 사용하여 상태 코드를 설정해야 함', () => {
      const customError = {
        status: 404,
        code: 'NOT_FOUND',
        message: '리소스를 찾을 수 없습니다'
      };

      errorHandler(customError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('err.statusCode를 사용하여 상태 코드를 설정해야 함', () => {
      const customError = {
        statusCode: 403,
        code: 'FORBIDDEN',
        message: '접근 권한이 없습니다'
      };

      errorHandler(customError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    test('err.code와 err.message를 사용해야 함', () => {
      const customError = {
        status: 409,
        code: 'CONFLICT',
        message: '이미 존재하는 데이터입니다'
      };

      errorHandler(customError, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'CONFLICT',
          message: '이미 존재하는 데이터입니다'
        }
      });
    });

    test('err.status가 err.statusCode보다 우선해야 함', () => {
      const customError = {
        status: 404,
        statusCode: 400,
        code: 'NOT_FOUND',
        message: '우선순위 테스트'
      };

      errorHandler(customError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('커스텀 코드가 있으면 기본 INTERNAL_ERROR를 덮어써야 함', () => {
      const customError = {
        status: 422,
        code: 'UNPROCESSABLE_ENTITY',
        message: '처리할 수 없는 요청입니다'
      };

      errorHandler(customError, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error.code).toBe('UNPROCESSABLE_ENTITY');
      expect(response.error.code).not.toBe('INTERNAL_ERROR');
    });
  });

  // ========================================
  // 4. 엣지 케이스 테스트 (4개)
  // ========================================
  describe('엣지 케이스 처리', () => {
    test('에러 객체가 빈 객체인 경우 기본 에러를 반환해야 함', () => {
      const emptyError = {};

      errorHandler(emptyError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 내부 오류가 발생했습니다'
        }
      });
    });

    test('여러 에러 속성이 동시에 존재하는 경우 우선순위대로 처리해야 함', () => {
      // ValidationError가 다른 속성보다 우선
      const complexError = {
        name: 'ValidationError',
        status: 500,
        code: 'CUSTOM_CODE',
        errors: [
          { path: 'test', msg: '테스트 에러', value: 'test' }
        ]
      };

      errorHandler(complexError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR'
          })
        })
      );
    });

    test('커스텀 에러에 메시지가 없으면 기본 메시지를 사용해야 함', () => {
      const errorWithoutMessage = {
        status: 400,
        code: 'BAD_REQUEST'
      };

      errorHandler(errorWithoutMessage, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: '서버 내부 오류가 발생했습니다'
        }
      });
    });

    test('ValidationError에 errors가 없으면 details가 undefined여야 함', () => {
      const validationErrorWithoutDetails = {
        name: 'ValidationError'
      };

      errorHandler(validationErrorWithoutDetails, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error.details).toBeUndefined();
    });
  });

  // ========================================
  // 5. 통합 테스트 (보너스)
  // ========================================
  describe('통합 시나리오', () => {
    test('개발 환경에서 ValidationError는 스택 트레이스를 포함하지 않아야 함', () => {
      // ValidationError는 자체 errorResponse를 생성하므로 스택이 포함되지 않음
      process.env.NODE_ENV = 'development';
      const validationError = {
        name: 'ValidationError',
        errors: [{ path: 'test', msg: '테스트', value: 'test' }],
        stack: 'ValidationError: test\n at ...'
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error).not.toHaveProperty('stack');
    });

    test('개발 환경에서 커스텀 에러는 스택 트레이스를 포함해야 함', () => {
      process.env.NODE_ENV = 'development';
      const customError = {
        status: 404,
        code: 'NOT_FOUND',
        message: '리소스를 찾을 수 없습니다',
        stack: 'Error: NOT_FOUND\n at ...'
      };

      errorHandler(customError, mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.error).toHaveProperty('stack');
    });

    test('여러 번 호출되어도 독립적으로 동작해야 함', () => {
      const error1 = { status: 400, code: 'BAD_REQUEST', message: '첫 번째 에러' };
      const error2 = { status: 404, code: 'NOT_FOUND', message: '두 번째 에러' };

      errorHandler(error1, mockReq, mockRes, mockNext);

      // 새로운 res 객체 생성
      const mockRes2 = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };

      errorHandler(error2, mockReq, mockRes2, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes2.status).toHaveBeenCalledWith(404);
    });
  });
});
