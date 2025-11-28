/**
 * WHS-TodoList API 종합 테스트 스크립트
 *
 * 실행 방법: node backend/test-api.js
 *
 * 테스트 대상:
 * 1. 인증 API (회원가입, 로그인, 토큰 갱신, 로그아웃)
 * 2. 할일 API (CRUD, 완료, 복원)
 * 3. 휴지통 API (조회, 영구 삭제)
 * 4. 국경일 API (조회)
 * 5. 사용자 API (프로필 조회/수정)
 * 6. 에러 케이스 (401, 403, 404, 400)
 */

const axios = require('axios');

// 테스트 설정
const BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  email: `test${Date.now()}@example.com`,
  password: 'testpass123',
  username: '테스트사용자'
};

// 테스트 결과 저장
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// 테스트 데이터 저장
let authTokens = {
  accessToken: null,
  refreshToken: null
};
let testTodoId = null;

// 색상 코드 (콘솔 출력용)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 유틸리티 함수
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n▶ ${testName}`, 'cyan');
  testResults.total++;
}

function logSuccess(message) {
  testResults.passed++;
  log(`  ✓ ${message}`, 'green');
}

function logError(message, error) {
  testResults.failed++;
  log(`  ✗ ${message}`, 'red');
  if (error) {
    const errorMsg = typeof error === 'object' ? JSON.stringify(error, null, 2) : error;
    log(`    ${errorMsg}`, 'red');
    testResults.errors.push({ test: message, error: errorMsg });
  }
}

function logInfo(message) {
  log(`  ℹ ${message}`, 'yellow');
}

// 테스트 함수들
async function testAuthRegister() {
  logTest('1. 회원가입 - POST /api/auth/register');

  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, TEST_USER);

    if (response.status === 201 && response.data.success) {
      logSuccess('회원가입 성공');
      logInfo(`사용자 ID: ${response.data.data.userId}`);
      logInfo(`이메일: ${response.data.data.email}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('회원가입 실패', error.response?.data || error.message);
    return false;
  }
}

async function testAuthLogin() {
  logTest('2. 로그인 - POST /api/auth/login');

  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (response.status === 200 && response.data.success) {
      authTokens.accessToken = response.data.data.accessToken;
      authTokens.refreshToken = response.data.data.refreshToken;

      logSuccess('로그인 성공');
      logInfo(`Access Token: ${authTokens.accessToken.substring(0, 20)}...`);
      logInfo(`Refresh Token: ${authTokens.refreshToken.substring(0, 20)}...`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('로그인 실패', error.response?.data || error.message);
    return false;
  }
}

async function testTokenRefresh() {
  logTest('3. 토큰 갱신 - POST /api/auth/refresh');

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: authTokens.refreshToken
    });

    if (response.status === 200 && response.data.success) {
      const newAccessToken = response.data.data.accessToken;
      logSuccess('토큰 갱신 성공');
      logInfo(`새 Access Token: ${newAccessToken.substring(0, 20)}...`);
      authTokens.accessToken = newAccessToken; // 토큰 업데이트
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('토큰 갱신 실패', error.response?.data || error.message);
    return false;
  }
}

async function testCreateTodo() {
  logTest('4. 할일 생성 - POST /api/todos');

  try {
    const todoData = {
      title: '테스트 할일',
      content: '종합 API 테스트를 위한 할일입니다',
      startDate: '2025-11-26',
      dueDate: '2025-11-30'
    };

    const response = await axios.post(`${BASE_URL}/todos`, todoData, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 201 && response.data.success) {
      testTodoId = response.data.data.todo_id || response.data.data.todoId;
      logSuccess('할일 생성 성공');
      logInfo(`할일 ID: ${testTodoId}`);
      logInfo(`제목: ${response.data.data.title}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('할일 생성 실패', error.response?.data || error.message);
    return false;
  }
}

async function testGetTodos() {
  logTest('5. 할일 목록 조회 - GET /api/todos');

  try {
    const response = await axios.get(`${BASE_URL}/todos`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      const todos = response.data.data;
      logSuccess(`할일 목록 조회 성공 (${todos.length}개)`);

      if (todos.length > 0) {
        logInfo(`첫 번째 할일: ${todos[0].title}`);
      }
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('할일 목록 조회 실패', error.response?.data || error.message);
    return false;
  }
}

async function testGetTodoById() {
  logTest('6. 할일 상세 조회 - GET /api/todos/:id');

  try {
    const response = await axios.get(`${BASE_URL}/todos/${testTodoId}`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('할일 상세 조회 성공');
      logInfo(`제목: ${response.data.data.title}`);
      logInfo(`상태: ${response.data.data.status}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('할일 상세 조회 실패', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateTodo() {
  logTest('7. 할일 수정 - PUT /api/todos/:id');

  try {
    const updateData = {
      title: '수정된 테스트 할일',
      content: '내용이 수정되었습니다',
      startDate: '2025-11-26',
      dueDate: '2025-12-01'
    };

    const response = await axios.put(`${BASE_URL}/todos/${testTodoId}`, updateData, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('할일 수정 성공');
      logInfo(`수정된 제목: ${response.data.data.title}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('할일 수정 실패', error.response?.data || error.message);
    return false;
  }
}

async function testCompleteTodo() {
  logTest('8. 할일 완료 - PATCH /api/todos/:id/complete');

  try {
    const response = await axios.patch(`${BASE_URL}/todos/${testTodoId}/complete`, {}, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('할일 완료 처리 성공');
      logInfo(`상태: ${response.data.data.status}`);
      logInfo(`완료 여부: ${response.data.data.isCompleted}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('할일 완료 실패', error.response?.data || error.message);
    return false;
  }
}

async function testDeleteTodo() {
  logTest('9. 할일 삭제 (휴지통 이동) - DELETE /api/todos/:id');

  try {
    const response = await axios.delete(`${BASE_URL}/todos/${testTodoId}`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('할일 삭제 (휴지통 이동) 성공');
      logInfo(`상태: ${response.data.data.status}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('할일 삭제 실패', error.response?.data || error.message);
    return false;
  }
}

async function testGetTrash() {
  logTest('10. 휴지통 조회 - GET /api/trash');

  try {
    const response = await axios.get(`${BASE_URL}/trash`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      const trashItems = response.data.data;
      logSuccess(`휴지통 조회 성공 (${trashItems.length}개)`);

      if (trashItems.length > 0) {
        logInfo(`첫 번째 항목: ${trashItems[0].title}`);
      }
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('휴지통 조회 실패', error.response?.data || error.message);
    return false;
  }
}

async function testRestoreTodo() {
  logTest('11. 할일 복원 - PATCH /api/todos/:id/restore');

  try {
    const response = await axios.patch(`${BASE_URL}/todos/${testTodoId}/restore`, {}, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('할일 복원 성공');
      logInfo(`상태: ${response.data.data.status}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('할일 복원 실패', error.response?.data || error.message);
    return false;
  }
}

async function testDeleteTodoPermanently() {
  logTest('12. 영구 삭제 - DELETE /api/trash/:id');

  try {
    // 먼저 다시 휴지통으로 이동
    await axios.delete(`${BASE_URL}/todos/${testTodoId}`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    // 영구 삭제
    const response = await axios.delete(`${BASE_URL}/trash/${testTodoId}`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('할일 영구 삭제 성공');
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('영구 삭제 실패', error.response?.data || error.message);
    return false;
  }
}

async function testGetHolidays() {
  logTest('13. 국경일 조회 - GET /api/holidays');

  try {
    const response = await axios.get(`${BASE_URL}/holidays?year=2025`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      const holidays = response.data.data;
      logSuccess(`국경일 조회 성공 (${holidays.length}개)`);

      if (holidays.length > 0) {
        logInfo(`첫 번째 국경일: ${holidays[0].title} (${holidays[0].date})`);
      }
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('국경일 조회 실패', error.response?.data || error.message);
    return false;
  }
}

async function testGetUserProfile() {
  logTest('14. 프로필 조회 - GET /api/users/me');

  try {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('프로필 조회 성공');
      logInfo(`사용자명: ${response.data.data.username}`);
      logInfo(`이메일: ${response.data.data.email}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('프로필 조회 실패', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateUserProfile() {
  logTest('15. 프로필 수정 - PATCH /api/users/me');

  try {
    const updateData = {
      username: '수정된사용자명'
    };

    const response = await axios.patch(`${BASE_URL}/users/me`, updateData, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('프로필 수정 성공');
      logInfo(`수정된 사용자명: ${response.data.data.username}`);
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('프로필 수정 실패', error.response?.data || error.message);
    return false;
  }
}

async function testUnauthorizedAccess() {
  logTest('16. 인증 없이 접근 (401 테스트) - GET /api/todos');

  try {
    await axios.get(`${BASE_URL}/todos`);
    logError('인증 없이 접근 가능 (보안 문제)');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('401 Unauthorized 응답 확인');
      return true;
    } else {
      logError('예상과 다른 에러', error.response?.data || error.message);
      return false;
    }
  }
}

async function testInvalidToken() {
  logTest('17. 잘못된 토큰 (401 테스트) - GET /api/todos');

  try {
    await axios.get(`${BASE_URL}/todos`, {
      headers: { Authorization: 'Bearer invalid-token-12345' }
    });
    logError('잘못된 토큰으로 접근 가능 (보안 문제)');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('401 Unauthorized 응답 확인');
      return true;
    } else {
      logError('예상과 다른 에러', error.response?.data || error.message);
      return false;
    }
  }
}

async function testNotFoundTodo() {
  logTest('18. 존재하지 않는 할일 (404 테스트) - GET /api/todos/:id');

  try {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await axios.get(`${BASE_URL}/todos/${fakeId}`, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });
    logError('존재하지 않는 할일 접근 가능');
    return false;
  } catch (error) {
    if (error.response?.status === 404) {
      logSuccess('404 Not Found 응답 확인');
      return true;
    } else {
      logError('예상과 다른 에러', error.response?.data || error.message);
      return false;
    }
  }
}

async function testInvalidDateRange() {
  logTest('19. 잘못된 날짜 범위 (400 테스트) - POST /api/todos');

  try {
    const invalidData = {
      title: '잘못된 할일',
      startDate: '2025-12-31',
      dueDate: '2025-11-01' // 시작일보다 이전
    };

    await axios.post(`${BASE_URL}/todos`, invalidData, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });
    logError('잘못된 날짜 범위로 할일 생성 가능');
    return false;
  } catch (error) {
    if (error.response?.status === 400) {
      logSuccess('400 Bad Request 응답 확인');
      return true;
    } else {
      logError('예상과 다른 에러', error.response?.data || error.message);
      return false;
    }
  }
}

async function testLogout() {
  logTest('20. 로그아웃 - POST /api/auth/logout');

  try {
    const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${authTokens.accessToken}` }
    });

    if (response.status === 200 && response.data.success) {
      logSuccess('로그아웃 성공');
      return true;
    } else {
      logError('응답 형식이 올바르지 않음');
      return false;
    }
  } catch (error) {
    logError('로그아웃 실패', error.response?.data || error.message);
    return false;
  }
}

// 메인 테스트 실행 함수
async function runAllTests() {
  log('\n='.repeat(60), 'blue');
  log('WHS-TodoList API 종합 테스트 시작', 'blue');
  log('='.repeat(60), 'blue');
  log(`서버 URL: ${BASE_URL}`, 'blue');
  log(`테스트 시간: ${new Date().toLocaleString('ko-KR')}`, 'blue');
  log('='.repeat(60), 'blue');

  try {
    // 1. 인증 테스트
    log('\n📋 1단계: 인증 API 테스트', 'yellow');
    await testAuthRegister();
    await testAuthLogin();
    await testTokenRefresh();

    // 2. 할일 CRUD 테스트
    log('\n📋 2단계: 할일 API 테스트', 'yellow');
    await testCreateTodo();
    await testGetTodos();
    await testGetTodoById();
    await testUpdateTodo();
    await testCompleteTodo();
    await testDeleteTodo();

    // 3. 휴지통 테스트
    log('\n📋 3단계: 휴지통 API 테스트', 'yellow');
    await testGetTrash();
    await testRestoreTodo();
    await testDeleteTodoPermanently();

    // 4. 국경일 테스트
    log('\n📋 4단계: 국경일 API 테스트', 'yellow');
    await testGetHolidays();

    // 5. 사용자 프로필 테스트
    log('\n📋 5단계: 사용자 API 테스트', 'yellow');
    await testGetUserProfile();
    await testUpdateUserProfile();

    // 6. 에러 케이스 테스트
    log('\n📋 6단계: 에러 케이스 테스트', 'yellow');
    await testUnauthorizedAccess();
    await testInvalidToken();
    await testNotFoundTodo();
    await testInvalidDateRange();

    // 7. 로그아웃
    log('\n📋 7단계: 로그아웃 테스트', 'yellow');
    await testLogout();

  } catch (error) {
    log(`\n예상치 못한 오류 발생: ${error.message}`, 'red');
  }

  // 최종 결과 출력
  printTestSummary();
}

function printTestSummary() {
  log('\n' + '='.repeat(60), 'blue');
  log('테스트 결과 요약', 'blue');
  log('='.repeat(60), 'blue');

  log(`\n총 테스트: ${testResults.total}`, 'cyan');
  log(`성공: ${testResults.passed}`, 'green');
  log(`실패: ${testResults.failed}`, 'red');

  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`성공률: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');

  if (testResults.errors.length > 0) {
    log('\n실패한 테스트 상세:', 'red');
    testResults.errors.forEach((err, index) => {
      log(`  ${index + 1}. ${err.test}`, 'red');
      log(`     ${err.error}`, 'red');
    });
  }

  log('\n' + '='.repeat(60), 'blue');

  if (testResults.failed === 0) {
    log('✓ 모든 테스트 통과!', 'green');
  } else {
    log('✗ 일부 테스트 실패', 'red');
  }

  log('='.repeat(60) + '\n', 'blue');
}

// 테스트 실행
runAllTests().catch(error => {
  log(`\n치명적 오류 발생: ${error.message}`, 'red');
  process.exit(1);
});
