import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import PostDetailPageClient from "@/components/posts/PostDetailPageClient";
import AppFooter from "@/components/layout/AppFooter";

type PostDetailPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { postId } = await params;
  return {
    title: `Post Update – Updates Social Network`,
    description: `Read and join the discussion on Updates. Share moments, thoughts, and connect with friends and family.`,
    alternates: {
      canonical: `/posts/${postId}`,
    },
    openGraph: {
      title: `Social Post Update | Updates`,
      description: `Join the conversation on Updates – the open Facebook alternative.`,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;

  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <PostDetailPageClient postId={postId} />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
