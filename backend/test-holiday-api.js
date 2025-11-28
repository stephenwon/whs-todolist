/**
 * 국경일 API 테스트 스크립트
 *
 * 실행 방법: node test-holiday-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// 테스트 결과 저장
let testResults = {
  passed: 0,
  failed: 0,
};

// 테스트 헬퍼 함수
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed) {
  if (passed) {
    testResults.passed++;
    log(`✓ ${name}`, 'green');
  } else {
    testResults.failed++;
    log(`✗ ${name}`, 'red');
  }
}

// 사용자 등록 및 로그인
async function setupTestUser() {
  try {
    // 관리자 계정 생성 시도 (이미 존재할 수 있음)
    const adminEmail = 'admin@test.com';
    const adminPassword = 'adminpassword123';

    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        email: adminEmail,
        password: adminPassword,
        username: '관리자',
      });
      log('관리자 계정 생성 완료', 'blue');
    } catch (error) {
      if (error.response?.status === 409) {
        log('관리자 계정이 이미 존재합니다', 'yellow');
      }
    }

    // 로그인
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminEmail,
      password: adminPassword,
    });

    const accessToken = loginResponse.data.data.accessToken;
    const userRole = loginResponse.data.data.user.role;

    log(`로그인 성공 (역할: ${userRole})`, 'blue');

    return { accessToken, userRole };
  } catch (error) {
    log(`테스트 사용자 설정 실패: ${error.message}`, 'red');
    throw error;
  }
}

// 1. 국경일 조회 테스트 (인증 필요)
async function testGetHolidays(accessToken) {
  log('\n=== 국경일 조회 테스트 ===', 'blue');

  try {
    // 현재 연도 조회
    const response = await axios.get(`${BASE_URL}/holidays`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    logTest('국경일 조회 (현재 연도)', response.status === 200);
    log(`  - 조회된 국경일 수: ${response.data.data.length}`, 'yellow');

    if (response.data.data.length > 0) {
      log(`  - 첫 번째 국경일: ${response.data.data[0].title}`, 'yellow');
    }

    // 특정 연도와 월로 조회
    const response2 = await axios.get(`${BASE_URL}/holidays?year=2025&month=1`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    logTest('국경일 조회 (2025년 1월)', response2.status === 200);
    log(`  - 조회된 국경일 수: ${response2.data.data.length}`, 'yellow');

    // 인증 없이 조회 시도 (실패 예상)
    try {
      await axios.get(`${BASE_URL}/holidays`);
      logTest('인증 없이 조회 (401 예상)', false);
    } catch (error) {
      logTest('인증 없이 조회 (401 반환)', error.response?.status === 401);
    }

  } catch (error) {
    logTest('국경일 조회 실패', false);
    log(`  에러: ${error.message}`, 'red');
  }
}

// 2. 국경일 추가 테스트 (관리자 전용)
async function testCreateHoliday(accessToken, userRole) {
  log('\n=== 국경일 추가 테스트 ===', 'blue');

  try {
    const newHoliday = {
      title: '테스트 국경일',
      date: '2025-12-31',
      description: 'API 테스트용 국경일',
      isRecurring: false
    };

    if (userRole === 'admin') {
      const response = await axios.post(`${BASE_URL}/holidays`, newHoliday, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      logTest('관리자 - 국경일 추가 성공', response.status === 201);
      log(`  - 생성된 ID: ${response.data.data.holiday_id}`, 'yellow');

      return response.data.data.holiday_id;
    } else {
      // 일반 사용자 권한으로 추가 시도 (실패 예상)
      try {
        await axios.post(`${BASE_URL}/holidays`, newHoliday, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        logTest('일반 사용자 - 국경일 추가 (403 예상)', false);
      } catch (error) {
        logTest('일반 사용자 - 국경일 추가 차단', error.response?.status === 403);
      }
    }
  } catch (error) {
    logTest('국경일 추가 실패', false);
    log(`  에러: ${error.message}`, 'red');
  }

  return null;
}

// 3. 국경일 수정 테스트 (관리자 전용)
async function testUpdateHoliday(accessToken, userRole, holidayId) {
  log('\n=== 국경일 수정 테스트 ===', 'blue');

  if (!holidayId) {
    log('  수정할 국경일 ID가 없습니다', 'yellow');
    return;
  }

  try {
    const updateData = {
      title: '수정된 테스트 국경일',
      description: '수정된 설명'
    };

    if (userRole === 'admin') {
      const response = await axios.put(`${BASE_URL}/holidays/${holidayId}`, updateData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      logTest('관리자 - 국경일 수정 성공', response.status === 200);
      log(`  - 수정된 제목: ${response.data.data.title}`, 'yellow');
    } else {
      // 일반 사용자 권한으로 수정 시도 (실패 예상)
      try {
        await axios.put(`${BASE_URL}/holidays/${holidayId}`, updateData, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        logTest('일반 사용자 - 국경일 수정 (403 예상)', false);
      } catch (error) {
        logTest('일반 사용자 - 국경일 수정 차단', error.response?.status === 403);
      }
    }
  } catch (error) {
    logTest('국경일 수정 실패', false);
    log(`  에러: ${error.message}`, 'red');
  }
}

// 4. 유효성 검증 테스트
async function testValidation(accessToken, userRole) {
  log('\n=== 유효성 검증 테스트 ===', 'blue');

  if (userRole !== 'admin') {
    log('  관리자 권한이 필요합니다', 'yellow');
    return;
  }

  try {
    // 필수 필드 누락
    try {
      await axios.post(`${BASE_URL}/holidays`, {
        // title 누락
        date: '2025-01-01'
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      logTest('필수 필드 누락 (400 예상)', false);
    } catch (error) {
      logTest('필수 필드 누락 검증', error.response?.status === 400);
    }

    // 잘못된 날짜 형식
    try {
      await axios.post(`${BASE_URL}/holidays`, {
        title: '테스트',
        date: 'invalid-date'
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      logTest('잘못된 날짜 형식 (400 예상)', false);
    } catch (error) {
      logTest('잘못된 날짜 형식 검증', error.response?.status === 400);
    }

  } catch (error) {
    log(`  검증 테스트 오류: ${error.message}`, 'red');
  }
}

// 메인 테스트 실행
async function runTests() {
  log('====================================', 'blue');
  log('  국경일 API 테스트 시작', 'blue');
  log('====================================', 'blue');

  try {
    // 1. 테스트 사용자 설정
    const { accessToken, userRole } = await setupTestUser();

    // 2. 국경일 조회 테스트
    await testGetHolidays(accessToken);

    // 3. 국경일 추가 테스트
    const holidayId = await testCreateHoliday(accessToken, userRole);

    // 4. 국경일 수정 테스트
    await testUpdateHoliday(accessToken, userRole, holidayId);

    // 5. 유효성 검증 테스트
    await testValidation(accessToken, userRole);

    // 결과 출력
    log('\n====================================', 'blue');
    log('  테스트 결과', 'blue');
    log('====================================', 'blue');
    log(`통과: ${testResults.passed}`, 'green');
    log(`실패: ${testResults.failed}`, 'red');
    log(`총 테스트: ${testResults.passed + testResults.failed}`, 'blue');

    if (testResults.failed === 0) {
      log('\n✓ 모든 테스트 통과!', 'green');
    } else {
      log(`\n✗ ${testResults.failed}개 테스트 실패`, 'red');
    }

  } catch (error) {
    log(`\n테스트 실행 중 오류 발생: ${error.message}`, 'red');
    if (error.code === 'ECONNREFUSED') {
      log('서버가 실행 중인지 확인하세요 (포트 3000)', 'yellow');
    }
  }
}

// 스크립트 실행
runTests();
