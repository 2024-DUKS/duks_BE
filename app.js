// app.js

const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const { createTables } = require('./config/db'); // 테이블 생성 함수 가져오기

// 환경변수 파일 로드
dotenv.config();

const app = express();

// JSON 바디 파싱
app.use(express.json());

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', portfolioRoutes);

// 서버 실행 및 DB 초기화
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createTables(); // 테이블 생성 함수 호출
});
