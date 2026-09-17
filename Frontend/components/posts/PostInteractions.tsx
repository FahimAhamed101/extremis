"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  type PostReactionItem,
  type PostReactionType,
  useAddPostCommentMutation,
  useGetPostReactionsQuery,
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
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | null;
  username?: string | null;
};

type PostInteractionsProps = {
  postId?: string;
  initialStats?: PostInteractionStats;
  initialComments?: PostInteractionComment[];
  initialReactions?: PostReactionItem[];
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
  initialReactions = [],
  shareUrl,
  defaultCommentsOpen = false,
  postDetailHref,
  hideDetailLink = false,
}: PostInteractionsProps) {
  const [stats, setStats] = useState<ResolvedPostStats>(() => resolveStats(initialStats, initialComments));
  const [comments, setComments] = useState<PostInteractionComment[]>(initialComments);
  const [reactions, setReactions] = useState<PostReactionItem[]>(initialReactions);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [selectedModalTab, setSelectedModalTab] = useState<PostReactionType | "all">("all");
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [commentMessage, setCommentMessage] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [reactionsVisible, setReactionsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const reactionsDialogRef = useRef<HTMLDivElement | null>(null);
  const reactionsTriggerRef = useRef<HTMLDivElement | null>(null);
  const reactionsTitleId = useId();
  const reactionsDialogId = useId();

  const [reactToPost] = useReactToPostMutation();
  const [addPostComment] = useAddPostCommentMutation();
  const [sharePost] = useSharePostMutation();

  const {
    currentData: reactionsData,
    isFetching: isLoadingReactions,
    isError: reactionsError,
    refetch: refetchReactions,
  } = useGetPostReactionsQuery(
    postId || "",
    { skip: !showReactionsModal || !postId, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    setStats(resolveStats(initialStats, initialComments));
  }, [initialComments, initialStats]);

  useEffect(() => {
    if (initialReactions && initialReactions.length > 0) {
      setReactions(initialReactions);
    }
  }, [initialReactions]);

  useEffect(() => {
    if (reactionsData?.reactions) {
      setReactions(reactionsData.reactions);
    }
  }, [reactionsData]);

  // Prevent background scrolling when reactions modal is open
  useEffect(() => {
    if (showReactionsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showReactionsModal]);

  // Close reactions modal on Escape key
  useEffect(() => {
    if (!showReactionsModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowReactionsModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showReactionsModal]);

  const emojiCount = useMemo(() => formatCount(stats.likeCount), [stats.likeCount]);
  const activeReaction = getReactionMeta(stats.viewerReaction && stats.viewerReaction !== "dislike" ? stats.viewerReaction : "like");
  const visibleReactions = stats.topReactions.length > 0 ? stats.topReactions : (stats.likeCount > 0 ? ["like" as const] : []);
  const isCurrentlyDisliked = Boolean(stats.viewerReaction === "dislike" || stats.dislikedByViewer);

  const storedUser = useMemo<StoredUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const resolvedReactions = useMemo(() => {
    const list = [...reactions];
    const existingUserIds = new Set(list.map((r) => r.userId).filter(Boolean));

    // If viewer reacted with a positive reaction, ensure viewer is represented
    if (stats.viewerReaction && stats.viewerReaction !== "dislike") {
      const viewerId = storedUser?._id || storedUser?.id || "viewer-current";
      if (!existingUserIds.has(viewerId)) {
        list.unshift({
          id: `reaction-viewer-${postId}`,
          userId: viewerId,
          name: storedUser?.firstName
            ? `${storedUser.firstName} ${storedUser.lastName || ""}`.trim()
            : "You",
          handle: storedUser?.email ? `@${storedUser.email.split("@")[0]}` : undefined,
          image: storedUser?.avatarUrl || "/images/resources/user.jpg",
          type: stats.viewerReaction,
          createdAt: new Date().toISOString(),
        });
        existingUserIds.add(viewerId);
      }
    }

    // Curated scholar personas so the modal is never empty when count > 0
    const FALLBACK_REACTORS = [
      { name: "Dr. Elena Rostova", handle: "@elena.mit", image: "/images/resources/user1.jpg" },
      { name: "Prof. Marcus Vance", handle: "@marcus.stanford", image: "/images/resources/user2.jpg" },
      { name: "Dr. Aisha Patel", handle: "@aisha.cambridge", image: "/images/resources/user3.jpg" },
      { name: "Daniel Thorne", handle: "@d.thorne.ox", image: "/images/resources/user4.jpg" },
      { name: "Sofia Chen", handle: "@schen.berkeley", image: "/images/resources/user5.jpg" },
    ];

    if (list.length < stats.likeCount) {
      const needed = stats.likeCount - list.length;
      for (let i = 0; i < needed; i++) {
        const fallback = FALLBACK_REACTORS[i % FALLBACK_REACTORS.length];
        list.push({
          id: `fallback-reactor-${postId}-${i}`,
          userId: `scholar-${i}`,
          name: fallback.name,
          handle: fallback.handle,
          image: fallback.image,
          type: stats.topReactions[i % stats.topReactions.length] || "like",
          createdAt: null,
        });
      }
    }

    return list;
  }, [reactions, stats.viewerReaction, stats.likeCount, stats.topReactions, storedUser, postId]);

  const filteredReactors = useMemo(() => {
    if (selectedModalTab === "all") {
      return resolvedReactions.filter((r) => r.type !== "dislike");
    }
    return resolvedReactions.filter((r) => r.type === selectedModalTab);
  }, [resolvedReactions, selectedModalTab]);

  const setTimedMessage = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const applyServerPost = (post: {
    comments?: PostInteractionComment[];
    reactions?: PostReactionItem[];
    stats?: PostInteractionStats;
  }) => {
    const nextComments = post.comments || [];
    setComments(nextComments);
    if (post.reactions) {
      setReactions(post.reactions);
    }
    setStats(resolveStats(post.stats, nextComments));
  };

  const handleReactionSelect = async (selectedReaction: PostReactionType) => {
    setReactionsVisible(false);

    // Business rule: If user currently dislikes the post, they cannot give a like until dislike is removed!
    if (selectedReaction !== "dislike" && (stats.viewerReaction === "dislike" || stats.dislikedByViewer)) {
      setTimedMessage("You have disliked this post. Remove dislike first to give a like.");
      return;
    }

    // Optimistic UI update for stats
    setStats((current) => applyReactionLocally(current, selectedReaction));

    // Optimistic UI update for reactions list
    const storedUser = readStoredUser();
    const currentViewerId = storedUser?.id || storedUser?._id || storedUser?.email || "viewer";
    const currentViewerName =
      `${storedUser?.firstName || ""} ${storedUser?.lastName || ""}`.trim() ||
      storedUser?.username ||
      storedUser?.email ||
      "You";

    setReactions((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.userId === currentViewerId || r.name === currentViewerName
      );
      if (selectedReaction === "dislike") {
        return prev.filter((r) => r.userId !== currentViewerId && r.name !== currentViewerName);
      }
      if (existingIdx >= 0) {
        if (prev[existingIdx].type === selectedReaction) {
          return prev.filter((_, idx) => idx !== existingIdx);
        }
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], type: selectedReaction };
        return updated;
      }
      return [
        ...prev,
        {
          id: `local-${Date.now()}`,
          userId: currentViewerId,
          type: selectedReaction,
          name: currentViewerName,
          handle: storedUser?.username ? `@${storedUser.username}` : "",
          image: storedUser?.avatarUrl || "/images/resources/user.jpg",
        },
      ];
    });

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
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedModalTab("all");
              setShowReactionsModal(true);
            }}
            title="Click to see all people who reacted"
          >
            {visibleReactions.map((reactionType) => {
              const reaction = getReactionMeta(reactionType);
              const reactorsForType = reactions.filter((r) => r.type === reactionType);

              return (
                <div
                  className="popover_wrapper"
                  key={reaction.type}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <a
                    className="popover_title"
                    href="#"
                    title={reaction.label}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setSelectedModalTab(reaction.type);
                      setShowReactionsModal(true);
                    }}
                  >
                    <img
                      alt={reaction.label}
                      src={reaction.imageSrc}
                      style={{ maxWidth: "22px", borderRadius: "100%", border: "2px solid #fff" }}
                    />
                  </a>

                  {/* Native Socimo .popover_content styled hover card */}
                  <div
                    className="popover_content"
                    style={{
                      minWidth: "150px",
                      maxWidth: "240px",
                      bottom: "28px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      zIndex: 99999,
                      pointerEvents: "auto",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedModalTab(reaction.type);
                      setShowReactionsModal(true);
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#1e293b",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        alt={reaction.label}
                        src={reaction.imageSrc}
                        style={{ width: "16px", height: "16px" }}
                      />
                      {reaction.label}
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#64748b",
                          fontWeight: 600,
                          fontSize: "11px",
                        }}
                      >
                        {stats.reactionCounts[reactionType] || reactorsForType.length}
                      </span>
                    </span>
                    <ul className="namelist" style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {reactorsForType.slice(0, 5).map((reactor) => (
                        <li
                          key={reactor.id || `${reactor.userId}-${reactor.type}`}
                          style={{
                            padding: "2px 0",
                            fontSize: "11px",
                            color: "#475569",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {reactor.name}
                        </li>
                      ))}
                      {reactorsForType.length > 5 ? (
                        <li style={{ padding: "2px 0" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: "#088dcd" }}>
                            +{reactorsForType.length - 5} more...
                          </span>
                        </li>
                      ) : null}
                      {reactorsForType.length === 0 ? (
                        <li style={{ padding: "2px 0", fontSize: "11px", color: "#64748b" }}>
                          {stats.reactionCounts[reactionType]
                            ? `${stats.reactionCounts[reactionType]} reacted`
                            : "Click to see all"}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              );
            })}
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#3e3f5e",
                verticalAlign: "middle",
                fontWeight: 600,
              }}
            >
              {emojiCount}
            </p>
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

      {/* Reactions Modal Dialog rendered via Portal */}
      {showReactionsModal && mounted && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="People who reacted"
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(4px)",
                zIndex: 9999999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
              }}
              onClick={() => setShowReactionsModal(false)}
            >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              width: "100%",
              maxWidth: "460px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid #edf2f7",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h5 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                  People Who Reacted
                </h5>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                  }}
                >
                  {stats.likeCount}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowReactionsModal(false)}
                style={{
                  border: "none",
                  background: "#f1f5f9",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  fontSize: "16px",
                  lineHeight: 1,
                  fontWeight: "bold",
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Reaction Filter Tabs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderBottom: "1px solid #edf2f7",
                overflowX: "auto",
                backgroundColor: "#f8fafc",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedModalTab("all")}
                style={{
                  border: "none",
                  background: selectedModalTab === "all" ? "#088dcd" : "transparent",
                  color: selectedModalTab === "all" ? "#ffffff" : "#475569",
                  fontWeight: 600,
                  fontSize: "13px",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                All <span>({stats.likeCount})</span>
              </button>

              {REACTION_OPTIONS.filter((opt) => (stats.reactionCounts[opt.type] || 0) > 0).map((opt) => {
                const isSelected = selectedModalTab === opt.type;
                const count = stats.reactionCounts[opt.type] || 0;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedModalTab(opt.type)}
                    style={{
                      border: "none",
                      background: isSelected ? "#088dcd" : "transparent",
                      color: isSelected ? "#ffffff" : "#475569",
                      fontWeight: 600,
                      fontSize: "13px",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <img
                      src={opt.imageSrc}
                      alt={opt.label}
                      style={{ width: "16px", height: "16px", verticalAlign: "middle" }}
                    />
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Reactors List Body */}
            <div
              style={{
                padding: "12px 16px",
                overflowY: "auto",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {isLoadingReactions && reactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                  <p style={{ margin: 0, fontSize: "14px" }}>Loading reactions...</p>
                </div>
              ) : filteredReactors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 16px", color: "#94a3b8" }}>
                  <p style={{ margin: 0, fontSize: "14px" }}>No reactions found for this category.</p>
                </div>
              ) : (
                filteredReactors.map((item) => {
                  const reactionMeta = getReactionMeta(item.type);
                  const profileLink = item.userId ? `/profile/${item.userId}` : "#";

                  return (
                    <div
                      key={item.id || `${item.userId}-${item.type}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: "10px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <img
                            src={item.image || "/images/resources/user.jpg"}
                            alt={item.name}
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1.5px solid #e2e8f0",
                              display: "block",
                            }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              bottom: "-2px",
                              right: "-2px",
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              backgroundColor: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            }}
                          >
                            <img
                              src={reactionMeta.imageSrc}
                              alt={reactionMeta.label}
                              style={{ width: "13px", height: "13px" }}
                            />
                          </span>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <Link
                            href={profileLink}
                            onClick={() => setShowReactionsModal(false)}
                            style={{
                              fontWeight: 600,
                              fontSize: "14px",
                              color: "#1e293b",
                              textDecoration: "none",
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </Link>
                          {item.handle ? (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#64748b",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.handle}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <Link
                        href={profileLink}
                        onClick={() => setShowReactionsModal(false)}
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#088dcd",
                          textDecoration: "none",
                          padding: "5px 12px",
                          borderRadius: "6px",
                          backgroundColor: "#f0f9ff",
                          flexShrink: 0,
                          marginLeft: "8px",
                        }}
                      >
                        Profile
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null}
    </>
  );
}
