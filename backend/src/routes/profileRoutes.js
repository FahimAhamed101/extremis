const express = require("express");
const {
  getDiscoverPeople,
  getMyProfile,
  getProfileById,
  getNearbyPeople,
  toggleFollowUser,
  updateMyProfile,
  inviteColleague,
} = require("../controllers/profileController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateMyProfile);
router.get("/discover/people", optionalAuth, getDiscoverPeople);
router.get("/nearby", optionalAuth, getNearbyPeople);
router.post("/invite-colleague", optionalAuth, inviteColleague);
router.post("/:userId/follow", protect, toggleFollowUser);
router.get("/:userId", optionalAuth, getProfileById);

module.exports = router;
