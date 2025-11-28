#!/bin/bash

# 간단한 국경일 API 테스트 (jq 없이)
BASE_URL="http://localhost:3000/api"

echo "===================================="
echo "  국경일 API 테스트"
echo "===================================="

# 1. 관리자 계정 회원가입
echo -e "\n=== 1. 관리자 계정 회원가입 ==="
curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "adminpassword123",
    "username": "관리자"
  }' | python3 -m json.tool 2>/dev/null || echo "(이미 존재하는 계정일 수 있음)"

# 2. 로그인
echo -e "\n=== 2. 로그인 ==="
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "adminpassword123"
  }')

echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"

# 토큰 추출 (간단한 방법)
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "로그인 실패"
  exit 1
fi

echo "액세스 토큰: ${ACCESS_TOKEN:0:50}..."

# 3. 국경일 조회
echo -e "\n=== 3. 국경일 조회 (전체) ==="
curl -s -X GET "${BASE_URL}/holidays" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" | python3 -m json.tool 2>/dev/null

# 4. 국경일 조회 (필터링)
echo -e "\n=== 4. 국경일 조회 (2025년 1월) ==="
curl -s -X GET "${BASE_URL}/holidays?year=2025&month=1" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" | python3 -m json.tool 2>/dev/null

# 5. 인증 없이 조회 (실패 예상)
echo -e "\n=== 5. 인증 없이 조회 (401 예상) ==="
curl -s -w "\nHTTP Status: %{http_code}\n" -X GET "${BASE_URL}/holidays"

echo -e "\n===================================="
echo "  테스트 완료"
echo "===================================="
