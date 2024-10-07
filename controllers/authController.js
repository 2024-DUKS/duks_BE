// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByStudentId } = require('../models/userModel');
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
    //const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    const newUser = {
      name,
      studentId,
      password,//: hashedPassword,
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
  
      /* 비밀번호가 맞는지 확인
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: '비밀번호가 잘못되었습니다.' });
      }*/

      // 입력된 비밀번호가 데이터베이스에 저장된 비밀번호와 일치하는지 확인
      if (user.password !== password) {
        return res.status(400).json({ message: '학번 또는 비밀번호가 잘못되었습니다.' });
      }
  
      // JWT 토큰 생성
      const token = jwt.sign({ id: user.id, studentId: user.studentId }, process.env.JWT_SECRET, {
        expiresIn: '1h', // 토큰 만료시간 1시간
      });
  
      res.status(200).json({ message: '로그인 성공', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  };
  
  module.exports = {
    register,
    login,
  };