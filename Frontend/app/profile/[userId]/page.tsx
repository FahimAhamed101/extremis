import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import PublicProfilePageClient from "@/components/profile/PublicProfilePageClient";

type UserProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;

  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <PublicProfilePageClient userId={userId} />
      </div>
    </RequireAuth>
  );
}
