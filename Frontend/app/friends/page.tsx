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
        <FriendsPageClient />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
