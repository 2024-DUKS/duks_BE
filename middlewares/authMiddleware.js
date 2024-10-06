// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  // 요청 헤더에서 Authorization 헤더 확인
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰에서 토큰만 추출

  if (!token) {
    return res.status(401).json({ message: '토큰이 없습니다. 인증이 필요합니다.' });
  }

  // 토큰 검증
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // 토큰이 유효하면 사용자 정보를 req.user에 저장
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
