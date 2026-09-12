const express = require("express");
const {
  getDiscoverPeople,
  getMyProfile,
  getProfileById,
  getNearbyPeople,
  toggleFollowUser,
  updateMyProfile,
} = require("../controllers/profileController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);
router.get("/discover/people", protect, getDiscoverPeople);
router.get("/nearby", optionalAuth, getNearbyPeople);
router.post("/:userId/follow", protect, toggleFollowUser);
router.get("/:userId", protect, getProfileById);

module.exports = router;
