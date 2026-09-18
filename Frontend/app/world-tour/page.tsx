import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import WorldTourPageClient from "@/components/worldtour/WorldTourPageClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "World Tour – Explore Global Places & Connect Worldwide on Updates",
  description:
    "Explore interactive world maps, discover global travel stories, and connect with international friends and communities on Updates.",
  alternates: {
    canonical: "/world-tour",
  },
};

export default function WorldTourPage() {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <WorldTourPageClient />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
