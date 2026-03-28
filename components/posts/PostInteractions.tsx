"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
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
  commentCount?: number;
  shareCount?: number;
  likedByViewer?: boolean;
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
  commentCount: number;
  shareCount: number;
  likedByViewer: boolean;
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
    REACTION_OPTIONS.forEach((option) => {
      const nextValue = Number(reactionCounts[option.type] || 0);
      normalized[option.type] = Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 0;
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
    Object.values(reactionCounts).reduce((total, count) => total + Number(count || 0), 0);
  const commentCount = Number(initialStats?.commentCount ?? initialComments.length);
  const shareCount = Number(initialStats?.shareCount ?? 0);
  const viewerReaction = initialStats?.viewerReaction ?? (initialStats?.likedByViewer ? "like" : null);

  return {
    viewCount: Number(initialStats?.viewCount ?? Math.max(1, likeCount + commentCount + shareCount + 1)),
    likeCount,
    commentCount,
    shareCount,
    likedByViewer: Boolean(viewerReaction),
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
    reactionCounts[currentReaction] = Math.max(0, reactionCounts[currentReaction] - 1);
  }

  if (nextReaction) {
    reactionCounts[nextReaction] += 1;
  }

  const likeCount = Object.values(reactionCounts).reduce((total, count) => total + count, 0);
  const commentCount = Number(current.commentCount || 0);
  const shareCount = Number(current.shareCount || 0);

  return {
    viewCount: Math.max(1, likeCount + commentCount + shareCount + 1),
    likeCount,
    commentCount,
    shareCount,
    likedByViewer: Boolean(nextReaction),
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
  const [reactToPost] = useReactToPostMutation();
  const [addPostComment] = useAddPostCommentMutation();
  const [sharePost] = useSharePostMutation();

  useEffect(() => {
    setStats(resolveStats(initialStats, initialComments));
  }, [initialComments, initialStats]);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const emojiCount = useMemo(() => formatCount(stats.likeCount), [stats.likeCount]);
  const activeReaction = getReactionMeta(stats.viewerReaction);
  const visibleReactions = stats.topReactions.length > 0 ? stats.topReactions : [];

  const applyServerPost = (post: {
    comments?: PostInteractionComment[];
    stats?: PostInteractionStats;
  }) => {
    const nextComments = post.comments || [];
    setComments(nextComments);
    setStats(resolveStats(post.stats, nextComments));
  };

  const handleReactionSelect = async (reactionType: PostReactionType) => {
    setActionMessage(null);

    if (!postId) {
      setStats((current) => applyReactionLocally(current, reactionType));
      setReactionsVisible(false);
      return;
    }

    try {
      const response = await reactToPost({ postId, reactionType }).unwrap();
      applyServerPost(response.post);
      setReactionsVisible(false);
    } catch (error) {
      setActionMessage(getErrorMessage(error));
    }
  };

  const handleShare = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActionMessage(null);

    const fallbackUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");

    if (fallbackUrl && typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(fallbackUrl);
      } catch {
        // Clipboard access is best-effort only.
      }
    }

    if (!postId) {
      setStats((current) => {
        const shareCount = current.shareCount + 1;
        return {
          ...current,
          shareCount,
          viewCount: Math.max(1, current.likeCount + current.commentCount + shareCount + 1),
        };
      });
      setActionMessage("Link copied.");
      return;
    }

    try {
      const response = await sharePost(postId).unwrap();
      applyServerPost(response.post);
      setActionMessage("Link copied.");
    } catch (error) {
      setActionMessage(getErrorMessage(error));
    }
  };

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedMessage = commentMessage.trim();
    if (!normalizedMessage) {
      return;
    }

    setActionMessage(null);

    if (!postId) {
      const nextComment = buildFallbackComment(normalizedMessage);
      const nextComments = [...comments, nextComment];
      setComments(nextComments);
      setStats((current) => ({
        ...current,
        commentCount: nextComments.length,
        viewCount: Math.max(1, current.likeCount + nextComments.length + current.shareCount + 1),
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
      setActionMessage(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="we-video-info" data-react-post="true">
        <ul>
          <li>
            <span title="views" className="views">
              <i className="icofont-eye-open"></i>
              <ins>{formatCount(stats.viewCount)}</ins>
            </span>
          </li>
          <li>
            <span title="Comments" className="Recommend">
              <i className="icofont-comment"></i>
              <ins>{formatCount(stats.commentCount)}</ins>
            </span>
          </li>
          <li>
            <span title="Reactions" className="Follow">
              <i className="icofont-star"></i>
              <ins>{formatCount(stats.likeCount)}</ins>
            </span>
          </li>
          <li>
            <span className="share-pst" title="Share">
              <i className="icofont-share"></i>
              <ins>{formatCount(stats.shareCount)}</ins>
            </span>
          </li>
        </ul>
        <div className="post-interaction-links">
          <a
            href="#"
            className="reply"
            onClick={(event) => {
              event.preventDefault();
              setCommentsOpen((current) => !current);
            }}
          >
            Reply <i className="icofont-reply"></i>
          </a>
          {postDetailHref && !hideDetailLink ? (
            <Link href={postDetailHref} className="reply post-detail-link">
              Details <i className="icofont-link"></i>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="stat-tools" data-react-post="true">
        <div className="box">
          <div
            className="Like post-reaction-shell"
            onMouseEnter={() => setReactionsVisible(true)}
            onMouseLeave={() => setReactionsVisible(false)}
            onFocusCapture={() => setReactionsVisible(true)}
            onBlurCapture={(event) => {
              const nextTarget = event.relatedTarget;
              if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                setReactionsVisible(false);
              }
            }}
          >
            <a
              className={`Like__link post-reaction-link${stats.viewerReaction ? " is-active" : ""}${
                reactionsVisible ? " js-hover" : ""
              }`}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                void handleReactionSelect("like");
              }}
            >
              <span className="post-reaction-link-icon">
                <img src={activeReaction.imageSrc} alt={activeReaction.label} />
              </span>
              {activeReaction.label}
            </a>
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
          </div>
        </div>

        <a
          title="Comment"
          href="#"
          className="comment-to"
          onClick={(event) => {
            event.preventDefault();
            setCommentsOpen((current) => !current);
          }}
        >
          <i className="icofont-comment"></i> Comment
        </a>

        <a title="Share" href="#" className="share-to" onClick={handleShare}>
          <i className="icofont-share-alt"></i> Share
        </a>

        <div className="emoji-state">
          {visibleReactions.map((reactionType) => {
            const reaction = getReactionMeta(reactionType);

            return (
              <div className="popover_wrapper" key={reaction.type}>
                <a
                  className="popover_title"
                  href="#"
                  title={reaction.label}
                  onClick={(event) => event.preventDefault()}
                >
                  <img alt={reaction.label} src={reaction.imageSrc} />
                </a>
              </div>
            );
          })}
          <p>{emojiCount}</p>
        </div>

        <div className="new-comment" style={{ display: commentsOpen ? "block" : "none" }}>
          <form method="post" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="write comment"
              value={commentMessage}
              onChange={(event) => setCommentMessage(event.target.value)}
            />
            <button type="submit">
              <i className="icofont-paper-plane"></i>
            </button>
          </form>
          {actionMessage ? <p className="post-action-message">{actionMessage}</p> : null}
          <div className="comments-area">
            <ul>
              {comments.map((comment, index) => (
                <li key={comment.id || `${comment.name}-${index}`}>
                  <figure>
                    <img alt="" src={comment.image} />
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
                  <a title="Like" href="#">
                    <i className="icofont-heart"></i>
                  </a>
                  <a title="Reply" href="#" className="reply-coment">
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
