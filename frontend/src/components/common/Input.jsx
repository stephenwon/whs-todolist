import PropTypes from 'prop-types';
import { forwardRef } from 'react';

/**
 * 입력 필드 컴포넌트
 *
 * @param {Object} props
 * @param {('text'|'email'|'password'|'date')} props.type - 입력 타입
 * @param {string} props.label - 레이블 텍스트
 * @param {string} props.error - 에러 메시지
 * @param {string} props.placeholder - 플레이스홀더
 * @param {string} props.className - 추가 CSS 클래스
 */
const Input = forwardRef(({
  type = 'text',
  label,
  error,
  placeholder,
  className = '',
  ...props
}, ref) => {
  const baseInputStyles = 'w-full px-4 py-2.5 text-base border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white dark:bg-dark-canvas-subtle text-[#24292F] dark:text-dark-fg-default';

  const inputStateStyles = error
    ? 'border-red-600 dark:border-[#F85149] focus:border-red-600 dark:focus:border-[#F85149] focus:ring-red-200 dark:focus:ring-red-900'
    : 'border-gray-300 dark:border-dark-border-default focus:border-blue-500 dark:focus:border-[#58A6FF] focus:ring-blue-200 dark:focus:ring-blue-900 hover:border-gray-400 dark:hover:border-dark-border-muted';

  const disabledStyles = 'disabled:bg-gray-100 dark:disabled:bg-dark-canvas-default disabled:text-gray-500 dark:disabled:text-dark-fg-subtle disabled:cursor-not-allowed';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-dark-fg-default">
          {label}
          {props.required && <span className="text-red-600 dark:text-[#F85149] ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`${baseInputStyles} ${inputStateStyles} ${disabledStyles}`}
        {...props}
      />

      {error && (
        <span className="flex items-center gap-1 text-sm text-red-600 dark:text-[#F85149]">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'password', 'date']),
  label: PropTypes.string,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool
};

export default Input;
