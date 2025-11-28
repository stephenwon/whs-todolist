import { useEffect, useState } from 'react';
import { Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Button, Loading, Modal } from '../components/common';
import useTodoStore from '../stores/todoStore';
import { formatRelativeTime } from '../utils/dateFormatter';

/**
 * 휴지통 페이지
 * 삭제된 할일 목록 표시, 복원 및 영구 삭제 기능
 */
const TrashPage = () => {
  const { todos, isLoading, error, fetchTodos, restoreTodo, setFilters } = useTodoStore();
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);

  useEffect(() => {
    // 삭제된 할일만 조회
    setFilters({ status: 'deleted' });
  }, [setFilters]);

  const handleRestore = async (id) => {
    const success = await restoreTodo(id);
    if (success) {
      // 복원 후 목록 갱신
      await fetchTodos();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTodo) return;

    // 영구 삭제 API는 백엔드에서 구현되지 않았으므로
    // 현재는 목록에서만 제거
    setIsDeleteModalOpen(false);
    setSelectedTodo(null);

    // TODO: 영구 삭제 API 구현 시 추가
    alert('영구 삭제 기능은 아직 구현되지 않았습니다.');
  };

  const handleEmptyTrash = () => {
    if (todos.length === 0) return;
    setIsEmptyModalOpen(true);
  };

  const handleEmptyConfirm = async () => {
    // 전체 비우기 API는 백엔드에서 구현되지 않았으므로
    // 현재는 알림만 표시
    setIsEmptyModalOpen(false);

    // TODO: 전체 비우기 API 구현 시 추가
    alert('전체 비우기 기능은 아직 구현되지 않았습니다.');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#24292F] dark:text-dark-fg-default">휴지통</h1>
            <p className="mt-1 text-sm text-[#57606A] dark:text-dark-fg-muted">
              삭제된 할일을 복원하거나 영구 삭제할 수 있습니다
            </p>
          </div>

          {todos.length > 0 && (
            <Button
              variant="danger"
              size="md"
              onClick={handleEmptyTrash}
              className="w-full sm:w-auto"
            >
              <Trash2 size={16} className="mr-2" />
              전체 비우기
            </Button>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-[#FFEBE9] dark:bg-[#321C1C] border border-[#CF222E] dark:border-[#F85149] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-[#CF222E] dark:text-[#F85149] flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-[#CF222E] dark:text-[#F85149]">오류가 발생했습니다</h3>
                <p className="mt-1 text-sm text-[#82071E] dark:text-[#F85149]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 할일 목록 */}
        {todos.length === 0 ? (
          <div className="text-center py-16 bg-[#F6F8FA] dark:bg-dark-canvas-subtle rounded-lg border-2 border-dashed border-[#D0D7DE] dark:border-dark-border-default">
            <Trash2 className="mx-auto text-[#57606A] dark:text-dark-fg-muted mb-4" size={48} />
            <h3 className="text-lg font-medium text-[#24292F] dark:text-dark-fg-default mb-2">
              휴지통이 비어있습니다
            </h3>
            <p className="text-[#57606A] dark:text-dark-fg-muted">삭제된 할일이 여기에 표시됩니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.todo_id || todo._id}
                className="bg-white dark:bg-dark-canvas-subtle border border-[#D0D7DE] dark:border-dark-border-default rounded-lg p-4 hover:border-[#BBC0C4] dark:hover:border-dark-border-muted hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-[#24292F] dark:text-dark-fg-default truncate">
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="mt-1 text-sm text-[#57606A] dark:text-dark-fg-muted line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-[#57606A] dark:text-dark-fg-muted">
                      <span>삭제: {formatRelativeTime(todo.deletedAt)}</span>
                      {todo.dueDate && (
                        <span className="hidden sm:inline">마감일: {new Date(todo.dueDate).toLocaleDateString('ko-KR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRestore(todo.todo_id || todo._id)}
                      className="w-full sm:w-auto"
                    >
                      <RotateCcw size={14} className="mr-1" />
                      복원
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedTodo(todo);
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 size={14} className="mr-1" />
                      영구 삭제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 영구 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTodo(null);
        }}
        title="영구 삭제"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedTodo(null);
              }}
            >
              취소
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              영구 삭제
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[#FFF8C5] dark:bg-[#4A3A1A] border border-[#D4A72C] dark:border-[#9A6700] rounded-md">
            <AlertCircle className="text-[#9A6700] dark:text-[#FFA657] flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-[#7A5C00] dark:text-[#FFA657]">
              <p className="font-medium">이 작업은 되돌릴 수 없습니다</p>
              <p className="mt-1">할일이 영구적으로 삭제됩니다</p>
            </div>
          </div>
          {selectedTodo && (
            <div>
              <p className="text-sm text-[#57606A] dark:text-dark-fg-muted mb-2">삭제할 할일:</p>
              <p className="font-medium text-[#24292F] dark:text-dark-fg-default">{selectedTodo.title}</p>
            </div>
          )}
        </div>
      </Modal>

      {/* 전체 비우기 확인 모달 */}
      <Modal
        isOpen={isEmptyModalOpen}
        onClose={() => setIsEmptyModalOpen(false)}
        title="휴지통 비우기"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEmptyModalOpen(false)}
            >
              취소
            </Button>
            <Button variant="danger" onClick={handleEmptyConfirm}>
              전체 비우기
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-[#FFEBE9] dark:bg-[#321C1C] border border-[#CF222E] dark:border-[#F85149] rounded-md">
            <AlertCircle className="text-[#CF222E] dark:text-[#F85149] flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-[#82071E] dark:text-[#F85149]">
              <p className="font-medium">주의: 이 작업은 되돌릴 수 없습니다</p>
              <p className="mt-1">
                휴지통의 모든 할일({todos.length}개)이 영구적으로 삭제됩니다
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default TrashPage;
