# 백엔드 구조 테스트 스크립트 사용 가이드

## 빠른 시작

### 1단계: 스크립트 실행

```bash
# backend 디렉토리로 이동
cd backend

# 테스트 실행
bash test-structure.sh
```

### 2단계: 결과 확인

```
========================================================================
  백엔드 디렉토리 구조 검증 테스트
  Issue #7: 백엔드 디렉토리 구조 생성 작업
========================================================================

[PASS] 디렉토리 존재: src/
[PASS] 디렉토리 존재: src/config/
...

========================================================================
  테스트 결과 요약
========================================================================

전체 테스트: 16개
통과: 16개
실패: 0개

테스트 커버리지: 100%

결과: 우수 (80% 이상 달성)
```

---

## 테스트 항목 설명

### 그룹 1: 디렉토리 검증 (7개)
- src 디렉토리 존재 여부
- src/config 디렉토리 존재 여부
- src/controllers 디렉토리 존재 여부
- src/middlewares 디렉토리 존재 여부
- src/routes 디렉토리 존재 여부
- src/services 디렉토리 존재 여부
- src/utils 디렉토리 존재 여부

### 그룹 2: 기본 파일 검증 (2개)
- src/app.js 파일 존재 여부
- src/server.js 파일 존재 여부

### 그룹 3: app.js 내용 검증 (4개)
- Express 모듈 임포트 확인
- CORS 모듈 임포트 확인
- Helmet 모듈 임포트 확인
- module.exports 확인

### 그룹 4: server.js 내용 검증 (3개)
- dotenv 로드 확인
- app 모듈 임포트 확인
- listen 함수 호출 확인

---

## Windows 환경에서 실행하기

### Git Bash 사용 (권장)
```bash
# Git Bash 터미널에서
cd backend
./test-structure.sh
```

### PowerShell 사용
```powershell
# PowerShell에서
cd backend
bash test-structure.sh
```

### CMD 사용
```cmd
# CMD에서
cd backend
bash test-structure.sh
```

---

## 결과 해석

### 색상 표시

| 색상 | 의미 | 예시 |
|------|------|------|
| 초록색 | 통과 | [PASS] 디렉토리 존재: src/ |
| 빨강색 | 실패 | [FAIL] 디렉토리 존재: src/ |
| 노랑색 | 정보 | → 경로: /path/to/file |

### 커버리지 평가

| 커버리지 | 평가 | 상태 |
|---------|------|------|
| 80% 이상 | 우수 | PASS |
| 60% 이상 | 보통 | WARN |
| 60% 미만 | 부족 | FAIL |

---

## 스크립트 수정하기

### 새로운 테스트 추가

```bash
# 예: package.json 파일 검증 추가

# 테스트 함수 추가
check_file "$BACKEND_DIR/package.json" "backend/package.json"

# 파일 내용 검증 추가
if [ -f "$BACKEND_DIR/package.json" ]; then
    check_file_content "$BACKEND_DIR/package.json" '"name"' \
        "package.json: name 필드 확인"
fi
```

### 디렉토리 목록 수정

```bash
# SUBDIRS 배열 수정
declare -a SUBDIRS=(
    "config"
    "controllers"
    "middlewares"
    "routes"
    "services"
    "utils"
    "models"  # 추가
)
```

---

## 스크립트 구조

### 주요 함수

#### `print_test_result`
테스트 결과를 출력하고 카운터를 업데이트합니다.

```bash
print_test_result "테스트명" "PASS/FAIL" "오류메시지"
```

#### `check_directory`
디렉토리 존재 여부를 확인합니다.

```bash
check_directory "$path" "$name"
```

#### `check_file`
파일 존재 여부를 확인합니다.

```bash
check_file "$path" "$name"
```

#### `check_file_content`
파일에 특정 패턴이 있는지 확인합니다.

```bash
check_file_content "$path" "$pattern" "$test_name"
```

#### `calculate_coverage`
커버리지를 계산합니다 (통과 / 전체 * 100).

```bash
coverage=$(calculate_coverage)
```

---

## CI/CD 통합

### GitHub Actions 예제

```yaml
name: Backend Structure Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Run structure tests
        run: bash backend/test-structure.sh

      - name: Check coverage
        run: |
          if [ $? -eq 0 ]; then
            echo "Tests passed with 80%+ coverage"
            exit 0
          else
            echo "Tests failed"
            exit 1
          fi
```

### GitLab CI 예제

```yaml
test_structure:
  stage: test
  script:
    - bash backend/test-structure.sh
  only:
    - merge_requests
    - main
```

---

## 문제 해결

### Q: 스크립트가 실행되지 않음
A: 다음 명령어로 실행 권한을 주세요:
```bash
chmod +x backend/test-structure.sh
```

### Q: "No such file or directory" 오류
A: backend 디렉토리에서 실행하세요:
```bash
cd backend
bash test-structure.sh
```

### Q: 색상이 표시되지 않음
A: Windows CMD에서는 색상이 표시되지 않을 수 있습니다. Git Bash 사용을 권장합니다.

### Q: 특정 테스트만 실행하고 싶음
A: 스크립트를 수정하여 필요한 테스트만 주석 처리하면 됩니다.

---

## 추가 정보

### 테스트 커버리지 목표
- **목표**: 80% 이상
- **현재**: 100%

### 지원 환경
- Git Bash (Windows)
- Bash 4.0 이상 (Linux/macOS)
- WSL (Windows Subsystem for Linux)

### 테스트 실행 시간
- 일반적으로 1-2초

### 의존성
- bash
- grep
- 기본 파일 시스템 유틸리티

---

## 관련 파일

- **테스트 스크립트**: `backend/test-structure.sh`
- **테스트 보고서**: `backend/TEST-STRUCTURE-REPORT.md`
- **이 가이드**: `backend/TEST-STRUCTURE-GUIDE.md`

---

## 피드백 및 개선

테스트 스크립트를 개선하고 싶으신 경우:

1. 추가하고 싶은 테스트 항목을 Issue에 등록
2. Pull Request로 개선사항 제안
3. 커버리지 목표를 업데이트하면 자동으로 스크립트에 반영

---

**마지막 업데이트**: 2025-11-26
**현재 커버리지**: 100% (16개 테스트, 모두 통과)
