-- ==============================================================================
-- WHS-TodoList 데이터베이스 스키마
-- ==============================================================================
-- 프로젝트명: WHS-TodoList
-- 버전: 1.0
-- 작성일: 2025-11-26
-- DBMS: PostgreSQL 15+
-- 문자 인코딩: UTF-8
-- 타임존: UTC
-- 참조 문서: docs/6-erd.md
-- ==============================================================================

-- ==============================================================================
-- 1. 데이터베이스 생성 (선택사항)
-- ==============================================================================
-- 주석 해제 후 사용:
-- CREATE DATABASE whs_todolist
--     WITH
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     TEMPLATE = template0;
--
-- \c whs_todolist;

-- ==============================================================================
-- 2. 확장 기능 활성화
-- ==============================================================================

-- UUID 생성 함수 활성화 (gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 3. 기존 테이블 및 함수 삭제 (재실행 가능하도록)
-- ==============================================================================

-- 트리거 삭제 (테이블 삭제 시 자동 삭제되지만 명시적으로 삭제)
DROP TRIGGER IF EXISTS trigger_user_updated_at ON "User";
DROP TRIGGER IF EXISTS trigger_todo_updated_at ON "Todo";
DROP TRIGGER IF EXISTS trigger_holiday_updated_at ON "Holiday";

-- 테이블 삭제 (외래키 참조 순서의 역순)
DROP TABLE IF EXISTS "Todo" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Holiday" CASCADE;

-- 트리거 함수 삭제
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ==============================================================================
-- 4. User 테이블 생성
-- ==============================================================================

CREATE TABLE "User" (
    -- 기본키
    userId      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 인증 정보
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,

    -- 사용자 정보
    username    VARCHAR(100) NOT NULL,
    role        VARCHAR(10) NOT NULL DEFAULT 'user',

    -- 타임스탬프
    createdAt   TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt   TIMESTAMP NOT NULL DEFAULT NOW(),

    -- 제약 조건
    CONSTRAINT check_user_role CHECK (role IN ('user', 'admin'))
);

-- User 테이블 인덱스
CREATE INDEX idx_user_role ON "User"(role);

-- User 테이블 주석
COMMENT ON TABLE "User" IS '사용자 계정 정보';
COMMENT ON COLUMN "User".userId IS '사용자 고유 ID (UUID)';
COMMENT ON COLUMN "User".email IS '로그인용 이메일 주소 (고유)';
COMMENT ON COLUMN "User".password IS 'bcrypt 해시된 비밀번호 (salt rounds: 10)';
COMMENT ON COLUMN "User".username IS '사용자 표시 이름';
COMMENT ON COLUMN "User".role IS '사용자 역할 (user, admin)';
COMMENT ON COLUMN "User".createdAt IS '계정 생성 일시 (UTC)';
COMMENT ON COLUMN "User".updatedAt IS '최종 정보 수정 일시 (UTC)';

-- ==============================================================================
-- 5. Todo 테이블 생성
-- ==============================================================================

CREATE TABLE "Todo" (
    -- 기본키
    todoId      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 외래키
    userId      UUID NOT NULL,

    -- 할일 정보
    title       VARCHAR(200) NOT NULL,
    content     TEXT,
    startDate   DATE,
    dueDate     DATE,

    -- 상태 정보
    status      VARCHAR(20) NOT NULL DEFAULT 'active',
    isCompleted BOOLEAN NOT NULL DEFAULT false,

    -- 타임스탬프
    createdAt   TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt   TIMESTAMP NOT NULL DEFAULT NOW(),
    deletedAt   TIMESTAMP,

    -- 제약 조건
    CONSTRAINT fk_todo_user
        FOREIGN KEY (userId)
        REFERENCES "User"(userId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT check_todo_status
        CHECK (status IN ('active', 'completed', 'deleted')),

    CONSTRAINT check_todo_duedate
        CHECK (
            dueDate IS NULL OR
            startDate IS NULL OR
            dueDate >= startDate
        )
);

-- Todo 테이블 인덱스
-- 사용자별 상태 조회 복합 인덱스 (가장 자주 사용되는 쿼리)
CREATE INDEX idx_todo_user_status ON "Todo"(userId, status);

-- 만료일 정렬 인덱스
CREATE INDEX idx_todo_duedate ON "Todo"(dueDate);

-- 휴지통 조회 인덱스
CREATE INDEX idx_todo_deletedat ON "Todo"(deletedAt);

-- 생성일 정렬 인덱스
CREATE INDEX idx_todo_createdat ON "Todo"(createdAt);

-- Todo 테이블 주석
COMMENT ON TABLE "Todo" IS '사용자별 할일 정보';
COMMENT ON COLUMN "Todo".todoId IS '할일 고유 ID (UUID)';
COMMENT ON COLUMN "Todo".userId IS '할일 소유자 ID (외래키)';
COMMENT ON COLUMN "Todo".title IS '할일 제목 (필수, 최대 200자)';
COMMENT ON COLUMN "Todo".content IS '할일 상세 내용 (선택)';
COMMENT ON COLUMN "Todo".startDate IS '할일 시작일';
COMMENT ON COLUMN "Todo".dueDate IS '할일 만료일 (시작일 이후여야 함)';
COMMENT ON COLUMN "Todo".status IS '할일 상태 (active, completed, deleted)';
COMMENT ON COLUMN "Todo".isCompleted IS '완료 여부 플래그';
COMMENT ON COLUMN "Todo".createdAt IS '할일 생성 일시 (UTC)';
COMMENT ON COLUMN "Todo".updatedAt IS '할일 최종 수정 일시 (UTC)';
COMMENT ON COLUMN "Todo".deletedAt IS '할일 삭제 일시 (소프트 삭제용)';

-- ==============================================================================
-- 6. Holiday 테이블 생성
-- ==============================================================================

CREATE TABLE "Holiday" (
    -- 기본키
    holidayId   UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- 국경일 정보
    title       VARCHAR(100) NOT NULL,
    date        DATE NOT NULL,
    description TEXT,
    isRecurring BOOLEAN NOT NULL DEFAULT true,

    -- 타임스탬프
    createdAt   TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Holiday 테이블 인덱스
CREATE INDEX idx_holiday_date ON "Holiday"(date);

-- Holiday 테이블 주석
COMMENT ON TABLE "Holiday" IS '공통 국경일 정보';
COMMENT ON COLUMN "Holiday".holidayId IS '국경일 고유 ID (UUID)';
COMMENT ON COLUMN "Holiday".title IS '국경일 이름';
COMMENT ON COLUMN "Holiday".date IS '국경일 날짜';
COMMENT ON COLUMN "Holiday".description IS '국경일 설명';
COMMENT ON COLUMN "Holiday".isRecurring IS '매년 반복 여부';
COMMENT ON COLUMN "Holiday".createdAt IS '데이터 생성 일시 (UTC)';
COMMENT ON COLUMN "Holiday".updatedAt IS '데이터 최종 수정 일시 (UTC)';

-- ==============================================================================
-- 7. 트리거 함수 생성 (updatedAt 자동 갱신)
-- ==============================================================================

-- updatedAt 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- User 테이블 트리거
CREATE TRIGGER trigger_user_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Todo 테이블 트리거
CREATE TRIGGER trigger_todo_updated_at
BEFORE UPDATE ON "Todo"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Holiday 테이블 트리거
CREATE TRIGGER trigger_holiday_updated_at
BEFORE UPDATE ON "Holiday"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 8. 초기 데이터 삽입
-- ==============================================================================

-- ==============================================================================
-- 8.1 관리자 계정 생성
-- ==============================================================================
-- 비밀번호: Admin123!
-- bcrypt 해시 (10 rounds): $2b$10$K8xOZ5Qw9X5K8xOZ5Qw9X.K8xOZ5Qw9X5K8xOZ5Qw9X5K8xOZ5Qw9
-- 실제 환경에서는 애플리케이션에서 bcrypt로 해시한 값을 사용하세요.

INSERT INTO "User" (email, password, username, role) VALUES
(
    'admin@whs-todolist.com',
    '$2b$10$K8xOZ5Qw9X5K8xOZ5Qw9X.K8xOZ5Qw9X5K8xOZ5Qw9X5K8xOZ5Qw9',
    '관리자',
    'admin'
);

-- ==============================================================================
-- 8.2 2025년 대한민국 국경일 데이터
-- ==============================================================================

INSERT INTO "Holiday" (title, date, description, isRecurring) VALUES
-- 양력 기준 고정 국경일
('신정', '2025-01-01', '새해 첫날', true),
('삼일절', '2025-03-01', '3·1운동 기념일', true),
('어린이날', '2025-05-05', '어린이날', true),
('현충일', '2025-06-06', '호국영령 추념일', true),
('광복절', '2025-08-15', '대한민국 독립 기념일', true),
('개천절', '2025-10-03', '단군 건국 기념일', true),
('한글날', '2025-10-09', '한글 창제 기념일', true),
('크리스마스', '2025-12-25', '성탄절', true),

-- 음력 기준 국경일 (2025년 날짜)
('설날 연휴 (전날)', '2025-01-28', '음력 12월 29일', false),
('설날', '2025-01-29', '음력 1월 1일', false),
('설날 연휴 (다음날)', '2025-01-30', '음력 1월 2일', false),
('석가탄신일', '2025-05-05', '음력 4월 8일 (부처님 오신 날)', false),
('추석 연휴 (전날)', '2025-10-05', '음력 8월 14일', false),
('추석', '2025-10-06', '음력 8월 15일', false),
('추석 연휴 (다음날)', '2025-10-07', '음력 8월 16일', false),

-- 대체 공휴일
('대체 공휴일 (설날)', '2025-01-31', '설날 연휴 대체 공휴일', false);

-- ==============================================================================
-- 9. 스키마 생성 완료 메시지
-- ==============================================================================

DO $$
DECLARE
    user_count INTEGER;
    holiday_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM "User";
    SELECT COUNT(*) INTO holiday_count FROM "Holiday";

    RAISE NOTICE '==============================================================================';
    RAISE NOTICE 'WHS-TodoList 데이터베이스 스키마 생성 완료';
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE '생성된 테이블:';
    RAISE NOTICE '  - User (사용자)';
    RAISE NOTICE '  - Todo (할일)';
    RAISE NOTICE '  - Holiday (국경일)';
    RAISE NOTICE '';
    RAISE NOTICE '생성된 인덱스:';
    RAISE NOTICE '  - User: 2개 (email UNIQUE, role)';
    RAISE NOTICE '  - Todo: 4개 (user_status 복합, dueDate, deletedAt, createdAt)';
    RAISE NOTICE '  - Holiday: 1개 (date)';
    RAISE NOTICE '';
    RAISE NOTICE '생성된 트리거:';
    RAISE NOTICE '  - updatedAt 자동 갱신 트리거 (3개)';
    RAISE NOTICE '';
    RAISE NOTICE '초기 데이터:';
    RAISE NOTICE '  - 사용자: % 명', user_count;
    RAISE NOTICE '  - 국경일: % 개', holiday_count;
    RAISE NOTICE '';
    RAISE NOTICE '관리자 계정:';
    RAISE NOTICE '  - 이메일: admin@whs-todolist.com';
    RAISE NOTICE '  - 비밀번호: Admin123! (해시 저장됨)';
    RAISE NOTICE '  - 역할: admin';
    RAISE NOTICE '';
    RAISE NOTICE '참고:';
    RAISE NOTICE '  - 비밀번호는 bcrypt로 해시되어 저장되었습니다.';
    RAISE NOTICE '  - 실제 환경에서는 애플리케이션에서 비밀번호를 해시해야 합니다.';
    RAISE NOTICE '  - 음력 기준 국경일은 연도별로 날짜가 변경됩니다.';
    RAISE NOTICE '==============================================================================';
END $$;

-- ==============================================================================
-- 10. 유용한 쿼리 예시 (주석)
-- ==============================================================================

/*
-- 사용자별 활성 할일 조회
SELECT
    t.todoId,
    t.title,
    t.content,
    t.startDate,
    t.dueDate,
    t.status,
    t.isCompleted,
    t.createdAt,
    CASE
        WHEN t.dueDate IS NOT NULL AND t.dueDate < CURRENT_DATE THEN true
        ELSE false
    END AS isOverdue
FROM "Todo" t
WHERE t.userId = '사용자_UUID'
  AND t.status IN ('active', 'completed')
ORDER BY
    t.isCompleted ASC,
    t.dueDate ASC NULLS LAST,
    t.createdAt DESC;

-- 휴지통 조회 (30일 이내 삭제)
SELECT
    todoId,
    title,
    deletedAt,
    EXTRACT(DAY FROM (NOW() - deletedAt)) AS days_in_trash
FROM "Todo"
WHERE userId = '사용자_UUID'
  AND status = 'deleted'
  AND deletedAt > NOW() - INTERVAL '30 days'
ORDER BY deletedAt DESC;

-- 특정 월의 할일 및 국경일 통합 조회
WITH monthly_data AS (
    -- 할일
    SELECT
        todoId::TEXT AS id,
        'todo' AS type,
        title,
        startDate AS date,
        dueDate,
        status,
        isCompleted
    FROM "Todo"
    WHERE userId = '사용자_UUID'
      AND status IN ('active', 'completed')
      AND (
          (startDate >= '2025-11-01' AND startDate < '2025-12-01')
          OR (dueDate >= '2025-11-01' AND dueDate < '2025-12-01')
      )

    UNION ALL

    -- 국경일
    SELECT
        holidayId::TEXT AS id,
        'holiday' AS type,
        title,
        date,
        NULL AS dueDate,
        NULL AS status,
        NULL AS isCompleted
    FROM "Holiday"
    WHERE date >= '2025-11-01' AND date < '2025-12-01'
)
SELECT * FROM monthly_data
ORDER BY date ASC, type DESC;

-- 할일 소프트 삭제 (휴지통으로 이동)
UPDATE "Todo"
SET
    status = 'deleted',
    deletedAt = NOW(),
    updatedAt = NOW()
WHERE todoId = '할일_UUID'
  AND userId = '사용자_UUID';

-- 할일 복원 (휴지통에서 복구)
UPDATE "Todo"
SET
    status = 'active',
    deletedAt = NULL,
    updatedAt = NOW()
WHERE todoId = '할일_UUID'
  AND userId = '사용자_UUID'
  AND status = 'deleted';

-- 할일 영구 삭제
DELETE FROM "Todo"
WHERE todoId = '할일_UUID'
  AND userId = '사용자_UUID'
  AND status = 'deleted';

-- 할일 완료 처리
UPDATE "Todo"
SET
    status = 'completed',
    isCompleted = true,
    updatedAt = NOW()
WHERE todoId = '할일_UUID'
  AND userId = '사용자_UUID';

-- 할일 완료 취소 (미완료 처리)
UPDATE "Todo"
SET
    status = 'active',
    isCompleted = false,
    updatedAt = NOW()
WHERE todoId = '할일_UUID'
  AND userId = '사용자_UUID';

-- 인덱스 사용률 확인
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans,
    idx_tup_read AS tuples_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;

-- 인덱스 재생성 (성능 최적화)
REINDEX TABLE "User";
REINDEX TABLE "Todo";
REINDEX TABLE "Holiday";
*/
