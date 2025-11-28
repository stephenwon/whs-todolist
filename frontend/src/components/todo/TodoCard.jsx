/**
 * 할일 카드 컴포넌트
 * 할일 항목을 표시하고 완료, 수정, 삭제 기능 제공
 */

import PropTypes from 'prop-types';
import { CheckCircle, Circle, Pencil, Trash2, Calendar } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';

const TodoCard = ({ todo, onToggle, onEdit, onDelete }) => {
  const isCompleted = todo.status === 'completed';
  const isDue = todo.dueDate && isPast(parseISO(todo.dueDate)) && !isCompleted;
  const todoId = todo.todo_id || todo._id || todo.id;

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), 'yyyy년 MM월 dd일');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div
      className={`
        bg-white dark:bg-dark-canvas-subtle border rounded-lg p-4 shadow-sm transition-all duration-200
        hover:shadow-md hover:border-[#BBC0C4] dark:hover:border-dark-border-muted
        ${isCompleted ? 'border-[#1A7F37] dark:border-[#3FB950]' : isDue ? 'border-[#FB8500] dark:border-[#FB8500]' : 'border-[#D0D7DE] dark:border-dark-border-default'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* 완료 체크박스 */}
        <button
          onClick={() => onToggle(todoId)}
          className={`
            flex-shrink-0 mt-1 transition-colors
            ${isCompleted ? 'text-[#1A7F37] dark:text-[#3FB950]' : 'text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default'}
          `}
          aria-label={isCompleted ? '완료 취소' : '완료 처리'}
        >
          {isCompleted ? (
            <CheckCircle size={20} fill="currentColor" />
          ) : (
            <Circle size={20} />
          )}
        </button>

        {/* 할일 내용 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3
            className={`
              text-base font-medium break-words
              ${isCompleted ? 'text-[#57606A] dark:text-dark-fg-subtle line-through' : 'text-[#24292F] dark:text-dark-fg-default'}
            `}
          >
            {todo.title}
          </h3>

          {/* 설명 */}
          {todo.description && (
            <p
              className={`
                text-sm mt-1 break-words
                ${isCompleted ? 'text-[#8C959F] dark:text-dark-fg-subtle' : 'text-[#57606A] dark:text-dark-fg-muted'}
              `}
            >
              {todo.description}
            </p>
          )}

          {/* 날짜 정보 */}
          {(todo.startDate || todo.dueDate) && (
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              {todo.startDate && (
                <div className="flex items-center gap-1 text-[#57606A] dark:text-dark-fg-muted">
                  <Calendar size={14} />
                  <span>시작: {formatDate(todo.startDate)}</span>
                </div>
              )}
              {todo.dueDate && (
                <div
                  className={`
                    flex items-center gap-1
                    ${isDue ? 'text-[#FB8500] dark:text-[#FFA657] font-medium' : 'text-[#57606A] dark:text-dark-fg-muted'}
                  `}
                >
                  <Calendar size={14} />
                  <span>만료: {formatDate(todo.dueDate)}</span>
                  {isDue && <span className="ml-1">(기한 초과)</span>}
                </div>
              )}
            </div>
          )}

          {/* 상태 배지 */}
          <div className="mt-2">
            <span
              className={`
                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${
                  isCompleted
                    ? 'bg-[#DAFBE1] dark:bg-[#26432F] text-[#1A7F37] dark:text-[#3FB950]'
                    : isDue
                    ? 'bg-[#FFF8C5] dark:bg-[#4A3A1A] text-[#9A6700] dark:text-[#FFA657]'
                    : 'bg-[#FFF4E5] dark:bg-[#3E2A1F] text-[#FB8500] dark:text-[#FFA657]'
                }
              `}
            >
              {isCompleted ? '완료' : isDue ? '기한 초과' : '진행 중'}
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 수정 버튼 */}
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-[#57606A] dark:text-dark-fg-muted hover:text-[#0969DA] dark:hover:text-[#58A6FF] hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
            aria-label="할일 수정"
          >
            <Pencil size={16} />
          </button>

          {/* 삭제 버튼 */}
          <button
            onClick={() => onDelete(todoId)}
            className="p-2 text-[#57606A] dark:text-dark-fg-muted hover:text-[#CF222E] dark:hover:text-[#F85149] hover:bg-[#FFEBE9] dark:hover:bg-[#321C1C] rounded-md transition-colors"
            aria-label="할일 삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

TodoCard.propTypes = {
  todo: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['pending', 'completed', 'active']).isRequired,
    startDate: PropTypes.string,
    dueDate: PropTypes.string,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoCard;
