// controllers/postController.js
const { createPost, getLatestPostsByType, //getPostsByCategory, 
  getPostById, getCommentsByPostId, addLike, deletePost, removeLike, updatePost,
  getTopLikedPostsByCategory, getLatestPostsByCategory, getPostsByType, searchPosts, 
  searchPostsByCategory, hasUserLikedPost, searchOfferPosts, searchRequestPosts,
  searchOfferPostsByCategory, searchRequestPostsByCategory, getLikedPostsByUserId,
  getPostsByUserId, getLikedOfferPostsByUserId, getLikedRequestPostsByUserId,
  getUserOfferPosts, getUserRequestPosts, } = require('../models/postModel');


  const createNewPost = async (req, res) => {
    const { title, content, price, category, type } = req.body;  // 여기서 type도 받아옴
    const userId = req.user.id;
    
    // 여러 개의 이미지 파일 처리
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`).join(',');  // 쉼표로 구분된 이미지 경로

    try {
        const postData = {
            title,
            content,
            price,
            category,
            imageUrl: imageUrls,
            userId,
            type  // type 값 추가
        };

        await createPost(postData);
        res.status(201).json({ message: '게시글이 성공적으로 작성되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '게시글 작성 중 오류가 발생했습니다.' });
    }
};

module.exports = {
    createNewPost,
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
  const { type } = req.query;  // 쿼리 파라미터로 type을 받음 ("해드립니다" 또는 "해주세요")

  try {
      // 공감순으로 인기 게시글 3개 가져오기
      const topLikedPosts = await getTopLikedPostsByCategory(category);

      // 기본적으로 "해드립니다" 게시글을 최신순으로 가져오기
      const posts = await getPostsByType(category, type || '해드립니다');  // 기본은 "해드립니다"

      // 클라이언트로 데이터 반환
      res.status(200).json({
          topLikedPosts,  // 공감순으로 정렬된 인기 게시글 3개
          posts           // 최신순으로 정렬된 게시글 ("해드립니다" 또는 "해주세요")
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: '게시글을 불러오는 중 오류가 발생했습니다.' });
  }
};

const getPostDetails = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user ? req.user.id : null;  // 로그인한 유저 정보가 있을 경우

  try {
      const post = await getPostById(postId);

      if (!post) {
          return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }

      // 이미지 경로가 쉼표로 구분된 문자열이라면 배열로 변환
      const imageUrls = post.image_url ? post.image_url.split(',') : [];

      const comments = await getCommentsByPostId(postId);

      // 3. 사용자가 이미 공감했는지 확인
      const isLiked = userId ? await hasUserLikedPost(postId, userId) : false;

      res.status(200).json({
          ...post,
          imageUrls,  // 이미지 배열 추가
          comments,
          isLiked,
      });
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
    const { title, content, price, category, type } = req.body;  // body에서 가져옴
    const userId = req.user.id;
    
    // 이미지 처리
    const imageUrls = req.files.length > 0 ? req.files.map(file => `/uploads/${file.filename}`).join(',') : null;  // 새로운 이미지가 있는 경우 처리

    try {
        const postData = {
            title,
            content,
            price,
            category,
            imageUrl: imageUrls ? imageUrls : undefined,  // 이미지가 있는 경우에만 처리
            userId,  // JWT에서 가져온 userId
            type  // type 필드 저장
        };

        const success = await updatePost(req.params.postId, userId, postData);
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

const searchForPosts = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  try {
    const posts = await searchPosts(keyword);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '검색 중 오류가 발생했습니다.' });
  }
};

// "해드립니다" 게시글 검색
const searchOfferPostsController = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  try {
    const posts = await searchOfferPosts(keyword);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글 검색 중 오류가 발생했습니다.' });
  }
};

// "해주세요" 게시글 검색
const searchRequestPostsController = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  try {
    const posts = await searchRequestPosts(keyword);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글 검색 중 오류가 발생했습니다.' });
  }
};

const searchCategoryPosts = async (req, res) => {
  const { category } = req.params; // URL에서 카테고리 추출
  const { keyword } = req.query; // 쿼리 파라미터에서 검색어 추출

  if (!keyword) {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  try {
    // 카테고리 내에서 검색어가 포함된 게시글 검색
    const posts = await searchPostsByCategory(category, keyword);

    res.status(200).json(posts); // 검색 결과를 클라이언트로 반환
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '검색 중 오류가 발생했습니다.' });
  }
};

// "해드립니다" 게시글을 카테고리별로 검색 (공감수 포함)
const searchOfferPostsByCategoryController = async (req, res) => {
  const { category } = req.params;  // URL 경로 파라미터로 카테고리 받기
  const { keyword } = req.query;    // 쿼리 파라미터로 검색어 받기

  if (!keyword) {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  try {
    const posts = await searchOfferPostsByCategory(keyword, category);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글 검색 중 오류가 발생했습니다.' });
  }
};

// "해주세요" 게시글을 카테고리별로 검색 (공감수 포함)
const searchRequestPostsByCategoryController = async (req, res) => {
  const { category } = req.params;  // URL 경로 파라미터로 카테고리 받기
  const { keyword } = req.query;    // 쿼리 파라미터로 검색어 받기

  if (!keyword) {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  try {
    const posts = await searchRequestPostsByCategory(keyword, category);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '게시글 검색 중 오류가 발생했습니다.' });
  }
};

const getLikedPosts = async (req, res) => {
  const userId = req.user.id; // 로그인한 유저의 ID

  try {
    const likedPosts = await getLikedPostsByUserId(userId);
    
    // 디버깅: likedPosts를 콘솔에 출력
    console.log('Liked Posts:', likedPosts); 

    if (likedPosts.length === 0) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json(likedPosts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: '게시글 정보를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 로그인한 유저가 작성한 게시글 가져오기
const getUserPosts = async (req, res) => {
  const userId = req.user.id; // JWT로부터 가져온 로그인된 유저의 ID

  try {
    const userPosts = await getPostsByUserId(userId);
    
    // 유저가 작성한 게시글이 없을 경우
    if (userPosts.length === 0) {
      return res.status(404).json({ message: '작성한 게시글이 없습니다.' });
    }

    res.status(200).json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: '게시글 정보를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 공감한 "해드립니다" 게시글 가져오기
const getLikedOfferPosts = async (req, res) => {
  const userId = req.user.id; // JWT로부터 로그인한 유저 ID 추출

  try {
    const likedPosts = await getLikedOfferPostsByUserId(userId);
    res.status(200).json(likedPosts);
  } catch (error) {
    console.error('Error fetching liked offer posts:', error);
    res.status(500).json({ message: '게시글 정보를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 공감한 "해주세요" 게시글 가져오기
const getLikedRequestPosts = async (req, res) => {
  const userId = req.user.id; // JWT로부터 로그인한 유저 ID 추출

  try {
    const likedPosts = await getLikedRequestPostsByUserId(userId);
    res.status(200).json(likedPosts);
  } catch (error) {
    console.error('Error fetching liked request posts:', error);
    res.status(500).json({ message: '게시글 정보를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 유저가 작성한 "해드립니다" 게시글 가져오기
const getUserOfferPostsController = async (req, res) => {
  const userId = req.user.id;

  try {
    const userPosts = await getUserOfferPosts(userId);
    res.status(200).json(userPosts);
  } catch (error) {
    console.error('Error fetching user offer posts:', error);
    res.status(500).json({ message: '게시글 정보를 가져오는 중 오류가 발생했습니다.' });
  }
};

// 유저가 작성한 "해주세요" 게시글 가져오기
const getUserRequestPostsController = async (req, res) => {
  const userId = req.user.id;

  try {
    const userPosts = await getUserRequestPosts(userId);
    res.status(200).json(userPosts);
  } catch (error) {
    console.error('Error fetching user request posts:', error);
    res.status(500).json({ message: '게시글 정보를 가져오는 중 오류가 발생했습니다.' });
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
  searchForPosts,
  searchCategoryPosts,
  searchOfferPostsController,
  searchRequestPostsController,
  searchOfferPostsByCategoryController,
  searchRequestPostsByCategoryController,
  getLikedPosts,
  getUserPosts,
  getLikedOfferPosts,
  getLikedRequestPosts,
  getUserOfferPostsController,
  getUserRequestPostsController,
};