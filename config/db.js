const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 데이터베이스 초기화 함수
async function initializeDatabase() {
  const connection = await pool.getConnection();

  try {
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

    console.log('Database tables initialized.');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  } finally {
    connection.release(); // 연결 해제
  }
}

// 데이터베이스 초기화 실행
initializeDatabase();

module.exports = pool;
