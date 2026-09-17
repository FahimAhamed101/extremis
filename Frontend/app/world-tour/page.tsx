import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import WorldTourPageClient from "@/components/worldtour/WorldTourPageClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "World Tour - Explore Global Places & Maps | Socimo",
  description: "Search places on interactive maps, explore global research and innovation hubs, and connect with people worldwide.",
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
