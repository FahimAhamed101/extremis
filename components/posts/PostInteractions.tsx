"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  useAddPostCommentMutation,
  useSharePostMutation,
  useTogglePostLikeMutation,
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

export default function PostInteractions({
  postId,
  initialStats,
  initialComments = [],
  shareUrl,
  defaultCommentsOpen = false,
}: PostInteractionsProps) {
  const [stats, setStats] = useState<PostInteractionStats>({
    viewCount: initialStats?.viewCount ?? Math.max(1, (initialStats?.likeCount || 0) + (initialStats?.commentCount || initialComments.length) + (initialStats?.shareCount || 0) + 1),
    likeCount: initialStats?.likeCount ?? 0,
    commentCount: initialStats?.commentCount ?? initialComments.length,
    shareCount: initialStats?.shareCount ?? 0,
    likedByViewer: initialStats?.likedByViewer ?? false,
  });
  const [comments, setComments] = useState<PostInteractionComment[]>(initialComments);
  const [commentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [commentMessage, setCommentMessage] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [togglePostLike] = useTogglePostLikeMutation();
  const [addPostComment] = useAddPostCommentMutation();
  const [sharePost] = useSharePostMutation();

  useEffect(() => {
    setStats({
      viewCount: initialStats?.viewCount ?? Math.max(1, (initialStats?.likeCount || 0) + (initialStats?.commentCount || initialComments.length) + (initialStats?.shareCount || 0) + 1),
      likeCount: initialStats?.likeCount ?? 0,
      commentCount: initialStats?.commentCount ?? initialComments.length,
      shareCount: initialStats?.shareCount ?? 0,
      likedByViewer: initialStats?.likedByViewer ?? false,
    });
  }, [initialComments.length, initialStats?.commentCount, initialStats?.likeCount, initialStats?.likedByViewer, initialStats?.shareCount, initialStats?.viewCount]);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const emojiCount = useMemo(() => formatCount(stats.likeCount), [stats.likeCount]);

  const applyServerPost = (post: {
    comments?: PostInteractionComment[];
    stats?: PostInteractionStats;
  }) => {
    if (post.comments) {
      setComments(post.comments);
    }

    if (post.stats) {
      setStats(post.stats);
    }
  };

  const handleLike = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActionMessage(null);

    if (!postId) {
      setStats((current) => {
        const liked = !current.likedByViewer;
        const likeCount = Math.max(0, (current.likeCount || 0) + (liked ? 1 : -1));
        return {
          ...current,
          likedByViewer: liked,
          likeCount,
          viewCount: Math.max(1, likeCount + (current.commentCount || 0) + (current.shareCount || 0) + 1),
        };
      });
      return;
    }

    try {
      const response = await togglePostLike(postId).unwrap();
      applyServerPost(response.post);
    } catch (error) {
      setActionMessage(getErrorMessage(error));
    }
  };

  const handleShare = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActionMessage(null);

    const fallbackUrl =
      shareUrl ||
      (typeof window !== "undefined" ? window.location.href : "");

    if (fallbackUrl && typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(fallbackUrl);
      } catch {
        // Clipboard access is best-effort only.
      }
    }

    if (!postId) {
      setStats((current) => {
        const shareCount = (current.shareCount || 0) + 1;
        return {
          ...current,
          shareCount,
          viewCount: Math.max(1, (current.likeCount || 0) + (current.commentCount || 0) + shareCount + 1),
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
      setComments((current) => [...current, nextComment]);
      setStats((current) => {
        const commentCount = (current.commentCount || 0) + 1;
        return {
          ...current,
          commentCount,
          viewCount: Math.max(1, (current.likeCount || 0) + commentCount + (current.shareCount || 0) + 1),
        };
      });
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
            <span title="Likes" className="Follow">
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
      </div>
      <div className="stat-tools" data-react-post="true">
        <div className="box">
          <div className="Like">
            <a className={`Like__link${stats.likedByViewer ? " is-active" : ""}`} href="#" onClick={handleLike}>
              <i className="icofont-like"></i> {stats.likedByViewer ? "Liked" : "Like"}
            </a>
            <div className="Emojis">
              <div className="Emoji Emoji--like">
                <div className="icon icon--like"></div>
              </div>
              <div className="Emoji Emoji--love">
                <div className="icon icon--heart"></div>
              </div>
              <div className="Emoji Emoji--haha">
                <div className="icon icon--haha"></div>
              </div>
              <div className="Emoji Emoji--wow">
                <div className="icon icon--wow"></div>
              </div>
              <div className="Emoji Emoji--sad">
                <div className="icon icon--sad"></div>
              </div>
              <div className="Emoji Emoji--angry">
                <div className="icon icon--angry"></div>
              </div>
            </div>
          </div>
        </div>
        <a
          title=""
          href="#"
          className="comment-to"
          onClick={(event) => {
            event.preventDefault();
            setCommentsOpen((current) => !current);
          }}
        >
          <i className="icofont-comment"></i> Comment
        </a>
        <a title="" href="#" className="share-to" onClick={handleShare}>
          <i className="icofont-share-alt"></i> Share
        </a>
        <div className="emoji-state">
          <div className="popover_wrapper">
            <a className="popover_title" href="#" title="">
              <img alt="" src="/images/smiles/thumb.png" />
            </a>
          </div>
          <div className="popover_wrapper">
            <a className="popover_title" href="#" title="">
              <img alt="" src="/images/smiles/heart.png" />
            </a>
          </div>
          <div className="popover_wrapper">
            <a className="popover_title" href="#" title="">
              <img alt="" src="/images/smiles/smile.png" />
            </a>
          </div>
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
                      <a title="" href="#">
                        {comment.name}
                      </a>
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
