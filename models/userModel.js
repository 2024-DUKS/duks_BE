const pool = require('../config/db');

// 새로운 사용자 생성
const createUser = async (userData) => {
  const { name, studentId, password, nickname, department, phone } = userData;
  const query = `INSERT INTO users (name, studentId, password, nickname, department, phone) VALUES (?, ?, ?, ?, ?, ?)`;
  const [result] = await pool.execute(query, [name, studentId, password, nickname, department, phone]);
  return result;
};

// 학번으로 사용자 조회
const findUserByStudentId = async (studentId) => {
  const query = `SELECT * FROM users WHERE studentId = ?`;
  const [rows] = await pool.execute(query, [studentId]);
  return rows[0];
};

// 사용자 정보 업데이트
const updateUser = async (studentId, fieldsToUpdate) => {
  const setQuery = Object.keys(fieldsToUpdate).map((field) => `${field} = ?`).join(', ');
  const query = `UPDATE users SET ${setQuery} WHERE studentId = ?`;

  const values = [...Object.values(fieldsToUpdate), studentId];
  const [result] = await pool.execute(query, values);
  return result;
};

module.exports = {
  createUser,
  findUserByStudentId,
  updateUser,
};
