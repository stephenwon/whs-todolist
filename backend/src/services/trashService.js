const { pool } = require('../config/database');

/**
 * 휴지통 조회 서비스
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 삭제된 할일 목록
 */
const getTrash = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM todos WHERE user_id = $1 AND status = $2 ORDER BY deleted_at DESC',
    [userId, 'deleted']
  );

  return result.rows;
};

/**
 * 할일 영구 삭제 서비스 (DB에서 완전히 제거)
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<void>}
 */
const permanentlyDelete = async (todoId, userId) => {
  // 먼저 할일이 존재하는지 확인
  const existResult = await pool.query(
    'SELECT * FROM todos WHERE todo_id = $1',
    [todoId]
  );

  if (existResult.rows.length === 0) {
    throw new Error('할일을 찾을 수 없습니다');
  }

  const todo = existResult.rows[0];

  // 권한 체크
  if (todo.user_id !== userId) {
    const error = new Error('이 할일에 접근할 권한이 없습니다');
    error.code = 'FORBIDDEN';
    throw error;
  }

  // status='deleted' 상태인지 확인 (활성 상태는 영구 삭제 불가)
  if (todo.status !== 'deleted') {
    throw new Error('활성 상태의 할일은 영구 삭제할 수 없습니다');
  }

  // DB에서 완전히 제거
  await pool.query(
    'DELETE FROM todos WHERE todo_id = $1 AND user_id = $2',
    [todoId, userId]
  );
};

module.exports = {
  getTrash,
  permanentlyDelete
};