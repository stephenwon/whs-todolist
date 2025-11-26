const { validationResult } = require('express-validator');
const todoService = require('../services/todoService');

/**
 * 할일 목록 조회 컨트롤러
 */
const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // 쿼리 파라미터 추출
    const { status, search, sortBy, order } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;
    if (order) filters.order = order;

    const todos = await todoService.getTodos(userId, filters);

    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 목록 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 할일 상세 조회 컨트롤러
 */
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.getTodoById(id, userId);

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 할일 생성 컨트롤러
 */
const createTodo = async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '요청 데이터가 유효하지 않습니다',
          details: errors.array()
        }
      });
    }

    const userId = req.user.userId;
    const { title, content, startDate, dueDate } = req.body;

    const todoData = {
      title,
      content,
      startDate,
      dueDate
    };

    const todo = await todoService.createTodo(userId, todoData);

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.message === '제목은 필수입니다') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TITLE_REQUIRED',
          message: error.message
        }
      });
    }
    
    if (error.message === '만료일은 시작일 이후여야 합니다') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 생성 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 할일 수정 컨트롤러
 */
const updateTodo = async (req, res) => {
  try {
    // 유효성 검사
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '요청 데이터가 유효하지 않습니다',
          details: errors.array()
        }
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const { title, content, startDate, dueDate } = req.body;

    const updateData = {
      title,
      content,
      startDate,
      dueDate
    };

    const todo = await todoService.updateTodo(id, userId, updateData);

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 권한이 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }
    
    if (error.message === '만료일은 시작일 이후여야 합니다') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATE_RANGE',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 수정 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 할일 완료 처리 컨트롤러
 */
const completeTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.completeTodo(id, userId);

    res.status(200).json({
      success: true,
      data: {
        todoId: todo.todo_id,
        status: todo.status,
        isCompleted: todo.is_completed
      }
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 이미 삭제된 할일입니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 완료 처리 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 할일 삭제 (휴지통 이동) 컨트롤러
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.deleteTodo(id, userId);

    res.status(200).json({
      success: true,
      message: '할일이 휴지통으로 이동되었습니다',
      data: {
        todoId: todo.todo_id,
        status: todo.status,
        deletedAt: todo.deleted_at
      }
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 이미 삭제된 할일입니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 삭제 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 할일 복원 컨트롤러
 */
const restoreTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const todo = await todoService.restoreTodo(id, userId);

    res.status(200).json({
      success: true,
      message: '할일이 복원되었습니다',
      data: {
        todoId: todo.todo_id,
        status: todo.status,
        deletedAt: todo.deleted_at
      }
    });
  } catch (error) {
    if (error.message === '할일을 찾을 수 없거나 복원할 수 없는 상태입니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TODO_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '할일 복원 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  restoreTodo
};