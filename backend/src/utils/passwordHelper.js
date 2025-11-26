const bcrypt = require('bcrypt');

/**
 * 비밀번호 해싱
 * @param {string} plainPassword - 평문 비밀번호
 * @returns {Promise<string>} 해싱된 비밀번호
 */
const hashPassword = async (plainPassword) => {
  const saltRounds = 10; // 기본 salt rounds
  return await bcrypt.hash(plainPassword, saltRounds);
};

/**
 * 비밀번호 비교
 * @param {string} plainPassword - 평문 비밀번호
 * @param {string} hashedPassword - 해싱된 비밀번호
 * @returns {Promise<boolean>} 비밀번호 일치 여부
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};