const pool = require('../config/db');

const createUser = async (userData) => {
  const { name, studentId, password, nickname, department, phone } = userData;
  const query = `INSERT INTO users (name, studentId, password, nickname, department, phone) VALUES (?, ?, ?, ?, ?, ?)`;
  const [result] = await pool.execute(query, [name, studentId, password, nickname, department, phone]);
  return result;
};

const findUserByStudentId = async (studentId) => {
  const query = `SELECT * FROM users WHERE studentId = ?`;
  const [rows] = await pool.execute(query, [studentId]);
  return rows[0];
};

// 사용자의 ID로 사용자 정보 조회
const findUserById = async (userId) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  const [rows] = await pool.execute(query, [userId]);
  return rows[0];
};

const updateUserById = async (userId, updatedUser) => {
  const { name, password, nickname, department, phone } = updatedUser;
  const query = `UPDATE users SET name = ?, password = ?, nickname = ?, department = ?, phone = ? WHERE id = ?`;
  const [result] = await pool.execute(query, [name, password, nickname, department, phone, userId]);
  return result;
};

module.exports = {
  createUser,
  findUserByStudentId,
  findUserById,
  updateUserById, // 새로운 함수 추가
};
