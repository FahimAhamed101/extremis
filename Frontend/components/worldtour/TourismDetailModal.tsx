"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import type { TourismPlaceItem } from "@/lib/services/authApi";

type TourismDetailModalProps = {
  place: TourismPlaceItem;
  onClose: () => void;
  onEdit?: (place: TourismPlaceItem) => void;
  onDelete?: (placeId: string) => void;
  isDeleting?: boolean;
};

export default function TourismDetailModal({
  place,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}: TourismDetailModalProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<"video" | "images">(
    place.videoUrl ? "video" : "images",
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images =
    Array.isArray(place.images) && place.images.length > 0
      ? place.images
      : place.coverImage
      ? [place.coverImage]
      : ["/images/resources/user.jpg"];

  // Helper to render video
  const renderVideoPlayer = (url: string) => {
    // Check if YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`}
          title={place.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "380px", border: "none", borderRadius: "14px" }}
        />
      );
    }

    // Standard HTML5 video
    return (
      <video
        src={url}
        controls
        autoPlay
        playsInline
        style={{
          width: "100%",
          maxHeight: "400px",
          borderRadius: "14px",
          backgroundColor: "#000000",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        }}
      >
        Your browser does not support HTML5 video.
      </video>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
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
          maxWidth: "860px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          position: "relative",
          animation: "modalFadeIn 0.25s ease-out",
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            background: "#ffffff",
            zIndex: 10,
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                background: "#e0f2fe",
                color: "#0369a1",
                padding: "3px 10px",
                borderRadius: "20px",
                display: "inline-block",
                marginBottom: "4px",
              }}
            >
              {place.category} tourism
            </span>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>
              {place.title}
            </h3>
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              📍 {place.location}, {place.country}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              color: "#475569",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Media Switcher Tabs (if video is available) */}
          {place.videoUrl && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button
                type="button"
                onClick={() => setActiveMediaTab("video")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeMediaTab === "video" ? "#0284c7" : "#f1f5f9",
                  color: activeMediaTab === "video" ? "#ffffff" : "#475569",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>▶ Watch Video</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab("images")}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: activeMediaTab === "images" ? "#0284c7" : "#f1f5f9",
                  color: activeMediaTab === "images" ? "#ffffff" : "#475569",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>📷 Photos ({images.length})</span>
              </button>
            </div>
          )}

          {/* Media Display */}
          <div style={{ marginBottom: "20px" }}>
            {activeMediaTab === "video" && place.videoUrl ? (
              renderVideoPlayer(place.videoUrl)
            ) : (
              <div>
                {/* Main Large Image */}
                <div style={{ borderRadius: "14px", overflow: "hidden", height: "360px", marginBottom: "10px" }}>
                  <img
                    src={images[selectedImageIndex] || images[0]}
                    alt={place.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: "72px",
                          height: "54px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: selectedImageIndex === idx ? "2.5px solid #0284c7" : "1.5px solid #e2e8f0",
                          flexShrink: 0,
                        }}
                      >
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Place Description */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
              About this destination
            </h4>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              {place.description}
            </p>
          </div>

          {/* Highlights & Best Time */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "14px",
              padding: "16px",
              borderRadius: "14px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              marginBottom: "24px",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0284c7", textTransform: "uppercase" }}>
                ⭐ Must-See Highlights
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                {place.highlights && place.highlights.length > 0 ? (
                  place.highlights.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "12px",
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        color: "#334155",
                      }}
                    >
                      {h}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Scenic views & local culture</span>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0284c7", textTransform: "uppercase" }}>
                📅 Best Season to Visit
              </div>
              <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#334155", fontWeight: 600 }}>
                {place.bestTimeToVisit || "Year-round"}
              </p>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                Coordinates: {place.coordinates.lat.toFixed(4)}°, {place.coordinates.lng.toFixed(4)}°
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              paddingTop: "14px",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <Link
              href={`/nearby?lat=${place.coordinates.lat}&lng=${place.coordinates.lng}&location=${encodeURIComponent(
                place.title,
              )}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
              }}
            >
              <span>📍 Find People & Researchers Near Here</span>
            </Link>

            {/* Author Edit / Delete Controls */}
            {place.isMyPost && (
              <div style={{ display: "flex", gap: "8px" }}>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(place)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#f8fafc",
                      color: "#334155",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Edit Post
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this tourism place?")) {
                        onDelete(place.id);
                      }
                    }}
                    disabled={isDeleting}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: "none",
                      background: "#ef4444",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {isDeleting ? "Deleting..." : "🗑️ Delete Post"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
