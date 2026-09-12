"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import {
  useGetTourismPlacesQuery,
  useCreateTourismPlaceMutation,
  useUpdateTourismPlaceMutation,
  useDeleteTourismPlaceMutation,
  type TourismPlaceItem,
  type CreateTourismPlacePayload,
} from "@/lib/services/authApi";
import TourismDetailModal from "./TourismDetailModal";
import TourismCreateModal from "./TourismCreateModal";

const WorldTourMap = dynamic(() => import("./WorldTourMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "580px",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontWeight: 600,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="spinner-border text-light mb-2" role="status"></div>
        <div>Loading Global Explorer Map...</div>
      </div>
    </div>
  ),
});

const CATEGORY_TABS = [
  { label: "All Destinations", value: "all", icon: "🌐" },
  { label: "Nature", value: "nature", icon: "🌄" },
  { label: "Historic", value: "historic", icon: "🏛️" },
  { label: "Beach", value: "beach", icon: "🏖️" },
  { label: "City", value: "city", icon: "🌆" },
  { label: "Research Hubs", value: "research", icon: "🔬" },
  { label: "Adventure", value: "adventure", icon: "🧗" },
  { label: "My Shared Places", value: "my_posts", icon: "⭐" },
];

export default function WorldTourPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "cards">("split");

  // Modals state
  const [modalPlace, setModalPlace] = useState<TourismPlaceItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<TourismPlaceItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Selected place on the map
  const [selectedMapPlace, setSelectedMapPlace] = useState<TourismPlaceItem | null>(null);

  // RTK Query hooks
  const queryParams = useMemo(() => {
    return {
      category: activeCategory !== "all" && activeCategory !== "my_posts" ? activeCategory : undefined,
      search: searchTerm.trim() || undefined,
      myOnly: activeCategory === "my_posts" ? true : undefined,
    };
  }, [activeCategory, searchTerm]);

  const { data, isLoading, isError, refetch } = useGetTourismPlacesQuery(queryParams);
  const [createTourismPlace, { isLoading: isCreating }] = useCreateTourismPlaceMutation();
  const [updateTourismPlace, { isLoading: isUpdating }] = useUpdateTourismPlaceMutation();
  const [deleteTourismPlace, { isLoading: isDeleting }] = useDeleteTourismPlaceMutation();

  const places: TourismPlaceItem[] = data?.places || [];

  // Handle Save (Create or Update)
  const handleSavePlace = async (payload: CreateTourismPlacePayload) => {
    try {
      if (editingPlace) {
        await updateTourismPlace({ id: editingPlace.id, body: payload }).unwrap();
        setFeedbackMessage({ text: "Tourism place updated successfully!", type: "success" });
      } else {
        await createTourismPlace(payload).unwrap();
        setFeedbackMessage({ text: "New tourism destination published successfully!", type: "success" });
      }
      setIsCreateOpen(false);
      setEditingPlace(null);
      refetch();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message || "Operation failed. Please check your inputs.";
      setFeedbackMessage({ text: errorMsg, type: "error" });
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  // Handle Delete
  const handleDeletePlace = async (placeId: string) => {
    if (!window.confirm("Are you sure you want to delete this tourism destination? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTourismPlace(placeId).unwrap();
      if (modalPlace?.id === placeId) {
        setModalPlace(null);
      }
      setFeedbackMessage({ text: "Destination removed successfully.", type: "success" });
      refetch();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch {
      setFeedbackMessage({ text: "Failed to delete destination.", type: "error" });
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  return (
    <div className="container-fluid" style={{ padding: "20px 24px", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 100000,
            padding: "14px 22px",
            borderRadius: "12px",
            backgroundColor: feedbackMessage.type === "success" ? "#059669" : "#dc2626",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          <span>{feedbackMessage.type === "success" ? "✓" : "⚠️"}</span>
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Top Banner - Blue Explorer Theme */}
      <div
        style={{
          background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0284c7 80%, #38bdf8 100%)",
          borderRadius: "20px",
          padding: "28px 34px",
          color: "#ffffff",
          boxShadow: "0 12px 30px -6px rgba(2, 132, 199, 0.45)",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-30px",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            pointerEvents: "none",
          }}
        />

        <div className="row align-items-center">
          <div className="col-lg-7 col-md-12">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#ffffff !important" as unknown as string,
                  textShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                }}
              >
                <span style={{ color: "#ffffff" }}>World Tourism & Global Discovery</span>
              </h1>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14.5px",
                color: "#e0f2fe",
                maxWidth: "640px",
                lineHeight: 1.5,
              }}
            >
              Explore iconic natural wonders, historical monuments, beaches, and research capitals. Watch immersive
              tourism videos, explore photos, find nearby people, and publish your own travel files!
            </p>
          </div>

          <div className="col-lg-5 col-md-12 mt-3 mt-lg-0 d-flex flex-wrap align-items-center justify-content-lg-end gap-2">
            {/* Create New Place Button */}
            <button
              type="button"
              onClick={() => {
                setEditingPlace(null);
                setIsCreateOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13.5px",
                padding: "11px 20px",
                borderRadius: "30px",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Share Place & Video</span>
            </button>

            {/* Switch to Nearby Link */}
            <Link
              href="/nearby"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                color: "#0369a1",
                fontWeight: 700,
                fontSize: "13.5px",
                padding: "11px 20px",
                borderRadius: "30px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
              }}
            >
              <span>📍 Nearby People</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "18px",
          padding: "16px 22px",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div className="row align-items-center">
          {/* Search bar */}
          <div className="col-lg-4 col-md-12 mb-3 mb-lg-0">
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search tourism destinations, countries, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 40px",
                  borderRadius: "12px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13.5px",
                  outline: "none",
                  backgroundColor: "#f8fafc",
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "absolute", left: "12px", top: "12px" }}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="col-lg-6 col-md-12 mb-3 mb-lg-0">
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveCategory(tab.value)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: "20px",
                      border: isActive ? "1.5px solid #0284c7" : "1px solid #e2e8f0",
                      background: isActive ? "#0284c7" : "#f8fafc",
                      color: isActive ? "#ffffff" : "#475569",
                      fontSize: "12.5px",
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                      boxShadow: isActive ? "0 2px 8px rgba(2, 132, 199, 0.3)" : "none",
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="col-lg-2 col-md-12 text-lg-right">
            <div
              style={{
                display: "inline-flex",
                background: "#f1f5f9",
                borderRadius: "10px",
                padding: "3px",
                border: "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("split")}
                style={{
                  border: "none",
                  background: viewMode === "split" ? "#ffffff" : "transparent",
                  color: viewMode === "split" ? "#0284c7" : "#64748b",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "11.5px",
                  cursor: "pointer",
                  boxShadow: viewMode === "split" ? "0 2px 5px rgba(0,0,0,0.08)" : "none",
                }}
              >
                🗺️ Split Map
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                style={{
                  border: "none",
                  background: viewMode === "cards" ? "#ffffff" : "transparent",
                  color: viewMode === "cards" ? "#0284c7" : "#64748b",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "11.5px",
                  cursor: "pointer",
                  boxShadow: viewMode === "cards" ? "0 2px 5px rgba(0,0,0,0.08)" : "none",
                }}
              >
                🎴 Cards Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div
          style={{
            minHeight: "450px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div className="spinner-border text-primary" role="status"></div>
          <span style={{ color: "#64748b", fontSize: "14px" }}>Loading World Tourism destinations...</span>
        </div>
      ) : isError ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: "#ffffff",
            borderRadius: "18px",
            border: "1px solid #fecaca",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
          <h4 style={{ color: "#991b1b" }}>Could not load tourism destinations</h4>
          <p style={{ color: "#64748b" }}>Please check your internet connection and make sure the server is active.</p>
          <button
            type="button"
            onClick={() => refetch()}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#0284c7",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="row">
          {/* Map Column (if split view) */}
          {viewMode === "split" && (
            <div className="col-xl-5 col-lg-6 col-md-12 mb-4">
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "16px",
                  boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #e2e8f0",
                  height: "720px",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
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
                    <h5 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                      Tourism Map Navigator
                    </h5>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0284c7" }}>
                    {places.length} destinations
                  </span>
                </div>

                <div style={{ height: "calc(100% - 36px)", borderRadius: "14px", overflow: "hidden" }}>
                  <WorldTourMap
                    places={places}
                    selectedPlace={selectedMapPlace}
                    onSelectPlace={(p) => setSelectedMapPlace(p)}
                    onOpenDetail={(p) => setModalPlace(p)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tourism Cards Grid */}
          <div className={viewMode === "split" ? "col-xl-7 col-lg-6 col-md-12" : "col-12"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>
                {activeCategory === "all"
                  ? "Popular World Destinations"
                  : `${activeCategory.toUpperCase()} Destinations`}
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", marginLeft: "8px" }}>
                  ({places.length} found)
                </span>
              </h4>

              <button
                type="button"
                onClick={() => {
                  setEditingPlace(null);
                  setIsCreateOpen(true);
                }}
                style={{
                  background: "#e0f2fe",
                  color: "#0369a1",
                  border: "1px solid #bae6fd",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Add Place
              </button>
            </div>

            {places.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "48px 24px",
                  textAlign: "center",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🌍</div>
                <h5 style={{ fontWeight: 700, color: "#1e293b" }}>No destinations found in this view</h5>
                <p style={{ color: "#64748b", fontSize: "13.5px", maxWidth: "420px", margin: "0 auto 18px" }}>
                  Try changing your search keywords, switching categories, or be the first to share this destination!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlace(null);
                    setIsCreateOpen(true);
                  }}
                  style={{
                    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Share Tourism Destination
                </button>
              </div>
            ) : (
              <div className="row">
                {places.map((place) => {
                  const cover = place.coverImage || place.images?.[0] || "/images/resources/user.jpg";
                  const hasVideo = Boolean(place.videoUrl);

                  return (
                    <div
                      key={place.id}
                      className={viewMode === "split" ? "col-xl-6 col-md-12 mb-4" : "col-xl-4 col-lg-6 col-md-12 mb-4"}
                    >
                      <div
                        style={{
                          background: "#ffffff",
                          borderRadius: "18px",
                          overflow: "hidden",
                          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.07)",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          transition: "all 0.25s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => setModalPlace(place)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 28px rgba(2, 132, 199, 0.18)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 18px rgba(0, 0, 0, 0.07)";
                        }}
                      >
                        {/* Cover Media Header */}
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "210px",
                            backgroundColor: "#0f172a",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={cover}
                            alt={place.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.4s ease",
                            }}
                          />

                          {/* Gradient Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)",
                            }}
                          />

                          {/* Category Badge */}
                          <span
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              backgroundColor: "rgba(255, 255, 255, 0.92)",
                              color: "#0369a1",
                              backdropFilter: "blur(4px)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                          >
                            {place.category}
                          </span>

                          {/* Video Badge */}
                          {hasVideo && (
                            <span
                              style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "4px 10px",
                                borderRadius: "20px",
                                backgroundColor: "rgba(239, 68, 68, 0.92)",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="#ffffff"
                                stroke="none"
                              >
                                <polygon points="6 3 20 12 6 21 6 3"></polygon>
                              </svg>
                              <span>Video Available</span>
                            </span>
                          )}

                          {/* Location tag bottom left of cover */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              left: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "#ffffff",
                              fontSize: "12px",
                              fontWeight: 600,
                              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>
                              {place.location}, {place.country}
                            </span>
                          </div>

                          {/* Photos counter badge */}
                          {place.images && place.images.length > 1 && (
                            <span
                              style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "12px",
                                background: "rgba(0, 0, 0, 0.65)",
                                color: "#ffffff",
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: "8px",
                              }}
                            >
                              📷 {place.images.length} photos
                            </span>
                          )}
                        </div>

                        {/* Card Body */}
                        <div
                          style={{
                            padding: "16px 18px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <h4
                            style={{
                              margin: "0 0 8px 0",
                              fontSize: "17px",
                              fontWeight: 800,
                              color: "#0f172a",
                              lineHeight: 1.3,
                            }}
                          >
                            {place.title}
                          </h4>

                          <p
                            style={{
                              margin: "0 0 14px 0",
                              fontSize: "13px",
                              color: "#64748b",
                              lineHeight: 1.45,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              flex: 1,
                            }}
                          >
                            {place.description}
                          </p>

                          {/* Highlights pills */}
                          {place.highlights && place.highlights.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                flexWrap: "wrap",
                                marginBottom: "14px",
                              }}
                            >
                              {place.highlights.slice(0, 3).map((hl, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: "11px",
                                    color: "#0369a1",
                                    backgroundColor: "#f0f9ff",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    fontWeight: 600,
                                  }}
                                >
                                  ✨ {hl}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer with Author and Actions */}
                          <div
                            style={{
                              borderTop: "1px solid #f1f5f9",
                              paddingTop: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* Author details */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <img
                                src={place.author?.avatarUrl || "/images/resources/user.jpg"}
                                alt="Author"
                                style={{
                                  width: "26px",
                                  height: "26px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "1.5px solid #0284c7",
                                }}
                              />
                              <span style={{ fontSize: "11.5px", color: "#475569", fontWeight: 600 }}>
                                {place.isMyPost ? "You" : place.author?.name || "Explorer"}
                              </span>
                            </div>

                            {/* Buttons */}
                            <div
                              style={{ display: "flex", alignItems: "center", gap: "6px" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* If user created this place, provide Edit & Delete */}
                              {place.isMyPost && (
                                <>
                                  <button
                                    type="button"
                                    title="Edit your post"
                                    onClick={() => {
                                      setEditingPlace(place);
                                      setIsCreateOpen(true);
                                    }}
                                    style={{
                                      background: "#f1f5f9",
                                      border: "none",
                                      borderRadius: "8px",
                                      width: "30px",
                                      height: "30px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      color: "#475569",
                                    }}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    type="button"
                                    title="Delete this place"
                                    onClick={() => handleDeletePlace(place.id)}
                                    style={{
                                      background: "#fee2e2",
                                      border: "none",
                                      borderRadius: "8px",
                                      width: "30px",
                                      height: "30px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      color: "#dc2626",
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </>
                              )}

                              {/* View Details Popup Trigger */}
                              <button
                                type="button"
                                onClick={() => setModalPlace(place)}
                                style={{
                                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                                  color: "#ffffff",
                                  border: "none",
                                  padding: "6px 14px",
                                  borderRadius: "10px",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px rgba(2, 132, 199, 0.35)",
                                }}
                              >
                                {hasVideo ? "▶ Video & Details" : "Explore →"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tourism Detail Modal Popup */}
      {modalPlace && (
        <TourismDetailModal
          place={modalPlace}
          onClose={() => setModalPlace(null)}
          onEdit={(placeToEdit) => {
            setModalPlace(null);
            setEditingPlace(placeToEdit);
            setIsCreateOpen(true);
          }}
          onDelete={(placeId) => {
            handleDeletePlace(placeId);
          }}
          isDeleting={isDeleting}
        />
      )}

      {/* Tourism Create / Update Modal */}
      {isCreateOpen && (
        <TourismCreateModal
          initialData={editingPlace}
          onClose={() => {
            setIsCreateOpen(false);
            setEditingPlace(null);
          }}
          onSubmit={handleSavePlace}
          isSubmitting={isCreating || isUpdating}
        />
      )}
    </div>
  );
}
