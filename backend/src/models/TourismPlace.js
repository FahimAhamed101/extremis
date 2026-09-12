const mongoose = require("mongoose");

const tourismPlaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    category: {
      type: String,
      enum: ["nature", "historic", "beach", "city", "research", "adventure"],
      default: "nature",
      index: true,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    coverImage: {
      type: String,
      default: null,
    },
    images: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: null,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    bestTimeToVisit: {
      type: String,
      default: "Year-round",
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

tourismPlaceSchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });
tourismPlaceSchema.index({ title: "text", description: "text", location: "text", country: "text" });

const TourismPlace = mongoose.models.TourismPlace || mongoose.model("TourismPlace", tourismPlaceSchema);

module.exports = TourismPlace;
