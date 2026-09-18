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
        <NearbyPageClient />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
