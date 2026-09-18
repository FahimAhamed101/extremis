"use client";

import React, { useState, useEffect, useCallback } from "react";

interface FeedbackModalProps {
  initialDelayMs?: number;
  storageKey?: string;
}

const SOURCES = [
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E1306C",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "google",
    label: "Google Search",
    color: "#4285F4",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.053 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    color: "#0f1419",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    id: "other",
    label: "Other",
    color: "#6366F1",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
      </svg>
    ),
  },
];

export default function FeedbackModal({
  initialDelayMs = 2500,
  storageKey = "socimo_feedback_completed_v1",
}: FeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("facebook");
  const [otherText, setOtherText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if dismissed or previously completed
  useEffect(() => {
    try {
      const isDone = localStorage.getItem(storageKey);
      if (isDone) return;
    } catch {
      // ignore storage access issues
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, initialDelayMs);

    return () => clearTimeout(timer);
  }, [initialDelayMs, storageKey]);

  // Handle escape key to close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
      // Remember dismissal for this session so we don't harass the user
      localStorage.setItem(storageKey, "dismissed");
    } catch {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate quick feedback submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        localStorage.setItem(storageKey, "submitted");
      } catch {
        // ignore
      }

      // Auto-close after celebration
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modern-feedback-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="modern-feedback-modal">
        {/* Top Accent Gradient Bar */}
        <div className="modern-feedback-accent" />

        {/* Close Button */}
        <button
          type="button"
          className="modern-feedback-close-btn"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {isSubmitted ? (
          /* Success Screen */
          <div className="modern-feedback-success-card">
            <div className="modern-feedback-success-icon-wrap">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="modern-feedback-success-title">Thank You!</h3>
            <p className="modern-feedback-success-desc">
              Your feedback means a lot to us. We’ll use it to make Socimo even better for everyone.
            </p>
            <button
              type="button"
              className="modern-feedback-btn-primary"
              style={{ width: "100%", marginTop: "16px" }}
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          /* Form Content */
          <div className="modern-feedback-body">
            {/* Header */}
            <div className="modern-feedback-header">
              <span className="modern-feedback-badge">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Community Feedback
              </span>
              <h3 id="feedback-title" className="modern-feedback-title">
                We want to hear from you!
              </h3>
              <p className="modern-feedback-subtitle">
                Help us craft the best experience. Tell us what you need or how we can assist you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modern-feedback-form">
              {/* Question 1: What can we help with */}
              <div className="modern-feedback-group">
                <label className="modern-feedback-label" htmlFor="feedback-answer">
                  What are you looking for or struggling with right now?
                </label>
                <div className="modern-feedback-input-wrap">
                  <textarea
                    id="feedback-answer"
                    className="modern-feedback-textarea"
                    placeholder="Tell us what you'd like to see, what's confusing, or how we can help..."
                    rows={3}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                </div>
              </div>

              {/* Question 2: Referral Source */}
              <div className="modern-feedback-group">
                <label className="modern-feedback-label">
                  How did you hear about us?
                </label>
                <div className="modern-feedback-source-grid">
                  {SOURCES.map((source) => {
                    const isSelected = selectedSource === source.id;
                    return (
                      <button
                        key={source.id}
                        type="button"
                        className={`modern-feedback-source-card ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedSource(source.id)}
                      >
                        <span
                          className="modern-feedback-source-icon"
                          style={{ color: source.color }}
                        >
                          {source.icon}
                        </span>
                        <span className="modern-feedback-source-label">
                          {source.label}
                        </span>
                        <span className="modern-feedback-radio-dot">
                          {isSelected && <span className="modern-feedback-radio-inner" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Conditional "Other" Input */}
                {selectedSource === "other" && (
                  <div className="modern-feedback-other-wrap">
                    <label className="modern-feedback-other-label" htmlFor="other-source">
                      Please specify:
                    </label>
                    <input
                      type="text"
                      id="other-source"
                      className="modern-feedback-text-input"
                      placeholder="e.g. YouTube, Friend recommendation, LinkedIn..."
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="modern-feedback-actions">
                <button
                  type="button"
                  className="modern-feedback-btn-secondary"
                  onClick={handleClose}
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="modern-feedback-btn-primary"
                >
                  {isSubmitting ? (
                    <span className="modern-feedback-spinner-wrap">
                      <span className="modern-feedback-spinner" />
                      Submitting...
                    </span>
                  ) : (
                    <span>Submit Feedback</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
