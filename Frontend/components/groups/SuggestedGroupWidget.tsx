"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useGetSuggestedGroupsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useGetCurrentUserQuery,
} from "@/lib/services/authApi";

export default function SuggestedGroupWidget() {
  const { data: userData } = useGetCurrentUserQuery();
  const { data, isLoading } = useGetSuggestedGroupsQuery();
  const [joinGroup, { isLoading: isJoining }] = useJoinGroupMutation();
  const [leaveGroup, { isLoading: isLeaving }] = useLeaveGroupMutation();

  const groups = data?.groups || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localJoinedMap, setLocalJoinedMap] = useState<Record<string, boolean>>({});
  const [localCountOffset, setLocalCountOffset] = useState<Record<string, number>>({});
  const [actionGroupId, setActionGroupId] = useState<string | null>(null);

  const handleNext = () => {
    if (groups.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % groups.length);
    }
  };

  const handlePrev = () => {
    if (groups.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + groups.length) % groups.length);
    }
  };

  const currentGroup = groups[currentIndex] || groups[0];

  const handleToggleJoin = async (group: any) => {
    if (!group) return;
    const groupId = group._id || group.id;
    const isCurrentlyJoined = localJoinedMap[groupId] !== undefined ? localJoinedMap[groupId] : Boolean(group.isJoined);

    if (!userData?.user) {
      // Prompt user to sign in
      window.location.href = "/login";
      return;
    }

    setActionGroupId(groupId);
    try {
      if (isCurrentlyJoined) {
        // Leave
        setLocalJoinedMap((prev) => ({ ...prev, [groupId]: false }));
        setLocalCountOffset((prev) => ({ ...prev, [groupId]: (prev[groupId] || 0) - 1 }));
        await leaveGroup(groupId).unwrap();
      } else {
        // Join
        setLocalJoinedMap((prev) => ({ ...prev, [groupId]: true }));
        setLocalCountOffset((prev) => ({ ...prev, [groupId]: (prev[groupId] || 0) + 1 }));
        await joinGroup(groupId).unwrap();
      }
    } catch (err) {
      console.error("Failed to toggle group membership:", err);
      // Rollback on error
      setLocalJoinedMap((prev) => ({ ...prev, [groupId]: isCurrentlyJoined }));
      setLocalCountOffset((prev) => ({ ...prev, [groupId]: 0 }));
    } finally {
      setActionGroupId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="widget" style={{ borderRadius: "10px" }}>
        <h4 className="widget-title">Suggested Group</h4>
        <div style={{ padding: "30px 0", textAlign: "center", color: "#888", fontSize: "13px" }}>
          <i className="icofont-spinner icofont-spin" style={{ marginRight: "6px" }}></i>
          Finding suggested groups...
        </div>
      </div>
    );
  }

  if (!currentGroup) {
    return null;
  }

  const groupId = currentGroup._id || currentGroup.id;
  const isJoined = localJoinedMap[groupId] !== undefined ? localJoinedMap[groupId] : Boolean(currentGroup.isJoined);
  const isPending = actionGroupId === groupId && (isJoining || isLeaving);

  // Formatted members count
  const baseDisplay = currentGroup.memberCountDisplay || `${currentGroup.membersCount || 100} members`;
  const offset = localCountOffset[groupId] || 0;
  const memberLabel = offset !== 0 && !baseDisplay.includes("K")
    ? `Members: ${Math.max(1, (currentGroup.membersCount || 1) + offset)}`
    : `Members: ${baseDisplay.replace(/^Members:\s*/i, "")}`;

  const coverSrc = currentGroup.coverUrl || "/images/resources/sidebar-info.jpg";
  const avatarSrc = currentGroup.iconUrl || "/images/groups/bio-labest-avatar.jpg";

  return (
    <div className="widget" style={{ borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <h4 className="widget-title" style={{ margin: 0, paddingBottom: 0 }}>Suggested Group</h4>
        {groups.length > 1 && (
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous suggested group"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "1px solid #e1e8ed",
                background: "#fff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#555",
                transition: "all 0.2s ease",
              }}
            >
              ‹
            </button>
            <span style={{ fontSize: "11px", color: "#999" }}>
              {currentIndex + 1}/{groups.length}
            </span>
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next suggested group"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "1px solid #e1e8ed",
                background: "#fff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#555",
                transition: "all 0.2s ease",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="sug-caro" style={{ margin: 0 }}>
        <div className="friend-box" style={{ margin: 0, border: "1px solid #edf2f6", borderRadius: "8px", overflow: "hidden" }}>
          <figure style={{ position: "relative", height: "135px", margin: 0, overflow: "hidden", background: "#f0f4f8" }}>
            <img
              alt={currentGroup.name}
              src={coverSrc}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/resources/sidebar-info.jpg";
              }}
            />
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(4px)",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "12px",
              }}
            >
              {memberLabel}
            </span>
          </figure>

          <div className="frnd-meta" style={{ position: "relative", padding: "12px 14px 16px", textAlign: "center", marginTop: "-32px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 8px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                background: "#fff",
              }}
            >
              <img
                alt={currentGroup.name}
                src={avatarSrc}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/groups/bio-labest-avatar.jpg";
                }}
              />
            </div>

            <div className="frnd-name" style={{ marginBottom: "12px" }}>
              <Link
                href={`/groups?id=${groupId}`}
                title={currentGroup.name}
                style={{
                  display: "block",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#222",
                  marginBottom: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentGroup.name}
              </Link>
              <span style={{ fontSize: "12px", color: "#088dcd", fontWeight: 500 }}>
                {currentGroup.handle || `@${currentGroup.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleToggleJoin(currentGroup)}
              disabled={isPending}
              className={isJoined ? "main-btn2 active" : "main-btn2"}
              style={{
                width: "100%",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isPending ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                background: isJoined ? "#28a745" : "#088dcd",
                color: "#ffffff",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isPending ? (
                <>
                  <i className="icofont-spinner icofont-spin"></i>
                  <span>Updating...</span>
                </>
              ) : isJoined ? (
                <>
                  <i className="icofont-check-circled"></i>
                  <span>Joined Community</span>
                </>
              ) : (
                <>
                  <i className="icofont-plus-circle"></i>
                  <span>Join Community</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
