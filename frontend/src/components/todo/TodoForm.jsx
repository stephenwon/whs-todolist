/**
 * 할일 추가/수정 폼 컴포넌트
 * React Hook Form + Zod를 사용한 폼 검증
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import { validateTodoTitle, validateDateRange } from '../../utils/validator';

const TodoForm = ({ mode = 'add', initialData = null, onSubmit, onCancel, loading }) => {
  const isEditMode = mode === 'edit';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      dueDate: '',
    },
  });

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (isEditMode && initialData) {
      // 날짜 형식 변환 함수 (ISO 8601 -> YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      reset({
        title: initialData.title || '',
        description: initialData.description || initialData.content || '',
        startDate: formatDateForInput(initialData.startDate || initialData.start_date),
        dueDate: formatDateForInput(initialData.dueDate || initialData.due_date),
      });
    }
  }, [isEditMode, initialData, reset]);

  const startDate = watch('startDate');
  const dueDate = watch('dueDate');

  // 날짜 범위 검증
  useEffect(() => {
    if (startDate && dueDate) {
      const validation = validateDateRange(startDate, dueDate);
      if (!validation.valid) {
        setError('dueDate', {
          type: 'manual',
          message: validation.error,
        });
      } else {
        clearErrors('dueDate');
      }
    }
  }, [startDate, dueDate, setError, clearErrors]);

  /**
   * 폼 제출 핸들러
   */
  const handleFormSubmit = async (data) => {
    // 제목 검증
    const titleValidation = validateTodoTitle(data.title);
    if (!titleValidation.valid) {
      setError('title', {
        type: 'manual',
        message: titleValidation.error,
      });
      return;
    }

    // 날짜 범위 검증
    if (data.startDate && data.dueDate) {
      const dateValidation = validateDateRange(data.startDate, data.dueDate);
      if (!dateValidation.valid) {
        setError('dueDate', {
          type: 'manual',
          message: dateValidation.error,
        });
        return;
      }
    }

    // 빈 값 제거
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '')
    );

    await onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 제목 입력 */}
      <Input
        type="text"
        label="제목"
        placeholder="할일 제목을 입력하세요"
        error={errors.title?.message}
        required
        {...register('title', {
          required: '제목을 입력하세요',
          maxLength: {
            value: 200,
            message: '제목은 최대 200자까지 가능합니다',
          },
        })}
      />

      {/* 설명 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#24292F]">설명</label>
        <textarea
          placeholder="할일에 대한 상세 설명을 입력하세요 (선택사항)"
          rows={4}
          className="w-full px-3 py-2 text-sm border border-[#D0D7DE] rounded-md
            focus:outline-none focus:border-[#0969DA] focus:ring-2 focus:ring-[#0969DA]/30
            hover:border-[#BBC0C4] transition-all resize-none"
          {...register('description', {
            maxLength: {
              value: 1000,
              message: '설명은 최대 1000자까지 가능합니다',
            },
          })}
        />
        {errors.description && (
          <span className="flex items-center gap-1 text-xs text-[#CF222E]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.description.message}
          </span>
        )}
      </div>

      {/* 날짜 입력 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 시작일 */}
        <Input
          type="date"
          label="시작일"
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        {/* 만료일 */}
        <Input
          type="date"
          label="만료일"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      {/* 버튼 그룹 */}
      <div className="flex items-center justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {isEditMode ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
};

TodoForm.propTypes = {
  mode: PropTypes.oneOf(['add', 'edit']),
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    dueDate: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default TodoForm;
