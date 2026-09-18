const express = require("express");
const {
  getActiveStream,
  listStreams,
  getStreamById,
  startStream,
  postChatMessage,
  endStream,
} = require("../controllers/liveStreamController");
const { optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/active", optionalAuth, getActiveStream);
router.get("/", optionalAuth, listStreams);
router.get("/:id", optionalAuth, getStreamById);
router.post("/start", optionalAuth, startStream);
router.post("/:id/chat", optionalAuth, postChatMessage);
router.post("/:id/end", optionalAuth, endStream);

module.exports = router;
