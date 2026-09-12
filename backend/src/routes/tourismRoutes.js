const express = require("express");
const {
  getTourismPlaces,
  getTourismPlaceById,
  createTourismPlace,
  updateTourismPlace,
  deleteTourismPlace,
} = require("../controllers/tourismController");
const { protect, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", optionalAuth, getTourismPlaces);
router.get("/:id", optionalAuth, getTourismPlaceById);
router.post("/", protect, createTourismPlace);
router.put("/:id", protect, updateTourismPlace);
router.delete("/:id", protect, deleteTourismPlace);

module.exports = router;
