import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import NearbyPageClient from "@/components/nearby/NearbyPageClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "Discover People Nearby – Connect with Friends & Locals on Updates",
  description:
    "Find and connect with friends, family members, and community members near your location on the Updates interactive map.",
  alternates: {
    canonical: "/nearby",
  },
};

export default function NearbyPage() {
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
            People &amp; Places Nearby
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0 }}>
            Discover friends, groups and communities around your location.
          </p>
        </div>
        <NearbyPageClient />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
