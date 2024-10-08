const { addSkill, getSkills, getSkillById, deleteSkill } = require('../models/portfolioModel');

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

module.exports = {
  createSkill,
  getAllSkills,
  getSkill,
  removeSkill,
};
