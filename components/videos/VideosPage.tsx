"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Script from "next/script";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useMemo } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import PostInteractions from "@/components/posts/PostInteractions";
import { type FeedPost, useGetFeedPostsQuery } from "@/lib/services/authApi";

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

type MenuItem = {
  title: string;
  href: string;
  iconClass: string;
  active?: boolean;
  children?: Array<{ label: string; href: string }>;
};

type PlaylistVideo = {
  href: string;
  image: string;
  name: string;
  age: string;
  views: string;
};

const sidebarMenu: MenuItem[] = [
  {
    title: "Home",
    href: "#",
    iconClass: "icofont-home",
    active: true,
    children: [
      { label: "Newsfeed", href: "/" },
      { label: "User Profile", href: "/profile" },
      { label: "Chat/Messages", href: "/messages" },
      { label: "Groups", href: "groups.html" },
    ],
  },
  {
    title: "Features",
    href: "#",
    iconClass: "icofont-flash",
    children: [
      { label: "Videos", href: "/videos" },
      { label: "Live Stream", href: "live-stream.html" },
      { label: "Events Page", href: "event-page.html" },
      { label: "Support Help", href: "help-faq.html" },
    ],
  },
  {
    title: "Market Place",
    href: "#",
    iconClass: "icofont-shopping-bag",
    children: [
      { label: "Course", href: "courses.html" },
      { label: "Course Detail", href: "course-detail.html" },
      { label: "Cart Page", href: "product-cart.html" },
    ],
  },
  {
    title: "Blogs",
    href: "#",
    iconClass: "icofont-coffee-cup",
    children: [
      { label: "Blog", href: "blog.html" },
      { label: "Blog Detail", href: "blog-detail.html" },
    ],
  },
  {
    title: "Live Chat",
    href: "/messages",
    iconClass: "icofont-ui-messaging",
  },
  {
    title: "Web Settings",
    href: "settings.html",
    iconClass: "icofont-settings",
  },
];

const watchList = [
  { name: "Rosie Garebal", image: "/images/resources/user2.jpg", unread: true },
  { name: "Danial Cabral", image: "/images/resources/user3.jpg", unread: false },
  { name: "William John", image: "/images/resources/user4.jpg", unread: true },
  { name: "Adrew Jane", image: "/images/resources/user5.jpg", unread: false },
  { name: "Billgates", image: "/images/resources/user1.jpg", unread: true },
  { name: "Rita Arvind", image: "/images/resources/user2.jpg", unread: false },
];

function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

function formatCompactCount(value: number | undefined): string {
  const count = Number(value || 0);

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}m`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(count);
}

function isYouTubeUrl(value: string | null | undefined): boolean {
  const normalized = String(value || "").trim().toLowerCase();

  return normalized.includes("youtube.com") || normalized.includes("youtu.be");
}

function isYouTubePost(post: FeedPost): boolean {
  return isYouTubeUrl(post.embedUrl) || isYouTubeUrl(post.linkUrl) || isYouTubeUrl(post.href);
}

function getVideoTitle(post: FeedPost): string {
  return String(post.title || "").trim();
}

function getVideoDescription(post: FeedPost): string {
  const description = String(post.description || post.content || "").trim();
  const title = getVideoTitle(post);

  if (!description || description === title) {
    return "";
  }

  return description;
}

function buildPlaylistVideos(posts: FeedPost[]): PlaylistVideo[] {
  return posts.slice(0, 4).map((post) => ({
    href: post.linkUrl || `/posts/${post.id}`,
    image: post.authorImage || "/images/resources/user.jpg",
    name: post.authorName,
    age: post.published,
    views: formatCompactCount(post.stats?.viewCount),
  }));
}

function VideosStatus({
  isLoading,
  hasError,
  isEmpty,
}: {
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
}) {
  if (isLoading) {
    return (
      <div className="main-wraper">
        <p>Loading YouTube posts...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="main-wraper">
        <p>Video posts could not be loaded right now.</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="main-wraper">
        <p>No posts with YouTube links have been published yet.</p>
      </div>
    );
  }

  return null;
}

function VideoCard({ post }: { post: FeedPost }) {
  const authorHref = post.authorId ? `/profile/${post.authorId}` : "/profile";
  const postHref = `/posts/${post.id}`;
  const title = getVideoTitle(post);
  const description = getVideoDescription(post);
  const videoUrl = post.linkUrl || post.embedUrl || post.href || "";
  const embedUrl = post.embedUrl;

  return (
    <div className="main-wraper">
      <div className="user-post video">
        <div className="friend-info">
          <figure>
            <img alt={post.authorName} src={post.authorImage || "/images/resources/user.jpg"} />
          </figure>
          <div className="friend-name">
            <div className="more">
              <div className="more-post-optns">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-more-horizontal"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </i>
                <ul>
                  <li>
                    <Link href={postHref}>
                      <i className="icofont-info-circle"></i>View Post
                      <span>Open the full post with comments and reactions</span>
                    </Link>
                  </li>
                  <li>
                    <Link href={authorHref}>
                      <i className="icofont-user"></i>View Profile
                      <span>Open {post.authorName}&apos;s profile</span>
                    </Link>
                  </li>
                  {videoUrl ? (
                    <li>
                      <a href={videoUrl} target="_blank" rel="noreferrer">
                        <i className="icofont-link"></i>Open YouTube
                        <span>Watch this video on YouTube</span>
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
            <ins>
              <Link title={post.authorName} href={authorHref}>
                {post.authorName}
              </Link>{" "}
              {post.activity}{" "}
              <em>
                <Link href={postHref} title="Open post">
                  Open Post
                </Link>
              </em>
            </ins>
            <span>
              <i className="icofont-globe"></i> published: {post.published}
            </span>
          </div>
          <div className="post-meta">
            {title ? <h4>{title}</h4> : null}
            {description ? <p>{description}</p> : null}
            {post.linkUrl ? (
              <em>
                <a href={post.linkUrl} target="_blank" rel="noreferrer">
                  {post.linkUrl}
                </a>
              </em>
            ) : null}
            {embedUrl ? (
              <iframe
                title={`${post.authorName} shared video`}
                height="400"
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : null}
            <PostInteractions
              postId={post.id}
              initialStats={post.stats}
              initialComments={post.comments}
              shareUrl={post.linkUrl || post.href || undefined}
              postDetailHref={postHref}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideosPage() {
  const { data, isLoading, error } = useGetFeedPostsQuery();
  const youTubePosts = useMemo(() => {
    const posts = data?.posts || [];
    return posts.filter(isYouTubePost);
  }, [data?.posts]);
  const playlistVideos = useMemo(() => buildPlaylistVideos(youTubePosts), [youTubePosts]);
  const firstVideoPosts = youTubePosts.slice(0, 2);
  const remainingVideoPosts = youTubePosts.slice(2);

  return (
    <RequireAuth>
      <>
        <div className="theme-layout">
          <HomeHeader />

          <nav className="sidebar">
            <ul className="menu-slide">
              {sidebarMenu.map((item) => (
                <li
                  key={item.title}
                  className={`${item.children ? "menu-item-has-children" : ""} ${item.active ? "active" : ""}`.trim()}
                >
                  <SmartLink href={item.href} title={item.title}>
                    <i className={item.iconClass}></i> {item.title}
                  </SmartLink>
                  {item.children ? (
                    <ul className="submenu">
                      {item.children.map((child) => (
                        <li key={`${item.title}-${child.label}`}>
                          <SmartLink href={child.href} title={child.label}>
                            {child.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <section>
            <div className="gap">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div id="page-contents" className="row merged20">
                      <div className="col-lg-3">
                        <aside className="sidebar static left">
                          <div className="widget stick-widget">
                            <h4 className="widget-title">Watch</h4>
                            <form className="video-search" method="post">
                              <i>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-search"
                                >
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                              </i>
                              <input type="text" placeholder="Search Video" />
                              <button type="submit"></button>
                            </form>
                            <ul className="video-links">
                              <li>
                                <Link href="/" title="Home">
                                  <i>
                                    <svg
                                      className="feather feather-home"
                                      strokeLinejoin="round"
                                      strokeLinecap="round"
                                      strokeWidth="2"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      height="18"
                                      width="18"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                      <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                  </i>{" "}
                                  Home
                                </Link>
                              </li>
                              <li>
                                <a href="#" title="Latest">
                                  <i>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-youtube"
                                    >
                                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                                    </svg>
                                  </i>{" "}
                                  Latest
                                </a>
                              </li>
                              <li>
                                <a href="#" title="Trending">
                                  <i>
                                    <svg
                                      className="feather feather-zap"
                                      strokeLinejoin="round"
                                      strokeLinecap="round"
                                      strokeWidth="2"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      height="18"
                                      width="18"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                  </i>{" "}
                                  Trending
                                </a>
                              </li>
                              <li>
                                <a href="#" title="Live">
                                  <i>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-mic"
                                    >
                                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                      <line x1="12" y1="19" x2="12" y2="23"></line>
                                      <line x1="8" y1="23" x2="16" y2="23"></line>
                                    </svg>
                                  </i>{" "}
                                  Live
                                </a>
                              </li>
                              <li>
                                <a href="#" title="Saved Videos">
                                  <i>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-save"
                                    >
                                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                      <polyline points="7 3 7 8 15 8"></polyline>
                                    </svg>
                                  </i>{" "}
                                  Saved Videos
                                </a>
                              </li>
                            </ul>
                            <h4 className="main-title">
                              <i>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-list"
                                >
                                  <line x1="8" y1="6" x2="21" y2="6"></line>
                                  <line x1="8" y1="12" x2="21" y2="12"></line>
                                  <line x1="8" y1="18" x2="21" y2="18"></line>
                                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                              </i>{" "}
                              Your Watch List
                            </h4>
                            <ul className="watchlist">
                              {watchList.map((person) => (
                                <li key={`${person.name}-${person.image}`} className={person.unread ? "unread" : ""}>
                                  <figure>
                                    <img src={person.image} alt={person.name} />
                                  </figure>
                                  <a href="#" title={person.name}>
                                    {person.name}
                                  </a>
                                  <span className="new-highlight"></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </aside>
                      </div>

                      <div className="col-lg-9">
                        <div className="main-wraper">
                          <div className="main-title">Latest Videos</div>
                          <VideosStatus
                            isLoading={isLoading}
                            hasError={Boolean(error) && !youTubePosts.length}
                            isEmpty={!isLoading && !error && !youTubePosts.length}
                          />

                          {firstVideoPosts.map((post) => (
                            <VideoCard key={post.id} post={post} />
                          ))}

                          {playlistVideos.length ? (
                            <div className="main-wraper">
                              <div className="wraper-title">
                                <span>
                                  <i className="icofont-video-alt"></i> Videos Play List
                                </span>
                                <Link href="/videos" title="See all Videos">
                                  See all Videos
                                </Link>
                              </div>
                              <div className="videos-caro">
                                {playlistVideos.map((video) => (
                                  <div className="item-video" data-merge="2" key={`${video.href}-${video.name}`}>
                                    <a className="owl-video" href={video.href}></a>
                                    <div className="posted-user">
                                      <img src={video.image} alt={video.name} />
                                      <span>{video.name}</span>
                                    </div>
                                    <div className="vid-info">
                                      <span>{video.age}</span>
                                      <span>
                                        <i className="icofont-eye-open"></i> {video.views}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {remainingVideoPosts.map((post) => (
                            <VideoCard key={post.id} post={post} />
                          ))}

                          <div className="sp sp-bars"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <figure className="bottom-mockup">
            <img src="/images/footer.png" alt="" />
          </figure>
          <div className="bottombar">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <span>&copy; copyright All rights reserved by Extremis 2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Script id="videos-carousel-fix" strategy="lazyOnload">
          {`
            (function () {
              var configs = [
                {
                  selector: ".header-shortcuts .page-caro",
                  options: {
                    items: 6,
                    loop: true,
                    margin: 0,
                    autoplay: false,
                    nav: false,
                    dots: false,
                    responsive: { 0: { items: 5 }, 600: { items: 5 }, 1000: { items: 6 } }
                  }
                },
                {
                  selector: ".videos-caro",
                  options: {
                    items: 3,
                    loop: true,
                    margin: 15,
                    autoplay: false,
                    video: true,
                    lazyLoad: true,
                    center: true,
                    merge: true,
                    videoWidth: true,
                    nav: true,
                    dots: false,
                    responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 3 } }
                  }
                }
              ];

              var tryInit = function () {
                var $ = window.jQuery;
                if (!$ || !$.fn || !$.fn.owlCarousel) return false;
                configs.forEach(function (config) {
                  $(config.selector).each(function () {
                    var $element = $(this);
                    if ($element.hasClass("owl-loaded")) return;
                    $element.owlCarousel(config.options);
                  });
                });
                return true;
              };

              var attempts = 0;
              var timer = window.setInterval(function () {
                attempts += 1;
                if (tryInit() || attempts > 20) window.clearInterval(timer);
              }, 250);

              if (document.readyState !== "loading") {
                tryInit();
              } else {
                document.addEventListener("DOMContentLoaded", tryInit, { once: true });
              }
            })();
          `}
        </Script>
      </>
    </RequireAuth>
  );
}
