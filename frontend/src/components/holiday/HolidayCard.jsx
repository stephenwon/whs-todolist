import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';

/**
 * 국경일 카드 컴포넌트
 * 국경일 이름, 날짜, 설명 표시
 */
const HolidayCard = ({ holiday }) => {
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const monthNum = Number(month);
    const dayNum = Number(day);
    return year + '년 ' + monthNum + '월 ' + dayNum + '일';
  };

  const getDayOfWeek = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return '';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const monthNum = Number(month) - 1;
    const date = new Date(year, monthNum, day);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  return (
    <div className="bg-white dark:bg-dark-canvas-default border-2 border-[#D0D7DE] dark:border-dark-border-default rounded-lg p-5 hover:border-[#CF222E] dark:hover:border-[#F85149] hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-[#FFEBE9] dark:bg-[#321C1C] rounded-lg flex items-center justify-center">
          <Calendar className="text-[#CF222E] dark:text-[#F85149]" size={24} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#CF222E] dark:text-[#F85149] mb-1">
            {holiday.dateName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[#57606A] dark:text-dark-fg-muted mb-2">
            <span className="font-medium">{formatDate(holiday.locdate)}</span>
            <span className="text-[#CF222E] dark:text-[#F85149] font-medium">({getDayOfWeek(holiday.locdate)}요일)</span>
          </div>
          {holiday.description && (
            <p className="text-sm text-[#57606A] dark:text-dark-fg-muted mt-2 line-clamp-2">
              {holiday.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

HolidayCard.propTypes = {
  holiday: PropTypes.shape({
    dateName: PropTypes.string.isRequired,
    locdate: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default HolidayCard;
