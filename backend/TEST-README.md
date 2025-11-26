# 백엔드 초기화 테스트 가이드

## 개요

Issue #6 백엔드 프로젝트 초기화 작업의 완료 여부를 검증하는 자동화된 테스트 스크립트입니다.

## 테스트 커버리지

총 **35개의 테스트 케이스**로 구성되어 있으며, 다음 8개 그룹으로 분류됩니다:

### 1. 디렉토리 구조 검증 (1개 테스트)
- backend 디렉토리 존재 확인

### 2. package.json 검증 (7개 테스트)
- 파일 존재 확인
- name, version, main 필드 존재
- scripts 필드 존재
- dev, start 스크립트 존재

### 3. 필수 dependencies 검증 (10개 테스트)
- dependencies 필드 존재
- 9개 필수 패키지 설치 확인:
  - express
  - pg
  - jsonwebtoken
  - bcrypt
  - express-validator
  - cors
  - helmet
  - express-rate-limit
  - dotenv

### 4. devDependencies 검증 (2개 테스트)
- devDependencies 필드 존재
- nodemon 설치 확인

### 5. .env 파일 검증 (8개 테스트)
- .env 파일 존재 확인
- 6개 필수 환경 변수 존재:
  - DATABASE_URL
  - JWT_SECRET
  - JWT_ACCESS_EXPIRATION
  - JWT_REFRESH_EXPIRATION
  - PORT
  - NODE_ENV
- JWT_SECRET 길이 검증 (최소 32자)

### 6. .env.example 파일 검증 (1개 테스트)
- .env.example 파일 존재 확인

### 7. node_modules 검증 (1개 테스트)
- node_modules 디렉토리 존재 확인

### 8. .gitignore 검증 (3개 테스트)
- .gitignore 파일 존재 확인
- node_modules 포함 확인
- .env 포함 확인

## 실행 방법

### Git Bash / Linux / macOS (권장)

```bash
# Bash 스크립트 실행
bash backend/test-init.sh

# 또는 실행 권한 부여 후 직접 실행
chmod +x backend/test-init.sh
./backend/test-init.sh

# 또는 backend 디렉토리로 이동 후 실행
cd backend
bash test-init.sh
```

### Windows PowerShell

**주의**: PowerShell 스크립트는 한글 인코딩 문제로 인해 일부 환경에서 오류가 발생할 수 있습니다.
Windows 사용자는 Git Bash를 사용하는 것을 권장합니다.

```powershell
# PowerShell 스크립트 실행 (UTF-8 인코딩 환경 필요)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
.\backend\test-init.ps1

# 또는 backend 디렉토리로 이동 후 실행
cd backend
.\test-init.ps1
```

## 출력 예시

### 성공 케이스

```
================================================================
  백엔드 프로젝트 초기화 테스트 시작
================================================================

테스트 대상 디렉토리: C:\test\whs-todolist\backend

─────────────────────────────────────────────────────────────
테스트 그룹 1: 디렉토리 구조 검증
─────────────────────────────────────────────────────────────
[PASS] 1.1 backend 디렉토리 존재 확인

─────────────────────────────────────────────────────────────
테스트 그룹 2: package.json 검증
─────────────────────────────────────────────────────────────
[PASS] 2.1 package.json 파일 존재 확인
[PASS] 2.2 package.json - name 필드 존재
[PASS] 2.3 package.json - version 필드 존재
[PASS] 2.4 package.json - main 필드 존재
[PASS] 2.5 package.json - scripts 필드 존재
[PASS] 2.6 package.json - dev 스크립트 존재
[PASS] 2.7 package.json - start 스크립트 존재

...

================================================================
  테스트 결과 요약
================================================================

총 테스트: 35
통과: 35
실패: 0
통과율: 100.00%

✓ 테스트 통과! 백엔드 초기화가 성공적으로 완료되었습니다.
```

### 실패 케이스

```
[FAIL] 3.5 dependencies - bcrypt 존재
       → bcrypt 패키지가 dependencies에 없습니다.
[FAIL] 5.1 .env 파일 존재 확인
       → .env 파일이 존재하지 않습니다.

...

================================================================
  테스트 결과 요약
================================================================

총 테스트: 35
통과: 28
실패: 7
통과율: 80.00%

✗ 테스트 실패. 백엔드 초기화를 완료하지 못했습니다.
  위의 실패한 테스트를 확인하고 수정해주세요.
```

## 통과 기준

- **통과율 80% 이상**: 테스트 통과 (exit code 0)
- **통과율 80% 미만**: 테스트 실패 (exit code 1)

## 테스트 특징

### 독립적 실행
- 각 테스트는 독립적으로 실행되며, 하나의 테스트 실패가 다른 테스트에 영향을 주지 않습니다.
- 모든 테스트 결과를 확인할 수 있습니다.

### 명확한 오류 메시지
- 각 실패한 테스트에 대해 구체적인 오류 메시지를 제공합니다.
- 문제 해결을 위한 힌트를 포함합니다.

### 크로스 플랫폼 지원
- Windows PowerShell 스크립트: `test-init.ps1`
- Git Bash / Linux / macOS 스크립트: `test-init.sh`

### JSON 파싱
- PowerShell: 내장 JSON 파서 사용
- Bash: jq가 설치되어 있으면 사용, 없으면 grep으로 대체

## 문제 해결

### PowerShell 실행 정책 오류

```powershell
# 오류: "이 시스템에서 스크립트를 실행할 수 없으므로..."
# 해결: 실행 정책을 일시적으로 변경
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Bash 스크립트 권한 오류

```bash
# 오류: "Permission denied"
# 해결: 실행 권한 부여
chmod +x backend/test-init.sh
```

### jq 설치 (선택사항)

Bash 스크립트에서 더 정확한 JSON 파싱을 위해 jq 설치를 권장합니다:

```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq

# Windows (Git Bash)
# jq 바이너리를 다운로드하여 PATH에 추가
```

> **참고**: jq가 없어도 스크립트는 정상 작동하지만, jq를 사용하면 더 정확한 JSON 검증이 가능합니다.

## CI/CD 통합

### GitHub Actions 예시

```yaml
name: Backend Init Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend
          npm install

      - name: Run backend init tests
        run: bash backend/test-init.sh
```

## 테스트 확장

새로운 테스트를 추가하려면:

1. `test_condition` 함수를 사용하여 테스트 추가
2. 테스트 번호를 순차적으로 증가
3. 명확한 테스트 이름과 오류 메시지 제공

```bash
# Bash 예시
test_condition "9.1 새로운 테스트" "$CONDITION" "오류 메시지"
```

```powershell
# PowerShell 예시
Test-Condition -TestName "9.1 새로운 테스트" -Condition $Condition -ErrorMessage "오류 메시지"
```

## 라이선스

이 테스트 스크립트는 프로젝트의 일부로 동일한 라이선스를 따릅니다.
