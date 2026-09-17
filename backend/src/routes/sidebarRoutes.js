const express = require("express");
const { optionalAuth, protect } = require("../middleware/authMiddleware");
const { getSidebarSponsors } = require("../controllers/sidebarController");
const { getSidebarPeople } = require("../controllers/profileController");

const router = express.Router();

router.get("/sponsors", optionalAuth, getSidebarSponsors);
router.get("/people", protect, getSidebarPeople);

module.exports = router;
