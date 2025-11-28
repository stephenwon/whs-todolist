-- WHS-TodoList Database Schema
-- 버전: 2.0
-- 최종 수정: 2025-11-28
-- 실제 DB 스키마 반영

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- User 테이블 정의
-- ============================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- CHECK 제약 조건
    CONSTRAINT chk_user_role CHECK (role IN ('user', 'admin'))
);

-- User 테이블 코멘트
COMMENT ON TABLE users IS '사용자 계정 정보';
COMMENT ON COLUMN users.user_id IS '사용자 고유 ID (UUID)';
COMMENT ON COLUMN users.email IS '로그인용 이메일 주소 (고유)';
COMMENT ON COLUMN users.password IS 'bcrypt 해시된 비밀번호';
COMMENT ON COLUMN users.username IS '사용자 표시 이름';
COMMENT ON COLUMN users.role IS '사용자 역할 (user, admin)';
COMMENT ON COLUMN users.created_at IS '계정 생성 일시';
COMMENT ON COLUMN users.updated_at IS '최종 정보 수정 일시';

-- ============================================
-- Todo 테이블 정의
-- ============================================
CREATE TABLE todos (
    todo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    start_date DATE,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- CHECK 제약 조건
    CONSTRAINT chk_todo_status CHECK (status IN ('active', 'completed', 'deleted')),
    CONSTRAINT chk_due_date_after_start_date CHECK (
        due_date IS NULL OR
        start_date IS NULL OR
        due_date >= start_date
    )
);

-- Todo 테이블 코멘트
COMMENT ON TABLE todos IS '사용자별 할일 정보';
COMMENT ON COLUMN todos.todo_id IS '할일 고유 ID (UUID)';
COMMENT ON COLUMN todos.user_id IS '할일 소유자 ID (외래키)';
COMMENT ON COLUMN todos.title IS '할일 제목 (필수, 최대 255자)';
COMMENT ON COLUMN todos.content IS '할일 상세 내용 (선택)';
COMMENT ON COLUMN todos.start_date IS '할일 시작일';
COMMENT ON COLUMN todos.due_date IS '할일 만료일 (시작일 이후)';
COMMENT ON COLUMN todos.status IS '할일 상태 (active, completed, deleted)';
COMMENT ON COLUMN todos.is_completed IS '완료 여부 플래그';
COMMENT ON COLUMN todos.created_at IS '할일 생성 일시';
COMMENT ON COLUMN todos.updated_at IS '할일 최종 수정 일시';
COMMENT ON COLUMN todos.deleted_at IS '할일 삭제 일시 (소프트 삭제)';

-- ============================================
-- Holiday 테이블 정의
-- ============================================
CREATE TABLE holidays (
    holiday_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Holiday 테이블 코멘트
COMMENT ON TABLE holidays IS '공통 국경일 정보';
COMMENT ON COLUMN holidays.holiday_id IS '국경일 고유 ID (UUID)';
COMMENT ON COLUMN holidays.title IS '국경일 이름';
COMMENT ON COLUMN holidays.date IS '국경일 날짜';
COMMENT ON COLUMN holidays.description IS '국경일 설명';
COMMENT ON COLUMN holidays.is_recurring IS '매년 반복 여부';
COMMENT ON COLUMN holidays.created_at IS '데이터 생성 일시';
COMMENT ON COLUMN holidays.updated_at IS '데이터 최종 수정 일시';

-- ============================================
-- INDEXES
-- ============================================

-- User 테이블 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Todo 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_todos_user_id_status ON todos(user_id, status);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_deleted_at ON todos(deleted_at);

-- Holiday 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);

-- ============================================
-- FOREIGN KEY 제약 조건
-- ============================================

ALTER TABLE todos ADD CONSTRAINT fk_todos_user_id
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- ============================================
-- TRIGGERS (자동 updated_at 갱신)
-- ============================================

-- updatedAt 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- User 테이블 트리거
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Todo 테이블 트리거
DROP TRIGGER IF EXISTS trigger_todos_updated_at ON todos;
CREATE TRIGGER trigger_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Holiday 테이블 트리거
DROP TRIGGER IF EXISTS trigger_holidays_updated_at ON holidays;
CREATE TRIGGER trigger_holidays_updated_at
    BEFORE UPDATE ON holidays
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
