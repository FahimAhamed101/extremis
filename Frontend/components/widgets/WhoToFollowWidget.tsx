"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import Link from "next/link";
import {
  useGetDiscoverPeopleQuery,
  useToggleFollowUserMutation,
  useGetCurrentUserQuery,
  type ProfilePersonCard,
} from "@/lib/services/authApi";

const CURATED_FALLBACK_SCHOLARS: ProfilePersonCard[] = [
  {
    id: "scholar-elena",
    profileHref: "/profile",
    name: "Dr. Elena Rostova",
    subtitle: "Quantum Computing · MIT",
    image: "/images/resources/user1.jpg",
    actionLabel: "Follow",
    isFollowing: false,
    canFollow: true,
  },
  {
    id: "scholar-marcus",
    profileHref: "/profile",
    name: "Prof. Marcus Vance",
    subtitle: "Autonomous Robotics · Stanford",
    image: "/images/resources/user2.jpg",
    actionLabel: "Follow",
    isFollowing: false,
    canFollow: true,
  },
  {
    id: "scholar-aisha",
    profileHref: "/profile",
    name: "Dr. Aisha Patel",
    subtitle: "Computational Biology · Cambridge",
    image: "/images/resources/user3.jpg",
    actionLabel: "Follow",
    isFollowing: false,
    canFollow: true,
  },
  {
    id: "scholar-daniel",
    profileHref: "/profile",
    name: "Daniel Thorne",
    subtitle: "AI Safety & Policy · Oxford",
    image: "/images/resources/user4.jpg",
    actionLabel: "Follow",
    isFollowing: false,
    canFollow: true,
  },
  {
    id: "scholar-sofia",
    profileHref: "/profile",
    name: "Sofia Chen",
    subtitle: "Materials Science · UC Berkeley",
    image: "/images/resources/user5.jpg",
    actionLabel: "Follow",
    isFollowing: false,
    canFollow: true,
  },
];

export default function WhoToFollowWidget() {
  const { data: userData } = useGetCurrentUserQuery();
  const { data: discoverData, isLoading } = useGetDiscoverPeopleQuery({ limit: 5 });
  const [toggleFollowUser] = useToggleFollowUserMutation();

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const serverPeople = discoverData?.users || [];

  // Merge server people with fallback if fewer than 5 people returned
  const scholars: ProfilePersonCard[] = React.useMemo(() => {
    if (serverPeople.length >= 5) {
      return serverPeople.slice(0, 5);
    }
    const existingIds = new Set(serverPeople.map((p) => p.id));
    const merged = [...serverPeople];
    for (const fallback of CURATED_FALLBACK_SCHOLARS) {
      if (!existingIds.has(fallback.id)) {
        merged.push(fallback);
      }
      if (merged.length >= 5) break;
    }
    return merged;
  }, [serverPeople]);

  const handleToggleFollow = async (person: ProfilePersonCard) => {
    const personId = person.id || person.name;
    const isCurrentlyFollowing =
      followingMap[personId] !== undefined ? followingMap[personId] : Boolean(person.isFollowing);

    if (!userData?.user) {
      window.location.href = "/login";
      return;
    }

    const nextState = !isCurrentlyFollowing;
    setFollowingMap((prev) => ({ ...prev, [personId]: nextState }));
    setPendingId(personId);

    try {
      if (person.id && !person.id.startsWith("scholar-")) {
        await toggleFollowUser({ userId: person.id, following: nextState }).unwrap();
      } else {
        // Simulated response for fallback demo scholars
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
      // Rollback
      setFollowingMap((prev) => ({ ...prev, [personId]: isCurrentlyFollowing }));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div
      className="widget stick-widget"
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "18px 20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "10px",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>✨</span>
          <h4
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.2,
            }}
          >
            Who to Follow
          </h4>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#0284c7",
            background: "#e0f2fe",
            padding: "2px 8px",
            borderRadius: "10px",
          }}
        >
          Scholars
        </span>
      </div>

      {/* List */}
      <ul className="followers" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {isLoading && serverPeople.length === 0 ? (
          <li style={{ padding: "20px 0", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
            <span className="spinner-border spinner-border-sm" role="status" style={{ marginRight: "8px" }} />
            Discovering researchers...
          </li>
        ) : (
          scholars.map((person) => {
            const personId = person.id || person.name;
            const isFollowing =
              followingMap[personId] !== undefined ? followingMap[personId] : Boolean(person.isFollowing);
            const isPending = pendingId === personId;
            const isHovered = hoveredId === personId;
            const profileUrl = person.id && !person.id.startsWith("scholar-") ? `/profile/${person.id}` : "/profile";

            return (
              <li
                key={personId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #f8fafc",
                  gap: "10px",
                }}
              >
                {/* Avatar & Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <Link href={profileUrl} style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        backgroundColor: "#f1f5f9",
                        border: "1.5px solid #e2e8f0",
                        position: "relative",
                      }}
                    >
                      <img
                        alt={person.name}
                        src={person.image || "/images/resources/user.jpg"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                        }}
                      />
                    </div>
                  </Link>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "13.5px",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Link
                        href={profileUrl}
                        title={person.name}
                        style={{ color: "#1e293b", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#0284c7")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#1e293b")}
                      >
                        {person.name}
                      </Link>
                    </h4>
                    <span
                      style={{
                        display: "block",
                        fontSize: "11.5px",
                        color: "#64748b",
                        marginTop: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {person.subtitle}
                    </span>
                  </div>
                </div>

                {/* Interactive Follow Button */}
                <button
                  type="button"
                  onClick={() => handleToggleFollow(person)}
                  disabled={isPending}
                  onMouseEnter={() => setHoveredId(personId)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: isPending ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    border: isFollowing
                      ? isHovered
                        ? "1px solid #fca5a5"
                        : "1px solid #cbd5e1"
                      : "1px solid #0284c7",
                    backgroundColor: isFollowing
                      ? isHovered
                        ? "#fef2f2"
                        : "#f8fafc"
                      : "#f0f9ff",
                    color: isFollowing
                      ? isHovered
                        ? "#dc2626"
                        : "#475569"
                      : "#0284c7",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {isPending ? (
                    <span className="spinner-border spinner-border-sm" role="status" style={{ width: "12px", height: "12px" }} />
                  ) : isFollowing ? (
                    isHovered ? (
                      "Unfollow"
                    ) : (
                      "✓ Following"
                    )
                  ) : (
                    "+ Follow"
                  )}
                </button>
              </li>
            );
          })
        )}
      </ul>

      {/* Footer link */}
      <div style={{ marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
        <Link
          href="/profile"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#0284c7",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>See more scholars</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
