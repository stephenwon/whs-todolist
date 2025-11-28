import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useUIStore } from './stores/uiStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage';
import TrashPage from './pages/TrashPage';
import HolidayPage from './pages/HolidayPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { isDarkMode, setDarkMode } = useUIStore();

  useEffect(() => {
    // 페이지 로드 시 저장된 다크모드 설정 적용
    const storedData = localStorage.getItem('ui-store');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const storedIsDarkMode = parsedData.state?.isDarkMode ?? false;

        // 저장된 설정을 DOM에 즉시 적용
        if (storedIsDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Failed to parse stored dark mode setting:', error);
      }
    } else {
      // 저장된 설정이 없으면 시스템 설정 감지
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }

    // 시스템 다크모드 설정 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // LocalStorage에 사용자 설정이 없을 때만 시스템 설정 따름
      const storedData = localStorage.getItem('ui-store');
      if (!storedData) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodoListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <TrashPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/holidays"
          element={
            <ProtectedRoute>
              <HolidayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
