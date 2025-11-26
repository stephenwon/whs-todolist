# Phase 2: 백엔드 개발 이슈 목록

---

## [Phase 2] Task 2.1: 백엔드 프로젝트 초기화

**Labels**: `setup`, `backend`, `complexity:low`

### 📋 작업 개요

Node.js 백엔드 프로젝트 생성 및 필수 패키지 설치

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] `package.json` 생성 완료
- [ ] 필수 패키지 8개 설치 완료
- [ ] `.env` 파일 작성 (DATABASE_URL, JWT_SECRET 등)
- [ ] `.env.example` 파일 생성
- [ ] `.gitignore` 설정 (node_modules, .env)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `backend/` 디렉토리 생성
- [ ] `npm init -y` 실행
- [ ] 필수 패키지 설치:
  - `express` (4.x)
  - `pg` (node-postgres)
  - `jsonwebtoken` (JWT)
  - `bcrypt` (비밀번호 해싱)
  - `express-validator` (검증)
  - `cors` (CORS 설정)
  - `helmet` (보안 헤더)
  - `express-rate-limit` (Rate Limiting)
  - `dotenv` (환경 변수)
- [ ] `package.json` 스크립트 설정 (`dev`, `start`)
- [ ] `.env` 파일 생성 및 설정

---

### 🔧 기술적 고려사항

- **기술 스택**: Node.js 18+, Express.js 4.x
- **구현 방법**:
  - npm으로 패키지 관리
  - ES6 모듈 또는 CommonJS 사용
  - nodemon 사용 (개발 서버 자동 재시작)
- **.env 설정 항목**:
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/whs_todolist_dev
  JWT_SECRET=your-secret-key-change-this
  JWT_ACCESS_EXPIRATION=15m
  JWT_REFRESH_EXPIRATION=7d
  PORT=3000
  NODE_ENV=development
  ```
- **package.json scripts 예시**:
  ```json
  {
    "scripts": {
      "dev": "nodemon src/server.js",
      "start": "node src/server.js"
    }
  }
  ```
- **주의사항**:
  - `.env`는 git에 커밋하지 않음
  - JWT_SECRET은 충분히 복잡한 값 사용 (최소 32자)
  - bcrypt는 네이티브 모듈이므로 설치 시 빌드 도구 필요 (Windows: node-gyp)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #3 - Task 1.3: 스키마 실행 및 검증

#### 후행 작업 (Blocks):
- #6 - Task 2.2: 디렉토리 구조 생성

---

### 📦 산출물

- `backend/package.json`
- `backend/.env`
- `backend/.env.example`
- `backend/.gitignore`

---

## [Phase 2] Task 2.2: 디렉토리 구조 생성

**Labels**: `setup`, `backend`, `complexity:low`

### 📋 작업 개요

백엔드 프로젝트 폴더 구조 생성 및 기본 파일 생성

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 7개 디렉토리 생성
- [ ] 기본 파일 생성 (`app.js`, `server.js`)
- [ ] 디렉토리 구조가 설계 원칙과 일치

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/controllers/` (컨트롤러)
- [ ] `src/services/` (비즈니스 로직)
- [ ] `src/routes/` (라우트)
- [ ] `src/middlewares/` (미들웨어)
- [ ] `src/config/` (설정)
- [ ] `src/utils/` (유틸리티)
- [ ] `src/app.js` (Express 앱)
- [ ] `src/server.js` (서버 진입점)

---

### 🔧 기술적 고려사항

- **구조 원칙**: 계층형 아키텍처 (Layered Architecture)
  - Routes → Controllers → Services → Database
  - 각 계층은 하위 계층에만 의존
- **폴더 역할**:
  - `controllers/`: HTTP 요청/응답 처리
  - `services/`: 비즈니스 로직 및 데이터베이스 접근
  - `routes/`: API 라우트 정의
  - `middlewares/`: 인증, 에러 핸들링 등
  - `config/`: 데이터베이스, 환경 설정
  - `utils/`: 공통 유틸리티 함수
- **기본 파일 내용**:
  - `app.js`: Express 앱 설정 및 미들웨어 등록
  - `server.js`: 서버 시작 및 포트 리스닝

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #5 - Task 2.1: 백엔드 프로젝트 초기화

#### 후행 작업 (Blocks):
- #7 - Task 2.3: 데이터베이스 연결 설정
- #8 - Task 2.4: JWT 유틸리티 작성
- #9 - Task 2.5: 비밀번호 해싱 유틸리티 작성
- #11 - Task 2.7: 에러 핸들링 미들웨어 작성

---

### 📦 산출물

- 백엔드 디렉토리 구조 (7개 폴더 + 2개 기본 파일)

---

## [Phase 2] Task 2.3: 데이터베이스 연결 설정

**Labels**: `feature`, `backend`, `database`, `complexity:medium`

### 📋 작업 개요

PostgreSQL 연결 풀(Connection Pool) 설정 및 연결 테스트

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] `database.js` 작성 완료
- [ ] Connection Pool 설정 (max: 10)
- [ ] 연결 테스트 성공
- [ ] 에러 로그 출력 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/config/database.js` 작성
- [ ] `pg.Pool` 설정 (Connection Pool)
- [ ] 연결 문자열 환경 변수로 관리
- [ ] 연결 테스트 함수 작성 (`testConnection()`)
- [ ] 에러 핸들링 추가

---

### 🔧 기술적 고려사항

- **기술 스택**: node-postgres (pg)
- **구현 방법**:
  - `pg.Pool` 사용하여 연결 풀 생성
  - 환경 변수 `DATABASE_URL`에서 연결 문자열 읽기
  - Connection Pool 설정: max 10개, idle timeout 30초
- **코드 예시**:
  ```javascript
  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  const testConnection = async () => {
    try {
      const client = await pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
    }
  };

  module.exports = { pool, testConnection };
  ```
- **주의사항**:
  - 연결 풀을 통한 효율적인 연결 관리
  - 에러 발생 시 서버 시작 중단 고려
  - 프로덕션 환경에서는 SSL 연결 사용 (Supabase)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #6 - Task 2.2: 디렉토리 구조 생성
- #3 - Task 1.3: 스키마 실행 및 검증

#### 후행 작업 (Blocks):
- #12 - Task 2.8: 인증 API 구현
- #13 - Task 2.9: 할일 CRUD API 구현
- #15 - Task 2.11: 국경일 API 구현

---

### 📦 산출물

- `backend/src/config/database.js`

---

## [Phase 2] Task 2.4: JWT 유틸리티 작성

**Labels**: `feature`, `backend`, `complexity:medium`

### 📋 작업 개요

JWT Access Token 및 Refresh Token 생성/검증 함수 작성

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 4개 함수 작성 완료
- [ ] Access Token 만료 시간: 15분
- [ ] Refresh Token 만료 시간: 7일
- [ ] 토큰 검증 에러 처리 완료

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/utils/jwtHelper.js` 작성
- [ ] `generateAccessToken(payload)` 함수 (15분 만료)
- [ ] `generateRefreshToken(payload)` 함수 (7일 만료)
- [ ] `verifyAccessToken(token)` 함수
- [ ] `verifyRefreshToken(token)` 함수
- [ ] 에러 핸들링 (TokenExpiredError, JsonWebTokenError)

---

### 🔧 기술적 고려사항

- **기술 스택**: jsonwebtoken 라이브러리
- **구현 방법**:
  - `jwt.sign()` 메서드로 토큰 생성
  - `jwt.verify()` 메서드로 토큰 검증
  - 환경 변수로 SECRET KEY 관리
- **코드 예시**:
  ```javascript
  const jwt = require('jsonwebtoken');

  const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    });
  };

  const verifyAccessToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('TOKEN_EXPIRED');
      }
      throw new Error('INVALID_TOKEN');
    }
  };
  ```
- **페이로드 구조**:
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
  ```
- **보안 고려사항** (PRD 6.2):
  - JWT Secret은 최소 32자 이상
  - Access Token: 15분 (짧은 수명으로 보안 강화)
  - Refresh Token: 7일 (장기 인증)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #6 - Task 2.2: 디렉토리 구조 생성

#### 후행 작업 (Blocks):
- #10 - Task 2.6: 인증 미들웨어 작성
- #12 - Task 2.8: 인증 API 구현

---

### 📦 산출물

- `backend/src/utils/jwtHelper.js`

---

## [Phase 2] Task 2.5: 비밀번호 해싱 유틸리티 작성

**Labels**: `feature`, `backend`, `complexity:low`

### 📋 작업 개요

bcrypt를 사용한 비밀번호 해싱 및 비교 함수 작성

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 2개 함수 작성 완료
- [ ] Salt rounds: 10
- [ ] 비밀번호 해싱/비교 테스트 성공

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/utils/passwordHelper.js` 작성
- [ ] `hashPassword(plainPassword)` 함수 (bcrypt, salt rounds: 10)
- [ ] `comparePassword(plainPassword, hashedPassword)` 함수
- [ ] 에러 핸들링

---

### 🔧 기술적 고려사항

- **기술 스택**: bcrypt 라이브러리
- **구현 방법**:
  - `bcrypt.hash()` 메서드로 해싱
  - `bcrypt.compare()` 메서드로 비교
  - Salt rounds: 10 (보안과 성능 균형)
- **코드 예시**:
  ```javascript
  const bcrypt = require('bcrypt');

  const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  };

  const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  };

  module.exports = { hashPassword, comparePassword };
  ```
- **보안 고려사항** (PRD 6.2):
  - bcrypt는 레인보우 테이블 공격 방어
  - Salt rounds: 10 (2^10 = 1024번 해싱)
  - 비밀번호는 평문으로 저장 금지

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #6 - Task 2.2: 디렉토리 구조 생성

#### 후행 작업 (Blocks):
- #12 - Task 2.8: 인증 API 구현

---

### 📦 산출물

- `backend/src/utils/passwordHelper.js`

---

## [Phase 2] Task 2.6: 인증 미들웨어 작성

**Labels**: `feature`, `backend`, `complexity:medium`

### 📋 작업 개요

JWT 토큰 검증 미들웨어 및 관리자 권한 확인 미들웨어 작성

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] `authenticate` 미들웨어 작성
- [ ] `requireAdmin` 미들웨어 작성
- [ ] 토큰 없을 시 401 반환
- [ ] 토큰 만료 시 401 반환
- [ ] `req.user`에 userId, role 저장

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/middlewares/authMiddleware.js` 작성
- [ ] `authenticate` 미들웨어: JWT 검증 후 `req.user`에 사용자 정보 저장
- [ ] `requireAdmin` 미들웨어: 관리자 권한 확인
- [ ] Authorization 헤더 파싱 (`Bearer <token>`)
- [ ] 에러 응답 처리 (401 Unauthorized)

---

### 🔧 기술적 고려사항

- **기술 스택**: Express 미들웨어, JWT
- **구현 방법**:
  - `Authorization: Bearer <token>` 헤더에서 토큰 추출
  - `verifyAccessToken()`으로 토큰 검증
  - 검증 성공 시 `req.user`에 페이로드 저장
  - 실패 시 401 에러 반환
- **코드 예시**:
  ```javascript
  const { verifyAccessToken } = require('../utils/jwtHelper');

  const authenticate = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: '인증 토큰이 필요합니다' }
        });
      }

      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: { code: error.message, message: '유효하지 않은 토큰입니다' }
      });
    }
  };

  const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'ADMIN_REQUIRED', message: '관리자 권한이 필요합니다' }
      });
    }
    next();
  };
  ```
- **보안 규칙** (PRD 6.2):
  - [BR-01] 인증된 사용자만 접근 가능
  - 토큰 만료 시 재인증 필요
  - 관리자 권한 확인 (role='admin')

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #8 - Task 2.4: JWT 유틸리티 작성

#### 후행 작업 (Blocks):
- #13 - Task 2.9: 할일 CRUD API 구현
- #15 - Task 2.11: 국경일 API 구현

---

### 📦 산출물

- `backend/src/middlewares/authMiddleware.js`

---

## [Phase 2] Task 2.7: 에러 핸들링 미들웨어 작성

**Labels**: `feature`, `backend`, `complexity:medium`

### 📋 작업 개요

통일된 에러 응답 형식 및 에러 로깅 미들웨어 작성

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 에러 핸들러 작성 완료
- [ ] 에러 응답 형식 통일
- [ ] 로그 출력 확인
- [ ] 환경별 응답 차이 구현 (dev/prod)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/middlewares/errorMiddleware.js` 작성
- [ ] 통일된 에러 응답 형식 (`{success: false, error: {code, message}}`)
- [ ] HTTP 상태 코드 매핑
- [ ] 에러 로깅 (console.error)
- [ ] 프로덕션 환경에서는 스택 트레이스 숨김

---

### 🔧 기술적 고려사항

- **기술 스택**: Express 에러 미들웨어
- **구현 방법**:
  - Express의 4개 파라미터 에러 미들웨어 사용
  - 에러 타입에 따라 HTTP 상태 코드 매핑
  - 개발 환경에서는 스택 트레이스 포함
- **코드 예시**:
  ```javascript
  const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || '서버 내부 오류가 발생했습니다';

    const response = {
      success: false,
      error: { code, message }
    };

    if (process.env.NODE_ENV === 'development') {
      response.error.stack = err.stack;
    }

    res.status(statusCode).json(response);
  };
  ```
- **에러 코드 매핑** (PRD 9.7):
  - 400: BAD_REQUEST, INVALID_DATE_RANGE, TITLE_REQUIRED
  - 401: UNAUTHORIZED, TOKEN_EXPIRED, INVALID_TOKEN
  - 403: FORBIDDEN, ADMIN_REQUIRED
  - 404: NOT_FOUND, TODO_NOT_FOUND
  - 409: CONFLICT, EMAIL_EXISTS
  - 429: TOO_MANY_REQUESTS
  - 500: INTERNAL_ERROR

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #6 - Task 2.2: 디렉토리 구조 생성

#### 후행 작업 (Blocks):
- #17 - Task 2.13: Express 앱 통합 및 라우트 연결

---

### 📦 산출물

- `backend/src/middlewares/errorMiddleware.js`

---

## [Phase 2] Task 2.8: 인증 API 구현 (회원가입, 로그인, 토큰 갱신)

**Labels**: `feature`, `backend`, `complexity:high`

### 📋 작업 개요

회원가입, 로그인, 토큰 갱신, 로그아웃 API 구현

**담당**: 백엔드 개발자
**예상 시간**: 3시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 회원가입 API 동작 확인 (이메일 중복 체크)
- [ ] 로그인 API 동작 확인 (Access + Refresh Token 발급)
- [ ] 토큰 갱신 API 동작 확인
- [ ] 비밀번호 bcrypt 해싱 확인
- [ ] 에러 응답 확인 (400, 401, 409)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/services/authService.js` 작성
  - `register(email, password, username)`: 회원가입
  - `login(email, password)`: 로그인
  - `refreshAccessToken(refreshToken)`: 토큰 갱신
- [ ] `src/controllers/authController.js` 작성
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout` (클라이언트 토큰 삭제 안내)
- [ ] `src/routes/authRoutes.js` 작성
- [ ] 입력 검증 (express-validator)

---

### 🔧 기술적 고려사항

- **기술 스택**: Express, PostgreSQL, JWT, bcrypt, express-validator
- **구현 방법**:
  - Service 계층: 비즈니스 로직 및 DB 접근
  - Controller 계층: HTTP 요청/응답 처리
  - 입력 검증: email 형식, 비밀번호 최소 8자
- **API 명세** (PRD 9.2):
  - `POST /api/auth/register` → 201 Created
  - `POST /api/auth/login` → 200 OK (accessToken, refreshToken)
  - `POST /api/auth/refresh` → 200 OK (새 accessToken)
  - `POST /api/auth/logout` → 200 OK
- **코드 예시 (authService.js)**:
  ```javascript
  const { pool } = require('../config/database');
  const { hashPassword, comparePassword } = require('../utils/passwordHelper');
  const { generateAccessToken, generateRefreshToken } = require('../utils/jwtHelper');

  const register = async (email, password, username) => {
    // 이메일 중복 체크
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      const error = new Error('이미 사용 중인 이메일입니다');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (email, password, username, role) VALUES ($1, $2, $3, $4) RETURNING userId, email, username, role',
      [email, hashedPassword, username, 'user']
    );

    return result.rows[0];
  };
  ```
- **보안 고려사항** (PRD 6.2):
  - [BR-01] 인증된 사용자만 접근 가능
  - 비밀번호 bcrypt 해싱 (salt rounds: 10)
  - JWT Access Token: 15분, Refresh Token: 7일
  - 이메일 중복 체크 ([BR-14])

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #7 - Task 2.3: 데이터베이스 연결 설정
- #8 - Task 2.4: JWT 유틸리티 작성
- #9 - Task 2.5: 비밀번호 해싱 유틸리티 작성

#### 후행 작업 (Blocks):
- #17 - Task 2.13: Express 앱 통합 및 라우트 연결

---

### 📦 산출물

- `backend/src/services/authService.js`
- `backend/src/controllers/authController.js`
- `backend/src/routes/authRoutes.js`

---

## [Phase 2] Task 2.9: 할일 CRUD API 구현

**Labels**: `feature`, `backend`, `complexity:high`

### 📋 작업 개요

할일 생성, 조회, 수정, 완료, 삭제, 복원 API 구현

**담당**: 백엔드 개발자
**예상 시간**: 4시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 7개 API 엔드포인트 동작 확인
- [ ] 인증 미들웨어 적용
- [ ] 권한 체크 (타인의 할일 접근 금지)
- [ ] 소프트 삭제 동작 확인 (status='deleted', deletedAt 기록)
- [ ] 날짜 검증 동작 확인
- [ ] 에러 응답 확인 (400, 403, 404)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/services/todoService.js` 작성
  - `getTodos(userId, filters)`: 할일 목록 조회
  - `getTodoById(todoId, userId)`: 할일 상세 조회
  - `createTodo(userId, todoData)`: 할일 생성
  - `updateTodo(todoId, userId, updateData)`: 할일 수정
  - `completeTodo(todoId, userId)`: 할일 완료
  - `deleteTodo(todoId, userId)`: 휴지통 이동 (소프트 삭제)
  - `restoreTodo(todoId, userId)`: 할일 복원
- [ ] `src/controllers/todoController.js` 작성
  - `GET /api/todos` (쿼리: status, search, sortBy, order)
  - `GET /api/todos/:id`
  - `POST /api/todos`
  - `PUT /api/todos/:id`
  - `PATCH /api/todos/:id/complete`
  - `DELETE /api/todos/:id`
  - `PATCH /api/todos/:id/restore`
- [ ] `src/routes/todoRoutes.js` 작성
- [ ] 비즈니스 규칙 적용 (dueDate >= startDate, 권한 체크)

---

### 🔧 기술적 고려사항

- **기술 스택**: Express, PostgreSQL, express-validator
- **구현 방법**:
  - 쿼리 파라미터로 필터링 (status, search, sortBy, order)
  - Prepared Statement로 SQL Injection 방지
  - 인증 미들웨어 적용 (모든 엔드포인트)
- **API 명세** (PRD 9.3):
  - `GET /api/todos?status=active&sortBy=dueDate&order=asc`
  - `POST /api/todos` (title, content, startDate, dueDate)
  - `DELETE /api/todos/:id` → 소프트 삭제 (status='deleted', deletedAt 기록)
  - `PATCH /api/todos/:id/restore` → 복원 (status='active', deletedAt=null)
- **비즈니스 규칙** (PRD 5.1.2):
  - [BR-02] 사용자는 자신의 할일만 조회/수정/삭제 가능
  - [BR-08] 할일 완료 시 isCompleted=true, status='completed'
  - [BR-12] 만료일은 시작일과 같거나 이후여야 함
  - [BR-05] 할일 삭제 시 휴지통으로 이동
- **코드 예시 (todoService.js)**:
  ```javascript
  const createTodo = async (userId, { title, content, startDate, dueDate }) => {
    // 날짜 검증
    if (dueDate && startDate && new Date(dueDate) < new Date(startDate)) {
      const error = new Error('만료일은 시작일보다 이전일 수 없습니다');
      error.statusCode = 400;
      error.code = 'INVALID_DATE_RANGE';
      throw error;
    }

    const result = await pool.query(
      'INSERT INTO todos (userId, title, content, startDate, dueDate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, content, startDate, dueDate]
    );

    return result.rows[0];
  };

  const deleteTodo = async (todoId, userId) => {
    const result = await pool.query(
      'UPDATE todos SET status = $1, deletedAt = NOW() WHERE todoId = $2 AND userId = $3 RETURNING *',
      ['deleted', todoId, userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('할일을 찾을 수 없습니다');
      error.statusCode = 404;
      error.code = 'TODO_NOT_FOUND';
      throw error;
    }

    return result.rows[0];
  };
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #7 - Task 2.3: 데이터베이스 연결 설정
- #10 - Task 2.6: 인증 미들웨어 작성

#### 후행 작업 (Blocks):
- #14 - Task 2.10: 휴지통 API 구현
- #17 - Task 2.13: Express 앱 통합 및 라우트 연결

---

### 📦 산출물

- `backend/src/services/todoService.js`
- `backend/src/controllers/todoController.js`
- `backend/src/routes/todoRoutes.js`

---

## [Phase 2] Task 2.10: 휴지통 API 구현

**Labels**: `feature`, `backend`, `complexity:medium`

### 📋 작업 개요

휴지통 조회 및 영구 삭제 API 구현

**담당**: 백엔드 개발자
**예상 시간**: 1.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 휴지통 조회 API 동작 확인
- [ ] 영구 삭제 API 동작 확인 (DB에서 완전히 제거)
- [ ] 권한 체크 동작 확인
- [ ] 에러 응답 확인 (404, 400)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/services/trashService.js` 작성
  - `getTrash(userId)`: 휴지통 조회 (status='deleted')
  - `permanentlyDelete(todoId, userId)`: 영구 삭제
- [ ] `src/controllers/trashController.js` 작성
  - `GET /api/trash`
  - `DELETE /api/trash/:id`
- [ ] `src/routes/trashRoutes.js` 작성

---

### 🔧 기술적 고려사항

- **기술 스택**: Express, PostgreSQL
- **구현 방법**:
  - 휴지통 조회: `status='deleted'` 필터
  - 영구 삭제: `DELETE FROM todos WHERE todoId = ? AND status = 'deleted'`
  - 활성 상태 할일은 영구 삭제 불가 (400 에러)
- **API 명세** (PRD 9.4):
  - `GET /api/trash` → 삭제된 할일 목록
  - `DELETE /api/trash/:id` → 영구 삭제 (DB에서 완전히 제거)
- **비즈니스 규칙** (PRD 5.1.3):
  - [BR-06] 휴지통의 할일은 복원 가능
  - [BR-07] 영구 삭제 시 DB에서 완전히 제거
- **코드 예시 (trashService.js)**:
  ```javascript
  const getTrash = async (userId) => {
    const result = await pool.query(
      'SELECT * FROM todos WHERE userId = $1 AND status = $2 ORDER BY deletedAt DESC',
      [userId, 'deleted']
    );
    return result.rows;
  };

  const permanentlyDelete = async (todoId, userId) => {
    // 삭제 상태 확인
    const checkResult = await pool.query(
      'SELECT status FROM todos WHERE todoId = $1 AND userId = $2',
      [todoId, userId]
    );

    if (checkResult.rows.length === 0) {
      const error = new Error('할일을 찾을 수 없습니다');
      error.statusCode = 404;
      error.code = 'TODO_NOT_FOUND';
      throw error;
    }

    if (checkResult.rows[0].status !== 'deleted') {
      const error = new Error('삭제된 할일만 영구 삭제할 수 있습니다');
      error.statusCode = 400;
      error.code = 'BAD_REQUEST';
      throw error;
    }

    await pool.query('DELETE FROM todos WHERE todoId = $1 AND userId = $2', [todoId, userId]);
  };
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #13 - Task 2.9: 할일 CRUD API 구현

#### 후행 작업 (Blocks):
- #17 - Task 2.13: Express 앱 통합 및 라우트 연결

---

### 📦 산출물

- `backend/src/services/trashService.js`
- `backend/src/controllers/trashController.js`
- `backend/src/routes/trashRoutes.js`

---

## [Phase 2] Task 2.11: 국경일 API 구현

**Labels**: `feature`, `backend`, `complexity:medium`

### 📋 작업 개요

국경일 조회, 추가, 수정 API 구현 (관리자 권한 적용)

**담당**: 백엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 국경일 조회 API 동작 확인 (인증 필요)
- [ ] 국경일 추가 API 동작 확인 (관리자만 가능)
- [ ] 국경일 수정 API 동작 확인 (관리자만 가능)
- [ ] 연도/월 필터링 동작 확인
- [ ] 에러 응답 확인 (403, 404)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/services/holidayService.js` 작성
  - `getHolidays(year, month)`: 국경일 조회
  - `createHoliday(holidayData)`: 국경일 추가 (관리자 전용)
  - `updateHoliday(holidayId, updateData)`: 국경일 수정 (관리자 전용)
- [ ] `src/controllers/holidayController.js` 작성
  - `GET /api/holidays` (쿼리: year, month)
  - `POST /api/holidays` (관리자 전용)
  - `PUT /api/holidays/:id` (관리자 전용)
- [ ] `src/routes/holidayRoutes.js` 작성
- [ ] 관리자 권한 미들웨어 적용

---

### 🔧 기술적 고려사항

- **기술 스택**: Express, PostgreSQL
- **구현 방법**:
  - 조회: 모든 인증된 사용자 가능
  - 추가/수정: `requireAdmin` 미들웨어 적용
  - 쿼리 파라미터로 연도/월 필터링
- **API 명세** (PRD 9.5):
  - `GET /api/holidays?year=2025&month=1` → 국경일 목록
  - `POST /api/holidays` (관리자 전용) → 201 Created
  - `PUT /api/holidays/:id` (관리자 전용) → 200 OK
- **비즈니스 규칙** (PRD 5.1.4):
  - [BR-03] 모든 인증된 사용자가 조회 가능
  - [BR-04] 관리자(role='admin')만 추가/수정 권한
  - [BR-10] 국경일은 삭제 불가
  - [BR-11] 매년 반복되는 일정 지원 (isRecurring)
- **코드 예시 (holidayService.js)**:
  ```javascript
  const getHolidays = async (year, month) => {
    let query = 'SELECT * FROM holidays WHERE 1=1';
    const params = [];

    if (year) {
      params.push(year);
      query += ` AND EXTRACT(YEAR FROM date) = $${params.length}`;
    }

    if (month) {
      params.push(month);
      query += ` AND EXTRACT(MONTH FROM date) = $${params.length}`;
    }

    query += ' ORDER BY date ASC';

    const result = await pool.query(query, params);
    return result.rows;
  };

  const createHoliday = async ({ title, date, description, isRecurring }) => {
    const result = await pool.query(
      'INSERT INTO holidays (title, date, description, isRecurring) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, date, description, isRecurring || true]
    );
    return result.rows[0];
  };
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #7 - Task 2.3: 데이터베이스 연결 설정
- #10 - Task 2.6: 인증 미들웨어 작성

#### 후행 작업 (Blocks):
- #17 - Task 2.13: Express 앱 통합 및 라우트 연결

---

### 📦 산출물

- `backend/src/services/holidayService.js`
- `backend/src/controllers/holidayController.js`
- `backend/src/routes/holidayRoutes.js`

---

## [Phase 2] Task 2.12: Rate Limiting 미들웨어 추가

**Labels**: `feature`, `backend`, `complexity:low`

### 📋 작업 개요

API 요청 제한 미들웨어 설정 (DDoS 방어)

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P1

---

### ✅ 완료 조건

- [ ] Rate Limiter 설정 완료
- [ ] 인증 API에 적용
- [ ] 제한 초과 시 429 응답 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/middlewares/rateLimitMiddleware.js` 작성
- [ ] 일반 API: 100 req/min per IP
- [ ] 인증 API: 5 req/15min per IP
- [ ] `express-rate-limit` 사용

---

### 🔧 기술적 고려사항

- **기술 스택**: express-rate-limit
- **구현 방법**:
  - IP 기반 요청 제한
  - 일반 API와 인증 API 분리 설정
- **보안 고려사항** (PRD 6.2):
  - Rate Limiting: 100 req/min per user (일반 API)
  - 인증 API: 5 req/15min (브루트 포스 공격 방어)
- **코드 예시**:
  ```javascript
  const rateLimit = require('express-rate-limit');

  const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분
    max: 100,
    message: {
      success: false,
      error: { code: 'TOO_MANY_REQUESTS', message: '요청 횟수를 초과했습니다' }
    }
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 5,
    message: {
      success: false,
      error: { code: 'TOO_MANY_REQUESTS', message: '로그인 시도 횟수를 초과했습니다' }
    }
  });

  module.exports = { generalLimiter, authLimiter };
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #6 - Task 2.2: 디렉토리 구조 생성

#### 후행 작업 (Blocks):
- #17 - Task 2.13: Express 앱 통합 및 라우트 연결

---

### 📦 산출물

- `backend/src/middlewares/rateLimitMiddleware.js`

---

## [Phase 2] Task 2.13: Express 앱 통합 및 라우트 연결

**Labels**: `feature`, `backend`, `integration`, `complexity:medium`

### 📋 작업 개요

Express 앱 설정, 미들웨어 적용, 라우트 연결

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] CORS 설정 완료
- [ ] 보안 헤더 적용 확인
- [ ] 4개 라우트 연결 확인
- [ ] 에러 핸들러 동작 확인
- [ ] 서버 실행 확인 (`http://localhost:3000`)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `src/app.js` 작성
  - CORS 설정 (cors 미들웨어)
  - Helmet 설정 (보안 헤더)
  - JSON 파싱 (express.json())
  - 라우트 연결 (`/api/auth`, `/api/todos`, `/api/trash`, `/api/holidays`)
  - 에러 핸들러 적용 (가장 마지막)
- [ ] `src/server.js` 작성
  - 포트 설정 (3000)
  - 서버 시작

---

### 🔧 기술적 고려사항

- **기술 스택**: Express, cors, helmet
- **구현 방법**:
  - 미들웨어 적용 순서 중요 (cors → helmet → json → routes → error)
  - CORS: 프론트엔드 도메인 허용
  - Helmet: 보안 헤더 자동 설정
- **보안 고려사항** (PRD 6.2):
  - CORS 정책 설정 (허용된 Origin만 접근)
  - Helmet으로 XSS, Clickjacking 방어
  - HTTPS 통신 필수 (프로덕션)
- **코드 예시 (app.js)**:
  ```javascript
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const { testConnection } = require('./config/database');
  const errorHandler = require('./middlewares/errorMiddleware');

  const authRoutes = require('./routes/authRoutes');
  const todoRoutes = require('./routes/todoRoutes');
  const trashRoutes = require('./routes/trashRoutes');
  const holidayRoutes = require('./routes/holidayRoutes');

  const app = express();

  // 미들웨어
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));
  app.use(helmet());
  app.use(express.json());

  // 라우트
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);
  app.use('/api/trash', trashRoutes);
  app.use('/api/holidays', holidayRoutes);

  // 에러 핸들러 (가장 마지막)
  app.use(errorHandler);

  // DB 연결 테스트
  testConnection();

  module.exports = app;
  ```
- **코드 예시 (server.js)**:
  ```javascript
  require('dotenv').config();
  const app = require('./app');

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
  ```

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #12 - Task 2.8: 인증 API 구현
- #13 - Task 2.9: 할일 CRUD API 구현
- #14 - Task 2.10: 휴지통 API 구현
- #15 - Task 2.11: 국경일 API 구현

#### 후행 작업 (Blocks):
- #18 - Task 2.14: API 테스트

---

### 📦 산출물

- `backend/src/app.js`
- `backend/src/server.js`

---

## [Phase 2] Task 2.14: API 테스트 (Postman/Thunder Client)

**Labels**: `testing`, `backend`, `complexity:medium`

### 📋 작업 개요

모든 API 엔드포인트 기능 테스트 및 검증

**담당**: 백엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 모든 API 엔드포인트 테스트 완료
- [ ] 성공 케이스 동작 확인
- [ ] 실패 케이스 에러 응답 확인
- [ ] JWT 인증 동작 확인
- [ ] 권한 체크 동작 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] Postman 또는 Thunder Client 컬렉션 생성
- [ ] 모든 API 엔드포인트 테스트
  - 회원가입 → 로그인 → 할일 생성 → 조회 → 수정 → 삭제 → 복원 → 영구 삭제
  - 국경일 조회
  - 토큰 갱신
- [ ] 성공 케이스 및 실패 케이스 테스트
- [ ] 에러 응답 확인

---

### 🔧 기술적 고려사항

- **테스트 도구**: Postman 또는 VS Code Thunder Client
- **테스트 시나리오**:
  1. **회원가입**: `POST /api/auth/register`
     - 성공: 201, 사용자 정보 반환
     - 실패: 409 (이메일 중복), 400 (검증 실패)
  2. **로그인**: `POST /api/auth/login`
     - 성공: 200, accessToken, refreshToken 반환
     - 실패: 401 (잘못된 비밀번호)
  3. **할일 생성**: `POST /api/todos` (Authorization 헤더 필요)
     - 성공: 201, 할일 정보 반환
     - 실패: 401 (토큰 없음), 400 (제목 누락)
  4. **할일 조회**: `GET /api/todos?status=active`
     - 성공: 200, 할일 목록 반환
  5. **할일 완료**: `PATCH /api/todos/:id/complete`
     - 성공: 200, status='completed'
  6. **할일 삭제**: `DELETE /api/todos/:id`
     - 성공: 200, status='deleted', deletedAt 기록
  7. **할일 복원**: `PATCH /api/todos/:id/restore`
     - 성공: 200, status='active'
  8. **영구 삭제**: `DELETE /api/trash/:id`
     - 성공: 200, DB에서 완전히 제거
  9. **국경일 조회**: `GET /api/holidays?year=2025`
     - 성공: 200, 국경일 목록 반환
  10. **토큰 갱신**: `POST /api/auth/refresh`
      - 성공: 200, 새 accessToken 반환
      - 실패: 401 (유효하지 않은 refreshToken)
- **검증 항목**:
  - HTTP 상태 코드 확인
  - 응답 JSON 형식 확인 (`{success: true/false, data/error}`)
  - JWT 인증 동작 (401 Unauthorized)
  - 권한 체크 (403 Forbidden)
  - 비즈니스 규칙 검증 (날짜 검증, 이메일 중복 등)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #17 - Task 2.13: Express 앱 통합 및 라우트 연결

#### 후행 작업 (Blocks):
- 없음 (Phase 2 마지막 작업)

---

### 📦 산출물

- Postman/Thunder Client 컬렉션 (선택)
- 테스트 결과 메모
