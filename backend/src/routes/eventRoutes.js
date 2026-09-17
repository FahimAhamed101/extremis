const express = require("express");
const { optionalAuth, protect } = require("../middleware/authMiddleware");
const {
  createEvent,
  getEventById,
  getEvents,
  rsvpEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", optionalAuth, getEvents);
router.post("/", protect, createEvent);
router.put("/:eventId/rsvp", protect, rsvpEvent);
router.get("/:eventId", optionalAuth, getEventById);

module.exports = router;
