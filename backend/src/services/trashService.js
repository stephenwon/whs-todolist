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
 * 할일 영구 삭제 서비스
 * @param {string} todoId - 할일 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
const permanentlyDelete = async (todoId, userId) => {
  const result = await pool.query(
    'DELETE FROM todos WHERE todo_id = $1 AND user_id = $2 AND status = $3 RETURNING *',
    [todoId, userId, 'deleted']
  );

  if (result.rows.length === 0) {
    throw new Error('할일을 찾을 수 없거나 영구 삭제할 수 없는 상태입니다');
  }

  return true;
};

module.exports = {
  getTrash,
  permanentlyDelete
};