import PropTypes from 'prop-types';

/**
 * 로딩 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.text - 로딩 텍스트 (선택)
 * @param {('sm'|'md'|'lg')} props.size - 스피너 크기
 * @param {boolean} props.fullScreen - 전체 화면 로딩
 */
const Loading = ({
  text = '로딩 중...',
  size = 'md',
  fullScreen = false
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <svg
        className={`${sizes[size]} animate-spin text-[#2DA44E]`}
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
      {text && (
        <p className={`mt-4 ${textSizes[size]} text-[#57606A] font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

Loading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullScreen: PropTypes.bool
};

export default Loading;
