const express = require('express');
const { register, login, getUserDetails, getUserField,deleteUser } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// 회원가입
router.post('/register', register);

// 로그인
router.post('/login', login);

// 전체 사용자 정보 조회
router.get('/me', authenticateToken, getUserDetails);

// 필드별 사용자 정보 조회
router.get('/me/:field', authenticateToken, getUserField);

// 회원 탈퇴 라우트
router.delete('/me', authenticateToken, deleteUser);

module.exports = router;
