const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    researcherType: {
      type: String,
      default: null,
    },
    institute: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
    position: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    coverImageUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    skypeId: {
      type: String,
      default: null,
    },
    localTime: {
      type: String,
      default: null,
    },
    disciplines: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
