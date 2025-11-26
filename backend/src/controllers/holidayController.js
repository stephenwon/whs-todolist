const { validationResult } = require('express-validator');
const holidayService = require('../services/holidayService');

/**
 * 국경일 목록 조회 컨트롤러
 */
const getHolidays = async (req, res) => {
  try {
    // 쿼리 파라미터 추출
    let { year, month } = req.query;
    
    // 기본값 설정: 현재 연도
    if (!year) {
      year = new Date().getFullYear();
    } else {
      year = parseInt(year);
    }
    
    if (month) {
      month = parseInt(month);
      // 월이 유효한 범위인지 확인
      if (month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'BAD_REQUEST',
            message: '월은 1에서 12 사이의 값이어야 합니다'
          }
        });
      }
    }

    const holidays = await holidayService.getHolidays(year, month);

    res.status(200).json({
      success: true,
      data: holidays
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '국경일 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 국경일 추가 컨트롤러 (관리자 전용)
 */
const createHoliday = async (req, res) => {
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

    // 관리자 권한 확인은 미들웨어에서 처리
    const { title, date, description, isRecurring } = req.body;

    const holidayData = {
      title,
      date,
      description: description || null,
      isRecurring: isRecurring !== undefined ? isRecurring : true
    };

    const holiday = await holidayService.createHoliday(holidayData);

    res.status(201).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '국경일 추가 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 국경일 수정 컨트롤러 (관리자 전용)
 */
const updateHoliday = async (req, res) => {
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
    const { title, date, description, isRecurring } = req.body;

    const updateData = {
      title,
      date,
      description,
      isRecurring
    };

    const holiday = await holidayService.updateHoliday(id, updateData);

    res.status(200).json({
      success: true,
      data: holiday
    });
  } catch (error) {
    if (error.message === '국경일을 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '국경일 수정 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday
};