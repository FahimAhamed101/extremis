const Post = require("../models/Post");
const { toFeedPost, toTimelinePost } = require("../utils/postSerializer");

const ALLOWED_AUDIENCES = new Set(["public", "private", "specific-friend", "only-friends", "joined-groups"]);
const ALLOWED_ATTACHMENT_TYPES = new Set(["image", "video", "file"]);

function normalizeOptionalText(value) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

function normalizeOptionalUrl(value, fieldName) {
  const normalized = normalizeOptionalText(value);
  if (!normalized) {
    return null;
  }

  try {
    return new URL(normalized).toString();
  } catch {
    const error = new Error(`${fieldName} must be a valid URL.`);
    error.statusCode = 400;
    throw error;
  }
}

function normalizeAudience(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return "joined-groups";
  }

  if (!ALLOWED_AUDIENCES.has(normalized)) {
    const error = new Error("Audience selection is invalid.");
    error.statusCode = 400;
    throw error;
  }

  return normalized;
}

function normalizeAttachmentType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (!ALLOWED_ATTACHMENT_TYPES.has(normalized)) {
    const error = new Error("Attachment type is invalid.");
    error.statusCode = 400;
    throw error;
  }

  return normalized;
}

function normalizeBoolean(value, fallback) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return fallback;
}

function normalizeScheduledFor(value) {
  const normalized = normalizeOptionalText(value);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    const error = new Error("Schedule date is invalid.");
    error.statusCode = 400;
    throw error;
  }

  return parsed;
}

function canUserViewPost(post, userId) {
  if (!post) {
    return false;
  }

  if (String(post.audience || "").trim().toLowerCase() !== "private") {
    return true;
  }

  const authorId =
    post.author && typeof post.author === "object" && post.author._id
      ? String(post.author._id)
      : String(post.author || "");

  return authorId === userId;
}

async function findPostForViewer(postId, userId) {
  const post = await Post.findById(postId)
    .populate("author")
    .populate("comments.user");

  if (!post || !canUserViewPost(post, userId)) {
    return null;
  }

  return post;
}

async function getFeedPosts(req, res, next) {
  try {
    const now = new Date();
    const posts = await Post.find({
      activityFeed: true,
      $or: [{ scheduledFor: null }, { scheduledFor: { $lte: now } }],
    })
      .populate("author")
      .populate("comments.user")
      .sort({ createdAt: -1 })
      .limit(50);

    const visiblePosts = posts
      .filter((post) => canUserViewPost(post, String(req.user._id)))
      .map((post) => toFeedPost(post, req.user._id));

    res.status(200).json({
      message: "Feed loaded successfully.",
      posts: visiblePosts,
    });
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const content = normalizeOptionalText(req.body.content) || "";
    const linkUrl = normalizeOptionalUrl(req.body.linkUrl, "Link URL");
    const attachmentUrl = normalizeOptionalUrl(req.body.attachmentUrl, "Attachment URL");
    const attachmentType = normalizeAttachmentType(req.body.attachmentType);
    const attachmentName = normalizeOptionalText(req.body.attachmentName);
    const audience = normalizeAudience(req.body.audience);
    const scheduledFor = normalizeScheduledFor(req.body.scheduledFor);
    const activityFeed = normalizeBoolean(req.body.activityFeed, true);
    const myStory = normalizeBoolean(req.body.myStory, true);

    if (!content && !linkUrl && !attachmentUrl) {
      res.status(400).json({ message: "Write something, attach a file, or add a link before publishing." });
      return;
    }

    if (attachmentUrl && !attachmentType) {
      res.status(400).json({ message: "Attachment type is required when an attachment URL is provided." });
      return;
    }

    const createdPost = await Post.create({
      author: req.user._id,
      content,
      attachmentUrl,
      attachmentType,
      attachmentName,
      linkUrl,
      audience,
      activityFeed,
      myStory,
      scheduledFor,
    });

    const post = await Post.findById(createdPost._id).populate("author");
    const feedPost = toFeedPost(post, req.user._id);

    res.status(201).json({
      message: feedPost.status === "scheduled" ? "Post scheduled successfully." : "Post published successfully.",
      post: feedPost,
      timelinePost: toTimelinePost(post, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

async function togglePostLike(req, res, next) {
  try {
    const post = await findPostForViewer(req.params.postId, String(req.user._id));
    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    const viewerId = String(req.user._id);
    const likeIndex = post.likes.findIndex((entry) => String(entry) === viewerId);

    if (likeIndex >= 0) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate("author");
    await post.populate("comments.user");

    res.status(200).json({
      message: likeIndex >= 0 ? "Post unliked." : "Post liked.",
      post: toFeedPost(post, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

async function addPostComment(req, res, next) {
  try {
    const post = await findPostForViewer(req.params.postId, String(req.user._id));
    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    const message = normalizeOptionalText(req.body.message);
    if (!message) {
      res.status(400).json({ message: "Comment message is required." });
      return;
    }

    post.comments.push({
      user: req.user._id,
      message,
    });

    await post.save();
    await post.populate("author");
    await post.populate("comments.user");

    res.status(201).json({
      message: "Comment added successfully.",
      post: toFeedPost(post, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

async function sharePost(req, res, next) {
  try {
    const post = await findPostForViewer(req.params.postId, String(req.user._id));
    if (!post) {
      res.status(404).json({ message: "Post not found." });
      return;
    }

    post.shareCount += 1;
    await post.save();
    await post.populate("author");
    await post.populate("comments.user");

    res.status(200).json({
      message: "Post shared successfully.",
      post: toFeedPost(post, req.user._id),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFeedPosts,
  createPost,
  togglePostLike,
  addPostComment,
  sharePost,
};
