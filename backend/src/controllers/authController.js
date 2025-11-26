const { validationResult } = require('express-validator');
const authService = require('../services/authService');

/**
 * 회원가입 컨트롤러
 */
const register = async (req, res) => {
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

    const { email, password, username } = req.body;

    // 서비스 호출
    const user = await authService.register(email, password, username);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.message === '이미 사용 중인 이메일입니다') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: error.message
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '회원가입 처리 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 로그인 컨트롤러
 */
const login = async (req, res) => {
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

    const { email, password } = req.body;

    // 서비스 호출
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message || '이메일 또는 비밀번호가 올바르지 않습니다'
      }
    });
  }
};

/**
 * 토큰 갱신 컨트롤러
 */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '리프레시 토큰이 필요합니다'
        }
      });
    }

    // 서비스 호출
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message || '토큰 갱신에 실패했습니다'
      }
    });
  }
};

/**
 * 로그아웃 컨트롤러
 */
const logout = async (req, res) => {
  // 클라이언트에서 토큰을 삭제하도록 안내
  res.status(200).json({
    success: true,
    message: '로그아웃 되었습니다'
  });
};

module.exports = {
  register,
  login,
  refresh,
  logout
};