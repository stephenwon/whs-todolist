/**
 * 국경일 상태 관리 스토어 (Zustand)
 * 국경일 목록 조회 및 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as holidayService from '../services/holidayService';

const useHolidayStore = create(
  devtools(
    (set, get) => ({
      // State
      holidays: [], // 국경일 목록
      isLoading: false, // 로딩 상태
      error: null, // 에러 메시지
      currentYear: new Date().getFullYear(), // 현재 조회 중인 연도
      currentMonth: new Date().getMonth() + 1, // 현재 조회 중인 월 (1-12)

      // Actions

      /**
       * 국경일 목록 조회
       * @param {number} year - 연도
       * @param {number} month - 월 (1-12)
       * @returns {Promise<boolean>} 성공 여부
       */
      fetchHolidays: async (year, month) => {
        set({ isLoading: true, error: null });

        try {
          const holidays = await holidayService.getHolidays(year, month);

          set({
            holidays,
            currentYear: year,
            currentMonth: month,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            holidays: [],
            isLoading: false,
            error: error.response?.data?.message || '국경일 목록을 불러오는데 실패했습니다.',
          });

          return false;
        }
      },

      /**
       * 현재 월의 국경일 조회
       * @returns {Promise<boolean>} 성공 여부
       */
      fetchCurrentMonthHolidays: async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        return get().fetchHolidays(year, month);
      },

      /**
       * 특정 날짜가 국경일인지 확인
       * @param {string} date - 날짜 (YYYY-MM-DD)
       * @returns {Object|null} 국경일 정보 또는 null
       */
      isHoliday: (date) => {
        const holidays = get().holidays;
        return holidays.find((holiday) => holiday.locdate === date) || null;
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'holiday-store',
    }
  )
);

export { useHolidayStore };
export default useHolidayStore;
