const path = require('path');
const fs = require('fs');
const { 
  addSkill, 
  getSkills, 
  getSkillById, 
  deleteSkill,
  addCharactor,
  getCharactor,
  updateCharactor,
  deleteCharactor,
  addFolioImg, 
  getFolioImg, 
  updateFolioImg, 
  deleteFolioImg,
  addPortfolioImage2,
  getPortfolioImages2,
  updatePortfolioImage2,
  deletePortfolioImage2,
  addCharactor2,   // 추가된 함수들
  getCharactor2,   // 추가된 함수들
  updateCharactor2, // 추가된 함수들
  deleteCharactor2,
  findUserById,
    // 추가된 함수들
} = require('../models/portfolioModel');

// 스킬 추가
const createSkill = async (req, res) => {
  const { skill, level } = req.body;
  const userId = req.user.id;

  try {
    await addSkill(userId, skill, level);
    res.status(201).json({ message: '스킬이 추가되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 유저의 전체 포트폴리오 조회
const getUserPortfolio = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    const skills = await getSkills(userId);
    const charactor = await getCharactor(userId);
    const charactor2 = await getCharactor2(userId);
    const portfolioImages = await getPortfolioImages2(userId);
    const folioImg = await getFolioImg(userId);

    res.status(200).json({
      user: {
        name: user.name,
        phone: user.phone,
        department: user.department,
        nickname: user.nickname,
      },
      skills,
      charactor,
      charactor2,
      portfolioImages,
      profileImage: folioImg ? folioImg.imagePath : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 전체 스킬 조회
const getAllSkills = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const skills = await getSkills(userId);
    if (!skills || skills.length === 0) {
      return res.status(400).json({ message: '등록된 스킬이 없습니다.' });
    }
    res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 스킬 조회
const getSkill = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const skill = await getSkillById(userId, id);
    if (!skill) {
      return res.status(400).json({ message: '스킬을 찾을 수 없습니다.' });
    }
    res.status(200).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 스킬 삭제
const removeSkill = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    await deleteSkill(userId, id);
    res.status(200).json({ message: '스킬이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// Charactor 추가
const createCharactor = async (req, res) => {
  const { charactor } = req.body;
  const userId = req.user.id;

  try {
    const existingCharactor = await getCharactor(userId);
    if (existingCharactor) {
      return res.status(400).json({ message: '이미 charactor가 존재합니다.' });
    }

    await addCharactor(userId, charactor);
    res.status(201).json({ message: 'Charactor가 추가되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// Charactor 조회
const getUserCharactor = async (req, res) => {
  const userId = req.user.id;

  try {
    const charactor = await getCharactor(userId);
    if (!charactor) {
      return res.status(400).json({ message: 'Charactor를 찾을 수 없습니다.' });
    }
    res.status(200).json(charactor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// Charactor 수정
const editCharactor = async (req, res) => {
  const { charactor } = req.body;
  const userId = req.user.id;

  try {
    const existingCharactor = await getCharactor(userId);
    if (!existingCharactor) {
      return res.status(400).json({ message: '수정할 Charactor가 없습니다.' });
    }

    await updateCharactor(userId, charactor);
    res.status(200).json({ message: 'Charactor가 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// Charactor 삭제
const removeCharactor = async (req, res) => {
  const userId = req.user.id;

  try {
    const existingCharactor = await getCharactor(userId);
    if (!existingCharactor) {
      return res.status(400).json({ message: '삭제할 Charactor가 없습니다.' });
    }

    await deleteCharactor(userId);
    res.status(200).json({ message: 'Charactor가 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// folioImg 추가
const uploadFolioImg = async (req, res) => {
  const userId = req.user.id;

  try {
    const imagePath = req.file.path;
    await addFolioImg(userId, imagePath);
    res.status(201).json({ message: '이미지가 추가되었습니다.', imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// folioImg 조회
const getUserFolioImg = async (req, res) => {
  const userId = req.user.id;

  try {
    const folioImg = await getFolioImg(userId);
    if (!folioImg) {
      return res.status(400).json({ message: '이미지가 없습니다.' });
    }
    res.status(200).json({
      id: folioImg.id,
      imagePath: folioImg.imagePath,  // 이미지 경로와 ID를 반환
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// folioImg 수정
const editFolioImg = async (req, res) => {
  const userId = req.user.id;

  try {
    const oldImg = await getFolioImg(userId);
    if (!oldImg) {
      return res.status(400).json({ message: '수정할 이미지가 없습니다.' });
    }

    const newImagePath = req.file.path;

    // 기존 이미지 파일 삭제
    if (oldImg.imagePath) {
      fs.unlinkSync(path.resolve(oldImg.imagePath));
    }

    await updateFolioImg(userId, newImagePath);
    res.status(200).json({ message: '이미지가 수정되었습니다.', newImagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// folioImg 삭제
const removeFolioImg = async (req, res) => {
  const userId = req.user.id;

  try {
    const existingImg = await getFolioImg(userId);
    if (!existingImg) {
      return res.status(400).json({ message: '삭제할 이미지가 없습니다.' });
    }

    // 기존 이미지 파일 삭제
    fs.unlinkSync(path.resolve(existingImg.imagePath));

    await deleteFolioImg(userId);
    res.status(200).json({ message: '이미지가 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// portfolioImages2 추가 (여러 이미지 추가)
const uploadPortfolioImages2 = async (req, res) => {
  const userId = req.user.id;

  try {
    const files = req.files;  // req.files는 여러 파일을 받을 수 있습니다.

    if (!files || files.length === 0) {
      return res.status(400).json({ message: '이미지를 업로드하세요.' });
    }

    const existingImages = await getPortfolioImages2(userId);
    if (existingImages.length + files.length > 10) {
      return res.status(400).json({ message: '최대 10장의 이미지만 업로드할 수 있습니다.' });
    }

    for (const file of files) {
      const imagePath = file.path;
      await addPortfolioImage2(userId, imagePath);
    }

    res.status(201).json({ message: '이미지가 추가되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// portfolioImages2 조회
const getUserPortfolioImages2 = async (req, res) => {
  const userId = req.user.id;

  try {
    const images = await getPortfolioImages2(userId);
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// portfolioImages2 수정
const editPortfolioImage2 = async (req, res) => {
  const userId = req.user.id;
  const imageId = req.params.id;

  try {
    const newImagePath = req.file.path;
    await updatePortfolioImage2(userId, imageId, newImagePath);
    res.status(200).json({ message: '포트폴리오 이미지가 수정되었습니다.', newImagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// portfolioImages2 전체 삭제
const removeAllPortfolioImages2 = async (req, res) => {
  const userId = req.user.id;

  try {
    const images = await getPortfolioImages2(userId);

    if (!images || images.length === 0) {
      return res.status(400).json({ message: '삭제할 이미지가 없습니다.' });
    }

    for (const image of images) {
      fs.unlinkSync(path.resolve(image.imagePath));
      await deletePortfolioImage2(userId, image.id);  // 데이터베이스에서 삭제
    }

    res.status(200).json({ message: '모든 이미지가 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Charactor2 추가
const createCharactor2 = async (req, res) => {
  const { charactor2 } = req.body;
  const userId = req.user.id;

  try {
    await addCharactor2(userId, charactor2);
    res.status(201).json({ message: 'Charactor2가 추가되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// Charactor2 조회
const getUserCharactor2 = async (req, res) => {
  const userId = req.user.id;

  try {
    const charactor2 = await getCharactor2(userId);
    if (!charactor2) {
      return res.status(400).json({ message: 'Charactor2를 찾을 수 없습니다.' });
    }
    res.status(200).json(charactor2);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// Charactor2 수정
const editCharactor2 = async (req, res) => {
  const { charactor2 } = req.body;
  const userId = req.user.id;

  try {
    await updateCharactor2(userId, charactor2);
    res.status(200).json({ message: 'Charactor2가 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// Charactor2 삭제
const removeCharactor2 = async (req, res) => {
  const userId = req.user.id;

  try {
    await deleteCharactor2(userId);
    res.status(200).json({ message: 'Charactor2가 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  createSkill,
  getAllSkills,
  getSkill,
  removeSkill,
  getUserPortfolio,
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
  createCharactor2,  // 반드시 module.exports에 포함되어 있어야 합니다.
  getUserCharactor2,
  editCharactor2,
  removeCharactor2  
};
