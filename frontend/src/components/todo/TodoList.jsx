/**
 * 할일 목록 컴포넌트
 * TodoCard 컴포넌트들을 렌더링
 */

import PropTypes from 'prop-types';
import TodoCard from './TodoCard';
import { ListTodo } from 'lucide-react';

const TodoList = ({ todos, onToggle, onEdit, onDelete, loading }) => {
  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2DA44E]"></div>
          <p className="text-[#57606A] dark:text-dark-fg-muted mt-2">할일 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 빈 상태
  if (todos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F6F8FA] dark:bg-dark-canvas-subtle mb-4">
            <ListTodo size={32} className="text-[#57606A] dark:text-dark-fg-muted" />
          </div>
          <h3 className="text-lg font-medium text-[#24292F] dark:text-dark-fg-default mb-2">
            할일이 없습니다
          </h3>
          <p className="text-sm text-[#57606A] dark:text-dark-fg-muted">
            새로운 할일을 추가해보세요
          </p>
        </div>
      </div>
    );
  }

  // 할일 목록 렌더링
  return (
    <div className="space-y-3">
      {todos.map((todo, index) => (
        <TodoCard
          key={todo.todo_id || todo._id || todo.id || index}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.oneOf(['pending', 'completed', 'active']).isRequired,
      startDate: PropTypes.string,
      dueDate: PropTypes.string,
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default TodoList;
