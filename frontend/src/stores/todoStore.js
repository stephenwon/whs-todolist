/**
 * 할일 상태 관리 스토어 (Zustand)
 * 할일 목록, 필터, CRUD 작업 등 할일 관련 전역 상태 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as todoService from '../services/todoService';

const useTodoStore = create(
  devtools(
    (set, get) => ({
      // State
      todos: [], // 할일 목록
      isLoading: false, // 로딩 상태
      error: null, // 에러 메시지
      filters: {
        status: '', // '', 'active', 'completed', 'deleted'
        search: '', // 검색어
        startDate: null, // 시작일
        endDate: null, // 종료일
        sortBy: 'createdAt', // 정렬 기준
        order: 'desc', // 정렬 순서
      },

      // Actions

      /**
       * 할일 목록 조회
       * @returns {Promise<boolean>} 성공 여부
       */
      fetchTodos: async () => {
        set({ isLoading: true, error: null });

        try {
          const filters = get().filters;
          const todos = await todoService.getTodos(filters);

          set({
            todos,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            todos: [],
            isLoading: false,
            error: error.response?.data?.message || '할일 목록을 불러오는데 실패했습니다.',
          });

          return false;
        }
      },

      /**
       * 할일 생성
       * @param {Object} todoData - 할일 데이터
       * @returns {Promise<Object|null>} 생성된 할일 또는 null
       */
      createTodo: async (todoData) => {
        set({ isLoading: true, error: null });

        try {
          const newTodo = await todoService.createTodo(todoData);

          // 현재 필터에 맞으면 목록에 추가
          const currentFilter = get().filters.status;
          if (currentFilter === 'active' || currentFilter === '') {
            set((state) => ({
              todos: [newTodo, ...state.todos],
              isLoading: false,
              error: null,
            }));
          } else {
            set({ isLoading: false });
          }

          return newTodo;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || '할일 생성에 실패했습니다.',
          });

          return null;
        }
      },

      /**
       * 할일 수정
       * @param {string} id - 할일 ID
       * @param {Object} updateData - 수정할 데이터
       * @returns {Promise<Object|null>} 수정된 할일 또는 null
       */
      updateTodo: async (id, updateData) => {
        set({ isLoading: true, error: null });

        try {
          const updatedTodo = await todoService.updateTodo(id, updateData);

          // 목록에서 해당 할일 업데이트
          set((state) => ({
            todos: state.todos.map((todo) =>
              (todo.todo_id || todo._id) === id ? updatedTodo : todo
            ),
            isLoading: false,
            error: null,
          }));

          return updatedTodo;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || '할일 수정에 실패했습니다.',
          });

          return null;
        }
      },

      /**
       * 할일 완료 처리
       * @param {string} id - 할일 ID
       * @returns {Promise<Object|null>} 완료 처리된 할일 또는 null
       */
      completeTodo: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const completedTodo = await todoService.completeTodo(id);

          // 현재 필터가 'pending'이면 목록에서 제거
          const currentFilter = get().filters.status;
          if (currentFilter === 'pending') {
            set((state) => ({
              todos: state.todos.filter((todo) => (todo.todo_id || todo._id) !== id),
              isLoading: false,
              error: null,
            }));
          } else {
            // 다른 필터면 업데이트
            set((state) => ({
              todos: state.todos.map((todo) =>
                (todo.todo_id || todo._id) === id ? completedTodo : todo
              ),
              isLoading: false,
              error: null,
            }));
          }

          return completedTodo;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || '할일 완료 처리에 실패했습니다.',
          });

          return null;
        }
      },

      /**
       * 할일 삭제 (휴지통으로 이동)
       * @param {string} id - 할일 ID
       * @returns {Promise<boolean>} 성공 여부
       */
      deleteTodo: async (id) => {
        set({ isLoading: true, error: null });

        try {
          await todoService.deleteTodo(id);

          // 목록에서 제거
          set((state) => ({
            todos: state.todos.filter((todo) => (todo.todo_id || todo._id) !== id),
            isLoading: false,
            error: null,
          }));

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || '할일 삭제에 실패했습니다.',
          });

          return false;
        }
      },

      /**
       * 할일 복원 (휴지통에서 복원)
       * @param {string} id - 할일 ID
       * @returns {Promise<boolean>} 성공 여부
       */
      restoreTodo: async (id) => {
        set({ isLoading: true, error: null });

        try {
          await todoService.restoreTodo(id);

          // 휴지통 필터인 경우 목록에서 제거
          const currentFilter = get().filters.status;
          if (currentFilter === 'deleted') {
            set((state) => ({
              todos: state.todos.filter((todo) => (todo.todo_id || todo._id) !== id),
              isLoading: false,
              error: null,
            }));
          } else {
            set({ isLoading: false });
          }

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || '할일 복원에 실패했습니다.',
          });

          return false;
        }
      },

      /**
       * 필터 설정
       * @param {Object} newFilters - 새로운 필터 값
       */
      setFilters: (newFilters) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...newFilters,
          },
        }));

        // 필터 변경 시 자동으로 목록 갱신
        get().fetchTodos();
      },

      /**
       * 필터 초기화
       */
      resetFilters: () => {
        set({
          filters: {
            status: '',
            search: '',
            startDate: null,
            endDate: null,
            sortBy: 'createdAt',
            order: 'desc',
          },
        });

        // 필터 초기화 후 목록 갱신
        get().fetchTodos();
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'todo-store',
    }
  )
);

export { useTodoStore };
export default useTodoStore;
