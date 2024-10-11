// models/postModel.js
const pool = require('../config/db');

const createPost = async (postData) => {
  const { title, content, price, category, imageUrl, userId, type } = postData;
  const query = `
    INSERT INTO posts (title, content, price, category, image_url, user_id, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [title, content, price, category, imageUrl, userId, type]);
  return result;
};

//그냥 최신글 3개
const getLatestPosts = async () => {
  const query = `
    SELECT posts.*, users.nickname, users.department
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
    LIMIT 3
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// 해드립니다 또는 해주세요 게시글을 최신순으로 가져오기
const getPostsByType = async (category, type) => {
  const query = `
    SELECT posts.id, posts.title, posts.price, posts.created_at, posts.image_url, 
           users.nickname, COUNT(likes.id) AS likeCount
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.category = ? AND posts.type = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
  `;
  const [rows] = await pool.execute(query, [category, type]);
  return rows;
};

// 게시글 타입별 최신 2개 불러오기
const getLatestPostsByType = async (type) => {
    const query = `
      SELECT posts.*, users.nickname, users.department
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.type = ?
      ORDER BY posts.created_at DESC
      LIMIT 2
    `;
    const [rows] = await pool.execute(query, [type]);
    return rows;
  };

//분야별로 글 불러오기
const getPostsByCategory = async (category) => {
  const query = `
    SELECT posts.*, users.nickname, users.department
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.category = ?
    ORDER BY posts.created_at DESC
  `;
  const [rows] = await pool.execute(query, [category]);
  return rows;
};

// 공감수 기준 인기 게시글 3개 가져오기 (특정 카테고리에서)
const getTopLikedPostsByCategory = async (category) => {
  const query = `
    SELECT posts.*, COUNT(likes.id) AS likeCount
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.category = ?
    GROUP BY posts.id
    ORDER BY likeCount DESC
    LIMIT 3
  `;
  const [rows] = await pool.execute(query, [category]);
  return rows;
};

// 최신순으로 게시글 가져오기 (특정 카테고리에서)
const getLatestPostsByCategory = async (category) => {
  const query = `
    SELECT posts.id, posts.title, posts.content, posts.image_url, posts.price, posts.created_at,
           users.nickname, COUNT(likes.id) AS likeCount
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.category = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
  `;
  const [rows] = await pool.execute(query, [category]);
  return rows;
};

// 게시글 상세 정보를 ID로 가져오기
const getPostById = async (postId) => {
    const query = `
      SELECT posts.*, users.nickname, users.department,
             (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS likes
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = ?
    `;
    const [rows] = await pool.execute(query, [postId]);
    return rows[0];
  };

// 게시글 수정 함수
const updatePost = async (postId, userId, updatedData) => {
  const { title, content, price, category, imageUrl, type } = updatedData;
  const query = `
    UPDATE posts
    SET title = ?, content = ?, price = ?, category = ?, image_url = IFNULL(?, image_url), type = ?
    WHERE id = ? AND user_id = ?
  `;
  const [result] = await pool.execute(query, [title, content, price, category, imageUrl, type, postId, userId]);
  return result.affectedRows > 0;  // 수정된 행이 있는지 확인
};

// 게시글 삭제 함수
const deletePost = async (postId, userId) => {
  const query = `
    DELETE FROM posts
    WHERE id = ? AND user_id = ?
  `;
  const [result] = await pool.execute(query, [postId, userId]);
  return result.affectedRows > 0;
};
  
  // 댓글을 가져오기
  const getCommentsByPostId = async (postId) => {
    const query = `
      SELECT comments.*, users.nickname, users.department
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC
    `;
    const [rows] = await pool.execute(query, [postId]);
    return rows;
  };
  
  // 공감 추가
  const addLike = async (postId, userId) => {
    const query = `
      INSERT INTO likes (post_id, user_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE id = id -- 이미 공감한 경우 중복을 방지하기 위해 아무 작업도 하지 않음
    `;
    await pool.execute(query, [postId, userId]);
  };

  // 공감 취소
  const removeLike = async (postId, userId) => {
    const query = `DELETE FROM likes WHERE post_id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [postId, userId]);
    return result.affectedRows > 0;
  };

  // 제목이나 내용에서 검색어가 포함된 게시글 검색
  const searchPosts = async (keyword) => {
    console.log("모델 들어옴");
    const query = `
      SELECT posts.id, posts.title, posts.content, posts.price, posts.image_url,
            posts.created_at, users.nickname, COUNT(likes.id) AS likeCount
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN likes ON posts.id = likes.post_id
      WHERE posts.title LIKE ? OR posts.content LIKE ?
      GROUP BY posts.id
      ORDER BY posts.created_at DESC
    `;
    const likeKeyword = `%${keyword}%`;  // SQL에서 LIKE 검색을 위해 앞뒤에 % 추가
    const [rows] = await pool.execute(query, [likeKeyword, likeKeyword]);
    return rows;

    
  };

  // 카테고리별로 제목 또는 내용에서 검색어가 포함된 게시글 검색
const searchPostsByCategory = async (category, keyword) => {
  const query = `
    SELECT posts.id, posts.title, posts.content, posts.price, posts.image_url,
            posts.created_at, users.nickname, COUNT(likes.id) AS likeCount
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.category = ? AND (posts.title LIKE ? OR posts.content LIKE ?)
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
  `;
  const likeKeyword = `%${keyword}%`; // 검색어 앞뒤에 %를 추가하여 LIKE 쿼리에 맞춤
  const [rows] = await pool.execute(query, [category, likeKeyword, likeKeyword]);
  return rows;
};

module.exports = {
  createPost,
  getLatestPosts,
  getPostsByCategory,
  getLatestPostsByType,
  getPostById,
  getCommentsByPostId,
  addLike,
  deletePost,
  removeLike,
  updatePost,
  getTopLikedPostsByCategory,
  getLatestPostsByCategory,
  getPostsByType,
  searchPosts,
  searchPostsByCategory,
};
