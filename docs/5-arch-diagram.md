# WHS-TodoList 기술 아키텍처

**버전**: 1.0
**작성일**: 2025-11-26
**상태**: 최종
**작성자**: Claude
**참조 문서**: [PRD](./3-prd.md)

---

## 목차

1. [아키텍처 개요](#1-아키텍처-개요)
2. [전체 시스템 아키텍처](#2-전체-시스템-아키텍처)
3. [레이어별 상세 설명](#3-레이어별-상세-설명)
4. [데이터 플로우](#4-데이터-플로우)
5. [배포 아키텍처](#5-배포-아키텍처)

---

## 1. 아키텍처 개요

### 1.1 아키텍처 원칙

WHS-TodoList는 **단순하고 효율적인 3-Layer 아키텍처**를 채택합니다.

**핵심 원칙**:
- **단순성**: 오버엔지니어링 지양, 필요한 기능만 구현
- **확장성**: 향후 기능 추가를 위한 모듈화된 구조
- **보안성**: JWT 기반 인증 및 데이터 보호
- **성능**: Stateless 아키텍처로 수평 확장 가능

### 1.2 기술 스택 요약

| 레이어         | 기술                                          |
| -------------- | --------------------------------------------- |
| **프론트엔드** | React 18, Vite, Tailwind CSS, Zustand, Axios  |
| **백엔드**     | Node.js, Express.js, JWT, bcrypt              |
| **데이터베이스** | PostgreSQL (Supabase)                         |
| **배포**       | Vercel (Frontend + Serverless Functions)      |

---

## 2. 전체 시스템 아키텍처

### 2.1 고수준 아키텍처 다이어그램

```mermaid
graph TB
    subgraph Client["클라이언트 레이어"]
        Browser["웹 브라우저<br/>(Chrome, Safari, Firefox)"]
        Mobile["모바일 브라우저<br/>(iOS Safari, Chrome Mobile)"]
    end

    subgraph Frontend["프론트엔드 레이어<br/>(Vercel)"]
        React["React 18 Application"]
        Zustand["Zustand<br/>(상태 관리)"]
        TailwindCSS["Tailwind CSS<br/>(스타일링)"]
        Axios["Axios<br/>(HTTP 클라이언트)"]

        React --> Zustand
        React --> TailwindCSS
        React --> Axios
    end

    subgraph Backend["백엔드 레이어<br/>(Vercel Serverless)"]
        Express["Express.js API"]
        Auth["JWT 인증 미들웨어"]
        Controllers["컨트롤러"]
        Services["비즈니스 로직"]

        Express --> Auth
        Express --> Controllers
        Controllers --> Services
    end

    subgraph Database["데이터베이스 레이어<br/>(Supabase)"]
        PostgreSQL[(PostgreSQL 15+)]
        Tables["테이블<br/>• User<br/>• Todo<br/>• Holiday"]

        PostgreSQL --> Tables
    end

    Browser --> React
    Mobile --> React
    Axios -->|REST API<br/>HTTPS| Express
    Services -->|SQL 쿼리<br/>Connection Pool| PostgreSQL

    style Client fill:#E3F2FD
    style Frontend fill:#FFF3E0
    style Backend fill:#E8F5E9
    style Database fill:#F3E5F5
```

### 2.2 컴포넌트 구조 (C4 모델 - Level 2)

```mermaid
graph LR
    subgraph "Frontend Application"
        UI["UI Components<br/>(TodoCard, Modal, Button)"]
        Pages["Pages<br/>(Login, TodoList, Trash)"]
        Store["Zustand Store<br/>(authStore, todoStore)"]
        API["API Service<br/>(axios instances)"]

        Pages --> UI
        Pages --> Store
        Store --> API
    end

    subgraph "Backend API"
        Routes["Routes<br/>(auth, todos, holidays)"]
        MW["Middlewares<br/>(auth, validation, error)"]
        Ctrl["Controllers<br/>(authCtrl, todoCtrl)"]
        Svc["Services<br/>(authService, todoService)"]

        Routes --> MW
        MW --> Ctrl
        Ctrl --> Svc
    end

    subgraph "Database"
        DB[(PostgreSQL)]
    end

    API -->|HTTP/JSON| Routes
    Svc -->|pg client| DB

    style Frontend fill:#FFE0B2
    style Backend fill:#C8E6C9
    style Database fill:#E1BEE7
```

---

## 3. 레이어별 상세 설명

### 3.1 프론트엔드 레이어

**역할**: 사용자 인터페이스 제공 및 사용자 경험 관리

**핵심 기술**:
- **React 18**: UI 컴포넌트 기반 개발
- **Vite**: 빠른 빌드 및 개발 서버
- **Tailwind CSS**: 유틸리티 우선 스타일링
- **Zustand**: 간단하고 효율적인 상태 관리
- **React Router v6**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 통신 (JWT 토큰 자동 포함)

**주요 디렉토리 구조**:
```
frontend/
├── src/
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── stores/          # Zustand 상태 관리
│   ├── services/        # API 호출 로직
│   ├── hooks/           # Custom React Hooks
│   ├── utils/           # 유틸리티 함수
│   └── App.jsx          # 메인 앱 컴포넌트
```

**책임**:
- 사용자 인증 상태 관리
- 할일 목록 렌더링 및 CRUD 조작
- 폼 입력 검증 (React Hook Form + Zod)
- 반응형 디자인 구현
- 다크모드 지원

### 3.2 백엔드 레이어

**역할**: 비즈니스 로직 처리 및 데이터베이스 연동

**핵심 기술**:
- **Node.js 18+**: JavaScript 런타임
- **Express.js**: 웹 프레임워크
- **jsonwebtoken**: JWT 토큰 생성/검증
- **bcrypt**: 비밀번호 해싱
- **pg (node-postgres)**: PostgreSQL 클라이언트
- **express-validator**: 요청 데이터 검증
- **helmet**: 보안 헤더 설정
- **express-rate-limit**: API 호출 제한

**주요 디렉토리 구조**:
```
backend/
├── src/
│   ├── routes/          # API 라우트 정의
│   ├── controllers/     # 요청 처리 로직
│   ├── services/        # 비즈니스 로직
│   ├── middlewares/     # 인증, 검증, 에러 핸들링
│   ├── models/          # 데이터 모델 (선택)
│   ├── config/          # 설정 파일 (DB, JWT)
│   ├── utils/           # 유틸리티 함수
│   └── app.js           # Express 앱 설정
```

**책임**:
- JWT 기반 사용자 인증/인가
- RESTful API 엔드포인트 제공
- 비즈니스 규칙 적용 (날짜 검증, 권한 체크)
- 데이터베이스 트랜잭션 관리
- 에러 핸들링 및 로깅
- CORS, Rate Limiting, 보안 헤더 설정

### 3.3 데이터베이스 레이어

**역할**: 영구 데이터 저장 및 관리

**핵심 기술**:
- **PostgreSQL 15+**: 관계형 데이터베이스
- **Supabase**: PostgreSQL 호스팅 (무료 티어)
- **Connection Pooling**: 효율적인 연결 관리

**주요 테이블**:

| 테이블   | 설명                           | 관계           |
| -------- | ------------------------------ | -------------- |
| `User`   | 사용자 정보 (이메일, 비밀번호) | 1:N → Todo     |
| `Todo`   | 할일 정보 (제목, 날짜, 상태)   | N:1 ← User     |
| `Holiday` | 국경일 정보 (제목, 날짜)       | 독립 테이블    |

**인덱스 전략**:
- `User.email`: UNIQUE INDEX (로그인 조회)
- `Todo.userId, Todo.status`: INDEX (사용자별 할일 조회)
- `Todo.dueDate`: INDEX (날짜 정렬)
- `Holiday.date`: INDEX (날짜 조회)

**책임**:
- 데이터 영속성 보장
- 트랜잭션 지원 (ACID 보장)
- 소프트 삭제 구현 (deletedAt 필드)
- 자동 백업 (Supabase)

---

## 4. 데이터 플로우

### 4.1 사용자 인증 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as React App
    participant Backend as Express API
    participant DB as PostgreSQL

    User->>Frontend: 1. 로그인 요청<br/>(email, password)
    Frontend->>Backend: 2. POST /api/auth/login
    Backend->>DB: 3. 사용자 조회<br/>SELECT * FROM User WHERE email=?
    DB-->>Backend: 4. 사용자 데이터
    Backend->>Backend: 5. bcrypt 비밀번호 검증
    Backend->>Backend: 6. JWT 토큰 생성<br/>(Access + Refresh)
    Backend-->>Frontend: 7. 토큰 반환<br/>{accessToken, refreshToken}
    Frontend->>Frontend: 8. 토큰 저장<br/>(localStorage)
    Frontend-->>User: 9. 로그인 완료<br/>(메인 페이지 이동)
```

### 4.2 할일 생성 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as React App
    participant Backend as Express API
    participant DB as PostgreSQL

    User->>Frontend: 1. 할일 추가<br/>(제목, 날짜 입력)
    Frontend->>Frontend: 2. 클라이언트 검증<br/>(Zod 스키마)
    Frontend->>Backend: 3. POST /api/todos<br/>Authorization: Bearer {token}
    Backend->>Backend: 4. JWT 토큰 검증<br/>(auth middleware)
    Backend->>Backend: 5. 요청 데이터 검증<br/>(express-validator)
    Backend->>Backend: 6. 비즈니스 규칙 체크<br/>(dueDate >= startDate)
    Backend->>DB: 7. INSERT INTO Todo<br/>(userId, title, content, dates)
    DB-->>Backend: 8. 생성된 할일 데이터
    Backend-->>Frontend: 9. 201 Created<br/>{success: true, data: {...}}
    Frontend->>Frontend: 10. Zustand 상태 업데이트
    Frontend-->>User: 11. UI 갱신<br/>(새 할일 표시)
```

### 4.3 할일 조회 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as React App
    participant Backend as Express API
    participant DB as PostgreSQL

    User->>Frontend: 1. 페이지 접속
    Frontend->>Backend: 2. GET /api/todos<br/>?status=active&sortBy=dueDate
    Backend->>Backend: 3. JWT 인증
    Backend->>DB: 4. SELECT * FROM Todo<br/>WHERE userId=? AND status='active'<br/>ORDER BY dueDate
    DB-->>Backend: 5. 할일 목록 데이터
    Backend-->>Frontend: 6. 200 OK<br/>{success: true, data: [todos]}
    Frontend->>Frontend: 7. Zustand 상태 저장
    Frontend-->>User: 8. 할일 목록 렌더링
```

### 4.4 휴지통 복원 플로우

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Frontend as React App
    participant Backend as Express API
    participant DB as PostgreSQL

    User->>Frontend: 1. 휴지통에서 복원 클릭
    Frontend->>Backend: 2. PATCH /api/todos/:id/restore
    Backend->>Backend: 3. JWT 인증 + 권한 확인
    Backend->>DB: 4. UPDATE Todo<br/>SET status='active', deletedAt=NULL<br/>WHERE todoId=? AND userId=?
    DB-->>Backend: 5. 업데이트 완료
    Backend-->>Frontend: 6. 200 OK<br/>{success: true, data: {...}}
    Frontend->>Frontend: 7. 상태 업데이트
    Frontend-->>User: 8. 할일 목록으로 이동
```

---

## 5. 배포 아키텍처

### 5.1 배포 환경 구성도

```mermaid
graph TB
    subgraph Internet["인터넷"]
        Users["사용자<br/>(웹/모바일 브라우저)"]
    end

    subgraph Vercel["Vercel Platform"]
        CDN["Vercel CDN<br/>(정적 파일 배포)"]
        FrontendApp["React SPA<br/>(정적 호스팅)"]
        ServerlessAPI["Express API<br/>(Serverless Functions)"]

        CDN --> FrontendApp
    end

    subgraph Supabase["Supabase Cloud"]
        PostgresDB[(PostgreSQL 15+<br/>Database)]
        Backup["자동 백업"]

        PostgresDB -.-> Backup
    end

    subgraph GitHub["GitHub Repository"]
        Code["소스 코드"]
    end

    Users -->|HTTPS| CDN
    FrontendApp -->|REST API<br/>HTTPS| ServerlessAPI
    ServerlessAPI -->|Connection Pool<br/>SSL| PostgresDB

    Code -->|Git Push| Vercel
    Vercel -->|자동 배포<br/>(CI/CD)| FrontendApp
    Vercel -->|자동 배포<br/>(CI/CD)| ServerlessAPI

    style Internet fill:#E3F2FD
    style Vercel fill:#FFF3E0
    style Supabase fill:#E8F5E9
    style GitHub fill:#F3E5F5
```

### 5.2 배포 프로세스

**단계별 배포 흐름**:

1. **개발 → Git Push**
   - 로컬 개발 완료 후 GitHub에 코드 푸시

2. **GitHub → Vercel 자동 배포**
   - Vercel이 GitHub Webhook 감지
   - 자동으로 빌드 및 배포 시작

3. **프론트엔드 배포**
   - Vite로 React 앱 빌드
   - 정적 파일을 Vercel CDN에 배포
   - 도메인: `https://whs-todolist.vercel.app`

4. **백엔드 배포**
   - Express API를 Serverless Functions로 변환
   - `/api/*` 경로로 라우팅 설정
   - 환경 변수 주입 (JWT_SECRET, DB 연결 정보)

5. **데이터베이스 연결**
   - Supabase PostgreSQL 연결 문자열 설정
   - Connection Pool 구성 (최대 연결 수: 10)

### 5.3 환경 변수 관리

**프론트엔드 (.env)**:
```bash
VITE_API_BASE_URL=https://whs-todolist.vercel.app/api
```

**백엔드 (Vercel 환경 변수)**:
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
```

### 5.4 성능 최적화

**CDN 활용**:
- Vercel CDN을 통한 전 세계 빠른 정적 파일 제공
- 자동 이미지 최적화

**Serverless 장점**:
- 자동 스케일링 (트래픽에 따라 자동 증감)
- Cold Start 최소화 (Vercel 최적화)
- Pay-per-use 요금제 (무료 티어: 100GB 대역폭)

**데이터베이스 최적화**:
- Connection Pooling으로 연결 재사용
- 인덱스를 통한 쿼리 성능 향상
- Prepared Statements로 SQL Injection 방어

### 5.5 보안 구성

**HTTPS 강제**:
- Vercel 자동 SSL/TLS 인증서 발급
- HTTP → HTTPS 자동 리다이렉트

**CORS 설정**:
```javascript
// backend/src/app.js
app.use(cors({
  origin: 'https://whs-todolist.vercel.app',
  credentials: true
}));
```

**보안 헤더** (Helmet):
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

**Rate Limiting**:
- API 호출 제한: 100 requests/min per IP
- 로그인 시도 제한: 5 attempts/15min

---

## 6. 아키텍처 의사결정 기록 (ADR)

### ADR-001: Zustand 선택 (Redux 대신)

**결정**: 상태 관리 라이브러리로 Zustand 선택

**근거**:
- 간단한 API (boilerplate 코드 최소화)
- 번들 크기 작음 (~1KB)
- TypeScript 지원
- MVP 규모에 충분한 기능

**대안**:
- Redux: 너무 복잡 (오버엔지니어링)
- Context API: 성능 이슈 가능성

---

### ADR-002: Serverless Functions 배포

**결정**: Vercel Serverless Functions로 백엔드 배포

**근거**:
- 무료 티어 활용 가능
- 자동 스케일링
- 프론트엔드와 동일 플랫폼 (관리 편의성)
- CI/CD 자동화

**대안**:
- AWS EC2: 비용 및 관리 부담
- Heroku: 무료 티어 종료

---

### ADR-003: PostgreSQL (Supabase)

**결정**: Supabase 호스팅 PostgreSQL 사용

**근거**:
- 관계형 DB 필요 (User-Todo 관계)
- 무료 티어 (500MB 스토리지)
- 자동 백업 기능
- Connection Pooling 지원

**대안**:
- MongoDB: NoSQL은 관계 관리 복잡
- Firebase: 비용 예측 어려움

---

### ADR-004: JWT 인증 (Session 대신)

**결정**: JWT 기반 Stateless 인증

**근거**:
- Serverless 환경에 적합 (서버 상태 불필요)
- 수평 확장 용이
- 모바일 앱 확장 고려

**대안**:
- Session: Serverless에 부적합
- OAuth: MVP에 과도

---

## 7. 향후 아키텍처 발전 방향

### 7.1 Phase 2 (2차 개발)

**예상 추가 기능**:
- 캘린더 뷰 (월간/주간)
- 할일 카테고리/태그
- 알림 기능 (이메일/푸시)
- 통계 대시보드

**아키텍처 변경 검토**:
- Redis 캐싱 레이어 추가 (자주 조회되는 데이터)
- WebSocket 실시간 동기화 (협업 기능)
- CDN 이미지 스토리지 (프로필 사진)

### 7.2 확장성 고려사항

**수평 확장**:
- Stateless 아키텍처로 인스턴스 추가 용이
- Database Read Replica 추가 (읽기 성능 향상)

**모니터링**:
- Vercel Analytics
- Sentry (에러 추적)
- DataDog (성능 모니터링) - 선택

---

## 8. 부록

### 8.1 기술 스택 버전

| 기술           | 버전      |
| -------------- | --------- |
| React          | 18.x      |
| Vite           | 5.x       |
| Tailwind CSS   | 3.x       |
| Zustand        | 4.x       |
| Node.js        | 18+       |
| Express        | 4.x       |
| PostgreSQL     | 15+       |
| jsonwebtoken   | 9.x       |
| bcrypt         | 5.x       |

### 8.2 참조 문서

- [PRD (Product Requirements Document)](./3-prd.md)
- [도메인 정의서](./1-domain-definition.md)
- [스타일 가이드](./4-style-guide.md)

### 8.3 외부 링크

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React 18 Docs](https://react.dev/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)

---

**문서 종료**
