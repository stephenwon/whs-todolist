const { pool } = require('../config/database');

/**
 * 할일 목록 조회 서비스
 * @param {string} userId - 사용자 ID
 * @param {Object} filters - 필터 조건 (status, search, sortBy, order)
 * @returns {Promise<Array>} 할일 목록
 */
const getTodos = async (userId, filters = {}) => {
  let query = 'SELECT * FROM todos WHERE user_id = $1';
  const params = [userId];
  let paramIndex = 2;

  // status 필터
  if (filters.status) {
    query += ` AND status = $${paramIndex}`;
    params.push(filters.status);
    paramIndex++;
  } else {
    // 기본적으로 deleted 상태 제외
    query += ` AND status != 'deleted'`;
  }

  // 검색 필터
  if (filters.search) {
    query += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  // 정렬
  let sortBy = 'created_at';
  if (filters.sortBy === 'dueDate') {
    sortBy = 'due_date';
  }
  const order = filters.order === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortBy} ${order}`;

  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * 특정 할일 조회 서비스
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 할일 정보
 */
const getTodoById = async (todoId, userId) => {
  const result = await pool.query(
    'SELECT * FROM todos WHERE todo_id = $1 AND user_id = $2',
    [todoId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('할일을 찾을 수 없습니다');
  }

  return result.rows[0];
};

/**
 * 할일 생성 서비스
 * @param {string} userId - 사용자 ID
 * @param {Object} todoData - 할일 데이터
 * @returns {Promise<Object>} 생성된 할일 정보
 */
const createTodo = async (userId, todoData) => {
  const { title, content = null, startDate = null, dueDate = null } = todoData;

  // 제목 필수 확인
  if (!title) {
    throw new Error('제목은 필수입니다');
  }

  // 날짜 검증: 만료일은 시작일보다 같거나 이후여야 함
  if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
    throw new Error('만료일은 시작일 이후여야 합니다');
  }

  const result = await pool.query(
    `INSERT INTO todos (user_id, title, content, start_date, due_date) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [userId, title, content, startDate, dueDate]
  );

  return result.rows[0];
};

/**
 * 할일 수정 서비스
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @param {Object} updateData - 수정할 데이터
 * @returns {Promise<Object>} 수정된 할일 정보
 */
const updateTodo = async (todoId, userId, updateData) => {
  // 현재 할일 조회
  const currentTodo = await getTodoById(todoId, userId);

  // 업데이트할 데이터 준비
  const { title, content, startDate, dueDate } = updateData;

  // 날짜 검증
  if ((startDate || dueDate) && 
      (startDate && dueDate && new Date(dueDate) < new Date(startDate))) {
    throw new Error('만료일은 시작일 이후여야 합니다');
  }

  // 쿼리 생성
  const fields = [];
  const values = [];
  let paramIndex = 3;

  if (title !== undefined) {
    fields.push(`title = $${paramIndex}`);
    values.push(title);
    paramIndex++;
  }
  if (content !== undefined) {
    fields.push(`content = $${paramIndex}`);
    values.push(content);
    paramIndex++;
  }
  if (startDate !== undefined) {
    fields.push(`start_date = $${paramIndex}`);
    values.push(startDate);
    paramIndex++;
  }
  if (dueDate !== undefined) {
    fields.push(`due_date = $${paramIndex}`);
    values.push(dueDate);
    paramIndex++;
  }

  // 최종 업데이트 시간 업데이트
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(todoId, userId);

  const query = `UPDATE todos SET ${fields.join(', ')} WHERE todo_id = $${paramIndex - 1} AND user_id = $${paramIndex} RETURNING *`;
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('할일을 찾을 수 없거나 권한이 없습니다');
  }

  return result.rows[0];
};

/**
 * 할일 완료 처리 서비스
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 완료 처리된 할일 정보
 */
const completeTodo = async (todoId, userId) => {
  const result = await pool.query(
    `UPDATE todos SET status = 'completed', is_completed = true, updated_at = CURRENT_TIMESTAMP 
     WHERE todo_id = $1 AND user_id = $2 AND status != 'deleted'
     RETURNING *`,
    [todoId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('할일을 찾을 수 없거나 이미 삭제된 할일입니다');
  }

  return result.rows[0];
};

/**
 * 할일 삭제 서비스 (휴지통 이동)
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 삭제된 할일 정보
 */
const deleteTodo = async (todoId, userId) => {
  const result = await pool.query(
    `UPDATE todos SET status = 'deleted', deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
     WHERE todo_id = $1 AND user_id = $2 AND status != 'deleted'
     RETURNING *`,
    [todoId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('할일을 찾을 수 없거나 이미 삭제된 할일입니다');
  }

  return result.rows[0];
};

/**
 * 할일 복원 서비스
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 복원된 할일 정보
 */
const restoreTodo = async (todoId, userId) => {
  const result = await pool.query(
    `UPDATE todos SET status = 'active', deleted_at = NULL, updated_at = CURRENT_TIMESTAMP 
     WHERE todo_id = $1 AND user_id = $2 AND status = 'deleted'
     RETURNING *`,
    [todoId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('할일을 찾을 수 없거나 복원할 수 없는 상태입니다');
  }

  return result.rows[0];
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  restoreTodo
};