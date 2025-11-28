/**
 * 인증 상태 관리 스토어 (Zustand)
 * 사용자 인증, 로그인, 회원가입, 로그아웃 등 인증 관련 전역 상태 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as authService from '../services/authService';
import * as tokenManager from '../utils/tokenManager';

const useAuthStore = create(
  devtools(
    (set, get) => ({
      // State
      user: null, // 현재 로그인한 사용자 정보
      isAuthenticated: false, // 인증 상태
      isLoading: false, // 로딩 상태
      error: null, // 에러 메시지

      // Actions

      /**
       * 로그인 처리
       * @param {string} email - 이메일
       * @param {string} password - 비밀번호
       * @returns {Promise<boolean>} 성공 여부
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(email, password);
          const { user, accessToken, refreshToken } = response;

          // 토큰 저장
          tokenManager.setTokens(accessToken, refreshToken);

          // 사용자 정보 저장
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.response?.data?.message || '로그인에 실패했습니다.',
          });

          return false;
        }
      },

      /**
       * 회원가입 처리
       * @param {string} email - 이메일
       * @param {string} password - 비밀번호
       * @param {string} username - 사용자 이름
       * @returns {Promise<boolean>} 성공 여부
       */
      register: async (email, password, username) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(email, password, username);
          const { user, accessToken, refreshToken } = response;

          // 토큰 저장
          tokenManager.setTokens(accessToken, refreshToken);

          // 사용자 정보 저장
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.response?.data?.message || '회원가입에 실패했습니다.',
          });

          return false;
        }
      },

      /**
       * 로그아웃 처리
       */
      logout: async () => {
        set({ isLoading: true, error: null });

        try {
          await authService.logout();
        } catch (error) {
          console.error('로그아웃 API 호출 실패:', error);
        } finally {
          // API 호출 성공 여부와 관계없이 로컬 상태 초기화
          tokenManager.clearTokens();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      /**
       * 토큰 갱신
       * @returns {Promise<boolean>} 성공 여부
       */
      refreshToken: async () => {
        const refreshToken = tokenManager.getRefreshToken();

        if (!refreshToken) {
          set({
            user: null,
            isAuthenticated: false,
            error: '토큰이 없습니다.',
          });
          return false;
        }

        try {
          const response = await authService.refreshToken(refreshToken);
          const { accessToken } = response;

          // 새로운 Access Token 저장
          tokenManager.setAccessToken(accessToken);

          return true;
        } catch (error) {
          // 토큰 갱신 실패 시 로그아웃 처리
          tokenManager.clearTokens();

          set({
            user: null,
            isAuthenticated: false,
            error: '토큰 갱신에 실패했습니다.',
          });

          return false;
        }
      },

      /**
       * 초기 인증 상태 확인
       * 페이지 로드 시 토큰이 있으면 사용자 정보를 가져옴
       * @returns {Promise<boolean>} 인증 상태
       */
      checkAuth: async () => {
        const hasToken = tokenManager.hasToken();

        if (!hasToken) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          // userService를 사용하여 현재 사용자 정보 조회
          // userService는 Task 3.6에서 작성될 예정이므로 import는 나중에 추가
          const { default: apiClient } = await import('../services/api');
          const response = await apiClient.get('/users/me');
          const user = response.data.data;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          // 인증 실패 시 토큰 삭제
          tokenManager.clearTokens();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          return false;
        }
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

export { useAuthStore };
export default useAuthStore;
