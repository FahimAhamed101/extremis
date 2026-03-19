const express = require("express");
const {
  createPost,
  getFeedPosts,
  togglePostLike,
  addPostComment,
  sharePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/feed", protect, getFeedPosts);
router.post("/", protect, createPost);
router.post("/:postId/like", protect, togglePostLike);
router.post("/:postId/comments", protect, addPostComment);
router.post("/:postId/share", protect, sharePost);

module.exports = router;
