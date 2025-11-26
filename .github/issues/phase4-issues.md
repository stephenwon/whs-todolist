# Phase 4: 통합 및 배포 이슈 목록

---

## [Phase 4] Task 4.1: 프론트엔드-백엔드 통합 테스트

**Labels**: `testing`, `integration`, `complexity:high`

### 📋 작업 개요

로컬 환경에서 프론트엔드와 백엔드 통합 테스트 및 검증

**담당**: 풀스택 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 프론트엔드에서 백엔드 API 호출 성공
- [ ] 인증 플로우 정상 동작
- [ ] CORS 문제 없음
- [ ] 에러 메시지 정상 표시

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] 로컬 환경에서 프론트엔드와 백엔드 동시 실행
- [ ] CORS 설정 확인
- [ ] API 연동 확인
- [ ] JWT 인증 플로우 테스트
- [ ] 에러 핸들링 확인

---

### 🔧 기술적 고려사항

- **실행 환경**:
  - 백엔드: `http://localhost:3000`
  - 프론트엔드: `http://localhost:5173` (Vite 기본 포트)
- **CORS 설정 확인**:
  - 백엔드 `app.js`에서 CORS origin 설정
  - 프론트엔드 `.env`에서 `VITE_API_BASE_URL` 확인
- **테스트 시나리오**:
  1. 회원가입 API 호출 확인
  2. 로그인 → JWT 토큰 발급 확인
  3. 할일 CRUD API 호출 (Authorization 헤더 포함)
  4. 401 에러 시 토큰 갱신 로직 동작 확인
  5. 에러 메시지 정상 표시 확인
- **보안 고려사항** (PRD 6.2):
  - CORS: 프론트엔드 도메인만 허용
  - JWT: Authorization 헤더 정상 전송
  - HTTPS: 로컬에서는 HTTP, 프로덕션에서는 HTTPS
- **코드 확인 (backend/src/app.js)**:
  ```javascript
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- Phase 2 완료 (백엔드 개발)
- Phase 3 완료 (프론트엔드 개발)

#### 후행 작업 (Blocks):
- #40 - Task 4.2: Supabase PostgreSQL 설정

---

### 📦 산출물

- 통합 테스트 결과 메모
- CORS 설정 확인 완료

---

## [Phase 4] Task 4.2: Supabase PostgreSQL 설정

**Labels**: `setup`, `database`, `deployment`, `complexity:medium`

### 📋 작업 개요

Supabase 프로젝트 생성 및 PostgreSQL 데이터베이스 설정

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 생성 완료
- [ ] 초기 데이터 삽입 완료
- [ ] 연결 문자열 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] Supabase 계정 생성 (https://supabase.com/)
- [ ] 새 프로젝트 생성
- [ ] PostgreSQL 데이터베이스 확인
- [ ] 연결 문자열 복사
- [ ] 로컬 `schema.sql`을 Supabase에 실행
- [ ] 국경일 데이터 삽입
- [ ] 연결 테스트

---

### 🔧 기술적 고려사항

- **Supabase 프로젝트 생성**:
  1. https://supabase.com/ 접속
  2. "New Project" 클릭
  3. 프로젝트명: `whs-todolist`
  4. Database 비밀번호 설정 (강력한 비밀번호)
  5. Region: 한국 또는 일본 선택 (낮은 지연시간)
- **스키마 실행 방법**:
  - Supabase 대시보드 → SQL Editor
  - `schema.sql` 내용 복사 → 실행
  - 또는 psql CLI로 실행:
    ```bash
    psql -h <supabase-host> -U postgres -d postgres -f database/schema.sql
    ```
- **연결 문자열 (Connection String)**:
  - Supabase 대시보드 → Settings → Database → Connection String
  - 형식: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **보안 고려사항**:
  - SSL 연결 필수 (`?sslmode=require`)
  - 비밀번호 안전하게 보관
  - Vercel 환경 변수에만 저장
- **주의사항**:
  - Supabase 무료 티어: 500MB 스토리지, 2GB 대역폭
  - 프로젝트가 7일간 비활성 시 일시 정지 (무료 티어)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #2 - Task 1.2: 데이터베이스 스키마 작성
- #3 - Task 1.3: 스키마 실행 및 검증
- #4 - Task 1.4: 초기 데이터 삽입

#### 후행 작업 (Blocks):
- #41 - Task 4.3: Vercel 백엔드 배포

---

### 📦 산출물

- Supabase 프로젝트
- 연결 문자열 (`DATABASE_URL`)

---

## [Phase 4] Task 4.3: Vercel 백엔드 배포

**Labels**: `deployment`, `backend`, `complexity:medium`

### 📋 작업 개요

Vercel Serverless Functions로 백엔드 API 배포

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] Vercel 배포 성공
- [ ] 환경 변수 설정 완료
- [ ] API 엔드포인트 접근 가능 (`https://your-app.vercel.app/api`)
- [ ] Supabase 연결 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] GitHub 레포지토리에 코드 푸시
- [ ] Vercel 계정 생성 및 연결
- [ ] `backend/` 디렉토리를 Serverless Functions로 배포
- [ ] 환경 변수 설정 (Vercel 대시보드)
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_ACCESS_EXPIRATION`
  - `JWT_REFRESH_EXPIRATION`
  - `NODE_ENV=production`
- [ ] 배포 성공 확인

---

### 🔧 기술적 고려사항

- **Vercel 배포 방법**:
  1. GitHub 레포지토리 생성 및 코드 푸시
  2. https://vercel.com/ 접속 → "New Project"
  3. GitHub 레포지토리 선택
  4. Root Directory: `backend` (또는 비워두기)
  5. Framework Preset: `Other`
  6. 배포 버튼 클릭
- **Serverless Functions 설정**:
  - Vercel은 `api/` 폴더 또는 `pages/api/` 폴더를 자동으로 Serverless Functions로 인식
  - Express 앱을 Serverless 함수로 변환 필요
  - `vercel.json` 파일 추가:
    ```json
    {
      "version": 2,
      "builds": [
        {
          "src": "src/server.js",
          "use": "@vercel/node"
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "src/server.js"
        }
      ]
    }
    ```
- **환경 변수 설정**:
  - Vercel 대시보드 → Settings → Environment Variables
  - `DATABASE_URL`: Supabase 연결 문자열
  - `JWT_SECRET`: 강력한 시크릿 키 (최소 32자)
  - `NODE_ENV=production`
- **배포 URL 확인**:
  - 배포 완료 후 URL: `https://whs-todolist-api.vercel.app/api`
  - 테스트: `https://whs-todolist-api.vercel.app/api/holidays`
- **보안 고려사항** (PRD 6.2):
  - HTTPS 자동 적용 (Vercel 기본)
  - 환경 변수는 Vercel 대시보드에만 저장
  - `.env` 파일은 git에 커밋하지 않음

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #40 - Task 4.2: Supabase PostgreSQL 설정
- Phase 2 완료 (백엔드 개발)

#### 후행 작업 (Blocks):
- #42 - Task 4.4: Vercel 프론트엔드 배포

---

### 📦 산출물

- 백엔드 배포 URL (예: `https://whs-todolist-api.vercel.app/api`)

---

## [Phase 4] Task 4.4: Vercel 프론트엔드 배포

**Labels**: `deployment`, `frontend`, `complexity:medium`

### 📋 작업 개요

Vercel로 React 프론트엔드 정적 사이트 배포

**담당**: 프론트엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] Vercel 배포 성공
- [ ] 환경 변수 설정 완료
- [ ] 프론트엔드 접근 가능 (`https://your-frontend.vercel.app`)
- [ ] 백엔드 API 연동 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] GitHub 레포지토리에 코드 푸시 (프론트엔드)
- [ ] Vercel 프로젝트 생성 (frontend 디렉토리)
- [ ] 환경 변수 설정
  - `VITE_API_BASE_URL=https://your-app.vercel.app/api`
- [ ] 빌드 설정 확인 (Vite)
- [ ] 배포 성공 확인

---

### 🔧 기술적 고려사항

- **Vercel 배포 방법**:
  1. Vercel 대시보드 → "New Project"
  2. GitHub 레포지토리 선택
  3. Root Directory: `frontend`
  4. Framework Preset: `Vite`
  5. Build Command: `npm run build`
  6. Output Directory: `dist`
  7. 배포 버튼 클릭
- **환경 변수 설정**:
  - Vercel 대시보드 → Settings → Environment Variables
  - `VITE_API_BASE_URL`: 백엔드 API URL (Task 4.3에서 생성된 URL)
  - 예: `VITE_API_BASE_URL=https://whs-todolist-api.vercel.app/api`
- **빌드 설정 확인**:
  - `vite.config.js`에서 빌드 설정 확인
  - `.env.production` 파일 생성 (선택사항)
- **배포 URL 확인**:
  - 배포 완료 후 URL: `https://whs-todolist.vercel.app`
  - 브라우저에서 접속 확인
- **CORS 확인**:
  - 백엔드에서 프론트엔드 도메인 허용 확인
  - `backend/.env`: `FRONTEND_URL=https://whs-todolist.vercel.app`
- **주의사항**:
  - Vite 환경 변수는 빌드 시점에 주입됨
  - 환경 변수 변경 시 재배포 필요

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #41 - Task 4.3: Vercel 백엔드 배포
- Phase 3 완료 (프론트엔드 개발)

#### 후행 작업 (Blocks):
- #43 - Task 4.5: 프로덕션 환경 테스트

---

### 📦 산출물

- 프론트엔드 배포 URL (예: `https://whs-todolist.vercel.app`)

---

## [Phase 4] Task 4.5: 프로덕션 환경 테스트

**Labels**: `testing`, `deployment`, `complexity:high`

### 📋 작업 개요

배포된 프로덕션 환경에서 전체 기능 테스트 및 성능 검증

**담당**: 풀스택 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 전체 플로우 정상 동작
- [ ] Lighthouse 점수 80+ (Performance, Accessibility)
- [ ] HTTPS 정상 동작
- [ ] 크로스 브라우저 정상 동작
- [ ] 모바일 정상 동작

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] 배포된 프론트엔드에서 전체 플로우 테스트
  - 회원가입 → 로그인 → 할일 CRUD → 휴지통 → 국경일 조회 → 프로필 → 로그아웃
- [ ] 성능 확인 (Lighthouse)
- [ ] 보안 확인 (HTTPS, CORS, Rate Limiting)
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 테스트

---

### 🔧 기술적 고려사항

- **테스트 시나리오**:
  1. **회원가입**:
     - 새 이메일로 회원가입
     - 이메일 중복 체크 확인
     - 비밀번호 검증 확인
  2. **로그인**:
     - JWT 토큰 발급 확인
     - LocalStorage에 토큰 저장 확인
     - 로그인 성공 후 `/` 리다이렉트
  3. **할일 CRUD**:
     - 할일 생성 (제목, 내용, 날짜 입력)
     - 할일 목록 조회 (필터, 검색)
     - 할일 수정
     - 할일 완료 처리
     - 할일 삭제 (휴지통 이동)
  4. **휴지통**:
     - 삭제된 할일 목록 조회
     - 할일 복원
     - 영구 삭제
  5. **국경일 조회**:
     - 국경일 목록 조회
     - 연도/월 필터링
  6. **프로필**:
     - 사용자 정보 조회
     - 사용자 이름 수정
  7. **로그아웃**:
     - LocalStorage 토큰 삭제 확인
     - `/login` 리다이렉트
- **Lighthouse 테스트**:
  - Chrome DevTools → Lighthouse 탭
  - Performance, Accessibility, Best Practices, SEO 점수 확인
  - 목표: Performance 80+, Accessibility 90+
- **보안 테스트**:
  - HTTPS 연결 확인 (Vercel 자동 적용)
  - CORS 정책 확인 (다른 도메인에서 접근 시도)
  - JWT 인증 확인 (토큰 없이 API 호출 시 401 에러)
  - Rate Limiting 확인 (연속 요청 시 429 에러)
- **크로스 브라우저 테스트** (PRD 6.6):
  - Chrome (최신 버전)
  - Firefox (최신 버전)
  - Safari (최신 버전)
  - Edge (최신 버전)
- **모바일 테스트**:
  - Chrome DevTools → Device Toolbar
  - iPhone 13, Galaxy S21 등 다양한 디바이스 테스트
  - 터치 UI 동작 확인
  - 반응형 레이아웃 확인
- **성능 요구사항** (PRD 6.1):
  - API 응답 시간: 1초 이내
  - 페이지 로딩 시간: 3초 이내
  - First Contentful Paint: 1.8초 이내

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #42 - Task 4.4: Vercel 프론트엔드 배포

#### 후행 작업 (Blocks):
- #44 - Task 4.6: 문서화 및 README 작성

---

### 📦 산출물

- 프로덕션 테스트 결과 메모
- Lighthouse 점수 스크린샷
- 발견된 버그 및 수정 사항

---

## [Phase 4] Task 4.6: 문서화 및 README 작성

**Labels**: `documentation`, `complexity:low`

### 📋 작업 개요

프로젝트 README 및 API 문서 작성

**담당**: 프로젝트 매니저
**예상 시간**: 1시간
**우선순위**: P1

---

### ✅ 완료 조건

- [ ] 루트 README 작성 완료
- [ ] 백엔드 README 작성 완료 (선택)
- [ ] 프론트엔드 README 작성 완료 (선택)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `README.md` 작성
  - 프로젝트 개요
  - 기술 스택
  - 설치 및 실행 방법
  - 환경 변수 설정 가이드
  - API 문서 링크
  - 배포 URL
  - 스크린샷 (선택)
- [ ] `backend/README.md` 작성 (API 문서)
- [ ] `frontend/README.md` 작성 (컴포넌트 구조)

---

### 🔧 기술적 고려사항

- **README.md 구조**:
  ```markdown
  # WHS-TodoList

  JWT 기반 사용자 인증과 할일 관리, 휴지통, 국경일 조회 기능을 제공하는 풀스택 웹 애플리케이션

  ## 🚀 배포 URL

  - 프론트엔드: https://whs-todolist.vercel.app
  - 백엔드 API: https://whs-todolist-api.vercel.app/api

  ## 🛠 기술 스택

  ### 프론트엔드
  - React 18
  - Vite
  - Tailwind CSS
  - Zustand
  - React Router v6

  ### 백엔드
  - Node.js 18+
  - Express.js
  - PostgreSQL (Supabase)
  - JWT (jsonwebtoken)
  - bcrypt

  ### 배포 및 인프라
  - Vercel (Frontend + Backend)
  - Supabase (PostgreSQL)

  ## 📦 설치 및 실행

  ### 백엔드

  1. 패키지 설치
  ```bash
  cd backend
  npm install
  ```

  2. 환경 변수 설정
  ```bash
  cp .env.example .env
  # .env 파일 수정 (DATABASE_URL, JWT_SECRET 등)
  ```

  3. 데이터베이스 스키마 실행
  ```bash
  psql -U postgres -d whs_todolist_dev -f database/schema.sql
  ```

  4. 서버 실행
  ```bash
  npm run dev
  ```

  ### 프론트엔드

  1. 패키지 설치
  ```bash
  cd frontend
  npm install
  ```

  2. 환경 변수 설정
  ```bash
  cp .env.example .env
  # .env 파일 수정 (VITE_API_BASE_URL)
  ```

  3. 개발 서버 실행
  ```bash
  npm run dev
  ```

  ## 🔑 환경 변수

  ### 백엔드 (.env)
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/whs_todolist_dev
  JWT_SECRET=your-secret-key-change-this
  JWT_ACCESS_EXPIRATION=15m
  JWT_REFRESH_EXPIRATION=7d
  PORT=3000
  NODE_ENV=development
  ```

  ### 프론트엔드 (.env)
  ```env
  VITE_API_BASE_URL=http://localhost:3000/api
  ```

  ## 📖 주요 기능

  - ✅ 회원가입 및 로그인 (JWT 인증)
  - ✅ 할일 CRUD (생성, 조회, 수정, 삭제)
  - ✅ 할일 완료 처리
  - ✅ 휴지통 (소프트 삭제 및 복원)
  - ✅ 국경일 조회
  - ✅ 반응형 디자인 (모바일 지원)

  ## 📝 API 문서

  자세한 API 명세는 [PRD 문서](./docs/3-prd.md#9-api-설계)를 참조하세요.

  ## 🎨 스크린샷

  (선택사항: 스크린샷 추가)

  ## 📄 라이선스

  MIT

  ## 👨‍💻 개발자

  - Name: [Your Name]
  - Email: [Your Email]
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- Phase 4의 모든 Task 완료

#### 후행 작업 (Blocks):
- #45 - Task 4.7: 최종 점검 및 런칭

---

### 📦 산출물

- `README.md`
- `backend/README.md` (선택)
- `frontend/README.md` (선택)

---

## [Phase 4] Task 4.7: 최종 점검 및 런칭

**Labels**: `deployment`, `complexity:low`

### 📋 작업 개요

모든 기능 최종 확인 및 프로젝트 런칭

**담당**: 프로젝트 매니저
**예상 시간**: 0.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 모든 P0 기능 동작 확인
- [ ] 배포 URL 확인
- [ ] 문서화 완료

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] 모든 Task 완료 확인
- [ ] 체크리스트 점검
- [ ] 배포 URL 공유
- [ ] 런칭 공지 (선택)

---

### 🔧 기술적 고려사항

- **최종 체크리스트** (PRD 11.3):
  - [ ] **기획 완료**: 도메인 정의서, PRD, API 명세 완료
  - [ ] **백엔드 완료**: 모든 API 구현 및 테스트 완료
  - [ ] **프론트엔드 완료**: 모든 화면 구현 및 API 연동 완료
  - [ ] **통합 테스트 완료**: E2E 테스트 및 버그 수정 완료
  - [ ] **배포 완료**: 프로덕션 환경 배포 완료
- **성공 기준** (실행계획서):
  - [ ] 모든 P0 기능 정상 동작
  - [ ] API 응답 시간 1초 이내
  - [ ] 페이지 로딩 시간 3초 이내
  - [ ] 크로스 브라우저 호환성 (Chrome, Safari, Firefox)
  - [ ] 모바일 반응형 디자인 동작
  - [ ] HTTPS 적용
  - [ ] JWT 인증 정상 동작
- **배포 URL**:
  - 프론트엔드: `https://whs-todolist.vercel.app`
  - 백엔드 API: `https://whs-todolist-api.vercel.app/api`
- **런칭 공지** (선택):
  - GitHub README에 배포 URL 업데이트
  - 포트폴리오에 프로젝트 추가
  - LinkedIn, 블로그 등에 공유

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- 모든 Task 완료

#### 후행 작업 (Blocks):
- 없음 (프로젝트 완료)

---

### 📦 산출물

- 런칭 완료
- 배포 URL 공유
- 프로젝트 완성

---

## 전체 Phase 4 체크리스트

### 통합 및 배포
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

**Phase 4 완료 = 프로젝트 런칭 🎉**
