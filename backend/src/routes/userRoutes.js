const express = require('express');
const { body } = require('express-validator');
const { 
  getProfile, 
  updateProfile 
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// 미들웨어 적용: 인증 필요
router.use(authenticate);

// 현재 사용자 프로필 조회
router.get('/me', getProfile);

// 현재 사용자 프로필 수정
router.patch('/me',
  [
    body('username').optional().trim().isLength({ min: 2, max: 100 }).withMessage('사용자 이름은 2자 이상 100자 이하여야 합니다'),
    body('password').optional().isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다')
  ],
  updateProfile
);

module.exports = router;