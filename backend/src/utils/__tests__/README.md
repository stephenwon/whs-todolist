# JWT Helper 테스트 문서

## 개요
`jwtHelper.js` 유틸리티의 완전한 테스트 커버리지를 제공하는 테스트 스위트입니다.
TDD(Test-Driven Development) 방식으로 작성되었으며, 80% 이상의 코드 커버리지를 목표로 합니다.

## 테스트 파일 위치
- **파일 경로**: `C:\test\whs-todolist\backend\src\utils\__tests__\jwtHelper.test.js`
- **대상 구현**: `C:\test\whs-todolist\backend\src\utils\jwtHelper.js` (아직 미구현)

## 테스트 실행 방법

```bash
# 전체 테스트 실행
npm test

# Watch 모드로 테스트 실행
npm run test:watch

# 커버리지 리포트와 함께 테스트 실행
npm run test:coverage
```

## 테스트 환경 변수

```
JWT_SECRET=test-secret-key-for-jwt-testing
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

## 테스트 케이스 목록

### 1. 토큰 생성 테스트 (9개 테스트)

#### 1.1 generateAccessToken
- ✓ 유효한 payload로 Access Token을 성공적으로 생성해야 함
- ✓ 생성된 Access Token에 payload 정보가 올바르게 포함되어야 함
- ✓ 빈 payload로도 토큰을 생성할 수 있어야 함

#### 1.2 generateRefreshToken
- ✓ 유효한 payload로 Refresh Token을 성공적으로 생성해야 함
- ✓ 생성된 Refresh Token에 payload 정보가 올바르게 포함되어야 함
- ✓ Access Token과 Refresh Token의 만료 시간이 달라야 함

### 2. 토큰 검증 테스트 (11개 테스트)

#### 2.1 verifyAccessToken
- ✓ 유효한 Access Token 검증에 성공해야 함
- ✓ 잘못된 형식의 토큰 검증 시 에러를 발생시켜야 함
- ✓ 잘못된 시크릿으로 생성된 토큰 검증 시 에러를 발생시켜야 함
- ✓ 만료된 Access Token 검증 시 TokenExpiredError를 발생시켜야 함
- ✓ 빈 문자열이나 null 토큰 검증 시 에러를 발생시켜야 함

#### 2.2 verifyRefreshToken
- ✓ 유효한 Refresh Token 검증에 성공해야 함
- ✓ 잘못된 형식의 토큰 검증 시 에러를 발생시켜야 함
- ✓ 잘못된 시크릿으로 생성된 토큰 검증 시 에러를 발생시켜야 함
- ✓ 만료된 Refresh Token 검증 시 TokenExpiredError를 발생시켜야 함

### 3. 에러 핸들링 테스트 (4개 테스트)
- ✓ TokenExpiredError가 올바르게 처리되어야 함
- ✓ JsonWebTokenError가 올바르게 처리되어야 함
- ✓ 잘못된 시크릿 키로 인한 에러가 올바르게 처리되어야 함
- ✓ undefined 토큰 검증 시 적절한 에러를 발생시켜야 함

### 4. 통합 시나리오 테스트 (3개 테스트)
- ✓ 토큰 생성 후 즉시 검증이 성공해야 함
- ✓ 동일한 payload로 생성한 두 토큰은 서로 다른 문자열이어야 함
- ✓ Access Token으로 Refresh Token 검증 함수를 호출해도 동작해야 함

### 5. 경계값 테스트 (2개 테스트)
- ✓ 매우 큰 payload로 토큰을 생성할 수 있어야 함
- ✓ 숫자, 문자열, 객체, 배열 등 다양한 타입의 payload 속성을 처리해야 함

## 총 테스트 케이스: 29개

## 구현해야 할 함수 명세

### 1. generateAccessToken(payload)
```javascript
/**
 * Access Token 생성
 * @param {Object} payload - 토큰에 포함할 데이터
 * @returns {string} JWT Access Token
 */
```

**요구사항:**
- JWT_SECRET 환경 변수 사용
- JWT_ACCESS_EXPIRATION (15분) 만료 시간 설정
- payload를 토큰에 인코딩

### 2. generateRefreshToken(payload)
```javascript
/**
 * Refresh Token 생성
 * @param {Object} payload - 토큰에 포함할 데이터
 * @returns {string} JWT Refresh Token
 */
```

**요구사항:**
- JWT_SECRET 환경 변수 사용
- JWT_REFRESH_EXPIRATION (7일) 만료 시간 설정
- payload를 토큰에 인코딩

### 3. verifyAccessToken(token)
```javascript
/**
 * Access Token 검증
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Object} 디코딩된 payload
 * @throws {TokenExpiredError} 토큰 만료 시
 * @throws {JsonWebTokenError} 유효하지 않은 토큰 시
 */
```

**요구사항:**
- JWT_SECRET 환경 변수로 검증
- 유효한 토큰의 경우 디코딩된 payload 반환
- 만료/잘못된 토큰의 경우 에러 발생

### 4. verifyRefreshToken(token)
```javascript
/**
 * Refresh Token 검증
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Object} 디코딩된 payload
 * @throws {TokenExpiredError} 토큰 만료 시
 * @throws {JsonWebTokenError} 유효하지 않은 토큰 시
 */
```

**요구사항:**
- JWT_SECRET 환경 변수로 검증
- 유효한 토큰의 경우 디코딩된 payload 반환
- 만료/잘못된 토큰의 경우 에러 발생

## 커버리지 목표

- **라인 커버리지**: 80% 이상
- **함수 커버리지**: 100%
- **브랜치 커버리지**: 80% 이상

## 에러 타입

테스트에서 검증하는 주요 에러 타입:
- `jwt.TokenExpiredError` - 만료된 토큰
- `jwt.JsonWebTokenError` - 잘못된 형식 또는 시크릿의 토큰
- 일반 `Error` - undefined, null 등 잘못된 입력

## 다음 단계

1. `backend/src/utils/jwtHelper.js` 파일 생성
2. 위 함수 명세에 따라 구현
3. `npm test` 실행하여 모든 테스트 통과 확인
4. `npm run test:coverage` 실행하여 커버리지 80% 이상 확인

## 주의사항

- 테스트는 독립적으로 실행 가능하도록 설계됨
- 환경 변수는 테스트 파일 내에서 자동 설정됨
- 실제 환경에서는 .env 파일에서 환경 변수 로드 필요
- 오버엔지니어링 금지 원칙에 따라 필요한 기능만 간단하게 구현
