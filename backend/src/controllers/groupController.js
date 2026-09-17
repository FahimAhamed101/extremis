const Group = require("../models/Group");
const Post = require("../models/Post");
const User = require("../models/User");
const { toFeedPost } = require("../utils/postSerializer");

const DEFAULT_GROUPS = [
  {
    name: "Bio Labest Group",
    handle: "@biolabest",
    category: "Biotechnology & Lab Research",
    description: "Global bio-engineering, biotechnology and experimental laboratory research community.",
    iconUrl: "/images/groups/bio-labest-avatar.jpg",
    coverUrl: "/images/groups/biolabest-cover.jpg",
    memberCountDisplay: "505K",
    isPrivate: false,
  },
  {
    name: "Social Research",
    handle: "@socialresearch",
    category: "Social Sciences & Global Studies",
    description: "Exploring sociology, human behavior, community development, and collaborative research.",
    iconUrl: "/images/groups/social-research-avatar.jpg",
    coverUrl: "/images/groups/social-cover.jpg",
    memberCountDisplay: "412K",
    isPrivate: false,
  },
  {
    name: "Good Group",
    handle: "@goodgroup",
    category: "Academic & Study Circles",
    description: "A collaborative community of scholars and students sharing notes, research papers, and academic advice.",
    iconUrl: "/images/groups/good-group-avatar.jpg",
    coverUrl: "/images/resources/sidebar-info.jpg",
    memberCountDisplay: "280K",
    isPrivate: false,
  },
  {
    name: "E-course Group",
    handle: "@ecourse",
    category: "Online Learning & Tech",
    description: "Digital skills, open-source educational courses, interactive lectures, and curriculum feedback.",
    iconUrl: "/images/groups/ecourse-group-avatar.jpg",
    coverUrl: "/images/resources/sidebar-info2.jpg",
    memberCountDisplay: "350K",
    isPrivate: false,
  },
];

async function ensureDefaultGroupsSeeded(userId = null) {
  try {
    const count = await Group.countDocuments();
    if (count >= 2) return;

    let adminUser = null;
    if (userId) {
      adminUser = await User.findById(userId);
    }
    if (!adminUser) {
      adminUser = await User.findOne();
    }

    for (const groupData of DEFAULT_GROUPS) {
      const existing = await Group.findOne({ name: groupData.name });
      if (!existing) {
        await Group.create({
          ...groupData,
          creator: adminUser ? adminUser._id : null,
          members: adminUser ? [adminUser._id] : [],
        });
      }
    }
  } catch (err) {
    console.error("Error auto-seeding default groups:", err);
  }
}

function formatGroup(group, currentUserId) {
  const isMember = currentUserId
    ? (group.members || []).some((m) => String(m._id || m) === String(currentUserId))
    : false;

  const baseCount = (group.members || []).length;
  let displayCount = group.memberCountDisplay;
  if (!displayCount || displayCount === "0") {
    displayCount = baseCount > 1000 ? `${(baseCount / 1000).toFixed(1)}K` : String(baseCount);
  }

  return {
    _id: group._id,
    id: group._id,
    name: group.name,
    handle: group.handle || `@${group.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    description: group.description,
    category: group.category || "General",
    iconUrl: group.iconUrl || "/images/groups/good-group-avatar.jpg",
    coverUrl: group.coverUrl || "/images/resources/sidebar-info.jpg",
    memberCountDisplay: displayCount,
    membersCount: baseCount,
    isJoined: isMember,
    isPrivate: Boolean(group.isPrivate),
    notificationsCount: Math.max(3, (baseCount % 20) + 5), // dynamic unread activity count
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

async function createGroup(req, res, next) {
  try {
    const { name, description, category, isPrivate, iconUrl, coverUrl, handle } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required." });
    }

    const group = await Group.create({
      name,
      handle: handle || `@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      description,
      category,
      isPrivate: isPrivate === true || isPrivate === "true",
      iconUrl: iconUrl || "/images/groups/good-group-avatar.jpg",
      coverUrl: coverUrl || "/images/resources/sidebar-info.jpg",
      creator: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      message: "Group created successfully.",
      group: formatGroup(group, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

async function getMyGroups(req, res, next) {
  try {
    await ensureDefaultGroupsSeeded(req.user ? req.user._id : null);

    if (!req.user) {
      return res.status(200).json({
        message: "Groups loaded successfully.",
        groups: [],
      });
    }

    let groups = await Group.find({ members: req.user._id })
      .populate("creator", "firstName lastName avatarUrl")
      .sort({ updatedAt: -1 });

    // If newly registered user hasn't joined any groups yet, automatically enroll them in Good Group & E-course Group as starters
    if (groups.length === 0) {
      const defaultToJoin = await Group.find({ name: { $in: ["Good Group", "E-course Group"] } });
      for (const g of defaultToJoin) {
        if (!g.members.includes(req.user._id)) {
          g.members.push(req.user._id);
          await g.save();
        }
      }
      groups = await Group.find({ members: req.user._id }).sort({ updatedAt: -1 });
    }

    const formatted = groups.map((g) => formatGroup(g, req.user._id));

    res.status(200).json({
      message: "Groups loaded successfully.",
      groups: formatted,
    });
  } catch (error) {
    next(error);
  }
}

async function getDiscoverGroups(req, res, next) {
  try {
    const currentUserId = req.user ? req.user._id : null;
    await ensureDefaultGroupsSeeded(currentUserId);

    const groups = await Group.find({ isPrivate: false })
      .sort({ createdAt: -1 })
      .limit(20);

    const formatted = groups.map((g) => formatGroup(g, currentUserId));

    res.status(200).json({
      message: "Discover groups loaded.",
      groups: formatted,
    });
  } catch (error) {
    next(error);
  }
}

async function getGroupById(req, res, next) {
  try {
    const currentUserId = req.user ? req.user._id : null;
    const group = await Group.findById(req.params.groupId).populate("creator", "firstName lastName avatarUrl");

    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.status(200).json({
      message: "Group loaded.",
      group: formatGroup(group, currentUserId),
    });
  } catch (error) {
    next(error);
  }
}

async function getGroupPosts(req, res, next) {
  try {
    const myGroups = await Group.find({ members: req.user._id }).select("_id");
    const groupIds = myGroups.map((g) => g._id);

    const posts = await Post.find({ group: { $in: groupIds } })
      .populate("author")
      .populate("group")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      message: "Group posts loaded.",
      posts: posts.map((p) => toFeedPost(p, req.user._id)),
    });
  } catch (error) {
    next(error);
  }
}

async function joinGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const userId = req.user._id;
    const alreadyMember = group.members.some((m) => String(m) === String(userId));

    if (!alreadyMember) {
      group.members.push(userId);
      await group.save();
    }

    const updated = await Group.findById(req.params.groupId);

    res.status(200).json({
      message: "Joined group successfully.",
      isJoined: true,
      group: formatGroup(updated, userId),
    });
  } catch (error) {
    next(error);
  }
}

async function leaveGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const userId = req.user._id;
    group.members = group.members.filter((m) => String(m) !== String(userId));
    await group.save();

    const updated = await Group.findById(req.params.groupId);

    res.status(200).json({
      message: "Left group successfully.",
      isJoined: false,
      group: formatGroup(updated, userId),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createGroup,
  getMyGroups,
  getDiscoverGroups,
  getGroupById,
  getGroupPosts,
  joinGroup,
  leaveGroup,
};

