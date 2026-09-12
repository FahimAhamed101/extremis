const express = require("express");
const { optionalAuth, protect } = require("../middleware/authMiddleware");
const {
  getStories,
  createStory,
  viewStory,
  deleteStory,
} = require("../controllers/storyController");

const router = express.Router();

router.get("/", optionalAuth, getStories);
router.post("/", optionalAuth, createStory);
router.post("/:id/view", optionalAuth, viewStory);
router.delete("/:id", protect, deleteStory);

module.exports = router;
