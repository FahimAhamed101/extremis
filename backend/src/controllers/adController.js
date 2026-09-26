const path = require("path");
const fs = require("fs");
const Advertisement = require("../models/Advertisement");

const DEFAULT_CONFIG = {
  key: "global_ads",
  advertisement: {
    title: "Advertisement",
    imageUrl: "/images/resources/ad-widget2.gif",
    targetUrl: "#",
    altText: "Advertisement",
    isActive: true,
  },
  sponsors: [
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
};

function extractDomain(urlStr) {
  if (!urlStr) return "";
  try {
    const parsed = new URL(urlStr.startsWith("http") ? urlStr : ("https://" + urlStr));
    return parsed.hostname;
  } catch (e) {
    return urlStr;
  }
}

async function getOrCreateAdConfig() {
  let doc = await Advertisement.findOne({ key: "global_ads" });
  if (!doc) {
    try {
      doc = await Advertisement.create(DEFAULT_CONFIG);
    } catch (err) {
      doc = await Advertisement.findOne({ key: "global_ads" });
    }
  }
  return doc || DEFAULT_CONFIG;
}

// GET /api/ads
async function getAds(req, res, next) {
  try {
    const doc = await getOrCreateAdConfig();
    return res.status(200).json({
      success: true,
      advertisement: doc.advertisement || DEFAULT_CONFIG.advertisement,
      sponsors: doc.sponsors || DEFAULT_CONFIG.sponsors,
    });
  } catch (error) {
    console.error("getAds error:", error);
    return res.status(200).json({
      success: true,
      advertisement: DEFAULT_CONFIG.advertisement,
      sponsors: DEFAULT_CONFIG.sponsors,
    });
  }
}

// PUT /api/ads
async function updateAds(req, res, next) {
  try {
    const { advertisement, sponsors } = req.body || {};
    let doc = await Advertisement.findOne({ key: "global_ads" });
    if (!doc) {
      doc = new Advertisement(DEFAULT_CONFIG);
    }

    if (advertisement && typeof advertisement === "object") {
      doc.advertisement = {
        title: advertisement.title !== undefined ? String(advertisement.title).trim() : doc.advertisement.title,
        imageUrl: advertisement.imageUrl !== undefined ? String(advertisement.imageUrl).trim() : doc.advertisement.imageUrl,
        targetUrl: advertisement.targetUrl !== undefined ? String(advertisement.targetUrl).trim() : doc.advertisement.targetUrl,
        altText: advertisement.altText !== undefined ? String(advertisement.altText).trim() : doc.advertisement.altText,
        isActive: advertisement.isActive !== undefined ? Boolean(advertisement.isActive) : doc.advertisement.isActive,
      };
    }

    if (Array.isArray(sponsors)) {
      doc.sponsors = sponsors.map((s, idx) => ({
        _id: s._id || s.id,
        title: String(s.title || "").trim() || "Sponsored",
        imageUrl: String(s.imageUrl || "").trim(),
        targetUrl: String(s.targetUrl || "").trim() || "#",
        domain: String(s.domain || "").trim() || extractDomain(s.targetUrl),
        isActive: s.isActive !== undefined ? Boolean(s.isActive) : true,
        order: Number(s.order !== undefined ? s.order : idx),
      }));
    }

    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Advertisements and sponsors updated successfully",
      advertisement: doc.advertisement,
      sponsors: doc.sponsors,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/ads/sponsors
async function addSponsor(req, res, next) {
  try {
    const { title, imageUrl, targetUrl, domain, isActive } = req.body || {};
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    let doc = await Advertisement.findOne({ key: "global_ads" });
    if (!doc) {
      doc = new Advertisement(DEFAULT_CONFIG);
    }

    const newSponsor = {
      title: String(title).trim(),
      imageUrl: String(imageUrl || "").trim(),
      targetUrl: String(targetUrl || "#").trim(),
      domain: String(domain || "").trim() || extractDomain(targetUrl),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: (doc.sponsors ? doc.sponsors.length : 0) + 1,
    };

    doc.sponsors.push(newSponsor);
    await doc.save();

    return res.status(201).json({
      success: true,
      message: "Sponsor added successfully",
      sponsor: doc.sponsors[doc.sponsors.length - 1],
      sponsors: doc.sponsors,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/ads/sponsors/:id
async function updateSponsor(req, res, next) {
  try {
    const { id } = req.params;
    const { title, imageUrl, targetUrl, domain, isActive, order } = req.body || {};

    let doc = await Advertisement.findOne({ key: "global_ads" });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Ad configuration not found" });
    }

    const sponsor = doc.sponsors.id(id);
    if (!sponsor) {
      return res.status(404).json({ success: false, message: "Sponsor item not found" });
    }

    if (title !== undefined) sponsor.title = String(title).trim();
    if (imageUrl !== undefined) sponsor.imageUrl = String(imageUrl).trim();
    if (targetUrl !== undefined) {
      sponsor.targetUrl = String(targetUrl).trim();
      if (!domain) sponsor.domain = extractDomain(targetUrl);
    }
    if (domain !== undefined) sponsor.domain = String(domain).trim();
    if (isActive !== undefined) sponsor.isActive = Boolean(isActive);
    if (order !== undefined) sponsor.order = Number(order);

    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Sponsor updated successfully",
      sponsor,
      sponsors: doc.sponsors,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/ads/sponsors/:id
async function deleteSponsor(req, res, next) {
  try {
    const { id } = req.params;
    let doc = await Advertisement.findOne({ key: "global_ads" });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Ad configuration not found" });
    }

    doc.sponsors = doc.sponsors.filter((s) => String(s._id) !== String(id));
    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Sponsor removed successfully",
      sponsors: doc.sponsors,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/ads/upload
async function uploadAdImage(req, res) {
  try {
    let { image, name } = req.body || {};
    if (!image && typeof req.body === "string") {
      try {
        const parsed = JSON.parse(req.body);
        image = parsed.image;
        name = parsed.name;
      } catch (e) {}
    }

    if (!image) {
      return res.status(400).json({ success: false, message: "No image data provided" });
    }

    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const ext = image.includes("image/png") ? "png" : image.includes("image/gif") ? "gif" : "jpg";
    const filename = "ad_" + Date.now() + "_" + Math.random().toString(36).substring(7) + "." + ext;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = "/uploads/" + filename;
    return res.status(200).json({
      success: true,
      url: fileUrl,
      filename,
    });
  } catch (err) {
    console.error("Ad image upload error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAds,
  updateAds,
  addSponsor,
  updateSponsor,
  deleteSponsor,
  uploadAdImage,
  DEFAULT_CONFIG,
};
