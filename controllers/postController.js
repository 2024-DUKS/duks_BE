// controllers/postController.js
const { createPost, getLatestPostsByType, //getPostsByCategory, 
  getPostById, getCommentsByPostId, addLike, deletePost, removeLike, updatePost,
  getTopLikedPostsByCategory, getLatestPostsByCategory } = require('../models/postModel');


const createNewPost = async (req, res) => {
    const { title, content, price, category, type, imageUrl } = req.body;
    const userId = req.user.id; // 로그인된 사용자의 ID, authMiddleware에서 설정됨
  
    try {
      const postData = { title, content, price, category, type, imageUrl, userId };
      await createPost(postData);
      res.status(201).json({ message: '게시글이 성공적으로 생성되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '게시글 생성 중 오류가 발생했습니다.' });
    }
  };

const getMainPagePosts = async (req, res) => {
    try {
      // "해드립니다" 최신글 2개
      const offerPosts = await getLatestPostsByType('해드립니다');
      // "해주세요" 최신글 2개
      const requestPosts = await getLatestPostsByType('해주세요');
  
      res.status(200).json({
        offerPosts,  // "해드립니다" 게시글
        requestPosts // "해주세요" 게시글
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '게시글 로딩 중 오류가 발생했습니다.' });
    }
  };

  /*
const getCategoryPosts = async (req, res) => {
  const { category } = req.params;

  try {
    const posts = await getPostsByCategory(category);
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '카테고리 게시글 로딩 중 오류가 발생했습니다.' });
  }
};*/

const getPostsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    // 1. 공감순으로 인기 게시글 3개 가져오기
    const topLikedPosts = await getTopLikedPostsByCategory(category);

    // 2. 최신순으로 게시글 가져오기
    const latestPosts = await getLatestPostsByCategory(category);

    // 클라이언트로 데이터 반환
    res.status(200).json({
      topLikedPosts,  // 공감순으로 정렬된 인기 게시글 3개
      latestPosts,    // 최신순으로 정렬된 게시글
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글을 불러오는 중 오류가 발생했습니다.' });
  }
};

const getPostDetails = async (req, res) => {
    const { postId } = req.params;
  
    try {
      // 게시글 정보 불러오기
      const post = await getPostById(postId);
  
      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }
  
      // 댓글 불러오기
      const comments = await getCommentsByPostId(postId);
  
      res.status(200).json({ post, comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '게시글 로딩 중 오류가 발생했습니다.' });
    }
  };

  const likePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id; // 로그인된 사용자의 ID
  
    try {
      await addLike(postId, userId);
      res.status(200).json({ message: '게시글에 공감하였습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '공감 처리 중 오류가 발생했습니다.' });
    }
  };

  const unlikePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
  
    try {
      const success = await removeLike(postId, userId);
      if (!success) {
        return res.status(404).json({ message: '공감이 존재하지 않거나 취소할 수 없습니다.' });
      }
  
      res.status(200).json({ message: '공감이 성공적으로 취소되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '공감 취소 중 오류가 발생했습니다.' });
    }
  };

  const updateUserPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const updatedData = req.body;
  
    try {
      const success = await updatePost(postId, userId, updatedData);
      if (!success) {
        return res.status(404).json({ message: '게시글을 찾을 수 없거나 권한이 없습니다.' });
      }
  
      res.status(200).json({ message: '게시글이 성공적으로 수정되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '게시글 수정 중 오류가 발생했습니다.' });
    }
  };

  const deleteUserPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
  
    try {
      const success = await deletePost(postId, userId);
      if (!success) {
        return res.status(404).json({ message: '게시글을 찾을 수 없거나 권한이 없습니다.' });
      }
  
      res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '게시글 삭제 중 오류가 발생했습니다.' });
    }
  };
  
  

module.exports = {
  createNewPost,
  getMainPagePosts,
  //getCategoryPosts,
  getPostsByCategory,
  getPostDetails,
  likePost,
  unlikePost,
  deleteUserPost,
  updateUserPost,
};
