const express = require("express");
const {
  getAds,
  updateAds,
  addSponsor,
  updateSponsor,
  deleteSponsor,
  uploadAdImage,
} = require("../controllers/adController");

const router = express.Router();

router.get("/", getAds);
router.put("/", updateAds);
router.post("/sponsors", addSponsor);
router.put("/sponsors/:id", updateSponsor);
router.delete("/sponsors/:id", deleteSponsor);
router.post("/upload", uploadAdImage);

module.exports = router;
