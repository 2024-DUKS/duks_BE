const pool = require('../config/db');

// 스킬 관련 함수들
const addSkill = async (userId, skill, level) => {
  const query = `INSERT INTO portfolios (userId, skill, level) VALUES (?, ?, ?)`
  const [result] = await pool.execute(query, [userId, skill, level])
  return result
}

const getSkills = async (userId) => {
  const query = `SELECT * FROM portfolios WHERE userId = ?`
  const [rows] = await pool.execute(query, [userId])
  return rows
}

const getSkillById = async (userId, id) => {
  const query = `SELECT * FROM portfolios WHERE userId = ? AND id = ?`
  const [rows] = await pool.execute(query, [userId, id])
  return rows[0]
}

const deleteSkill = async (userId, id) => {
  const query = `DELETE FROM portfolios WHERE userId = ? AND id = ?`
  const [result] = await pool.execute(query, [userId, id])
  return result
}

// Charactor 관련 함수들
const addCharactor = async (userId, charactor) => {
  const query = `INSERT INTO charactors (userId, charactor) VALUES (?, ?)`
  const [result] = await pool.execute(query, [userId, charactor])
  return result
}

const getCharactor = async (userId) => {
  const query = `SELECT * FROM charactors WHERE userId = ?`
  const [rows] = await pool.execute(query, [userId])
  return rows[0]
}

const updateCharactor = async (userId, charactor) => {
  const query = `UPDATE charactors SET charactor = ? WHERE userId = ?`
  const [result] = await pool.execute(query, [charactor, userId])
  return result
}

const deleteCharactor = async (userId) => {
  const query = `DELETE FROM charactors WHERE userId = ?`
  const [result] = await pool.execute(query, [userId])
  return result
}

// folioImg 관련 함수들
const addFolioImg = async (userId, imagePath) => {
  const query = `INSERT INTO folioImgs (userId, imagePath) VALUES (?, ?)`
  const [result] = await pool.execute(query, [userId, imagePath])
  return result
}

const getFolioImg = async (userId) => {
  const query = `SELECT * FROM folioImgs WHERE userId = ?`
  const [rows] = await pool.execute(query, [userId])
  return rows[0]
}

const updateFolioImg = async (userId, imagePath) => {
  const query = `UPDATE folioImgs SET imagePath = ? WHERE userId = ?`
  const [result] = await pool.execute(query, [imagePath, userId])
  return result
}

const deleteFolioImg = async (userId) => {
  const query = `DELETE FROM folioImgs WHERE userId = ?`
  const [result] = await pool.execute(query, [userId])
  return result
}

// portfolioImages2 관련 함수들
const addPortfolioImage2 = async (userId, imagePath) => {
  const existingImages = await getPortfolioImages2(userId)
  if (existingImages.length >= 10) {
    throw new Error('최대 10장의 이미지만 등록할 수 있습니다.')
  }

  const imageOrder = existingImages.length + 1
  const query = `INSERT INTO portfolioImages2 (userId, imagePath, imageOrder) VALUES (?, ?, ?)`
  const [result] = await pool.execute(query, [userId, imagePath, imageOrder])
  return result
}

const getPortfolioImages2 = async (userId) => {
  const query = `SELECT * FROM portfolioImages2 WHERE userId = ? ORDER BY imageOrder ASC`
  const [rows] = await pool.execute(query, [userId])
  return rows
}

const updatePortfolioImage2 = async (userId, imageId, newPath) => {
  const query = `UPDATE portfolioImages2 SET imagePath = ? WHERE userId = ? AND id = ?`
  const [result] = await pool.execute(query, [newPath, userId, imageId])
  return result
}

const deletePortfolioImage2 = async (userId, imageId) => {
  // 먼저 imageOrder 값을 가져옵니다.
  const [rows] = await pool.execute(
    `SELECT imageOrder FROM portfolioImages2 WHERE id = ? AND userId = ?`,
    [imageId, userId]
  )
  if (rows.length === 0) {
    throw new Error('해당 이미지를 찾을 수 없습니다.')
  }

  const imageOrder = rows[0].imageOrder

  // 해당 이미지를 삭제합니다.
  const deleteQuery = `DELETE FROM portfolioImages2 WHERE userId = ? AND id = ?`
  const [deleteResult] = await pool.execute(deleteQuery, [userId, imageId])

  // imageOrder 값을 기반으로 나머지 이미지들의 순서를 업데이트합니다.
  const updateOrderQuery = `UPDATE portfolioImages2 SET imageOrder = imageOrder - 1 WHERE userId = ? AND imageOrder > ?`
  await pool.execute(updateOrderQuery, [userId, imageOrder])

  return deleteResult
}

// charactor2 추가
const addCharactor2 = async (userId, charactor2) => {
  const query = `INSERT INTO charactors2 (userId, charactor2) VALUES (?, ?)`
  const [result] = await pool.execute(query, [userId, charactor2])
  return result
}

// charactor2 조회
const getCharactor2 = async (userId) => {
  const query = `SELECT * FROM charactors2 WHERE userId = ?`
  const [rows] = await pool.execute(query, [userId])
  return rows[0]
}

// charactor2 수정
const updateCharactor2 = async (userId, charactor2) => {
  const query = `UPDATE charactors2 SET charactor2 = ? WHERE userId = ?`
  const [result] = await pool.execute(query, [charactor2, userId])
  return result
}

// charactor2 삭제
const deleteCharactor2 = async (userId) => {
  const query = `DELETE FROM charactors2 WHERE userId = ?`
  const [result] = await pool.execute(query, [userId])
  return result
}

module.exports = {
  addSkill,
  getSkills,
  getSkillById,
  deleteSkill,
  addCharactor,
  getCharactor,
  updateCharactor,
  deleteCharactor,
  addFolioImg,
  getFolioImg,
  updateFolioImg,
  deleteFolioImg,
  addPortfolioImage2,
  getPortfolioImages2,
  updatePortfolioImage2,
  deletePortfolioImage2,
  addCharactor2,
  getCharactor2,
  updateCharactor2,
  deleteCharactor2,
}
