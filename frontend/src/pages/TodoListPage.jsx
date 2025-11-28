/**
 * 할일 목록 페이지
 * 할일 목록 조회, 필터링, 정렬, 추가/수정 기능 제공
 */

import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '../components/layout';
import TodoFilter from '../components/todo/TodoFilter';
import TodoList from '../components/todo/TodoList';
import TodoForm from '../components/todo/TodoForm';
import Modal from '../components/common/Modal';
import useTodoStore from '../stores/todoStore';
import useUiStore from '../stores/uiStore';

const TodoListPage = () => {
  const {
    todos,
    isLoading,
    error,
    filters,
    fetchTodos,
    createTodo,
    updateTodo,
    completeTodo,
    deleteTodo,
    setFilters,
  } = useTodoStore();

  const {
    isModalOpen,
    modalType,
    selectedTodo,
    openModal,
    closeModal,
  } = useUiStore();

  // 페이지 마운트 시 필터 초기화
  useEffect(() => {
    // 다른 페이지에서 돌아올 때 필터를 기본값으로 초기화
    setFilters({ status: '' });
  }, []); // 빈 배열 = 컴포넌트 마운트 시 1회만 실행

  // 필터 변경 시 할일 목록 조회
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /**
   * 할일 완료 상태 토글
   */
  const handleToggle = async (id) => {
    await completeTodo(id);
  };

  /**
   * 할일 수정 모달 열기
   */
  const handleEdit = (todo) => {
    openModal('edit', todo);
  };

  /**
   * 할일 삭제
   */
  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteTodo(id);
    }
  };

  /**
   * 할일 추가 버튼 클릭
   */
  const handleAddClick = () => {
    openModal('add');
  };

  /**
   * 할일 폼 제출
   */
  const handleFormSubmit = async (data) => {
    let result;

    if (modalType === 'edit' && selectedTodo) {
      const todoId = selectedTodo.todo_id || selectedTodo._id || selectedTodo.id;
      result = await updateTodo(todoId, data);
    } else {
      result = await createTodo(data);
    }

    if (result) {
      closeModal();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#24292F] dark:text-dark-fg-default">할일 목록</h1>
            <p className="text-sm text-[#57606A] dark:text-dark-fg-muted mt-1">
              총 {todos.length}개의 할일
            </p>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-[#FFEBE9] dark:bg-[#321C1C] border border-[#CF222E] dark:border-[#F85149] rounded-md p-3">
            <p className="text-sm text-[#CF222E] dark:text-[#F85149]">{error}</p>
          </div>
        )}

        {/* 필터 */}
        <TodoFilter
          filter={filters.status || 'all'}
          sortBy={filters.sortBy}
          searchQuery={filters.search}
          onFilterChange={(value) => {
            const statusMap = { all: '', active: 'active', completed: 'completed' };
            setFilters({ status: statusMap[value] });
          }}
          onSortChange={(value) => setFilters({ sortBy: value })}
          onSearchChange={(value) => setFilters({ search: value })}
        />

        {/* 할일 목록 */}
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />

        {/* 할일 추가 FAB (Floating Action Button) */}
        <button
          onClick={handleAddClick}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#2DA44E] text-white rounded-full shadow-lg
            hover:bg-[#2C974B] active:bg-[#298E46] transition-all duration-200
            flex items-center justify-center group hover:shadow-xl"
          aria-label="할일 추가"
        >
          <Plus size={24} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* 할일 추가/수정 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalType === 'edit' ? '할일 수정' : '새 할일 추가'}
          size="md"
        >
          <TodoForm
            mode={modalType}
            initialData={selectedTodo}
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            loading={isLoading}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default TodoListPage;
