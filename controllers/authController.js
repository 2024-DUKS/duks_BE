const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByStudentId, findUserById } = require('../models/userModel');
require('dotenv').config();

const register = async (req, res) => {
  const { name, studentId, password, nickname, department, phone } = req.body;

  // 비밀번호 유효성 검사
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: '비밀번호는 최소 8자, 영문과 숫자의 조합이어야 합니다.' });
  }

  try {
    // 학번 중복 체크
    const existingUser = await findUserByStudentId(studentId);
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용 중인 학번입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const newUser = {
      name,
      studentId,
      password: hashedPassword,
      nickname,
      department,
      phone,
    };
    await createUser(newUser);

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

const login = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    // 유저가 존재하는지 확인
    const user = await findUserByStudentId(studentId);
    if (!user) {
      return res.status(400).json({ message: '존재하지 않는 학번입니다.' });
    }

    // 비밀번호가 맞는지 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '비밀번호가 잘못되었습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id, studentId: user.studentId }, process.env.JWT_SECRET, {
      expiresIn: '1h', // 토큰 만료시간 1시간
    });

    res.status(200).json({ message: '로그인 성공', 
      token,
      userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 유저 정보 조회
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 필드별 유저 정보 조회
const getUserField = async (req, res) => {
  const field = req.params.field;
  const validFields = ['id', 'name', 'studentId', 'nickname', 'department', 'phone'];

  // 유효한 필드인지 확인
  if (!validFields.includes(field)) {
    return res.status(400).json({ message: `유효하지 않은 필드입니다. 유효한 필드: ${validFields.join(', ')}` });
  }

  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
    }

    // 특정 필드만 반환
    const result = { [field]: user[field] };
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

module.exports = {
  register,
  login,
  getUserDetails,
  getUserField, // 필드별 조회 함수 추가
};
