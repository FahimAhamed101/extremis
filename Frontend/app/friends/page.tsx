import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import FriendsPageClient from "@/components/friends/FriendsPageClient";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "Friends & Connections – Meet Friends & Family on Updates",
  description:
    "Find, follow, and connect with your friends and family on Updates. Explore suggestions, manage friend requests, and grow your personal social circle.",
  alternates: {
    canonical: "/friends",
  },
};

export default function FriendsPage() {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <div className="container" style={{ paddingTop: "24px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#1f273f",
              margin: "0 0 6px",
              lineHeight: 1.25,
            }}
          >
            Friends &amp; Connections
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
            Find people you know, manage friend requests and grow your circle.
          </p>
        </div>
        <FriendsPageClient />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
