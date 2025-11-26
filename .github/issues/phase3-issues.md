# Phase 3: 프론트엔드 개발 이슈 목록

---

## [Phase 3] Task 3.1: 프론트엔드 프로젝트 초기화 (React + Vite + Tailwind)

**Labels**: `setup`, `frontend`, `complexity:low`

### 📋 작업 개요

React 18 + Vite + Tailwind CSS 프로젝트 생성 및 필수 패키지 설치

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] Vite 프로젝트 생성 완료
- [ ] Tailwind CSS 설정 완료
- [ ] 필수 패키지 7개 설치 완료
- [ ] `.env` 파일 작성
- [ ] 개발 서버 실행 확인 (`npm run dev`)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `npm create vite@latest frontend -- --template react` 실행
- [ ] Tailwind CSS 설치 및 설정
- [ ] 필수 패키지 설치:
  - `react-router-dom` (라우팅)
  - `zustand` (상태 관리)
  - `axios` (HTTP 클라이언트)
  - `react-hook-form` (폼 관리)
  - `zod` (스키마 검증)
  - `date-fns` (날짜 처리)
  - `lucide-react` (아이콘)
- [ ] `tailwind.config.js` 설정 (색상, 폰트)
- [ ] `.env` 파일 생성 (`VITE_API_BASE_URL`)

---

### 🔧 기술적 고려사항

- **기술 스택**: React 18, Vite, Tailwind CSS
- **구현 방법**:
  - Vite 템플릿으로 빠른 프로젝트 생성
  - Tailwind CSS 공식 가이드 따라 설정
  - PostCSS 설정 자동 생성
- **Tailwind 설정 예시**:
  ```javascript
  // tailwind.config.js
  export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: '#00C73C', // 네이버 그린
          orange: '#FF7043', // 진행 중
          green: '#66BB6A', // 완료
          red: '#E53935', // 국경일
        },
      },
    },
    plugins: [],
  };
  ```
- **.env 설정**:
  ```env
  VITE_API_BASE_URL=http://localhost:3000/api
  ```
- **주의사항**:
  - Vite 환경 변수는 `VITE_` 접두사 필요
  - Tailwind CSS 설정 후 `npm run dev` 재시작

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- 없음 (독립 작업, 백엔드와 병렬 가능)

#### 후행 작업 (Blocks):
- #20 - Task 3.2: 디렉토리 구조 생성

---

### 📦 산출물

- `frontend/package.json`
- `frontend/tailwind.config.js`
- `frontend/.env`

---

## [Phase 3] Task 3.2: 디렉토리 구조 생성

**Labels**: `setup`, `frontend`, `complexity:low`

### 📋 작업 개요

프론트엔드 프로젝트 폴더 구조 생성

**담당**: 프론트엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 7개 디렉토리 생성
- [ ] 디렉토리 구조가 설계 원칙과 일치

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/components/` (공통, todo, holiday, layout)
  - `src/components/common/`
  - `src/components/todo/`
  - `src/components/holiday/`
  - `src/components/layout/`
- [ ] `src/pages/`
- [ ] `src/stores/`
- [ ] `src/services/`
- [ ] `src/hooks/`
- [ ] `src/utils/`
- [ ] `src/constants/`
- [ ] 기본 파일 생성 (`App.jsx`, `main.jsx`)

---

### 🔧 기술적 고려사항

- **구조 원칙**: 기능별 폴더 구조 (Feature-based Structure)
  - `components/`: 재사용 가능한 컴포넌트
  - `pages/`: 페이지 컴포넌트
  - `stores/`: Zustand 상태 관리
  - `services/`: API 호출 로직
  - `hooks/`: 커스텀 React Hook
  - `utils/`: 유틸리티 함수
  - `constants/`: 상수 정의
- **폴더 역할**:
  - `components/common/`: Button, Input, Modal 등
  - `components/todo/`: TodoCard, TodoList, TodoFilter 등
  - `components/layout/`: Header, MainLayout 등
  - `pages/`: LoginPage, TodoListPage 등

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #19 - Task 3.1: 프론트엔드 프로젝트 초기화

#### 후행 작업 (Blocks):
- #21 - Task 3.3: 상수 정의 및 Axios 인스턴스 설정
- #22 - Task 3.4: 유틸리티 함수 작성
- #24 - Task 3.6: API 서비스 레이어 작성

---

### 📦 산출물

- 프론트엔드 디렉토리 구조 (7개 폴더)

---

## [Phase 3] Task 3.3: 상수 정의 및 Axios 인스턴스 설정

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

API 엔드포인트 상수 정의 및 Axios 인터셉터 설정

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 상수 파일 2개 작성 완료
- [ ] Axios 인스턴스 설정 완료
- [ ] 인터셉터 동작 확인
- [ ] 환경 변수 (`VITE_API_BASE_URL`) 사용 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/constants/apiEndpoints.js` 작성 (API 엔드포인트 상수)
- [ ] `src/constants/todoStatus.js` 작성 (active, completed, deleted)
- [ ] `src/services/api.js` 작성
  - Axios 인스턴스 생성
  - 요청 인터셉터: Authorization 헤더 자동 추가
  - 응답 인터셉터: 401 에러 시 토큰 갱신 시도
  - 에러 핸들링

---

### 🔧 기술적 고려사항

- **기술 스택**: Axios
- **구현 방법**:
  - Axios 인스턴스로 baseURL 설정
  - 요청 인터셉터로 JWT 토큰 자동 추가
  - 응답 인터셉터로 401 에러 시 토큰 갱신 로직
- **코드 예시 (apiEndpoints.js)**:
  ```javascript
  export const API_ENDPOINTS = {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',

    // Todos
    TODOS: '/todos',
    TODO_BY_ID: (id) => `/todos/${id}`,
    TODO_COMPLETE: (id) => `/todos/${id}/complete`,
    TODO_RESTORE: (id) => `/todos/${id}/restore`,

    // Trash
    TRASH: '/trash',
    TRASH_BY_ID: (id) => `/trash/${id}`,

    // Holidays
    HOLIDAYS: '/holidays',
    HOLIDAY_BY_ID: (id) => `/holidays/${id}`,

    // User
    PROFILE: '/users/me',
  };
  ```
- **코드 예시 (api.js)**:
  ```javascript
  import axios from 'axios';
  import { getAccessToken, getRefreshToken, setAccessToken } from '../utils/tokenManager';

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터: JWT 토큰 자동 추가
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: 401 에러 시 토큰 갱신
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data.data;
          setAccessToken(accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그아웃 처리
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  export default api;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #20 - Task 3.2: 디렉토리 구조 생성

#### 후행 작업 (Blocks):
- #24 - Task 3.6: API 서비스 레이어 작성

---

### 📦 산출물

- `frontend/src/constants/apiEndpoints.js`
- `frontend/src/constants/todoStatus.js`
- `frontend/src/services/api.js`

---

## [Phase 3] Task 3.4: 유틸리티 함수 작성

**Labels**: `feature`, `frontend`, `complexity:low`

### 📋 작업 개요

날짜 포맷팅, 토큰 관리, 검증 유틸리티 함수 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 3개 유틸리티 파일 작성 완료
- [ ] 토큰 저장/조회 동작 확인
- [ ] 날짜 포맷팅 동작 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/utils/dateFormatter.js` 작성 (날짜 포맷팅)
- [ ] `src/utils/tokenManager.js` 작성 (LocalStorage에 토큰 저장/조회/삭제)
- [ ] `src/utils/validator.js` 작성 (이메일, 비밀번호 검증)

---

### 🔧 기술적 고려사항

- **기술 스택**: date-fns, LocalStorage API
- **구현 방법**:
  - date-fns로 날짜 포맷팅
  - LocalStorage로 토큰 관리
  - 정규식으로 검증
- **코드 예시 (dateFormatter.js)**:
  ```javascript
  import { format, parseISO, isAfter, isBefore } from 'date-fns';
  import { ko } from 'date-fns/locale';

  export const formatDate = (date, formatString = 'yyyy-MM-dd') => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatString, { locale: ko });
  };

  export const formatDateTime = (date) => {
    return formatDate(date, 'yyyy-MM-dd HH:mm');
  };

  export const isExpired = (dueDate) => {
    if (!dueDate) return false;
    return isBefore(parseISO(dueDate), new Date());
  };
  ```
- **코드 예시 (tokenManager.js)**:
  ```javascript
  const ACCESS_TOKEN_KEY = 'accessToken';
  const REFRESH_TOKEN_KEY = 'refreshToken';

  export const setAccessToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  };

  export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  };

  export const setRefreshToken = (token) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  };

  export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  };

  export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };
  ```
- **코드 예시 (validator.js)**:
  ```javascript
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  export const validatePassword = (password) => {
    return password.length >= 8;
  };
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #20 - Task 3.2: 디렉토리 구조 생성

#### 후행 작업 (Blocks):
- #23 - Task 3.5: Zustand 스토어 설정 (authStore)

---

### 📦 산출물

- `frontend/src/utils/dateFormatter.js`
- `frontend/src/utils/tokenManager.js`
- `frontend/src/utils/validator.js`

---

## [Phase 3] Task 3.5: Zustand 스토어 설정 (authStore)

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

인증 상태 관리를 위한 Zustand 스토어 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] authStore 작성 완료
- [ ] 로그인/회원가입/로그아웃 동작 확인
- [ ] 토큰 저장 확인
- [ ] 에러 상태 관리 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/stores/authStore.js` 작성
  - State: `user`, `isAuthenticated`, `isLoading`, `error`
  - Actions: `login(email, password)`, `register(email, password, username)`, `logout()`, `refreshToken()`
  - API 호출 (authService)
  - 토큰 저장 (tokenManager)

---

### 🔧 기술적 고려사항

- **기술 스택**: Zustand
- **구현 방법**:
  - Zustand의 `create` 함수로 스토어 생성
  - 비동기 액션에서 isLoading 상태 관리
  - API 호출 후 토큰 저장
- **코드 예시**:
  ```javascript
  import { create } from 'zustand';
  import * as authService from '../services/authService';
  import { setAccessToken, setRefreshToken, clearTokens } from '../utils/tokenManager';

  const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authService.login(email, password);
        const { accessToken, refreshToken, user } = response.data;

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({
          error: error.response?.data?.error?.message || '로그인에 실패했습니다',
          isLoading: false
        });
      }
    },

    register: async (email, password, username) => {
      set({ isLoading: true, error: null });
      try {
        await authService.register(email, password, username);
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error.response?.data?.error?.message || '회원가입에 실패했습니다',
          isLoading: false
        });
      }
    },

    logout: () => {
      clearTokens();
      set({ user: null, isAuthenticated: false });
    },
  }));

  export default useAuthStore;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #21 - Task 3.3: 상수 정의 및 Axios 인스턴스 설정
- #22 - Task 3.4: 유틸리티 함수 작성

#### 후행 작업 (Blocks):
- #27 - Task 3.9: 라우팅 설정
- #29 - Task 3.11: 인증 화면 구현

---

### 📦 산출물

- `frontend/src/stores/authStore.js`

---

## [Phase 3] Task 3.6: API 서비스 레이어 작성

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

모든 API 호출 함수 작성 (인증, 할일, 국경일, 사용자)

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 4개 서비스 파일 작성 완료
- [ ] Axios 인스턴스 사용 확인
- [ ] API 엔드포인트 상수 사용 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/services/authService.js` 작성
  - `login(email, password)`
  - `register(email, password, username)`
  - `refreshToken(refreshToken)`
- [ ] `src/services/todoService.js` 작성
  - `getTodos(filters)`
  - `getTodoById(id)`
  - `createTodo(todoData)`
  - `updateTodo(id, updateData)`
  - `completeTodo(id)`
  - `deleteTodo(id)`
  - `restoreTodo(id)`
- [ ] `src/services/holidayService.js` 작성
  - `getHolidays(year, month)`
- [ ] `src/services/userService.js` 작성
  - `getProfile()`
  - `updateProfile(updateData)`

---

### 🔧 기술적 고려사항

- **기술 스택**: Axios
- **구현 방법**:
  - Axios 인스턴스 사용 (api.js)
  - API 엔드포인트 상수 사용 (apiEndpoints.js)
  - 응답 데이터만 반환 (`response.data`)
- **코드 예시 (authService.js)**:
  ```javascript
  import api from './api';
  import { API_ENDPOINTS } from '../constants/apiEndpoints';

  export const login = (email, password) => {
    return api.post(API_ENDPOINTS.LOGIN, { email, password });
  };

  export const register = (email, password, username) => {
    return api.post(API_ENDPOINTS.REGISTER, { email, password, username });
  };

  export const refreshToken = (refreshToken) => {
    return api.post(API_ENDPOINTS.REFRESH, { refreshToken });
  };
  ```
- **코드 예시 (todoService.js)**:
  ```javascript
  import api from './api';
  import { API_ENDPOINTS } from '../constants/apiEndpoints';

  export const getTodos = (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`${API_ENDPOINTS.TODOS}?${params}`);
  };

  export const createTodo = (todoData) => {
    return api.post(API_ENDPOINTS.TODOS, todoData);
  };

  export const updateTodo = (id, updateData) => {
    return api.put(API_ENDPOINTS.TODO_BY_ID(id), updateData);
  };

  export const completeTodo = (id) => {
    return api.patch(API_ENDPOINTS.TODO_COMPLETE(id));
  };

  export const deleteTodo = (id) => {
    return api.delete(API_ENDPOINTS.TODO_BY_ID(id));
  };

  export const restoreTodo = (id) => {
    return api.patch(API_ENDPOINTS.TODO_RESTORE(id));
  };
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #21 - Task 3.3: 상수 정의 및 Axios 인스턴스 설정

#### 후행 작업 (Blocks):
- #25 - Task 3.7: Zustand 스토어 설정 (todoStore, holidayStore, uiStore)

---

### 📦 산출물

- `frontend/src/services/authService.js`
- `frontend/src/services/todoService.js`
- `frontend/src/services/holidayService.js`
- `frontend/src/services/userService.js`

---

## [Phase 3] Task 3.7: Zustand 스토어 설정 (todoStore, holidayStore, uiStore)

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

할일, 국경일, UI 상태 관리를 위한 Zustand 스토어 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 3개 스토어 작성 완료
- [ ] 서비스 레이어 호출 확인
- [ ] 상태 업데이트 동작 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/stores/todoStore.js` 작성
  - State: `todos`, `isLoading`, `error`, `filters`
  - Actions: `fetchTodos()`, `createTodo()`, `updateTodo()`, `deleteTodo()`, `restoreTodo()`, `setFilters()`
- [ ] `src/stores/holidayStore.js` 작성
  - State: `holidays`, `isLoading`, `error`
  - Actions: `fetchHolidays(year, month)`
- [ ] `src/stores/uiStore.js` 작성
  - State: `isModalOpen`, `modalType`, `selectedTodo`, `isDarkMode`
  - Actions: `openModal()`, `closeModal()`, `toggleDarkMode()`

---

### 🔧 기술적 고려사항

- **기술 스택**: Zustand
- **구현 방법**:
  - 서비스 레이어 함수 호출
  - 비동기 액션에서 isLoading 상태 관리
  - 에러 처리
- **코드 예시 (todoStore.js)**:
  ```javascript
  import { create } from 'zustand';
  import * as todoService from '../services/todoService';

  const useTodoStore = create((set, get) => ({
    todos: [],
    isLoading: false,
    error: null,
    filters: {
      status: 'active',
      search: '',
      sortBy: 'createdAt',
      order: 'desc',
    },

    fetchTodos: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await todoService.getTodos(get().filters);
        set({ todos: response.data.data, isLoading: false });
      } catch (error) {
        set({
          error: error.response?.data?.error?.message || '할일 조회에 실패했습니다',
          isLoading: false
        });
      }
    },

    createTodo: async (todoData) => {
      set({ isLoading: true, error: null });
      try {
        await todoService.createTodo(todoData);
        await get().fetchTodos();
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error.response?.data?.error?.message || '할일 생성에 실패했습니다',
          isLoading: false
        });
      }
    },

    setFilters: (newFilters) => {
      set({ filters: { ...get().filters, ...newFilters } });
      get().fetchTodos();
    },
  }));

  export default useTodoStore;
  ```
- **코드 예시 (uiStore.js)**:
  ```javascript
  import { create } from 'zustand';

  const useUIStore = create((set) => ({
    isModalOpen: false,
    modalType: null, // 'create', 'edit'
    selectedTodo: null,
    isDarkMode: localStorage.getItem('darkMode') === 'true',

    openModal: (type, todo = null) => {
      set({ isModalOpen: true, modalType: type, selectedTodo: todo });
    },

    closeModal: () => {
      set({ isModalOpen: false, modalType: null, selectedTodo: null });
    },

    toggleDarkMode: () => {
      set((state) => {
        const newDarkMode = !state.isDarkMode;
        localStorage.setItem('darkMode', newDarkMode.toString());
        return { isDarkMode: newDarkMode };
      });
    },
  }));

  export default useUIStore;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #24 - Task 3.6: API 서비스 레이어 작성

#### 후행 작업 (Blocks):
- #31 - Task 3.13: 할일 목록 페이지 구현
- #32 - Task 3.14: 할일 추가/수정 모달 구현
- #34 - Task 3.16: 국경일 페이지 구현

---

### 📦 산출물

- `frontend/src/stores/todoStore.js`
- `frontend/src/stores/holidayStore.js`
- `frontend/src/stores/uiStore.js`

---

## [Phase 3] Task 3.8: 공통 컴포넌트 구현 (Button, Input, Modal)

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

재사용 가능한 공통 UI 컴포넌트 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 4개 공통 컴포넌트 작성 완료
- [ ] Tailwind CSS 스타일링 적용
- [ ] Props 검증 (PropTypes 또는 주석)
- [ ] 재사용성 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/components/common/Button.jsx` 작성
  - 버튼 variants (primary, secondary, danger)
  - 크기 옵션 (sm, md, lg)
  - 로딩 상태 지원
- [ ] `src/components/common/Input.jsx` 작성
  - 입력 필드 (text, email, password, date)
  - 에러 상태 표시
  - 레이블 지원
- [ ] `src/components/common/Modal.jsx` 작성
  - 모달 오버레이
  - 닫기 버튼
  - 제목, 본문, 액션 슬롯
- [ ] `src/components/common/Loading.jsx` 작성 (로딩 스피너)

---

### 🔧 기술적 고려사항

- **기술 스택**: React, Tailwind CSS
- **구현 방법**:
  - Tailwind CSS로 스타일링
  - Props로 옵션 제어
  - 재사용 가능한 구조
- **코드 예시 (Button.jsx)**:
  ```jsx
  const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    onClick,
    ...props
  }) => {
    const baseClasses = 'rounded-lg font-medium transition-colors';

    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-green-600',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
        onClick={onClick}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? '로딩 중...' : children}
      </button>
    );
  };

  export default Button;
  ```
- **코드 예시 (Modal.jsx)**:
  ```jsx
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  export default Modal;
  ```
- **UI/UX 요구사항** (PRD 10):
  - 색상: Primary (#00C73C), Orange (#FF7043), Green (#66BB6A), Red (#E53935)
  - 터치 친화적 버튼 크기 (최소 44x44px)
  - WCAG AA 준수 (색상 대비 4.5:1)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #20 - Task 3.2: 디렉토리 구조 생성

#### 후행 작업 (Blocks):
- #29 - Task 3.11: 인증 화면 구현
- #30 - Task 3.12: 할일 관련 컴포넌트 구현
- #32 - Task 3.14: 할일 추가/수정 모달 구현

---

### 📦 산출물

- `frontend/src/components/common/Button.jsx`
- `frontend/src/components/common/Input.jsx`
- `frontend/src/components/common/Modal.jsx`
- `frontend/src/components/common/Loading.jsx`

---

## [Phase 3] Task 3.9: 라우팅 설정 (React Router)

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

React Router를 사용한 페이지 라우팅 및 Protected Route 설정

**담당**: 프론트엔드 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 6개 라우트 정의 완료
- [ ] Protected Route 동작 확인
- [ ] 인증 체크 동작 확인
- [ ] 리다이렉트 동작 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/routes.jsx` 작성
- [ ] 라우트 정의:
  - `/login` (LoginPage)
  - `/register` (RegisterPage)
  - `/` (TodoListPage) - 인증 필요
  - `/trash` (TrashPage) - 인증 필요
  - `/holidays` (HolidayPage) - 인증 필요
  - `/profile` (ProfilePage) - 인증 필요
- [ ] Protected Route 컴포넌트 작성 (인증 체크)
- [ ] 인증되지 않은 사용자는 `/login`으로 리다이렉트

---

### 🔧 기술적 고려사항

- **기술 스택**: react-router-dom v6
- **구현 방법**:
  - `BrowserRouter`, `Routes`, `Route` 사용
  - Protected Route 컴포넌트로 인증 체크
  - `Navigate` 컴포넌트로 리다이렉트
- **코드 예시 (routes.jsx)**:
  ```jsx
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import useAuthStore from './stores/authStore';

  import LoginPage from './pages/LoginPage';
  import RegisterPage from './pages/RegisterPage';
  import TodoListPage from './pages/TodoListPage';
  import TrashPage from './pages/TrashPage';
  import HolidayPage from './pages/HolidayPage';
  import ProfilePage from './pages/ProfilePage';

  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const AppRoutes = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<ProtectedRoute><TodoListPage /></ProtectedRoute>} />
          <Route path="/trash" element={<ProtectedRoute><TrashPage /></ProtectedRoute>} />
          <Route path="/holidays" element={<ProtectedRoute><HolidayPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    );
  };

  export default AppRoutes;
  ```
- **화면 플로우** (PRD 10.1):
  ```
  [로그인] → [할일 목록 (메인)]
              ├→ [할일 추가 모달]
              ├→ [휴지통]
              ├→ [국경일 조회]
              └→ [프로필]
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #23 - Task 3.5: Zustand 스토어 설정 (authStore)

#### 후행 작업 (Blocks):
- #28 - Task 3.10: 레이아웃 컴포넌트 구현

---

### 📦 산출물

- `frontend/src/routes.jsx`
- `frontend/src/components/ProtectedRoute.jsx` (선택)

---

## [Phase 3] Task 3.10: 레이아웃 컴포넌트 구현 (Header, MainLayout)

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

헤더 네비게이션 및 메인 레이아웃 컴포넌트 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] Header 컴포넌트 작성 완료
- [ ] MainLayout 컴포넌트 작성 완료
- [ ] 네비게이션 링크 동작 확인
- [ ] 로그아웃 동작 확인
- [ ] 반응형 디자인 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/components/layout/Header.jsx` 작성
  - 로고
  - 네비게이션 링크 (할일 목록, 휴지통, 국경일, 프로필)
  - 로그아웃 버튼
  - 다크모드 토글 (선택)
- [ ] `src/components/layout/MainLayout.jsx` 작성
  - Header + 콘텐츠 영역
  - 반응형 디자인

---

### 🔧 기술적 고려사항

- **기술 스택**: React, react-router-dom, Tailwind CSS
- **구현 방법**:
  - `Link` 컴포넌트로 페이지 이동
  - authStore의 logout 액션 호출
  - Tailwind CSS 반응형 유틸리티 사용
- **코드 예시 (Header.jsx)**:
  ```jsx
  import { Link, useNavigate } from 'react-router-dom';
  import useAuthStore from '../../stores/authStore';
  import Button from '../common/Button';

  const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            WHS-TodoList
          </Link>

          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-primary">할일 목록</Link>
            <Link to="/trash" className="text-gray-700 hover:text-primary">휴지통</Link>
            <Link to="/holidays" className="text-gray-700 hover:text-primary">국경일</Link>
            <Link to="/profile" className="text-gray-700 hover:text-primary">프로필</Link>

            <span className="text-gray-600">{user?.username}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              로그아웃
            </Button>
          </nav>
        </div>
      </header>
    );
  };

  export default Header;
  ```
- **코드 예시 (MainLayout.jsx)**:
  ```jsx
  import Header from './Header';

  const MainLayout = ({ children }) => {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    );
  };

  export default MainLayout;
  ```
- **반응형 디자인** (PRD 10.4):
  - 모바일 (<768px): 햄버거 메뉴
  - 데스크톱 (>=768px): 전체 네비게이션

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #23 - Task 3.5: Zustand 스토어 설정 (authStore)
- #27 - Task 3.9: 라우팅 설정

#### 후행 작업 (Blocks):
- #29 - Task 3.11: 인증 화면 구현

---

### 📦 산출물

- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/layout/MainLayout.jsx`

---

## [Phase 3] Task 3.11: 인증 화면 구현 (로그인, 회원가입)

**Labels**: `feature`, `frontend`, `complexity:high`

### 📋 작업 개요

로그인 및 회원가입 페이지 구현 (폼 검증 포함)

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 로그인 페이지 작성 완료
- [ ] 회원가입 페이지 작성 완료
- [ ] 폼 검증 동작 확인
- [ ] API 연동 확인
- [ ] 에러 메시지 표시 확인
- [ ] 페이지 전환 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/pages/LoginPage.jsx` 작성
  - 이메일, 비밀번호 입력 필드
  - 로그인 버튼
  - 회원가입 링크
  - React Hook Form + Zod 검증
  - authStore 연동
  - 로그인 성공 시 `/` 이동
- [ ] `src/pages/RegisterPage.jsx` 작성
  - 이메일, 비밀번호, 사용자 이름 입력 필드
  - 회원가입 버튼
  - 로그인 링크
  - React Hook Form + Zod 검증
  - authStore 연동
  - 회원가입 성공 시 `/login` 이동
- [ ] 에러 메시지 표시

---

### 🔧 기술적 고려사항

- **기술 스택**: React, react-hook-form, zod, Tailwind CSS
- **구현 방법**:
  - Zod 스키마로 검증 규칙 정의
  - React Hook Form으로 폼 관리
  - authStore 액션 호출
- **코드 예시 (LoginPage.jsx)**:
  ```jsx
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';
  import { Link, useNavigate } from 'react-router-dom';
  import useAuthStore from '../stores/authStore';
  import Button from '../components/common/Button';
  import Input from '../components/common/Input';

  const loginSchema = z.object({
    email: z.string().email('유효한 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  });

  const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
      await login(data.email, data.password);
      if (useAuthStore.getState().isAuthenticated) {
        navigate('/');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="이메일"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="비밀번호"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              로그인
            </Button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            계정이 없으신가요?{' '}
            <Link to="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    );
  };

  export default LoginPage;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #23 - Task 3.5: Zustand 스토어 설정 (authStore)
- #26 - Task 3.8: 공통 컴포넌트 구현

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`

---

## [Phase 3] Task 3.12: 할일 관련 컴포넌트 구현

**Labels**: `feature`, `frontend`, `complexity:high`

### 📋 작업 개요

할일 카드, 목록, 필터 컴포넌트 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 4시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 3개 컴포넌트 작성 완료
- [ ] 할일 카드 스타일링 완료
- [ ] 필터/검색 동작 확인
- [ ] 상태별 색상 표시 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/components/todo/TodoCard.jsx` 작성
  - 할일 제목, 내용, 날짜 표시
  - 완료 체크박스
  - 수정, 삭제 버튼
  - 상태별 색상 구분 (진행 중: 주황, 완료: 초록)
  - 만료일 지난 할일 표시
- [ ] `src/components/todo/TodoList.jsx` 작성
  - TodoCard 목록 렌더링
  - 빈 상태 표시 ("할일이 없습니다")
- [ ] `src/components/todo/TodoFilter.jsx` 작성
  - 상태 필터 (전체, 진행 중, 완료)
  - 정렬 옵션 (날짜, 생성일)
  - 검색 입력 필드

---

### 🔧 기술적 고려사항

- **기술 스택**: React, Tailwind CSS, lucide-react
- **구현 방법**:
  - 조건부 클래스로 상태별 색상 적용
  - 아이콘 라이브러리 사용 (lucide-react)
  - 이벤트 핸들러로 액션 전달
- **코드 예시 (TodoCard.jsx)**:
  ```jsx
  import { Check, Edit2, Trash2 } from 'lucide-react';
  import { formatDate, isExpired } from '../../utils/dateFormatter';

  const TodoCard = ({ todo, onComplete, onEdit, onDelete }) => {
    const statusColors = {
      active: 'border-orange-400 bg-orange-50',
      completed: 'border-green-400 bg-green-50',
    };

    const isOverdue = isExpired(todo.dueDate) && todo.status === 'active';

    return (
      <div className={`border-2 rounded-lg p-4 ${statusColors[todo.status]}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${todo.isCompleted ? 'line-through' : ''}`}>
              {todo.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{todo.content}</p>

            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              {todo.startDate && <span>시작: {formatDate(todo.startDate)}</span>}
              {todo.dueDate && (
                <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                  마감: {formatDate(todo.dueDate)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => onComplete(todo.todoId)} className="p-2 hover:bg-white rounded">
              <Check size={20} />
            </button>
            <button onClick={() => onEdit(todo)} className="p-2 hover:bg-white rounded">
              <Edit2 size={20} />
            </button>
            <button onClick={() => onDelete(todo.todoId)} className="p-2 hover:bg-white rounded">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default TodoCard;
  ```
- **UI 요구사항** (PRD 10.3):
  - 상태별 색상: 진행 중(주황), 완료(초록), 삭제(회색)
  - 만료일 지난 할일: 빨간색 표시

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #26 - Task 3.8: 공통 컴포넌트 구현

#### 후행 작업 (Blocks):
- #31 - Task 3.13: 할일 목록 페이지 구현
- #33 - Task 3.15: 휴지통 페이지 구현

---

### 📦 산출물

- `frontend/src/components/todo/TodoCard.jsx`
- `frontend/src/components/todo/TodoList.jsx`
- `frontend/src/components/todo/TodoFilter.jsx`

---

## [Phase 3] Task 3.13: 할일 목록 페이지 구현

**Labels**: `feature`, `frontend`, `complexity:high`

### 📋 작업 개요

할일 목록 메인 페이지 구현 (필터, 검색, CRUD 통합)

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 할일 목록 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 필터링/검색 동작 확인
- [ ] 로딩/에러 상태 표시 확인
- [ ] 반응형 디자인 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/pages/TodoListPage.jsx` 작성
  - TodoFilter 컴포넌트 배치
  - TodoList 컴포넌트 배치
  - 할일 추가 버튼 (FAB)
  - todoStore 연동
  - 페이지 로드 시 할일 목록 조회
  - 로딩 상태 표시
  - 에러 상태 표시

---

### 🔧 기술적 고려사항

- **기술 스택**: React, Zustand
- **구현 방법**:
  - useEffect로 초기 데이터 로딩
  - todoStore의 상태 구독
  - FAB(Floating Action Button) 스타일
- **코드 예시**:
  ```jsx
  import { useEffect } from 'react';
  import { Plus } from 'lucide-react';
  import MainLayout from '../components/layout/MainLayout';
  import TodoFilter from '../components/todo/TodoFilter';
  import TodoList from '../components/todo/TodoList';
  import Loading from '../components/common/Loading';
  import Button from '../components/common/Button';
  import useTodoStore from '../stores/todoStore';
  import useUIStore from '../stores/uiStore';

  const TodoListPage = () => {
    const { todos, isLoading, error, fetchTodos, completeTodo, deleteTodo } = useTodoStore();
    const { openModal } = useUIStore();

    useEffect(() => {
      fetchTodos();
    }, []);

    if (isLoading) return <Loading />;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">할일 목록</h1>

          <TodoFilter />

          <TodoList
            todos={todos}
            onComplete={completeTodo}
            onEdit={(todo) => openModal('edit', todo)}
            onDelete={deleteTodo}
          />

          {/* FAB */}
          <button
            onClick={() => openModal('create')}
            className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-green-600"
          >
            <Plus size={24} />
          </button>
        </div>
      </MainLayout>
    );
  };

  export default TodoListPage;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #25 - Task 3.7: Zustand 스토어 설정 (todoStore, uiStore)
- #30 - Task 3.12: 할일 관련 컴포넌트 구현

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- `frontend/src/pages/TodoListPage.jsx`

---

## [Phase 3] Task 3.14: 할일 추가/수정 모달 구현

**Labels**: `feature`, `frontend`, `complexity:high`

### 📋 작업 개요

할일 생성 및 수정 모달 폼 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] TodoForm 컴포넌트 작성 완료
- [ ] 모달 동작 확인
- [ ] 폼 검증 동작 확인
- [ ] API 연동 확인 (생성/수정)
- [ ] 추가/수정 모드 전환 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/components/todo/TodoForm.jsx` 작성
  - 제목, 내용, 시작일, 만료일 입력 필드
  - React Hook Form + Zod 검증
  - 날짜 검증 (만료일 >= 시작일)
  - 저장 버튼, 취소 버튼
  - 추가/수정 모드 지원
- [ ] Modal 컴포넌트와 통합
- [ ] uiStore, todoStore 연동

---

### 🔧 기술적 고려사항

- **기술 스택**: React, react-hook-form, zod
- **구현 방법**:
  - Zod 스키마로 날짜 검증
  - 모달 타입에 따라 초기값 설정 (생성/수정)
  - todoStore 액션 호출
- **코드 예시 (TodoForm.jsx)**:
  ```jsx
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';
  import Modal from '../common/Modal';
  import Input from '../common/Input';
  import Button from '../common/Button';
  import useTodoStore from '../../stores/todoStore';
  import useUIStore from '../../stores/uiStore';

  const todoSchema = z.object({
    title: z.string().min(1, '제목을 입력하세요').max(200),
    content: z.string().optional(),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
  }).refine((data) => {
    if (data.startDate && data.dueDate) {
      return new Date(data.dueDate) >= new Date(data.startDate);
    }
    return true;
  }, {
    message: '만료일은 시작일보다 이전일 수 없습니다',
    path: ['dueDate'],
  });

  const TodoForm = () => {
    const { isModalOpen, modalType, selectedTodo, closeModal } = useUIStore();
    const { createTodo, updateTodo } = useTodoStore();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
      resolver: zodResolver(todoSchema),
      defaultValues: selectedTodo || {},
    });

    const onSubmit = async (data) => {
      if (modalType === 'create') {
        await createTodo(data);
      } else {
        await updateTodo(selectedTodo.todoId, data);
      }
      closeModal();
      reset();
    };

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalType === 'create' ? '할일 추가' : '할일 수정'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input label="제목" {...register('title')} error={errors.title?.message} />
          <Input label="내용" {...register('content')} />
          <Input label="시작일" type="date" {...register('startDate')} />
          <Input label="만료일" type="date" {...register('dueDate')} error={errors.dueDate?.message} />

          <div className="flex gap-2 mt-4">
            <Button type="submit">저장</Button>
            <Button type="button" variant="secondary" onClick={closeModal}>
              취소
            </Button>
          </div>
        </form>
      </Modal>
    );
  };

  export default TodoForm;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #25 - Task 3.7: Zustand 스토어 설정 (todoStore, uiStore)
- #26 - Task 3.8: 공통 컴포넌트 구현 (Modal)

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- `frontend/src/components/todo/TodoForm.jsx`

---

## [Phase 3] Task 3.15: 휴지통 페이지 구현

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

삭제된 할일 목록 표시 및 복원/영구삭제 기능 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 휴지통 페이지 작성 완료
- [ ] API 연동 확인 (복원, 영구 삭제)
- [ ] 버튼 동작 확인
- [ ] 빈 상태 표시 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/pages/TrashPage.jsx` 작성
  - 삭제된 할일 목록 표시
  - 복원 버튼
  - 영구 삭제 버튼
  - todoStore 연동 (status='deleted' 필터)
  - 빈 상태 표시

---

### 🔧 기술적 고려사항

- **기술 스택**: React, Zustand
- **구현 방법**:
  - todoStore의 setFilters로 status='deleted' 필터
  - restoreTodo, permanentlyDelete 액션 호출
- **코드 예시**:
  ```jsx
  import { useEffect } from 'react';
  import { RotateCcw, Trash2 } from 'lucide-react';
  import MainLayout from '../components/layout/MainLayout';
  import useTodoStore from '../stores/todoStore';

  const TrashPage = () => {
    const { todos, fetchTodos, restoreTodo, permanentlyDelete, setFilters } = useTodoStore();

    useEffect(() => {
      setFilters({ status: 'deleted' });
      fetchTodos();
    }, []);

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">휴지통</h1>

          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">휴지통이 비어있습니다</p>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => (
                <div key={todo.todoId} className="bg-white border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-semibold">{todo.title}</h3>
                    <p className="text-sm text-gray-500">
                      삭제일: {new Date(todo.deletedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => restoreTodo(todo.todoId)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('영구적으로 삭제하시겠습니까?')) {
                          permanentlyDelete(todo.todoId);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    );
  };

  export default TrashPage;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #25 - Task 3.7: Zustand 스토어 설정 (todoStore)
- #30 - Task 3.12: 할일 관련 컴포넌트 구현 (TodoCard)

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- `frontend/src/pages/TrashPage.jsx`

---

## [Phase 3] Task 3.16: 국경일 페이지 구현

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

국경일 목록 표시 및 연도/월 필터 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] HolidayCard 컴포넌트 작성 완료
- [ ] 국경일 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 필터 동작 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/components/holiday/HolidayCard.jsx` 작성
  - 국경일 이름, 날짜, 설명 표시
  - 빨간색 테마
- [ ] `src/pages/HolidayPage.jsx` 작성
  - HolidayCard 목록 렌더링
  - 연도/월 필터
  - holidayStore 연동
  - 로딩 상태 표시

---

### 🔧 기술적 고려사항

- **기술 스택**: React, Zustand
- **구현 방법**:
  - holidayStore의 fetchHolidays 액션 호출
  - 드롭다운으로 연도/월 필터
- **코드 예시 (HolidayCard.jsx)**:
  ```jsx
  import { Calendar } from 'lucide-react';
  import { formatDate } from '../../utils/dateFormatter';

  const HolidayCard = ({ holiday }) => {
    return (
      <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-red-600" size={20} />
          <h3 className="text-lg font-bold text-red-600">{holiday.title}</h3>
        </div>
        <p className="text-gray-700 mt-2">{formatDate(holiday.date)}</p>
        {holiday.description && (
          <p className="text-sm text-gray-600 mt-1">{holiday.description}</p>
        )}
      </div>
    );
  };

  export default HolidayCard;
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #25 - Task 3.7: Zustand 스토어 설정 (holidayStore)

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- `frontend/src/components/holiday/HolidayCard.jsx`
- `frontend/src/pages/HolidayPage.jsx`

---

## [Phase 3] Task 3.17: 프로필 페이지 구현

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

사용자 프로필 조회 및 수정 페이지 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P1

---

### ✅ 완료 조건

- [ ] 프로필 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 정보 수정 동작 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/pages/ProfilePage.jsx` 작성
  - 사용자 정보 표시 (이메일, 이름, 가입일)
  - 사용자 이름 수정
  - 비밀번호 변경
  - authStore, userService 연동

---

### 🔧 기술적 고려사항

- **기술 스택**: React, react-hook-form, zod
- **구현 방법**:
  - getProfile API로 초기 데이터 로드
  - updateProfile API로 정보 수정
  - 폼 검증

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #23 - Task 3.5: Zustand 스토어 설정 (authStore)
- #24 - Task 3.6: API 서비스 레이어 작성 (userService)

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- `frontend/src/pages/ProfilePage.jsx`

---

## [Phase 3] Task 3.18: 반응형 디자인 적용

**Labels**: `feature`, `frontend`, `complexity:high`

### 📋 작업 개요

모든 페이지 및 컴포넌트에 반응형 디자인 적용

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 모든 페이지 반응형 동작 확인
- [ ] 모바일 화면에서 사용 가능
- [ ] 터치 UI 최적화 확인
- [ ] 크로스 브라우저 테스트 (Chrome, Safari)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] Tailwind CSS 브레이크포인트 활용
- [ ] 모바일 (< 768px) 최적화
  - 헤더 네비게이션 → 햄버거 메뉴
  - 할일 카드 스택 레이아웃
  - 터치 친화적 버튼 크기 (44x44px 이상)
- [ ] 태블릿/데스크톱 (>= 768px) 레이아웃
- [ ] 모바일 테스트 (Chrome DevTools)

---

### 🔧 기술적 고려사항

- **기술 스택**: Tailwind CSS 반응형 유틸리티
- **구현 방법**:
  - `sm:`, `md:`, `lg:` 브레이크포인트 사용
  - 모바일 퍼스트 접근
- **브레이크포인트** (PRD 10.4):
  - mobile: 480px
  - tablet: 768px
  - desktop: 1024px
- **모바일 최적화**:
  - 터치 친화적 버튼 크기 (최소 44x44px)
  - 하단 고정 네비게이션 바
  - 풀스크린 모달

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #31 - Task 3.13: 할일 목록 페이지 구현
- #33 - Task 3.15: 휴지통 페이지 구현
- #34 - Task 3.16: 국경일 페이지 구현
- #35 - Task 3.17: 프로필 페이지 구현

#### 후행 작업 (Blocks):
- #37 - Task 3.19: 다크모드 구현

---

### 📦 산출물

- 반응형 스타일 적용 완료

---

## [Phase 3] Task 3.19: 다크모드 구현 (선택)

**Labels**: `feature`, `frontend`, `complexity:medium`

### 📋 작업 개요

다크모드 토글 기능 및 테마 전환 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P1

---

### ✅ 완료 조건

- [ ] 다크모드 토글 동작 확인
- [ ] LocalStorage 저장 확인
- [ ] 모든 페이지 다크모드 적용 확인
- [ ] 색상 대비 확인 (WCAG AA)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] Tailwind CSS `dark:` 유틸리티 사용
- [ ] uiStore에 `isDarkMode` 상태 추가
- [ ] LocalStorage에 다크모드 설정 저장
- [ ] 시스템 설정 감지 (`prefers-color-scheme`)
- [ ] Header에 다크모드 토글 버튼 추가

---

### 🔧 기술적 고려사항

- **기술 스택**: Tailwind CSS, LocalStorage
- **구현 방법**:
  - Tailwind의 `dark:` 클래스 사용
  - `<html>` 태그에 `dark` 클래스 추가/제거
  - 시스템 설정 감지
- **다크모드 색상** (PRD 10.5):
  - 배경: #1A1A1A
  - 텍스트: #E5E5E5
  - Primary: #00E047 (밝은 그린)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #36 - Task 3.18: 반응형 디자인 적용

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- 다크모드 기능 완성

---

## [Phase 3] Task 3.20: 프론트엔드 통합 테스트

**Labels**: `testing`, `frontend`, `complexity:medium`

### 📋 작업 개요

전체 사용자 플로우 테스트 및 버그 수정

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 전체 플로우 정상 동작 확인
- [ ] 발견된 버그 수정 완료
- [ ] 성능 이슈 없음

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] 전체 사용자 플로우 테스트
  - 회원가입 → 로그인 → 할일 추가 → 수정 → 완료 → 삭제 → 복원 → 영구 삭제
  - 국경일 조회
  - 프로필 수정
  - 로그아웃
- [ ] 버그 수정
- [ ] 성능 확인 (React DevTools Profiler)

---

### 🔧 기술적 고려사항

- **테스트 시나리오**:
  1. 회원가입 → 로그인
  2. 할일 추가 (제목, 내용, 날짜 입력)
  3. 할일 수정
  4. 할일 완료 처리
  5. 할일 삭제 (휴지통 이동)
  6. 휴지통에서 복원
  7. 휴지통에서 영구 삭제
  8. 국경일 조회 (연도/월 필터)
  9. 프로필 수정
  10. 로그아웃
- **검증 항목**:
  - 모든 API 연동 정상 동작
  - 에러 메시지 정상 표시
  - 로딩 상태 표시
  - 반응형 디자인 동작
  - 성능 이슈 없음

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- Phase 3의 모든 Task 완료

#### 후행 작업 (Blocks):
- 없음 (Phase 3 마지막 작업)

---

### 📦 산출물

- 테스트 결과 메모
- 버그 수정 완료
