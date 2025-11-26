const { verifyAccessToken } = require('../utils/jwtHelper');
const { pool } = require('../config/database');

/**
 * JWT 토큰을 검증하고 사용자 정보를 req.user에 저장하는 미들웨어
 */
const authenticate = async (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다'
        }
      });
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    // 토큰 검증
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: '토큰이 만료되었습니다'
          }
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: '유효하지 않은 토큰입니다'
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '인증 토큰이 유효하지 않습니다'
          }
        });
      }
    }

    // 사용자 정보 DB에서 조회
    const { rows } = await pool.query(
      'SELECT user_id, email, username, role, created_at FROM users WHERE user_id = $1',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: '사용자 정보가 존재하지 않습니다'
        }
      });
    }

    const user = rows[0];
    req.user = {
      userId: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '인증 처리 중 오류가 발생했습니다'
      }
    });
  }
};

/**
 * 관리자 권한 확인 미들웨어
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '인증이 필요합니다'
      }
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'ADMIN_REQUIRED',
        message: '관리자 권한이 필요합니다'
      }
    });
  }

  next();
};

module.exports = {
  authenticate,
  requireAdmin
};