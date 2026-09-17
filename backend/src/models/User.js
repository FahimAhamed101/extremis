const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
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
    dateOfBirth: {
      type: String,
      default: null,
    },
    coordinates: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
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
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    notificationSettings: {
      subscriptions: { type: Boolean, default: true },
      recommendedResearches: { type: Boolean, default: true },
      activeComments: { type: Boolean, default: true },
      replyComments: { type: Boolean, default: true },
      emailAcademicUpdates: { type: Boolean, default: true },
      promotionalRecommendations: { type: Boolean, default: false },
    },
    privacySettings: {
      searchEngineVisible: { type: Boolean, default: true },
      showFollowersOnTimeline: { type: Boolean, default: true },
      showCoursesAndResearches: { type: Boolean, default: true },
    },
    billingAddress: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      country: { type: String, default: "USA" },
      addressLine1: { type: String, default: "" },
      addressLine2: { type: String, default: "" },
      state: { type: String, default: "" },
      city: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    paymentMethod: {
      methodType: { type: String, default: "visa" },
      cardNumber: { type: String, default: "" },
      cardMonth: { type: String, default: "Month" },
      cardYear: { type: String, default: "2026" },
      cardCvv: { type: String, default: "" },
      paypalEmail: { type: String, default: "" },
      bitcoinAddress: { type: String, default: "" },
      bankFirstName: { type: String, default: "" },
      bankLastName: { type: String, default: "" },
      bankCountry: { type: String, default: "USA" },
      bankName: { type: String, default: "" },
      bankAddress: { type: String, default: "" },
      swiftCode: { type: String, default: "" },
      bankAccountNo: { type: String, default: "" },
    },
    apiClients: [
      {
        clientId: { type: String, required: true },
        clientSecret: { type: String, required: true },
        name: { type: String, default: "Default API Client" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
