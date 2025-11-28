/**
 * 사용자 관련 API 서비스
 * 프로필 조회, 수정 등 사용자 관련 API 호출
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 현재 로그인한 사용자 프로필 조회
 * @returns {Promise<Object>} 사용자 정보
 */
export const getProfile = async () => {
  const response = await apiClient.get(API_ENDPOINTS.USERS.ME);

  return response.data.data;
};

/**
 * 사용자 프로필 수정
 * @param {Object} updateData - 수정할 데이터
 * @param {string} [updateData.username] - 사용자 이름
 * @param {string} [updateData.email] - 이메일
 * @returns {Promise<Object>} 수정된 사용자 정보
 */
export const updateProfile = async (updateData) => {
  const response = await apiClient.put(API_ENDPOINTS.USERS.ME, updateData);

  return response.data.data;
};
