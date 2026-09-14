const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("sender", "firstName lastName username avatarUrl")
      .populate("recipient", "firstName lastName username avatarUrl")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
