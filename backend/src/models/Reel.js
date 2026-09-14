const mongoose = require("mongoose");

const reelCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const reelSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [reelCommentSchema],
    allowComments: {
      type: Boolean,
      default: true,
    },
    privacy: {
      type: String,
      enum: ["everyone", "followers", "no_one"],
      default: "everyone",
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reel", reelSchema);
