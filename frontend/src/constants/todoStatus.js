/**
 * 할일 상태 상수 정의
 */

export const TODO_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DELETED: 'deleted',
};

export const TODO_STATUS_LABELS = {
  [TODO_STATUS.ACTIVE]: '진행 중',
  [TODO_STATUS.COMPLETED]: '완료',
  [TODO_STATUS.DELETED]: '삭제됨',
};

export const TODO_STATUS_COLORS = {
  [TODO_STATUS.ACTIVE]: 'bg-todo-active text-white',
  [TODO_STATUS.COMPLETED]: 'bg-todo-completed text-white',
  [TODO_STATUS.DELETED]: 'bg-todo-deleted text-gray-700',
};
