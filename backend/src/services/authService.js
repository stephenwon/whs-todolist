const { pool } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordHelper');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtHelper');

/**
 * 회원가입 서비스
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @param {string} username - 사용자 이름
 * @returns {Promise<Object>} 생성된 사용자 정보
 */
const register = async (email, password, username) => {
  // 이메일 중복 체크
  const existingUser = await pool.query(
    'SELECT email FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('이미 사용 중인 이메일입니다');
  }

  // 비밀번호 해싱
  const hashedPassword = await hashPassword(password);

  // 사용자 생성
  const result = await pool.query(
    `INSERT INTO users (email, password, username, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING user_id, email, username, role, created_at`,
    [email, hashedPassword, username, 'user']
  );

  const user = result.rows[0];
  return {
    userId: user.user_id,
    email: user.email,
    username: user.username,
    role: user.role
  };
};

/**
 * 로그인 서비스
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} 로그인 결과 (토큰 및 사용자 정보)
 */
const login = async (email, password) => {
  // 이메일로 사용자 조회
  const result = await pool.query(
    'SELECT user_id, email, password, username, role FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
  }

  const user = result.rows[0];

  // 비밀번호 검증
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다');
  }

  // 토큰 생성
  const accessToken = generateAccessToken({
    userId: user.user_id,
    email: user.email,
    role: user.role
  });
  
  const refreshToken = generateRefreshToken({
    userId: user.user_id,
    email: user.email
  });

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role
    }
  };
};

/**
 * 토큰 갱신 서비스
 * @param {string} refreshToken - 기존 리프레시 토큰
 * @returns {Promise<Object>} 새로운 액세스 토큰
 */
const refreshAccessToken = async (refreshToken) => {
  // 리프레시 토큰 검증을 위한 로직 (기본적으로 JWT 검증)
  let decoded;
  try {
    // 실제 구현에서는 리프레시 토큰을 DB에서 관리하거나 별도 검증 로직 필요
    // 여기서는 단순 JWT 검증으로 구현
    const { verifyRefreshToken } = require('../utils/jwtHelper');
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new Error('유효하지 않은 리프레시 토큰입니다');
  }

  // 사용자 존재 여부 확인
  const result = await pool.query(
    'SELECT user_id, email, role FROM users WHERE user_id = $1',
    [decoded.userId]
  );

  if (result.rows.length === 0) {
    throw new Error('사용자 정보가 존재하지 않습니다');
  }

  const user = result.rows[0];

  // 새로운 액세스 토큰 생성
  const newAccessToken = generateAccessToken({
    userId: user.user_id,
    email: user.email,
    role: user.role
  });

  return {
    accessToken: newAccessToken
  };
};

module.exports = {
  register,
  login,
  refreshAccessToken
};