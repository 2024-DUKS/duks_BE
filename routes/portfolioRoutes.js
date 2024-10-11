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
  removeFolioImg
} = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer 설정: 이미지를 서버에 저장할 경로 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/'));  // 명확한 경로 설정
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);  // 파일 이름 중복 방지
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

module.exports = router;
