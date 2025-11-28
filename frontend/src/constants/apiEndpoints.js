/**
 * API 엔드포인트 상수 정의
 * 백엔드 API와 통신을 위한 모든 엔드포인트를 중앙에서 관리
 */

export const API_ENDPOINTS = {
  // 인증 관련 API
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  // 할일 관련 API
  TODOS: {
    BASE: '/todos',
    BY_ID: (id) => `/todos/${id}`,
    COMPLETE: (id) => `/todos/${id}/complete`,
    RESTORE: (id) => `/todos/${id}/restore`,
  },

  // 휴지통 관련 API
  TRASH: {
    BASE: '/trash',
    BY_ID: (id) => `/trash/${id}`,
  },

  // 국경일 관련 API
  HOLIDAYS: {
    BASE: '/holidays',
    BY_ID: (id) => `/holidays/${id}`,
  },

  // 사용자 관련 API
  USERS: {
    ME: '/users/me',
  },
};
