const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  senderName: {
    type: String,
    required: true,
    trim: true,
    default: "Viewer",
  },
  senderAvatar: {
    type: String,
    default: "/images/resources/userlist-1.jpg",
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const liveStreamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Socimo Live Room - Interactive Stream",
    },
    streamer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    streamerName: {
      type: String,
      trim: true,
      default: "Danial Cardos",
    },
    streamerAvatar: {
      type: String,
      default: "/images/resources/user.jpg",
    },
    privacy: {
      type: String,
      enum: ["Public", "Private", "only friends", "public", "private", "friends"],
      default: "Public",
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended"],
      default: "live",
    },
    viewerCount: {
      type: Number,
      default: 2,
    },
    allowChat: {
      type: Boolean,
      default: true,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    chatMessages: [chatMessageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LiveStream", liveStreamSchema);
