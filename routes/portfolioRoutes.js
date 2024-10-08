const express = require('express');
const { createSkill, getAllSkills, getSkill, removeSkill } = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// 스킬 추가
router.post('/', authenticateToken, createSkill);

// 전체 스킬 조회
router.get('/', authenticateToken, getAllSkills);

// 특정 스킬 조회
router.get('/:id', authenticateToken, getSkill);

// 스킬 삭제
router.delete('/:id', authenticateToken, removeSkill);

module.exports = router;
