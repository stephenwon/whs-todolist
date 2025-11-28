import { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Loading, Button } from '../components/common';
import HolidayCard from '../components/holiday/HolidayCard';
import useHolidayStore from '../stores/holidayStore';

/**
 * 국경일 페이지
 * 월별 국경일 조회 및 표시
 */
const HolidayPage = () => {
  const { holidays, isLoading, error, fetchHolidays, currentYear, currentMonth } = useHolidayStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchHolidays(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, fetchHolidays]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(12);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth(1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#24292F] dark:text-dark-fg-default">국경일</h1>
          <p className="mt-1 text-sm text-[#57606A] dark:text-dark-fg-muted">
            대한민국의 공휴일과 국경일 정보를 확인하세요
          </p>
        </div>

        <div className="bg-white dark:bg-dark-canvas-subtle border border-[#D0D7DE] dark:border-dark-border-default rounded-lg p-4 md:p-6 transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
                aria-label="이전 달"
              >
                <ChevronLeft size={20} />
              </button>

              <h2 className="text-xl md:text-2xl font-bold text-[#24292F] dark:text-dark-fg-default min-w-[160px] text-center">
                {selectedYear}년 {selectedMonth}월
              </h2>

              <button
                onClick={handleNextMonth}
                className="p-2 text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
                aria-label="다음 달"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleToday}
              className="w-full sm:w-auto"
            >
              <Calendar size={16} className="mr-2" />
              이번 달
            </Button>
          </div>

          {error && (
            <div className="bg-[#FFEBE9] dark:bg-[#321C1C] border border-[#CF222E] dark:border-[#F85149] rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-[#CF222E] dark:text-[#F85149] flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-medium text-[#CF222E] dark:text-[#F85149]">오류가 발생했습니다</h3>
                  <p className="mt-1 text-sm text-[#82071E] dark:text-[#F85149]">{error}</p>
                </div>
              </div>
            </div>
          )}

          {holidays.length === 0 ? (
            <div className="text-center py-16 bg-[#F6F8FA] dark:bg-dark-canvas-default rounded-lg border-2 border-dashed border-[#D0D7DE] dark:border-dark-border-default">
              <Calendar className="mx-auto text-[#57606A] dark:text-dark-fg-muted mb-4" size={48} />
              <h3 className="text-lg font-medium text-[#24292F] dark:text-dark-fg-default mb-2">
                이번 달에는 국경일이 없습니다
              </h3>
              <p className="text-[#57606A] dark:text-dark-fg-muted">다른 달을 선택해보세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#57606A] dark:text-dark-fg-muted">
                총 {holidays.length}개의 국경일이 있습니다
              </p>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {holidays.map((holiday, index) => (
                  <HolidayCard key={index} holiday={holiday} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HolidayPage;
