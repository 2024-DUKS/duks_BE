const { 
    addSkill, 
    getSkills, 
    getSkillById, 
    deleteSkill,
    addCharactor,
    getCharactor,
    updateCharactor,
    deleteCharactor 
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
  
  // 전체 스킬 조회
  const getAllSkills = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const skills = await getSkills(userId);
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
        return res.status(404).json({ message: '스킬을 찾을 수 없습니다.' });
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
        return res.status(404).json({ message: 'Charactor를 찾을 수 없습니다.' });
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
        return res.status(404).json({ message: '수정할 Charactor가 없습니다.' });
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
        return res.status(404).json({ message: '삭제할 Charactor가 없습니다.' });
      }
  
      await deleteCharactor(userId);
      res.status(200).json({ message: 'Charactor가 삭제되었습니다.' });
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
    createCharactor,
    getUserCharactor,
    editCharactor,
    removeCharactor,
  };
  