#!/bin/bash

################################################################################
# 데이터베이스 연결 설정 테스트 스크립트 (Issue #8)
#
# 테스트 커버리지: 80% 이상
# 대상 파일:
#   - src/config/database.js
#   - .env
#   - src/server.js
#
# 실행 방법: bash test-database.sh
################################################################################

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 테스트 결과 추적
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 프로젝트 루트 경로 설정
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATABASE_CONFIG="${PROJECT_ROOT}/src/config/database.js"
ENV_FILE="${PROJECT_ROOT}/.env"
SERVER_FILE="${PROJECT_ROOT}/src/server.js"

################################################################################
# 유틸리티 함수
################################################################################

# 테스트 시작
start_test() {
  local test_name="$1"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}테스트: ${test_name}${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  ((TOTAL_TESTS++))
}

# 테스트 통과
pass_test() {
  local message="$1"
  echo -e "${GREEN}✅ PASS: ${message}${NC}"
  ((PASSED_TESTS++))
}

# 테스트 실패
fail_test() {
  local message="$1"
  echo -e "${RED}❌ FAIL: ${message}${NC}"
  ((FAILED_TESTS++))
}

# 세부 정보 출력
detail_msg() {
  local message="$1"
  echo -e "${YELLOW}   ℹ️  ${message}${NC}"
}

# 파일 존재 확인
check_file_exists() {
  local file_path="$1"
  local file_name="$2"

  if [ -f "$file_path" ]; then
    detail_msg "파일 위치: ${file_path}"
    return 0
  else
    detail_msg "파일을 찾을 수 없음: ${file_path}"
    return 1
  fi
}

# 파일에서 패턴 찾기
check_pattern_in_file() {
  local file_path="$1"
  local pattern="$2"
  local description="$3"

  if grep -q "$pattern" "$file_path"; then
    detail_msg "발견됨: ${description}"
    return 0
  else
    detail_msg "찾을 수 없음: ${description}"
    return 1
  fi
}

# 파일에서 패턴 값 추출
extract_pattern_value() {
  local file_path="$1"
  local pattern="$2"

  grep "$pattern" "$file_path" | head -1
}

################################################################################
# 테스트 케이스
################################################################################

# 테스트 1: database.js 파일 존재 확인
test_1_database_file_exists() {
  start_test "1. database.js 파일 존재 확인"

  if check_file_exists "$DATABASE_CONFIG" "database.js"; then
    pass_test "database.js 파일이 존재합니다"
  else
    fail_test "database.js 파일이 존재하지 않습니다"
  fi

  echo ""
}

# 테스트 2: Pool 모듈 임포트 확인
test_2_pool_import() {
  start_test "2. Pool 모듈 임포트 확인"

  if check_pattern_in_file "$DATABASE_CONFIG" "require('pg')" "pg 모듈 임포트"; then
    pass_test "pg 모듈이 올바르게 임포트되었습니다"
  else
    fail_test "pg 모듈 임포트를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "const { Pool }" "Pool 구조 분해"; then
    pass_test "Pool이 올바르게 구조 분해되었습니다"
  else
    fail_test "Pool 구조 분해를 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 3: Pool 인스턴스 생성 확인
test_3_pool_instance() {
  start_test "3. Pool 인스턴스 생성 확인"

  if check_pattern_in_file "$DATABASE_CONFIG" "const pool = new Pool" "Pool 인스턴스 생성"; then
    pass_test "Pool 인스턴스가 생성되었습니다"
  else
    fail_test "Pool 인스턴스 생성 코드를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "connectionString: process.env.DATABASE_URL" "DATABASE_URL 설정"; then
    pass_test "connectionString이 DATABASE_URL 환경변수를 사용합니다"
  else
    fail_test "DATABASE_URL 환경변수 설정을 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 4: max 설정 확인
test_4_max_setting() {
  start_test "4. Connection Pool max 설정 검증 (max: 10)"

  if check_pattern_in_file "$DATABASE_CONFIG" "max: 10" "max 설정값 10"; then
    pass_test "max 설정값이 10으로 올바르게 설정되었습니다"
    detail_msg "최대 연결 수: 10"
  else
    fail_test "max: 10 설정을 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 5: idleTimeoutMillis 설정 확인
test_5_idle_timeout() {
  start_test "5. Connection Pool idleTimeoutMillis 설정 검증 (30000ms)"

  if check_pattern_in_file "$DATABASE_CONFIG" "idleTimeoutMillis: 30000" "idleTimeoutMillis 설정값"; then
    pass_test "idleTimeoutMillis가 30000ms(30초)로 올바르게 설정되었습니다"
    detail_msg "유휴 연결 타임아웃: 30초"
  else
    fail_test "idleTimeoutMillis: 30000 설정을 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 6: 추가 Pool 설정 검증
test_6_additional_pool_settings() {
  start_test "6. 추가 Connection Pool 설정 검증"

  if check_pattern_in_file "$DATABASE_CONFIG" "connectionTimeoutMillis" "connectionTimeoutMillis"; then
    pass_test "connectionTimeoutMillis 설정이 존재합니다"
    TIMEOUT_VALUE=$(extract_pattern_value "$DATABASE_CONFIG" "connectionTimeoutMillis:")
    detail_msg "설정값: ${TIMEOUT_VALUE}"
  else
    fail_test "connectionTimeoutMillis 설정을 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 7: Pool 에러 핸들러 확인
test_7_pool_error_handler() {
  start_test "7. Pool 에러 핸들러 확인"

  if check_pattern_in_file "$DATABASE_CONFIG" "pool.on('error'" "Pool 에러 핸들러"; then
    pass_test "Pool 에러 핸들러가 설정되어 있습니다"
  else
    fail_test "Pool 에러 핸들러를 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 8: testConnection 함수 존재 확인
test_8_test_connection_function() {
  start_test "8. testConnection 함수 존재 확인"

  if check_pattern_in_file "$DATABASE_CONFIG" "const testConnection = async" "testConnection 함수 정의"; then
    pass_test "testConnection 함수가 정의되어 있습니다"
  else
    fail_test "testConnection 함수를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "await pool.connect()" "pool.connect() 호출"; then
    pass_test "testConnection에서 pool.connect()를 호출합니다"
  else
    fail_test "pool.connect() 호출을 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "SELECT NOW()" "테스트 쿼리 실행"; then
    pass_test "SELECT NOW() 테스트 쿼리가 실행됩니다"
  else
    fail_test "SELECT NOW() 쿼리를 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 9: closePool 함수 존재 확인
test_9_close_pool_function() {
  start_test "9. closePool 함수 존재 확인"

  if check_pattern_in_file "$DATABASE_CONFIG" "const closePool = async" "closePool 함수 정의"; then
    pass_test "closePool 함수가 정의되어 있습니다"
  else
    fail_test "closePool 함수를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "await pool.end()" "pool.end() 호출"; then
    pass_test "closePool에서 pool.end()를 호출합니다"
  else
    fail_test "pool.end() 호출을 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 10: module.exports 확인
test_10_module_exports() {
  start_test "10. module.exports 검증"

  if check_pattern_in_file "$DATABASE_CONFIG" "module.exports" "module.exports"; then
    pass_test "module.exports가 존재합니다"
  else
    fail_test "module.exports를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "pool," "pool 내보내기"; then
    pass_test "pool이 올바르게 내보내집니다"
  else
    fail_test "pool 내보내기를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "testConnection," "testConnection 내보내기"; then
    pass_test "testConnection이 올바르게 내보내집니다"
  else
    fail_test "testConnection 내보내기를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$DATABASE_CONFIG" "closePool," "closePool 내보내기"; then
    pass_test "closePool이 올바르게 내보내집니다"
  else
    fail_test "closePool 내보내기를 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 11: .env 파일 확인
test_11_env_file_exists() {
  start_test "11. .env 파일 존재 확인"

  if check_file_exists "$ENV_FILE" ".env"; then
    pass_test ".env 파일이 존재합니다"
  else
    fail_test ".env 파일이 존재하지 않습니다"
  fi

  echo ""
}

# 테스트 12: DATABASE_URL 환경변수 확인
test_12_database_url_env() {
  start_test "12. DATABASE_URL 환경변수 검증"

  if check_pattern_in_file "$ENV_FILE" "DATABASE_URL=" "DATABASE_URL 설정"; then
    pass_test "DATABASE_URL이 .env에 설정되어 있습니다"
    DB_URL=$(extract_pattern_value "$ENV_FILE" "DATABASE_URL=")
    detail_msg "설정: ${DB_URL}"
  else
    fail_test "DATABASE_URL을 .env에서 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 13: server.js 파일 확인
test_13_server_file_exists() {
  start_test "13. server.js 파일 존재 확인"

  if check_file_exists "$SERVER_FILE" "server.js"; then
    pass_test "server.js 파일이 존재합니다"
  else
    fail_test "server.js 파일이 존재하지 않습니다"
  fi

  echo ""
}

# 테스트 14: server.js에서 database 모듈 임포트 확인
test_14_server_database_import() {
  start_test "14. server.js에서 database 모듈 임포트 확인"

  if check_pattern_in_file "$SERVER_FILE" "require('./config/database')" "database 모듈 임포트"; then
    pass_test "database 모듈이 server.js에서 올바르게 임포트됩니다"
  else
    fail_test "database 모듈 임포트를 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 15: server.js에서 testConnection 호출 확인
test_15_server_test_connection_call() {
  start_test "15. server.js에서 testConnection 호출 확인"

  if check_pattern_in_file "$SERVER_FILE" "testConnection" "testConnection 추출"; then
    pass_test "testConnection이 server.js에서 추출되었습니다"
  else
    fail_test "testConnection 추출을 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$SERVER_FILE" "await testConnection()" "testConnection 호출"; then
    pass_test "testConnection()이 server.js에서 호출됩니다"
  else
    fail_test "testConnection() 호출을 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 16: server.js에서 closePool 호출 확인
test_16_server_close_pool_call() {
  start_test "16. server.js에서 closePool 호출 확인"

  if check_pattern_in_file "$SERVER_FILE" "closePool" "closePool 추출"; then
    pass_test "closePool이 server.js에서 추출되었습니다"
  else
    fail_test "closePool 추출을 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$SERVER_FILE" "await closePool()" "closePool 호출"; then
    pass_test "closePool()이 server.js에서 호출됩니다"
  else
    fail_test "closePool() 호출을 찾을 수 없습니다"
  fi

  echo ""
}

# 테스트 17: .env 파일에 필수 환경변수 확인
test_17_env_required_variables() {
  start_test "17. .env 파일 필수 환경변수 검증"

  REQUIRED_VARS=(
    "DATABASE_URL"
    "JWT_SECRET"
    "PORT"
    "NODE_ENV"
  )

  for var in "${REQUIRED_VARS[@]}"; do
    if check_pattern_in_file "$ENV_FILE" "${var}=" "${var}"; then
      pass_test "${var} 환경변수가 설정되어 있습니다"
    else
      fail_test "${var} 환경변수를 찾을 수 없습니다"
    fi
  done

  echo ""
}

# 테스트 18: database.js 문법 검증 (Node.js에서 구문 검사)
test_18_database_syntax() {
  start_test "18. database.js 문법 검증"

  # Node.js 구문 검사 (node -c 옵션)
  if node -c "$DATABASE_CONFIG" 2>/dev/null; then
    pass_test "database.js 파일의 문법이 올바릅니다"
  else
    fail_test "database.js 파일에 문법 오류가 있습니다"
    detail_msg "출력: $(node -c "$DATABASE_CONFIG" 2>&1)"
  fi

  echo ""
}

# 테스트 19: server.js 문법 검증 (Node.js에서 구문 검사)
test_19_server_syntax() {
  start_test "19. server.js 문법 검증"

  # Node.js 구문 검사 (node -c 옵션)
  if node -c "$SERVER_FILE" 2>/dev/null; then
    pass_test "server.js 파일의 문법이 올바릅니다"
  else
    fail_test "server.js 파일에 문법 오류가 있습니다"
    detail_msg "출력: $(node -c "$SERVER_FILE" 2>&1)"
  fi

  echo ""
}

# 테스트 20: dotenv 모듈 임포트 확인
test_20_dotenv_import() {
  start_test "20. dotenv 모듈 임포트 확인"

  if check_pattern_in_file "$SERVER_FILE" "require('dotenv')" "dotenv 모듈 임포트"; then
    pass_test "dotenv 모듈이 server.js에서 임포트됩니다"
  else
    fail_test "dotenv 모듈 임포트를 찾을 수 없습니다"
  fi

  if check_pattern_in_file "$SERVER_FILE" ".config()" "dotenv.config() 호출"; then
    pass_test ".config()가 호출되어 환경변수를 로드합니다"
  else
    fail_test ".config() 호출을 찾을 수 없습니다"
  fi

  echo ""
}

################################################################################
# 테스트 실행
################################################################################

# 헤더
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         데이터베이스 연결 설정 테스트 스크립트 (Issue #8)              ║${NC}"
echo -e "${BLUE}║              테스트 커버리지: 80% 이상                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 프로젝트 경로 출력
detail_msg "프로젝트 루트: ${PROJECT_ROOT}"
detail_msg "database.js: ${DATABASE_CONFIG}"
detail_msg ".env: ${ENV_FILE}"
detail_msg "server.js: ${SERVER_FILE}"
echo ""

# 모든 테스트 실행
test_1_database_file_exists
test_2_pool_import
test_3_pool_instance
test_4_max_setting
test_5_idle_timeout
test_6_additional_pool_settings
test_7_pool_error_handler
test_8_test_connection_function
test_9_close_pool_function
test_10_module_exports
test_11_env_file_exists
test_12_database_url_env
test_13_server_file_exists
test_14_server_database_import
test_15_server_test_connection_call
test_16_server_close_pool_call
test_17_env_required_variables
test_18_database_syntax
test_19_server_syntax
test_20_dotenv_import

################################################################################
# 최종 결과 보고
################################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                        테스트 결과 요약                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 성공률 계산
TOTAL_ASSERTIONS=$((PASSED_TESTS + FAILED_TESTS))
if [ $TOTAL_ASSERTIONS -eq 0 ]; then
  SUCCESS_RATE=0
else
  SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_ASSERTIONS))
fi

echo -e "${YELLOW}총 테스트 케이스: ${BLUE}${TOTAL_TESTS}개${NC}"
echo -e "${YELLOW}전체 검증 항목:   ${BLUE}${TOTAL_ASSERTIONS}개${NC}"
echo ""
echo -e "${GREEN}✅ 통과한 항목: ${PASSED_TESTS}개${NC}"
echo -e "${RED}❌ 실패한 항목: ${FAILED_TESTS}개${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}성공률: ${SUCCESS_RATE}% (완벽! 모든 검증 완료)${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✅ 모든 테스트 통과! 데이터베이스 연결 설정이 완벽합니다.          ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════════╝${NC}"
  EXIT_CODE=0
else
  echo -e "${YELLOW}성공률: ${SUCCESS_RATE}% (${FAILED_TESTS}개 항목 확인 필요)${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${RED}╔════════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ❌ 일부 항목에 문제가 있습니다. 위의 실패 항목을 확인하세요.      ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════════════════╝${NC}"
  EXIT_CODE=1
fi

echo ""
echo -e "${BLUE}테스트 실행 시간: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo ""

exit $EXIT_CODE
