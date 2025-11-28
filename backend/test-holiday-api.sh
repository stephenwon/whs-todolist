#!/bin/bash

# 국경일 API 테스트 스크립트
# 실행 방법: bash test-holiday-api.sh

BASE_URL="http://localhost:3000/api"

# 색상 코드
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}  국경일 API 테스트 시작${NC}"
echo -e "${BLUE}====================================${NC}"

# 1. 관리자 계정 로그인
echo -e "\n${BLUE}=== 1. 관리자 로그인 ===${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "adminpassword123"
  }')

echo "$LOGIN_RESPONSE" | jq '.' || echo "$LOGIN_RESPONSE"

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken' 2>/dev/null)
USER_ROLE=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user.role' 2>/dev/null)

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}✗ 로그인 실패${NC}"
  exit 1
else
  echo -e "${GREEN}✓ 로그인 성공 (역할: ${USER_ROLE})${NC}"
fi

# 2. 국경일 조회 (현재 연도)
echo -e "\n${BLUE}=== 2. 국경일 조회 (현재 연도) ===${NC}"
HOLIDAYS_RESPONSE=$(curl -s -X GET "${BASE_URL}/holidays" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$HOLIDAYS_RESPONSE" | jq '.' || echo "$HOLIDAYS_RESPONSE"

HOLIDAYS_COUNT=$(echo "$HOLIDAYS_RESPONSE" | jq '.data | length' 2>/dev/null)
if [ "$HOLIDAYS_COUNT" != "null" ] && [ "$HOLIDAYS_COUNT" -ge 0 ]; then
  echo -e "${GREEN}✓ 국경일 조회 성공 (${HOLIDAYS_COUNT}개)${NC}"
else
  echo -e "${RED}✗ 국경일 조회 실패${NC}"
fi

# 3. 국경일 조회 (특정 연도/월)
echo -e "\n${BLUE}=== 3. 국경일 조회 (2025년 1월) ===${NC}"
HOLIDAYS_FILTERED=$(curl -s -X GET "${BASE_URL}/holidays?year=2025&month=1" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo "$HOLIDAYS_FILTERED" | jq '.' || echo "$HOLIDAYS_FILTERED"

FILTERED_COUNT=$(echo "$HOLIDAYS_FILTERED" | jq '.data | length' 2>/dev/null)
if [ "$FILTERED_COUNT" != "null" ] && [ "$FILTERED_COUNT" -ge 0 ]; then
  echo -e "${GREEN}✓ 필터링된 국경일 조회 성공 (${FILTERED_COUNT}개)${NC}"
else
  echo -e "${RED}✗ 필터링된 국경일 조회 실패${NC}"
fi

# 4. 인증 없이 조회 시도 (실패 예상)
echo -e "\n${BLUE}=== 4. 인증 없이 조회 시도 ===${NC}"
NO_AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/holidays")
HTTP_CODE=$(echo "$NO_AUTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$NO_AUTH_RESPONSE" | head -n-1)

echo "$RESPONSE_BODY" | jq '.' || echo "$RESPONSE_BODY"

if [ "$HTTP_CODE" = "401" ]; then
  echo -e "${GREEN}✓ 인증 없이 조회 차단됨 (401)${NC}"
else
  echo -e "${RED}✗ 인증 체크 실패 (HTTP ${HTTP_CODE})${NC}"
fi

# 5. 국경일 추가 (관리자 전용)
if [ "$USER_ROLE" = "admin" ]; then
  echo -e "\n${BLUE}=== 5. 국경일 추가 (관리자) ===${NC}"
  CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/holidays" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "테스트 국경일",
      "date": "2025-12-31",
      "description": "API 테스트용 국경일",
      "isRecurring": false
    }')

  HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
  RESPONSE_BODY=$(echo "$CREATE_RESPONSE" | head -n-1)

  echo "$RESPONSE_BODY" | jq '.' || echo "$RESPONSE_BODY"

  if [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✓ 국경일 추가 성공 (201)${NC}"
    HOLIDAY_ID=$(echo "$RESPONSE_BODY" | jq -r '.data.holiday_id' 2>/dev/null)
  else
    echo -e "${RED}✗ 국경일 추가 실패 (HTTP ${HTTP_CODE})${NC}"
    HOLIDAY_ID=""
  fi

  # 6. 국경일 수정 (관리자 전용)
  if [ ! -z "$HOLIDAY_ID" ] && [ "$HOLIDAY_ID" != "null" ]; then
    echo -e "\n${BLUE}=== 6. 국경일 수정 (관리자) ===${NC}"
    UPDATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/holidays/${HOLIDAY_ID}" \
      -H "Authorization: Bearer ${ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "수정된 테스트 국경일",
        "description": "수정된 설명"
      }')

    HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$UPDATE_RESPONSE" | head -n-1)

    echo "$RESPONSE_BODY" | jq '.' || echo "$RESPONSE_BODY"

    if [ "$HTTP_CODE" = "200" ]; then
      echo -e "${GREEN}✓ 국경일 수정 성공 (200)${NC}"
    else
      echo -e "${RED}✗ 국경일 수정 실패 (HTTP ${HTTP_CODE})${NC}"
    fi
  fi

  # 7. 유효성 검증 테스트 (필수 필드 누락)
  echo -e "\n${BLUE}=== 7. 유효성 검증 (필수 필드 누락) ===${NC}"
  VALIDATION_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/holidays" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "date": "2025-01-01"
    }')

  HTTP_CODE=$(echo "$VALIDATION_RESPONSE" | tail -n1)
  RESPONSE_BODY=$(echo "$VALIDATION_RESPONSE" | head -n-1)

  echo "$RESPONSE_BODY" | jq '.' || echo "$RESPONSE_BODY"

  if [ "$HTTP_CODE" = "400" ]; then
    echo -e "${GREEN}✓ 필수 필드 누락 검증 (400)${NC}"
  else
    echo -e "${RED}✗ 유효성 검증 실패 (HTTP ${HTTP_CODE})${NC}"
  fi

else
  echo -e "\n${YELLOW}관리자가 아니므로 추가/수정 테스트를 건너뜁니다${NC}"
fi

echo -e "\n${BLUE}====================================${NC}"
echo -e "${BLUE}  테스트 완료${NC}"
echo -e "${BLUE}====================================${NC}"
