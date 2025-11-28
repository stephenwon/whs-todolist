/**
 * Axios 인스턴스 설정
 * 모든 API 요청에 대한 공통 설정 및 인터셉터 구현
 */

import axios from 'axios';

// 환경 변수에서 API Base URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: Authorization 헤더 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    // LocalStorage에서 Access Token 가져오기
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 시도
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized 에러이고, 토큰 갱신을 시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 Access Token 갱신
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // Refresh Token이 없으면 로그인 페이지로 이동
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newAccessToken } = response.data.data;

        // 새로운 Access Token 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 원래 요청에 새로운 토큰 적용
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 이동
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 다른 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default apiClient;
