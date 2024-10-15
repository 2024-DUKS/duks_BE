const express = require('express');
const { 
  createSkill, 
  getAllSkills, 
  getSkill, 
  removeSkill,
  createCharactor,
  getUserCharactor,
  editCharactor,
  removeCharactor,
  uploadFolioImg,
  getUserFolioImg,
  editFolioImg,
  removeFolioImg,
  getUserPortfolio,
  uploadPortfolioImages2,
  getUserPortfolioImages2,
  editPortfolioImage2,
  removeAllPortfolioImages2,
  createCharactor2,
  getUserCharactor2,
  editCharactor2,
  removeCharactor2,
} = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');

// Multer 설정: 여러 개의 이미지를 서버에 저장할 수 있도록 설정
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

// 스킬 관련 라우트
router.post('/skills', authenticateToken, createSkill);
router.get('/skills', authenticateToken, getAllSkills);
router.get('/skills/:id', authenticateToken, getSkill);
router.delete('/skills/:id', authenticateToken, removeSkill);

// Charactor 관련 라우트
router.post('/charactor', authenticateToken, createCharactor);
router.get('/charactor', authenticateToken, getUserCharactor);
router.put('/charactor', authenticateToken, editCharactor);
router.delete('/charactor', authenticateToken, removeCharactor);

// 포트폴리오 이미지 관련 라우트
router.post('/folioImg', authenticateToken, upload.single('image'), uploadFolioImg);
router.get('/folioImg', authenticateToken, getUserFolioImg);
router.put('/folioImg', authenticateToken, upload.single('image'), editFolioImg);
router.delete('/folioImg', authenticateToken, removeFolioImg);

// PortfolioImages2 관련 라우트
router.post('/portfolioImages2', authenticateToken, upload.array('images', 10), uploadPortfolioImages2);
router.get('/portfolioImages2', authenticateToken, getUserPortfolioImages2);
router.put('/portfolioImages2/:id', authenticateToken, upload.single('image'), editPortfolioImage2);
router.delete('/portfolioImages2', authenticateToken, removeAllPortfolioImages2);

// Charactor2 관련 라우트
router.post('/charactor2', authenticateToken, createCharactor2);
router.get('/charactor2', authenticateToken, getUserCharactor2);
router.put('/charactor2', authenticateToken, editCharactor2);
router.delete('/charactor2', authenticateToken, removeCharactor2);

// 특정 유저의 전체 포트폴리오 조회
router.get('/:userId', authenticateToken, getUserPortfolio);

module.exports = router;
