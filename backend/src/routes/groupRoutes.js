const express = require("express");
const {
  createGroup,
  getMyGroups,
  getDiscoverGroups,
  getGroupById,
  getGroupPosts,
  joinGroup,
  leaveGroup,
} = require("../controllers/groupController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createGroup);
router.get("/me", optionalAuth, getMyGroups);
router.get("/discover", optionalAuth, getDiscoverGroups);
router.get("/posts", protect, getGroupPosts);
router.get("/:groupId", optionalAuth, getGroupById);
router.post("/:groupId/join", protect, joinGroup);
router.post("/:groupId/leave", protect, leaveGroup);

module.exports = router;

