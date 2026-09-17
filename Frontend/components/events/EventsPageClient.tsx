"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useCreateEventMutation,
  useGetEventQuery,
  useGetEventsQuery,
  useSetEventRsvpMutation,
  type EventDto,
} from "@/lib/services/authApi";

export type EventItem = EventDto;

const CATEGORIES = ["All", "Conferences", "Workshops", "Tech & AI", "Social & Campus", "Webinars"] as const;

type RsvpStatus = "going" | "interested" | "none";

function readHashEventId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) {
    return "";
  }

  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      data?: { message?: unknown } | null;
      error?: unknown;
      message?: unknown;
    };

    const dataMessage = candidate.data?.message;
    if (typeof dataMessage === "string" && dataMessage.trim()) {
      return dataMessage.trim();
    }

    if (typeof candidate.error === "string" && candidate.error.trim()) {
      return candidate.error.trim();
    }

    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message.trim();
    }
  }

  return fallback;
}

export default function EventsPageClient() {
  const {
    data: eventsData,
    isLoading: isEventsLoading,
    isError: isEventsError,
    error: eventsError,
    refetch: refetchEvents,
  } = useGetEventsQuery({ limit: 100 });

  const events = useMemo<EventDto[]>(() => eventsData?.events ?? [], [eventsData]);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "going" | "interested" | "online">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detail modal is driven by an event id, so the shown data always comes from cache/fetch.
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Create Event Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<EventItem["category"]>("Conferences");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newIsOnline, setNewIsOnline] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  const [pendingRsvpIds, setPendingRsvpIds] = useState<Record<string, true>>({});

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [setEventRsvp] = useSetEventRsvpMutation();

  const toastTimerRef = useRef<number | null>(null);
  // Synchronous guards so a fast double click cannot fire two writes before React re-renders.
  const inFlightRsvpRef = useRef<Set<string>>(new Set());
  const isCreatingRef = useRef(false);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);

    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    },
    []
  );

  // Deep links: /events#<id> from the sidebar or a shared link must open the matching event.
  useEffect(() => {
    const syncFromHash = () => {
      const hashId = readHashEventId();
      if (hashId) {
        setSelectedEventId(hashId);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const cachedEvent = useMemo(
    () => (selectedEventId ? events.find((ev) => ev.id === selectedEventId) ?? null : null),
    [events, selectedEventId]
  );

  // Only hit the single-event endpoint when the id is not part of the cached collection.
  const shouldFetchSingleEvent = Boolean(selectedEventId) && !cachedEvent;
  const {
    data: singleEventData,
    isFetching: isSingleEventFetching,
    isError: isSingleEventError,
    error: singleEventError,
    refetch: refetchSingleEvent,
  } = useGetEventQuery(selectedEventId, { skip: !shouldFetchSingleEvent });

  const isDetailOpen = Boolean(selectedEventId);
  const detailEvent: EventDto | null = cachedEvent ?? singleEventData?.event ?? null;
  const isDetailLoading =
    isDetailOpen && !detailEvent && !isSingleEventError && (isSingleEventFetching || !singleEventData);
  const isDetailUnavailable = isDetailOpen && !detailEvent && !isDetailLoading;

  const openDetail = useCallback((eventId: string) => {
    if (!eventId) {
      return;
    }

    setSelectedEventId(eventId);

    if (typeof window !== "undefined") {
      const nextHash = `#${encodeURIComponent(eventId)}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedEventId("");

    if (typeof window !== "undefined" && window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  const closeCreateModal = useCallback(() => {
    if (isCreating) {
      return;
    }
    setIsCreateModalOpen(false);
    setCreateError(null);
  }, [isCreating]);

  useEffect(() => {
    if (!isDetailOpen && !isCreateModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (isCreateModalOpen) {
        closeCreateModal();
        return;
      }

      closeDetail();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDetailOpen, isCreateModalOpen, closeCreateModal, closeDetail]);

  const handleRsvp = useCallback(
    async (eventId: string, status: RsvpStatus, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      if (!eventId || inFlightRsvpRef.current.has(eventId)) {
        return;
      }

      inFlightRsvpRef.current.add(eventId);
      setPendingRsvpIds((prev) => ({ ...prev, [eventId]: true }));

      try {
        const response = await setEventRsvp({ eventId, status }).unwrap();
        showToast(response?.message?.trim() || "Your RSVP was updated.");
      } catch (error) {
        showToast(getErrorMessage(error, "We couldn't update your RSVP. Please try again."));
      } finally {
        inFlightRsvpRef.current.delete(eventId);
        setPendingRsvpIds((prev) => {
          const next = { ...prev };
          delete next[eventId];
          return next;
        });
      }
    },
    [setEventRsvp, showToast]
  );

  const handleToggleGoing = useCallback(
    (ev: EventDto, e?: React.MouseEvent) => {
      void handleRsvp(ev.id, ev.isGoing ? "none" : "going", e);
    },
    [handleRsvp]
  );

  const handleToggleInterested = useCallback(
    (ev: EventDto, e?: React.MouseEvent) => {
      void handleRsvp(ev.id, ev.isInterested ? "none" : "interested", e);
    },
    [handleRsvp]
  );

  const handleShareEvent = useCallback(
    async (ev: EventDto, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      const shareUrl = `${window.location.origin}/events#${encodeURIComponent(ev.id)}`;

      try {
        if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
          throw new Error("Clipboard API unavailable");
        }

        await navigator.clipboard.writeText(shareUrl);
        showToast("Event link copied to clipboard.");
      } catch {
        showToast(`Couldn't copy the link. Copy it manually: ${shareUrl}`);
      }
    },
    [showToast]
  );

  const resetCreateForm = useCallback(() => {
    setNewTitle("");
    setNewCategory("Conferences");
    setNewDate("");
    setNewTime("");
    setNewLocation("");
    setNewIsOnline(false);
    setNewDescription("");
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCreatingRef.current) {
      return;
    }

    const title = newTitle.trim();
    const date = newDate.trim();

    if (!title || !date) {
      setCreateError("A title and a date are required.");
      return;
    }

    isCreatingRef.current = true;
    setCreateError(null);

    try {
      const response = await createEvent({
        title,
        category: newCategory,
        date,
        time: newTime.trim(),
        location: newLocation.trim(),
        isOnline: newIsOnline,
        description: newDescription.trim(),
      }).unwrap();

      setIsCreateModalOpen(false);
      resetCreateForm();
      showToast(response?.message?.trim() || "Your event was created.");
    } catch (error) {
      // Keep the draft intact so the user can retry without retyping.
      setCreateError(getErrorMessage(error, "We couldn't create this event. Your draft is still here."));
    } finally {
      isCreatingRef.current = false;
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category filter
      if (activeCategory !== "All" && ev.category !== activeCategory) {
        return false;
      }
      // Tab filter
      if (activeTab === "going" && !ev.isGoing) return false;
      if (activeTab === "interested" && !ev.isInterested) return false;
      if (activeTab === "online" && !ev.isOnline) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesOrg = ev.organizer.toLowerCase().includes(q);
        const matchesLoc = ev.location.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesLoc && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [events, activeCategory, activeTab, searchQuery]);

  return (
    <section className="events-main-section" style={{ minHeight: "90vh", backgroundColor: "#f0f2f5", paddingBottom: "60px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "min(420px, calc(100vw - 48px))",
            wordBreak: "break-word",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Area */}
      <div
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
          color: "#ffffff",
          padding: "36px 0 28px 0",
          boxShadow: "0 4px 20px -2px rgba(2, 132, 199, 0.25)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Facebook-Style Hub
                </span>
                <span style={{ fontSize: "13px", opacity: 0.9 }}>• {events.length} Upcoming Summits & Workshops</span>
              </div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "0 0 10px 0", color: "#ffffff" }}>
                Events & Conferences
              </h1>
              <p style={{ fontSize: "15px", margin: 0, opacity: 0.92, maxWidth: "640px", lineHeight: "1.5" }}>
                Discover scientific symposiums, tech hackathons, interactive lab sessions, and campus meetups happening near you and worldwide.
              </p>
            </div>
            <div className="col-lg-4 col-md-5 text-md-right mt-3 mt-md-0">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0284c7",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                + Create New Event
              </button>
            </div>
          </div>

          {/* Search & Top Filters Bar */}
          <div
            style={{
              marginTop: "26px",
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "12px 16px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px",
              backdropFilter: "blur(6px)",
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <svg
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, topic, or location..."
                aria-label="Search events"
                style={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  color: "#1e293b",
                  border: "none",
                  borderRadius: "20px",
                  padding: "9px 16px 9px 40px",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
            </div>

            {/* Quick View Tabs */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(
                [
                  { id: "all", label: "All Events" },
                  { id: "going", label: "Going" },
                  { id: "interested", label: "Interested" },
                  { id: "online", label: "Online" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  style={{
                    backgroundColor: activeTab === tab.id ? "#ffffff" : "rgba(255,255,255,0.2)",
                    color: activeTab === tab.id ? "#0284c7" : "#ffffff",
                    border: "none",
                    borderRadius: "16px",
                    padding: "6px 14px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isSelected}
                  style={{
                    whiteSpace: "nowrap",
                    backgroundColor: isSelected ? "#0284c7" : "#f1f5f9",
                    color: isSelected ? "#ffffff" : "#475569",
                    border: "none",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events Grid Container */}
      <div className="container" style={{ marginTop: "28px" }}>
        {isEventsLoading ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
              Loading events...
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Fetching the latest summits, workshops, and meetups.
            </p>
          </div>
        ) : isEventsError ? (
          <div
            role="alert"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              border: "1px solid #fecaca",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#b91c1c", marginBottom: "6px" }}>
              Couldn&apos;t Load Events
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "460px", margin: "0 auto 18px" }}>
              {getErrorMessage(eventsError, "Something went wrong while loading events. Please try again.")}
            </p>
            <button
              type="button"
              onClick={() => {
                void refetchEvents();
              }}
              style={{
                backgroundColor: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "12px" }}>📅</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
              No Events Found
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px", margin: "0 auto 18px" }}>
              We couldn’t find any events matching your selected filter. Try clearing filters or create a new event for your team!
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All");
                setActiveTab("all");
                setSearchQuery("");
              }}
              style={{
                backgroundColor: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row">
            {filteredEvents.map((ev) => {
              const isRsvpPending = Boolean(pendingRsvpIds[ev.id]);

              return (
                <div key={ev.id} className="col-lg-4 col-md-6 col-sm-12" style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      border: "1px solid #e2e8f0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                    }}
                  >
                    {/* Event Cover Image */}
                    <div style={{ position: "relative", height: "170px", backgroundColor: "#0f172a", overflow: "hidden" }}>
                      <img
                        src={ev.coverImage}
                        alt={ev.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => openDetail(ev.id)}
                      />
                      {/* Category pill */}
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          backgroundColor: "rgba(15, 23, 42, 0.75)",
                          color: "#ffffff",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 600,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {ev.category}
                      </span>
                      {/* Online / In-person badge */}
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: ev.isOnline ? "rgba(16, 185, 129, 0.9)" : "rgba(59, 130, 246, 0.9)",
                          color: "#ffffff",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {ev.isOnline ? "🌐 Online" : "📍 In Person"}
                      </span>
                    </div>

                    {/* Event Content */}
                    <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "12px" }}>
                        {/* Date Badge Box (Facebook-style) */}
                        <div
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            width: "52px",
                            textAlign: "center",
                            padding: "6px 0",
                            flexShrink: 0,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div style={{ color: "#ef4444", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                            {ev.month}
                          </div>
                          <div style={{ color: "#0f172a", fontSize: "20px", fontWeight: 800, lineHeight: 1.1 }}>
                            {ev.day}
                          </div>
                        </div>

                        {/* Title & Host */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            onClick={() => openDetail(ev.id)}
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#1e293b",
                              margin: "0 0 4px 0",
                              lineHeight: "1.35",
                              cursor: "pointer",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {ev.title}
                          </h4>
                          <div style={{ fontSize: "12.5px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>by {ev.organizer}</span>
                            <span style={{ color: "#0284c7" }}>✓</span>
                          </div>
                        </div>
                      </div>

                      {/* Time & Location */}
                      <div style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>{ev.time}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {ev.location}
                          </span>
                        </div>
                      </div>

                      {/* Description snippet */}
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#475569",
                          lineHeight: "1.45",
                          margin: "0 0 14px 0",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {ev.description}
                      </p>

                      {/* Attendees & stats */}
                      <div
                        style={{
                          marginTop: "auto",
                          paddingTop: "12px",
                          borderTop: "1px solid #f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "14px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {ev.attendees.map((att, i) => (
                            <img
                              key={i}
                              src={att}
                              alt=""
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                border: "2px solid #ffffff",
                                marginLeft: i > 0 ? "-6px" : "0",
                                objectFit: "cover",
                              }}
                            />
                          ))}
                          <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "8px", fontWeight: 500 }}>
                            {ev.goingCount} going • {ev.interestedCount} interested
                          </span>
                        </div>
                      </div>

                      {/* Facebook-style Action Buttons */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        {/* Going Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleGoing(ev, e)}
                          disabled={isRsvpPending}
                          aria-pressed={Boolean(ev.isGoing)}
                          style={{
                            flex: 1,
                            backgroundColor: ev.isGoing ? "#dcfce7" : "#f1f5f9",
                            color: ev.isGoing ? "#15803d" : "#334155",
                            border: ev.isGoing ? "1px solid #86efac" : "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "8px 0",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            cursor: isRsvpPending ? "not-allowed" : "pointer",
                            opacity: isRsvpPending ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {ev.isGoing ? "✓ Going" : "Going"}
                        </button>

                        {/* Interested Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleInterested(ev, e)}
                          disabled={isRsvpPending}
                          aria-pressed={Boolean(ev.isInterested)}
                          style={{
                            flex: 1,
                            backgroundColor: ev.isInterested ? "#fef3c7" : "#f1f5f9",
                            color: ev.isInterested ? "#b45309" : "#334155",
                            border: ev.isInterested ? "1px solid #fcd34d" : "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "8px 0",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            cursor: isRsvpPending ? "not-allowed" : "pointer",
                            opacity: isRsvpPending ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {ev.isInterested ? "★ Interested" : "Interested"}
                        </button>

                        {/* Share Button */}
                        <button
                          type="button"
                          onClick={(e) => handleShareEvent(ev, e)}
                          title="Share Event"
                          aria-label={`Share ${ev.title}`}
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#64748b",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {isDetailOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Event details"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeDetail}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isDetailLoading ? (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                  Loading event...
                </h3>
                <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                  {isSingleEventFetching ? "Fetching the latest details." : "Preparing event details."}
                </p>
              </div>
            ) : isDetailUnavailable || !detailEvent ? (
              <div role="alert" style={{ padding: "48px 24px", textAlign: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#b91c1c", marginBottom: "6px" }}>
                  Event Unavailable
                </h3>
                <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "440px", margin: "0 auto 18px" }}>
                  {isSingleEventError
                    ? getErrorMessage(singleEventError, "This event link is invalid or the event is no longer available.")
                    : "This event link is invalid or the event is no longer available."}
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {isSingleEventError && (
                    <button
                      type="button"
                      onClick={() => {
                        void refetchSingleEvent();
                      }}
                      style={{
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "20px",
                        padding: "8px 20px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Try Again
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeDetail}
                    style={{
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      border: "none",
                      borderRadius: "20px",
                      padding: "8px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Header Image */}
                <div style={{ position: "relative", height: "240px", backgroundColor: "#0f172a" }}>
                  <img
                    src={detailEvent.coverImage}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={closeDetail}
                    aria-label="Close event details"
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "50%",
                      width: "34px",
                      height: "34px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    ✕
                  </button>
                  <span
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      left: "16px",
                      backgroundColor: "#0284c7",
                      color: "#ffffff",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {detailEvent.category}
                  </span>
                </div>

                {/* Modal Body */}
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        width: "60px",
                        textAlign: "center",
                        padding: "8px 0",
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: 700 }}>{detailEvent.month}</div>
                      <div style={{ color: "#0f172a", fontSize: "24px", fontWeight: 800 }}>{detailEvent.day}</div>
                    </div>

                    <div>
                      <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", margin: "0 0 6px 0" }}>
                        {detailEvent.title}
                      </h2>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Hosted by <strong style={{ color: "#0f172a" }}>{detailEvent.organizer}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Timing & Location box */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      borderRadius: "12px",
                      padding: "16px",
                      marginBottom: "20px",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      fontSize: "13.5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#334155" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span><strong>{detailEvent.fullDate}</strong> • {detailEvent.time}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#334155" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{detailEvent.location}</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
                    About This Event
                  </h4>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", marginBottom: "24px" }}>
                    {detailEvent.description}
                  </p>

                  {/* RSVP Action Row */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "18px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleGoing(detailEvent)}
                      disabled={Boolean(pendingRsvpIds[detailEvent.id])}
                      aria-pressed={Boolean(detailEvent.isGoing)}
                      style={{
                        flex: 1,
                        backgroundColor: detailEvent.isGoing ? "#15803d" : "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "12px 0",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: pendingRsvpIds[detailEvent.id] ? "not-allowed" : "pointer",
                        opacity: pendingRsvpIds[detailEvent.id] ? 0.6 : 1,
                      }}
                    >
                      {detailEvent.isGoing ? "✓ You Are Going" : "RSVP: I'm Going"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleInterested(detailEvent)}
                      disabled={Boolean(pendingRsvpIds[detailEvent.id])}
                      aria-pressed={Boolean(detailEvent.isInterested)}
                      style={{
                        backgroundColor: detailEvent.isInterested ? "#fef3c7" : "#f1f5f9",
                        color: detailEvent.isInterested ? "#b45309" : "#334155",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "12px 18px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: pendingRsvpIds[detailEvent.id] ? "not-allowed" : "pointer",
                        opacity: pendingRsvpIds[detailEvent.id] ? 0.6 : 1,
                      }}
                    >
                      {detailEvent.isInterested ? "★ Interested" : "Interested"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareEvent(detailEvent)}
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "12px 18px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Share
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-event-title"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeCreateModal}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 id="create-event-title" style={{ fontSize: "18px", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                Create New Event
              </h3>
              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isCreating}
                aria-label="Close create event dialog"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: isCreating ? "not-allowed" : "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Learning Research Colloquium 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "9px 12px",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventItem["category"])}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <option value="Conferences">Conferences</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Tech & AI">Tech & AI</option>
                    <option value="Social & Campus">Social & Campus</option>
                    <option value="Webinars">Webinars</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM - 02:00 PM EST"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Location / Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hall B or Zoom Link"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="chk-online"
                  checked={newIsOnline}
                  onChange={(e) => setNewIsOnline(e.target.checked)}
                />
                <label htmlFor="chk-online" style={{ fontSize: "13px", color: "#334155", margin: 0 }}>
                  This is an online / virtual webinar or stream
                </label>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the agenda, speakers, prerequisites..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "9px 12px",
                    fontSize: "13.5px",
                    outline: "none",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>

              {createError && (
                <p
                  role="alert"
                  style={{
                    margin: 0,
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "13px",
                  }}
                >
                  {createError}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isCreating}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    cursor: isCreating ? "not-allowed" : "pointer",
                    opacity: isCreating ? 0.6 : 1,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 22px",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: isCreating ? "not-allowed" : "pointer",
                    opacity: isCreating ? 0.6 : 1,
                  }}
                >
                  {isCreating ? "Publishing..." : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
