"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { type FeedPost, useGetFeedPostsQuery } from "@/lib/services/authApi";
import PostInteractions from "@/components/posts/PostInteractions";
import CreatePostCard from "@/components/posts/CreatePostCard";

type SmartLinkProps = {
  href: string;
  className?: string;
  title?: string;
  children: ReactNode;
};

function SmartLink({ href, className, title, children }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} title={title} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function PostMoreOptions({ postId }: { postId: string }) {
  return (
    <div className="more">
      <div className="more-post-optns">
        <i className="icofont-navigation-menu"></i>
        <ul>
          <li>
            <Link href={`/posts/${postId}`}>
              <i className="icofont-info-circle"></i>Post details
              <span>Open the full post with all comments and reactions</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

function renderAlbum(images: string[], title: string, morePhotosCount?: number) {
  if (!images.length) {
    return null;
  }

  return (
    <figure>
      <div className="img-bunch">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            {images.slice(0, 2).map((albumImage) => (
              <figure key={albumImage}>
                <a data-toggle="modal" data-target="#img-comt" href={albumImage}>
                  <img
                    src={albumImage}
                    alt={title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                    }}
                  />
                </a>
              </figure>
            ))}
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            {images.slice(2).map((albumImage, index, rest) => (
              <figure key={albumImage}>
                <a data-toggle="modal" data-target="#img-comt" href={albumImage}>
                  <img
                    src={albumImage}
                    alt={title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                    }}
                  />
                </a>
                {index === rest.length - 1 && morePhotosCount ? (
                  <div className="more-photos">
                    <span>+{morePhotosCount}</span>
                  </div>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

export function FeedPostBody({ post }: { post: FeedPost }) {
  const title = post.title || "";
  const description = post.description || post.content || "";
  const href = post.href || post.linkUrl || "#";
  const ctaHref = post.ctaHref || href;
  const image = post.image || null;
  const images = post.images || [];
  const audioSources = post.audioSources || [];
  const sponsorItems = post.sponsorItems || [];

  switch (post.type) {
    case "bg":
      return (
        <div
          className="bg-post-card"
          style={{
            background: image
              ? `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.88) 100%), url(${image}) center/cover no-repeat`
              : "linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #7c3aed 100%)",
            borderRadius: "12px",
            padding: "36px 24px",
            color: "#ffffff",
            textAlign: "center",
            margin: "12px 0 16px",
            minHeight: "170px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.15)",
          }}
        >
          {title ? (
            <h4 style={{ color: "#ffffff", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
              {title}
            </h4>
          ) : null}
          {description ? (
            <p style={{ color: "#f8fafc", fontSize: "16px", fontWeight: "500", lineHeight: "1.6", maxWidth: "520px", margin: "0 auto" }}>
              {description}
            </p>
          ) : null}
        </div>
      );

    case "article":
      return (
        <>
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {image ? (
            <figure style={{ marginTop: "10px", marginBottom: "12px" }}>
              <img
                src={image}
                alt={title || "Article visual"}
                style={{ width: "100%", borderRadius: "8px", maxHeight: "440px", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                }}
              />
            </figure>
          ) : null}
          {description ? <p>{description}</p> : null}
        </>
      );

    case "premium":
      return (
        <>
          {image ? (
            <figure className="premium-post">
              <img
                src={image}
                alt={title || "Premium post"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/resources/book5.jpg";
                }}
              />
            </figure>
          ) : null}
          <div className="premium">
            {title ? (
              <SmartLink href={href} className="post-title" title={title}>
                {title}
              </SmartLink>
            ) : null}
            {description ? <p>{description}</p> : null}
            <SmartLink href={ctaHref} className="main-btn purchase-btn" title={post.ctaLabel || "Open"}>
              <i className="icofont-cart-alt"></i> {post.ctaLabel || "Buy Now"}
            </SmartLink>
          </div>
        </>
      );

    case "image":
      return (
        <>
          {image ? (
            <figure style={{ marginBottom: "12px" }}>
              <a data-toggle="modal" data-target="#img-comt" href={image}>
                <img
                  src={image}
                  alt={title || "Shared image"}
                  style={{ width: "100%", borderRadius: "8px", maxHeight: "480px", objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                  }}
                />
              </a>
            </figure>
          ) : null}
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {description ? <p>{description}</p> : null}
        </>
      );

    case "album":
      return (
        <>
          {renderAlbum(images, title || "Album post", post.morePhotosCount)}
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {description ? <p>{description}</p> : null}
        </>
      );

    case "link":
      return (
        <>
          {post.linkUrl ? (
            <em>
              <a href={post.linkUrl} target="_blank" rel="noreferrer">
                {post.linkUrl}
              </a>
            </em>
          ) : null}
          {image ? (
            <figure style={{ margin: "10px 0 12px" }}>
              <span>{post.fetchedImageLabel || "fetched-image"}</span>
              <img
                src={image}
                alt={title || "Link preview"}
                style={{ width: "100%", borderRadius: "8px", maxHeight: "380px", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                }}
              />
            </figure>
          ) : null}
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {description ? <p>{description}</p> : null}
        </>
      );

    case "video":
      return (
        <>
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {post.linkUrl && !post.embedUrl ? (
            <em>
              <a href={post.linkUrl} target="_blank" rel="noreferrer">
                {post.linkUrl}
              </a>
            </em>
          ) : null}
          {post.embedUrl ? (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "10px", margin: "12px 0" }}>
              <iframe
                title={`${post.authorName} shared video`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0, borderRadius: "10px" }}
                src={post.embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : null}
          {!post.embedUrl && post.videoUrl ? (
            <div className="custom-post-video" style={{ margin: "12px 0" }}>
              <video controls preload="metadata" src={post.videoUrl} style={{ width: "100%", borderRadius: "10px", maxHeight: "420px" }}></video>
            </div>
          ) : null}
          {description ? <p>{description}</p> : null}
        </>
      );

    case "audio":
      return (
        <>
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {description ? <p>{description}</p> : null}
          {audioSources.length > 0 ? (
            <div className="aud-vid" style={{ margin: "12px 0" }}>
              <audio className="audio-player" controls style={{ width: "100%" }}>
                {audioSources.map((source) => (
                  <source key={`${source.url}-${source.mimeType || "audio"}`} src={source.url} type={source.mimeType || undefined} />
                ))}
              </audio>
            </div>
          ) : null}
        </>
      );

    case "gif":
      return (
        <figure style={{ margin: "12px 0" }}>
          <img
            className="gif"
            src={post.gifPreview || post.gifDataUrl || ""}
            data-gif={post.gifDataUrl || undefined}
            alt={title || "Shared gif"}
            style={{ borderRadius: "8px", maxWidth: "100%" }}
          />
        </figure>
      );

    case "sponsor":
      return (
        <ul className="sponsored-caro">
          {sponsorItems.map((item) => (
            <li key={item.id}>
              {item.image ? (
                <figure>
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                    }}
                  />
                </figure>
              ) : null}
              <div className="sponsor-prod-name">
                <a href={item.href || "#"} title={item.title}>
                  {item.title}
                </a>
                {item.priceLabel ? <span>{item.priceLabel}</span> : null}
              </div>
              <a href={item.href || "#"} title={item.title} className="shop-btn">
                {item.ctaLabel || "Shop Now"}
              </a>
              {item.shareLabel || item.likeLabel ? (
                <div className="share-info">
                  {item.shareLabel ? <span>{item.shareLabel}</span> : null}
                  {item.likeLabel ? <span>{item.likeLabel}</span> : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      );

    case "custom":
    default:
      return (
        <>
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {post.linkUrl ? (
            <em>
              <a href={post.linkUrl} target="_blank" rel="noreferrer">
                {post.linkUrl}
              </a>
            </em>
          ) : null}
          {description ? <p>{description}</p> : null}
          {image ? (
            <figure style={{ margin: "10px 0 12px" }}>
              <img
                src={image}
                alt={title || "Post image"}
                style={{ width: "100%", borderRadius: "8px", maxHeight: "480px", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                }}
              />
            </figure>
          ) : null}
          {post.embedUrl ? (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "10px", margin: "12px 0" }}>
              <iframe
                title={`${post.authorName} shared video`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0, borderRadius: "10px" }}
                src={post.embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : null}
          {!post.embedUrl && post.videoUrl ? (
            <div className="custom-post-video" style={{ margin: "12px 0" }}>
              <video controls preload="metadata" src={post.videoUrl} style={{ width: "100%", borderRadius: "10px" }}></video>
            </div>
          ) : null}
          {post.attachmentType === "image" && post.attachmentUrl && post.attachmentUrl !== image ? (
            <figure style={{ margin: "10px 0 12px" }}>
              <img
                src={post.attachmentUrl}
                alt={post.attachmentName || "Post attachment"}
                style={{ width: "100%", borderRadius: "8px", maxHeight: "480px", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/resources/study.jpg";
                }}
              />
            </figure>
          ) : null}
          {post.attachmentType === "video" && post.attachmentUrl && post.attachmentUrl !== post.videoUrl ? (
            <div className="custom-post-video" style={{ margin: "12px 0" }}>
              <video controls preload="metadata" src={post.attachmentUrl} style={{ width: "100%", borderRadius: "10px" }}></video>
            </div>
          ) : null}
          {post.attachmentType === "file" && post.attachmentUrl ? (
            <a className="post-title custom-post-attachment" href={post.attachmentUrl} target="_blank" rel="noreferrer">
              <i className="icofont-attachment"></i> {post.attachmentName || "Open attachment"}
            </a>
          ) : null}
          {post.status === "scheduled" ? (
            <p className="create-post-status is-success">Scheduled for {post.published}</p>
          ) : null}
        </>
      );
  }
}

type FeedPostCardProps = {
  post: FeedPost;
  forceCommentsOpen?: boolean;
  showDetailLink?: boolean;
};

export function FeedPostCard({
  post,
  forceCommentsOpen = false,
  showDetailLink = true,
}: FeedPostCardProps) {
  // Prevent empty ghost posts from rendering a blank box
  const hasContent = Boolean(
    post.title?.trim() ||
    post.content?.trim() ||
    post.description?.trim() ||
    post.image ||
    post.attachmentUrl ||
    post.images?.length ||
    post.videoUrl ||
    post.embedUrl ||
    post.audioSources?.length
  );

  if (!hasContent) {
    return null;
  }

  const authorHref = post.authorId ? `/profile/${post.authorId}` : "/profile";
  const postDetailHref = `/posts/${post.id}`;

  return (
    <div className="main-wraper" style={{ marginBottom: "20px" }}>
      <div className="user-post">
        <div className="friend-info">
          <figure>
            <img
              alt={post.authorName}
              src={post.authorImage || "/images/resources/user.jpg"}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/resources/user.jpg";
              }}
            />
          </figure>
          <div className="friend-name">
            <PostMoreOptions postId={post.id} />
            <ins>
              <Link href={authorHref}>{post.authorName}</Link> {post.activity}
            </ins>
            <span>
              <i className="icofont-globe"></i> published: {post.published}
            </span>
          </div>
          <div className="post-meta">
            <FeedPostBody post={post} />
            {showDetailLink ? (
              <div className="post-detail-link-row">
                <Link href={postDetailHref} className="post-detail-inline-link">
                  View details
                </Link>
              </div>
            ) : null}
            <PostInteractions
              postId={post.id}
              initialStats={post.stats}
              initialComments={post.comments}
              initialReactions={post.reactions}
              shareUrl={post.linkUrl || post.href || undefined}
              defaultCommentsOpen={forceCommentsOpen || Boolean(post.commentsOpen)}
              postDetailHref={postDetailHref}
              hideDetailLink={!showDetailLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeFeedClient() {
  const { data, isLoading, error, refetch } = useGetFeedPostsQuery();
  const [activeTab, setActiveTab] = useState<"home" | "recent" | "favourite">("home");

  const rawPosts = data?.posts || [];

  // Filter posts by active tab
  let visiblePosts = rawPosts;
  if (activeTab === "recent") {
    visiblePosts = [...rawPosts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } else if (activeTab === "favourite") {
    visiblePosts = rawPosts.filter((p) => p.stats?.likedByViewer || (p.stats?.likeCount || 0) > 0);
  }

  return (
    <>
      {/* Feed Navigation Tabs */}
      <ul className="filtr-tabs">
        <li>
          <a
            className={activeTab === "home" ? "active" : ""}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("home");
            }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            className={activeTab === "recent" ? "active" : ""}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("recent");
            }}
          >
            Recent
          </a>
        </li>
        <li>
          <a
            className={activeTab === "favourite" ? "active" : ""}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("favourite");
            }}
          >
            Favourite
          </a>
        </li>
      </ul>

      {/* Interactive Post Creator */}
      <CreatePostCard onPostCreated={() => refetch()} />

      {/* Feed Posts */}
      {isLoading ? (
        <div className="main-wraper" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div className="sp sp-bars" style={{ margin: "0 auto 16px" }}></div>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Loading your newsfeed updates...</p>
        </div>
      ) : error ? (
        <div className="main-wraper" style={{ textAlign: "center", padding: "30px 20px" }}>
          <i className="icofont-warning-alt" style={{ fontSize: "32px", color: "#f59e0b", marginBottom: "8px", display: "inline-block" }}></i>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Could not refresh live feed right now.</p>
          <button
            onClick={() => refetch()}
            style={{ marginTop: "10px", background: "#088dcd", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 16px", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="main-wraper" style={{ textAlign: "center", padding: "40px 20px" }}>
          <i className="icofont-newspaper" style={{ fontSize: "36px", color: "#94a3b8", marginBottom: "10px", display: "inline-block" }}></i>
          <h5 style={{ color: "#334155", fontWeight: "600" }}>No posts yet</h5>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Be the first to share an update with your research colleagues!</p>
        </div>
      ) : (
        visiblePosts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))
      )}
    </>
  );
}
