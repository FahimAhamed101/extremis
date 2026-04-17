"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import {
  type PostAudience,
  useCreatePostMutation,
  useUploadProfileAssetMutation,
} from "@/lib/services/authApi";

type CategoryAction = "file" | "link" | "content";

type CategoryItem = {
  iconClass: string;
  label: string;
  action: CategoryAction;
};

const categoryItems: CategoryItem[] = [
  { iconClass: "icofont-camera", label: "Photo / Video", action: "file" },
  { iconClass: "icofont-google-map", label: "Post Location", action: "content" },
  { iconClass: "icofont-file-gif", label: "Post Gif", action: "file" },
  { iconClass: "icofont-ui-tag", label: "Tag to Friend", action: "content" },
  { iconClass: "icofont-users", label: "Share in Group", action: "content" },
  { iconClass: "icofont-link", label: "Share Link", action: "link" },
  { iconClass: "icofont-video-cam", label: "Go Live", action: "content" },
  { iconClass: "icofont-sale-discount", label: "Post Online Course", action: "content" },
  { iconClass: "icofont-read-book", label: "Post A Book", action: "file" },
  { iconClass: "icofont-globe", label: "Post an Ad", action: "content" },
];

const audienceOptions: Array<{
  id: string;
  value: PostAudience;
  iconClass: string;
  label: string;
}> = [
  { id: "post-audience-public", value: "public", iconClass: "icofont-globe-alt", label: "Public" },
  { id: "post-audience-private", value: "private", iconClass: "icofont-lock", label: "Private" },
  {
    id: "post-audience-specific-friend",
    value: "specific-friend",
    iconClass: "icofont-user",
    label: "Specific Friend",
  },
  { id: "post-audience-only-friends", value: "only-friends", iconClass: "icofont-star", label: "Only Friends" },
  {
    id: "post-audience-joined-groups",
    value: "joined-groups",
    iconClass: "icofont-users-alt-3",
    label: "Joined Groups",
  },
];

function getMutationMessage(error: unknown): string {
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

  return "The post could not be published right now.";
}

function getAttachmentType(file: File): "image" | "video" | "file" {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  return "file";
}

function closeCreatePostPopup() {
  if (typeof document === "undefined") {
    return;
  }

  document.querySelectorAll(".post-new-popup").forEach((element) => {
    element.classList.remove("active");
  });
}

function getEmojiAreaInstance() {
  if (typeof window === "undefined") {
    return null;
  }

  const maybeWindow = window as typeof window & {
    jQuery?: ((selector: string) => { data?: (key: string) => unknown }) | undefined;
  };
  const $ = maybeWindow.jQuery;
  if (typeof $ !== "function") {
    return null;
  }

  const instance = $("#emojionearea1")?.data?.("emojioneArea");
  return instance && typeof instance === "object"
    ? (instance as { getText?: () => string; setText?: (value: string) => void })
    : null;
}

export default function CreatePostModal() {
  const activityCheckboxId = useId();
  const storyCheckboxId = useId();
  const closeTimerRef = useRef<number | null>(null);
  const contentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const scheduleInputRef = useRef<HTMLInputElement | null>(null);
  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [audience, setAudience] = useState<PostAudience>("joined-groups");
  const [activityFeed, setActivityFeed] = useState(true);
  const [myStory, setMyStory] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"error" | "success" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadAsset] = useUploadProfileAssetMutation();
  const [createPost] = useCreatePostMutation();

  useEffect(() => {
    return () => {
      clearPendingClose();
    };
  }, []);

  const clearPendingClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const resetForm = () => {
    clearPendingClose();
    setAudience("joined-groups");
    setActivityFeed(true);
    setMyStory(true);
    setSelectedFile(null);
    setIsDragging(false);
    setStatusMessage(null);
    setStatusType(null);
    setIsSubmitting(false);

    const emojiArea = getEmojiAreaInstance();
    if (emojiArea?.setText) {
      emojiArea.setText("");
    } else if (contentInputRef.current) {
      contentInputRef.current.value = "";
    }

    if (scheduleInputRef.current) {
      scheduleInputRef.current.value = "";
    }

    if (linkInputRef.current) {
      linkInputRef.current.value = "";
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = (event?: MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    resetForm();
    closeCreatePostPopup();
  };

  const handleSelectedFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusType("error");
      setStatusMessage("Files must be 10MB or smaller.");
      return;
    }

    setSelectedFile(file);
    setStatusType(null);
    setStatusMessage(null);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSelectedFile(event.target.files?.[0] || null);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleSelectedFile(event.dataTransfer.files?.[0] || null);
  };

  const handleCategoryAction = (action: CategoryAction) => {
    setStatusType(null);
    setStatusMessage(null);

    if (action === "file") {
      fileInputRef.current?.click();
      return;
    }

    if (action === "link") {
      linkInputRef.current?.focus();
      return;
    }

    contentInputRef.current?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearPendingClose();
    setIsSubmitting(true);
    setStatusType(null);
    setStatusMessage(null);

    try {
      const emojiArea = getEmojiAreaInstance();
      const content = String(emojiArea?.getText?.() || contentInputRef.current?.value || "").trim();
      const linkUrl = String(linkInputRef.current?.value || "").trim();
      const scheduledFor = String(scheduleInputRef.current?.value || "").trim();

      let attachmentUrl: string | undefined;
      let attachmentType: "image" | "video" | "file" | undefined;
      let attachmentName: string | undefined;

      if (selectedFile) {
        const uploaded = await uploadAsset({ file: selectedFile, kind: "post" }).unwrap();
        attachmentUrl = uploaded.url;
        attachmentType = getAttachmentType(selectedFile);
        attachmentName = selectedFile.name;
      }

      const response = await createPost({
        content,
        linkUrl: linkUrl || undefined,
        attachmentUrl,
        attachmentType,
        attachmentName,
        audience,
        activityFeed,
        myStory,
        scheduledFor: scheduledFor || undefined,
      }).unwrap();

      setStatusType("success");
      setStatusMessage(response.message);
      closeTimerRef.current = window.setTimeout(() => {
        resetForm();
        closeCreatePostPopup();
      }, 800);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(getMutationMessage(error));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <div className="post-new-popup">
      <div className="popup" style={{ width: "800px" }}>
        <span className="popup-closed" onClick={handleClose}>
          <i className="icofont-close"></i>
        </span>
        <div className="popup-meta">
          <div className="popup-head">
            <h5>
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
                  className="feather feather-plus"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </i>
              Create New Post
            </h5>
          </div>
          <div className="post-new">
            <div className="post-newmeta">
              <ul className="post-categoroes">
                {categoryItems.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="post-category-trigger"
                      onClick={() => handleCategoryAction(item.action)}
                    >
                      <i className={item.iconClass}></i> {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <input
                ref={fileInputRef}
                className="profile-media-input"
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className={`dropzone create-post-dropzone${isDragging ? " is-dragging" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <div className="fallback">
                  <span>{selectedFile ? selectedFile.name : "Drop files here to upload"}</span>
                  <small className="upload-hint">
                    {selectedFile ? "Ready to upload with your post" : "Click or drag a file here"}
                  </small>
                </div>
              </button>
            </div>
            <form method="post" className="c-form" onSubmit={handleSubmit}>
              <textarea ref={contentInputRef} id="emojionearea1" placeholder="What's On Your Mind?"></textarea>
              <div className="activity-post">
                <div className="checkbox">
                  <input
                    type="checkbox"
                    id={activityCheckboxId}
                    checked={activityFeed}
                    onChange={(event) => setActivityFeed(event.target.checked)}
                  />
                  <label htmlFor={activityCheckboxId}>
                    <span>Activity Feed</span>
                  </label>
                </div>
                <div className="checkbox">
                  <input
                    type="checkbox"
                    id={storyCheckboxId}
                    checked={myStory}
                    onChange={(event) => setMyStory(event.target.checked)}
                  />
                  <label htmlFor={storyCheckboxId}>
                    <span>My Story</span>
                  </label>
                </div>
              </div>
              <div className="select-box">
                <div className="select-box__current" tabIndex={1}>
                  {audienceOptions.map((option) => (
                    <div className="select-box__value" key={option.id}>
                      <input
                        className="select-box__input"
                        type="radio"
                        id={option.id}
                        value={option.value}
                        name="postAudience"
                        checked={audience === option.value}
                        onChange={() => setAudience(option.value)}
                      />
                      <p className="select-box__input-text">
                        <i className={option.iconClass}></i> {option.label}
                      </p>
                    </div>
                  ))}
                  <img className="select-box__icon" src="/images/arrow-down.svg" alt="Arrow Icon" aria-hidden="true" />
                </div>
                <ul className="select-box__list">
                  {audienceOptions.map((option) => (
                    <li key={`${option.id}-option`}>
                      <label className="select-box__option" htmlFor={option.id}>
                        <i className={option.iconClass}></i> {option.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <input
                ref={scheduleInputRef}
                className="schedule-btn"
                type="text"
                id="create-post-schedule"
                placeholder="Schedule Post"
              />
              <input
                ref={linkInputRef}
                type="text"
                placeholder="https://www.youtube.com/watch?v=vgvsuiFlA-Y&t=56s"
              />
              {statusMessage ? (
                <p className={`create-post-status${statusType === "error" ? " is-error" : " is-success"}`}>
                  {statusMessage}
                </p>
              ) : null}
              <button type="submit" className="main-btn" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
