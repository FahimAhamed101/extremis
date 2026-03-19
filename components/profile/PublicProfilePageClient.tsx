"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import PostInteractions from "@/components/posts/PostInteractions";
import { clearAuthSession } from "@/lib/auth/client";
import type {
  ProfilePersonCard,
  ProfileTimelinePost,
} from "@/lib/services/authApi";
import { useGetProfileByIdQuery, useToggleFollowUserMutation } from "@/lib/services/authApi";

type PublicProfilePageClientProps = {
  userId: string;
};

type PublicProfileTab = "posts" | "pictures" | "videos" | "friends" | "about";

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

const sidebarMenu: MenuItem[] = [
  {
    title: "Home",
    href: "#",
    iconClass: "icofont-home",
    active: true,
    children: [
      { label: "Newsfeed", href: "/" },
      { label: "User Profile", href: "/profile" },
      { label: "Messages", href: "/messages" },
      { label: "Groups", href: "groups.html" },
    ],
  },
  {
    title: "Features",
    href: "#",
    iconClass: "icofont-flash",
    children: [
      { label: "Videos", href: "videos.html" },
      { label: "Live Stream", href: "live-stream.html" },
      { label: "Events", href: "event-page.html" },
      { label: "Support", href: "help-faq.html" },
    ],
  },
  {
    title: "Market Place",
    href: "#",
    iconClass: "icofont-shopping-bag",
    children: [
      { label: "Books", href: "books.html" },
      { label: "Courses", href: "courses.html" },
      { label: "Checkout", href: "product-checkout.html" },
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

const fallbackVideoThumbs = [
  "/images/resources/user-video1.jpg",
  "/images/resources/user-video2.jpg",
  "/images/resources/user-video3.jpg",
  "/images/resources/user-video4.jpg",
  "/images/resources/user-video5.jpg",
  "/images/resources/user-video6.jpg",
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

  return "We could not load this profile.";
}

function formatCompactNumber(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return String(value);
}

function toExternalHref(value: string) {
  const normalized = String(value || "").trim();
  if (!normalized || normalized === "Not added") {
    return null;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (/^www\./i.test(normalized)) {
    return `https://${normalized}`;
  }

  return null;
}

function buildGalleryImages(posts: ProfileTimelinePost[], researchImages: string[], fallbackImage: string) {
  const seen = new Set<string>();

  const addImage = (value?: string | null) => {
    const normalized = String(value || "").trim();
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
  };

  researchImages.forEach((image) => addImage(image));

  posts.forEach((post) => {
    addImage(post.image);
    addImage(post.attachmentType === "image" ? post.attachmentUrl : null);
    post.images?.forEach((image) => addImage(image));
  });

  addImage(fallbackImage);

  return Array.from(seen);
}

function buildFriendsList(followers: ProfilePersonCard[], following: ProfilePersonCard[]) {
  const seen = new Set<string>();
  const people: ProfilePersonCard[] = [];

  [...followers, ...following].forEach((person) => {
    const key = `${person.name}::${person.image}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    people.push(person);
  });

  return people;
}

function renderTimelineMedia(post: ProfileTimelinePost) {
  if (post.type === "album" && post.images?.length) {
    return (
      <div className="img-bunch profile-post-gallery">
        <div className="row">
          {post.images.slice(0, 4).map((image, index) => (
            <div className="col-lg-6 col-md-6 col-sm-6" key={`${post.id}-image-${index}`}>
              <figure>
                <img src={image} alt={post.title || `${post.authorName} shared media`} />
              </figure>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (post.embedUrl) {
    return (
      <iframe
        title={`${post.authorName} shared video`}
        height="285"
        src={post.embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  if (post.videoUrl) {
    return <video controls preload="metadata" className="profile-page-two-video-player" src={post.videoUrl}></video>;
  }

  if (post.gifDataUrl || post.gifPreview) {
    return <img className="gif" src={post.gifDataUrl || post.gifPreview || ""} alt={post.title || "Animated media"} />;
  }

  if (post.image) {
    return (
      <figure>
        <img src={post.image} alt={post.title || `${post.authorName} shared media`} />
      </figure>
    );
  }

  if (post.attachmentType === "image" && post.attachmentUrl) {
    return (
      <figure>
        <img src={post.attachmentUrl} alt={post.attachmentName || `${post.authorName} attachment`} />
      </figure>
    );
  }

  if (post.attachmentType === "video" && post.attachmentUrl) {
    return <video controls preload="metadata" className="profile-page-two-video-player" src={post.attachmentUrl}></video>;
  }

  return null;
}

function TimelinePostCard({ post }: { post: ProfileTimelinePost }) {
  const href = String(post.href || post.linkUrl || "#").trim() || "#";
  const shareUrl = post.linkUrl || post.href || post.videoUrl || post.embedUrl || undefined;

  return (
    <div className="main-wraper">
      <div className="user-post">
        <div className="friend-info">
          <figure>
            <img alt={post.authorName} src={post.authorImage} />
          </figure>
          <div className="friend-name">
            <ins>
              <a title={post.authorName} href="#">
                {post.authorName}
              </a>{" "}
              {post.activity}
            </ins>
            <span>
              <i className="icofont-globe"></i> published: {post.published}
            </span>
          </div>
          <div className="post-meta">
            {post.linkUrl ? (
              <em>
                <a href={post.linkUrl} title="" target="_blank" rel="noreferrer">
                  {post.linkUrl}
                </a>
              </em>
            ) : null}
            {renderTimelineMedia(post)}
            {post.title ? (
              <SmartLink href={href} className="post-title" title={post.title}>
                {post.title}
              </SmartLink>
            ) : null}
            {post.description || post.content ? <p>{post.description || post.content}</p> : null}
            {post.attachmentType === "file" && post.attachmentUrl ? (
              <a href={post.attachmentUrl} className="post-title" target="_blank" rel="noreferrer">
                {post.attachmentName || "Open attachment"}
              </a>
            ) : null}
            {post.ctaHref && post.ctaLabel ? (
              <SmartLink href={post.ctaHref} className="main-btn purchase-btn" title={post.ctaLabel}>
                <i className="icofont-cart-alt"></i> {post.ctaLabel}
              </SmartLink>
            ) : null}
            <PostInteractions
              postId={post.id}
              initialStats={post.stats}
              initialComments={post.comments || []}
              shareUrl={shareUrl}
              defaultCommentsOpen={Boolean(post.commentsOpen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePageClient({ userId }: PublicProfilePageClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PublicProfileTab>("posts");
  const [pendingFollowUserId, setPendingFollowUserId] = useState<string | null>(null);
  const [followErrorMessage, setFollowErrorMessage] = useState<string | null>(null);
  const normalizedUserId = String(userId || "").trim();
  const [toggleFollowUser] = useToggleFollowUserMutation();
  const { data, error, isLoading } = useGetProfileByIdQuery(
    normalizedUserId || skipToken,
    {
      refetchOnMountOrArgChange: true,
    },
  );

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

  async function handleToggleFollow(person: ProfilePersonCard) {
    const personId = String(person.id || "").trim();

    if (!personId || !person.canFollow || pendingFollowUserId) {
      return;
    }

    setPendingFollowUserId(personId);
    setFollowErrorMessage(null);

    try {
      await toggleFollowUser(personId).unwrap();
    } catch (followError) {
      setFollowErrorMessage(getErrorMessage(followError));
    } finally {
      setPendingFollowUserId(null);
    }
  }

  const galleryImages = useMemo(
    () =>
      buildGalleryImages(
        data?.timeline || [],
        data?.media.researchImages || [],
        data?.profile.avatarUrl || "/images/resources/user.jpg",
      ),
    [data],
  );

  const friendsList = useMemo(
    () => buildFriendsList(data?.network.followers || [], data?.network.following || []),
    [data],
  );

  if (isLoading) {
    return (
      <section>
        <div className="gap">
          <div className="container">
            <div className="main-wraper">
              <h3 className="main-title">Loading profile</h3>
              <p>Fetching the selected user and building the TSX profile page.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!normalizedUserId) {
    return (
      <section>
        <div className="gap">
          <div className="container">
            <div className="main-wraper">
              <h3 className="main-title">Profile unavailable</h3>
              <p>Profile not found.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section>
        <div className="gap">
          <div className="container">
            <div className="main-wraper">
              <h3 className="main-title">Profile unavailable</h3>
              <p>{getErrorMessage(error)}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const profile = data.profile;
  const timelinePosts = data.timeline || [];
  const recentPeople = data.network.suggestions || [];
  const videoList = (data.media.videos || []).map((video, index) => ({
    ...video,
    previewImage: fallbackVideoThumbs[index % fallbackVideoThumbs.length],
  }));
  const websiteHref = toExternalHref(profile.contact.website);
  const profileStats = [
    { label: "Joined", value: profile.joined },
    { label: "Follow", value: formatCompactNumber(profile.analytics.followingCount) },
    { label: "Followers", value: formatCompactNumber(profile.analytics.followerCount) },
    { label: "Posts", value: formatCompactNumber(timelinePosts.length) },
  ];

  return (
    <>


      <section>
        <div className="gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  <div className="col-lg-3">
                    <aside className="sidebar static left">
                      <div className="widget">
                        <h4 className="widget-title">Contact Details</h4>
                        <ul className="profile-contact-list">
                          <li>
                            <span>Display Name</span>
                            <p>{profile.fullName}</p>
                          </li>
                          <li>
                            <span>Local Time</span>
                            <p>{profile.contact.localTime}</p>
                          </li>
                          <li>
                            <span>Email Address</span>
                            <p>{profile.contact.emailAddress}</p>
                          </li>
                          <li>
                            <span>Phone Number</span>
                            <p>{profile.contact.phoneNumber}</p>
                          </li>
                          <li>
                            <span>Skype Id</span>
                            <p>{profile.contact.skypeId}</p>
                          </li>
                          <li>
                            <span>Website</span>
                            <p>
                              {websiteHref ? (
                                <a href={websiteHref} target="_blank" rel="noreferrer">
                                  {profile.contact.website}
                                </a>
                              ) : (
                                profile.contact.website
                              )}
                            </p>
                          </li>
                        </ul>
                      </div>

                      <div className="widget">
                        <h4 className="widget-title">Research Interests</h4>
                        <div className="profile-pill-list">
                          {profile.disciplines.map((discipline) => (
                            <span key={discipline}>{discipline}</span>
                          ))}
                        </div>
                      </div>

                      <div className="widget">
                        <h4 className="widget-title">Skills &amp; Expertise</h4>
                        <div className="profile-pill-list">
                          {profile.skills.map((skill) => (
                            <span key={skill}>{skill}</span>
                          ))}
                        </div>
                      </div>

                      <div className="widget">
                        <h4 className="widget-title">
                          Explore Events{" "}
                          <a className="see-all" href="#" title="">
                            See All
                          </a>
                        </h4>
                        {data.events.map((event) => (
                          <div className={`rec-events ${event.themeClass}`} key={event.id}>
                            <i className={event.iconClass}></i>
                            <h6>
                              <a title="" href={event.href || "#"}>
                                {event.title}
                              </a>
                            </h6>
                            <img alt="" src={event.image} />
                          </div>
                        ))}
                      </div>

                      <div className="widget stick-widget">
                        <h4 className="widget-title">Suggested Researchers</h4>
                        <ul className="followers">
                          {recentPeople.slice(0, 5).map((person) => {
                            const personId = String(person.id || "").trim();
                            const isUpdating = pendingFollowUserId === personId;

                            return (
                              <li key={personId || `${person.name}-${person.image}`}>
                                <figure>
                                  <img alt={person.name} src={person.image} />
                                </figure>
                                <div className="friend-meta">
                                  <h4>
                                    <SmartLink title={person.name} href={person.profileHref || "#"}>
                                      {person.name}
                                    </SmartLink>
                                    <span>{person.subtitle}</span>
                                  </h4>
                                  {person.canFollow ? (
                                    <button
                                      type="button"
                                      className="underline profile-follow-action"
                                      title={person.actionLabel}
                                      onClick={() => handleToggleFollow(person)}
                                      disabled={isUpdating}
                                    >
                                      {isUpdating ? "Updating..." : person.actionLabel}
                                    </button>
                                  ) : (
                                    <span className="underline">{person.actionLabel}</span>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        {!recentPeople.length ? (
                          <p className="profile-page-two-empty">No suggested researchers available yet.</p>
                        ) : null}
                        {followErrorMessage ? <p className="profile-follow-error">{followErrorMessage}</p> : null}
                      </div>
                    </aside>
                  </div>

                  <div className="col-lg-9">
                    <div className="group-feed">
                      <div className="group-avatar">
                        <img src={profile.coverImageUrl} alt={profile.fullName} />
                        <Link href="/messages" title="Send Message">
                          <i className="icofont-check-circled"></i>Message
                        </Link>
                        <figure className="group-dp">
                          <img src={profile.avatarUrl} alt={profile.fullName} />
                        </figure>
                      </div>

                      <div className="grp-info about">
                        <h4>
                          {profile.fullName} <span>{profile.handle}</span>
                        </h4>
                        <ul className="joined-info">
                          {profileStats.map((item) => (
                            <li key={item.label}>
                              <span>{item.label}:</span> {item.value}
                            </li>
                          ))}
                        </ul>
                        <ul className="nav nav-tabs about-btn">
                          {([
                            ["posts", "Posts"],
                            ["pictures", "Pictures"],
                            ["videos", "Videos"],
                            ["friends", "Friends"],
                            ["about", "About"],
                          ] as const).map(([tabKey, label]) => (
                            <li className="nav-item" key={tabKey}>
                              <a
                                className={activeTab === tabKey ? "active" : ""}
                                href={`#${tabKey}`}
                                data-toggle="tab"
                                onClick={(event) => {
                                  event.preventDefault();
                                  setActiveTab(tabKey);
                                }}
                              >
                                {label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="main-wraper">
                        <div className="grp-about">
                          <div className="row">
                            <div className="col-lg-8 col-md-6">
                              <h4>About Me!</h4>
                              <p>{profile.bio}</p>
                              <ul className="badges">
                                <li><img src="/images/badges/badge2.png" alt="badge" /></li>
                                <li><img src="/images/badges/badge3.png" alt="badge" /></li>
                                <li><img src="/images/badges/badge4.png" alt="badge" /></li>
                                <li><img src="/images/badges/badge5.png" alt="badge" /></li>
                                <li><img src="/images/badges/badge7.png" alt="badge" /></li>
                                <li><img src="/images/badges/badge8.png" alt="badge" /></li>
                              </ul>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="share-article">
                                <span>Share Profile</span>
                                <a href="#" title="" className="facebook"><i className="icofont-facebook"></i></a>
                                <a href="#" title="" className="pinterest"><i className="icofont-pinterest"></i></a>
                                <a href="#" title="" className="instagram"><i className="icofont-instagram"></i></a>
                                <a href="#" title="" className="twitter"><i className="icofont-twitter"></i></a>
                                <a href="#" title="" className="google"><i className="icofont-google-plus"></i></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tab-content">
                        <div className={`tab-pane fade ${activeTab === "posts" ? "active show" : ""}`} id="posts">
                          {timelinePosts.length ? (
                            timelinePosts.map((post) => <TimelinePostCard key={post.id} post={post} />)
                          ) : (
                            <div className="main-wraper">
                              <div className="profile-page-two-empty">No posts have been shared yet.</div>
                            </div>
                          )}
                        </div>

                        <div className={`tab-pane fade ${activeTab === "pictures" ? "active show" : ""}`} id="pictures">
                          <h5 className="tab-title">
                            Pictures <span>{galleryImages.length}</span>
                          </h5>
                          <ul className="pix-filter">
                            <li><a className="active" href="#" title="">All Photos</a></li>
                            <li><a href="#" title="">Profile Pictures</a></li>
                            <li><a href="#" title="">Albums</a></li>
                            <li><a href="#" title="">Research Media</a></li>
                          </ul>
                          <div className="row merged-10">
                            {galleryImages.map((image, index) => (
                              <div className="col-lg-3 col-md-4 col-sm-6" key={`${image}-${index}`}>
                                <div className="uzr-pictures">
                                  <a href={image} target="_blank" rel="noreferrer">
                                    <img alt={`${profile.fullName} media ${index + 1}`} src={image} />
                                  </a>
                                  <ul className="hover-action">
                                    <li><a href="#" title=""><i className="icofont-like"></i> 3</a></li>
                                    <li><a href="#" title=""><i className="icofont-chat"></i> 5</a></li>
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === "videos" ? "active show" : ""}`} id="videos">
                          <h5 className="tab-title">
                            Videos <span>{videoList.length}</span>
                          </h5>
                          <ul className="pix-filter">
                            <li><a title="" href="#" className="active">All Videos</a></li>
                            <li><a title="" href="#">Most views</a></li>
                            <li><a title="" href="#">Newest</a></li>
                            <li><a title="" href="#">Research talks</a></li>
                          </ul>
                          <div className="row merged-10">
                            {videoList.map((video) => (
                              <div className="col-lg-4 col-md-4 col-sm-6" key={video.href}>
                                <div className="user-video">
                                  <figure>
                                    <img alt={video.name} src={video.previewImage} />
                                    <a href={video.href} target="_blank" rel="noreferrer" className="play-btn">
                                      <i className="icofont-play"></i>
                                    </a>
                                  </figure>
                                  <span>{video.name}</span>
                                  <ul className="vid-action">
                                    <li><a href="#" title=""><i className="icofont-eye-open"></i> {video.views}</a></li>
                                    <li><a href="#" title=""><i className="icofont-clock-time"></i> {video.meta}</a></li>
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === "friends" ? "active show" : ""}`} id="friends">
                          <h5 className="tab-title">
                            Friends <span>{friendsList.length}</span>
                          </h5>
                          <ul className="pix-filter">
                            <li><a title="" href="#" className="active">All Friends</a></li>
                            <li><a title="" href="#">Followers</a></li>
                            <li><a title="" href="#">Following</a></li>
                            <li><a title="" href="#">Connections</a></li>
                          </ul>
                          <div className="row merged-10 col-xs-6">
                            {friendsList.map((person) => (
                              <div className="col-lg-3 col-md-4 col-sm-6" key={`${person.name}-${person.image}`}>
                                <div className="friendz">
                                  <figure><img src={person.image} alt={person.name} /></figure>
                                  <span><a href="#" title={person.name}>{person.name}</a></span>
                                  <ins>{person.subtitle}</ins>
                                  <a href="#" title={person.actionLabel} data-ripple="">
                                    <i className="icofont-star"></i> {person.actionLabel}
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === "about" ? "active show" : ""}`} id="about">
                          <div className="row merged20">
                            <div className="col-lg-8">
                              <div className="main-wraper">
                                <h5 className="main-title">Personal</h5>
                                <div className="info-block-list">
                                  <ul>
                                    <li>Display Name: <span>{profile.fullName}</span></li>
                                    <li>Location: <span>{profile.location}</span></li>
                                    <li>Web: <span>{profile.contact.website}</span></li>
                                    <li>Email: <span>{profile.contact.emailAddress}</span></li>
                                    <li>Phone: <span>{profile.contact.phoneNumber}</span></li>
                                    <li>Occupation: <span>{profile.position}</span></li>
                                    <li>Department: <span>{profile.department}</span></li>
                                  </ul>
                                </div>
                              </div>

                              <div className="main-wraper">
                                <h5 className="main-title">Interests</h5>
                                <div className="info-block-list">
                                  <div className="info-block">
                                    <h6>Researcher Type</h6>
                                    <p>{profile.researcherType}</p>
                                  </div>
                                  <div className="info-block">
                                    <h6>Institute</h6>
                                    <p>{profile.institute}</p>
                                  </div>
                                  <div className="info-block">
                                    <h6>Bio</h6>
                                    <p>{profile.bio}</p>
                                  </div>
                                  <div className="info-block">
                                    <h6>Disciplines</h6>
                                    <p>{profile.disciplines.join(", ")}</p>
                                  </div>
                                  <div className="info-block">
                                    <h6>Skills</h6>
                                    <p>{profile.skills.join(", ")}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <aside className="sidebar">
                                <div className="widget">
                                  <h4 className="widget-title">Complete Profile</h4>
                                  <span>Profile completeness based on the information this user has shared publicly.</span>
                                  <div data-progress="tip" className="progress__outer" data-value={profile.completion / 100}>
                                    <div className="progress__inner">{profile.completion}%</div>
                                  </div>
                                  <ul className="prof-complete">
                                    <li><i className="icofont-plus-square"></i> <a href="#" title="">Profile setup</a><em>{profile.completion}%</em></li>
                                    <li><i className="icofont-plus-square"></i> <a href="#" title="">Institute added</a><em>{profile.institute ? "100%" : "0%"}</em></li>
                                    <li><i className="icofont-plus-square"></i> <a href="#" title="">Research interests</a><em>{profile.disciplines.length ? "100%" : "0%"}</em></li>
                                  </ul>
                                </div>

                                <div className="widget">
                                  <h4 className="widget-title">User Stats</h4>
                                  <ul className="user-stat">
                                    <li><i className="icofont-ui-user"></i><span>Researcher type <em>{profile.researcherType}</em></span></li>
                                    <li><i className="icofont-university"></i><span>Institute <em>{profile.institute}</em></span></li>
                                    <li><i className="icofont-user-alt-4"></i><span>Followers <em>{formatCompactNumber(profile.analytics.followerCount)}</em></span></li>
                                    <li><i className="icofont-users-alt-4"></i><span>Following <em>{formatCompactNumber(profile.analytics.followingCount)}</em></span></li>
                                  </ul>
                                </div>
                              </aside>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <figure className="bottom-mockup">
        <img alt="" src="/images/footer.png" />
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
    </>
  );
}
