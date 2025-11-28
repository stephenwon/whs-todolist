/**
 * 날짜 포맷팅 유틸리티
 * date-fns 라이브러리를 활용한 날짜 처리 함수
 */

import { format, parseISO, isPast, isToday, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 지정된 형식으로 포맷팅
 * @param {string|Date} date - 날짜 (ISO 문자열 또는 Date 객체)
 * @param {string} formatStr - 포맷 문자열 (기본값: 'yyyy-MM-dd')
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatDate = (date, formatStr = 'yyyy-MM-dd') => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: ko });
  } catch (error) {
    console.error('날짜 포맷 오류:', error);
    return '';
  }
};

/**
 * 날짜와 시간을 함께 포맷팅
 * @param {string|Date} date - 날짜
 * @returns {string} 'yyyy-MM-dd HH:mm' 형식의 문자열
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

/**
 * 상대적인 날짜 표시 (예: "5분 전", "2일 전")
 * @param {string|Date} date - 날짜
 * @returns {string} 상대적인 날짜 문자열
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInDays = differenceInDays(now, dateObj);

    if (diffInDays === 0) {
      const diffInHours = Math.floor((now - dateObj) / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor((now - dateObj) / (1000 * 60));
        return diffInMinutes <= 0 ? '방금' : `${diffInMinutes}분 전`;
      }
      return `${diffInHours}시간 전`;
    }

    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;

    return formatDate(dateObj);
  } catch (error) {
    console.error('상대 시간 포맷 오류:', error);
    return '';
  }
};

/**
 * 만료일이 지났는지 확인
 * @param {string|Date} dueDate - 만료일
 * @returns {boolean} 만료일이 지났으면 true
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;

  try {
    const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    return isPast(dateObj) && !isToday(dateObj);
  } catch (error) {
    console.error('만료일 확인 오류:', error);
    return false;
  }
};

/**
 * 오늘인지 확인
 * @param {string|Date} date - 날짜
 * @returns {boolean} 오늘이면 true
 */
export const isTodayDate = (date) => {
  if (!date) return false;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isToday(dateObj);
  } catch (error) {
    console.error('오늘 날짜 확인 오류:', error);
    return false;
  }
};

/**
 * 날짜 범위 표시 (시작일 ~ 만료일)
 * @param {string|Date} startDate - 시작일
 * @param {string|Date} dueDate - 만료일
 * @returns {string} 날짜 범위 문자열
 */
export const formatDateRange = (startDate, dueDate) => {
  const start = startDate ? formatDate(startDate) : '';
  const end = dueDate ? formatDate(dueDate) : '';

  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  if (start === end) return start;

  return `${start} ~ ${end}`;
};
