// models/userModel.js
const { createConnection } = require('../config/db');  // createConnection 가져오기

// 사용자 생성
const createUser = async (userData) => {
  const { name, studentId, password, nickname, department, phone } = userData;
  const connection = await createConnection();  // MySQL 연결 생성
  try {
    const query = `INSERT INTO users (name, studentId, password, nickname, department, phone) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [name, studentId, password, nickname, department, phone]);
    return result;
  } finally {
    await connection.end();  // 연결 닫기
  }
};

// 학번으로 사용자 조회
const findUserByStudentId = async (studentId) => {
  const connection = await createConnection();  // MySQL 연결 생성
  try {
    const query = `SELECT * FROM users WHERE studentId = ?`;
    const [rows] = await connection.execute(query, [studentId]);
    return rows[0];
  } finally {
    await connection.end();  // 연결 닫기
  }
};

// 사용자 ID로 조회
const findUserById = async (userId) => {
  const connection = await createConnection();  // MySQL 연결 생성
  try {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await connection.execute(query, [userId]);
    return rows[0];
  } finally {
    await connection.end();  // 연결 닫기
  }
};

// 사용자 정보 업데이트
const updateUser = async (userId, updatedData) => {
  const { name, password, nickname, department, phone } = updatedData;
  const connection = await createConnection();  // MySQL 연결 생성
  try {
    const query = `
      UPDATE users 
      SET name = ?, password = ?, nickname = ?, department = ?, phone = ?
      WHERE id = ?`;
    const [result] = await connection.execute(query, [name, password, nickname, department, phone, userId]);
    return result;
  } finally {
    await connection.end();  // 연결 닫기
  }
};

module.exports = {
  createUser,
  findUserByStudentId,
  findUserById,
  updateUser,
};
