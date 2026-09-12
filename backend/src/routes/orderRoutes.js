const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrderById,
  getMyOrders,
} = require("../controllers/orderController");

// Optional auth helper: attaches user if valid token present, allows guest checkout otherwise
async function optionalAuth(req, res, next) {
  try {
    const authorization = String(req.headers.authorization || "").trim();
    if (authorization.startsWith("Bearer ")) {
      const token = authorization.slice(7).trim();
      if (token) {
        const secret = generateToken.getJwtSecret();
        const decoded = jwt.verify(token, secret);
        const userId = decoded && typeof decoded === "object" ? decoded.sub : null;
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            req.user = user;
          }
        }
      }
    }
  } catch {
    // optional auth failure continues as guest
  }
  next();
}

const router = express.Router();

router.post("/", optionalAuth, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;
