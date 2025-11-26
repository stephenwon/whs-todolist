/**
 * 에러 핸들링 미들웨어
 * 통일된 형식으로 에러 응답을 반환합니다
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error details:', err);

  // 상태 코드 기본값 설정
  let statusCode = 500;
  let errorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다'
    }
  };

  // 개발 환경에서는 스택 정보 추가
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // 특정 에러 타입에 따라 상태 코드 및 메시지 설정
  if (err.status || err.statusCode) {
    statusCode = err.status || err.statusCode;
  }

  // Express-validator 에러 처리
  if (err.name === 'ValidationError' || (err.errors && Array.isArray(err.errors))) {
    statusCode = 400;
    errorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '요청 데이터가 유효하지 않습니다',
        details: err.errors ? err.errors.map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        })) : undefined
      }
    };
  } 
  // JWT 관련 에러
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorResponse = {
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: '토큰이 만료되었습니다'
      }
    };
  } 
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorResponse = {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '유효하지 않은 토큰입니다'
      }
    };
  }
  // 커스텀 에러 처리
  else if (err.code) {
    errorResponse.error.code = err.code;
    errorResponse.error.message = err.message || errorResponse.error.message;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;