#!/bin/bash

# ================================================================
# 백엔드 프로젝트 초기화 테스트 스크립트 (Bash)
# 목적: Issue #6 백엔드 초기화 작업의 완료 여부를 검증
# 실행: bash backend/test-init.sh 또는 ./backend/test-init.sh
# ================================================================

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 테스트 결과 변수
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 헤더 출력
echo ""
echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}  백엔드 프로젝트 초기화 테스트 시작${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

# 테스트 함수
test_condition() {
    local test_name="$1"
    local condition="$2"
    local error_message="$3"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if [ "$condition" = "true" ]; then
        echo -e "${GREEN}[PASS]${NC} $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}[FAIL]${NC} $test_name"
        if [ -n "$error_message" ]; then
            echo -e "       ${YELLOW}→ $error_message${NC}"
        fi
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# 작업 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR"
PROJECT_ROOT="$(dirname "$BACKEND_DIR")"

echo -e "${CYAN}테스트 대상 디렉토리: $BACKEND_DIR${NC}"
echo ""

# ================================================================
# 테스트 1: backend 디렉토리 존재 확인
# ================================================================
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 1: 디렉토리 구조 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

if [ -d "$BACKEND_DIR" ]; then
    test_condition "1.1 backend 디렉토리 존재 확인" "true"
else
    test_condition "1.1 backend 디렉토리 존재 확인" "false" "backend 디렉토리가 존재하지 않습니다."
fi

# ================================================================
# 테스트 2: package.json 파일 존재 및 내용 검증
# ================================================================
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 2: package.json 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

PACKAGE_JSON_PATH="$BACKEND_DIR/package.json"

if [ -f "$PACKAGE_JSON_PATH" ]; then
    test_condition "2.1 package.json 파일 존재 확인" "true"

    # jq가 있는지 확인하고, 없으면 grep으로 대체
    if command -v jq &> /dev/null; then
        # jq를 사용한 JSON 파싱
        HAS_NAME=$(jq -e '.name != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
        HAS_VERSION=$(jq -e '.version != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
        HAS_MAIN=$(jq -e '.main != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
        HAS_SCRIPTS=$(jq -e '.scripts != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
        HAS_DEV_SCRIPT=$(jq -e '.scripts.dev != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
        HAS_START_SCRIPT=$(jq -e '.scripts.start != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
    else
        # grep을 사용한 간단한 검증
        HAS_NAME=$(grep -q '"name"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
        HAS_VERSION=$(grep -q '"version"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
        HAS_MAIN=$(grep -q '"main"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
        HAS_SCRIPTS=$(grep -q '"scripts"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
        HAS_DEV_SCRIPT=$(grep -q '"dev"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
        HAS_START_SCRIPT=$(grep -q '"start"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
    fi

    test_condition "2.2 package.json - name 필드 존재" "$HAS_NAME" "name 필드가 없습니다."
    test_condition "2.3 package.json - version 필드 존재" "$HAS_VERSION" "version 필드가 없습니다."
    test_condition "2.4 package.json - main 필드 존재" "$HAS_MAIN" "main 필드가 없습니다."
    test_condition "2.5 package.json - scripts 필드 존재" "$HAS_SCRIPTS" "scripts 필드가 없습니다."
    test_condition "2.6 package.json - dev 스크립트 존재" "$HAS_DEV_SCRIPT" "dev 스크립트가 없습니다."
    test_condition "2.7 package.json - start 스크립트 존재" "$HAS_START_SCRIPT" "start 스크립트가 없습니다."
else
    test_condition "2.1 package.json 파일 존재 확인" "false" "package.json 파일이 존재하지 않습니다."
    test_condition "2.2 package.json - name 필드 존재" "false" "package.json 없음"
    test_condition "2.3 package.json - version 필드 존재" "false" "package.json 없음"
    test_condition "2.4 package.json - main 필드 존재" "false" "package.json 없음"
    test_condition "2.5 package.json - scripts 필드 존재" "false" "package.json 없음"
    test_condition "2.6 package.json - dev 스크립트 존재" "false" "package.json 없음"
    test_condition "2.7 package.json - start 스크립트 존재" "false" "package.json 없음"
fi

# ================================================================
# 테스트 3: 필수 dependencies 10개 설치 확인
# ================================================================
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 3: 필수 dependencies 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

REQUIRED_DEPS=(
    "express"
    "pg"
    "jsonwebtoken"
    "bcrypt"
    "express-validator"
    "cors"
    "helmet"
    "express-rate-limit"
    "dotenv"
)

if [ -f "$PACKAGE_JSON_PATH" ]; then
    if command -v jq &> /dev/null; then
        HAS_DEPENDENCIES=$(jq -e '.dependencies != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
    else
        HAS_DEPENDENCIES=$(grep -q '"dependencies"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
    fi

    test_condition "3.1 dependencies 필드 존재" "$HAS_DEPENDENCIES" "dependencies 필드가 없습니다."

    TEST_NUM=2
    for dep in "${REQUIRED_DEPS[@]}"; do
        if [ "$HAS_DEPENDENCIES" = "true" ]; then
            if command -v jq &> /dev/null; then
                DEP_EXISTS=$(jq -e ".dependencies.\"$dep\" != null" "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
            else
                DEP_EXISTS=$(grep -q "\"$dep\"" "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
            fi
            test_condition "3.$TEST_NUM dependencies - $dep 존재" "$DEP_EXISTS" "$dep 패키지가 dependencies에 없습니다."
        else
            test_condition "3.$TEST_NUM dependencies - $dep 존재" "false" "dependencies 필드가 없습니다."
        fi
        TEST_NUM=$((TEST_NUM + 1))
    done
else
    test_condition "3.1 dependencies 필드 존재" "false" "package.json 없음"
    TEST_NUM=2
    for dep in "${REQUIRED_DEPS[@]}"; do
        test_condition "3.$TEST_NUM dependencies - $dep 존재" "false" "package.json 없음"
        TEST_NUM=$((TEST_NUM + 1))
    done
fi

# ================================================================
# 테스트 4: 개발 devDependencies 확인
# ================================================================
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 4: devDependencies 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

if [ -f "$PACKAGE_JSON_PATH" ]; then
    if command -v jq &> /dev/null; then
        HAS_DEV_DEPENDENCIES=$(jq -e '.devDependencies != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
        NODEMON_EXISTS=$(jq -e '.devDependencies.nodemon != null' "$PACKAGE_JSON_PATH" 2>/dev/null && echo "true" || echo "false")
    else
        HAS_DEV_DEPENDENCIES=$(grep -q '"devDependencies"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
        NODEMON_EXISTS=$(grep -q '"nodemon"' "$PACKAGE_JSON_PATH" && echo "true" || echo "false")
    fi

    test_condition "4.1 devDependencies 필드 존재" "$HAS_DEV_DEPENDENCIES" "devDependencies 필드가 없습니다."

    if [ "$HAS_DEV_DEPENDENCIES" = "true" ]; then
        test_condition "4.2 devDependencies - nodemon 존재" "$NODEMON_EXISTS" "nodemon이 devDependencies에 없습니다."
    else
        test_condition "4.2 devDependencies - nodemon 존재" "false" "devDependencies 필드가 없습니다."
    fi
else
    test_condition "4.1 devDependencies 필드 존재" "false" "package.json 없음"
    test_condition "4.2 devDependencies - nodemon 존재" "false" "package.json 없음"
fi

# ================================================================
# 테스트 5: .env 파일 존재 및 필수 환경 변수 확인
# ================================================================
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 5: .env 파일 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

ENV_PATH="$BACKEND_DIR/.env"

if [ -f "$ENV_PATH" ]; then
    test_condition "5.1 .env 파일 존재 확인" "true"

    REQUIRED_ENV_VARS=(
        "DATABASE_URL"
        "JWT_SECRET"
        "JWT_ACCESS_EXPIRATION"
        "JWT_REFRESH_EXPIRATION"
        "PORT"
        "NODE_ENV"
    )

    TEST_NUM=2
    for env_var in "${REQUIRED_ENV_VARS[@]}"; do
        if grep -q "^[[:space:]]*${env_var}[[:space:]]*=" "$ENV_PATH"; then
            test_condition "5.$TEST_NUM .env - $env_var 존재" "true"
        else
            test_condition "5.$TEST_NUM .env - $env_var 존재" "false" "$env_var 환경 변수가 없습니다."
        fi
        TEST_NUM=$((TEST_NUM + 1))
    done

    # JWT_SECRET 길이 검증 (최소 32자)
    if grep -q "^[[:space:]]*JWT_SECRET[[:space:]]*=" "$ENV_PATH"; then
        JWT_SECRET_VALUE=$(grep "^[[:space:]]*JWT_SECRET[[:space:]]*=" "$ENV_PATH" | sed 's/^[[:space:]]*JWT_SECRET[[:space:]]*=[[:space:]]*//' | tr -d '\r\n' | tr -d '"' | tr -d "'")
        JWT_SECRET_LENGTH=${#JWT_SECRET_VALUE}

        if [ "$JWT_SECRET_LENGTH" -ge 32 ]; then
            test_condition "5.$TEST_NUM .env - JWT_SECRET 길이 검증 (최소 32자)" "true"
        else
            test_condition "5.$TEST_NUM .env - JWT_SECRET 길이 검증 (최소 32자)" "false" "JWT_SECRET 길이가 ${JWT_SECRET_LENGTH}자입니다. 최소 32자 이상이어야 합니다."
        fi
    else
        test_condition "5.$TEST_NUM .env - JWT_SECRET 길이 검증 (최소 32자)" "false" "JWT_SECRET을 찾을 수 없습니다."
    fi
else
    test_condition "5.1 .env 파일 존재 확인" "false" ".env 파일이 존재하지 않습니다."

    TEST_NUM=2
    for env_var in "DATABASE_URL" "JWT_SECRET" "JWT_ACCESS_EXPIRATION" "JWT_REFRESH_EXPIRATION" "PORT" "NODE_ENV"; do
        test_condition "5.$TEST_NUM .env - $env_var 존재" "false" ".env 파일 없음"
        TEST_NUM=$((TEST_NUM + 1))
    done
    test_condition "5.$TEST_NUM .env - JWT_SECRET 길이 검증 (최소 32자)" "false" ".env 파일 없음"
fi

# ================================================================
# 테스트 6: .env.example 파일 존재 확인
# ================================================================
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 6: .env.example 파일 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

ENV_EXAMPLE_PATH="$BACKEND_DIR/.env.example"

if [ -f "$ENV_EXAMPLE_PATH" ]; then
    test_condition "6.1 .env.example 파일 존재 확인" "true"
else
    test_condition "6.1 .env.example 파일 존재 확인" "false" ".env.example 파일이 존재하지 않습니다."
fi

# ================================================================
# 테스트 7: node_modules 디렉토리 존재 확인
# ================================================================
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 7: node_modules 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

NODE_MODULES_PATH="$BACKEND_DIR/node_modules"

if [ -d "$NODE_MODULES_PATH" ]; then
    test_condition "7.1 node_modules 디렉토리 존재 확인" "true"
else
    test_condition "7.1 node_modules 디렉토리 존재 확인" "false" "node_modules 디렉토리가 존재하지 않습니다. npm install을 실행하세요."
fi

# ================================================================
# 테스트 8: .gitignore 설정 확인
# ================================================================
echo ""
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}테스트 그룹 8: .gitignore 검증${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"

GITIGNORE_PATH="$PROJECT_ROOT/.gitignore"

if [ -f "$GITIGNORE_PATH" ]; then
    test_condition "8.1 .gitignore 파일 존재 확인" "true"

    # node_modules 확인
    if grep -q "node_modules" "$GITIGNORE_PATH"; then
        test_condition "8.2 .gitignore - node_modules 포함" "true"
    else
        test_condition "8.2 .gitignore - node_modules 포함" "false" "node_modules가 .gitignore에 없습니다."
    fi

    # .env 확인
    if grep -q "\.env" "$GITIGNORE_PATH"; then
        test_condition "8.3 .gitignore - .env 포함" "true"
    else
        test_condition "8.3 .gitignore - .env 포함" "false" ".env가 .gitignore에 없습니다."
    fi
else
    test_condition "8.1 .gitignore 파일 존재 확인" "false" ".gitignore 파일이 존재하지 않습니다."
    test_condition "8.2 .gitignore - node_modules 포함" "false" ".gitignore 파일 없음"
    test_condition "8.3 .gitignore - .env 포함" "false" ".gitignore 파일 없음"
fi

# ================================================================
# 테스트 결과 요약
# ================================================================
echo ""
echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}  테스트 결과 요약${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

if [ "$TOTAL_TESTS" -gt 0 ]; then
    SUCCESS_RATE=$(awk "BEGIN {printf \"%.2f\", ($PASSED_TESTS / $TOTAL_TESTS) * 100}")
else
    SUCCESS_RATE=0
fi

echo -e "${CYAN}총 테스트: $TOTAL_TESTS${NC}"
echo -e "${GREEN}통과: $PASSED_TESTS${NC}"
echo -e "${RED}실패: $FAILED_TESTS${NC}"

# 통과율에 따라 색상 변경
SUCCESS_RATE_INT=$(echo "$SUCCESS_RATE" | awk '{print int($1)}')

if [ "$SUCCESS_RATE_INT" -ge 80 ]; then
    echo -e "${GREEN}통과율: ${SUCCESS_RATE}%${NC}"
elif [ "$SUCCESS_RATE_INT" -ge 50 ]; then
    echo -e "${YELLOW}통과율: ${SUCCESS_RATE}%${NC}"
else
    echo -e "${RED}통과율: ${SUCCESS_RATE}%${NC}"
fi

echo ""

if [ "$SUCCESS_RATE_INT" -ge 80 ]; then
    echo -e "${GREEN}✓ 테스트 통과! 백엔드 초기화가 성공적으로 완료되었습니다.${NC}"
    exit 0
else
    echo -e "${RED}✗ 테스트 실패. 백엔드 초기화를 완료하지 못했습니다.${NC}"
    echo -e "${YELLOW}  위의 실패한 테스트를 확인하고 수정해주세요.${NC}"
    exit 1
fi
