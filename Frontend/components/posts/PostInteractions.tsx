"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  type PostReactionType,
  useAddPostCommentMutation,
  useReactToPostMutation,
  useSharePostMutation,
} from "@/lib/services/authApi";
import { AUTH_USER_STORAGE_KEY } from "@/lib/auth/constants";

export type PostInteractionComment = {
  id?: string;
  userId?: string | null;
  name: string;
  image: string;
  time: string;
  message: string;
  link?: string;
};

export type PostInteractionStats = {
  viewCount?: number;
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
  shareCount?: number;
  likedByViewer?: boolean;
  dislikedByViewer?: boolean;
  viewerReaction?: PostReactionType | null;
  reactionCounts?: Record<PostReactionType, number>;
  topReactions?: PostReactionType[];
};

type StoredUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | null;
};

type PostInteractionsProps = {
  postId?: string;
  initialStats?: PostInteractionStats;
  initialComments?: PostInteractionComment[];
  shareUrl?: string;
  defaultCommentsOpen?: boolean;
  postDetailHref?: string;
  hideDetailLink?: boolean;
};

type ResolvedPostStats = {
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  shareCount: number;
  likedByViewer: boolean;
  dislikedByViewer: boolean;
  viewerReaction: PostReactionType | null;
  reactionCounts: Record<PostReactionType, number>;
  topReactions: PostReactionType[];
};

const REACTION_OPTIONS: Array<{
  type: PostReactionType;
  label: string;
  iconClass: string;
  imageSrc: string;
}> = [
  { type: "like", label: "Like", iconClass: "icon--like", imageSrc: "/images/smiles/thumb.png" },
  { type: "love", label: "Love", iconClass: "icon--heart", imageSrc: "/images/smiles/heart.png" },
  { type: "haha", label: "Haha", iconClass: "icon--haha", imageSrc: "/images/smiles/smile.png" },
  { type: "wow", label: "Wow", iconClass: "icon--wow", imageSrc: "/images/smiles/surprised.png" },
  { type: "sad", label: "Sad", iconClass: "icon--sad", imageSrc: "/images/smiles/weep.png" },
];

const DEFAULT_REACTION_COUNTS: Record<PostReactionType, number> = {
  like: 0,
  love: 0,
  haha: 0,
  wow: 0,
  sad: 0,
  angry: 0,
  dislike: 0,
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    if ("data" in error) {
      const data = (error as { data?: { message?: unknown } }).data;
      if (data && typeof data.message === "string") {
        return data.message;
      }
    }

    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      return String((error as { message?: unknown }).message);
    }
  }

  return "That action could not be completed.";
}

function readStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as StoredUser;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function formatCount(value: number | undefined): string {
  const count = Number(value || 0);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}m`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(count);
}

function buildFallbackComment(message: string): PostInteractionComment {
  const user = readStoredUser();
  const firstName = String(user?.firstName || "").trim();
  const lastName = String(user?.lastName || "").trim();
  const fullName = `${firstName} ${lastName}`.trim() || String(user?.email || "You");

  return {
    id: `local-${Date.now()}`,
    name: fullName,
    image: String(user?.avatarUrl || "/images/resources/user.jpg").trim() || "/images/resources/user.jpg",
    time: "Just now",
    message,
  };
}

function normalizeReactionCounts(
  reactionCounts?: Partial<Record<PostReactionType, number>>,
  fallbackLikeCount = 0,
): Record<PostReactionType, number> {
  const normalized = { ...DEFAULT_REACTION_COUNTS };

  if (reactionCounts && typeof reactionCounts === "object") {
    Object.keys(normalized).forEach((key) => {
      const typeKey = key as PostReactionType;
      const nextValue = Number(reactionCounts[typeKey] || 0);
      normalized[typeKey] = Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 0;
    });
  } else if (fallbackLikeCount > 0) {
    normalized.like = fallbackLikeCount;
  }

  return normalized;
}

function computeTopReactions(reactionCounts: Record<PostReactionType, number>): PostReactionType[] {
  return REACTION_OPTIONS
    .map((option) => option.type)
    .filter((type) => reactionCounts[type] > 0)
    .sort((left, right) => reactionCounts[right] - reactionCounts[left])
    .slice(0, 3);
}

function resolveStats(
  initialStats: PostInteractionStats | undefined,
  initialComments: PostInteractionComment[],
): ResolvedPostStats {
  const reactionCounts = normalizeReactionCounts(initialStats?.reactionCounts, initialStats?.likeCount ?? 0);
  const likeCount =
    Number(initialStats?.likeCount) ||
    (reactionCounts.like + reactionCounts.love + reactionCounts.haha + reactionCounts.wow + reactionCounts.sad);
  const dislikeCount = Number(initialStats?.dislikeCount ?? reactionCounts.dislike ?? 0);
  const commentCount = Number(initialStats?.commentCount ?? initialComments.length);
  const shareCount = Number(initialStats?.shareCount ?? 0);

  const viewerReaction =
    initialStats?.viewerReaction ??
    (initialStats?.dislikedByViewer
      ? "dislike"
      : initialStats?.likedByViewer
      ? "like"
      : null);

  const isLiked = Boolean(viewerReaction && viewerReaction !== "dislike");
  const isDisliked = Boolean(viewerReaction === "dislike" || initialStats?.dislikedByViewer);

  return {
    viewCount: Number(initialStats?.viewCount ?? Math.max(1, likeCount + dislikeCount + commentCount + shareCount + 1)),
    likeCount,
    dislikeCount,
    commentCount,
    shareCount,
    likedByViewer: isLiked,
    dislikedByViewer: isDisliked,
    viewerReaction,
    reactionCounts,
    topReactions:
      initialStats?.topReactions && initialStats.topReactions.length > 0
        ? initialStats.topReactions
        : computeTopReactions(reactionCounts),
  };
}

function getReactionMeta(reactionType: PostReactionType | null) {
  return (
    REACTION_OPTIONS.find((option) => option.type === reactionType) || REACTION_OPTIONS[0]
  );
}

function applyReactionLocally(
  current: ResolvedPostStats,
  selectedReaction: PostReactionType,
): ResolvedPostStats {
  const reactionCounts = { ...normalizeReactionCounts(current.reactionCounts, current.likeCount) };
  const currentReaction = current.viewerReaction;
  const nextReaction = currentReaction === selectedReaction ? null : selectedReaction;

  if (currentReaction) {
    reactionCounts[currentReaction] = Math.max(0, (reactionCounts[currentReaction] || 0) - 1);
  }

  if (nextReaction) {
    reactionCounts[nextReaction] = (reactionCounts[nextReaction] || 0) + 1;
  }

  const likeCount =
    (reactionCounts.like || 0) +
    (reactionCounts.love || 0) +
    (reactionCounts.haha || 0) +
    (reactionCounts.wow || 0) +
    (reactionCounts.sad || 0);

  const dislikeCount = reactionCounts.dislike || 0;
  const commentCount = Number(current.commentCount || 0);
  const shareCount = Number(current.shareCount || 0);

  return {
    viewCount: Math.max(1, likeCount + dislikeCount + commentCount + shareCount + 1),
    likeCount,
    dislikeCount,
    commentCount,
    shareCount,
    likedByViewer: Boolean(nextReaction && nextReaction !== "dislike"),
    dislikedByViewer: Boolean(nextReaction === "dislike"),
    viewerReaction: nextReaction,
    reactionCounts,
    topReactions: computeTopReactions(reactionCounts),
  };
}

export default function PostInteractions({
  postId,
  initialStats,
  initialComments = [],
  shareUrl,
  defaultCommentsOpen = false,
  postDetailHref,
  hideDetailLink = false,
}: PostInteractionsProps) {
  const [stats, setStats] = useState<ResolvedPostStats>(() => resolveStats(initialStats, initialComments));
  const [comments, setComments] = useState<PostInteractionComment[]>(initialComments);
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [commentMessage, setCommentMessage] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [reactionsVisible, setReactionsVisible] = useState(false);

  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const [reactToPost] = useReactToPostMutation();
  const [addPostComment] = useAddPostCommentMutation();
  const [sharePost] = useSharePostMutation();

  useEffect(() => {
    setStats(resolveStats(initialStats, initialComments));
  }, [initialComments, initialStats]);

  const emojiCount = useMemo(() => formatCount(stats.likeCount), [stats.likeCount]);
  const activeReaction = getReactionMeta(stats.viewerReaction && stats.viewerReaction !== "dislike" ? stats.viewerReaction : "like");
  const visibleReactions = stats.topReactions.length > 0 ? stats.topReactions : (stats.likeCount > 0 ? ["like" as const] : []);
  const isCurrentlyDisliked = Boolean(stats.viewerReaction === "dislike" || stats.dislikedByViewer);

  const setTimedMessage = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const applyServerPost = (post: {
    comments?: PostInteractionComment[];
    stats?: PostInteractionStats;
  }) => {
    const nextComments = post.comments || [];
    setComments(nextComments);
    setStats(resolveStats(post.stats, nextComments));
  };

  const handleReactionSelect = async (selectedReaction: PostReactionType) => {
    setReactionsVisible(false);

    // Business rule: If user currently dislikes the post, they cannot give a like until dislike is removed!
    if (selectedReaction !== "dislike" && (stats.viewerReaction === "dislike" || stats.dislikedByViewer)) {
      setTimedMessage("You have disliked this post. Remove dislike first to give a like.");
      return;
    }

    // Optimistic UI update
    setStats((current) => applyReactionLocally(current, selectedReaction));

    if (!postId) {
      return;
    }

    try {
      const response = await reactToPost({ postId, reactionType: selectedReaction }).unwrap();
      applyServerPost(response.post);
    } catch (error) {
      setTimedMessage(getErrorMessage(error));
    }
  };

  const handleShare = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // Copy to clipboard
    const fullShareUrl =
      shareUrl ||
      (typeof window !== "undefined"
        ? `${window.location.origin}${postDetailHref || `/#post-${postId || "item"}`}`
        : "");

    if (navigator?.clipboard?.writeText && fullShareUrl) {
      void navigator.clipboard.writeText(fullShareUrl);
    }

    setStats((current) => ({
      ...current,
      shareCount: current.shareCount + 1,
    }));
    setTimedMessage("✓ Link copied to clipboard!");

    if (!postId) {
      return;
    }

    try {
      const response = await sharePost(postId).unwrap();
      applyServerPost(response.post);
    } catch {
      // already copied to clipboard
    }
  };

  const handleToggleComments = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCommentsOpen((current) => {
      const next = !current;
      if (next) {
        setTimeout(() => {
          commentInputRef.current?.focus();
        }, 120);
      }
      return next;
    });
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedMessage = commentMessage.trim();
    if (!normalizedMessage) {
      return;
    }

    if (!postId) {
      const nextComment = buildFallbackComment(normalizedMessage);
      const nextComments = [...comments, nextComment];
      setComments(nextComments);
      setStats((current) => ({
        ...current,
        commentCount: nextComments.length,
        viewCount: Math.max(1, current.likeCount + current.dislikeCount + nextComments.length + current.shareCount + 1),
      }));
      setCommentMessage("");
      setCommentsOpen(true);
      return;
    }

    try {
      const response = await addPostComment({ postId, message: normalizedMessage }).unwrap();
      applyServerPost(response.post);
      setCommentMessage("");
      setCommentsOpen(true);
    } catch (error) {
      setTimedMessage(getErrorMessage(error));
    }
  };

  return (
    <>
      {/* Exact Socimo .we-video-info Top Bar (Inline) */}
      <div
        className="we-video-info"
        data-react-post="true"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
            margin: "10px 0",
            padding: 0,
            listStyle: "none",
            width: "auto",
          }}
        >
          <li style={{ display: "inline-flex", alignItems: "center", margin: 0 }}>
            <span title="views" className="views">
              <i className="icofont-eye-open"></i>
              <ins style={{ position: "static", marginLeft: "5px" }}>{formatCount(stats.viewCount)}</ins>
            </span>
          </li>
          <li style={{ display: "inline-flex", alignItems: "center", margin: 0 }}>
            <span title="Likes" className="Follow">
              <i className="icofont-thumbs-up"></i>
              <ins style={{ position: "static", marginLeft: "5px" }}>{formatCount(stats.likeCount)}</ins>
            </span>
          </li>
          <li style={{ display: "inline-flex", alignItems: "center", margin: 0 }}>
            <span title="Dislikes" className="views">
              <i className="icofont-thumbs-down"></i>
              <ins style={{ position: "static", marginLeft: "5px" }}>{formatCount(stats.dislikeCount)}</ins>
            </span>
          </li>
          <li style={{ display: "inline-flex", alignItems: "center", margin: 0 }}>
            <span title="Comments" className="Recommend">
              <i className="icofont-comment"></i>
              <ins style={{ position: "static", marginLeft: "5px" }}>{formatCount(stats.commentCount)}</ins>
            </span>
          </li>
          <li style={{ display: "inline-flex", alignItems: "center", margin: 0 }}>
            <span className="share-pst" title="Share">
              <i className="icofont-share"></i>
              <ins style={{ position: "static", marginLeft: "5px" }}>{formatCount(stats.shareCount)}</ins>
            </span>
          </li>
        </ul>
        <div
          className="post-interaction-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            float: "none",
            marginLeft: "auto",
          }}
        >
          <a href="#" className="reply" onClick={handleToggleComments}>
            Reply <i className="icofont-reply"></i>
          </a>
          {postDetailHref && !hideDetailLink ? (
            <Link href={postDetailHref} className="reply post-detail-link">
              Details <i className="icofont-link"></i>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Exact Socimo .stat-tools Action Bar (Inline) */}
      <div className="stat-tools" data-react-post="true" style={{ marginTop: "16px" }}>
        <div
          className="stat-tools-bar"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
            width: "100%",
            overflow: "visible",
          }}
        >
          {/* Like Box with Emojis Popover */}
          <div
            className="box"
            style={{
              margin: 0,
              padding: 0,
              display: "inline-block",
              flexShrink: 0,
              width: "auto",
              maxWidth: "none",
              height: "auto",
              minHeight: 0,
              background: "transparent",
              boxShadow: "none",
              overflow: "visible",
            }}
          >
            <div
              className="Like post-reaction-shell"
              onMouseEnter={() => {
                if (!isCurrentlyDisliked) {
                  setReactionsVisible(true);
                }
              }}
              onMouseLeave={() => setReactionsVisible(false)}
              onFocusCapture={() => {
                if (!isCurrentlyDisliked) {
                  setReactionsVisible(true);
                }
              }}
              onBlurCapture={(event) => {
                const nextTarget = event.relatedTarget;
                if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                  setReactionsVisible(false);
                }
              }}
            >
              <a
                className={`Like__link post-reaction-link${
                  stats.viewerReaction && stats.viewerReaction !== "dislike" ? " is-active active" : ""
                }${reactionsVisible && !isCurrentlyDisliked ? " js-hover" : ""}`}
                href="#"
                style={{
                  padding: "6px 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  opacity: isCurrentlyDisliked ? 0.45 : 1,
                  cursor: isCurrentlyDisliked ? "not-allowed" : "pointer",
                  filter: isCurrentlyDisliked ? "grayscale(0.6)" : "none",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  if (isCurrentlyDisliked) {
                    setTimedMessage("You have disliked this post. Remove dislike first to give a like.");
                    return;
                  }
                  void handleReactionSelect("like");
                }}
                title={
                  isCurrentlyDisliked
                    ? "You have disliked this post. Remove dislike first to give a like."
                    : "Like / React"
                }
              >
                <span className="post-reaction-link-icon" style={{ display: "inline-flex", alignItems: "center" }}>
                  <img
                    src={activeReaction.imageSrc}
                    alt={activeReaction.label}
                    style={{ width: "16px", height: "16px", verticalAlign: "middle" }}
                  />
                </span>
                {stats.viewerReaction && stats.viewerReaction !== "dislike" ? activeReaction.label : "Like"}
              </a>

              {!isCurrentlyDisliked && (
                <div className="Emojis" role="menu" aria-label="Choose a reaction">
                  {REACTION_OPTIONS.map((reaction) => (
                    <button
                      key={reaction.type}
                      type="button"
                      className={`Emoji post-reaction-emoji-button Emoji--${reaction.type}${
                        stats.viewerReaction === reaction.type ? " is-selected" : ""
                      }`}
                      onClick={(event) => {
                        event.preventDefault();
                        void handleReactionSelect(reaction.type);
                      }}
                      aria-label={reaction.label}
                      title={reaction.label}
                    >
                      <div className={`icon ${reaction.iconClass}`}></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dislike Button (Native Socimo .dislike-to) */}
          <a
            title="Dislike"
            href="#"
            style={{
              padding: "6px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              color: stats.viewerReaction === "dislike" || stats.dislikedByViewer ? "#e11d48" : undefined,
              backgroundColor: stats.viewerReaction === "dislike" || stats.dislikedByViewer ? "#ffe4e6" : undefined,
            }}
            className={`dislike-to${stats.viewerReaction === "dislike" || stats.dislikedByViewer ? " active" : ""}`}
            onClick={(event) => {
              event.preventDefault();
              void handleReactionSelect("dislike");
            }}
          >
            <i className="icofont-thumbs-down"></i> {stats.viewerReaction === "dislike" || stats.dislikedByViewer ? "Disliked" : "Dislike"}
          </a>

          {/* Comment Button (Native Socimo .comment-to) */}
          <a
            title="Comment"
            href="#"
            style={{
              padding: "6px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            className={`comment-to${commentsOpen ? " active" : ""}`}
            onClick={handleToggleComments}
          >
            <i className="icofont-comment"></i> Comment
          </a>

          {/* Share Button (Native Socimo .share-to) */}
          <a
            title="Share"
            href="#"
            style={{
              padding: "6px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            className="share-to"
            onClick={handleShare}
          >
            <i className="icofont-share-alt"></i> Share
          </a>

          {/* Emojis State summary on the right */}
          <div
            className="emoji-state"
            style={{
              marginLeft: "auto",
              float: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
            }}
          >
            {visibleReactions.map((reactionType) => {
              const reaction = getReactionMeta(reactionType);

              return (
                <div className="popover_wrapper" key={reaction.type} style={{ display: "inline-block" }}>
                  <a
                    className="popover_title"
                    href="#"
                    title={reaction.label}
                    onClick={(event) => event.preventDefault()}
                  >
                    <img
                      alt={reaction.label}
                      src={reaction.imageSrc}
                      style={{ maxWidth: "22px", borderRadius: "100%", border: "2px solid #fff" }}
                    />
                  </a>
                </div>
              );
            })}
            <p style={{ margin: 0, fontSize: "11px", color: "#3e3f5e", verticalAlign: "middle" }}>{emojiCount}</p>
          </div>
        </div>

        {/* Action feedback message */}
        {actionMessage ? (
          <p
            className="post-action-message"
            style={{
              clear: "both",
              margin: "8px 0 0 0",
              color: actionMessage.startsWith("✓") ? "#0284c7" : "#e11d48",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {actionMessage}
          </p>
        ) : null}

        {/* Native Socimo .new-comment Section */}
        <div className="new-comment" style={{ display: commentsOpen ? "block" : "none" }}>
          <form method="post" onSubmit={handleCommentSubmit}>
            <input
              ref={commentInputRef}
              type="text"
              placeholder="write comment"
              value={commentMessage}
              onChange={(event) => setCommentMessage(event.target.value)}
            />
            <button type="submit" title="Send comment">
              <i className="icofont-paper-plane"></i>
            </button>
          </form>

          <div className="comments-area">
            <ul>
              {comments.map((comment, index) => (
                <li key={comment.id || `${comment.name}-${index}`}>
                  <figure>
                    <img alt="" src={comment.image || "/images/resources/user.jpg"} />
                  </figure>
                  <div className="commenter">
                    <h5>
                      {comment.userId ? (
                        <Link title={comment.name} href={`/profile/${comment.userId}`}>
                          {comment.name}
                        </Link>
                      ) : (
                        <a title={comment.name} href="#">
                          {comment.name}
                        </a>
                      )}
                    </h5>
                    <span>{comment.time}</span>
                    <p>{comment.message}</p>
                    {comment.link ? (
                      <>
                        <span>you can view the more detail via link</span>
                        <a title="" href={comment.link} target="_blank" rel="noreferrer">
                          {comment.link}
                        </a>
                      </>
                    ) : null}
                  </div>
                  <a
                    title="Like"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setTimedMessage("Liked comment!");
                    }}
                  >
                    <i className="icofont-heart"></i>
                  </a>
                  <a
                    title="Reply"
                    href="#"
                    className="reply-coment"
                    onClick={(e) => {
                      e.preventDefault();
                      setCommentMessage(`@${comment.name} `);
                      commentInputRef.current?.focus();
                    }}
                  >
                    <i className="icofont-reply"></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
