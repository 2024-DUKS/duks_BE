const jwt = require('jsonwebtoken');
require('dotenv').config();

// 토큰 인증 미들웨어
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

    // 토큰 만료 시간 확인
    if (user.exp * 1000 < Date.now()) {
      return res.status(403).json({ message: '토큰이 만료되었습니다.' });
    }

    next();
  });
};

// 사용자의 권한 체크 미들웨어 (예: 관리자 권한이 필요한 경우)
const authorizeRoles = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: `이 작업을 수행하려면 ${requiredRole} 권한이 필요합니다.` });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
