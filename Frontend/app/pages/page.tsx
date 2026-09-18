import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import PagesDirectoryClient from "@/components/pages/PagesDirectoryClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "Pages – Follow Creators, Businesses & Brands on Updates",
  description:
    "Explore and follow official pages for creators, local businesses, public figures, and community organizations on Updates.",
  alternates: {
    canonical: "/pages",
  },
};

export default function PagesDirectoryPage() {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <PagesDirectoryClient />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
