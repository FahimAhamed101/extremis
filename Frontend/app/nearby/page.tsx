import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import NearbyPageClient from "@/components/nearby/NearbyPageClient";

export const metadata: Metadata = {
  title: "Nearby People & Researchers | Socimo",
  description: "Find and connect with researchers, students, and professionals near your location on an interactive map.",
};

export default function NearbyPage() {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <NearbyPageClient />
      </div>
    </RequireAuth>
  );
}
