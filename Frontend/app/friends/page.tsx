import RequireAuth from "@/components/auth/RequireAuth";
import FriendsPageClient from "@/components/friends/FriendsPageClient";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";

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
