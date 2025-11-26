const express = require('express');
const { 
  getTrash, 
  permanentlyDelete 
} = require('../controllers/trashController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// 미들웨어 적용: 인증 필요
router.use(authenticate);

// 휴지통 조회
router.get('/', getTrash);

// 영구 삭제
router.delete('/:id', permanentlyDelete);

module.exports = router;