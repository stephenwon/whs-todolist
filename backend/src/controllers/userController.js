const { validationResult } = require('express-validator');
const userService = require('../services/userService');

/**
 * 현재 사용자 프로필 조회 컨트롤러
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await userService.getProfile(userId);

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    if (error.message === '사용자를 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '프로필 조회 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 현재 사용자 프로필 수정 컨트롤러
 */
const updateProfile = async (req, res) => {
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
    const { username, password } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = password;

    const updatedUser = await userService.updateProfile(userId, updateData);

    res.status(200).json({
      success: true,
      data: {
        userId: updatedUser.user_id,
        username: updatedUser.username
      }
    });
  } catch (error) {
    if (error.message === '사용자를 찾을 수 없습니다') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: error.message
        }
      });
    }
    
    if (error.message === '이미 사용 중인 사용자 이름입니다') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '프로필 수정 중 오류가 발생했습니다'
      }
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};