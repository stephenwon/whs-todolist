const jwt = require('jsonwebtoken');

/**
 * Access Token 생성
 * @param {Object} payload - 토큰에 포함할 데이터 (주의: 비밀번호 등 민감한 정보는 포함하지 말 것)
 * @returns {string} JWT Access Token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION
  });
}

/**
 * Refresh Token 생성
 * @param {Object} payload - 토큰에 포함할 데이터 (주의: 비밀번호 등 민감한 정보는 포함하지 말 것)
 * @returns {string} JWT Refresh Token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION
  });
}

/**
 * Access Token 검증
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Object} 디코딩된 payload
 * @throws {TokenExpiredError} 토큰 만료 시
 * @throws {JsonWebTokenError} 유효하지 않은 토큰 시
 */
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * Refresh Token 검증
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Object} 디코딩된 payload
 * @throws {TokenExpiredError} 토큰 만료 시
 * @throws {JsonWebTokenError} 유효하지 않은 토큰 시
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
