const express = require("express");
const Post = require("../models/Post");
const {
  createPost,
  getFeedPosts,
  getPostById,
  reactToPost,
  getPostReactions,
  addPostComment,
  sharePost,
  toggleSavedPost,
  getSavedPosts,
} = require("../controllers/postController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const isSaved = req.query.saved === "true" || req.query.saved === true;
    const query = isSaved ? { savedBy: { $exists: true, $ne: [] } } : {};
    const posts = await Post.find(query)
      .populate("author")
      .populate("comments.user")
      .populate("reactions.user")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/feed", optionalAuth, getFeedPosts);
router.get("/saved", optionalAuth, getSavedPosts);
router.post("/", optionalAuth, createPost);
router.get("/:postId", optionalAuth, getPostById);
router.get("/:postId/reactions", optionalAuth, getPostReactions);
router.post("/:postId/reactions", optionalAuth, reactToPost);
router.post("/:postId/comments", optionalAuth, addPostComment);
router.post("/:postId/share", optionalAuth, sharePost);
router.post("/:postId/save", optionalAuth, toggleSavedPost);

module.exports = router;
