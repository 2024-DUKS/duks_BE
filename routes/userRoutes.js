const express = require('express');
const { getUser, updateUserInfo } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// 사용자 정보 조회
router.get('/me', protect, getUser);

// 사용자 정보 업데이트
router.put('/me', protect, updateUserInfo);

module.exports = router;
