// models/portfolioModel.js

const pool = require('../config/db');

// ability 추가
const addAbility = async (userId, skill, level) => {
  const query = `INSERT INTO abilities (userId, skill, level) VALUES (?, ?, ?)`;
  const [result] = await pool.execute(query, [userId, skill, level]);
  return result;
};

// ability 조회
const getAbilities = async (userId) => {
  const query = `SELECT * FROM abilities WHERE userId = ?`;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

// ability 삭제
const deleteAbility = async (userId, skill) => {
  const query = `DELETE FROM abilities WHERE userId = ? AND skill = ?`;
  const [result] = await pool.execute(query, [userId, skill]);
  return result;
};

// charactor 저장
const addCharactor = async (userId, text) => {
  const query = `INSERT INTO charactors (userId, text) VALUES (?, ?)`;
  const [result] = await pool.execute(query, [userId, text]);
  return result;
};

// charactor 조회
const getCharactors = async (userId) => {
  const query = `SELECT * FROM charactors WHERE userId = ?`;
  const [rows] = await pool.execute(query, [userId]);
  return rows;
};

// charactor 삭제
const deleteCharactor = async (userId, id) => {
  const query = `DELETE FROM charactors WHERE userId = ? AND id = ?`;
  const [result] = await pool.execute(query, [userId, id]);
  return result;
};

// 포트폴리오 이미지 저장
const savePortfolioImage = async (userId, imagePath) => {
  const query = `UPDATE users SET portfolioImage = ? WHERE id = ?`;
  const [result] = await pool.execute(query, [imagePath, userId]);
  return result;
};

// 포트폴리오 이미지 조회
const getPortfolioImage = async (userId) => {
  const query = `SELECT portfolioImage FROM users WHERE id = ?`;
  const [rows] = await pool.execute(query, [userId]);
  return rows[0]?.portfolioImage;
};

// 포트폴리오 이미지 삭제
const deletePortfolioImage = async (userId) => {
  const query = `UPDATE users SET portfolioImage = NULL WHERE id = ?`;
  const [result] = await pool.execute(query, [userId]);
  return result;
};

module.exports = {
  addAbility,
  getAbilities,
  deleteAbility,
  addCharactor,
  getCharactors,
  deleteCharactor,
  savePortfolioImage,    // 포트폴리오 이미지 저장
  deletePortfolioImage,  // 포트폴리오 이미지 삭제
  getPortfolioImage,     // 포트폴리오 이미지 조회
};
