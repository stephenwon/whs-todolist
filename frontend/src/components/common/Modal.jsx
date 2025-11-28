import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * 모달 컴포넌트
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {string} props.title - 모달 제목
 * @param {React.ReactNode} props.children - 모달 본문 내용
 * @param {React.ReactNode} props.footer - 모달 하단 액션 버튼
 * @param {string} props.size - 모달 크기 (sm, md, lg)
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  // ESC 키로 모달 닫기
  const handleEscape = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // 배경 클릭으로 모달 닫기
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(27,31,36,0.5)] dark:bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-white dark:bg-dark-canvas-subtle rounded-xl shadow-[0_16px_48px_rgba(27,31,36,0.3)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.6)] w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col border border-transparent dark:border-dark-border-default`}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-[#D0D7DE] dark:border-dark-border-default">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-[#24292F] dark:text-dark-fg-default"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
            aria-label="모달 닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>

        {/* 모달 하단 */}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-6 border-t border-[#D0D7DE] dark:border-dark-border-default">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default Modal;
