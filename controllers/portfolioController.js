// controllers/portfolioController.js
const { addAbility, getAbilities, deleteAbility, addCharactor, getCharactors, deleteCharactor, savePortfolioImage, deletePortfolioImage, getPortfolioImage } = require('../models/portfolioModel');

const addAbilityController = async (req, res) => {
  const { skill, level } = req.body;
  const userId = req.user.id;

  try {
    await addAbility(userId, skill, level);
    res.status(201).json({ message: '능력이 추가되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '능력 추가 중 오류가 발생했습니다.' });
  }
};

const getAbilitiesController = async (req, res) => {
  const userId = req.user.id;

  try {
    const abilities = await getAbilities(userId);
    res.status(200).json(abilities);
  } catch (error) {
    res.status(500).json({ message: '능력 조회 중 오류가 발생했습니다.' });
  }
};

const deleteAbilityController = async (req, res) => {
  const { skill } = req.params;
  const userId = req.user.id;

  try {
    await deleteAbility(userId, skill);
    res.status(200).json({ message: '능력이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '능력 삭제 중 오류가 발생했습니다.' });
  }
};

// charactor 관련 컨트롤러
const addCharactorController = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  try {
    await addCharactor(userId, text);
    res.status(201).json({ message: '문자가 추가되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '문자 추가 중 오류가 발생했습니다.' });
  }
};

const getCharactorsController = async (req, res) => {
  const userId = req.user.id;

  try {
    const charactors = await getCharactors(userId);
    res.status(200).json(charactors);
  } catch (error) {
    res.status(500).json({ message: '문자 조회 중 오류가 발생했습니다.' });
  }
};

const deleteCharactorController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await deleteCharactor(userId, id);
    res.status(200).json({ message: '문자가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '문자 삭제 중 오류가 발생했습니다.' });
  }
};

// 포트폴리오 이미지 저장 컨트롤러
const savePortfolioImageController = async (req, res) => {
  const userId = req.user.id;
  const imagePath = req.file.path;

  try {
    await savePortfolioImage(userId, imagePath);
    res.status(201).json({ message: '포트폴리오 이미지가 저장되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '포트폴리오 이미지 저장 중 오류가 발생했습니다.' });
  }
};

// 포트폴리오 이미지 조회 컨트롤러
const getPortfolioImageController = async (req, res) => {
  const userId = req.user.id;

  try {
    const portfolioImage = await getPortfolioImage(userId);
    if (!portfolioImage) {
      return res.status(404).json({ message: '포트폴리오 이미지가 존재하지 않습니다.' });
    }

    res.status(200).json({ portfolioImage });
  } catch (error) {
    res.status(500).json({ message: '포트폴리오 이미지 조회 중 오류가 발생했습니다.' });
  }
};

// 포트폴리오 이미지 삭제 컨트롤러
const deletePortfolioImageController = async (req, res) => {
  const userId = req.user.id;

  try {
    await deletePortfolioImage(userId);
    res.status(200).json({ message: '포트폴리오 이미지가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '포트폴리오 이미지 삭제 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  addAbilityController,
  getAbilitiesController,
  deleteAbilityController,
  addCharactorController,
  getCharactorsController,
  deleteCharactorController,
  savePortfolioImageController,  // 포트폴리오 이미지 저장
  deletePortfolioImageController,  // 포트폴리오 이미지 삭제
  getPortfolioImageController,     // 포트폴리오 이미지 조회
};
