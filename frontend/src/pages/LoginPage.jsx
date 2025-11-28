/**
 * 로그인 페이지
 * React Hook Form + Zod를 사용한 폼 검증
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Sun, Moon } from "lucide-react";
import useAuthStore from "../stores/authStore";
import useUIStore from "../stores/uiStore";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { validateLoginForm } from "../utils/validator";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data) => {
    setErrorMessage("");

    // 클라이언트 측 검증
    const validation = validateLoginForm(data);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError);
      return;
    }

    // 로그인 API 호출
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/");
    } else {
      setErrorMessage(error || "로그인에 실패했습니다");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-canvas-default px-4 transition-colors">
      {/* 다크모드 토글 버튼 - 우측 상단 고정 */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-3 text-gray-600 dark:text-dark-fg-muted hover:text-gray-900 dark:hover:text-dark-fg-default hover:bg-gray-100 dark:hover:bg-dark-canvas-default rounded-lg transition-colors shadow-md"
        aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md">
        {/* 로그인 폼 */}
        <div className="bg-white dark:bg-dark-canvas-subtle border border-gray-300 dark:border-dark-border-default rounded-lg shadow-md overflow-hidden">
          {/* 카드 헤더 */}
          <div className="text-center py-8 px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-fg-default mb-2">
              강사 할일 관리 앱
            </h1>
            <p className="text-gray-600 dark:text-dark-fg-muted">
              로그인하여 할일을 관리하세요
            </p>
          </div>

          {/* 폼 영역 */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* 에러 메시지 */}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-[#321C1C] border border-red-300 dark:border-[#F85149] rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-[#F85149]">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* 이메일 입력 */}
              <Input
                type="email"
                label="이메일"
                placeholder="example@email.com"
                error={errors.email?.message}
                required
                {...register("email", {
                  required: "이메일을 입력하세요",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "올바른 이메일 형식이 아닙니다",
                  },
                })}
              />

              {/* 비밀번호 입력 */}
              <Input
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                error={errors.password?.message}
                required
                {...register("password", {
                  required: "비밀번호를 입력하세요",
                  minLength: {
                    value: 8,
                    message: "비밀번호는 최소 8자 이상이어야 합니다",
                  },
                })}
              />

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                로그인
              </Button>

              {/* 회원가입 링크 */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600 dark:text-dark-fg-muted">
                  계정이 없으신가요?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 dark:text-[#58A6FF] hover:underline font-medium"
                  >
                    회원가입
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

export default LoginPage;
