// routes/portfolioRoutes.js
const express = require('express');
const { addAbilityController, getAbilitiesController, deleteAbilityController, addCharactorController, getCharactorsController, deleteCharactorController, savePortfolioImageController, deletePortfolioImageController, getPortfolioImageController } = require('../controllers/portfolioController');
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();

// 파일 업로드 설정
const upload = multer({ dest: 'uploads/' });

// ability 관련 라우트
router.post('/ability', authenticateToken, addAbilityController);
router.get('/ability', authenticateToken, getAbilitiesController);
router.delete('/ability/:skill', authenticateToken, deleteAbilityController);

// charactor 관련 라우트
router.post('/charactor', authenticateToken, addCharactorController);
router.get('/charactor', authenticateToken, getCharactorsController);
router.delete('/charactor/:id', authenticateToken, deleteCharactorController);

// 포트폴리오 이미지 관련 라우트
router.post('/portfolio-image', authenticateToken, upload.single('image'), savePortfolioImageController);
router.get('/portfolio-image', authenticateToken, getPortfolioImageController);  // 포트폴리오 이미지 조회
router.delete('/portfolio-image', authenticateToken, deletePortfolioImageController);  // 포트폴리오 이미지 삭제

module.exports = router;
