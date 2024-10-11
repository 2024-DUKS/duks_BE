// controllers/commentController.js
const { createComment, deleteComment, updateComment, getCommentsByPostId } = require('../models/commentModel');

const createNewComment = async (req, res) => {
  const { content, postId } = req.body;
  const userId = req.user.id; // 로그인된 사용자의 ID

  try {
    const commentData = { content, postId, userId };
    await createComment(commentData);
    res.status(201).json({ message: '댓글이 성공적으로 작성되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '댓글 작성 중 오류가 발생했습니다.' });
  }
};

const updateUserComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
  }

  try {
    const success = await updateComment(commentId, userId, content);
    if (!success) {
      return res.status(404).json({ message: '댓글을 찾을 수 없거나 권한이 없습니다.' });
    }

    res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '댓글 수정 중 오류가 발생했습니다.' });
  }
};

const deleteUserComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const success = await deleteComment(commentId, userId);
    if (!success) {
      return res.status(404).json({ message: '댓글을 찾을 수 없거나 권한이 없습니다.' });
    }

    res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다.' });
  }
};

// 특정 게시글에 달린 댓글 목록만 반환
const getCommentsForPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await getCommentsByPostId(postId);
    res.status(200).json(comments);  // 댓글 목록만 반환
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '댓글을 불러오는 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  createNewComment,
  deleteUserComment,
  updateUserComment,
  getCommentsForPost,
};
