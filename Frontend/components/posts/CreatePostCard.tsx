"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useCreatePostMutation, useGetMyProfileQuery, useUploadProfileAssetMutation } from "@/lib/services/authApi";

const FEELING_OPTIONS = [
  { label: "Happy", emoji: "😃", activity: "is feeling Happy" },
  { label: "Traveling", emoji: "✈️", activity: "is traveling" },
  { label: "Thinking", emoji: "💡", activity: "is thinking" },
  { label: "Loved", emoji: "💖", activity: "is feeling loved" },
  { label: "Studying", emoji: "🎓", activity: "is studying hard" },
  { label: "Celebrating", emoji: "🎉", activity: "is celebrating" },
  { label: "Excited", emoji: "⚡", activity: "is feeling excited" },
];

export default function CreatePostCard({ onPostCreated }: { onPostCreated?: () => void }) {
  const { data: profileData } = useGetMyProfileQuery();
  const [createPost, { isLoading: isPublishing }] = useCreatePostMutation();
  const [uploadAsset, { isLoading: isUploadingMedia }] = useUploadProfileAssetMutation();

  const [content, setContent] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [audience, setAudience] = useState<"public" | "only-friends" | "joined-groups">("public");
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  
  // Media attachment state
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  
  // Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userAvatar = profileData?.profile?.avatarUrl || "/images/resources/user.jpg";
  const userFirstName = profileData?.profile?.user?.firstName || "Danial";

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    setMediaType(isVideo ? "video" : "image");
    setMediaFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile && !linkUrl.trim()) {
      setErrorMessage("Please type a message or attach a photo/video before publishing.");
      return;
    }

    setErrorMessage(null);

    let finalAttachmentUrl: string | null = null;

    // 1. Upload media if selected
    if (mediaFile) {
      try {
        const uploadRes = await uploadAsset({
          file: mediaFile,
          kind: mediaType === "video" ? "video" : "post",
        }).unwrap();

        finalAttachmentUrl = uploadRes.url || mediaPreview;
      } catch {
        // Fallback to data URL so posting always succeeds
        finalAttachmentUrl = mediaPreview;
      }
    }

    // 2. Prepare payload
    const feelingMeta = FEELING_OPTIONS.find((f) => f.label === selectedFeeling);
    const postPayload = {
      content: content.trim() || (mediaFile ? (mediaType === "image" ? "Shared a photo" : "Shared a video") : "Shared a link"),
      postType: mediaType === "video" ? ("video" as const) : mediaFile ? ("image" as const) : linkUrl.trim() ? ("link" as const) : ("custom" as const),
      attachmentUrl: finalAttachmentUrl,
      attachmentType: mediaFile ? mediaType : null,
      displayImageUrl: mediaType === "image" ? finalAttachmentUrl : null,
      linkUrl: linkUrl.trim() || null,
      feeling: selectedFeeling || null,
      activityLabel: feelingMeta?.activity || null,
      audience,
      activityFeed: true,
      commentsOpen: true,
    };

    try {
      await createPost(postPayload).unwrap();

      // Reset form
      setContent("");
      setSelectedFeeling(null);
      setShowFeelingPicker(false);
      setShowLinkInput(false);
      setLinkUrl("");
      removeMedia();

      setToastMessage("Your post has been published successfully!");
      setTimeout(() => setToastMessage(null), 4000);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Failed to publish post. Please try again.");
    }
  };

  return (
    <div className="main-wraper" style={{ marginBottom: "20px" }}>
      <span className="new-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <i className="icofont-edit" style={{ color: "#088dcd" }}></i> Create New Post
      </span>

      {toastMessage && (
        <div
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "14px",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
          }}
        >
          <span>
            <i className="icofont-check-circled" style={{ marginRight: "6px" }}></i> {toastMessage}
          </span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px" }}
          >
            &times;
          </button>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "14px",
            fontSize: "14px",
            border: "1px solid #fca5a5",
          }}
        >
          <i className="icofont-warning-alt" style={{ marginRight: "6px" }}></i> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
          <img
            src={userAvatar}
            alt={userFirstName}
            style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/resources/user.jpg";
            }}
          />
          <div style={{ flex: 1, position: "relative" }}>
            <textarea
              rows={3}
              placeholder={`What's on your mind, ${userFirstName}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "15px",
                lineHeight: "1.5",
                resize: "none",
                outline: "none",
                transition: "border-color 0.2s",
                background: "#f8fafc",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#088dcd";
                e.currentTarget.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#f8fafc";
              }}
            />
          </div>
        </div>

        {/* Selected feeling badge */}
        {selectedFeeling && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#e0f2fe",
              color: "#0369a1",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            <span>
              Feeling {selectedFeeling} {FEELING_OPTIONS.find((f) => f.label === selectedFeeling)?.emoji}
            </span>
            <button
              type="button"
              onClick={() => setSelectedFeeling(null)}
              style={{ background: "none", border: "none", color: "#0369a1", cursor: "pointer", padding: "0 2px" }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Link Input Row */}
        {showLinkInput && (
          <div style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="url"
              placeholder="Paste YouTube or article URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={{
                flex: 1,
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Feeling Picker Drawer */}
        {showFeelingPicker && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              background: "#f1f5f9",
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "14px",
            }}
          >
            {FEELING_OPTIONS.map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => {
                  setSelectedFeeling(f.label);
                  setShowFeelingPicker(false);
                }}
                style={{
                  background: selectedFeeling === f.label ? "#088dcd" : "#fff",
                  color: selectedFeeling === f.label ? "#fff" : "#1e293b",
                  border: "1px solid #cbd5e1",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.15s",
                }}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Media Preview Box */}
        {mediaPreview && (
          <div
            style={{
              position: "relative",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "14px",
              background: "#000",
              maxHeight: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mediaType === "image" ? (
              <img src={mediaPreview} alt="Preview" style={{ maxHeight: "320px", width: "auto", maxWidth: "100%", objectFit: "contain" }} />
            ) : (
              <video controls src={mediaPreview} style={{ maxHeight: "320px", width: "100%" }} />
            )}
            <button
              type="button"
              onClick={removeMedia}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0, 0, 0, 0.7)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "16px",
              }}
              title="Remove attachment"
            >
              &times;
            </button>
          </div>
        )}

        {/* Action toolbar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "10px",
            borderTop: "1px solid #f1f5f9",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              style={{ display: "none" }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "500",
                color: "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <img src="/images/image.png" alt="" style={{ width: "18px", height: "18px" }} />
              <span>Photo/Video</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFeelingPicker(!showFeelingPicker)}
              style={{
                background: showFeelingPicker ? "#e0f2fe" : "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "500",
                color: showFeelingPicker ? "#0369a1" : "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <img src="/images/activity.png" alt="" style={{ width: "18px", height: "18px" }} />
              <span>Feeling/Activity</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLinkInput(!showLinkInput)}
              style={{
                background: showLinkInput ? "#e0f2fe" : "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "500",
                color: showLinkInput ? "#0369a1" : "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className="icofont-link" style={{ fontSize: "15px", color: "#088dcd" }}></i>
              <span>Link</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Audience Select */}
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "13px",
                color: "#475569",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="public">🌐 Public</option>
              <option value="only-friends">👥 Only Friends</option>
              <option value="joined-groups">🏷️ Joined Groups</option>
            </select>

            {/* Publish Button */}
            <button
              type="submit"
              disabled={isPublishing || isUploadingMedia || (!content.trim() && !mediaFile && !linkUrl.trim())}
              style={{
                background: isPublishing || isUploadingMedia ? "#94a3b8" : "linear-gradient(135deg, #088dcd 0%, #0284c7 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "7px 20px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isPublishing || isUploadingMedia ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(8, 141, 205, 0.3)",
                transition: "all 0.2s",
              }}
            >
              {isPublishing || isUploadingMedia ? (
                <>
                  <span className="spinner-border spinner-border-sm" style={{ width: "14px", height: "14px", border: "2px solid #fff", borderRightColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.75s linear infinite" }}></span>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <i className="icofont-paper-plane"></i>
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
