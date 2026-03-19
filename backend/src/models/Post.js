const mongoose = require("mongoose");

const postCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 4000,
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    attachmentType: {
      type: String,
      default: null,
      validate(value) {
        return value == null || value === "image" || value === "video" || value === "file";
      },
    },
    attachmentName: {
      type: String,
      default: null,
      trim: true,
    },
    linkUrl: {
      type: String,
      default: null,
    },
    audience: {
      type: String,
      enum: ["public", "private", "specific-friend", "only-friends", "joined-groups"],
      default: "joined-groups",
    },
    activityFeed: {
      type: Boolean,
      default: true,
    },
    myStory: {
      type: Boolean,
      default: true,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    comments: {
      type: [postCommentSchema],
      default: [],
    },
    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
