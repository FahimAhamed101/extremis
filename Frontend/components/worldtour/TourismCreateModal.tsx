"use client";

import { useState } from "react";
import type { TourismPlaceItem, CreateTourismPlacePayload } from "@/lib/services/authApi";

type TourismCreateModalProps = {
  initialData?: TourismPlaceItem | null;
  onClose: () => void;
  onSubmit: (payload: CreateTourismPlacePayload) => Promise<void>;
  isSubmitting?: boolean;
};

export default function TourismCreateModal({
  initialData,
  onClose,
  onSubmit,
  isSubmitting,
}: TourismCreateModalProps) {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [category, setCategory] = useState<string>(initialData?.category || "nature");
  const [lat, setLat] = useState(initialData?.coordinates.lat ? String(initialData.coordinates.lat) : "");
  const [lng, setLng] = useState(initialData?.coordinates.lng ? String(initialData.coordinates.lng) : "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [extraImages, setExtraImages] = useState(
    Array.isArray(initialData?.images) ? initialData.images.join(", ") : "",
  );
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [highlights, setHighlights] = useState(
    Array.isArray(initialData?.highlights) ? initialData.highlights.join(", ") : "",
  );
  const [bestTimeToVisit, setBestTimeToVisit] = useState(initialData?.bestTimeToVisit || "Year-round");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Auto-fill coordinates from city name via Nominatim
  const handleLookupCoordinates = async () => {
    const query = `${location} ${country}`.trim();
    if (!query) {
      setErrorMessage("Please enter City and Country first to lookup coordinates.");
      return;
    }

    setIsGeocoding(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLat(String(data[0].lat));
          setLng(String(data[0].lon));
        } else {
          setErrorMessage("Could not automatically locate that place. You can enter lat/lng manually.");
        }
      }
    } catch {
      setErrorMessage("Coordinate lookup service unavailable.");
    } finally {
      setIsGeocoding(false);
    }
  };

  // Get current GPS
  const handleUseCurrentGPS = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setErrorMessage("Browser geolocation is not available.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude.toFixed(4)));
        setLng(String(pos.coords.longitude.toFixed(4)));
      },
      () => {
        setErrorMessage("Could not retrieve GPS coordinates. Check location permissions.");
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !location.trim() || !country.trim() || !description.trim()) {
      setErrorMessage("Please fill in Title, City, Country, and Description.");
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      setErrorMessage("Valid Latitude and Longitude coordinates are required.");
      return;
    }

    const imagesArray = extraImages
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http://") || s.startsWith("https://"));

    if (coverImage.trim() && !imagesArray.includes(coverImage.trim())) {
      imagesArray.unshift(coverImage.trim());
    }

    const highlightsArray = highlights
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        title: title.trim(),
        location: location.trim(),
        country: country.trim(),
        category,
        lat: latitude,
        lng: longitude,
        coverImage: coverImage.trim() || (imagesArray.length > 0 ? imagesArray[0] : null),
        images: imagesArray,
        videoUrl: videoUrl.trim() || null,
        description: description.trim(),
        highlights: highlightsArray,
        bestTimeToVisit: bestTimeToVisit.trim() || "Year-round",
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const d = (err as { data?: { message?: string } }).data;
        setErrorMessage(d?.message || "Failed to save place.");
      } else {
        setErrorMessage("Failed to save place. Please check all fields.");
      }
    }
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
          maxWidth: "760px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          position: "relative",
          animation: "modalFadeIn 0.25s ease-out",
        }}
      >
        {/* Modal Header */}
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
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>
              {isEditing ? "✏️ Edit Tourism Place" : "🌍 Share a Tourism Place & Video"}
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
              Upload and showcase tourism destinations, videos, and photos for global travelers.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              color: "#475569",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
          {errorMessage && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Title */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
              Place Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cox's Bazar Sea Beach & Inani"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "13.5px",
                outline: "none",
              }}
            />
          </div>

          {/* Location & Country & Category */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                City / Region *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cox's Bazar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                Country *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bangladesh"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13.5px",
                  outline: "none",
                  background: "#ffffff",
                }}
              >
                <option value="nature">🌄 Nature & Mountains</option>
                <option value="beach">🏖️ Beach & Islands</option>
                <option value="historic">🏛️ Historic Wonders</option>
                <option value="city">🌆 City & Architecture</option>
                <option value="research">🔬 Research & Innovation</option>
                <option value="adventure">🧗 Adventure & Parks</option>
              </select>
            </div>
          </div>

          {/* Coordinates helper */}
          <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0284c7" }}>
                📍 Geographic Coordinates
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleLookupCoordinates}
                  disabled={isGeocoding}
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {isGeocoding ? "Locating..." : "🔍 Auto-Find Lat/Lng"}
                </button>
                <button
                  type="button"
                  onClick={handleUseCurrentGPS}
                  style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🎯 Use GPS
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11.5px", color: "#64748b" }}>Latitude (e.g. 21.4272)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 21.4272"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "#64748b" }}>Longitude (e.g. 91.9701)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 91.9701"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Media Links: Cover image and Video URL */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                📷 Cover Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or media link"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
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

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                ▶ Tourism Video (MP4 or YouTube link)
              </label>
              <input
                type="url"
                placeholder="https://youtu.be/... or direct mp4 url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
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
          </div>

          {/* Extra Photo URLs */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
              🖼️ Additional Gallery Photos (comma-separated URLs)
            </label>
            <input
              type="text"
              placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
              value={extraImages}
              onChange={(e) => setExtraImages(e.target.value)}
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

          {/* Description */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
              Place Description & Travel Guide *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe this destination, what travelers can experience, landscape, culture, food, and activities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1.5px solid #cbd5e1",
                fontSize: "13.5px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          {/* Highlights & Season */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                ⭐ Highlights (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Sunset point, Local seafood, Hiking trails"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                📅 Best Season
              </label>
              <input
                type="text"
                placeholder="e.g. November to March"
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "14px", borderTop: "1px solid #e2e8f0" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#475569",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
              }}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Post Tourism Place"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
