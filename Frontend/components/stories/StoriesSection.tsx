"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useGetStoriesQuery, type StoryItem } from "@/lib/services/authApi";
import StoryViewerModal from "./StoryViewerModal";
import CreateStoryModal from "./CreateStoryModal";

export default function StoriesSection() {
  const { data, isLoading, refetch } = useGetStoriesQuery();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const stories: StoryItem[] = data?.stories || [];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "16px 18px",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
        marginBottom: "20px",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#0284c7",
              boxShadow: "0 0 8px #0284c7",
            }}
          />
          <h5 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
            24h Stories & Research Updates
          </h5>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          style={{
            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "20px",
            padding: "5px 14px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(2, 132, 199, 0.35)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>+ Add Story</span>
        </button>
      </div>

      {/* Stories Carousel */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Create Story Card */}
        <div
          onClick={() => setIsCreateOpen(true)}
          style={{
            flex: "0 0 112px",
            height: "168px",
            borderRadius: "14px",
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            background: "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)",
            border: "2px dashed #38bdf8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            textAlign: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.borderColor = "#0284c7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "#38bdf8";
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.4)",
              marginBottom: "10px",
            }}
          >
            +
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#0369a1", lineHeight: 1.2 }}>
            Your Story
          </span>
          <span style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>
            Share photo or video
          </span>
        </div>

        {/* Stories from database/seed */}
        {isLoading ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span>Loading stories...</span>
          </div>
        ) : (
          stories.map((story, idx) => {
            const isVideo = story.mediaType === "video";

            return (
              <div
                key={story.id}
                onClick={() => setSelectedStoryIndex(idx)}
                style={{
                  flex: "0 0 112px",
                  height: "168px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  backgroundColor: "#0f172a",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(2, 132, 199, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                }}
              >
                {/* Media Preview */}
                {isVideo ? (
                  <video
                    src={story.mediaUrl}
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={story.mediaUrl}
                    alt={story.authorName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Dark Vignette Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)",
                  }}
                />

                {/* Author Avatar with Glowing Gradient Border */}
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    padding: "2px",
                    background: story.isViewed
                      ? "rgba(255, 255, 255, 0.5)"
                      : "linear-gradient(135deg, #06b6d4 0%, #0284c7 50%, #8b5cf6 100%)",
                    boxShadow: story.isViewed ? "none" : "0 0 10px rgba(2, 132, 199, 0.6)",
                  }}
                >
                  <img
                    src={story.authorAvatar || "/images/resources/user.jpg"}
                    alt={story.authorName}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid #ffffff",
                    }}
                  />
                </div>

                {/* Video Badge */}
                {isVideo && (
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(239, 68, 68, 0.9)",
                      color: "#ffffff",
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 5px",
                      borderRadius: "6px",
                    }}
                  >
                    ▶
                  </span>
                )}

                {/* Author Name at the bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "8px",
                    right: "8px",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    lineHeight: 1.25,
                    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {story.authorName}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => {
            setSelectedStoryIndex(null);
            refetch();
          }}
        />
      )}

      {/* Create Story Modal */}
      {isCreateOpen && (
        <CreateStoryModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => refetch()}
        />
      )}
    </div>
  );
}
