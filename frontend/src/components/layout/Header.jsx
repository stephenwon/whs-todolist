import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

/**
 * 헤더 컴포넌트
 * 로고, 네비게이션 링크, 프로필 드롭다운, 로그아웃 버튼 포함
 */
const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-dark-canvas-subtle border-b border-[#D0D7DE] dark:border-dark-border-default sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-semibold text-[#24292F] dark:text-dark-fg-default hover:text-[#2DA44E] dark:hover:text-[#2DA44E] transition-colors"
            >
              <span className="text-2xl">📋</span>
              <span className="hidden sm:inline">WHS-TodoList</span>
              <span className="sm:hidden">WHS</span>
            </Link>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              >
                할일 목록
              </Link>
              <Link
                to="/trash"
                className="px-3 py-2 text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              >
                휴지통
              </Link>
              <Link
                to="/holidays"
                className="px-3 py-2 text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              >
                국경일
              </Link>
            </nav>
          </div>

          {/* 우측 프로필 영역 */}
          <div className="flex items-center gap-2">
            {/* 다크모드 토글 버튼 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* 프로필 드롭다운 */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
                aria-label="프로필 메뉴"
              >
                <User size={18} />
                <span className="hidden sm:inline">{user?.username || '사용자'}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-canvas-subtle border border-[#D0D7DE] dark:border-dark-border-default rounded-md shadow-[0_8px_24px_rgba(140,149,159,0.2)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-20">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#24292F] dark:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default hover:text-[#0969DA] dark:hover:text-[#58A6FF] transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        프로필 설정
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#CF222E] dark:text-[#F85149] hover:bg-[#FFEBE9] dark:hover:bg-[#321C1C] transition-colors"
                      >
                        <LogOut size={16} />
                        로그아웃
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 모바일 메뉴 토글 */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-[#D0D7DE] dark:border-dark-border-default">
            <Link
              to="/"
              className="block px-3 py-2 text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              할일 목록
            </Link>
            <Link
              to="/trash"
              className="block px-3 py-2 text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              휴지통
            </Link>
            <Link
              to="/holidays"
              className="block px-3 py-2 text-sm font-medium text-[#57606A] dark:text-dark-fg-muted hover:text-[#24292F] dark:hover:text-dark-fg-default hover:bg-[#F6F8FA] dark:hover:bg-dark-canvas-default rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              국경일
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
