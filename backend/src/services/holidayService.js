const { pool } = require('../config/database');

/**
 * 국경일 목록 조회 서비스
 * @param {number} year - 연도
 * @param {number} month - 월 (선택사항)
 * @returns {Promise<Array>} 국경일 목록
 */
const getHolidays = async (year, month) => {
  let query = `
    SELECT
      holiday_id,
      title as "dateName",
      TO_CHAR(date, 'YYYYMMDD') as locdate,
      description,
      is_recurring,
      created_at,
      updated_at
    FROM holidays WHERE `;
  const params = [];

  if (month) {
    // 특정 연도와 월의 국경일 조회
    query += 'EXTRACT(YEAR FROM date) = $1 AND EXTRACT(MONTH FROM date) = $2';
    params.push(year, month);
  } else {
    // 특정 연도의 국경일 조회
    query += 'EXTRACT(YEAR FROM date) = $1';
    params.push(year);
  }

  query += ' ORDER BY date';

  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * 국경일 추가 서비스 (관리자 전용)
 * @param {Object} holidayData - 국경일 데이터
 * @returns {Promise<Object>} 생성된 국경일 정보
 */
const createHoliday = async (holidayData) => {
  const { title, date, description = null, isRecurring = true } = holidayData;

  const result = await pool.query(
    `INSERT INTO holidays (title, date, description, is_recurring) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [title, date, description, isRecurring]
  );

  return result.rows[0];
};

/**
 * 국경일 수정 서비스 (관리자 전용)
 * @param {string} holidayId - 국경일 ID
 * @param {Object} updateData - 수정할 데이터
 * @returns {Promise<Object>} 수정된 국경일 정보
 */
const updateHoliday = async (holidayId, updateData) => {
  // 현재 국경일 조회
  const currentHoliday = await pool.query(
    'SELECT * FROM holidays WHERE holiday_id = $1',
    [holidayId]
  );

  if (currentHoliday.rows.length === 0) {
    throw new Error('국경일을 찾을 수 없습니다');
  }

  // 업데이트할 데이터 준비
  const { title, date, description, isRecurring } = updateData;
  const fields = [];
  const values = [];
  let paramIndex = 2;

  if (title !== undefined) {
    fields.push(`title = $${paramIndex}`);
    values.push(title);
    paramIndex++;
  }
  if (date !== undefined) {
    fields.push(`date = $${paramIndex}`);
    values.push(date);
    paramIndex++;
  }
  if (description !== undefined) {
    fields.push(`description = $${paramIndex}`);
    values.push(description);
    paramIndex++;
  }
  if (isRecurring !== undefined) {
    fields.push(`is_recurring = $${paramIndex}`);
    values.push(isRecurring);
    paramIndex++;
  }

  // 최종 업데이트 시간 업데이트
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(holidayId);

  const query = `UPDATE holidays SET ${fields.join(', ')} WHERE holiday_id = $${paramIndex} RETURNING *`;
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error('국경일을 찾을 수 없습니다');
  }

  return result.rows[0];
};

module.exports = {
  getHolidays,
  createHoliday,
  updateHoliday
};