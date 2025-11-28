const rateLimit = require('express-rate-limit');

// 환경 변수로 개발/프로덕션 환경 구분
const isDevelopment = process.env.NODE_ENV !== 'production';

// 일반 API 요청 제한
const generalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: isDevelopment ? 1000 : 100, // 개발: 1000회/분, 프로덕션: 100회/분
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: '요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.'
    }
  },
  standardHeaders: true, // `RateLimit-*` 헤더 반환
  legacyHeaders: false, // `X-RateLimit-*` 헤더 반환 비활성화
  skip: isDevelopment ? () => true : () => false, // 개발 환경에서는 비활성화
});

// 인증 관련 API 요청 제한
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: isDevelopment ? 100 : 5, // 개발: 100회/15분, 프로덕션: 5회/15분
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: isDevelopment ? () => true : () => false, // 개발 환경에서는 비활성화
});

module.exports = {
  generalRateLimit,
  authRateLimit
};