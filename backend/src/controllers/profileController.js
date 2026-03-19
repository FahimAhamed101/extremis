const toPublicUser = require("../utils/toPublicUser");
const Post = require("../models/Post");
const { toTimelinePost } = require("../utils/postSerializer");
const {
  followers,
  following,
  suggestions,
  whoIsFollowing,
  videos,
  comments,
  timeline,
  researchImages,
  events,
} = require("../utils/profileFixtures");

function normalizeOptionalText(value) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

function normalizeOptionalUrl(value) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    return null;
  }

  try {
    return new URL(normalized).toString();
  } catch {
    return null;
  }
}

function normalizeStringArray(value) {
  const entries = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,\n]/g)
      : [];

  return Array.from(
    new Set(
      entries
        .map((entry) => String(entry || "").trim())
        .filter(Boolean)
        .slice(0, 12)
    )
  );
}

function getFullName(user) {
  return `${String(user.firstName || "").trim()} ${String(user.lastName || "").trim()}`.trim() || user.email;
}

function getHandle(user) {
  const emailPrefix = String(user.email || "").split("@")[0]?.trim();
  if (emailPrefix) {
    return `@${emailPrefix}`;
  }

  return `@${getFullName(user).toLowerCase().replace(/[^a-z0-9]+/g, "") || "researcher"}`;
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function getCompletion(user) {
  const publicUser =
    user && typeof user === "object" && "id" in user && !("_id" in user)
      ? user
      : toPublicUser(user);
  const fields = [
    publicUser.firstName,
    publicUser.lastName,
    publicUser.email,
    publicUser.researcherType,
    publicUser.institute,
    publicUser.department,
    publicUser.position,
    publicUser.gender,
    publicUser.avatarUrl,
    publicUser.coverImageUrl,
    publicUser.bio,
    publicUser.location,
    publicUser.website,
    publicUser.disciplines.length ? "disciplines" : "",
    publicUser.skills.length ? "skills" : "",
  ];

  const completed = fields.filter((field) => String(field || "").trim()).length;
  return Math.round((completed / fields.length) * 100);
}

function buildProfilePayload(user) {
  const publicUser = toPublicUser(user);
  const fullName = getFullName(publicUser);
  const handle = getHandle(publicUser);
  const institute = publicUser.institute || "Oxford University";
  const department = publicUser.department || "Department not added";
  const position = publicUser.position || "Professor Associate";
  const researcherType = publicUser.researcherType || "Educational leadership";
  const gender = publicUser.gender || "Not specified";
  const avatarUrl = publicUser.avatarUrl || "/images/resources/user.jpg";
  const coverImageUrl = publicUser.coverImageUrl || "/images/resources/top-bg.jpg";
  const location = publicUser.location || [department, institute].filter(Boolean).join(", ");
  const completion = getCompletion(user);
  const disciplines =
    publicUser.disciplines.length > 0
      ? publicUser.disciplines
      : [
          researcherType,
          department,
          "Educational assessment",
          "Educational management",
          "Social Psychology",
          "Qualitative social research",
        ];
  const skills =
    publicUser.skills.length > 0
      ? publicUser.skills
      : [
          position,
          institute,
          "Research collaboration",
          "Mentoring",
          "Conference speaking",
          `Profile completion ${completion}%`,
        ];

  return {
    user: publicUser,
    fullName,
    handle,
    institute,
    department,
    position,
    researcherType,
    gender,
    avatarUrl,
    coverImageUrl,
    location,
    joined: formatDate(publicUser.createdAt),
    completion,
    disciplines: Array.from(new Set(disciplines.filter(Boolean))),
    skills: Array.from(new Set(skills.filter(Boolean))),
    bio:
      publicUser.bio ||
      `${fullName} is building research collaborations, sharing field notes, and contributing to academic conversations across the Extremis network.`,
    headline: `${position} at ${institute}`,
    contact: {
      emailAddress: publicUser.email,
      phoneNumber: publicUser.phoneNumber || "Not added",
      skypeId: publicUser.skypeId || "Not added",
      website: publicUser.website || "Not added",
      localTime: publicUser.localTime || "3:40AM",
    },
    analytics: {
      profileCompletion: completion,
      researcherType,
      institute,
      joined: formatDate(publicUser.createdAt),
      followerCount: followers.length,
      followingCount: following.length,
    },
  };
}

async function loadProfileTimeline(userId) {
  const userPosts = await Post.find({ author: userId })
    .populate("author")
    .populate("comments.user")
    .sort({ createdAt: -1 })
    .limit(20);

  return [...userPosts.map((post) => toTimelinePost(post, userId)), ...timeline];
}

async function getMyProfile(req, res, next) {
  try {
    const profileTimeline = await loadProfileTimeline(req.user._id);

    res.status(200).json({
      message: "Profile loaded successfully.",
      profile: buildProfilePayload(req.user),
      timeline: profileTimeline,
      network: {
        followers,
        following,
        suggestions,
        whoIsFollowing,
      },
      media: {
        videos,
        researchImages,
      },
      events,
      comments,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMyProfile(req, res, next) {
  try {
    const updatableFields = [
      "firstName",
      "lastName",
      "researcherType",
      "institute",
      "department",
      "position",
      "gender",
      "bio",
      "location",
      "phoneNumber",
      "skypeId",
      "localTime",
    ];

    let didUpdate = false;

    updatableFields.forEach((field) => {
      if (!Object.prototype.hasOwnProperty.call(req.body, field)) {
        return;
      }

      const value = normalizeOptionalText(req.body[field]);
      if ((field === "firstName" || field === "lastName") && !value) {
        return;
      }

      req.user[field] = value;
      didUpdate = true;
    });

    if (Object.prototype.hasOwnProperty.call(req.body, "website")) {
      const website = normalizeOptionalUrl(req.body.website);
      if (req.body.website && !website) {
        res.status(400).json({ message: "Website must be a valid URL." });
        return;
      }

      req.user.website = website;
      didUpdate = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "avatarUrl")) {
      const avatarUrl = normalizeOptionalUrl(req.body.avatarUrl);
      if (req.body.avatarUrl && !avatarUrl) {
        res.status(400).json({ message: "Avatar URL must be a valid URL." });
        return;
      }

      req.user.avatarUrl = avatarUrl;
      didUpdate = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "coverImageUrl")) {
      const coverImageUrl = normalizeOptionalUrl(req.body.coverImageUrl);
      if (req.body.coverImageUrl && !coverImageUrl) {
        res.status(400).json({ message: "Cover image URL must be a valid URL." });
        return;
      }

      req.user.coverImageUrl = coverImageUrl;
      didUpdate = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "disciplines")) {
      req.user.disciplines = normalizeStringArray(req.body.disciplines);
      didUpdate = true;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "skills")) {
      req.user.skills = normalizeStringArray(req.body.skills);
      didUpdate = true;
    }

    if (!didUpdate) {
      res.status(400).json({ message: "No profile fields were provided." });
      return;
    }

    if (!String(req.user.firstName || "").trim() || !String(req.user.lastName || "").trim()) {
      res.status(400).json({ message: "First name and last name cannot be empty." });
      return;
    }

    await req.user.save();
    const profileTimeline = await loadProfileTimeline(req.user._id);

    res.status(200).json({
      message: "Profile updated successfully.",
      profile: buildProfilePayload(req.user),
      timeline: profileTimeline,
      network: {
        followers,
        following,
        suggestions,
        whoIsFollowing,
      },
      media: {
        videos,
        researchImages,
      },
      events,
      comments,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
};
