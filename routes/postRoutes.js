// routes/postRoutes.js
const express = require('express');
const { createNewPost, getMainPagePosts, getCategoryPosts, getPostDetails, 
    likePost, deleteUserPost, unlikePost, updateUserPost, getPostsByCategory } = require('../controllers/postController');
const authenticateToken = require('../middlewares/authMiddleware'); // JWT 미들웨어 추가
const multer = require('multer');

// Multer 설정: 이미지를 서버에 저장할 경로 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
const upload = multer({ storage });

const router = express.Router();

// 메인 페이지 게시글 로딩
router.get('/main', getMainPagePosts);

// 카테고리별 게시글 로딩
//router.get('/category/:category', getCategoryPosts);

// 카테고리별 인기 게시글과 최신 게시글 가져오기
router.get('/category/:category', getPostsByCategory);

// 게시글 작성 (JWT 인증 필요)
//router.post('/create', authenticateToken, createNewPost);

// 게시글 작성 라우터: JWT 인증 미들웨어가 Multer보다 먼저 실행되도록 설정
router.post('/create', authenticateToken, upload.array('images', 5), createNewPost);

// 게시글 상세 보기
router.get('/:postId', getPostDetails);

// 게시글 공감 (JWT 인증 필요)
router.post('/:postId/like', authenticateToken, likePost);

// 공감 취소
router.delete('/:postId/unlike', authenticateToken, unlikePost);

// 게시글 수정 (JWT 인증 필요)
router.put('/:postId', authenticateToken, updateUserPost);

// 게시글 삭제
router.delete('/:postId', authenticateToken, deleteUserPost);

module.exports = router;
