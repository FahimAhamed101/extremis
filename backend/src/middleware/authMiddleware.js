const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const authorization = String(req.headers.authorization || "").trim();

    if (!authorization.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    const token = authorization.slice(7).trim();
    if (!token) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is missing. Add it to your environment variables.");
    }

    const decoded = jwt.verify(token, secret);
    const userId = decoded && typeof decoded === "object" ? decoded.sub : null;

    if (!userId) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({ message: "User session is no longer valid." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error && (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")) {
      res.status(401).json({ message: "Your session has expired. Please sign in again." });
      return;
    }

    next(error);
  }
}

module.exports = {
  protect,
};
