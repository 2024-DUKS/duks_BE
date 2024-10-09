const pool = require('../config/db');

// 스킬 추가
const addSkill = async (userId, skill, level) => {
  const query = `INSERT INTO portfolios (userId, skill, level) VALUES (?, ?, ?)`;
  const [result] = await pool.execute(query, [userId, skill, level]);
  return result;
};

// 스킬 목록 조회
const getSkills = async (userId) => {
  const query = `SELECT * FROM portfolios WHERE userId = ?`;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

// 특정 스킬 조회
const getSkillById = async (userId, id) => {
  const query = `SELECT * FROM portfolios WHERE userId = ? AND id = ?`;
  const [rows] = await pool.execute(query, [userId, id]);
  return rows[0];
};

// 스킬 삭제
const deleteSkill = async (userId, id) => {
  const query = `DELETE FROM portfolios WHERE userId = ? AND id = ?`;
  const [result] = await pool.execute(query, [userId, id]);
  return result;
};

// Charactor 추가
const addCharactor = async (userId, charactor) => {
  const query = `INSERT INTO charactors (userId, charactor) VALUES (?, ?)`;
  const [result] = await pool.execute(query, [userId, charactor]);
  return result;
};

// Charactor 조회
const getCharactor = async (userId) => {
  const query = `SELECT * FROM charactors WHERE userId = ?`;
  const [rows] = await pool.execute(query, [userId]);
  return rows[0];
};

// Charactor 수정
const updateCharactor = async (userId, charactor) => {
  const query = `UPDATE charactors SET charactor = ? WHERE userId = ?`;
  const [result] = await pool.execute(query, [charactor, userId]);
  return result;
};

// Charactor 삭제
const deleteCharactor = async (userId) => {
  const query = `DELETE FROM charactors WHERE userId = ?`;
  const [result] = await pool.execute(query, [userId]);
  return result;
};

module.exports = {
  addSkill,
  getSkills,
  getSkillById,
  deleteSkill,
  addCharactor,
  getCharactor,
  updateCharactor,
  deleteCharactor,
};
