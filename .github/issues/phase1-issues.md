# Phase 1: 데이터베이스 구축 이슈 목록

---

## [Phase 1] Task 1.1: 로컬 PostgreSQL 설치 및 설정

**Labels**: `setup`, `database`, `complexity:low`

### 📋 작업 개요

PostgreSQL 15+ 로컬 개발 환경 설정 및 데이터베이스 생성

**담당**: 백엔드 개발자
**예상 시간**: 1시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] PostgreSQL 서비스 실행 중
- [ ] `whs_todolist_dev` 데이터베이스 생성 완료
- [ ] 연결 문자열 확인: `postgresql://localhost:5432/whs_todolist_dev`
- [ ] 관리 도구로 접속 가능

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] PostgreSQL 15+ 설치 (Windows 환경)
- [ ] pgAdmin 또는 DBeaver 설치 (DB 관리 도구)
- [ ] 로컬 PostgreSQL 서버 실행 확인
- [ ] 데이터베이스 생성 (`whs_todolist_dev`)
- [ ] 연결 테스트 (`psql` 또는 GUI 도구)

---

### 🔧 기술적 고려사항

- **기술 스택**: PostgreSQL 15+, pgAdmin/DBeaver
- **구현 방법**:
  - Windows 환경에서 PostgreSQL 공식 설치 프로그램 사용
  - 기본 포트 5432 사용
  - UTF-8 인코딩 설정
- **주의사항**:
  - 슈퍼유저 비밀번호 안전하게 보관
  - 로컬 개발용이므로 외부 접속 차단
  - 데이터베이스명: `whs_todolist_dev`

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- 없음 (독립 작업)

#### 후행 작업 (Blocks):
- #2 - Task 1.2: 데이터베이스 스키마 작성

---

### 📦 산출물

- PostgreSQL 설치 완료
- 데이터베이스: `whs_todolist_dev`
- 연결 정보 메모 (`.env` 작성용)

---

## [Phase 1] Task 1.2: 데이터베이스 스키마 작성 (schema.sql)

**Labels**: `feature`, `database`, `complexity:medium`

### 📋 작업 개요

User, Todo, Holiday 테이블 스키마 정의 및 제약조건 설정

**담당**: 백엔드 개발자
**예상 시간**: 2시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] `schema.sql` 파일 작성 완료
- [ ] UUID 기본 키 설정
- [ ] 인덱스 설정 완료
- [ ] 외래 키 제약 조건 설정
- [ ] CHECK 제약 조건 추가

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] User 테이블 정의 (userId, email, password, username, role, createdAt, updatedAt)
- [ ] Todo 테이블 정의 (todoId, userId, title, content, startDate, dueDate, status, isCompleted, createdAt, updatedAt, deletedAt)
- [ ] Holiday 테이블 정의 (holidayId, title, date, description, isRecurring, createdAt, updatedAt)
- [ ] UNIQUE INDEX 추가: User.email
- [ ] INDEX 추가: Todo(userId, status), Todo(dueDate), Holiday(date)
- [ ] FOREIGN KEY 설정: Todo.userId → User.userId (ON DELETE CASCADE)
- [ ] CHECK 제약: dueDate >= startDate

---

### 🔧 기술적 고려사항

- **기술 스택**: PostgreSQL 15+, SQL DDL
- **구현 방법**:
  - UUID 타입 사용 (`uuid_generate_v4()`)
  - ENUM 타입 사용 (status: 'active', 'completed', 'deleted', role: 'user', 'admin')
  - TIMESTAMP WITH TIME ZONE 사용
  - CASCADE 옵션으로 참조 무결성 보장
- **주의사항**:
  - 비밀번호는 bcrypt 해싱 전제 (VARCHAR(255))
  - deletedAt은 NULL 허용 (소프트 삭제용)
  - 인덱스를 통한 조회 성능 최적화
  - CHECK 제약으로 비즈니스 규칙 강제 ([BR-12] dueDate >= startDate)

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #1 - Task 1.1: 로컬 PostgreSQL 설치 및 설정

#### 후행 작업 (Blocks):
- #3 - Task 1.3: 스키마 실행 및 검증

---

### 📦 산출물

- `database/schema.sql`

---

## [Phase 1] Task 1.3: 스키마 실행 및 검증

**Labels**: `testing`, `database`, `complexity:low`

### 📋 작업 개요

작성된 schema.sql 실행 및 테이블, 인덱스, 제약조건 검증

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P0

---

### ✅ 완료 조건

- [ ] 3개 테이블 생성 확인
- [ ] 인덱스 6개 생성 확인
- [ ] CHECK 제약 동작 확인 (잘못된 날짜 입력 시 에러)
- [ ] UNIQUE 제약 동작 확인 (이메일 중복 시 에러)

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] `schema.sql` 실행 (`psql -U postgres -d whs_todolist_dev -f schema.sql`)
- [ ] 테이블 생성 확인 (User, Todo, Holiday)
- [ ] 인덱스 생성 확인
- [ ] 제약 조건 테스트 (이메일 중복, 날짜 검증)

---

### 🔧 기술적 고려사항

- **기술 스택**: PostgreSQL, psql CLI
- **구현 방법**:
  - psql 커맨드 라인으로 스크립트 실행
  - `\dt` 명령으로 테이블 목록 확인
  - `\d table_name` 명령으로 테이블 구조 확인
  - `\di` 명령으로 인덱스 목록 확인
- **검증 방법**:
  - CHECK 제약: `INSERT INTO todos (dueDate, startDate) VALUES ('2025-01-01', '2025-01-10')` → 에러 발생 확인
  - UNIQUE 제약: 동일 이메일로 2번 User INSERT → 에러 발생 확인
  - FOREIGN KEY: 존재하지 않는 userId로 Todo INSERT → 에러 발생 확인

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #2 - Task 1.2: 데이터베이스 스키마 작성

#### 후행 작업 (Blocks):
- #4 - Task 1.4: 초기 데이터 삽입 (국경일)
- #7 - Task 2.3: 데이터베이스 연결 설정

---

### 📦 산출물

- 데이터베이스 테이블 3개
- 검증 완료 보고서 (간단한 메모)

---

## [Phase 1] Task 1.4: 초기 데이터 삽입 (국경일)

**Labels**: `setup`, `database`, `complexity:low`

### 📋 작업 개요

2025년 주요 국경일 데이터를 Holiday 테이블에 삽입

**담당**: 백엔드 개발자
**예상 시간**: 0.5시간
**우선순위**: P1

---

### ✅ 완료 조건

- [ ] 최소 10개 국경일 데이터 삽입
- [ ] Holiday 테이블 조회로 확인
- [ ] 날짜 정렬 확인

---

### 📝 Todo (작업 상세)

#### 주요 작업:
- [ ] 2025년 주요 국경일 데이터 삽입
  - 신정(1/1)
  - 삼일절(3/1)
  - 어린이날(5/5)
  - 석가탄신일(5/5)
  - 현충일(6/6)
  - 광복절(8/15)
  - 추석(10/6-8)
  - 개천절(10/3)
  - 한글날(10/9)
  - 크리스마스(12/25)
- [ ] `isRecurring=true` 설정

---

### 🔧 기술적 고려사항

- **기술 스택**: PostgreSQL, SQL DML
- **구현 방법**:
  - INSERT INTO 문으로 일괄 삽입
  - UUID는 `uuid_generate_v4()` 함수 사용
  - 날짜는 'YYYY-MM-DD' 형식
- **데이터 예시**:
  ```sql
  INSERT INTO holidays (holidayId, title, date, description, isRecurring) VALUES
  (uuid_generate_v4(), '신정', '2025-01-01', '새해 첫날', true),
  (uuid_generate_v4(), '삼일절', '2025-03-01', '3.1 독립운동 기념일', true);
  ```
- **주의사항**:
  - 공공데이터포털 또는 공식 국경일 정보 참조
  - 매년 반복되는 일정은 `isRecurring=true`
  - 음력 기반 명절(설날, 추석)은 2025년 양력 날짜로 입력

---

### 🔗 의존성

#### 선행 작업 (Blocked by):
- #3 - Task 1.3: 스키마 실행 및 검증

#### 후행 작업 (Blocks):
- 없음 (독립 작업)

---

### 📦 산출물

- Holiday 테이블에 10개 이상의 국경일 데이터
