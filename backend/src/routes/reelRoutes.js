const express = require("express");
const Reel = require("../models/Reel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("author", "firstName lastName username avatarUrl")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const reel = new Reel(req.body);
    await reel.save();
    res.status(201).json(reel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
