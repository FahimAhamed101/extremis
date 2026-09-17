const Post = require("../models/Post");

const MAX_SPONSORS = 10;
const SPONSOR_POST_SCAN_LIMIT = 25;

// Only absolute http(s) links without embedded credentials are safe to render.
function normalizeSponsorHref(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  if (url.username || url.password) {
    return null;
  }

  return url;
}

async function getSidebarSponsors(req, res, next) {
  try {
    const now = new Date();

    const posts = await Post.find({
      postType: "sponsor",
      group: null,
      audience: "public",
      "sponsorItems.0": { $exists: true },
      $or: [{ scheduledFor: null }, { scheduledFor: { $lte: now } }],
    })
      .sort({ createdAt: -1 })
      .limit(SPONSOR_POST_SCAN_LIMIT);

    const sponsors = [];
    const seenHrefs = new Set();

    for (const post of posts) {
      const items = Array.isArray(post?.sponsorItems) ? post.sponsorItems : [];
      for (const item of items) {
        const title = String(item?.title || "").trim();
        if (!title) {
          continue;
        }

        const url = normalizeSponsorHref(item?.href);
        if (!url) {
          continue;
        }

        const href = url.toString();
        if (seenHrefs.has(href)) {
          continue;
        }
        seenHrefs.add(href);

        sponsors.push({
          id: String(item?._id || `${post._id}-${sponsors.length}`),
          title,
          imageUrl: String(item?.imageUrl || "").trim() || null,
          href,
          domain: url.hostname,
        });

        if (sponsors.length >= MAX_SPONSORS) {
          break;
        }
      }

      if (sponsors.length >= MAX_SPONSORS) {
        break;
      }
    }

    res.status(200).json({ sponsors });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSidebarSponsors,
  normalizeSponsorHref,
};
