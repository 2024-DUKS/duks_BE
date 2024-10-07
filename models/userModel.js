// models/userModel.js
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

module.exports = {
  createUser,
  findUserByStudentId,
};
