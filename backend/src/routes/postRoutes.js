const express = require("express");
const {
  createPost,
  getFeedPosts,
  getPostById,
  reactToPost,
  addPostComment,
  sharePost,
  toggleSavedPost,
  getSavedPosts,
} = require("../controllers/postController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/feed", optionalAuth, getFeedPosts);
router.get("/saved", protect, getSavedPosts);
router.post("/", optionalAuth, createPost);
router.get("/:postId", optionalAuth, getPostById);
router.post("/:postId/reactions", optionalAuth, reactToPost);
router.post("/:postId/comments", optionalAuth, addPostComment);
router.post("/:postId/share", optionalAuth, sharePost);
router.post("/:postId/save", protect, toggleSavedPost);

module.exports = router;
