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

async function signup(req, res, next) {
  try {
    const firstName = String(req.body.firstName || "").trim();
    const lastName = String(req.body.lastName || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const researcherType = String(req.body.researcherType || "").trim();
    const institute = String(req.body.institute || "").trim();
    const department = String(req.body.department || "").trim();
    const position = String(req.body.position || "").trim();
    const gender = String(req.body.gender || "").trim();
    const termsAccepted = Boolean(req.body.termsAccepted);

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
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

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
    const hasAvatarUrl = Object.prototype.hasOwnProperty.call(req.body, "avatarUrl");
    const hasCoverImageUrl = Object.prototype.hasOwnProperty.call(req.body, "coverImageUrl");

    if (!hasAvatarUrl && !hasCoverImageUrl) {
      res.status(400).json({ message: "No profile media fields were provided." });
      return;
    }

    if (hasAvatarUrl) {
      const avatarUrl = normalizeOptionalUrl(req.body.avatarUrl);
      if (req.body.avatarUrl && !avatarUrl) {
        res.status(400).json({ message: "Avatar URL must be a valid URL." });
        return;
      }

      req.user.avatarUrl = avatarUrl;
    }

    if (hasCoverImageUrl) {
      const coverImageUrl = normalizeOptionalUrl(req.body.coverImageUrl);
      if (req.body.coverImageUrl && !coverImageUrl) {
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
