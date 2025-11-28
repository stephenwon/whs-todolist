/**
 * 할일 필터 컴포넌트
 * 상태 필터, 정렬, 검색 기능 제공
 */

import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

const TodoFilter = ({
  filter,
  sortBy,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
}) => {
  const filterOptions = [
    { value: 'all', label: '전체' },
    { value: 'active', label: '진행 중' },
    { value: 'completed', label: '완료' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: '생성일순' },
    { value: 'dueDate', label: '만료일순' },
    { value: 'title', label: '제목순' },
  ];

  return (
    <div className="bg-white dark:bg-dark-canvas-subtle border border-[#D0D7DE] dark:border-dark-border-default rounded-lg p-4 shadow-sm mb-4 transition-colors">
      <div className="flex flex-col md:flex-row gap-4">
        {/* 검색 입력 */}
        <div className="flex-1">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57606A] dark:text-dark-fg-muted"
            />
            <input
              type="text"
              placeholder="할일 검색..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-[#D0D7DE] dark:border-dark-border-default rounded-md
                bg-white dark:bg-dark-canvas-default text-[#24292F] dark:text-dark-fg-default
                focus:outline-none focus:border-[#0969DA] dark:focus:border-[#58A6FF] focus:ring-2 focus:ring-[#0969DA]/30 dark:focus:ring-[#58A6FF]/30
                hover:border-[#BBC0C4] dark:hover:border-dark-border-muted transition-all"
            />
          </div>
        </div>

        {/* 필터 버튼 그룹 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hidden md:block">
            필터:
          </span>
          <div className="flex gap-1 bg-[#F6F8FA] dark:bg-dark-canvas-default rounded-md p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded transition-colors
                  ${
                    filter === option.value
                      ? 'bg-white dark:bg-dark-canvas-subtle text-[#24292F] dark:text-dark-fg-default shadow-sm'
                      : 'text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 정렬 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hidden md:block">
            정렬:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 text-sm border border-[#D0D7DE] dark:border-dark-border-default rounded-md
              bg-white dark:bg-dark-canvas-default text-[#24292F] dark:text-dark-fg-default
              focus:outline-none focus:border-[#0969DA] dark:focus:border-[#58A6FF] focus:ring-2 focus:ring-[#0969DA]/30 dark:focus:ring-[#58A6FF]/30
              hover:border-[#BBC0C4] dark:hover:border-dark-border-muted transition-all cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

TodoFilter.propTypes = {
  filter: PropTypes.oneOf(['all', 'active', 'completed']).isRequired,
  sortBy: PropTypes.oneOf(['createdAt', 'dueDate', 'title']).isRequired,
  searchQuery: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default TodoFilter;
