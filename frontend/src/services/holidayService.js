/**
 * 국경일 관련 API 서비스
 * 국경일 조회 등 국경일 관련 API 호출
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 국경일 목록 조회
 * @param {number} year - 연도 (예: 2025)
 * @param {number} month - 월 (1-12)
 * @returns {Promise<Array>} 국경일 목록
 */
export const getHolidays = async (year, month) => {
  const params = new URLSearchParams();

  if (year) {
    params.append('year', year);
  }

  if (month) {
    params.append('month', month);
  }

  const response = await apiClient.get(
    `${API_ENDPOINTS.HOLIDAYS.BASE}?${params.toString()}`
  );

  return response.data.data;
};
