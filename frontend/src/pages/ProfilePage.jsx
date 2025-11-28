import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Moon, Sun, LogOut, Edit2, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { MainLayout } from '../components/layout';
import { Button, Loading, Modal, Input } from '../components/common';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';
import { getProfile, updateProfile } from '../services/userService';
import { formatDate } from '../utils/dateFormatter';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [editUsername, setEditUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const profileData = await getProfile();
      setUser(profileData);
    } catch (err) {
      setError(err.response?.data?.message || '프로필을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUsername = async () => {
    if (!editUsername.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateProfile({ username: editUsername });
      await loadProfile();
      setIsEditModalOpen(false);
      setSuccessMessage('이름이 변경되었습니다.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || '이름 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 6) {
      setError('새 비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    alert('비밀번호 변경 API가 백엔드에 구현되지 않았습니다.');
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading && !user) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-[#57606A]">프로필을 불러올 수 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#24292F] dark:text-dark-fg-default">프로필</h1>
          <p className="mt-1 text-sm text-[#57606A] dark:text-dark-fg-muted">
            계정 정보를 확인하고 설정을 변경하세요
          </p>
        </div>

        {successMessage && (
          <div className="bg-[#DFF6DD] dark:bg-[#26432F] border border-[#2DA44E] dark:border-[#3FB950] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-[#2DA44E] dark:text-[#3FB950] flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-[#1A7F37] dark:text-[#3FB950]">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-[#FFEBE9] dark:bg-[#321C1C] border border-[#CF222E] dark:border-[#F85149] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-[#CF222E] dark:text-[#F85149] flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-[#82071E] dark:text-[#F85149]">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-dark-canvas-subtle border border-[#D0D7DE] dark:border-dark-border-default rounded-lg divide-y divide-[#D0D7DE] dark:divide-dark-border-default transition-colors">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#24292F] dark:text-dark-fg-default mb-4">기본 정보</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F6F8FA] dark:bg-dark-canvas-default rounded-lg flex items-center justify-center">
                  <User className="text-[#57606A] dark:text-dark-fg-muted" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#57606A] dark:text-dark-fg-muted">이름</p>
                  <p className="text-base font-medium text-[#24292F] dark:text-dark-fg-default">{user.username}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditUsername(user.username);
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit2 size={14} className="mr-1" />
                  수정
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F6F8FA] dark:bg-dark-canvas-default rounded-lg flex items-center justify-center">
                  <Mail className="text-[#57606A] dark:text-dark-fg-muted" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#57606A] dark:text-dark-fg-muted">이메일</p>
                  <p className="text-base font-medium text-[#24292F] dark:text-dark-fg-default">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F6F8FA] dark:bg-dark-canvas-default rounded-lg flex items-center justify-center">
                  <Calendar className="text-[#57606A] dark:text-dark-fg-muted" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#57606A] dark:text-dark-fg-muted">가입일</p>
                  <p className="text-base font-medium text-[#24292F] dark:text-dark-fg-default">
                    {formatDate(user.createdAt, 'yyyy년 MM월 dd일')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#24292F] dark:text-dark-fg-default mb-4">보안</h2>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F6F8FA] dark:bg-dark-canvas-default rounded-lg flex items-center justify-center">
                  <Lock className="text-[#57606A] dark:text-dark-fg-muted" size={20} />
                </div>
                <div>
                  <p className="text-base font-medium text-[#24292F] dark:text-dark-fg-default">비밀번호</p>
                  <p className="text-sm text-[#57606A] dark:text-dark-fg-muted">마지막 변경: 알 수 없음</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <Lock size={14} className="mr-1" />
                변경
              </Button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#24292F] dark:text-dark-fg-default mb-4">환경 설정</h2>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#F6F8FA] dark:bg-dark-canvas-default rounded-lg flex items-center justify-center">
                  {isDarkMode ? <Moon className="text-[#57606A] dark:text-dark-fg-muted" size={20} /> : <Sun className="text-[#57606A] dark:text-dark-fg-muted" size={20} />}
                </div>
                <div>
                  <p className="text-base font-medium text-[#24292F] dark:text-dark-fg-default">다크 모드</p>
                  <p className="text-sm text-[#57606A] dark:text-dark-fg-muted">
                    {isDarkMode ? '어두운 테마 사용 중' : '밝은 테마 사용 중'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0969DA] focus:ring-offset-2"
                style={{ backgroundColor: isDarkMode ? '#2DA44E' : '#D0D7DE' }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{ transform: isDarkMode ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                />
              </button>
            </div>
          </div>

          <div className="p-6">
            <Button
              variant="danger"
              onClick={handleLogout}
              className="w-full sm:w-auto"
            >
              <LogOut size={16} className="mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="이름 수정"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleEditUsername}
              loading={isLoading}
            >
              저장
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="이름"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        title="비밀번호 변경"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleChangePassword}
            >
              변경
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            type="password"
            label="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호를 입력하세요"
          />
          <Input
            type="password"
            label="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
          />
          <Input
            type="password"
            label="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </div>
      </Modal>
    </MainLayout>
  );
};

export default ProfilePage;
