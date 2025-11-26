const express = require('express');
const { body } = require('express-validator');
const { 
  register, 
  login, 
  refresh, 
  logout 
} = require('../controllers/authController');
const { authRateLimit } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// 회원가입
router.post('/register', 
  authRateLimit,
  [
    body('email').isEmail().normalizeEmail().withMessage('유효한 이메일 주소를 입력해주세요'),
    body('password').isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다'),
    body('username').isLength({ min: 2, max: 100 }).withMessage('사용자 이름은 2자 이상 100자 이하여야 합니다')
  ],
  register
);

// 로그인
router.post('/login',
  authRateLimit,
  [
    body('email').isEmail().normalizeEmail().withMessage('유효한 이메일 주소를 입력해주세요'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요')
  ],
  login
);

// 토큰 갱신
router.post('/refresh', refresh);

// 로그아웃
router.post('/logout', logout);

module.exports = router;