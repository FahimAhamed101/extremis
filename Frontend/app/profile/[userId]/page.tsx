import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import PublicProfilePageClient from "@/components/profile/PublicProfilePageClient";

type UserProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { userId } = await params;
  return {
    title: `User Profile – Updates Social Network`,
    description: `View user profile, timeline, posts, and connect with friends on Updates.`,
    alternates: {
      canonical: `/profile/${userId}`,
    },
    openGraph: {
      title: `User Profile – Updates Social Network`,
      description: `Connect with friends and family on Updates.`,
    },
  };
}

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
