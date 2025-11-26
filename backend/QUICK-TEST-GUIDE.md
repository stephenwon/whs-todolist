# 백엔드 초기화 테스트 빠른 실행 가이드

## 1분 안에 테스트 실행하기

### Windows 사용자 (Git Bash 권장)

```bash
# 1. 프로젝트 루트로 이동
cd C:\test\whs-todolist

# 2. 테스트 실행
bash backend/test-init.sh
```

### Linux / macOS 사용자

```bash
# 1. 프로젝트 루트로 이동
cd /path/to/whs-todolist

# 2. 테스트 실행
bash backend/test-init.sh
```

## 예상 결과

### ✓ 성공 (100% 통과)
```
================================================================
  테스트 결과 요약
================================================================

총 테스트: 33
통과: 33
실패: 0
통과율: 100.00%

✓ 테스트 통과! 백엔드 초기화가 성공적으로 완료되었습니다.
```

### ✗ 실패 (80% 미만)
```
통과: 25
실패: 8
통과율: 75.76%

✗ 테스트 실패. 백엔드 초기화를 완료하지 못했습니다.
  위의 실패한 테스트를 확인하고 수정해주세요.
```

## 테스트 항목 체크리스트

Issue #6 백엔드 초기화 작업이 모두 완료되었는지 확인합니다:

- [ ] 1. backend 디렉토리 생성됨
- [ ] 2. package.json 파일 생성됨
  - [ ] name, version, main 필드 존재
  - [ ] scripts (dev, start) 설정됨
- [ ] 3. 필수 패키지 10개 설치됨
  - [ ] express
  - [ ] pg
  - [ ] jsonwebtoken
  - [ ] bcrypt
  - [ ] express-validator
  - [ ] cors
  - [ ] helmet
  - [ ] express-rate-limit
  - [ ] dotenv
  - [ ] nodemon (devDependencies)
- [ ] 4. .env 파일 생성됨
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET (32자 이상)
  - [ ] JWT_ACCESS_EXPIRATION
  - [ ] JWT_REFRESH_EXPIRATION
  - [ ] PORT
  - [ ] NODE_ENV
- [ ] 5. .env.example 파일 생성됨
- [ ] 6. node_modules 디렉토리 존재
- [ ] 7. .gitignore 설정 완료
  - [ ] node_modules 포함
  - [ ] .env 포함

## 문제 해결

### 테스트가 실패하는 경우

1. **실패한 테스트 항목 확인**
   - 빨간색으로 표시된 [FAIL] 항목을 확인하세요.
   - 각 실패 항목 아래에 오류 메시지가 표시됩니다.

2. **일반적인 문제**
   - **package.json 없음**: `npm init -y` 실행 후 내용 수정
   - **패키지 없음**: `npm install <패키지명>` 실행
   - **.env 없음**: `.env` 파일 생성 후 환경 변수 추가
   - **node_modules 없음**: `npm install` 실행

3. **수정 후 재테스트**
   ```bash
   bash backend/test-init.sh
   ```

## 더 자세한 정보

- **테스트 사용 가이드**: [TEST-README.md](TEST-README.md)
- **커버리지 보고서**: [TEST-COVERAGE-REPORT.md](TEST-COVERAGE-REPORT.md)
- **Issue #6**: 백엔드 프로젝트 초기화 작업 명세

## 통과 기준

- **80% 이상**: 테스트 통과 (exit code 0)
- **80% 미만**: 테스트 실패 (exit code 1)

현재 백엔드 초기화가 모두 완료된 경우 **100% 통과**가 예상됩니다.
