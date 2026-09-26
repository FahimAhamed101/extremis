const mongoose = require("mongoose");

const sponsorItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    targetUrl: {
      type: String,
      default: "",
      trim: true,
    },
    domain: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const advertisementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global_ads",
      unique: true,
      index: true,
    },
    advertisement: {
      title: {
        type: String,
        default: "Advertisement",
        trim: true,
      },
      imageUrl: {
        type: String,
        default: "/images/resources/ad-widget2.gif",
        trim: true,
      },
      targetUrl: {
        type: String,
        default: "#",
        trim: true,
      },
      altText: {
        type: String,
        default: "Advertisement",
        trim: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    sponsors: {
      type: [sponsorItemSchema],
      default: [
        {
          title: "IQ Options Broker",
          imageUrl: "/images/resources/sponsor.jpg",
          targetUrl: "https://www.iqvie.com",
          domain: "www.iqvie.com",
          isActive: true,
          order: 1,
        },
        {
          title: "BM Fashion Designer",
          imageUrl: "/images/resources/sponsor2.jpg",
          targetUrl: "https://www.abcd.com",
          domain: "www.abcd.com",
          isActive: true,
          order: 2,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Advertisement ||
  mongoose.model("Advertisement", advertisementSchema);
