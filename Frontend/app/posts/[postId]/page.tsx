import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import PostDetailPageClient from "@/components/posts/PostDetailPageClient";

type PostDetailPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;

  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <PostDetailPageClient postId={postId} />
      </div>
    </RequireAuth>
  );
}
