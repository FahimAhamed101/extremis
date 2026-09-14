"use client";

import React from "react";
import Link from "next/link";
import { useGetMyGroupsQuery } from "@/lib/services/authApi";

export default function YourGroupsWidget() {
  const { data, isLoading } = useGetMyGroupsQuery();
  const groups = data?.groups || [];

  return (
    <div className="widget" style={{ borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h4 className="widget-title" style={{ margin: 0, paddingBottom: 0 }}>Your Groups</h4>
        <Link href="/groups" className="see-all" style={{ fontSize: "12px", color: "#088dcd", fontWeight: 600 }}>
          See All
        </Link>
      </div>

      {isLoading ? (
        <div style={{ padding: "20px 0", textAlign: "center", color: "#888", fontSize: "13px" }}>
          <i className="icofont-spinner icofont-spin" style={{ marginRight: "6px" }}></i>
          Loading groups...
        </div>
      ) : groups.length === 0 ? (
        <div style={{ padding: "15px 0", textAlign: "center", color: "#777", fontSize: "13px" }}>
          <p style={{ margin: "0 0 10px 0" }}>You haven't joined any groups yet.</p>
          <Link
            href="/groups"
            className="main-btn2"
            style={{ display: "inline-block", padding: "6px 14px", fontSize: "12px" }}
          >
            Explore Groups
          </Link>
        </div>
      ) : (
        <ul className="ak-groups">
          {groups.map((group) => {
            const avatarSrc = group.iconUrl || "/images/groups/good-group-avatar.jpg";
            const notifCount = group.notificationsCount || 13;

            return (
              <li key={group._id || group.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <figure style={{ width: "46px", height: "46px", flexShrink: 0, margin: 0, borderRadius: "50%", overflow: "hidden", border: "2px solid #edf2f6" }}>
                  <img
                    src={avatarSrc}
                    alt={group.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/groups/good-group-avatar.jpg";
                    }}
                  />
                </figure>
                <div className="your-grp" style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ margin: "0 0 4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Link href={`/groups?id=${group._id || group.id}`} title={group.name} style={{ fontWeight: 600, color: "#222" }}>
                      {group.name}
                    </Link>
                  </h5>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "5px" }}>
                    <span style={{ fontSize: "11px", color: "#888", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <i className="icofont-bell-alt" style={{ color: "#088dcd" }}></i>
                      Notifications <span style={{ background: "#ff5e3a", color: "#fff", padding: "1px 5px", borderRadius: "10px", fontSize: "10px", fontWeight: 700 }}>{notifCount}</span>
                    </span>
                    <Link href={`/groups?id=${group._id || group.id}`} className="promote" style={{ fontSize: "11px", fontWeight: 600, color: "#088dcd" }}>
                      view feed
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
