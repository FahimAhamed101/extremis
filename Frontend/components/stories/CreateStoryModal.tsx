"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import { useCreateStoryMutation, useUploadProfileAssetMutation } from "@/lib/services/authApi";

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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreateStoryModal({ onClose, onCreated }: CreateStoryModalProps) {
  const [sourceMode, setSourceMode] = useState<"upload" | "url">("upload");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadAsset, { isLoading: isUploading }] = useUploadProfileAssetMutation();
  const [createStory, { isLoading: isPublishing }] = useCreateStoryMutation();

  const isSubmitting = isUploading || isPublishing;

  // Cleanup object URL when preview changes or modal unmounts
  useEffect(() => {
    return () => {
      if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleProcessFile = (file: File | null) => {
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError("File exceeds 50MB limit. Please choose a smaller file.");
      return;
    }

    const isVideoFile = file.type.startsWith("video/");
    const isImageFile = file.type.startsWith("image/");

    if (!isVideoFile && !isImageFile) {
      setError("Please select a valid image (JPG, PNG, WEBP, GIF) or video (MP4, WebM) file.");
      return;
    }

    // Auto-detect media type
    if (isVideoFile) {
      setMediaType("video");
    } else if (isImageFile) {
      setMediaType("image");
    }

    if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setFilePreviewUrl(localUrl);
    setError(null);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleProcessFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleProcessFile(file);
  };

  const clearSelectedFile = () => {
    const oldUrl = filePreviewUrl;
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (oldUrl && oldUrl.startsWith("blob:")) {
      window.setTimeout(() => {
        try {
          URL.revokeObjectURL(oldUrl);
        } catch {
          // ignore
        }
      }, 500);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let finalMediaUrl = "";
    let finalMediaType = mediaType;

    if (sourceMode === "upload") {
      if (!selectedFile) {
        setError("Please choose or drag an image or video file to share your story.");
        return;
      }

      try {
        setUploadStatus("Uploading media to cloud storage...");
        const uploadResult = await uploadAsset({
          file: selectedFile,
          kind: "story",
        }).unwrap();

        if (!uploadResult?.url) {
          throw new Error("Upload succeeded but did not return a valid media URL.");
        }

        finalMediaUrl = uploadResult.url;
        if (uploadResult.resourceType === "video" || selectedFile.type.startsWith("video/")) {
          finalMediaType = "video";
        } else {
          finalMediaType = "image";
        }
      } catch (err: unknown) {
        setUploadStatus(null);
        const errMsg = err && typeof err === "object" && "data" in err && (err as { data?: { message?: string } }).data?.message
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to upload file. Please verify your connection or try a smaller file.";
        setError(String(errMsg));
        return;
      }
    } else {
      if (!mediaUrl.trim()) {
        setError("Please provide an image or video URL for your story.");
        return;
      }
      finalMediaUrl = mediaUrl.trim();
    }

    try {
      setUploadStatus("Publishing 24-hour story...");
      await createStory({
        mediaUrl: finalMediaUrl,
        mediaType: finalMediaType,
        caption: caption.trim(),
      }).unwrap();

      setUploadStatus(null);
      if (onCreated) onCreated();
      onClose();
    } catch {
      setUploadStatus(null);
      setError("Failed to publish story. Please check your connection and try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.82)",
        backdropFilter: "blur(8px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "22px" }}>⚡</span>
            <div>
              <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                Share 24-Hour Story
              </h4>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgba(255, 255, 255, 0.85)" }}>
                Upload photos or research demo videos visible for 24 hours
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#ffffff",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#b91c1c",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Source Mode Tabs (Upload File vs Media URL) */}
            <div
              style={{
                display: "flex",
                background: "#f1f5f9",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "16px",
                gap: "4px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setSourceMode("upload");
                  setError(null);
                }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "9px",
                  border: "none",
                  background: sourceMode === "upload" ? "#ffffff" : "transparent",
                  color: sourceMode === "upload" ? "#0284c7" : "#64748b",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: sourceMode === "upload" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                <span>📁</span>
                <span>Upload from Device</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSourceMode("url");
                  setError(null);
                }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "9px",
                  border: "none",
                  background: sourceMode === "url" ? "#ffffff" : "transparent",
                  color: sourceMode === "url" ? "#0284c7" : "#64748b",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: sourceMode === "url" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
              >
                <span>🔗</span>
                <span>Link & Presets</span>
              </button>
            </div>

            {/* Media Type Toggle */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>
                Story Media Format
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType("image");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>📷</span>
                  <span>Photo Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType("video");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>🎥</span>
                  <span>Video Story (MP4)</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Direct File Upload */}
            {sourceMode === "upload" && (
              <div style={{ marginBottom: "16px" }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept={
                    mediaType === "video"
                      ? "video/mp4,video/webm,video/quicktime,video/*"
                      : "image/png,image/jpeg,image/jpg,image/webp,image/gif,image/*"
                  }
                  style={{ display: "none" }}
                />

                {!selectedFile ? (
                  /* Dropzone Area */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: isDragging ? "2px dashed #0284c7" : "2px dashed #93c5fd",
                      borderRadius: "14px",
                      padding: "26px 16px",
                      textAlign: "center",
                      backgroundColor: isDragging ? "#e0f2fe" : "#f8fafc",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        backgroundColor: "#e0f2fe",
                        color: "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)",
                      }}
                    >
                      {mediaType === "video" ? "📹" : "📸"}
                    </div>
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                        Click to select or drag & drop{" "}
                        <span style={{ color: "#0284c7" }}>
                          {mediaType === "video" ? "a video" : "a photo"}
                        </span>
                      </span>
                    </div>
                    <span style={{ fontSize: "11.5px", color: "#64748b" }}>
                      {mediaType === "video"
                        ? "Supports MP4, WebM, QuickTime up to 50MB"
                        : "Supports JPG, PNG, WEBP, GIF up to 50MB"}
                    </span>
                    <button
                      type="button"
                      style={{
                        marginTop: "6px",
                        padding: "6px 16px",
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#0369a1",
                        pointerEvents: "none",
                      }}
                    >
                      Browse Device Files
                    </button>
                  </div>
                ) : (
                  /* Selected File & Live Preview Card */
                  <div
                    style={{
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "14px",
                      overflow: "hidden",
                      backgroundColor: "#0f172a",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        height: "210px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#000000",
                      }}
                    >
                      {mediaType === "video" && filePreviewUrl ? (
                        <video
                          key={filePreviewUrl}
                          src={filePreviewUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : filePreviewUrl ? (
                        <img
                          src={filePreviewUrl}
                          alt="Story Preview"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : null}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={clearSelectedFile}
                        title="Remove file"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: "rgba(0, 0, 0, 0.7)",
                          color: "#ffffff",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          zIndex: 10,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* File Meta footer */}
                    <div
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "#ffffff",
                        borderTop: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                        <span
                          style={{
                            background: mediaType === "video" ? "#fef3c7" : "#e0f2fe",
                            color: mediaType === "video" ? "#b45309" : "#0369a1",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            flexShrink: 0,
                          }}
                        >
                          {mediaType === "video" ? "🎥 Video" : "📷 Photo"}
                        </span>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#1e293b",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {selectedFile.name}
                        </span>
                        <span style={{ color: "#64748b", flexShrink: 0 }}>
                          ({formatFileSize(selectedFile.size)})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#0284c7",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "12px",
                          flexShrink: 0,
                          padding: "2px 6px",
                        }}
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: URL & Quick Presets */}
            {sourceMode === "url" && (
              <>
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

                {/* Live Preview for URL */}
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
              </>
            )}

            {/* Caption */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#334155" }}>
                  Story Caption (Optional)
                </label>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {caption.length}/120
                </span>
              </div>
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

            {/* Upload status banner */}
            {uploadStatus && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#1d4ed8",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span className="spinner-border spinner-border-sm" role="status" style={{ width: "14px", height: "14px" }} />
                <span>{uploadStatus}</span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  padding: "9px 18px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (sourceMode === "upload" && !selectedFile) || (sourceMode === "url" && !mediaUrl.trim())}
                style={{
                  padding: "9px 24px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    isSubmitting || (sourceMode === "upload" && !selectedFile) || (sourceMode === "url" && !mediaUrl.trim())
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  cursor:
                    isSubmitting || (sourceMode === "upload" && !selectedFile) || (sourceMode === "url" && !mediaUrl.trim())
                      ? "not-allowed"
                      : "pointer",
                  boxShadow:
                    isSubmitting || (sourceMode === "upload" && !selectedFile) || (sourceMode === "url" && !mediaUrl.trim())
                      ? "none"
                      : "0 4px 12px rgba(2, 132, 199, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm" role="status" style={{ width: "14px", height: "14px" }} />
                )}
                <span>
                  {isUploading
                    ? "Uploading media..."
                    : isPublishing
                    ? "Publishing story..."
                    : "Post Story"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
