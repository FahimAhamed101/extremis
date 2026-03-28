const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const toPublicUser = require("../utils/toPublicUser");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeOptionalUrl(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return null;
  }

  try {
    return new URL(normalized).toString();
  } catch {
    return null;
  }
}

function getRequestBody(req) {
  if (!req || req.body == null) {
    return {};
  }

  if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString("utf8"));
    } catch {
      return {};
    }
  }

  if (typeof req.body === "string") {
    const rawBody = req.body.trim();
    if (!rawBody) {
      return {};
    }

    try {
      return JSON.parse(rawBody);
    } catch {
      return {};
    }
  }

  return {};
}

async function signup(req, res, next) {
  try {
    const body = getRequestBody(req);
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const researcherType = String(body.researcherType || "").trim();
    const institute = String(body.institute || "").trim();
    const department = String(body.department || "").trim();
    const position = String(body.position || "").trim();
    const gender = String(body.gender || "").trim();
    const termsAccepted = Boolean(body.termsAccepted);

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "First name, last name, email, and password are required." });
      return;
    }

    if (!isEmailValid(email)) {
      res.status(400).json({ message: "Please enter a valid email address." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters long." });
      return;
    }

    if (!termsAccepted) {
      res.status(400).json({ message: "You must accept the terms to continue." });
      return;
    }

    generateToken.getJwtSecret();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      researcherType: researcherType || null,
      institute: institute || null,
      department: department || null,
      position: position || null,
      gender: gender || null,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      message: "Signup successful.",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const body = getRequestBody(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    generateToken.getJwtSecret();
    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful.",
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    res.status(200).json({
      user: toPublicUser(req.user),
    });
  } catch (error) {
    next(error);
  }
}

async function updateCurrentUser(req, res, next) {
  try {
    const body = getRequestBody(req);
    const hasAvatarUrl = Object.prototype.hasOwnProperty.call(body, "avatarUrl");
    const hasCoverImageUrl = Object.prototype.hasOwnProperty.call(body, "coverImageUrl");

    if (!hasAvatarUrl && !hasCoverImageUrl) {
      res.status(400).json({ message: "No profile media fields were provided." });
      return;
    }

    if (hasAvatarUrl) {
      const avatarUrl = normalizeOptionalUrl(body.avatarUrl);
      if (body.avatarUrl && !avatarUrl) {
        res.status(400).json({ message: "Avatar URL must be a valid URL." });
        return;
      }

      req.user.avatarUrl = avatarUrl;
    }

    if (hasCoverImageUrl) {
      const coverImageUrl = normalizeOptionalUrl(body.coverImageUrl);
      if (body.coverImageUrl && !coverImageUrl) {
        res.status(400).json({ message: "Cover image URL must be a valid URL." });
        return;
      }

      req.user.coverImageUrl = coverImageUrl;
    }

    await req.user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: toPublicUser(req.user),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  login,
  getCurrentUser,
  updateCurrentUser,
};
