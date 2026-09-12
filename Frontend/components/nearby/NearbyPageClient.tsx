"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  useGetNearbyPeopleQuery,
  useToggleFollowUserMutation,
  type NearbyPerson,
} from "@/lib/services/authApi";

// Dynamic import for Leaflet map component (SSR disabled)
const NearbyMap = dynamic(() => import("./NearbyMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "480px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0284c7",
        fontWeight: 600,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="spinner-border text-primary mb-2" role="status"></div>
        <div>Loading Interactive Map...</div>
      </div>
    </div>
  ),
});

const RADIUS_OPTIONS = [
  { label: "10 km", value: 10 },
  { label: "25 km", value: 25 },
  { label: "50 km", value: 50 },
  { label: "100 km", value: 100 },
  { label: "500 km", value: 500 },
  { label: "All Global", value: "all" },
];

export default function NearbyPageClient() {
  const searchParams = useSearchParams();

  // URL query params fallback
  const paramLat = searchParams.get("lat");
  const paramLng = searchParams.get("lng");
  const paramLocation = searchParams.get("location");

  const [coords, setCoords] = useState<{ lat: number; lng: number }>(() => {
    if (paramLat && paramLng && !isNaN(Number(paramLat)) && !isNaN(Number(paramLng))) {
      return { lat: Number(paramLat), lng: Number(paramLng) };
    }
    // Default to Bangladesh / Dhaka until geolocation resolves
    return { lat: 23.8103, lng: 90.4125 };
  });

  const [locationName, setLocationName] = useState<string>(
    paramLocation || "Detecting your location...",
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Filters
  const [selectedRadius, setSelectedRadius] = useState<number | "all">(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "map" | "grid">("split");

  // Follow overrides
  const [followStateOverrides, setFollowStateOverrides] = useState<Record<string, boolean>>({});
  const [toggleFollowUser] = useToggleFollowUserMutation();
  const [pendingFollowUserId, setPendingFollowUserId] = useState<string | null>(null);

  // Geolocation detection on mount if not provided by URL
  useEffect(() => {
    if (paramLat && paramLng) {
      return;
    }

    const detectLocation = async () => {
      setIsDetectingLocation(true);

      // 1. Try browser geolocation
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 6000,
              enableHighAccuracy: true,
            });
          });

          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });

          // Reverse geocode via Nominatim
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            if (res.ok) {
              const data = await res.json();
              const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.county ||
                data.display_name?.split(",")?.[0] ||
                "Your Location";
              const country = data.address?.country || "";
              setLocationName(`${city}${country ? `, ${country}` : ""}`);
            } else {
              setLocationName(`GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            }
          } catch {
            setLocationName(`GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }

          setIsDetectingLocation(false);
          return;
        } catch {
          // Fall through to IP geolocation
        }
      }

      // 2. Fallback to IP geolocation
      try {
        const ipRes = await fetch("https://ipwho.is/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.success && ipData.latitude && ipData.longitude) {
            setCoords({ lat: ipData.latitude, lng: ipData.longitude });
            setLocationName(`${ipData.city || "Nearby"}, ${ipData.country || ""}`);
            setIsDetectingLocation(false);
            return;
          }
        }
      } catch {
        // Fallback already in place
      }

      setLocationName("Dhaka, Bangladesh (Default)");
      setIsDetectingLocation(false);
    };

    detectLocation();
  }, [paramLat, paramLng]);

  // Handle custom location search
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationSearchInput.trim()) return;

    setIsSearchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          locationSearchInput,
        )}`,
      );
      if (res.ok) {
        const results = await res.json();
        if (Array.isArray(results) && results.length > 0) {
          const place = results[0];
          const lat = parseFloat(place.lat);
          const lng = parseFloat(place.lon);
          setCoords({ lat, lng });
          setLocationName(place.display_name.split(",").slice(0, 2).join(","));
          setLocationSearchInput("");
        } else {
          alert("Location not found. Please try a different city or area name.");
        }
      }
    } catch {
      alert("Error searching location. Please try again.");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Re-detect via GPS
  const handleRedetectGPS = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationName(`GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        setIsDetectingLocation(false);
      },
      () => {
        alert("Could not detect GPS location. Please check browser permissions.");
        setIsDetectingLocation(false);
      },
      { timeout: 8000 },
    );
  };

  // Fetch Nearby People from Backend
  const {
    data: nearbyData,
    isLoading,
    isFetching,
  } = useGetNearbyPeopleQuery(
    {
      lat: coords.lat,
      lng: coords.lng,
      radius: selectedRadius === "all" ? "all" : selectedRadius,
      search: searchQuery.trim() || undefined,
      limit: 100,
    },
    {
      refetchOnFocus: false,
    },
  );

  const people = useMemo<NearbyPerson[]>(() => {
    const list = Array.isArray(nearbyData?.users) ? nearbyData.users : [];
    return list.map((person) => {
      const override = followStateOverrides[person.id];
      const isFollowing = typeof override === "boolean" ? override : person.isFollowing;
      return {
        ...person,
        isFollowing,
      };
    });
  }, [nearbyData, followStateOverrides]);

  // Handle follow toggle
  const handleToggleFollow = async (person: NearbyPerson) => {
    if (!person.canFollow) return;
    setPendingFollowUserId(person.id);

    try {
      const res = await toggleFollowUser(person.id).unwrap();
      setFollowStateOverrides((prev) => ({
        ...prev,
        [person.id]: res.isFollowing,
      }));
    } catch {
      // Revert if error
    } finally {
      setPendingFollowUserId(null);
    }
  };

  return (
    <div className="container-fluid" style={{ padding: "24px 20px" }}>
      {/* Top Banner - Sleek Blue Theme */}
      <div
        style={{
          background: "linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)",
          borderRadius: "18px",
          padding: "24px 30px",
          color: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.4)",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-20px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            pointerEvents: "none",
          }}
        />

        <div className="row align-items-center">
          <div className="col-lg-7 col-md-12">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px", color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.25)" }}>
                Nearby People & Researchers
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#f0f9ff", opacity: 0.95, maxWidth: "560px", lineHeight: 1.4 }}>
              Discover colleagues, professors, and researchers around you. Calculate live distance, explore on
              the map, connect, and collaborate!
            </p>
          </div>

          <div className="col-lg-5 col-md-12 mt-3 mt-lg-0 text-lg-right">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(6px)",
                padding: "8px 16px",
                borderRadius: "30px",
                border: "1px solid rgba(255, 255, 255, 0.35)",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600 }}>
                📍 {isDetectingLocation ? "Detecting location..." : locationName}
              </span>
              <button
                type="button"
                onClick={handleRedetectGPS}
                disabled={isDetectingLocation}
                title="Refresh GPS"
                style={{
                  background: "#ffffff",
                  border: "none",
                  color: "#0284c7",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  marginLeft: "10px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 4v6h-6"></path>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Location Search, Radius, Keywords, View Mode */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "18px 24px",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div className="row align-items-center">
          {/* Change Location Search Input */}
          <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
            <form onSubmit={handleLocationSearch} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Change city (e.g. London, Dhaka)..."
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: "9px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={isSearchingLocation}
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isSearchingLocation ? "Searching..." : "Set"}
              </button>
            </form>
          </div>

          {/* Search by Name/Skill Input */}
          <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Filter by name, discipline, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 14px 9px 38px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            </div>
          </div>

          {/* View Mode Buttons */}
          <div className="col-lg-4 col-md-12 text-lg-right">
            <div
              style={{
                display: "inline-flex",
                background: "#f1f5f9",
                borderRadius: "10px",
                padding: "3px",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("split")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: viewMode === "split" ? "#0284c7" : "transparent",
                  color: viewMode === "split" ? "#ffffff" : "#475569",
                  transition: "all 0.2s ease",
                }}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: viewMode === "map" ? "#0284c7" : "transparent",
                  color: viewMode === "map" ? "#ffffff" : "#475569",
                  transition: "all 0.2s ease",
                }}
              >
                Map Only
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: viewMode === "grid" ? "#0284c7" : "transparent",
                  color: viewMode === "grid" ? "#ffffff" : "#475569",
                  transition: "all 0.2s ease",
                }}
              >
                List Only
              </button>
            </div>
          </div>
        </div>

        {/* Radius Filter Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Radius Range:
          </span>
          {RADIUS_OPTIONS.map((opt) => {
            const isSelected = selectedRadius === opt.value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setSelectedRadius(opt.value as number | "all")}
                style={{
                  padding: "5px 14px",
                  borderRadius: "20px",
                  border: isSelected ? "1.5px solid #0284c7" : "1px solid #e2e8f0",
                  background: isSelected ? "#0284c7" : "#f8fafc",
                  color: isSelected ? "#ffffff" : "#475569",
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected ? "0 2px 8px rgba(2, 132, 199, 0.3)" : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
          <span style={{ marginLeft: "auto", fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
            {isLoading || isFetching ? "Searching..." : `Found ${people.length} nearby`}
          </span>
        </div>
      </div>

      {/* Main Content: Map & People Grid */}
      <div className="row">
        {/* Map Container (shown in split and map modes) */}
        {viewMode !== "grid" && (
          <div className={viewMode === "split" ? "col-lg-6 col-md-12 mb-4 mb-lg-0" : "col-lg-12 mb-4"}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                padding: "16px",
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
                height: viewMode === "map" ? "650px" : "600px",
                position: "relative",
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
                      background: "#10b981",
                      boxShadow: "0 0 8px #10b981",
                    }}
                  />
                  <h5 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                    Live Geolocation Radar
                  </h5>
                </div>
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              </div>

              <div style={{ height: "calc(100% - 36px)", borderRadius: "14px", overflow: "hidden" }}>
                <NearbyMap
                  origin={{ lat: coords.lat, lng: coords.lng, location: locationName }}
                  radiusKm={selectedRadius === "all" ? null : selectedRadius}
                  people={people}
                  selectedPersonId={selectedPersonId}
                  onSelectPerson={(id) => setSelectedPersonId(id)}
                />
              </div>
            </div>
          </div>
        )}

        {/* People Cards Grid (shown in split and grid modes) */}
        {viewMode !== "map" && (
          <div className={viewMode === "split" ? "col-lg-6 col-md-12" : "col-lg-12"}>
            <div
              style={{
                maxHeight: viewMode === "split" ? "600px" : "none",
                overflowY: viewMode === "split" ? "auto" : "visible",
                paddingRight: viewMode === "split" ? "6px" : "0",
              }}
            >
              {isLoading ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div className="spinner-border text-primary" role="status"></div>
                  <p style={{ marginTop: "12px", color: "#64748b", fontSize: "14px" }}>
                    Finding researchers near your coordinates...
                  </p>
                </div>
              ) : people.length === 0 ? (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "48px 24px",
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                  <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
                    No researchers found within {selectedRadius === "all" ? "the world" : `${selectedRadius} km`}
                  </h4>
                  <p style={{ color: "#64748b", fontSize: "13px", maxWidth: "400px", margin: "0 auto 16px auto" }}>
                    Try broadening your radius or changing your location search to a nearby metropolitan center.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedRadius("all")}
                    style={{
                      background: "#0284c7",
                      color: "#ffffff",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    View All Worldwide
                  </button>
                </div>
              ) : (
                <div className="row">
                  {people.map((person) => {
                    const isSelected = selectedPersonId === person.id;
                    const isUpdating = pendingFollowUserId === person.id;

                    return (
                      <div
                        className={viewMode === "split" ? "col-md-12 mb-3" : "col-lg-4 col-md-6 mb-4"}
                        key={person.id}
                      >
                        <div
                          onClick={() => setSelectedPersonId(person.id)}
                          style={{
                            background: "#ffffff",
                            borderRadius: "16px",
                            padding: "16px 20px",
                            border: isSelected ? "2px solid #0284c7" : "1px solid #e2e8f0",
                            boxShadow: isSelected
                              ? "0 8px 25px rgba(2, 132, 199, 0.25)"
                              : "0 2px 10px rgba(0, 0, 0, 0.04)",
                            transition: "all 0.22s ease",
                            cursor: "pointer",
                            position: "relative",
                          }}
                        >
                          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                            {/* Avatar */}
                            <div style={{ position: "relative" }}>
                              <img
                                src={person.avatarUrl || "/images/resources/user.jpg"}
                                alt={person.name}
                                style={{
                                  width: "56px",
                                  height: "56px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2.5px solid #e0f2fe",
                                }}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "8px",
                                }}
                              >
                                <Link
                                  href={person.profileHref}
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {person.name}
                                </Link>

                                {/* Distance Badge */}
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "3px",
                                    background: "#e0f2fe",
                                    color: "#0369a1",
                                    fontSize: "11.5px",
                                    fontWeight: 700,
                                    padding: "3px 8px",
                                    borderRadius: "12px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  📍 {person.distanceFormatted}
                                </span>
                              </div>

                              <div style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 4px 0" }}>
                                {person.position || person.department || person.institute || "Researcher"}
                              </div>

                              {person.location && (
                                <div
                                  style={{
                                    fontSize: "11px",
                                    color: "#94a3b8",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <span>🏢 {person.location}</span>
                                </div>
                              )}

                              {/* Skills Pills */}
                              {person.skills && person.skills.length > 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "4px",
                                    flexWrap: "wrap",
                                    marginBottom: "10px",
                                  }}
                                >
                                  {person.skills.slice(0, 3).map((s, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        fontSize: "10.5px",
                                        background: "#f1f5f9",
                                        color: "#475569",
                                        padding: "2px 7px",
                                        borderRadius: "6px",
                                      }}
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Actions Bar */}
                              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <Link
                                  href={person.profileHref}
                                  style={{
                                    padding: "5px 12px",
                                    borderRadius: "8px",
                                    background: "#f8fafc",
                                    color: "#334155",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "11.5px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                  }}
                                >
                                  Profile
                                </Link>

                                <Link
                                  href={`/messages?user=${person.id}`}
                                  style={{
                                    padding: "5px 12px",
                                    borderRadius: "8px",
                                    background: "#f0f9ff",
                                    color: "#0284c7",
                                    border: "1px solid #bae6fd",
                                    fontSize: "11.5px",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                  }}
                                >
                                  Message
                                </Link>

                                {person.canFollow && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFollow(person);
                                    }}
                                    disabled={isUpdating}
                                    style={{
                                      padding: "5px 14px",
                                      borderRadius: "8px",
                                      border: "none",
                                      background: person.isFollowing ? "#e2e8f0" : "#0284c7",
                                      color: person.isFollowing ? "#475569" : "#ffffff",
                                      fontSize: "11.5px",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    {isUpdating
                                      ? "..."
                                      : person.isFollowing
                                      ? "Following"
                                      : "Follow"}
                                  </button>
                                )}
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
      </div>
    </div>
  );
}
