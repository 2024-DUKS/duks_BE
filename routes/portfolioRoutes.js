const express = require('express');
const { 
  createSkill, 
  getAllSkills, 
  getSkill, 
  removeSkill,
  createCharactor,
  getUserCharactor,
  editCharactor,
  removeCharactor
} = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// 스킬 추가 (경로를 /skills로 명확히 설정)
router.post('/skills', authenticateToken, createSkill);

// 전체 스킬 조회 (경로를 /skills로 명확히 설정)
router.get('/skills', authenticateToken, getAllSkills);

// 특정 스킬 조회 (경로를 /skills/:id로 명확히 설정)
router.get('/skills/:id', authenticateToken, getSkill);

// 스킬 삭제 (경로를 /skills/:id로 명확히 설정)
router.delete('/skills/:id', authenticateToken, removeSkill);

// Charactor 추가 (경로를 /charactor로 명확히 설정)
router.post('/charactor', authenticateToken, createCharactor);

// Charactor 조회 (경로를 /charactor로 명확히 설정)
router.get('/charactor', authenticateToken, getUserCharactor);

// Charactor 수정 (경로를 /charactor로 명확히 설정)
router.put('/charactor', authenticateToken, editCharactor);

// Charactor 삭제 (경로를 /charactor로 명확히 설정)
router.delete('/charactor', authenticateToken, removeCharactor);

module.exports = router;
