"use client";

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/auth/client";
import { useGetPostByIdQuery } from "@/lib/services/authApi";
import { FeedPostCard } from "@/components/posts/HomeFeedClient";

type PostDetailPageClientProps = {
  postId: string;
};

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "We could not load this post.";
}

export default function PostDetailPageClient({ postId }: PostDetailPageClientProps) {
  const router = useRouter();
  const normalizedPostId = String(postId || "").trim();
  const { data, error, isLoading } = useGetPostByIdQuery(normalizedPostId || skipToken, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const status =
      error && typeof error === "object" && "status" in error
        ? (error as { status?: number | string }).status
        : null;

    if (status !== 401) {
      return;
    }

    clearAuthSession();
    router.replace("/login");
  }, [error, router]);

  return (
    <section>
      <div className="gap">
        <div className="container">
          <div className="main-wraper">
            <div className="post-detail-header">
              <h3 className="main-title">Post Details</h3>
              <Link href="/" className="post-detail-inline-link">
                Back to feed
              </Link>
            </div>

            {isLoading ? <p>Loading post details...</p> : null}
            {!isLoading && !normalizedPostId ? <p>Post not found.</p> : null}
            {!isLoading && normalizedPostId && !data ? <p>{getErrorMessage(error)}</p> : null}
          </div>

          {data?.post ? (
            <FeedPostCard post={data.post} forceCommentsOpen={true} showDetailLink={false} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
