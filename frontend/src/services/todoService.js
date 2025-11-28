/**
 * 할일 관련 API 서비스
 * 할일 조회, 생성, 수정, 삭제, 복원 등 할일 관련 API 호출
 */

import apiClient from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * 할일 목록 조회
 * @param {Object} filters - 필터 옵션
 * @param {string} [filters.status] - 상태 (pending, completed, deleted)
 * @param {string} [filters.search] - 검색어
 * @param {string} [filters.startDate] - 시작일 (YYYY-MM-DD)
 * @param {string} [filters.endDate] - 종료일 (YYYY-MM-DD)
 * @param {string} [filters.sortBy] - 정렬 기준 (createdAt, dueDate)
 * @param {string} [filters.order] - 정렬 순서 (asc, desc)
 * @returns {Promise<Array>} 할일 목록
 */
export const getTodos = async (filters = {}) => {
  const params = new URLSearchParams();

  // 필터 옵션을 쿼리 파라미터로 변환
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await apiClient.get(
    `${API_ENDPOINTS.TODOS.BASE}?${params.toString()}`
  );

  return response.data.data;
};

/**
 * 할일 상세 조회
 * @param {string} id - 할일 ID
 * @returns {Promise<Object>} 할일 정보
 */
export const getTodoById = async (id) => {
  const response = await apiClient.get(API_ENDPOINTS.TODOS.BY_ID(id));

  return response.data.data;
};

/**
 * 할일 생성
 * @param {Object} todoData - 할일 데이터
 * @param {string} todoData.title - 제목
 * @param {string} [todoData.description] - 설명
 * @param {string} [todoData.dueDate] - 마감일 (YYYY-MM-DD)
 * @returns {Promise<Object>} 생성된 할일
 */
export const createTodo = async (todoData) => {
  const response = await apiClient.post(API_ENDPOINTS.TODOS.BASE, todoData);

  return response.data.data;
};

/**
 * 할일 수정
 * @param {string} id - 할일 ID
 * @param {Object} updateData - 수정할 데이터
 * @param {string} [updateData.title] - 제목
 * @param {string} [updateData.description] - 설명
 * @param {string} [updateData.dueDate] - 마감일 (YYYY-MM-DD)
 * @returns {Promise<Object>} 수정된 할일
 */
export const updateTodo = async (id, updateData) => {
  const response = await apiClient.put(API_ENDPOINTS.TODOS.BY_ID(id), updateData);

  return response.data.data;
};

/**
 * 할일 완료 처리
 * @param {string} id - 할일 ID
 * @returns {Promise<Object>} 완료 처리된 할일
 */
export const completeTodo = async (id) => {
  const response = await apiClient.patch(API_ENDPOINTS.TODOS.COMPLETE(id));

  return response.data.data;
};

/**
 * 할일 삭제 (휴지통으로 이동)
 * @param {string} id - 할일 ID
 * @returns {Promise<Object>} 삭제된 할일
 */
export const deleteTodo = async (id) => {
  const response = await apiClient.delete(API_ENDPOINTS.TODOS.BY_ID(id));

  return response.data.data;
};

/**
 * 할일 복원 (휴지통에서 복원)
 * @param {string} id - 할일 ID
 * @returns {Promise<Object>} 복원된 할일
 */
export const restoreTodo = async (id) => {
  const response = await apiClient.patch(API_ENDPOINTS.TODOS.RESTORE(id));

  return response.data.data;
};
