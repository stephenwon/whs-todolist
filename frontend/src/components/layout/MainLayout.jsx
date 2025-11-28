import PropTypes from 'prop-types';
import Header from './Header';

/**
 * 메인 레이아웃 컴포넌트
 * Header + 콘텐츠 영역으로 구성된 반응형 레이아웃
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 메인 콘텐츠
 */
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-dark-canvas-default transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
