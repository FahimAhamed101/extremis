"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { type FeedPost, useGetFeedPostsQuery } from "@/lib/services/authApi";
import PostInteractions from "@/components/posts/PostInteractions";

function PostMoreOptions() {
  return (
    <div className="more">
      <div className="more-post-optns">
        <i className="icofont-navigation-menu"></i>
        <ul>
          <li>
            <i className="icofont-info-circle"></i>Post details
            <span>This post was published from the create post modal</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FeedPostCard({ post }: { post: FeedPost }) {
  return (
    <div className="main-wraper">
      <div className="user-post">
        <div className="friend-info">
          <figure>
            <img alt={post.authorName} src={post.authorImage} />
          </figure>
          <div className="friend-name">
            <PostMoreOptions />
            <ins>
              <Link href="/profile">{post.authorName}</Link> {post.activity}
            </ins>
            <span>
              <i className="icofont-globe"></i> published: {post.published}
            </span>
          </div>
          <div className="post-meta">
            {post.linkUrl ? (
              <em>
                <a href={post.linkUrl} target="_blank" rel="noreferrer">
                  {post.linkUrl}
                </a>
              </em>
            ) : null}
            {post.content ? <p>{post.content}</p> : null}
            {post.embedUrl ? (
              <iframe
                title={`${post.authorName} shared video`}
                height="285"
                src={post.embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : null}
            {!post.embedUrl && post.videoUrl ? (
              <div className="custom-post-video">
                <video controls preload="metadata" src={post.videoUrl}></video>
              </div>
            ) : null}
            {post.attachmentType === "image" && post.attachmentUrl ? (
              <figure>
                <img src={post.attachmentUrl} alt={post.attachmentName || "Post attachment"} />
              </figure>
            ) : null}
            {post.attachmentType === "video" && post.attachmentUrl ? (
              <div className="custom-post-video">
                <video controls preload="metadata" src={post.attachmentUrl}></video>
              </div>
            ) : null}
            {post.attachmentType === "file" && post.attachmentUrl ? (
              <a
                className="post-title custom-post-attachment"
                href={post.attachmentUrl}
                target="_blank"
                rel="noreferrer"
              >
                {post.attachmentName || "Open attachment"}
              </a>
            ) : null}
            {post.status === "scheduled" ? (
              <p className="create-post-status is-success">Scheduled for {post.published}</p>
            ) : null}
            <PostInteractions
              postId={post.id}
              initialStats={post.stats}
              initialComments={post.comments}
              shareUrl={post.linkUrl || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeedClient() {
  const { data, isLoading, error } = useGetFeedPostsQuery();
  const posts = data?.posts || [];

  if (!isLoading && !posts.length) {
    return null;
  }

  if (error && !posts.length) {
    return null;
  }

  return (
    <>
      {posts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}
    </>
  );
}
