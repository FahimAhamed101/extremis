const express = require("express");
const {
  getSettings,
  updateAccountSettings,
  updateNotificationSettings,
  updatePrivacySettings,
  updateBillingSettings,
  requestApiClient,
  revokeApiClient,
  closeAccount,
} = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getSettings);
router.patch("/account", updateAccountSettings);
router.patch("/notifications", updateNotificationSettings);
router.patch("/privacy", updatePrivacySettings);
router.patch("/billing", updateBillingSettings);
router.post("/api-clients", requestApiClient);
router.delete("/api-clients/:clientId", revokeApiClient);
router.post("/close-account", closeAccount);

module.exports = router;
