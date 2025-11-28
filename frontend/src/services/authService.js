/**
 * 인증 관련 API 서비스
 * 로그인, 회원가입, 토큰 갱신, 로그아웃 등 인증 관련 API 호출
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 로그인
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
 */
export const login = async (email, password) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });

  return response.data.data;
};

/**
 * 회원가입
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @param {string} username - 사용자 이름
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
 */
export const register = async (email, password, username) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
    email,
    password,
    username,
  });

  return response.data.data;
};

/**
 * 토큰 갱신
 * @param {string} refreshToken - Refresh Token
 * @returns {Promise<{accessToken: string}>}
 */
export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
    refreshToken,
  });

  return response.data.data;
};

/**
 * 로그아웃
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};
