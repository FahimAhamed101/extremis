"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef, useCallback } from "react";
import type { StoryItem } from "@/lib/services/authApi";
import { useViewStoryMutation, useDeleteStoryMutation } from "@/lib/services/authApi";

type StoryViewerModalProps = {
  stories: StoryItem[];
  initialIndex?: number;
  onClose: () => void;
};

export default function StoryViewerModal({
  stories,
  initialIndex = 0,
  onClose,
}: StoryViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [viewStory] = useViewStoryMutation();
  const [deleteStory, { isLoading: isDeleting }] = useDeleteStoryMutation();

  const currentStory = stories[currentIndex];
  const videoRef = useRef<HTMLVideoElement>(null);
  const DURATION_MS = 5000; // 5 seconds per slide

  // Mark viewed when story changes
  useEffect(() => {
    if (currentStory && !currentStory.isViewed) {
      viewStory(currentStory.id);
    }
    setProgress(0);
  }, [currentStory, viewStory]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Progress timer
  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " ") setIsPaused((p) => !p);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await deleteStory(currentStory.id).unwrap();
      handleNext();
    } catch {
      alert("Failed to delete story.");
    }
  };

  if (!currentStory) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(10px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Main Story Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          height: "90vh",
          maxHeight: "820px",
          backgroundColor: "#000000",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars at the top */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            right: "14px",
            display: "flex",
            gap: "5px",
            zIndex: 30,
          }}
        >
          {stories.map((s, idx) => {
            let width = "0%";
            if (idx < currentIndex) width = "100%";
            else if (idx === currentIndex) width = `${progress}%`;

            return (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: "3.5px",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width,
                    backgroundColor: "#ffffff",
                    transition: idx === currentIndex ? "width 0.05s linear" : "none",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Header */}
        <div
          style={{
            position: "absolute",
            top: "26px",
            left: "14px",
            right: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 30,
            padding: "4px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={currentStory.authorAvatar || "/images/resources/user.jpg"}
              alt={currentStory.authorName}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            />
            <div>
              <div style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                {currentStory.authorName}
              </div>
              <div style={{ color: "#cbd5e1", fontSize: "11px", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                {currentStory.authorHeadline || "Researcher"} • 24h Story
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Delete button if mine */}
            {currentStory.isMine && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete your story"
                style={{
                  background: "rgba(239, 68, 68, 0.8)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "16px",
                cursor: "pointer",
                backdropFilter: "blur(4px)",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
          }}
        >
          {currentStory.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={currentStory.mediaUrl}
              autoPlay
              playsInline
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt={currentStory.caption || "Story"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Left / Right click zones for navigation */}
          <div
            style={{
              position: "absolute",
              top: "70px",
              bottom: "90px",
              left: 0,
              width: "35%",
              cursor: "pointer",
              zIndex: 25,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "70px",
              bottom: "90px",
              right: 0,
              width: "35%",
              cursor: "pointer",
              zIndex: 25,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />
        </div>

        {/* Story Caption Footer */}
        {currentStory.caption && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "24px 20px 20px",
              background: "linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%)",
              zIndex: 30,
              color: "#ffffff",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.45,
                fontWeight: 500,
                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
              }}
            >
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>

      {/* Outer Next / Prev Chevrons on Desktop */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentIndex === 0}
        style={{
          position: "absolute",
          left: "calc(50% - 280px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          fontSize: "20px",
          cursor: currentIndex === 0 ? "default" : "pointer",
          opacity: currentIndex === 0 ? 0.3 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(6px)",
          zIndex: 40,
        }}
      >
        ❮
      </button>

      <button
        type="button"
        onClick={handleNext}
        style={{
          position: "absolute",
          right: "calc(50% - 280px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          fontSize: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(6px)",
          zIndex: 40,
        }}
      >
        ❯
      </button>
    </div>
  );
}
