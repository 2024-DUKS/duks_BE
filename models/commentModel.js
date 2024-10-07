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

module.exports = {
  createComment,
  deleteComment,
  updateComment,
};
