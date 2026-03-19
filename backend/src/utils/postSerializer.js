const toPublicUser = require("./toPublicUser");
const { getVideoPreview } = require("./videoPreview");

const DEFAULT_AVATAR_URL = "/images/resources/user.jpg";

function getAuthorName(user) {
  if (!user) {
    return "Guest User";
  }

  const fullName = `${String(user.firstName || "").trim()} ${String(user.lastName || "").trim()}`.trim();
  return fullName || String(user.email || "Guest User");
}

function getAuthorHandle(user) {
  if (!user) {
    return "@guest";
  }

  const emailPrefix = String(user.email || "").split("@")[0]?.trim();
  if (emailPrefix) {
    return `@${emailPrefix}`;
  }

  const normalizedName = getAuthorName(user).toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `@${normalizedName || "extremis"}`;
}

function toValidDate(value) {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatPublishedDate(value) {
  const parsed = toValidDate(value);
  if (!parsed) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function getAttachmentType(post) {
  const normalized = String(post?.attachmentType || "").trim().toLowerCase();
  if (normalized === "image" || normalized === "video" || normalized === "file") {
    return normalized;
  }

  return null;
}

function formatCommentTime(value) {
  const parsed = toValidDate(value);
  if (!parsed) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function serializeComment(comment) {
  const userSource = comment?.user && typeof comment.user === "object" ? comment.user : null;
  const user =
    userSource && typeof userSource === "object" && "firstName" in userSource
      ? toPublicUser(userSource)
      : null;

  return {
    id: String(comment?._id || ""),
    userId: user?.id || null,
    name: getAuthorName(user),
    image: String(user?.avatarUrl || DEFAULT_AVATAR_URL).trim() || DEFAULT_AVATAR_URL,
    time: formatCommentTime(comment?.createdAt),
    message: String(comment?.message || "").trim(),
  };
}

function serializeBasePost(post, viewerId) {
  const authorSource =
    post?.author && typeof post.author === "object"
      ? post.author
      : null;
  const author =
    authorSource && typeof authorSource === "object" && "firstName" in authorSource
      ? toPublicUser(authorSource)
      : null;
  const createdAt = toValidDate(post?.createdAt) || new Date();
  const scheduledFor = toValidDate(post?.scheduledFor);
  const isScheduled = Boolean(scheduledFor && scheduledFor.getTime() > Date.now());
  const publishedAt = isScheduled ? scheduledFor : createdAt;
  const attachmentType = getAttachmentType(post);
  const likeIds = Array.isArray(post?.likes) ? post.likes.map((entry) => String(entry)) : [];
  const serializedComments = Array.isArray(post?.comments) ? post.comments.map((comment) => serializeComment(comment)) : [];
  const { embedUrl, videoUrl } = getVideoPreview(post?.linkUrl);
  const likeCount = likeIds.length;
  const commentCount = serializedComments.length;
  const shareCount = Number(post?.shareCount || 0);

  return {
    id: String(post?._id || post?.id || ""),
    authorName: getAuthorName(author),
    authorHandle: getAuthorHandle(author),
    authorImage: String(author?.avatarUrl || DEFAULT_AVATAR_URL).trim() || DEFAULT_AVATAR_URL,
    activity: isScheduled ? "scheduled a post" : "created a post",
    published: formatPublishedDate(publishedAt),
    content: String(post?.content || "").trim(),
    attachmentUrl: String(post?.attachmentUrl || "").trim() || null,
    attachmentType,
    attachmentName: String(post?.attachmentName || "").trim() || null,
    linkUrl: String(post?.linkUrl || "").trim() || null,
    audience: String(post?.audience || "joined-groups").trim() || "joined-groups",
    activityFeed: post?.activityFeed !== false,
    myStory: post?.myStory !== false,
    scheduledFor: scheduledFor ? scheduledFor.toISOString() : null,
    createdAt: createdAt.toISOString(),
    status: isScheduled ? "scheduled" : "published",
    embedUrl,
    videoUrl,
    comments: serializedComments,
    stats: {
      viewCount: Math.max(1, likeCount + commentCount + shareCount + 1),
      likeCount,
      commentCount,
      shareCount,
      likedByViewer: viewerId ? likeIds.includes(String(viewerId)) : false,
    },
  };
}

function toFeedPost(post, viewerId) {
  return serializeBasePost(post, viewerId);
}

function toTimelinePost(post, viewerId) {
  const base = serializeBasePost(post, viewerId);

  return {
    id: base.id,
    type: "custom",
    authorName: base.authorName,
    authorImage: base.authorImage,
    activity: base.activity,
    published: base.published,
    description: base.content,
    href: base.linkUrl || "#",
    image: base.attachmentType === "image" ? base.attachmentUrl : undefined,
    attachmentUrl: base.attachmentUrl,
    attachmentType: base.attachmentType,
    attachmentName: base.attachmentName,
    linkUrl: base.linkUrl,
    embedUrl: base.embedUrl,
    videoUrl: base.videoUrl,
    audience: base.audience,
    scheduledFor: base.scheduledFor,
    createdAt: base.createdAt,
    status: base.status,
    emojiCount: String(base.stats.likeCount),
    commentsOpen: false,
    comments: base.comments,
    stats: base.stats,
  };
}

module.exports = {
  toFeedPost,
  toTimelinePost,
};
