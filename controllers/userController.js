// models/userModel에서 필요한 함수 임포트
const { findUserByStudentId, updateUserByStudentId } = require('../models/userModel');

// 사용자 정보 조회
const getUser = async (req, res) => {
  const studentId = req.user.studentId;
  const requestedFields = req.query.fields ? req.query.fields.split(',') : null;

  try {
    const user = await findUserByStudentId(studentId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 특정 필드만 반환하는 로직
    if (requestedFields) {
      const filteredUser = {};
      requestedFields.forEach((field) => {
        if (user[field]) {
          filteredUser[field] = user[field];
        }
      });

      if (Object.keys(filteredUser).length === 0) {
        return res.status(400).json({ message: 'Invalid fields requested' });
      }

      return res.json(filteredUser);
    }

    // 요청된 필드가 없으면 전체 데이터 반환
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 사용자 정보 업데이트
const updateUserInfo = async (req, res) => {
  const studentId = req.user.studentId;
  const updatedFields = req.body;

  try {
    const updatedUser = await updateUserByStudentId(studentId, updatedFields);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUser,
  updateUserInfo,
};
