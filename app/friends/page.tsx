import RequireAuth from "@/components/auth/RequireAuth";
import FriendsPageClient from "@/components/friends/FriendsPageClient";
import HomeHeader from "@/components/layout/HomeHeader";

export default function FriendsPage() {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <FriendsPageClient />
      </div>
    </RequireAuth>
  );
}
