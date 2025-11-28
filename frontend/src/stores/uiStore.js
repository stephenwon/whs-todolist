/**
 * UI 상태 관리 스토어 (Zustand)
 * 모달, 다크모드 등 UI 관련 전역 상태 관리
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useUIStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        isModalOpen: false, // 모달 열림 상태
        modalType: null, // 모달 타입 (create, edit, delete, etc.)
        selectedTodo: null, // 선택된 할일 (모달에서 사용)
        isDarkMode: false, // 다크모드 활성화 여부

        // Actions

        /**
         * 모달 열기
         * @param {string} type - 모달 타입 (create, edit, delete, view)
         * @param {Object} [todo] - 선택된 할일 (edit, delete, view 시 필요)
         */
        openModal: (type, todo = null) => {
          set({
            isModalOpen: true,
            modalType: type,
            selectedTodo: todo,
          });
        },

        /**
         * 모달 닫기
         */
        closeModal: () => {
          set({
            isModalOpen: false,
            modalType: null,
            selectedTodo: null,
          });
        },

        /**
         * 다크모드 토글
         */
        toggleDarkMode: () => {
          const newDarkMode = !get().isDarkMode;
          set({ isDarkMode: newDarkMode });

          // 다크모드 클래스를 HTML 요소에 추가/제거
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        },

        /**
         * 다크모드 설정
         * @param {boolean} isDark - 다크모드 활성화 여부
         */
        setDarkMode: (isDark) => {
          set({ isDarkMode: isDark });

          // 다크모드 클래스를 HTML 요소에 추가/제거
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        },
      }),
      {
        name: 'ui-store', // LocalStorage 키 이름
        partialize: (state) => ({
          isDarkMode: state.isDarkMode, // 다크모드 설정만 저장
        }),
        onRehydrateStorage: () => (state) => {
          // Zustand persist hydration 완료 후 DOM에 다크모드 클래스 적용
          if (state?.isDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        },
      }
    ),
    {
      name: 'ui-store',
    }
  )
);

export { useUIStore };
export default useUIStore;
