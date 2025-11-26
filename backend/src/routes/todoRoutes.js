const express = require('express');
const { body } = require('express-validator');
const { 
  getTodos, 
  getTodoById, 
  createTodo, 
  updateTodo, 
  completeTodo, 
  deleteTodo, 
  restoreTodo 
} = require('../controllers/todoController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// 미들웨어 적용: 인증 필요
router.use(authenticate);

// 할일 목록 조회
router.get('/', getTodos);

// 할일 생성
router.post('/',
  [
    body('title').trim().notEmpty().withMessage('제목은 필수입니다'),
    body('title').isLength({ max: 200 }).withMessage('제목은 200자 이하여야 합니다'),
    body('content').optional().isString().withMessage('내용은 문자열이어야 합니다'),
    body('startDate').optional().isISO8601().withMessage('시작일은 유효한 날짜 형식이어야 합니다'),
    body('dueDate').optional().isISO8601().withMessage('만료일은 유효한 날짜 형식이어야 합니다')
  ],
  createTodo
);

// 특정 할일 조회
router.get('/:id', getTodoById);

// 할일 수정
router.put('/:id',
  [
    body('title').optional().trim().isLength({ max: 200 }).withMessage('제목은 200자 이하여야 합니다'),
    body('content').optional().isString().withMessage('내용은 문자열이어야 합니다'),
    body('startDate').optional().isISO8601().withMessage('시작일은 유효한 날짜 형식이어야 합니다'),
    body('dueDate').optional().isISO8601().withMessage('만료일은 유효한 날짜 형식이어야 합니다')
  ],
  updateTodo
);

// 할일 완료
router.patch('/:id/complete', completeTodo);

// 할일 삭제 (휴지통 이동)
router.delete('/:id', deleteTodo);

// 할일 복원
router.patch('/:id/restore', restoreTodo);

module.exports = router;