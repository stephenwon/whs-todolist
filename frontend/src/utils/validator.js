/**
 * 입력 값 검증 유틸리티
 * Zod 스키마를 사용한 이메일, 비밀번호 검증
 */

import { z } from 'zod';

/**
 * 이메일 검증 스키마
 */
const emailSchema = z
  .string()
  .min(1, '이메일을 입력하세요')
  .email('올바른 이메일 형식이 아닙니다');

/**
 * 비밀번호 검증 스키마
 */
const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .max(100, '비밀번호는 최대 100자까지 가능합니다');

/**
 * 사용자 이름 검증 스키마
 */
const usernameSchema = z
  .string()
  .min(2, '사용자 이름은 최소 2자 이상이어야 합니다')
  .max(50, '사용자 이름은 최대 50자까지 가능합니다');

/**
 * 할일 제목 검증 스키마
 */
const todoTitleSchema = z
  .string()
  .min(1, '제목을 입력하세요')
  .max(200, '제목은 최대 200자까지 가능합니다');

/**
 * 이메일 검증
 * @param {string} email - 검증할 이메일
 * @returns {{ valid: boolean, error?: string }} 검증 결과
 */
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: '이메일 검증 중 오류가 발생했습니다' };
  }
};

/**
 * 비밀번호 검증
 * @param {string} password - 검증할 비밀번호
 * @returns {{ valid: boolean, error?: string }} 검증 결과
 */
export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: '비밀번호 검증 중 오류가 발생했습니다' };
  }
};

/**
 * 사용자 이름 검증
 * @param {string} username - 검증할 사용자 이름
 * @returns {{ valid: boolean, error?: string }} 검증 결과
 */
export const validateUsername = (username) => {
  try {
    usernameSchema.parse(username);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: '사용자 이름 검증 중 오류가 발생했습니다' };
  }
};

/**
 * 할일 제목 검증
 * @param {string} title - 검증할 할일 제목
 * @returns {{ valid: boolean, error?: string }} 검증 결과
 */
export const validateTodoTitle = (title) => {
  try {
    todoTitleSchema.parse(title);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: '제목 검증 중 오류가 발생했습니다' };
  }
};

/**
 * 날짜 범위 검증 (만료일 >= 시작일)
 * @param {string} startDate - 시작일
 * @param {string} dueDate - 만료일
 * @returns {{ valid: boolean, error?: string }} 검증 결과
 */
export const validateDateRange = (startDate, dueDate) => {
  if (!startDate || !dueDate) {
    return { valid: true };
  }

  const start = new Date(startDate);
  const due = new Date(dueDate);

  if (due < start) {
    return {
      valid: false,
      error: '만료일은 시작일과 같거나 이후여야 합니다',
    };
  }

  return { valid: true };
};

/**
 * 비밀번호 확인 검증
 * @param {string} password - 비밀번호
 * @param {string} confirmPassword - 비밀번호 확인
 * @returns {{ valid: boolean, error?: string }} 검증 결과
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, error: '비밀번호가 일치하지 않습니다' };
  }
  return { valid: true };
};

/**
 * 회원가입 폼 전체 검증
 * @param {object} formData - 폼 데이터
 * @returns {{ valid: boolean, errors: object }} 검증 결과
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  const emailResult = validateEmail(formData.email);
  if (!emailResult.valid) {
    errors.email = emailResult.error;
  }

  const usernameResult = validateUsername(formData.username);
  if (!usernameResult.valid) {
    errors.username = usernameResult.error;
  }

  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.valid) {
    errors.password = passwordResult.error;
  }

  const matchResult = validatePasswordMatch(
    formData.password,
    formData.confirmPassword
  );
  if (!matchResult.valid) {
    errors.confirmPassword = matchResult.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * 로그인 폼 전체 검증
 * @param {object} formData - 폼 데이터
 * @returns {{ valid: boolean, errors: object }} 검증 결과
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailResult = validateEmail(formData.email);
  if (!emailResult.valid) {
    errors.email = emailResult.error;
  }

  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.valid) {
    errors.password = passwordResult.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
