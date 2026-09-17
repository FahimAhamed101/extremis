const mongoose = require("mongoose");

const EVENT_CATEGORIES = [
  "Conferences",
  "Workshops",
  "Tech & AI",
  "Social & Campus",
  "Webinars",
];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    category: {
      type: String,
      required: true,
      enum: EVENT_CATEGORIES,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    time: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 4000,
    },
    coverImage: {
      type: String,
      default: null,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    interested: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    going: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Upcoming listings filter by date and sort by recency of creation.
eventSchema.index({ date: 1, createdAt: -1 });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
module.exports.EVENT_CATEGORIES = EVENT_CATEGORIES;
