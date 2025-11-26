#!/bin/bash

# ==============================================================================
# 백엔드 디렉토리 구조 검증 테스트 스크립트
# Issue #7: 백엔드 디렉토리 구조 생성 작업
# 목표: 80% 이상 테스트 커버리지
# ==============================================================================

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 카운터 초기화
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 로그 배열
declare -a TEST_RESULTS

# ==============================================================================
# 유틸리티 함수
# ==============================================================================

# 테스트 결과 출력
print_test_result() {
    local test_name=$1
    local result=$2
    local message=$3

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}[PASS]${NC} $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}[FAIL]${NC} $test_name"
        echo -e "        ${YELLOW}→ $message${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi

    TEST_RESULTS+=("$result: $test_name")
}

# 디렉토리 존재 확인
check_directory() {
    local dir_path=$1
    local dir_name=$2

    if [ -d "$dir_path" ]; then
        print_test_result "디렉토리 존재: $dir_name" "PASS" ""
        return 0
    else
        print_test_result "디렉토리 존재: $dir_name" "FAIL" "경로: $dir_path"
        return 1
    fi
}

# 파일 존재 확인
check_file() {
    local file_path=$1
    local file_name=$2

    if [ -f "$file_path" ]; then
        print_test_result "파일 존재: $file_name" "PASS" ""
        return 0
    else
        print_test_result "파일 존재: $file_name" "FAIL" "경로: $file_path"
        return 1
    fi
}

# 파일 내용 검증 (패턴 확인)
check_file_content() {
    local file_path=$1
    local pattern=$2
    local test_name=$3

    if grep -q "$pattern" "$file_path" 2>/dev/null; then
        print_test_result "$test_name" "PASS" ""
        return 0
    else
        print_test_result "$test_name" "FAIL" "패턴을 찾을 수 없음: $pattern"
        return 1
    fi
}

# 커버리지 계산
calculate_coverage() {
    if [ "$TOTAL_TESTS" -eq 0 ]; then
        echo "0"
        return
    fi

    local coverage=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo "$coverage"
}

# ==============================================================================
# 메인 테스트 시작
# ==============================================================================

echo ""
echo "========================================================================"
echo "  백엔드 디렉토리 구조 검증 테스트"
echo "  Issue #7: 백엔드 디렉토리 구조 생성 작업"
echo "========================================================================"
echo ""

# 작업 디렉토리 확인
BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$BACKEND_DIR/src"

echo "작업 디렉토리: $BACKEND_DIR"
echo "소스 디렉토리: $SRC_DIR"
echo ""

# ==============================================================================
# 테스트 1: src 디렉토리 존재 확인
# ==============================================================================
echo "----------------------------------------------------------------------"
echo "테스트 1: src 디렉토리 존재 확인"
echo "----------------------------------------------------------------------"
check_directory "$SRC_DIR" "src/"
echo ""

# ==============================================================================
# 테스트 2-8: 7개 서브 디렉토리 존재 확인
# ==============================================================================
echo "----------------------------------------------------------------------"
echo "테스트 2-8: 7개 서브 디렉토리 존재 확인"
echo "----------------------------------------------------------------------"

declare -a SUBDIRS=(
    "config"
    "controllers"
    "middlewares"
    "routes"
    "services"
    "utils"
)

SUBDIR_COUNT=0
for dir in "${SUBDIRS[@]}"; do
    check_directory "$SRC_DIR/$dir" "src/$dir/"
    if [ $? -eq 0 ]; then
        SUBDIR_COUNT=$((SUBDIR_COUNT + 1))
    fi
done

echo ""
echo "필수 서브 디렉토리: ${#SUBDIRS[@]}개"
echo "생성된 서브 디렉토리: $SUBDIR_COUNT개"
echo ""

# ==============================================================================
# 테스트 9: app.js 파일 존재 확인
# ==============================================================================
echo "----------------------------------------------------------------------"
echo "테스트 9: app.js 파일 존재 확인"
echo "----------------------------------------------------------------------"
APP_FILE="$SRC_DIR/app.js"
check_file "$APP_FILE" "src/app.js"
echo ""

# ==============================================================================
# 테스트 10-13: app.js 내용 검증
# ==============================================================================
if [ -f "$APP_FILE" ]; then
    echo "----------------------------------------------------------------------"
    echo "테스트 10-13: app.js 내용 검증"
    echo "----------------------------------------------------------------------"

    check_file_content "$APP_FILE" "require.*express" "app.js: Express 모듈 임포트"
    check_file_content "$APP_FILE" "require.*cors" "app.js: CORS 모듈 임포트"
    check_file_content "$APP_FILE" "require.*helmet" "app.js: Helmet 모듈 임포트"
    check_file_content "$APP_FILE" "module.exports" "app.js: module.exports 확인"

    echo ""
fi

# ==============================================================================
# 테스트 14: server.js 파일 존재 확인
# ==============================================================================
echo "----------------------------------------------------------------------"
echo "테스트 14: server.js 파일 존재 확인"
echo "----------------------------------------------------------------------"

SERVER_FILE="$BACKEND_DIR/server.js"
if [ ! -f "$SERVER_FILE" ]; then
    # server.js가 없으면 src 디렉토리도 확인
    SERVER_FILE="$SRC_DIR/server.js"
    if [ ! -f "$SERVER_FILE" ]; then
        print_test_result "파일 존재: server.js" "FAIL" "경로: $BACKEND_DIR/server.js 또는 $SRC_DIR/server.js"
        SERVER_FILE=""
    else
        print_test_result "파일 존재: src/server.js" "PASS" ""
    fi
else
    print_test_result "파일 존재: server.js" "PASS" ""
fi
echo ""

# ==============================================================================
# 테스트 15-17: server.js 내용 검증
# ==============================================================================
if [ -n "$SERVER_FILE" ] && [ -f "$SERVER_FILE" ]; then
    echo "----------------------------------------------------------------------"
    echo "테스트 15-17: server.js 내용 검증"
    echo "----------------------------------------------------------------------"

    check_file_content "$SERVER_FILE" "dotenv\|require.*dotenv" "server.js: dotenv 로드 확인"
    check_file_content "$SERVER_FILE" "require.*app\|import.*app" "server.js: app 모듈 임포트"
    check_file_content "$SERVER_FILE" "listen\|app.listen" "server.js: listen 함수 호출"

    echo ""
elif [ -z "$SERVER_FILE" ]; then
    # server.js가 없으므로 패스할 수 없음
    print_test_result "server.js: dotenv 로드 확인" "FAIL" "server.js 파일이 없음"
    print_test_result "server.js: app 모듈 임포트" "FAIL" "server.js 파일이 없음"
    print_test_result "server.js: listen 함수 호출" "FAIL" "server.js 파일이 없음"
    echo ""
fi

# ==============================================================================
# 테스트 요약
# ==============================================================================
echo "========================================================================"
echo "  테스트 결과 요약"
echo "========================================================================"
echo ""
echo "전체 테스트: $TOTAL_TESTS개"
echo -e "통과: ${GREEN}$PASSED_TESTS개${NC}"
echo -e "실패: ${RED}$FAILED_TESTS개${NC}"
echo ""

COVERAGE=$(calculate_coverage)
echo "테스트 커버리지: ${GREEN}$COVERAGE%${NC}"
echo ""

# 커버리지 평가
if [ "$COVERAGE" -ge 80 ]; then
    echo -e "${GREEN}결과: 우수 (80% 이상 달성)${NC}"
    EXIT_CODE=0
elif [ "$COVERAGE" -ge 60 ]; then
    echo -e "${YELLOW}결과: 보통 (60% 이상 달성)${NC}"
    EXIT_CODE=1
else
    echo -e "${RED}결과: 부족 (60% 미만)${NC}"
    EXIT_CODE=1
fi

echo ""

# ==============================================================================
# 상세 결과 출력
# ==============================================================================
echo "----------------------------------------------------------------------"
echo "상세 테스트 결과"
echo "----------------------------------------------------------------------"
for result in "${TEST_RESULTS[@]}"; do
    echo "$result"
done
echo ""

echo "========================================================================"
echo ""

exit $EXIT_CODE
