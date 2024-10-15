const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // CORS 모듈 추가
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes'); // 댓글 라우터 추가
const mysql = require('mysql2/promise');
const portfolioRoutes = require('./routes/portfolioRoutes');
const multer = require('multer'); // Multer for file uploads
const path = require('path');

// 환경변수 파일 로드
dotenv.config();

const app = express();

// CORS 설정 추가 (React 앱의 주소로부터 오는 요청을 허용)
app.use(cors({
    origin: 'http://localhost:3000', // React 앱이 돌아가는 주소
    credentials: true // 쿠키나 인증 정보 전송을 허용
}));

// Multer 설정: 이미지 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 이미지가 저장될 폴더
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // 파일명 설정 (현재 시간 + 원래 파일명)
  }
});

const upload = multer({ storage });

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
  // portfolios 테이블이 없으면 생성
  await connection.query(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      skill VARCHAR(100) NOT NULL,
      level ENUM('상', '중', '하') NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // charactors 테이블이 없으면 생성
  await connection.query(`
    CREATE TABLE IF NOT EXISTS charactors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      charactor TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  // folioImgs 테이블이 없으면 생성
  await connection.query(`
    CREATE TABLE IF NOT EXISTS folioImgs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      imagePath VARCHAR(255) NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('Database tables created or already exist.');
  connection.end(); // 연결 종료
}

// JSON 바디 파싱
app.use(express.json());

// 정적 파일 경로 설정 (이미지 파일을 전송하기 위해)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes); // 댓글 라우터 경로 추가
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/portfolio', portfolioRoutes);

// 서버 실행 및 DB 초기화
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase(); // DB 초기화 함수 실행
});
