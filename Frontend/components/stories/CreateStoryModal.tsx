"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useCreateStoryMutation } from "@/lib/services/authApi";

type CreateStoryModalProps = {
  onClose: () => void;
  onCreated?: () => void;
};

const SAMPLE_MEDIA_PRESETS = [
  {
    name: "Lab Research",
    url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1080&q=80",
    type: "image" as const,
  },
  {
    name: "Campus Library",
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1080&q=80",
    type: "image" as const,
  },
  {
    name: "Field Work",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80",
    type: "image" as const,
  },
  {
    name: "Tech Demo (Video)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    type: "video" as const,
  },
];

export default function CreateStoryModal({ onClose, onCreated }: CreateStoryModalProps) {
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [createStory, { isLoading }] = useCreateStoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) {
      setError("Please provide an image or video URL for your story.");
      return;
    }

    setError(null);
    try {
      await createStory({
        mediaUrl: mediaUrl.trim(),
        mediaType,
        caption: caption.trim(),
      }).unwrap();

      if (onCreated) onCreated();
      onClose();
    } catch {
      setError("Failed to publish story. Please check your connection.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "520px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>⚡</span>
            <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
              Share 24-Hour Story
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#ffffff",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {/* Media Type Toggle */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
              Media Type
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setMediaType("image")}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "10px",
                  border: mediaType === "image" ? "2px solid #0284c7" : "1.5px solid #cbd5e1",
                  background: mediaType === "image" ? "#f0f9ff" : "#ffffff",
                  color: mediaType === "image" ? "#0369a1" : "#475569",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                📷 Photo Story
              </button>
              <button
                type="button"
                onClick={() => setMediaType("video")}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "10px",
                  border: mediaType === "video" ? "2px solid #0284c7" : "1.5px solid #cbd5e1",
                  background: mediaType === "video" ? "#f0f9ff" : "#ffffff",
                  color: mediaType === "video" ? "#0369a1" : "#475569",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                🎥 Video Story (MP4)
              </button>
            </div>
          </div>

          {/* Media URL Input */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
              {mediaType === "video" ? "Video URL (Direct .mp4 link)" : "Image URL (Unsplash or direct image link)"}
            </label>
            <input
              type="url"
              placeholder={
                mediaType === "video"
                  ? "https://commondatastorage.googleapis.com/.../video.mp4"
                  : "https://images.unsplash.com/photo-..."
              }
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11.5px", color: "#64748b", marginBottom: "6px" }}>
              Quick presets:
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {SAMPLE_MEDIA_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMediaUrl(preset.url);
                    setMediaType(preset.type);
                  }}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#0369a1",
                    cursor: "pointer",
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          {mediaUrl && (
            <div
              style={{
                marginBottom: "16px",
                borderRadius: "12px",
                overflow: "hidden",
                height: "180px",
                backgroundColor: "#0f172a",
                position: "relative",
              }}
            >
              {mediaType === "video" ? (
                <video
                  src={mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setError("Could not load preview. Please verify media URL.")}
                />
              )}
            </div>
          )}

          {/* Caption */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
              Story Caption (Optional)
            </label>
            <input
              type="text"
              placeholder="What are you researching or exploring today? 🔬✨"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={120}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 18px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "9px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.35)",
              }}
            >
              {isLoading ? "Publishing..." : "Post Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
