"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FeedPost,
  ProfileTimelinePost,
  useGetCurrentUserQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "@/lib/services/authApi";

export type PostItemLike = {
  id: string;
  authorId?: string | null;
  authorName?: string;
  authorHandle?: string;
  title?: string | null;
  content?: string | null;
  description?: string | null;
  activity?: string | null;
  linkUrl?: string | null;
  embedUrl?: string | null;
  href?: string | null;
};

interface PostMoreActionsProps {
  post: PostItemLike | FeedPost | ProfileTimelinePost;
  onPostUpdated?: (updated: FeedPost) => void;
  onPostDeleted?: (postId: string) => void;
  iconType?: "svg" | "icofont";
  className?: string;
}

export default function PostMoreActions({
  post,
  onPostUpdated,
  onPostDeleted,
  iconType = "svg",
  className = "",
}: PostMoreActionsProps) {
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.user;

  const [updatePostMutation, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePostMutation, { isLoading: isDeleting }] = useDeletePostMutation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const postAuthorHandle = "authorHandle" in post && typeof post.authorHandle === "string" ? post.authorHandle : "";
  const postAuthorId = "authorId" in post && typeof post.authorId === "string" ? post.authorId : "";
  const postAuthorName = post.authorName || "";
  const initialPostTitle = post.title || "";
  const initialPostContent = post.content || ("description" in post && typeof post.description === "string" ? post.description : "");
  const initialPostActivity = "activity" in post && typeof post.activity === "string" ? post.activity : "";

  // Edit form state
  const [editTitle, setEditTitle] = useState(initialPostTitle);
  const [editContent, setEditContent] = useState(initialPostContent);
  const [editActivity, setEditActivity] = useState(initialPostActivity);
  const [editError, setEditError] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Sync edit form with current post when modal opens
  useEffect(() => {
    if (isEditModalOpen) {
      setEditTitle(post.title || "");
      setEditContent(post.content || ("description" in post && typeof post.description === "string" ? post.description : ""));
      setEditActivity("activity" in post && typeof post.activity === "string" ? post.activity : "");
      setEditError("");
    }
  }, [isEditModalOpen, post]);

  // Determine if current logged-in user is the post author or admin
  const currentUserId = currentUser?.id;
  const isAuthorOrAdmin = Boolean(
    currentUser &&
      ((postAuthorId && (currentUserId === postAuthorId || (currentUser as unknown as { _id?: string })._id === postAuthorId)) ||
        (currentUser as unknown as { role?: string }).role === "admin" ||
        (currentUser.username &&
          postAuthorHandle &&
          postAuthorHandle.replace(/^@/, "").toLowerCase() === currentUser.username.toLowerCase()) ||
        (currentUser.firstName &&
          postAuthorName &&
          postAuthorName.toLowerCase().includes(currentUser.firstName.toLowerCase())))
  );

  const authorHref = postAuthorId ? `/profile/${postAuthorId}` : "/profile";
  const postHref = `/posts/${post.id}`;
  const videoUrl =
    ("linkUrl" in post && typeof post.linkUrl === "string" ? post.linkUrl : "") ||
    ("embedUrl" in post && typeof post.embedUrl === "string" ? post.embedUrl : "") ||
    ("href" in post && typeof post.href === "string" ? post.href : "") ||
    "";

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");

    if (!editContent.trim() && !editTitle.trim()) {
      setEditError("Post must have a title or description.");
      return;
    }

    try {
      const res = await updatePostMutation({
        postId: post.id,
        title: editTitle.trim() || undefined,
        content: editContent.trim(),
        description: editContent.trim(),
        activityLabel: editActivity.trim() || undefined,
      }).unwrap();

      setFeedbackMsg("Post updated successfully!");
      if (onPostUpdated && res.post) {
        onPostUpdated(res.post);
      }
      setTimeout(() => {
        setIsEditModalOpen(false);
        setFeedbackMsg(null);
      }, 700);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Failed to update post. Please try again.";
      setEditError(errorMsg);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePostMutation(post.id).unwrap();
      setIsDeleteModalOpen(false);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data: { message: string } }).data.message
          : "Failed to delete post. Please try again.";
      alert(errorMsg);
    }
  };

  return (
    <>
      <div className={`more ${className}`} ref={menuRef}>
        <div
          className={`more-post-optns ${isMenuOpen ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
        >
          {iconType === "svg" ? (
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-more-horizontal"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </i>
          ) : (
            <i className="icofont-navigation-menu"></i>
          )}

          <ul
            style={
              isMenuOpen
                ? {
                    opacity: 1,
                    visibility: "visible",
                    transform: "translate(0)",
                    right: 0,
                    top: "100%",
                    display: "block",
                  }
                : undefined
            }
          >
            {/* View Post */}
            <li>
              <Link href={postHref} onClick={() => setIsMenuOpen(false)}>
                <i className="icofont-info-circle"></i>View Post
                <span>Open full post with comments</span>
              </Link>
            </li>

            {/* View Profile */}
            <li>
              <Link href={authorHref} onClick={() => setIsMenuOpen(false)}>
                <i className="icofont-user"></i>View Profile
                <span>Open {post.authorName}&apos;s profile</span>
              </Link>
            </li>

            {/* Watch Source if Video */}
            {videoUrl ? (
              <li>
                <a href={videoUrl} target="_blank" rel="noreferrer" onClick={() => setIsMenuOpen(false)}>
                  <i className="icofont-link"></i>Watch Source
                  <span>Open original video player</span>
                </a>
              </li>
            ) : null}

            {/* Edit Post (Author/Admin) */}
            {isAuthorOrAdmin && (
              <li
                onClick={handleOpenEdit}
                style={{
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: "6px",
                  marginTop: "6px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                    color: "#0284c7",
                    paddingLeft: 0,
                  }}
                >
                  <i className="icofont-pen-alt-1" style={{ color: "#0284c7", margin: 0 }}></i>
                  Edit Post
                </span>
                <span>Change title, caption, or activity</span>
              </li>
            )}

            {/* Delete Post (Author/Admin) */}
            {isAuthorOrAdmin && (
              <li onClick={handleOpenDelete}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                    color: "#ef4444",
                    paddingLeft: 0,
                  }}
                >
                  <i className="icofont-ui-delete" style={{ color: "#ef4444", margin: 0 }}></i>
                  Delete Post
                </span>
                <span style={{ color: "#f87171" }}>Permanently delete this post</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* ================= EDIT POST MODAL ================= */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "580px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
              animation: "fadeIn 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "#e0f2fe",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  <i className="icofont-pen-alt-1"></i>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>
                    Edit Post
                  </h4>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Update details for your published post
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: "4px 8px",
                  lineHeight: 1,
                  borderRadius: "6px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEdit}>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
                {feedbackMsg && (
                  <div
                    style={{
                      backgroundColor: "#ecfdf5",
                      border: "1px solid #6ee7b7",
                      color: "#065f46",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="icofont-check-circled"></i> {feedbackMsg}
                  </div>
                )}

                {editError && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fca5a5",
                      color: "#991b1b",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="icofont-warning-alt"></i> {editError}
                  </div>
                )}

                {/* Post Title Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Post Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Add a headline for this post..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s ease",
                    }}
                  />
                </div>

                {/* Post Content / Caption Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Post Description / Caption *
                  </label>
                  <textarea
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Share what you're thinking or explain your content..."
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* Activity Label Field */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#334155",
                      marginBottom: "6px",
                    }}
                  >
                    Activity Subtitle
                  </label>
                  <input
                    type="text"
                    value={editActivity}
                    onChange={(e) => setEditActivity(e.target.value)}
                    placeholder="e.g. posted a new Reel 🔥, shared a video"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid #f1f5f9",
                  backgroundColor: "#f8fafc",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    padding: "9px 22px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 2px 8px rgba(2, 132, 199, 0.3)",
                  }}
                >
                  {isUpdating ? (
                    <>
                      <i className="icofont-spinner icofont-spin"></i> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE POST CONFIRM MODAL ================= */}
      {isDeleteModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "460px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
              padding: "28px 24px",
              textAlign: "center",
              animation: "fadeIn 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                marginBottom: "16px",
              }}
            >
              <i className="icofont-ui-delete"></i>
            </div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "19px", fontWeight: "700", color: "#0f172a" }}>
              Delete this post?
            </h4>
            <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
              Are you sure you want to permanently delete this post? This action cannot be undone and will remove all comments and reactions.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  minWidth: "100px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  padding: "10px 22px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minWidth: "120px",
                  boxShadow: "0 2px 10px rgba(220, 38, 38, 0.35)",
                }}
              >
                {isDeleting ? (
                  <>
                    <i className="icofont-spinner icofont-spin"></i> Deleting...
                  </>
                ) : (
                  "Delete Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
