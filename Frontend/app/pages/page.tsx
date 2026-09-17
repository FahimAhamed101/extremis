import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import PagesDirectoryClient from "@/components/pages/PagesDirectoryClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "Pages - Discover Research Labs & Organizations | Socimo",
  description: "Explore official pages for research laboratories, university faculties, tech innovators, and academic journals.",
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
