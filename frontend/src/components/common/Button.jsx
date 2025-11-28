import PropTypes from 'prop-types';

/**
 * 버튼 컴포넌트
 *
 * @param {Object} props
 * @param {('primary'|'secondary'|'danger')} props.variant - 버튼 스타일 변형
 * @param {('sm'|'md'|'lg')} props.size - 버튼 크기
 * @param {boolean} props.loading - 로딩 상태
 * @param {boolean} props.disabled - 비활성화 상태
 * @param {string} props.className - 추가 CSS 클래스
 * @param {React.ReactNode} props.children - 버튼 내용
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#2DA44E] text-white border border-[rgba(27,31,36,0.15)] hover:bg-[#2C974B] active:bg-[#298E46] focus:ring-[#2DA44E] dark:border-dark-border-default',
    secondary: 'bg-white dark:bg-dark-canvas-subtle text-[#24292F] dark:text-dark-fg-default border border-[#D0D7DE] dark:border-dark-border-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default hover:border-[#BBC0C4] dark:hover:border-dark-border-muted active:bg-[#EEEEEE] dark:active:bg-dark-canvas-default focus:ring-[#0969DA] dark:focus:ring-[#58A6FF]',
    danger: 'bg-[#CF222E] dark:bg-[#DA3633] text-white border border-[rgba(27,31,36,0.15)] dark:border-dark-border-default hover:bg-[#BD2130] dark:hover:bg-[#CB2431] active:bg-[#A41E2A] dark:active:bg-[#B62324] focus:ring-[#CF222E] dark:focus:ring-[#F85149]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-5 py-2.5 text-base h-12'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          처리 중...
        </>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;
