/**
 * 토큰 관리 유틸리티
 * LocalStorage를 사용한 JWT 토큰 저장/조회/삭제
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

/**
 * Access Token 가져오기
 * @returns {string|null} Access Token 또는 null
 */
export const getAccessToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Access Token 조회 오류:', error);
    return null;
  }
};

/**
 * Access Token 저장
 * @param {string} token - Access Token
 */
export const setAccessToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    }
  } catch (error) {
    console.error('Access Token 저장 오류:', error);
  }
};

/**
 * Refresh Token 가져오기
 * @returns {string|null} Refresh Token 또는 null
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Refresh Token 조회 오류:', error);
    return null;
  }
};

/**
 * Refresh Token 저장
 * @param {string} token - Refresh Token
 */
export const setRefreshToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
    }
  } catch (error) {
    console.error('Refresh Token 저장 오류:', error);
  }
};

/**
 * 모든 토큰 삭제 (로그아웃 시 사용)
 */
export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('토큰 삭제 오류:', error);
  }
};

/**
 * 토큰 존재 여부 확인
 * @returns {boolean} Access Token이 존재하면 true
 */
export const hasToken = () => {
  return !!getAccessToken();
};

/**
 * 토큰 유효성 간단 체크 (만료 시간 확인하지 않음)
 * @returns {boolean} 토큰이 유효한 형식이면 true
 */
export const isTokenValid = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    // JWT 형식 확인 (header.payload.signature)
    const parts = token.split('.');
    return parts.length === 3;
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return false;
  }
};

/**
 * Access Token과 Refresh Token을 함께 저장
 * @param {string} accessToken - Access Token
 * @param {string} refreshToken - Refresh Token
 */
export const setTokens = (accessToken, refreshToken) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};
