const express = require("express");
const {
  getMyProfile,
  getProfileById,
  toggleFollowUser,
  updateMyProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);
router.post("/:userId/follow", protect, toggleFollowUser);
router.get("/:userId", protect, getProfileById);

module.exports = router;
