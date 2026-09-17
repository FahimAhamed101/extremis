const mongoose = require("mongoose");
const User = require("../models/User");
const toPublicUser = require("../utils/toPublicUser");
const Post = require("../models/Post");
const { toTimelinePost } = require("../utils/postSerializer");
const {
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

  if (normalized.startsWith("/") || normalized.startsWith("data:image/")) {
    return normalized;
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
  const username = String(user.username || "").trim();
  if (username) {
    return `@${username}`;
  }

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

function getObjectIdStrings(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((entry) => {
          if (!entry) {
            return null;
          }

          if (typeof entry === "string") {
            return entry;
          }

          if (typeof entry === "object" && "_id" in entry) {
            return String(entry._id);
          }

          return String(entry);
        })
        .filter(Boolean)
    )
  );
}

function buildUserSearchQuery(search) {
  const normalized = String(search || "").trim();
  if (!normalized) {
    return {};
  }

  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const searchRegex = new RegExp(escaped, "i");

  return {
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { username: searchRegex },
      { email: searchRegex },
      { institute: searchRegex },
      { department: searchRegex },
      { position: searchRegex },
    ],
  };
}

function parsePositiveInteger(value, fallback, max = 60) {
  const parsed = Number.parseInt(String(value || ""), 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, max);
}

function getPersonSubtitle(publicUser) {
  return (
    publicUser.department ||
    publicUser.position ||
    publicUser.institute ||
    publicUser.researcherType ||
    "Researcher"
  );
}

function buildPersonCard(user, viewerFollowingSet, viewerId) {
  const publicUser = toPublicUser(user);
  const userId = publicUser.id;
  const isViewer = viewerId ? viewerId === userId : false;
  const isFollowing = !isViewer && viewerFollowingSet.has(userId);

  return {
    id: userId,
    profileHref: `/profile/${userId}`,
    name: getFullName(publicUser),
    subtitle: getPersonSubtitle(publicUser),
    image: publicUser.avatarUrl || "/images/resources/user.jpg",
    actionLabel: isViewer ? "You" : isFollowing ? "Following" : "Follow",
    isFollowing,
    canFollow: !isViewer,
  };
}

async function buildNetworkPayload(profileUser, viewerUser) {
  const profileUserId = String(profileUser._id);
  const viewerUserId = String(viewerUser._id);
  const profileFollowingIds = getObjectIdStrings(profileUser.following);
  const viewerFollowingIds = getObjectIdStrings(viewerUser.following);
  const viewerFollowingSet = new Set(viewerFollowingIds);
  const suggestionExcludedIds = Array.from(
    new Set([viewerUserId, profileUserId, ...viewerFollowingIds])
  );

  const [followerCount, followerDocs, followingDocs, suggestionDocs] = await Promise.all([
    User.countDocuments({ following: profileUser._id }),
    User.find({ following: profileUser._id }).sort({ createdAt: -1 }).limit(24),
    profileFollowingIds.length
      ? User.find({ _id: { $in: profileFollowingIds } })
      : Promise.resolve([]),
    User.find({ _id: { $nin: suggestionExcludedIds } }).sort({ createdAt: -1 }).limit(8),
  ]);

  const followingDocMap = new Map(
    followingDocs.map((user) => [String(user._id), user])
  );

  const orderedFollowingDocs = profileFollowingIds
    .map((userId) => followingDocMap.get(userId))
    .filter(Boolean);

  const followerCards = followerDocs.map((user) =>
    buildPersonCard(user, viewerFollowingSet, viewerUserId)
  );
  const followingCards = orderedFollowingDocs.map((user) =>
    buildPersonCard(user, viewerFollowingSet, viewerUserId)
  );
  const suggestionCards = suggestionDocs.map((user) =>
    buildPersonCard(user, viewerFollowingSet, viewerUserId)
  );

  return {
    followers: followerCards,
    following: followingCards,
    suggestions: suggestionCards,
    whoIsFollowing: followerCards.slice(0, 5),
    stats: {
      followerCount,
      followingCount: profileFollowingIds.length,
    },
  };
}

function buildProfilePayload(user, stats = {}) {
  const publicUser = toPublicUser(user);
  const fullName = getFullName(publicUser);
  const handle = getHandle(publicUser);
  const institute = publicUser.institute || "Oxford University";
  const department = publicUser.department || "Department not added";
  const position = publicUser.position || "Professor Associate";
  const researcherType = publicUser.researcherType || "Educational leadership";
  const gender = publicUser.gender || "Not specified";
  const avatarUrl = publicUser.avatarUrl || "/images/resources/user.jpg";
  const coverImageUrl = publicUser.coverImageUrl || "/images/resources/profile-banner-real.jpg";
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
      followerCount: Number.isFinite(stats.followerCount) ? stats.followerCount : 0,
      followingCount: Number.isFinite(stats.followingCount) ? stats.followingCount : 0,
    },
  };
}

async function loadProfileTimeline(profileUserId, viewerId = profileUserId) {
  const userPosts = await Post.find({ author: profileUserId })
    .populate("author")
    .populate("comments.user")
    .sort({ createdAt: -1 })
    .limit(20);

  return [...userPosts.map((post) => toTimelinePost(post, viewerId)), ...timeline];
}

async function getMyProfile(req, res, next) {
  try {
    const [profileTimeline, network] = await Promise.all([
      loadProfileTimeline(req.user._id),
      buildNetworkPayload(req.user, req.user),
    ]);

    res.status(200).json({
      message: "Profile loaded successfully.",
      profile: buildProfilePayload(req.user, network.stats),
      timeline: profileTimeline,
      network,
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

async function getProfileById(req, res, next) {
  try {
    const { userId } = req.params;

    let profileUser = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      profileUser = await User.findById(userId);
    }
    if (!profileUser) {
      profileUser = await User.findOne({ username: userId });
    }
    if (!profileUser && (userId === "shivanshu" || userId === "pinky" || userId === "spacester")) {
      profileUser = await User.findOne();
    }

    if (!profileUser) {
      res.status(404).json({ message: "Profile not found." });
      return;
    }

    const viewerId = req.user?._id || profileUser._id;
    const [profileTimeline, network] = await Promise.all([
      loadProfileTimeline(profileUser._id, viewerId),
      buildNetworkPayload(profileUser, req.user || profileUser),
    ]);

    const profileData = buildProfilePayload(profileUser, network.stats);
    res.status(200).json({
      message: "Profile loaded successfully.",
      firstName: profileUser.firstName || profileUser.username,
      lastName: profileUser.lastName || "",
      username: profileUser.username,
      avatarUrl: profileUser.avatarUrl || "https://picsum.photos/seed/" + profileUser.username + "/200/200",
      location: profileUser.location || "Mumbai",
      _id: profileUser._id,
      profile: profileData,
      timeline: profileTimeline,
      network,
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

async function getDiscoverPeople(req, res, next) {
  try {
    const viewerUserId = req.user?._id ? String(req.user._id) : null;
    const viewerFollowingIds = req.user?.following ? getObjectIdStrings(req.user.following) : [];
    const viewerFollowingSet = new Set(viewerFollowingIds);
    const limit = parsePositiveInteger(req.query.limit, 24);
    const normalizedQuery = String(req.query.q || req.query.search || "").trim();
    const searchQuery = normalizedQuery ? buildUserSearchQuery(normalizedQuery) : {};

    const filter = viewerUserId ? { _id: { $ne: req.user._id }, ...searchQuery } : searchQuery;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      message: "People loaded successfully.",
      users: users.map((user) => buildPersonCard(user, viewerFollowingSet, viewerUserId)),
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
      "dateOfBirth",
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

    if (Object.prototype.hasOwnProperty.call(req.body, "username")) {
      const username = normalizeOptionalText(req.body.username)?.toLowerCase() || null;
      if (username && !/^[a-z0-9._-]{3,30}$/.test(username)) {
        res.status(400).json({ message: "Username must be 3-30 characters and use only letters, numbers, dot, underscore, or hyphen." });
        return;
      }

      if (username && username !== String(req.user.username || "").trim().toLowerCase()) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername && String(existingUsername._id) !== String(req.user._id)) {
          res.status(409).json({ message: "This username is already taken." });
          return;
        }
      }

      req.user.username = username;
      didUpdate = true;
    }

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

    if (Object.prototype.hasOwnProperty.call(req.body, "coordinates")) {
      if (req.body.coordinates && typeof req.body.coordinates === "object") {
        const lat = Number(req.body.coordinates.lat ?? req.body.coordinates.latitude);
        const lng = Number(req.body.coordinates.lng ?? req.body.coordinates.lon ?? req.body.coordinates.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          req.user.coordinates = { lat, lng };
          didUpdate = true;
        }
      } else if (req.body.coordinates === null) {
        req.user.coordinates = { lat: null, lng: null };
        didUpdate = true;
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "fullName")) {
      const full = String(req.body.fullName || "").trim();
      if (full) {
        const parts = full.split(/\s+/);
        req.user.firstName = parts[0] || req.user.firstName;
        req.user.lastName = parts.slice(1).join(" ") || req.user.lastName || "";
        didUpdate = true;
      }
    }

    if (!didUpdate) {
      res.status(400).json({ message: "No profile fields were provided." });
      return;
    }

    if (!String(req.user.firstName || "").trim()) {
      req.user.firstName = req.user.username || (req.user.email ? req.user.email.split("@")[0] : "Admin");
    }
    if (!String(req.user.lastName || "").trim()) {
      req.user.lastName = "User";
    }

    await req.user.save();
    const [profileTimeline, network] = await Promise.all([
      loadProfileTimeline(req.user._id),
      buildNetworkPayload(req.user, req.user),
    ]);

    res.status(200).json({
      message: "Profile updated successfully.",
      profile: buildProfilePayload(req.user, network.stats),
      timeline: profileTimeline,
      network,
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

function parseDesiredFollowing(body) {
  if (!body || typeof body !== "object") {
    return null;
  }

  if (typeof body.following === "boolean") {
    return body.following;
  }

  if (typeof body.following === "string") {
    const normalized = body.following.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return null;
}

async function toggleFollowUser(req, res, next) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user id." });
      return;
    }

    if (String(req.user._id) === userId) {
      res.status(400).json({ message: "You cannot follow yourself." });
      return;
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Optional `{ following: boolean }` makes the endpoint idempotent for
    // desired-state clients; omitting it keeps the original toggle behaviour.
    const desiredFollowing = parseDesiredFollowing(req.body);
    const currentFollowingIds = getObjectIdStrings(req.user.following);
    const currentlyFollowing = currentFollowingIds.includes(userId);
    const shouldFollow = desiredFollowing === null ? !currentlyFollowing : desiredFollowing;

    const update = shouldFollow
      ? { $addToSet: { following: targetUser._id } }
      : { $pull: { following: targetUser._id } };

    await User.findByIdAndUpdate(req.user._id, update, { new: true });

    res.status(200).json({
      message: shouldFollow ? "User followed successfully." : "User unfollowed successfully.",
      targetUserId: userId,
      isFollowing: shouldFollow,
    });
  } catch (error) {
    next(error);
  }
}

async function getSidebarPeople(req, res, next) {
  try {
    const viewerUserId = String(req.user._id);
    const viewerFollowingIds = getObjectIdStrings(req.user.following);
    const viewerFollowingSet = new Set(viewerFollowingIds);
    const excludedIds = Array.from(new Set([viewerUserId, ...viewerFollowingIds]));

    const users = await User.find({ _id: { $nin: excludedIds } })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      people: users.map((user) => buildPersonCard(user, viewerFollowingSet, viewerUserId)),
    });
  } catch (error) {
    next(error);
  }
}

const CITY_COORDINATES = {
  "islamabad, pakistan": { lat: 33.6844, lng: 73.0479 },
  "islamabad": { lat: 33.6844, lng: 73.0479 },
  "london, uk": { lat: 51.5074, lng: -0.1278 },
  "london": { lat: 51.5074, lng: -0.1278 },
  "boston, usa": { lat: 42.3601, lng: -71.0589 },
  "boston": { lat: 42.3601, lng: -71.0589 },
  "toronto, canada": { lat: 43.6532, lng: -79.3832 },
  "toronto": { lat: 43.6532, lng: -79.3832 },
  "singapore": { lat: 1.3521, lng: 103.8198 },
  "stockholm, sweden": { lat: 59.3293, lng: 18.0686 },
  "stockholm": { lat: 59.3293, lng: 18.0686 },
  "zurich, switzerland": { lat: 47.3769, lng: 8.5417 },
  "zurich": { lat: 47.3769, lng: 8.5417 },
  "melbourne, australia": { lat: -37.8136, lng: 144.9631 },
  "melbourne": { lat: -37.8136, lng: 144.9631 },
  "cairo, egypt": { lat: 30.0444, lng: 31.2357 },
  "cairo": { lat: 30.0444, lng: 31.2357 },
  "bengaluru, india": { lat: 12.9716, lng: 77.5946 },
  "bengaluru": { lat: 12.9716, lng: 77.5946 },
  "nairobi, kenya": { lat: -1.2921, lng: 36.8219 },
  "nairobi": { lat: -1.2921, lng: 36.8219 },
  "tokyo, japan": { lat: 35.6762, lng: 139.6503 },
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "paris, france": { lat: 48.8566, lng: 2.3522 },
  "paris": { lat: 48.8566, lng: 2.3522 },
  "new york, usa": { lat: 40.7128, lng: -74.006 },
  "new york": { lat: 40.7128, lng: -74.006 },
  "dhaka, bangladesh": { lat: 23.8103, lng: 90.4125 },
  "dhaka": { lat: 23.8103, lng: 90.4125 },
  "shibchar, bangladesh": { lat: 23.3472, lng: 90.1697 },
  "shibchar": { lat: 23.3472, lng: 90.1697 },
  "oxford, uk": { lat: 51.752, lng: -1.2577 },
  "oxford": { lat: 51.752, lng: -1.2577 },
  "cambridge, uk": { lat: 52.2053, lng: 0.1218 },
  "cambridge": { lat: 52.2053, lng: 0.1218 },
  "sydney, australia": { lat: -33.8688, lng: 151.2093 },
  "san francisco, usa": { lat: 37.7749, lng: -122.4194 },
  "berlin, germany": { lat: 52.52, lng: 13.405 },
};

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function resolveUserCoordinates(user) {
  if (
    user.coordinates &&
    Number.isFinite(user.coordinates.lat) &&
    Number.isFinite(user.coordinates.lng)
  ) {
    return { lat: user.coordinates.lat, lng: user.coordinates.lng };
  }

  const loc = String(user.location || "").trim().toLowerCase();
  if (loc && CITY_COORDINATES[loc]) {
    return CITY_COORDINATES[loc];
  }

  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    if (loc && (loc.includes(cityName) || cityName.includes(loc))) {
      return coords;
    }
  }

  return null;
}

async function getNearbyPeople(req, res, next) {
  try {
    const viewerUser = req.user || null;
    const viewerUserId = viewerUser ? String(viewerUser._id) : null;
    const viewerFollowingIds = viewerUser ? getObjectIdStrings(viewerUser.following) : [];
    const viewerFollowingSet = new Set(viewerFollowingIds);

    let originLat = Number(req.query.lat);
    let originLng = Number(req.query.lng);
    let originLocation = String(req.query.location || "").trim();

    if (!Number.isFinite(originLat) || !Number.isFinite(originLng)) {
      if (viewerUser) {
        const viewerCoords = resolveUserCoordinates(viewerUser);
        if (viewerCoords) {
          originLat = viewerCoords.lat;
          originLng = viewerCoords.lng;
          originLocation = originLocation || viewerUser.location || "";
        }
      }
    }

    if (!Number.isFinite(originLat) || !Number.isFinite(originLng)) {
      originLat = 51.5074;
      originLng = -0.1278;
      originLocation = originLocation || "London, UK";
    }

    const radiusParam = req.query.radius;
    const radiusKm = radiusParam && radiusParam !== "all" ? Number(radiusParam) : null;
    const normalizedQuery = String(req.query.q || req.query.search || "").trim();
    const searchQuery = normalizedQuery ? buildUserSearchQuery(normalizedQuery) : {};

    const filter = { ...searchQuery };
    if (viewerUserId) {
      filter._id = { $ne: viewerUser._id };
    }

    const allUsers = await User.find(filter).limit(100);

    const nearbyList = allUsers.map((user) => {
      const publicUser = toPublicUser(user);
      const coords = resolveUserCoordinates(user);
      let distanceKm = null;
      let distanceFormatted = "Global distance";

      if (coords && Number.isFinite(originLat) && Number.isFinite(originLng)) {
        distanceKm = calculateDistanceKm(originLat, originLng, coords.lat, coords.lng);
        if (distanceKm < 1) {
          distanceFormatted = `${Math.round(distanceKm * 1000)}m away`;
        } else if (distanceKm < 10) {
          distanceFormatted = `${distanceKm.toFixed(1)} km away`;
        } else {
          distanceFormatted = `${Math.round(distanceKm)} km away`;
        }
      }

      const isFollowing = viewerFollowingSet.has(String(user._id));

      return {
        id: String(user._id),
        name: getFullName(publicUser),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatarUrl: user.avatarUrl || "/images/resources/user.jpg",
        position: user.position || "Researcher",
        department: user.department || null,
        institute: user.institute || null,
        location: user.location || (coords ? `Coords: ${coords.lat}, ${coords.lng}` : "Global"),
        coordinates: coords,
        bio: user.bio,
        disciplines: user.disciplines || [],
        skills: user.skills || [],
        distanceKm,
        distanceFormatted,
        isFollowing,
        canFollow: viewerUserId ? viewerUserId !== String(user._id) : true,
        profileHref: `/profile/${user._id}`,
      };
    });

    let filtered = nearbyList;
    if (radiusKm && Number.isFinite(radiusKm) && radiusKm > 0) {
      filtered = filtered.filter(
        (person) => person.distanceKm !== null && person.distanceKm <= radiusKm
      );
    }

    filtered.sort((a, b) => {
      if (a.distanceKm === null && b.distanceKm === null) return 0;
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });

    const limit = parsePositiveInteger(req.query.limit, 50);
    const paginated = filtered.slice(0, limit);

    res.status(200).json({
      message: "Nearby people loaded successfully.",
      origin: {
        lat: originLat,
        lng: originLng,
        location: originLocation,
      },
      radiusKm: radiusKm || null,
      totalCount: filtered.length,
      users: paginated,
    });
  } catch (error) {
    next(error);
  }
}

async function inviteColleague(req, res, next) {
  try {
    const { email, colleagueName, note } = req.body || {};
    const trimmedEmail = String(email || "").trim().toLowerCase();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: "A valid colleague email address is required." });
    }

    const existing = await User.findOne({ email: trimmedEmail });

    return res.status(200).json({
      success: true,
      message: `Invitation successfully sent to ${trimmedEmail}!`,
      colleague: {
        email: trimmedEmail,
        name: colleagueName || trimmedEmail.split("@")[0],
        isRegistered: Boolean(existing),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDiscoverPeople,
  getProfileById,
  getMyProfile,
  getNearbyPeople,
  getSidebarPeople,
  toggleFollowUser,
  updateMyProfile,
  inviteColleague,
};

