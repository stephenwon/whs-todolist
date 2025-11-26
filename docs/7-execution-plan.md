# WHS-TodoList 프로젝트 실행계획

**버전**: 1.0
**작성일**: 2025-11-26
**상태**: 승인 대기
**총 예상 기간**: 3-4일 (집중 개발 기준)

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [Phase 1: 데이터베이스 구축](#phase-1-데이터베이스-구축)
3. [Phase 2: 백엔드 개발](#phase-2-백엔드-개발)
4. [Phase 3: 프론트엔드 개발](#phase-3-프론트엔드-개발)
5. [Phase 4: 통합 및 배포](#phase-4-통합-및-배포)
6. [전체 일정 요약](#전체-일정-요약)
7. [리스크 관리](#리스크-관리)

---

## 프로젝트 개요

### 목표

JWT 기반 사용자 인증과 할일 관리, 휴지통, 국경일 조회 기능을 제공하는 풀스택 웹 애플리케이션 개발

### 핵심 원칙

- **오버엔지니어링 금지**: 필요한 기능만 단순하게 구현
- **P0 우선순위**: MVP 필수 기능에 집중
- **병렬 작업 최대화**: 독립적인 Task는 동시 진행
- **테스트 기반**: 핵심 로직은 테스트로 검증

---

## Phase 1: 데이터베이스 구축

**총 예상 시간**: 3-4시간
**담당**: 백엔드 개발자
**목표**: PostgreSQL 데이터베이스 스키마 구축 및 초기 데이터 삽입

---

### Task 1.1: 로컬 PostgreSQL 설치 및 설정

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- PostgreSQL 15+ 설치 (Windows 환경)
- pgAdmin 또는 DBeaver 설치 (DB 관리 도구)
- 로컬 PostgreSQL 서버 실행 확인
- 데이터베이스 생성 (`whs_todolist_dev`)
- 연결 테스트 (`psql` 또는 GUI 도구)

**완료 조건**:

- [x] PostgreSQL 서비스 실행 중
- [x] `whs_todolist_dev` 데이터베이스 생성 완료
- [x] 연결 문자열 확인: `postgresql://localhost:5432/whs_todolist_dev`
- [x] 관리 도구로 접속 가능

**의존성**:

- [x] 없음 (독립 작업)

**산출물**:

- PostgreSQL 설치 완료
- 데이터베이스: `whs_todolist_dev`
- 연결 정보 메모 (`.env` 작성용)

---

### Task 1.2: 데이터베이스 스키마 작성 (schema.sql)

**담당**: 백엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**사용 파일**:

- database/schema.sql

**작업 내용**:

- User 테이블 정의 (userId, email, password, username, role, createdAt, updatedAt)
- Todo 테이블 정의 (todoId, userId, title, content, startDate, dueDate, status, isCompleted, createdAt, updatedAt, deletedAt)
- Holiday 테이블 정의 (holidayId, title, date, description, isRecurring, createdAt, updatedAt)
- UNIQUE INDEX 추가: User.email
- INDEX 추가: Todo(userId, status), Todo(dueDate), Holiday(date)
- FOREIGN KEY 설정: Todo.userId → User.userId (ON DELETE CASCADE)
- CHECK 제약: dueDate >= startDate

**완료 조건**:

- [x] `schema.sql` 파일 작성 완료
- [x] UUID 기본 키 설정
- [x] 인덱스 설정 완료
- [x] 외래 키 제약 조건 설정
- [x] CHECK 제약 조건 추가

**의존성**:

- [x] Task 1.1 완료 (데이터베이스 생성)

---

### Task 1.3: 스키마 실행 및 검증

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

**작업 내용**:

- `schema.sql` 실행 (`psql -U postgres -d whs_todolist_dev -f schema.sql`)
- 테이블 생성 확인 (User, Todo, Holiday)
- 인덱스 생성 확인
- 제약 조건 테스트 (이메일 중복, 날짜 검증)

**완료 조건**:

- [x] 3개 테이블 생성 확인
- [x] 인덱스 6개 생성 확인
- [x] CHECK 제약 동작 확인 (잘못된 날짜 입력 시 에러)
- [x] UNIQUE 제약 동작 확인 (이메일 중복 시 에러)

**의존성**:

- [x] Task 1.2 완료 (schema.sql 작성)

**산출물**:

- 데이터베이스 테이블 3개
- 검증 완료 보고서 (간단한 메모)

---

### Task 1.4: 초기 데이터 삽입 (국경일)

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P1

**작업 내용**:

- 2025년 주요 국경일 데이터 삽입
- 신정(1/1), 삼일절(3/1), 어린이날(5/5), 석가탄신일(5/5), 현충일(6/6), 광복절(8/15), 추석(10/6-8), 개천절(10/3), 한글날(10/9), 크리스마스(12/25)
- `isRecurring=true` 설정

**완료 조건**:

- [x] 최소 10개 국경일 데이터 삽입
- [x] Holiday 테이블 조회로 확인
- [x] 날짜 정렬 확인

**의존성**:

- [x] Task 1.3 완료 (테이블 생성)

---

## Phase 2: 백엔드 개발

**총 예상 시간**: 16-18시간 (2일)
**담당**: 백엔드 개발자
**목표**: RESTful API 구현 및 JWT 인증 시스템 구축

---

### Task 2.1: 백엔드 프로젝트 초기화

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `backend/` 디렉토리 생성
- `npm init -y` 실행
- 필수 패키지 설치:
  - `express` (4.x)
  - `pg` (node-postgres)
  - `jsonwebtoken` (JWT)
  - `bcrypt` (비밀번호 해싱)
  - `express-validator` (검증)
  - `cors` (CORS 설정)
  - `helmet` (보안 헤더)
  - `express-rate-limit` (Rate Limiting)
  - `dotenv` (환경 변수)
- `package.json` 스크립트 설정 (`dev`, `start`)
- `.env` 파일 생성 및 설정

**완료 조건**:

- [ ] `package.json` 생성 완료
- [ ] 필수 패키지 8개 설치 완료
- [ ] `.env` 파일 작성 (DATABASE_URL, JWT_SECRET 등)
- [ ] `.env.example` 파일 생성
- [ ] `.gitignore` 설정 (node_modules, .env)

**의존성**:

- [ ] Task 1.3 완료 (DB 준비)

**산출물**:

- `backend/package.json`
- `backend/.env`
- `backend/.env.example`

---

### Task 2.2: 디렉토리 구조 생성

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

**작업 내용**:

- 프로젝트 구조 설계 원칙에 따라 폴더 생성
- `src/controllers/` (컨트롤러)
- `src/services/` (비즈니스 로직)
- `src/routes/` (라우트)
- `src/middlewares/` (미들웨어)
- `src/config/` (설정)
- `src/utils/` (유틸리티)
- `src/app.js` (Express 앱)
- `src/server.js` (서버 진입점)

**완료 조건**:

- [ ] 7개 디렉토리 생성
- [ ] 기본 파일 생성 (`app.js`, `server.js`)
- [ ] 디렉토리 구조가 설계 원칙과 일치

**의존성**:

- [ ] Task 2.1 완료 (프로젝트 초기화)

**산출물**:

- 백엔드 디렉토리 구조

---

### Task 2.3: 데이터베이스 연결 설정

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `src/config/database.js` 작성
- `pg.Pool` 설정 (Connection Pool)
- 연결 문자열 환경 변수로 관리
- 연결 테스트 함수 작성 (`testConnection()`)
- 에러 핸들링 추가

**완료 조건**:

- [ ] `database.js` 작성 완료
- [ ] Connection Pool 설정 (max: 10)
- [ ] 연결 테스트 성공
- [ ] 에러 로그 출력 확인

**의존성**:

- [ ] Task 2.2 완료 (디렉토리 구조)
- [ ] Task 1.3 완료 (DB 준비)

**산출물**:

- `backend/src/config/database.js`

---

### Task 2.4: JWT 유틸리티 작성

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `src/utils/jwtHelper.js` 작성
- `generateAccessToken(payload)` 함수 (15분 만료)
- `generateRefreshToken(payload)` 함수 (7일 만료)
- `verifyAccessToken(token)` 함수
- `verifyRefreshToken(token)` 함수
- 에러 핸들링 (TokenExpiredError, JsonWebTokenError)

**완료 조건**:

- [ ] 4개 함수 작성 완료
- [ ] Access Token 만료 시간: 15분
- [ ] Refresh Token 만료 시간: 7일
- [ ] 토큰 검증 에러 처리 완료

**의존성**:

- [ ] Task 2.2 완료 (디렉토리 구조)

**산출물**:

- `backend/src/utils/jwtHelper.js`

---

### Task 2.5: 비밀번호 해싱 유틸리티 작성

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

**작업 내용**:

- `src/utils/passwordHelper.js` 작성
- `hashPassword(plainPassword)` 함수 (bcrypt, salt rounds: 10)
- `comparePassword(plainPassword, hashedPassword)` 함수
- 에러 핸들링

**완료 조건**:

- [ ] 2개 함수 작성 완료
- [ ] Salt rounds: 10
- [ ] 비밀번호 해싱/비교 테스트 성공

**의존성**:

- [ ] Task 2.2 완료 (디렉토리 구조)

**산출물**:

- `backend/src/utils/passwordHelper.js`

---

### Task 2.6: 인증 미들웨어 작성

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `src/middlewares/authMiddleware.js` 작성
- `authenticate` 미들웨어: JWT 검증 후 `req.user`에 사용자 정보 저장
- `requireAdmin` 미들웨어: 관리자 권한 확인
- Authorization 헤더 파싱 (`Bearer <token>`)
- 에러 응답 처리 (401 Unauthorized)

**완료 조건**:

- [ ] `authenticate` 미들웨어 작성
- [ ] `requireAdmin` 미들웨어 작성
- [ ] 토큰 없을 시 401 반환
- [ ] 토큰 만료 시 401 반환
- [ ] `req.user`에 userId, role 저장

**의존성**:

- [ ] Task 2.4 완료 (JWT 유틸리티)

**산출물**:

- `backend/src/middlewares/authMiddleware.js`

---

### Task 2.7: 에러 핸들링 미들웨어 작성

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `src/middlewares/errorMiddleware.js` 작성
- 통일된 에러 응답 형식 (`{success: false, error: {code, message}}`)
- HTTP 상태 코드 매핑
- 에러 로깅 (console.error)
- 프로덕션 환경에서는 스택 트레이스 숨김

**완료 조건**:

- [ ] 에러 핸들러 작성 완료
- [ ] 에러 응답 형식 통일
- [ ] 로그 출력 확인
- [ ] 환경별 응답 차이 구현 (dev/prod)

**의존성**:

- [ ] Task 2.2 완료 (디렉토리 구조)

**산출물**:

- `backend/src/middlewares/errorMiddleware.js`

---

### Task 2.8: 인증 API 구현 (회원가입, 로그인, 토큰 갱신)

**담당**: 백엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

**작업 내용**:

- `src/services/authService.js` 작성
  - `register(email, password, username)`: 회원가입
  - `login(email, password)`: 로그인
  - `refreshAccessToken(refreshToken)`: 토큰 갱신
- `src/controllers/authController.js` 작성
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout` (클라이언트 토큰 삭제 안내)
- `src/routes/authRoutes.js` 작성
- 입력 검증 (express-validator)

**완료 조건**:

- [ ] 회원가입 API 동작 확인 (이메일 중복 체크)
- [ ] 로그인 API 동작 확인 (Access + Refresh Token 발급)
- [ ] 토큰 갱신 API 동작 확인
- [ ] 비밀번호 bcrypt 해싱 확인
- [ ] 에러 응답 확인 (400, 401, 409)

**의존성**:

- [ ] Task 2.3 완료 (DB 연결)
- [ ] Task 2.4 완료 (JWT 유틸리티)
- [ ] Task 2.5 완료 (비밀번호 해싱)

**산출물**:

- `backend/src/services/authService.js`
- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

---

### Task 2.9: 할일 CRUD API 구현

**담당**: 백엔드 개발자
**예상 시간**: 4시간
**우선순위**: P0

**작업 내용**:

- `src/services/todoService.js` 작성
  - `getTodos(userId, filters)`: 할일 목록 조회
  - `getTodoById(todoId, userId)`: 할일 상세 조회
  - `createTodo(userId, todoData)`: 할일 생성
  - `updateTodo(todoId, userId, updateData)`: 할일 수정
  - `completeTodo(todoId, userId)`: 할일 완료
  - `deleteTodo(todoId, userId)`: 휴지통 이동 (소프트 삭제)
  - `restoreTodo(todoId, userId)`: 할일 복원
- `src/controllers/todoController.js` 작성
  - `GET /api/todos` (쿼리: status, search, sortBy, order)
  - `GET /api/todos/:id`
  - `POST /api/todos`
  - `PUT /api/todos/:id`
  - `PATCH /api/todos/:id/complete`
  - `DELETE /api/todos/:id`
  - `PATCH /api/todos/:id/restore`
- `src/routes/todoRoutes.js` 작성
- 비즈니스 규칙 적용 (dueDate >= startDate, 권한 체크)

**완료 조건**:

- [ ] 7개 API 엔드포인트 동작 확인
- [ ] 인증 미들웨어 적용
- [ ] 권한 체크 (타인의 할일 접근 금지)
- [ ] 소프트 삭제 동작 확인 (status='deleted', deletedAt 기록)
- [ ] 날짜 검증 동작 확인
- [ ] 에러 응답 확인 (400, 403, 404)

**의존성**:

- [ ] Task 2.3 완료 (DB 연결)
- [ ] Task 2.6 완료 (인증 미들웨어)

**산출물**:

- `backend/src/services/todoService.js`
- `backend/src/controllers/todoController.js`
- `backend/src/routes/todoRoutes.js`

---

### Task 2.10: 휴지통 API 구현

**담당**: 백엔드 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

**작업 내용**:

- `src/services/trashService.js` 작성
  - `getTrash(userId)`: 휴지통 조회 (status='deleted')
  - `permanentlyDelete(todoId, userId)`: 영구 삭제
- `src/controllers/trashController.js` 작성
  - `GET /api/trash`
  - `DELETE /api/trash/:id`
- `src/routes/trashRoutes.js` 작성

**완료 조건**:

- [ ] 휴지통 조회 API 동작 확인
- [ ] 영구 삭제 API 동작 확인 (DB에서 완전히 제거)
- [ ] 권한 체크 동작 확인
- [ ] 에러 응답 확인 (404, 400)

**의존성**:

- [ ] Task 2.9 완료 (할일 API)

**산출물**:

- `backend/src/services/trashService.js`
- `backend/src/controllers/trashController.js`
- `backend/src/routes/trashRoutes.js`

---

### Task 2.11: 국경일 API 구현

**담당**: 백엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- `src/services/holidayService.js` 작성
  - `getHolidays(year, month)`: 국경일 조회
  - `createHoliday(holidayData)`: 국경일 추가 (관리자 전용)
  - `updateHoliday(holidayId, updateData)`: 국경일 수정 (관리자 전용)
- `src/controllers/holidayController.js` 작성
  - `GET /api/holidays` (쿼리: year, month)
  - `POST /api/holidays` (관리자 전용)
  - `PUT /api/holidays/:id` (관리자 전용)
- `src/routes/holidayRoutes.js` 작성
- 관리자 권한 미들웨어 적용

**완료 조건**:

- [ ] 국경일 조회 API 동작 확인 (인증 필요)
- [ ] 국경일 추가 API 동작 확인 (관리자만 가능)
- [ ] 국경일 수정 API 동작 확인 (관리자만 가능)
- [ ] 연도/월 필터링 동작 확인
- [ ] 에러 응답 확인 (403, 404)

**의존성**:

- [ ] Task 2.3 완료 (DB 연결)
- [ ] Task 2.6 완료 (인증 미들웨어)

**산출물**:

- `backend/src/services/holidayService.js`
- `backend/src/controllers/holidayController.js`
- `backend/src/routes/holidayRoutes.js`

---

### Task 2.12: Rate Limiting 미들웨어 추가

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P1

**작업 내용**:

- `src/middlewares/rateLimitMiddleware.js` 작성
- 일반 API: 100 req/min per IP
- 인증 API: 5 req/15min per IP
- `express-rate-limit` 사용

**완료 조건**:

- [ ] Rate Limiter 설정 완료
- [ ] 인증 API에 적용
- [ ] 제한 초과 시 429 응답 확인

**의존성**:

- [ ] Task 2.2 완료 (디렉토리 구조)

**산출물**:

- `backend/src/middlewares/rateLimitMiddleware.js`

---

### Task 2.13: Express 앱 통합 및 라우트 연결

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `src/app.js` 작성
  - CORS 설정 (cors 미들웨어)
  - Helmet 설정 (보안 헤더)
  - JSON 파싱 (express.json())
  - 라우트 연결 (`/api/auth`, `/api/todos`, `/api/trash`, `/api/holidays`)
  - 에러 핸들러 적용 (가장 마지막)
- `src/server.js` 작성
  - 포트 설정 (3000)
  - 서버 시작

**완료 조건**:

- [ ] CORS 설정 완료
- [ ] 보안 헤더 적용 확인
- [ ] 4개 라우트 연결 확인
- [ ] 에러 핸들러 동작 확인
- [ ] 서버 실행 확인 (`http://localhost:3000`)

**의존성**:

- [ ] Task 2.8, 2.9, 2.10, 2.11 완료 (모든 라우트)

**산출물**:

- `backend/src/app.js`
- `backend/src/server.js`

---

### Task 2.14: API 테스트 (Postman/Thunder Client)

**담당**: 백엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- Postman 또는 Thunder Client 컬렉션 생성
- 모든 API 엔드포인트 테스트
  - 회원가입 → 로그인 → 할일 생성 → 조회 → 수정 → 삭제 → 복원 → 영구 삭제
  - 국경일 조회
  - 토큰 갱신
- 성공 케이스 및 실패 케이스 테스트
- 에러 응답 확인

**완료 조건**:

- [ ] 모든 API 엔드포인트 테스트 완료
- [ ] 성공 케이스 동작 확인
- [ ] 실패 케이스 에러 응답 확인
- [ ] JWT 인증 동작 확인
- [ ] 권한 체크 동작 확인

**의존성**:

- [ ] Task 2.13 완료 (서버 실행)

**산출물**:

- Postman/Thunder Client 컬렉션 (선택)
- 테스트 결과 메모

---

## Phase 3: 프론트엔드 개발

**총 예상 시간**: 28-32시간 (2일)
**담당**: 프론트엔드 개발자
**목표**: React 기반 사용자 인터페이스 구현 및 API 연동

---

### Task 3.1: 프론트엔드 프로젝트 초기화 (React + Vite + Tailwind)

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `npm create vite@latest frontend -- --template react` 실행
- Tailwind CSS 설치 및 설정
- 필수 패키지 설치:
  - `react-router-dom` (라우팅)
  - `zustand` (상태 관리)
  - `axios` (HTTP 클라이언트)
  - `react-hook-form` (폼 관리)
  - `zod` (스키마 검증)
  - `date-fns` (날짜 처리)
  - `lucide-react` (아이콘)
- `tailwind.config.js` 설정 (색상, 폰트)
- `.env` 파일 생성 (`VITE_API_BASE_URL`)

**완료 조건**:

- [ ] Vite 프로젝트 생성 완료
- [ ] Tailwind CSS 설정 완료
- [ ] 필수 패키지 7개 설치 완료
- [ ] `.env` 파일 작성
- [ ] 개발 서버 실행 확인 (`npm run dev`)

**의존성**:

- [ ] 없음 (독립 작업, 백엔드와 병렬 가능)

**산출물**:

- `frontend/package.json`
- `frontend/tailwind.config.js`
- `frontend/.env`

---

### Task 3.2: 디렉토리 구조 생성

**담당**: 프론트엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

**작업 내용**:

- 프로젝트 구조 설계 원칙에 따라 폴더 생성
- `src/components/` (공통, todo, holiday, layout)
- `src/pages/`
- `src/stores/`
- `src/services/`
- `src/hooks/`
- `src/utils/`
- `src/constants/`
- 기본 파일 생성 (`App.jsx`, `main.jsx`)

**완료 조건**:

- [ ] 7개 디렉토리 생성
- [ ] 디렉토리 구조가 설계 원칙과 일치

**의존성**:

- [ ] Task 3.1 완료 (프로젝트 초기화)

**산출물**:

- 프론트엔드 디렉토리 구조

---

### Task 3.3: 상수 정의 및 Axios 인스턴스 설정

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `src/constants/apiEndpoints.js` 작성 (API 엔드포인트 상수)
- `src/constants/todoStatus.js` 작성 (active, completed, deleted)
- `src/services/api.js` 작성
  - Axios 인스턴스 생성
  - 요청 인터셉터: Authorization 헤더 자동 추가
  - 응답 인터셉터: 401 에러 시 토큰 갱신 시도
  - 에러 핸들링

**완료 조건**:

- [ ] 상수 파일 2개 작성 완료
- [ ] Axios 인스턴스 설정 완료
- [ ] 인터셉터 동작 확인
- [ ] 환경 변수 (`VITE_API_BASE_URL`) 사용 확인

**의존성**:

- [ ] Task 3.2 완료 (디렉토리 구조)

**산출물**:

- `frontend/src/constants/apiEndpoints.js`
- `frontend/src/constants/todoStatus.js`
- `frontend/src/services/api.js`

---

### Task 3.4: 유틸리티 함수 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- `src/utils/dateFormatter.js` 작성 (날짜 포맷팅)
- `src/utils/tokenManager.js` 작성 (LocalStorage에 토큰 저장/조회/삭제)
- `src/utils/validator.js` 작성 (이메일, 비밀번호 검증)

**완료 조건**:

- [ ] 3개 유틸리티 파일 작성 완료
- [ ] 토큰 저장/조회 동작 확인
- [ ] 날짜 포맷팅 동작 확인

**의존성**:

- [ ] Task 3.2 완료 (디렉토리 구조)

**산출물**:

- `frontend/src/utils/dateFormatter.js`
- `frontend/src/utils/tokenManager.js`
- `frontend/src/utils/validator.js`

---

### Task 3.5: Zustand 스토어 설정 (authStore)

**담당**: 프론트엔드 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

**작업 내용**:

- `src/stores/authStore.js` 작성
  - State: `user`, `isAuthenticated`, `isLoading`, `error`
  - Actions: `login(email, password)`, `register(email, password, username)`, `logout()`, `refreshToken()`
  - API 호출 (authService)
  - 토큰 저장 (tokenManager)

**완료 조건**:

- [ ] authStore 작성 완료
- [ ] 로그인/회원가입/로그아웃 동작 확인
- [ ] 토큰 저장 확인
- [ ] 에러 상태 관리 확인

**의존성**:

- [ ] Task 3.3 완료 (Axios 인스턴스)
- [ ] Task 3.4 완료 (tokenManager)

**산출물**:

- `frontend/src/stores/authStore.js`

---

### Task 3.6: API 서비스 레이어 작성

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- `src/services/authService.js` 작성
  - `login(email, password)`
  - `register(email, password, username)`
  - `refreshToken(refreshToken)`
- `src/services/todoService.js` 작성
  - `getTodos(filters)`
  - `getTodoById(id)`
  - `createTodo(todoData)`
  - `updateTodo(id, updateData)`
  - `completeTodo(id)`
  - `deleteTodo(id)`
  - `restoreTodo(id)`
- `src/services/holidayService.js` 작성
  - `getHolidays(year, month)`
- `src/services/userService.js` 작성
  - `getProfile()`
  - `updateProfile(updateData)`

**완료 조건**:

- [ ] 4개 서비스 파일 작성 완료
- [ ] Axios 인스턴스 사용 확인
- [ ] API 엔드포인트 상수 사용 확인

**의존성**:

- [ ] Task 3.3 완료 (Axios 인스턴스)

**산출물**:

- `frontend/src/services/authService.js`
- `frontend/src/services/todoService.js`
- `frontend/src/services/holidayService.js`
- `frontend/src/services/userService.js`

---

### Task 3.7: Zustand 스토어 설정 (todoStore, holidayStore, uiStore)

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- `src/stores/todoStore.js` 작성
  - State: `todos`, `isLoading`, `error`, `filters`
  - Actions: `fetchTodos()`, `createTodo()`, `updateTodo()`, `deleteTodo()`, `restoreTodo()`, `setFilters()`
- `src/stores/holidayStore.js` 작성
  - State: `holidays`, `isLoading`, `error`
  - Actions: `fetchHolidays(year, month)`
- `src/stores/uiStore.js` 작성
  - State: `isModalOpen`, `modalType`, `selectedTodo`, `isDarkMode`
  - Actions: `openModal()`, `closeModal()`, `toggleDarkMode()`

**완료 조건**:

- [ ] 3개 스토어 작성 완료
- [ ] 서비스 레이어 호출 확인
- [ ] 상태 업데이트 동작 확인

**의존성**:

- [ ] Task 3.6 완료 (서비스 레이어)

**산출물**:

- `frontend/src/stores/todoStore.js`
- `frontend/src/stores/holidayStore.js`
- `frontend/src/stores/uiStore.js`

---

### Task 3.8: 공통 컴포넌트 구현 (Button, Input, Modal)

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

**작업 내용**:

- `src/components/common/Button.jsx` 작성
  - 버튼 variants (primary, secondary, danger)
  - 크기 옵션 (sm, md, lg)
  - 로딩 상태 지원
- `src/components/common/Input.jsx` 작성
  - 입력 필드 (text, email, password, date)
  - 에러 상태 표시
  - 레이블 지원
- `src/components/common/Modal.jsx` 작성
  - 모달 오버레이
  - 닫기 버튼
  - 제목, 본문, 액션 슬롯
- `src/components/common/Loading.jsx` 작성 (로딩 스피너)

**완료 조건**:

- [ ] 4개 공통 컴포넌트 작성 완료
- [ ] Tailwind CSS 스타일링 적용
- [ ] Props 검증 (PropTypes 또는 주석)
- [ ] 재사용성 확인

**의존성**:

- [ ] Task 3.2 완료 (디렉토리 구조)

**산출물**:

- `frontend/src/components/common/Button.jsx`
- `frontend/src/components/common/Input.jsx`
- `frontend/src/components/common/Modal.jsx`
- `frontend/src/components/common/Loading.jsx`

---

### Task 3.9: 라우팅 설정 (React Router)

**담당**: 프론트엔드 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

**작업 내용**:

- `src/routes.jsx` 작성
- 라우트 정의:
  - `/login` (LoginPage)
  - `/register` (RegisterPage)
  - `/` (TodoListPage) - 인증 필요
  - `/trash` (TrashPage) - 인증 필요
  - `/holidays` (HolidayPage) - 인증 필요
  - `/profile` (ProfilePage) - 인증 필요
- Protected Route 컴포넌트 작성 (인증 체크)
- 인증되지 않은 사용자는 `/login`으로 리다이렉트

**완료 조건**:

- [ ] 6개 라우트 정의 완료
- [ ] Protected Route 동작 확인
- [ ] 인증 체크 동작 확인
- [ ] 리다이렉트 동작 확인

**의존성**:

- [ ] Task 3.5 완료 (authStore)

**산출물**:

- `frontend/src/routes.jsx`
- `frontend/src/components/ProtectedRoute.jsx` (선택)

---

### Task 3.10: 레이아웃 컴포넌트 구현 (Header, MainLayout)

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- `src/components/layout/Header.jsx` 작성
  - 로고
  - 네비게이션 링크 (할일 목록, 휴지통, 국경일, 프로필)
  - 로그아웃 버튼
  - 다크모드 토글 (선택)
- `src/components/layout/MainLayout.jsx` 작성
  - Header + 콘텐츠 영역
  - 반응형 디자인

**완료 조건**:

- [ ] Header 컴포넌트 작성 완료
- [ ] MainLayout 컴포넌트 작성 완료
- [ ] 네비게이션 링크 동작 확인
- [ ] 로그아웃 동작 확인
- [ ] 반응형 디자인 확인

**의존성**:

- [ ] Task 3.5 완료 (authStore)
- [ ] Task 3.9 완료 (라우팅)

**산출물**:

- `frontend/src/components/layout/Header.jsx`
- `frontend/src/components/layout/MainLayout.jsx`

---

### Task 3.11: 인증 화면 구현 (로그인, 회원가입)

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

**작업 내용**:

- `src/pages/LoginPage.jsx` 작성
  - 이메일, 비밀번호 입력 필드
  - 로그인 버튼
  - 회원가입 링크
  - React Hook Form + Zod 검증
  - authStore 연동
  - 로그인 성공 시 `/` 이동
- `src/pages/RegisterPage.jsx` 작성
  - 이메일, 비밀번호, 사용자 이름 입력 필드
  - 회원가입 버튼
  - 로그인 링크
  - React Hook Form + Zod 검증
  - authStore 연동
  - 회원가입 성공 시 `/login` 이동
- 에러 메시지 표시

**완료 조건**:

- [ ] 로그인 페이지 작성 완료
- [ ] 회원가입 페이지 작성 완료
- [ ] 폼 검증 동작 확인
- [ ] API 연동 확인
- [ ] 에러 메시지 표시 확인
- [ ] 페이지 전환 확인

**의존성**:

- [ ] Task 3.5 완료 (authStore)
- [ ] Task 3.8 완료 (공통 컴포넌트)

**산출물**:

- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`

---

### Task 3.12: 할일 관련 컴포넌트 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 4시간
**우선순위**: P0

**작업 내용**:

- `src/components/todo/TodoCard.jsx` 작성
  - 할일 제목, 내용, 날짜 표시
  - 완료 체크박스
  - 수정, 삭제 버튼
  - 상태별 색상 구분 (진행 중: 주황, 완료: 초록)
  - 만료일 지난 할일 표시
- `src/components/todo/TodoList.jsx` 작성
  - TodoCard 목록 렌더링
  - 빈 상태 표시 ("할일이 없습니다")
- `src/components/todo/TodoFilter.jsx` 작성
  - 상태 필터 (전체, 진행 중, 완료)
  - 정렬 옵션 (날짜, 생성일)
  - 검색 입력 필드

**완료 조건**:

- [ ] 3개 컴포넌트 작성 완료
- [ ] 할일 카드 스타일링 완료
- [ ] 필터/검색 동작 확인
- [ ] 상태별 색상 표시 확인

**의존성**:

- [ ] Task 3.8 완료 (공통 컴포넌트)

**산출물**:

- `frontend/src/components/todo/TodoCard.jsx`
- `frontend/src/components/todo/TodoList.jsx`
- `frontend/src/components/todo/TodoFilter.jsx`

---

### Task 3.13: 할일 목록 페이지 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

**작업 내용**:

- `src/pages/TodoListPage.jsx` 작성
  - TodoFilter 컴포넌트 배치
  - TodoList 컴포넌트 배치
  - 할일 추가 버튼 (FAB)
  - todoStore 연동
  - 페이지 로드 시 할일 목록 조회
  - 로딩 상태 표시
  - 에러 상태 표시

**완료 조건**:

- [ ] 할일 목록 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 필터링/검색 동작 확인
- [ ] 로딩/에러 상태 표시 확인
- [ ] 반응형 디자인 확인

**의존성**:

- [ ] Task 3.7 완료 (todoStore)
- [ ] Task 3.12 완료 (할일 컴포넌트)

**산출물**:

- `frontend/src/pages/TodoListPage.jsx`

---

### Task 3.14: 할일 추가/수정 모달 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

**작업 내용**:

- `src/components/todo/TodoForm.jsx` 작성
  - 제목, 내용, 시작일, 만료일 입력 필드
  - React Hook Form + Zod 검증
  - 날짜 검증 (만료일 >= 시작일)
  - 저장 버튼, 취소 버튼
  - 추가/수정 모드 지원
- Modal 컴포넌트와 통합
- uiStore, todoStore 연동

**완료 조건**:

- [ ] TodoForm 컴포넌트 작성 완료
- [ ] 모달 동작 확인
- [ ] 폼 검증 동작 확인
- [ ] API 연동 확인 (생성/수정)
- [ ] 추가/수정 모드 전환 확인

**의존성**:

- [ ] Task 3.7 완료 (todoStore, uiStore)
- [ ] Task 3.8 완료 (Modal 컴포넌트)

**산출물**:

- `frontend/src/components/todo/TodoForm.jsx`

---

### Task 3.15: 휴지통 페이지 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- `src/pages/TrashPage.jsx` 작성
  - 삭제된 할일 목록 표시
  - 복원 버튼
  - 영구 삭제 버튼
  - todoStore 연동 (status='deleted' 필터)
  - 빈 상태 표시

**완료 조건**:

- [ ] 휴지통 페이지 작성 완료
- [ ] API 연동 확인 (복원, 영구 삭제)
- [ ] 버튼 동작 확인
- [ ] 빈 상태 표시 확인

**의존성**:

- [ ] Task 3.7 완료 (todoStore)
- [ ] Task 3.12 완료 (TodoCard)

**산출물**:

- `frontend/src/pages/TrashPage.jsx`

---

### Task 3.16: 국경일 페이지 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- `src/components/holiday/HolidayCard.jsx` 작성
  - 국경일 이름, 날짜, 설명 표시
  - 빨간색 테마
- `src/pages/HolidayPage.jsx` 작성
  - HolidayCard 목록 렌더링
  - 연도/월 필터
  - holidayStore 연동
  - 로딩 상태 표시

**완료 조건**:

- [ ] HolidayCard 컴포넌트 작성 완료
- [ ] 국경일 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 필터 동작 확인

**의존성**:

- [ ] Task 3.7 완료 (holidayStore)

**산출물**:

- `frontend/src/components/holiday/HolidayCard.jsx`
- `frontend/src/pages/HolidayPage.jsx`

---

### Task 3.17: 프로필 페이지 구현

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P1

**작업 내용**:

- `src/pages/ProfilePage.jsx` 작성
  - 사용자 정보 표시 (이메일, 이름, 가입일)
  - 사용자 이름 수정
  - 비밀번호 변경
  - authStore, userService 연동

**완료 조건**:

- [ ] 프로필 페이지 작성 완료
- [ ] API 연동 확인
- [ ] 정보 수정 동작 확인

**의존성**:

- [ ] Task 3.5 완료 (authStore)
- [ ] Task 3.6 완료 (userService)

**산출물**:

- `frontend/src/pages/ProfilePage.jsx`

---

### Task 3.18: 반응형 디자인 적용

**담당**: 프론트엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

**작업 내용**:

- Tailwind CSS 브레이크포인트 활용
- 모바일 (< 768px) 최적화
  - 헤더 네비게이션 → 햄버거 메뉴
  - 할일 카드 스택 레이아웃
  - 터치 친화적 버튼 크기 (44x44px 이상)
- 태블릿/데스크톱 (>= 768px) 레이아웃
- 모바일 테스트 (Chrome DevTools)

**완료 조건**:

- [ ] 모든 페이지 반응형 동작 확인
- [ ] 모바일 화면에서 사용 가능
- [ ] 터치 UI 최적화 확인
- [ ] 크로스 브라우저 테스트 (Chrome, Safari)

**의존성**:

- [ ] Task 3.13, 3.15, 3.16, 3.17 완료 (모든 페이지)

**산출물**:

- 반응형 스타일 적용 완료

---

### Task 3.19: 다크모드 구현 (선택)

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P1

**작업 내용**:

- Tailwind CSS `dark:` 유틸리티 사용
- uiStore에 `isDarkMode` 상태 추가
- LocalStorage에 다크모드 설정 저장
- 시스템 설정 감지 (`prefers-color-scheme`)
- Header에 다크모드 토글 버튼 추가

**완료 조건**:

- [ ] 다크모드 토글 동작 확인
- [ ] LocalStorage 저장 확인
- [ ] 모든 페이지 다크모드 적용 확인
- [ ] 색상 대비 확인 (WCAG AA)

**의존성**:

- [ ] Task 3.18 완료 (반응형 디자인)

**산출물**:

- 다크모드 기능 완성

---

### Task 3.20: 프론트엔드 통합 테스트

**담당**: 프론트엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- 전체 사용자 플로우 테스트
  - 회원가입 → 로그인 → 할일 추가 → 수정 → 완료 → 삭제 → 복원 → 영구 삭제
  - 국경일 조회
  - 프로필 수정
  - 로그아웃
- 버그 수정
- 성능 확인 (React DevTools Profiler)

**완료 조건**:

- [ ] 전체 플로우 정상 동작 확인
- [ ] 발견된 버그 수정 완료
- [ ] 성능 이슈 없음

**의존성**:

- [ ] Phase 3의 모든 Task 완료

**산출물**:

- 테스트 결과 메모
- 버그 수정 완료

---

## Phase 4: 통합 및 배포

**총 예상 시간**: 4-6시간
**담당**: 풀스택 개발자
**목표**: 프론트엔드-백엔드 통합, 배포, 프로덕션 테스트

---

### Task 4.1: 프론트엔드-백엔드 통합 테스트

**담당**: 풀스택 개발자
**예상 시간**: 2시간
**우선순위**: P0

**작업 내용**:

- 로컬 환경에서 프론트엔드와 백엔드 동시 실행
- CORS 설정 확인
- API 연동 확인
- JWT 인증 플로우 테스트
- 에러 핸들링 확인

**완료 조건**:

- [ ] 프론트엔드에서 백엔드 API 호출 성공
- [ ] 인증 플로우 정상 동작
- [ ] CORS 문제 없음
- [ ] 에러 메시지 정상 표시

**의존성**:

- [ ] Phase 2 완료 (백엔드)
- [ ] Phase 3 완료 (프론트엔드)

**산출물**:

- 통합 테스트 결과

---

### Task 4.2: Supabase PostgreSQL 설정

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- Supabase 계정 생성
- 새 프로젝트 생성
- PostgreSQL 데이터베이스 확인
- 연결 문자열 복사
- 로컬 `schema.sql`을 Supabase에 실행
- 국경일 데이터 삽입
- 연결 테스트

**완료 조건**:

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 생성 완료
- [ ] 초기 데이터 삽입 완료
- [ ] 연결 문자열 확인

**의존성**:

- [ ] Task 1.2, 1.3, 1.4 완료 (스키마 작성)

**산출물**:

- Supabase 프로젝트
- 연결 문자열 (`DATABASE_URL`)

---

### Task 4.3: Vercel 백엔드 배포

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- GitHub 레포지토리에 코드 푸시
- Vercel 계정 생성 및 연결
- `backend/` 디렉토리를 Serverless Functions로 배포
- 환경 변수 설정 (Vercel 대시보드)
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_ACCESS_EXPIRATION`
  - `JWT_REFRESH_EXPIRATION`
  - `NODE_ENV=production`
- 배포 성공 확인

**완료 조건**:

- [ ] Vercel 배포 성공
- [ ] 환경 변수 설정 완료
- [ ] API 엔드포인트 접근 가능 (`https://your-app.vercel.app/api`)
- [ ] Supabase 연결 확인

**의존성**:

- [ ] Task 4.2 완료 (Supabase 설정)
- [ ] Phase 2 완료 (백엔드 개발)

**산출물**:

- 백엔드 배포 URL

---

### Task 4.4: Vercel 프론트엔드 배포

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

**작업 내용**:

- GitHub 레포지토리에 코드 푸시 (프론트엔드)
- Vercel 프로젝트 생성 (frontend 디렉토리)
- 환경 변수 설정
  - `VITE_API_BASE_URL=https://your-app.vercel.app/api`
- 빌드 설정 확인 (Vite)
- 배포 성공 확인

**완료 조건**:

- [ ] Vercel 배포 성공
- [ ] 환경 변수 설정 완료
- [ ] 프론트엔드 접근 가능 (`https://your-frontend.vercel.app`)
- [ ] 백엔드 API 연동 확인

**의존성**:

- [ ] Task 4.3 완료 (백엔드 배포)
- [ ] Phase 3 완료 (프론트엔드 개발)

**산출물**:

- 프론트엔드 배포 URL

---

### Task 4.5: 프로덕션 환경 테스트

**담당**: 풀스택 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

**작업 내용**:

- 배포된 프론트엔드에서 전체 플로우 테스트
- 회원가입 → 로그인 → 할일 CRUD → 휴지통 → 국경일 조회 → 프로필 → 로그아웃
- 성능 확인 (Lighthouse)
- 보안 확인 (HTTPS, CORS, Rate Limiting)
- 크로스 브라우저 테스트
- 모바일 테스트

**완료 조건**:

- [ ] 전체 플로우 정상 동작
- [ ] Lighthouse 점수 80+ (Performance, Accessibility)
- [ ] HTTPS 정상 동작
- [ ] 크로스 브라우저 정상 동작
- [ ] 모바일 정상 동작

**의존성**:

- [ ] Task 4.4 완료 (프론트엔드 배포)

**산출물**:

- 프로덕션 테스트 결과

---

### Task 4.6: 문서화 및 README 작성

**담당**: 프로젝트 매니저
**예상 시간**: 1시간
**우선순위**: P1

**작업 내용**:

- `README.md` 작성
  - 프로젝트 개요
  - 기술 스택
  - 설치 및 실행 방법
  - 환경 변수 설정 가이드
  - API 문서 링크
  - 배포 URL
  - 스크린샷 (선택)
- `backend/README.md` 작성 (API 문서)
- `frontend/README.md` 작성 (컴포넌트 구조)

**완료 조건**:

- [ ] 루트 README 작성 완료
- [ ] 백엔드 README 작성 완료 (선택)
- [ ] 프론트엔드 README 작성 완료 (선택)

**의존성**:

- [ ] Phase 4의 모든 Task 완료

**산출물**:

- `README.md`

---

### Task 4.7: 최종 점검 및 런칭

**담당**: 프로젝트 매니저
**예상 시간**: 0.5시간
**우선순위**: P0

**작업 내용**:

- 모든 Task 완료 확인
- 체크리스트 점검
- 배포 URL 공유
- 런칭 공지 (선택)

**완료 조건**:

- [ ] 모든 P0 기능 동작 확인
- [ ] 배포 URL 확인
- [ ] 문서화 완료

**의존성**:

- [ ] 모든 Task 완료

**산출물**:

- 런칭 완료

---

## 전체 일정 요약

### Phase별 소요 시간

| Phase       | 단계              | 예상 시간     | 실제 소요 시간 | 상태 |
| ----------- | ----------------- | ------------- | -------------- | ---- |
| **Phase 1** | 데이터베이스 구축 | 3-4시간       | -              | 대기 |
| **Phase 2** | 백엔드 개발       | 16-18시간     | -              | 대기 |
| **Phase 3** | 프론트엔드 개발   | 28-32시간     | -              | 대기 |
| **Phase 4** | 통합 및 배포      | 4-6시간       | -              | 대기 |
| **총합**    | -                 | **51-60시간** | -              | -    |

### 일정별 작업 계획 (3-4일 집중 개발 기준)

#### Day 1 (8-10시간)

- **오전**: Phase 1 완료 (DB 구축)
- **오후**: Phase 2 시작 (백엔드 프로젝트 초기화, 인증 API)

#### Day 2 (8-10시간)

- **종일**: Phase 2 계속 (할일 API, 휴지통 API, 국경일 API, 테스트)

#### Day 3 (10-12시간)

- **오전**: Phase 3 시작 (프론트엔드 초기화, 공통 컴포넌트, 인증 화면)
- **오후**: Phase 3 계속 (할일 목록, 모달)

#### Day 4 (10-12시간)

- **오전**: Phase 3 완료 (휴지통, 국경일, 프로필, 반응형)
- **오후**: Phase 4 (통합, 배포, 테스트, 런칭)

### 병렬 작업 가능 항목

**독립적으로 수행 가능한 작업**:

- Phase 1 (DB 구축)와 Phase 3 (프론트엔드 초기화)는 병렬 가능
- 백엔드 API 개발 중 프론트엔드 공통 컴포넌트 작업 병렬 가능
- 문서화는 다른 작업과 병렬 가능

---

## 리스크 관리

### 주요 리스크 및 대응 방안

| 리스크                   | 영향도 | 확률   | 대응 방안                                                         |
| ------------------------ | ------ | ------ | ----------------------------------------------------------------- |
| **백엔드 개발 지연**     | High   | Medium | - P1 기능 제외 (프로필 수정, 관리자 기능)<br>- Rate Limiting 생략 |
| **프론트엔드 개발 지연** | High   | Medium | - 다크모드 생략<br>- 검색/필터 단순화<br>- 프로필 페이지 생략     |
| **Supabase 연결 문제**   | Medium | Low    | - 로컬 PostgreSQL 백업 사용<br>- Supabase 문서 참조               |
| **Vercel 배포 실패**     | Medium | Low    | - 로컬 테스트 철저히<br>- Vercel 로그 확인<br>- 커뮤니티 지원     |
| **JWT 토큰 관리 이슈**   | Medium | Medium | - 토큰 갱신 로직 단순화<br>- Refresh Token 생략 고려              |
| **시간 부족**            | High   | Medium | - P0 기능만 우선 구현<br>- 2차 개발로 미루기                      |

### 우선순위별 기능 분류

**P0 (Must-have) - 필수 구현**:

- 회원가입, 로그인
- 할일 CRUD
- 휴지통 (복원, 영구 삭제)
- 국경일 조회
- 반응형 디자인 (모바일 기본)

**P1 (Should-have) - 시간 허용 시 구현**:

- 토큰 갱신
- 프로필 수정
- 다크모드
- 검색/필터
- 국경일 추가/수정 (관리자)
- Rate Limiting

**P2 (Nice-to-have) - 2차 개발**:

- 캘린더 뷰
- 통계 대시보드
- 알림 기능
- 협업 기능

---

## 체크리스트

### Phase 1: 데이터베이스

- [ ] PostgreSQL 설치 및 실행
- [ ] 데이터베이스 생성 (`whs_todolist_dev`)
- [ ] `schema.sql` 작성 및 실행
- [ ] 테이블 3개 생성 확인
- [ ] 인덱스 설정 확인
- [ ] 국경일 초기 데이터 삽입

### Phase 2: 백엔드

- [ ] 프로젝트 초기화 (npm, 패키지 설치)
- [ ] 디렉토리 구조 생성
- [ ] DB 연결 설정
- [ ] JWT 유틸리티 작성
- [ ] 인증 미들웨어 작성
- [ ] 인증 API 구현 (회원가입, 로그인, 토큰 갱신)
- [ ] 할일 CRUD API 구현
- [ ] 휴지통 API 구현
- [ ] 국경일 API 구현
- [ ] Rate Limiting 설정 (P1)
- [ ] 에러 핸들링 미들웨어
- [ ] 전체 API 테스트

### Phase 3: 프론트엔드

- [ ] 프로젝트 초기화 (Vite, React, Tailwind)
- [ ] 디렉토리 구조 생성
- [ ] Axios 인스턴스 설정
- [ ] Zustand 스토어 설정 (auth, todo, holiday, ui)
- [ ] API 서비스 레이어 작성
- [ ] 공통 컴포넌트 구현 (Button, Input, Modal)
- [ ] 라우팅 설정
- [ ] 레이아웃 컴포넌트 (Header, MainLayout)
- [ ] 인증 화면 (로그인, 회원가입)
- [ ] 할일 목록 페이지
- [ ] 할일 추가/수정 모달
- [ ] 휴지통 페이지
- [ ] 국경일 페이지
- [ ] 프로필 페이지 (P1)
- [ ] 반응형 디자인
- [ ] 다크모드 (P1)
- [ ] 통합 테스트

### Phase 4: 통합 및 배포

- [ ] 로컬 통합 테스트
- [ ] Supabase PostgreSQL 설정
- [ ] Vercel 백엔드 배포
- [ ] Vercel 프론트엔드 배포
- [ ] 환경 변수 설정 (프로덕션)
- [ ] 프로덕션 환경 테스트
- [ ] 성능 확인 (Lighthouse)
- [ ] 문서화 (README)
- [ ] 최종 점검 및 런칭

---

## 성공 기준

### 기술적 성공 기준

- [ ] 모든 P0 기능 정상 동작
- [ ] API 응답 시간 1초 이내
- [ ] 페이지 로딩 시간 3초 이내
- [ ] 크로스 브라우저 호환성 (Chrome, Safari, Firefox)
- [ ] 모바일 반응형 디자인 동작
- [ ] HTTPS 적용
- [ ] JWT 인증 정상 동작

### 비즈니스 성공 기준

- [ ] MVP 기능 100% 구현 (P0)
- [ ] 4일 이내 런칭
- [ ] 사용자 플로우 완성도
- [ ] 문서화 완료

---

## 다음 단계 (2차 개발)

**Phase 5 계획** (런칭 후):

1. 캘린더 뷰 구현
2. 통계 대시보드
3. 이메일 알림
4. 할일 카테고리/태그
5. 협업 기능
6. 성능 최적화 (Redis 캐싱)
7. E2E 테스트 추가

---

**문서 종료**
