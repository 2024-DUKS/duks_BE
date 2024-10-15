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
  uploadPortfolioImages2,  // 여러 이미지 추가
  getUserPortfolioImages2,
  editPortfolioImage2,
  removeAllPortfolioImages2,
  createCharactor2,  // 이 부분이 제대로 불러와졌는지 확인
  getUserCharactor2,
  editCharactor2,
  removeCharactor2  
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

// folioImg 관련 경로
router.post('/folioImg', authenticateToken, upload.single('image'), uploadFolioImg);  // 이미지 업로드
router.get('/folioImg', authenticateToken, getUserFolioImg);  // 이미지 조회
router.put('/folioImg', authenticateToken, upload.single('image'), editFolioImg);  // 이미지 수정
router.delete('/folioImg', authenticateToken, removeFolioImg);  // 이미지 삭제

// portfolioImages2 관련 라우트
router.post('/portfolioImages2', authenticateToken, upload.array('images', 10), uploadPortfolioImages2);  // 여러 이미지 업로드
router.get('/portfolioImages2', authenticateToken, getUserPortfolioImages2);  // 이미지 조회
router.put('/portfolioImages2/:id', authenticateToken, upload.single('image'), editPortfolioImage2);  // 이미지 수정
router.delete('/portfolioImages2', authenticateToken, removeAllPortfolioImages2);  // 모든 이미지 삭제

// charactor2 관련 라우트
router.post('/charactor2', authenticateToken, createCharactor2);  // 여기에 문제가 없는지 확인
router.get('/charactor2', authenticateToken, getUserCharactor2);
router.put('/charactor2', authenticateToken, editCharactor2);
router.delete('/charactor2', authenticateToken, removeCharactor2);
module.exports = router;
