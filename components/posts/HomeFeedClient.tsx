"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { type ReactNode } from "react";
import { type FeedPost, useGetFeedPostsQuery } from "@/lib/services/authApi";
import PostInteractions from "@/components/posts/PostInteractions";

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

function PostMoreOptions() {
  return (
    <div className="more">
      <div className="more-post-optns">
        <i className="icofont-navigation-menu"></i>
        <ul>
          <li>
            <i className="icofont-info-circle"></i>Post details
            <span>This post was published from the create post flow</span>
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
                  <img src={albumImage} alt={title} />
                </a>
              </figure>
            ))}
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            {images.slice(2).map((albumImage, index, rest) => (
              <figure key={albumImage}>
                <a data-toggle="modal" data-target="#img-comt" href={albumImage}>
                  <img src={albumImage} alt={title} />
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

function FeedPostBody({ post }: { post: FeedPost }) {
  const title = post.title || "";
  const description = post.description || post.content || "";
  const href = post.href || post.linkUrl || "#";
  const ctaHref = post.ctaHref || href;
  const image = post.image || null;
  const images = post.images || [];
  const audioSources = post.audioSources || [];
  const sponsorItems = post.sponsorItems || [];

  switch (post.type) {
    case "article":
      return (
        <>
          {title ? (
            <SmartLink href={href} className="post-title" title={title}>
              {title}
            </SmartLink>
          ) : null}
          {description ? <p>{description}</p> : null}
        </>
      );
    case "premium":
      return (
        <>
          {image ? (
            <figure className="premium-post">
              <img src={image} alt={title || "Premium post"} />
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
            <figure>
              <a data-toggle="modal" data-target="#img-comt" href={image}>
                <img src={image} alt={title || "Shared image"} />
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
            <figure>
              <span>{post.fetchedImageLabel || "fetched-image"}</span>
              <img src={image} alt={title || "Link preview"} />
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
          {post.linkUrl ? (
            <em>
              <a href={post.linkUrl} target="_blank" rel="noreferrer">
                {post.linkUrl}
              </a>
            </em>
          ) : null}
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
            <div className="aud-vid">
              <audio className="audio-player" controls>
                {audioSources.map((source) => (
                  <source key={`${source.url}-${source.mimeType || "audio"}`} src={source.url} type={source.mimeType || undefined} />
                ))}
              </audio>
            </div>
          ) : null}
        </>
      );
    case "gif":
      return <img className="gif" src={post.gifPreview || post.gifDataUrl || ""} data-gif={post.gifDataUrl || undefined} alt={title || "Shared gif"} />;
    case "sponsor":
      return (
        <ul className="sponsored-caro">
          {sponsorItems.map((item) => (
            <li key={item.id}>
              {item.image ? (
                <figure>
                  <img src={item.image} alt={item.title} />
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
          {post.linkUrl ? (
            <em>
              <a href={post.linkUrl} target="_blank" rel="noreferrer">
                {post.linkUrl}
              </a>
            </em>
          ) : null}
          {description ? <p>{description}</p> : null}
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
            <a className="post-title custom-post-attachment" href={post.attachmentUrl} target="_blank" rel="noreferrer">
              {post.attachmentName || "Open attachment"}
            </a>
          ) : null}
          {post.status === "scheduled" ? (
            <p className="create-post-status is-success">Scheduled for {post.published}</p>
          ) : null}
        </>
      );
  }
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
            <FeedPostBody post={post} />
            <PostInteractions
              postId={post.id}
              initialStats={post.stats}
              initialComments={post.comments}
              shareUrl={post.linkUrl || post.href || undefined}
              defaultCommentsOpen={Boolean(post.commentsOpen)}
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
