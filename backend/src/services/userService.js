const { pool } = require('../config/database');
const { hashPassword } = require('../utils/passwordHelper');

/**
 * 사용자 프로필 조회 서비스
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 사용자 프로필 정보
 */
const getProfile = async (userId) => {
  const result = await pool.query(
    'SELECT user_id, email, username, role, created_at FROM users WHERE user_id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('사용자를 찾을 수 없습니다');
  }

  return result.rows[0];
};

/**
 * 사용자 프로필 수정 서비스
 * @param {string} userId - 사용자 ID
 * @param {Object} updateData - 수정할 데이터
 * @returns {Promise<Object>} 수정된 사용자 정보
 */
const updateProfile = async (userId, updateData) => {
  // 현재 사용자 정보 조회
  const currentUser = await pool.query(
    'SELECT email, username FROM users WHERE user_id = $1',
    [userId]
  );

  if (currentUser.rows.length === 0) {
    throw new Error('사용자를 찾을 수 없습니다');
  }

  // 업데이트할 데이터 준비
  const { username, password } = updateData;
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (username !== undefined) {
    // 사용자 이름 중복 체크
    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE username = $1 AND user_id != $2',
      [username, userId]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('이미 사용 중인 사용자 이름입니다');
    }

    fields.push(`username = $${paramIndex}`);
    values.push(username);
    paramIndex++;
  }

  if (password !== undefined) {
    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);
    fields.push(`password = $${paramIndex}`);
    values.push(hashedPassword);
    paramIndex++;
  }

  // 업데이트할 것이 없으면 종료
  if (fields.length === 0) {
    return await getProfile(userId);
  }

  // 최종 업데이트 시간 업데이트
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING user_id, email, username, role`;
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('사용자 정보 업데이트에 실패했습니다');
  }

  return result.rows[0];
};

module.exports = {
  getProfile,
  updateProfile
};