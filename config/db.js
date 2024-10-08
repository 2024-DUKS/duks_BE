// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL 연결 생성 함수
const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
};

// 테이블 생성 함수
const createTables = async () => {
  const connection = await createConnection();
  try {
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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS abilities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        skill VARCHAR(100) NOT NULL,
        level VARCHAR(10),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS charactors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        text VARCHAR(255),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('All necessary tables created or already exist.');
  } finally {
    await connection.end(); // 연결 닫기
  }
};

module.exports = {
  createConnection,  // 연결 생성 함수 내보내기
  createTables
};
