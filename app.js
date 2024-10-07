const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes'); // 댓글 라우터 추가
const mysql = require('mysql2/promise');

// 환경변수 파일 로드
dotenv.config();

const app = express();

// MySQL 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// 데이터베이스 연결 및 테이블 생성
async function initializeDatabase() {
  const connection = await mysql.createConnection(dbConfig);

  // users 테이블이 없으면 생성
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      studentId INT NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(50),
      department VARCHAR(100),
      phone VARCHAR(20)
    );
  `);

  console.log('users table created or already exists.');
  connection.end(); // 연결 종료
}

// JSON 바디 파싱
app.use(express.json());

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes); // 댓글 라우터 경로 추가
app.use('/api/users', userRoutes);

// 서버 실행 및 DB 초기화
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
