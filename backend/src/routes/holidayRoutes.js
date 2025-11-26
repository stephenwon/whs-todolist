const express = require('express');
const { body } = require('express-validator');
const { 
  getHolidays, 
  createHoliday, 
  updateHoliday 
} = require('../controllers/holidayController');
const { authenticate, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// 미들웨어 적용: 인증 필요
router.use(authenticate);

// 국경일 목록 조회
router.get('/', getHolidays);

// 국경일 추가 (관리자 전용)
router.post('/',
  requireAdmin,
  [
    body('title').trim().notEmpty().withMessage('국경일 이름은 필수입니다'),
    body('title').isLength({ max: 100 }).withMessage('국경일 이름은 100자 이하여야 합니다'),
    body('date').isISO8601().withMessage('날짜는 유효한 날짜 형식이어야 합니다'),
    body('description').optional().isString().withMessage('설명은 문자열이어야 합니다'),
    body('isRecurring').optional().isBoolean().withMessage('반복 여부는 true 또는 false이어야 합니다')
  ],
  createHoliday
);

// 국경일 수정 (관리자 전용)
router.put('/:id',
  requireAdmin,
  [
    body('title').optional().trim().isLength({ max: 100 }).withMessage('국경일 이름은 100자 이하여야 합니다'),
    body('date').optional().isISO8601().withMessage('날짜는 유효한 날짜 형식이어야 합니다'),
    body('description').optional().isString().withMessage('설명은 문자열이어야 합니다'),
    body('isRecurring').optional().isBoolean().withMessage('반복 여부는 true 또는 false이어야 합니다')
  ],
  updateHoliday
);

module.exports = router;