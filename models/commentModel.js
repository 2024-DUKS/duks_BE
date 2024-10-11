// models/commentModel.js
const pool = require('../config/db');

const createComment = async (commentData) => {
  const { content, postId, userId } = commentData;
  const query = `
    INSERT INTO comments (content, post_id, user_id)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [content, postId, userId]);
  return result;
};

// 댓글 수정
const updateComment = async (commentId, userId, content) => {
  const query = `
    UPDATE comments
    SET content = ?
    WHERE id = ? AND user_id = ?
  `;
  const [result] = await pool.execute(query, [content, commentId, userId]);
  return result.affectedRows > 0; // 수정된 행이 있는지 확인
};

// 댓글 삭제
const deleteComment = async (commentId, userId) => {
  const query = `DELETE FROM comments WHERE id = ? AND user_id = ?`;
  const [result] = await pool.execute(query, [commentId, userId]);
  return result.affectedRows > 0;
};

// 게시글 ID로 해당 게시글의 댓글들을 가져오기 (닉네임, 학과, 작성 시간 포함)
const getCommentsByPostId = async (postId) => {
  const query = `
    SELECT comments.id, comments.content, comments.created_at, users.nickname, users.department
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `;
  const [rows] = await pool.execute(query, [postId]);
  return rows;
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
  getCommentsByPostId,
};
