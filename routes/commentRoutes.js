// routes/commentRoutes.js
const express = require('express');
const { createNewComment, deleteUserComment, updateUserComment } = require('../controllers/commentController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// 댓글 작성 (JWT 인증 필요)
router.post('/create', authenticateToken, createNewComment);

// 댓글 수정 (JWT 인증 필요)
router.put('/:commentId', authenticateToken, updateUserComment);

// 댓글 삭제
router.delete('/:commentId', authenticateToken, deleteUserComment);

module.exports = router;
