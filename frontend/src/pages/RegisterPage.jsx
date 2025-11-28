/**
 * 회원가입 페이지
 * React Hook Form + Zod를 사용한 폼 검증
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sun, Moon } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { validateRegisterForm } from '../utils/validator';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data) => {
    setErrorMessage('');

    // 클라이언트 측 검증
    const validation = validateRegisterForm(data);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError);
      return;
    }

    // 회원가입 API 호출
    const success = await registerUser(data.email, data.password, data.username);

    if (success) {
      // 회원가입 성공 시 자동 로그인되어 메인 페이지로 이동
      navigate('/');
    } else {
      setErrorMessage(error || '회원가입에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-canvas-default px-4 py-8 transition-colors">
      {/* 다크모드 토글 버튼 - 우측 상단 고정 */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 text-gray-600 dark:text-dark-fg-muted hover:text-gray-900 dark:hover:text-dark-fg-default hover:bg-gray-100 dark:hover:bg-dark-canvas-default rounded-lg transition-colors shadow-md"
        aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md">
        {/* 회원가입 폼 */}
        <div className="bg-white dark:bg-dark-canvas-subtle border border-gray-300 dark:border-dark-border-default rounded-lg shadow-md overflow-hidden">
          {/* 카드 헤더 */}
          <div className="text-center py-8 px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-fg-default mb-2">
              WHS-TodoList
            </h1>
            <p className="text-gray-600 dark:text-dark-fg-muted">새 계정을 만들어 시작하세요</p>
          </div>

          {/* 폼 영역 */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* 에러 메시지 */}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-[#321C1C] border border-red-300 dark:border-[#F85149] rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-[#F85149]">{errorMessage}</p>
                </div>
              )}

            {/* 이메일 입력 */}
            <Input
              type="email"
              label="이메일"
              placeholder="example@email.com"
              error={errors.email?.message}
              required
              {...register('email', {
                required: '이메일을 입력하세요',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '올바른 이메일 형식이 아닙니다',
                },
              })}
            />

            {/* 사용자 이름 입력 */}
            <Input
              type="text"
              label="사용자 이름"
              placeholder="홍길동"
              error={errors.username?.message}
              required
              {...register('username', {
                required: '사용자 이름을 입력하세요',
                minLength: {
                  value: 2,
                  message: '사용자 이름은 최소 2자 이상이어야 합니다',
                },
                maxLength: {
                  value: 50,
                  message: '사용자 이름은 최대 50자까지 가능합니다',
                },
              })}
            />

            {/* 비밀번호 입력 */}
            <Input
              type="password"
              label="비밀번호"
              placeholder="최소 8자 이상"
              error={errors.password?.message}
              required
              {...register('password', {
                required: '비밀번호를 입력하세요',
                minLength: {
                  value: 8,
                  message: '비밀번호는 최소 8자 이상이어야 합니다',
                },
                maxLength: {
                  value: 100,
                  message: '비밀번호는 최대 100자까지 가능합니다',
                },
              })}
            />

            {/* 비밀번호 확인 입력 */}
            <Input
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword', {
                required: '비밀번호 확인을 입력하세요',
                validate: (value) =>
                  value === password || '비밀번호가 일치하지 않습니다',
              })}
            />

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              회원가입
            </Button>

            {/* 로그인 링크 */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600 dark:text-dark-fg-muted">
                이미 계정이 있으신가요?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-[#58A6FF] hover:underline font-medium"
                >
                  로그인
                </Link>
              </p>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
