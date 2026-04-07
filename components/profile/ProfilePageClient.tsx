"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import PostInteractions, { type PostInteractionStats } from "@/components/posts/PostInteractions";
import { clearAuthSession, setAuthSession } from "@/lib/auth/client";
import {
  AUTH_STORAGE_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "@/lib/auth/constants";
import {
  type ProfileDashboard,
  type ProfileEvent,
  type ProfilePersonCard,
  type ProfileTimelinePost,
  type ProfileVideoCard,
  type UserDto,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadProfileAssetMutation,
} from "@/lib/services/authApi";

type ProfileTab = "timeline" | "followers" | "follow" | "about";
type UploadKind = "avatar" | "cover";
const MAX_PROFILE_MEDIA_BYTES = 10 * 1024 * 1024;

type MenuItem = {
  title: string;
  href: string;
  iconClass: string;
  active?: boolean;
  children?: Array<{ label: string; href: string }>;
};

type PersonCard = ProfilePersonCard;
type VideoCard = ProfileVideoCard;
type CommentItem = {
  id?: string;
  userId?: string | null;
  name: string;
  image: string;
  time: string;
  message: string;
  link?: string;
};
type EventCard = ProfileEvent;

type ProfilePostProps = {
  postId?: string;
  authorName: string;
  authorImage: string;
  activity: string;
  published: string;
  children: ReactNode;
  emojiCount?: string;
  commentsOpen?: boolean;
  comments?: CommentItem[];
  shareUrl?: string;
  stats?: PostInteractionStats;
};

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

const sidebarMenu: MenuItem[] = [
  {
    title: "Home",
    href: "#",
    iconClass: "icofont-home",
    active: true,
    children: [
      { label: "Newsfeed", href: "/" },
      { label: "Company Home", href: "company-home.html" },
      { label: "User Profile", href: "/profile" },
      { label: "Messages", href: "/messages" },
      { label: "Notifications", href: "notifications.html" },
      { label: "Search Result", href: "search-result.html" },
    ],
  },
  {
    title: "Features",
    href: "#",
    iconClass: "icofont-light-bulb",
    children: [
      { label: "Videos", href: "/videos" },
      { label: "Live Stream", href: "live-stream.html" },
      { label: "Events Page", href: "event-page.html" },
      { label: "QA", href: "Q-A.html" },
      { label: "Support", href: "help-faq.html" },
    ],
  },
  {
    title: "Market Place",
    href: "#",
    iconClass: "icofont-shopping-cart",
    children: [
      { label: "Books", href: "books.html" },
      { label: "Courses", href: "courses.html" },
      { label: "Add New Course", href: "add-new-course.html" },
      { label: "Cart", href: "product-cart.html" },
      { label: "Checkout", href: "product-checkout.html" },
    ],
  },
  {
    title: "Blogs",
    href: "#",
    iconClass: "icofont-coffee-cup",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Blog Detail", href: "blog-detail.html" },
    ],
  },
  {
    title: "Featured Pages",
    href: "#",
    iconClass: "icofont-file-text",
    children: [
      { label: "404", href: "404.html" },
      { label: "Coming Soon", href: "coming-soon.html" },
      { label: "Badges", href: "badges.html" },
      { label: "Thank You", href: "thank-you.html" },
    ],
  },
  {
    title: "Authentications",
    href: "#",
    iconClass: "icofont-lock",
    children: [
      { label: "Sign In", href: "/login" },
      { label: "Sign Up", href: "/signup" },
      { label: "Forgot Password", href: "forgot-password.html" },
    ],
  },
  {
    title: "University Profile",
    href: "about-university.html",
    iconClass: "icofont-users-social",
  },
  {
    title: "Live Chat",
    href: "/messages",
    iconClass: "icofont-ui-messaging",
  },
  {
    title: "Privacy Policies",
    href: "privacy-n-policy.html",
    iconClass: "icofont-shield-alt",
  },
  {
    title: "Web Settings",
    href: "settings.html",
    iconClass: "icofont-settings",
  },
  {
    title: "Development Tools",
    href: "#",
    iconClass: "icofont-tools",
    children: [
      { label: "Widgets Collection", href: "widgets.html" },
      { label: "Web Component", href: "development-component.html" },
      { label: "Web Elements", href: "development-elements.html" },
      { label: "Loader Spinners", href: "loader-spiners.html" },
    ],
  },
];

const followerCards: PersonCard[] = [
  { name: "Amy Watson", subtitle: "Bz University, Pakistan", image: "/images/resources/speak-1.jpg", actionLabel: "Follow" },
  { name: "Muhammad Khan", subtitle: "Oxford University, UK", image: "/images/resources/speak-2.jpg", actionLabel: "Follow" },
  { name: "Sadia Gill", subtitle: "Wb University, USA", image: "/images/resources/speak-3.jpg", actionLabel: "Follow" },
  { name: "Rjapal", subtitle: "Km University, India", image: "/images/resources/speak-4.jpg", actionLabel: "Follow" },
  { name: "Amy Watson", subtitle: "Oxford University, UK", image: "/images/resources/speak-5.jpg", actionLabel: "Follow" },
  { name: "Bob Frank", subtitle: "WB University, Canada", image: "/images/resources/speak-6.jpg", actionLabel: "Follow" },
];

const followingCards: PersonCard[] = [
  { name: "Amy Watson", subtitle: "Bz University, Pakistan", image: "/images/resources/speak-10.jpg", actionLabel: "Unfollow" },
  { name: "Muhammad Khan", subtitle: "Oxford University, UK", image: "/images/resources/speak-11.jpg", actionLabel: "Unfollow" },
  { name: "Sadia Gill", subtitle: "WB University, USA", image: "/images/resources/speak-12.jpg", actionLabel: "Unfollow" },
  { name: "Rjapal", subtitle: "Km University, India", image: "/images/resources/speak-4.jpg", actionLabel: "Unfollow" },
  { name: "Amy Watson", subtitle: "Oxford University, UK", image: "/images/resources/speak-1.jpg", actionLabel: "Unfollow" },
  { name: "Bob Frank", subtitle: "WB University, Canada", image: "/images/resources/speak-2.jpg", actionLabel: "Unfollow" },
];

const suggestedResearchers: PersonCard[] = [
  { name: "Amy Watson", subtitle: "Department of Sociology", image: "/images/resources/speak-1.jpg", actionLabel: "Follow" },
  { name: "Muhammad Khan", subtitle: "Department of Sociology", image: "/images/resources/speak-2.jpg", actionLabel: "Follow" },
  { name: "Sadia Gill", subtitle: "Department of Sociology", image: "/images/resources/speak-3.jpg", actionLabel: "Follow" },
  { name: "Aykash Verma", subtitle: "Department of Sociology", image: "/images/resources/speak-4.jpg", actionLabel: "Follow" },
];

const whoIsFollowing: PersonCard[] = [
  { name: "Kelly Bill", subtitle: "Dept colleague", image: "/images/resources/friend-avatar.jpg", actionLabel: "Follow" },
  { name: "Issabel", subtitle: "Dept colleague", image: "/images/resources/friend-avatar2.jpg", actionLabel: "Follow" },
  { name: "Andrew", subtitle: "Dept colleague", image: "/images/resources/friend-avatar3.jpg", actionLabel: "Follow" },
  { name: "Sophia", subtitle: "Dept colleague", image: "/images/resources/friend-avatar4.jpg", actionLabel: "Follow" },
  { name: "Allen", subtitle: "Dept colleague", image: "/images/resources/friend-avatar5.jpg", actionLabel: "Follow" },
];

const videoCards: VideoCard[] = [
  { href: "https://www.youtube.com/watch?v=8iZTb9NWbz8", image: "/images/resources/user4.jpg", name: "Frank J.", meta: "1 year ago", views: "3.1k" },
  { href: "https://www.youtube.com/watch?v=8itUNRIWVIs", image: "/images/resources/user2.jpg", name: "Maria K.", meta: "2 weeks ago", views: "1.1k" },
  { href: "https://www.youtube.com/watch?v=JpxsRwnRwCQ", image: "/images/resources/user1.jpg", name: "Jack Carter", meta: "4 weeks ago", views: "20k" },
  { href: "https://www.youtube.com/watch?v=WNeLUngb-Xg", image: "/images/resources/user3.jpg", name: "Fawad Jan", meta: "1 month ago", views: "8k" },
];

const defaultComments: CommentItem[] = [
  {
    name: "Jack Carter",
    image: "/images/resources/user1.jpg",
    time: "2 hours ago",
    message: "I think that somehow we learn who we really are and then live with that decision. Great post!",
    link: "https://www.youtube.com/watch?v=HpZgwHU1GcI",
  },
  {
    name: "Ching xang",
    image: "/images/resources/user2.jpg",
    time: "2 hours ago",
    message: "I think that somehow we learn who we really are and then live with that decision. Great post!",
  },
];

const fallbackResearchImages = [
  "/images/resources/image1.jpg",
  "/images/resources/image2.jpg",
  "/images/resources/image3.jpg",
  "/images/resources/image4.jpg",
  "/images/resources/image5.jpg",
  "/images/resources/image6.jpg",
];

const fallbackTimelinePosts: ProfileTimelinePost[] = [
  {
    id: "article-post",
    type: "article",
    authorName: "Jack Carter",
    authorImage: "/images/resources/user1.jpg",
    activity: "shared a post",
    published: "Sep 15, 2020",
    title: "Supervision as a Personnel Development Device",
    description:
      "Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.",
    href: "post-detail.html",
  },
  {
    id: "premium-post",
    type: "premium",
    authorName: "Maria K.",
    authorImage: "/images/resources/user2.jpg",
    activity: "shared a premium product",
    published: "Sep 15, 2020",
    title: "Technical Words 2026 Book World",
    description:
      "Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.",
    href: "book-detail.html",
    image: "/images/resources/book5.jpg",
    ctaLabel: "Buy Now",
    ctaHref: "book-detail.html",
    commentsOpen: true,
  },
  {
    id: "image-post",
    type: "image",
    authorName: "Turgut Alp",
    authorImage: "/images/resources/user3.jpg",
    activity: "created a post",
    published: "Sep 15, 2020",
    title: "Supervision as a Personnel Development Device",
    description:
      "Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.",
    href: "post-detail.html",
    image: "/images/resources/study.jpg",
    emojiCount: "30+",
  },
  {
    id: "album-post",
    type: "album",
    authorName: "Saim Turan",
    authorImage: "/images/resources/user4.jpg",
    activity: "added an image album",
    published: "Sep 15, 2020",
    title: "Visual research notes from the latest field study",
    description:
      "Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.",
    href: "post-detail.html",
    images: [
      "/images/resources/album1.jpg",
      "/images/resources/album2.jpg",
      "/images/resources/album6.jpg",
      "/images/resources/album5.jpg",
      "/images/resources/album4.jpg",
    ],
    morePhotosCount: 15,
    emojiCount: "50+",
  },
  {
    id: "link-post",
    type: "link",
    authorName: "Andrew Jhon",
    authorImage: "/images/resources/user5.jpg",
    activity: "shared a link",
    published: "Sep 15, 2020",
    title: "Winku Social Network with Company Pages Theme",
    description:
      "Winku is a social community mobile app kit with features for sharing blogs, posts, timeline updates, groups, pages, messages, videos and Q&A content.",
    href: "https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538",
    image: "/images/resources/laptop.png",
    fetchedImageLabel: "fetched-image",
    commentsOpen: true,
  },
  {
    id: "video-post",
    type: "video",
    authorName: "Maria K.",
    authorImage: "/images/resources/user2.jpg",
    activity: "shared a video",
    published: "Sep 15, 2020",
    description:
      "Cookie? Biscuit? Bikkie? They all mean the same thing. This lesson compares pronunciation and vocabulary differences across Australia, America and England.",
    embedUrl: "https://www.youtube.com/embed/zdow47FQRfQ",
    emojiCount: "20+",
  },
  {
    id: "gif-post",
    type: "gif",
    authorName: "Maria K.",
    authorImage: "/images/resources/user2.jpg",
    activity: "shared a gif",
    published: "Sep 15, 2020",
    gifPreview: "/images/giphy.png",
    gifDataUrl: "/images/giphy-sample.gif",
    emojiCount: "20+",
  },
];

const fallbackEvents: EventCard[] = [
  {
    id: "networking-night",
    title: "BZ University networking night in Columbia",
    iconClass: "icofont-gift",
    themeClass: "bg-purple",
    image: "/images/clock.png",
    href: "#",
  },
  {
    id: "conference-2026",
    title: "The 3rd International Conference 2026",
    iconClass: "icofont-microphone",
    themeClass: "bg-blue",
    image: "/images/clock.png",
    href: "#",
  },
];

function readStoredUser(): UserDto | null {
  if (typeof window === "undefined") {
    return null;
  }

  let rawUser: string | null = null;

  try {
    rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  } catch {
    return null;
  }

  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as UserDto;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function readStoredToken(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function getFullName(user: UserDto | null): string {
  if (!user) {
    return "Guest User";
  }

  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

function getUserHandle(user: UserDto | null): string {
  if (!user) {
    return "@guest";
  }

  const emailPrefix = String(user.email || "").split("@")[0]?.trim();
  if (emailPrefix) {
    return `@${emailPrefix}`;
  }

  const normalizedName = getFullName(user).toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `@${normalizedName || "researcher"}`;
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatOptionalValue(value: string | null | undefined, fallback: string): string {
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
  const normalized = Array.from(
    new Set(
      (Array.isArray(value) ? value : [])
        .map((entry) => String(entry || "").trim())
        .filter(Boolean),
    ),
  );

  return normalized.length > 0 ? normalized : fallback;
}

function normalizePercent(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(parsed)));
}

function getCompletion(user: UserDto | null): number {
  if (!user) {
    return 0;
  }

  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.researcherType,
    user.institute,
    user.department,
    user.position,
    user.gender,
    user.avatarUrl,
    user.coverImageUrl,
  ];

  const completed = fields.filter((field) => String(field || "").trim()).length;
  return Math.round((completed / fields.length) * 100);
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    if ("data" in error) {
      const data = (error as { data?: unknown }).data;
      if (typeof data === "string" && data.trim()) {
        return data.trim();
      }

      if (
        isObjectRecord(data) &&
        typeof (data as { message?: unknown }).message === "string"
      ) {
        return String((data as { message: string }).message);
      }
    }

    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      return String((error as { message?: unknown }).message);
    }
  }

  return "We could not load your profile from the backend.";
}

function getCountFromLabel(value: string | undefined, fallback = 0): number {
  const parsed = Number.parseInt(String(value || "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getFallbackStats(emojiCount: string | undefined, commentCount: number): PostInteractionStats {
  const likeCount = getCountFromLabel(emojiCount, 10);
  const shareCount = 205;

  return {
    viewCount: Math.max(1, likeCount + commentCount + shareCount + 1),
    likeCount,
    commentCount,
    shareCount,
    likedByViewer: false,
  };
}

function getResolvedUser(user: Partial<UserDto> | null | undefined, fallbackUser: UserDto | null): UserDto {
  const baseUser = user && typeof user === "object" ? user : fallbackUser;

  return {
    id: formatOptionalValue(baseUser?.id, ""),
    firstName: formatOptionalValue(baseUser?.firstName, "Guest"),
    lastName: formatOptionalValue(baseUser?.lastName, "User"),
    email: formatOptionalValue(baseUser?.email, "guest@example.com"),
    researcherType: baseUser?.researcherType ?? null,
    institute: baseUser?.institute ?? null,
    department: baseUser?.department ?? null,
    position: baseUser?.position ?? null,
    gender: baseUser?.gender ?? null,
    avatarUrl: baseUser?.avatarUrl ?? null,
    coverImageUrl: baseUser?.coverImageUrl ?? null,
    bio: baseUser?.bio ?? null,
    location: baseUser?.location ?? null,
    website: baseUser?.website ?? null,
    phoneNumber: baseUser?.phoneNumber ?? null,
    skypeId: baseUser?.skypeId ?? null,
    localTime: baseUser?.localTime ?? null,
    disciplines: normalizeStringList(baseUser?.disciplines, []),
    skills: normalizeStringList(baseUser?.skills, []),
    createdAt: formatOptionalValue(baseUser?.createdAt, ""),
  };
}

function buildProfileDashboard(profile: Partial<ProfileDashboard> | null | undefined, fallbackUser: UserDto | null): ProfileDashboard {
  const resolvedUser = getResolvedUser(profile?.user, fallbackUser);
  const fullName = formatOptionalValue(profile?.fullName, getFullName(resolvedUser));
  const institute = formatOptionalValue(profile?.institute, formatOptionalValue(resolvedUser.institute, "Oxford University"));
  const department = formatOptionalValue(profile?.department, formatOptionalValue(resolvedUser.department, "Department not added"));
  const position = formatOptionalValue(profile?.position, formatOptionalValue(resolvedUser.position, "Professor Associate"));
  const researcherType = formatOptionalValue(
    profile?.researcherType,
    formatOptionalValue(resolvedUser.researcherType, "Educational leadership"),
  );
  const gender = formatOptionalValue(profile?.gender, formatOptionalValue(resolvedUser.gender, "Not specified"));
  const avatarUrl = formatOptionalValue(profile?.avatarUrl, formatOptionalValue(resolvedUser.avatarUrl, "/images/resources/user.jpg"));
  const coverImageUrl = formatOptionalValue(
    profile?.coverImageUrl,
    formatOptionalValue(resolvedUser.coverImageUrl, "/images/resources/top-bg.jpg"),
  );
  const location = formatOptionalValue(
    profile?.location,
    formatOptionalValue(resolvedUser.location, [department, institute].filter(Boolean).join(", ")),
  );
  const joined = formatOptionalValue(profile?.joined, formatDate(resolvedUser.createdAt));
  const completion = normalizePercent(profile?.completion, getCompletion(resolvedUser));
  const disciplines = normalizeStringList(profile?.disciplines, [
    ...resolvedUser.disciplines,
    researcherType,
    department,
    "Educational assessment",
    "Educational management",
    "Social Psychology",
    "Qualitative social research",
  ]);
  const skills = normalizeStringList(profile?.skills, [
    ...resolvedUser.skills,
    position,
    institute,
    "Research collaboration",
    "Mentoring",
    "Conference speaking",
    `Profile completion ${completion}%`,
  ]);
  const contact = profile?.contact;
  const analytics = profile?.analytics;

  return {
    user: resolvedUser,
    fullName,
    handle: formatOptionalValue(profile?.handle, getUserHandle(resolvedUser)),
    institute,
    department,
    position,
    researcherType,
    gender,
    avatarUrl,
    coverImageUrl,
    location,
    joined,
    completion,
    disciplines,
    skills,
    bio: formatOptionalValue(
      profile?.bio,
      formatOptionalValue(
        resolvedUser.bio,
        `${fullName} is building research collaborations, sharing field notes, and contributing to academic conversations across the Extremis network.`,
      ),
    ),
    headline: formatOptionalValue(profile?.headline, `${position} at ${institute}`),
    contact: {
      emailAddress: formatOptionalValue(contact?.emailAddress, resolvedUser.email),
      phoneNumber: formatOptionalValue(contact?.phoneNumber, formatOptionalValue(resolvedUser.phoneNumber, "Not added")),
      skypeId: formatOptionalValue(contact?.skypeId, formatOptionalValue(resolvedUser.skypeId, "Not added")),
      website: formatOptionalValue(contact?.website, formatOptionalValue(resolvedUser.website, "Not added")),
      localTime: formatOptionalValue(contact?.localTime, formatOptionalValue(resolvedUser.localTime, "3:40AM")),
    },
    analytics: {
      profileCompletion: normalizePercent(analytics?.profileCompletion, completion),
      researcherType: formatOptionalValue(analytics?.researcherType, researcherType),
      institute: formatOptionalValue(analytics?.institute, institute),
      joined: formatOptionalValue(analytics?.joined, joined),
      followerCount: Number.isFinite(Number(analytics?.followerCount))
        ? Number(analytics?.followerCount)
        : followerCards.length,
      followingCount: Number.isFinite(Number(analytics?.followingCount))
        ? Number(analytics?.followingCount)
        : followingCards.length,
    },
  };
}

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

function PostMoreOptions() {
  return (
    <div className="more">
      <div className="more-post-optns">
        <i className="icofont-navigation-menu"></i>
        <ul>
          <li>
            <i className="icofont-pen-alt-1"></i>Edit Post
            <span>Edit this post within an hour</span>
          </li>
          <li>
            <i className="icofont-ban"></i>Hide Post
            <span>Hide this post from your timeline</span>
          </li>
          <li>
            <i className="icofont-ui-delete"></i>Delete Post
            <span>Remove the post permanently</span>
          </li>
          <li>
            <i className="icofont-flag"></i>Report
            <span>Flag inappropriate content</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function WeVideoInfo() {
  return (
    <div className="we-video-info">
      <ul>
        <li>
          <span title="views" className="views">
            <i className="icofont-eye-open"></i>
            <ins>1.2k</ins>
          </span>
        </li>
        <li>
          <span title="Comments" className="Recommend">
            <i className="icofont-comment"></i>
            <ins>54</ins>
          </span>
        </li>
        <li>
          <span title="follow" className="Follow">
            <i className="icofont-star"></i>
            <ins>5k</ins>
          </span>
        </li>
        <li>
          <span className="share-pst" title="Share">
            <i className="icofont-share"></i>
            <ins>205</ins>
          </span>
        </li>
      </ul>
      <SmartLink href="post-detail.html" title="" className="reply">
        Reply <i className="icofont-reply"></i>
      </SmartLink>
    </div>
  );
}

function EmojiState({ count }: { count: string }) {
  return (
    <div className="emoji-state">
      <div className="popover_wrapper">
        <a className="popover_title" href="#" title="">
          <img alt="" src="/images/smiles/thumb.png" />
        </a>
        <div className="popover_content">
          <span>
            <img alt="" src="/images/smiles/thumb.png" /> Likes
          </span>
          <ul className="namelist">
            <li>Jhon Doe</li>
            <li>Amara Sin</li>
            <li>Sarah K.</li>
            <li>
              <span>20+ more</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="popover_wrapper">
        <a className="popover_title" href="#" title="">
          <img alt="" src="/images/smiles/heart.png" />
        </a>
        <div className="popover_content">
          <span>
            <img alt="" src="/images/smiles/heart.png" /> Love
          </span>
          <ul className="namelist">
            <li>Amara Sin</li>
            <li>Jhon Doe</li>
            <li>
              <span>10+ more</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="popover_wrapper">
        <a className="popover_title" href="#" title="">
          <img alt="" src="/images/smiles/smile.png" />
        </a>
        <div className="popover_content">
          <span>
            <img alt="" src="/images/smiles/smile.png" /> Happy
          </span>
          <ul className="namelist">
            <li>Sarah K.</li>
            <li>Jhon Doe</li>
            <li>Amara Sin</li>
            <li>
              <span>100+ more</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="popover_wrapper">
        <a className="popover_title" href="#" title="">
          <img alt="" src="/images/smiles/weep.png" />
        </a>
        <div className="popover_content">
          <span>
            <img alt="" src="/images/smiles/weep.png" /> Dislike
          </span>
          <ul className="namelist">
            <li>Danial Carbal</li>
            <li>Amara Sin</li>
            <li>Sarah K.</li>
            <li>
              <span>15+ more</span>
            </li>
          </ul>
        </div>
      </div>
      <p>{count}</p>
    </div>
  );
}

function CommentSection({ open, comments }: { open: boolean; comments: CommentItem[] }) {
  return (
    <div className="new-comment" style={{ display: open ? "block" : "none" }}>
      <form method="post">
        <input type="text" placeholder="write comment" />
        <button type="submit">
          <i className="icofont-paper-plane"></i>
        </button>
      </form>
      <div className="comments-area">
        <ul>
          {comments.map((comment) => (
            <li key={`${comment.name}-${comment.image}`}>
              <figure>
                <img alt="" src={comment.image} />
              </figure>
              <div className="commenter">
                <h5>
                  <a title="" href="#">
                    {comment.name}
                  </a>
                </h5>
                <span>{comment.time}</span>
                <p>{comment.message}</p>
                {comment.link ? (
                  <>
                    <span>you can view the more detail via link</span>
                    <a title="" href={comment.link} target="_blank" rel="noreferrer">
                      {comment.link}
                    </a>
                  </>
                ) : null}
              </div>
              <a title="Like" href="#">
                <i className="icofont-heart"></i>
              </a>
              <a title="Reply" href="#" className="reply-coment">
                <i className="icofont-reply"></i>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PostActions({
  openComments,
  emojiCount = "10+",
  comments,
}: {
  openComments: boolean;
  emojiCount?: string;
  comments: CommentItem[];
}) {
  return (
    <div className="stat-tools">
      <div className="box">
        <div className="Like">
          <a className="Like__link" href="#">
            <i className="icofont-like"></i> Like
          </a>
          <div className="Emojis">
            <div className="Emoji Emoji--like">
              <div className="icon icon--like"></div>
            </div>
            <div className="Emoji Emoji--love">
              <div className="icon icon--heart"></div>
            </div>
            <div className="Emoji Emoji--haha">
              <div className="icon icon--haha"></div>
            </div>
            <div className="Emoji Emoji--wow">
              <div className="icon icon--wow"></div>
            </div>
            <div className="Emoji Emoji--sad">
              <div className="icon icon--sad"></div>
            </div>
            <div className="Emoji Emoji--angry">
              <div className="icon icon--angry"></div>
            </div>
          </div>
        </div>
      </div>
      <a title="" href="#" className="comment-to">
        <i className="icofont-comment"></i> Comment
      </a>
      <a title="" href="#" className="share-to">
        <i className="icofont-share-alt"></i> Share
      </a>
      <EmojiState count={emojiCount} />
      <CommentSection open={openComments} comments={comments} />
    </div>
  );
}

function ProfilePost({
  postId,
  authorName,
  authorImage,
  activity,
  published,
  children,
  commentsOpen = false,
  emojiCount = "10+",
  comments = defaultComments,
  shareUrl,
  stats,
}: ProfilePostProps) {
  return (
    <div className="main-wraper">
      <div className="user-post">
        <div className="friend-info">
          <figure>
            <img alt="" src={authorImage} />
          </figure>
          <div className="friend-name">
            <PostMoreOptions />
            <ins>
              <SmartLink title="" href="/profile">
                {authorName}
              </SmartLink>{" "}
              {activity}
            </ins>
            <span>
              <i className="icofont-globe"></i> published: {published}
            </span>
          </div>
          <div className="post-meta">
            {children}
            <PostInteractions
              postId={postId}
              initialStats={stats || getFallbackStats(emojiCount, comments.length)}
              initialComments={comments}
              shareUrl={shareUrl}
              defaultCommentsOpen={commentsOpen}
              postDetailHref={postId ? `/posts/${postId}` : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTimelinePost(post: ProfileTimelinePost, comments: CommentItem[]) {
  if (!post || typeof post !== "object") {
    return null;
  }

  const href = post.href || "#";
  const ctaHref = post.ctaHref || href;
  const title = post.title || "";
  const description = post.description || "";
  const emojiCount = post.emojiCount || "10+";
  const image = post.image || "";
  const images = post.images || [];
  const resolvedComments = post.comments && post.comments.length > 0 ? post.comments : comments;
  const resolvedStats = post.stats || getFallbackStats(emojiCount, resolvedComments.length);
  const persistedPostId = post.type === "custom" ? post.id : undefined;

  switch (post.type) {
    case "article":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={href}
          stats={resolvedStats}
        >
          <SmartLink href={href} className="post-title" title="">
            {title}
          </SmartLink>
          <p>{description}</p>
        </ProfilePost>
      );
    case "premium":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={ctaHref}
          stats={resolvedStats}
        >
          <figure className="premium-post">
            <img src={image} alt={title} />
          </figure>
          <div className="premium">
            <SmartLink href={href} className="post-title" title="">
              {title}
            </SmartLink>
            <p>{description}</p>
            <SmartLink href={ctaHref} className="main-btn purchase-btn" title="">
              <i className="icofont-cart-alt"></i> {post.ctaLabel || "Buy Now"}
            </SmartLink>
          </div>
        </ProfilePost>
      );
    case "image":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={href}
          stats={resolvedStats}
        >
          <figure>
            <a data-toggle="modal" data-target="#img-comt" href={image}>
              <img src={image} alt={title} />
            </a>
          </figure>
          <SmartLink href={href} className="post-title" title="">
            {title}
          </SmartLink>
          <p>{description}</p>
        </ProfilePost>
      );
    case "album":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={href}
          stats={resolvedStats}
        >
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
                      {index === rest.length - 1 && post.morePhotosCount ? (
                        <div className="more-photos">
                          <span>+{post.morePhotosCount}</span>
                        </div>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </figure>
          <SmartLink href={href} className="post-title" title="">
            {title}
          </SmartLink>
          <p>{description}</p>
        </ProfilePost>
      );
    case "link":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={href}
          stats={resolvedStats}
        >
          <em>
            <a href={href} title="" target="_blank" rel="noreferrer">
              {href}
            </a>
          </em>
          <figure>
            <span>{post.fetchedImageLabel || "fetched-image"}</span>
            <img src={image} alt={title} />
          </figure>
          <a href={href} className="post-title" target="_blank" rel="noreferrer">
            {title}
          </a>
          <p>{description}</p>
        </ProfilePost>
      );
    case "video":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={post.embedUrl || href}
          stats={resolvedStats}
        >
          <em>
            <a href={post.embedUrl || href} title="" target="_blank" rel="noreferrer">
              {post.embedUrl || href}
            </a>
          </em>
          <iframe
            title={`${post.authorName} shared video`}
            height="285"
            src={post.embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <p>{description}</p>
        </ProfilePost>
      );
    case "audio":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={post.linkUrl || href}
          stats={resolvedStats}
        >
          {title ? (
            <SmartLink href={href} className="post-title" title="">
              {title}
            </SmartLink>
          ) : null}
          {description ? <p>{description}</p> : null}
          {post.audioSources && post.audioSources.length > 0 ? (
            <div className="aud-vid">
              <audio className="audio-player" controls>
                {post.audioSources.map((source) => (
                  <source
                    key={`${source.url}-${source.mimeType || "audio"}`}
                    src={source.url}
                    type={source.mimeType || undefined}
                  />
                ))}
              </audio>
            </div>
          ) : null}
        </ProfilePost>
      );
    case "gif":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={href}
          stats={resolvedStats}
        >
          <img className="gif" src={post.gifPreview} data-gif={post.gifDataUrl} alt={title || "Shared gif"} />
        </ProfilePost>
      );
    case "sponsor":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={href}
          stats={resolvedStats}
        >
          <ul className="sponsored-caro">
            {(post.sponsorItems || []).map((item) => (
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
        </ProfilePost>
      );
    case "custom":
      return (
        <ProfilePost
          key={post.id}
          postId={persistedPostId}
          authorName={post.authorName}
          authorImage={post.authorImage}
          activity={post.activity}
          published={post.published}
          emojiCount={emojiCount}
          commentsOpen={Boolean(post.commentsOpen)}
          comments={resolvedComments}
          shareUrl={post.linkUrl || href}
          stats={resolvedStats}
        >
          {post.linkUrl ? (
            <em>
              <a href={post.linkUrl} title="" target="_blank" rel="noreferrer">
                {post.linkUrl}
              </a>
            </em>
          ) : null}
          {post.description ? <p>{post.description}</p> : null}
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
              href={post.attachmentUrl}
              className="post-title custom-post-attachment"
              target="_blank"
              rel="noreferrer"
            >
              {post.attachmentName || "Open attachment"}
            </a>
          ) : null}
          {post.status === "scheduled" ? (
            <p className="create-post-status is-success">Scheduled for {post.published}</p>
          ) : null}
        </ProfilePost>
      );
    default:
      return null;
  }
}

function SidebarNav() {
  return (
    <nav className="sidebar">
      <ul className="menu-slide">
        {sidebarMenu.map((item) => (
          <li
            key={item.title}
            className={`${item.children ? "menu-item-has-children" : ""} ${item.active ? "active" : ""}`.trim()}
          >
            <a className="" href={item.href} title={item.title}>
              <i className={item.iconClass}></i> {item.title}
            </a>
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
  );
}

function PersonGrid({ people }: { people: PersonCard[] }) {
  return (
    <div className="row merged-10 col-xs-6">
      {people.map((person) => (
        <div className="col-lg-4 col-md-4 col-sm-6" key={`${person.name}-${person.image}`}>
          <div className="friendz">
            <figure>
              <img src={person.image} alt={person.name} />
            </figure>
            <span>
              <a href="#" title={person.name}>
                {person.name}
              </a>
            </span>
            <ins>{person.subtitle}</ins>
            <a href="#" title="" data-ripple="">
              <i className="icofont-star"></i> {person.actionLabel}
            </a>
          </div>
        </div>
      ))}
      <div className="col-lg-12">
        <div className="sp sp-bars"></div>
      </div>
    </div>
  );
}

export default function ProfilePageClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>("timeline");
  const [storedUser, setStoredUser] = useState<UserDto | null>(() => readStoredUser());
  const [uploadingKind, setUploadingKind] = useState<UploadKind | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [localCoverImageUrl, setLocalCoverImageUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const { data, error, isLoading } = useGetMyProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const [uploadProfileAsset] = useUploadProfileAssetMutation();
  const apiProfile = data?.profile ?? null;
  const apiNetwork = data?.network ?? null;
  const apiMedia = data?.media ?? null;

  useEffect(() => {
    if (!apiProfile?.user || typeof window === "undefined") {
      return;
    }

    const token = readStoredToken();
    setAuthSession(token, apiProfile.user);
  }, [apiProfile]);

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

  useEffect(() => {
    const handleStorage = () => {
      setStoredUser(readStoredUser());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_STORAGE_EVENT, handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_STORAGE_EVENT, handleStorage);
    };
  }, []);

  const user = apiProfile?.user || storedUser;

  const profileData = useMemo<ProfileDashboard>(() => buildProfileDashboard(apiProfile, user), [apiProfile, user]);

  const followersList = (Array.isArray(apiNetwork?.followers) ? apiNetwork.followers : followerCards).filter(
    (person): person is PersonCard =>
      isObjectRecord(person) &&
      typeof person.name === "string" &&
      typeof person.image === "string"
  );
  const followingList = (Array.isArray(apiNetwork?.following) ? apiNetwork.following : followingCards).filter(
    (person): person is PersonCard =>
      isObjectRecord(person) &&
      typeof person.name === "string" &&
      typeof person.image === "string"
  );
  const suggestedList = (Array.isArray(apiNetwork?.suggestions) ? apiNetwork.suggestions : suggestedResearchers).filter(
    (person): person is PersonCard =>
      isObjectRecord(person) &&
      typeof person.name === "string" &&
      typeof person.image === "string"
  );
  const whoIsFollowingList = (
    Array.isArray(apiNetwork?.whoIsFollowing) ? apiNetwork.whoIsFollowing : whoIsFollowing
  ).filter(
    (person): person is PersonCard =>
      isObjectRecord(person) &&
      typeof person.name === "string" &&
      typeof person.image === "string"
  );
  const videoList = (Array.isArray(apiMedia?.videos) ? apiMedia.videos : videoCards).filter(
    (video): video is VideoCard =>
      isObjectRecord(video) &&
      typeof video.href === "string" &&
      typeof video.image === "string" &&
      typeof video.name === "string"
  );
  const commentItems = (Array.isArray(data?.comments) ? data.comments : defaultComments).filter(
    (comment): comment is CommentItem =>
      isObjectRecord(comment) &&
      typeof comment.name === "string" &&
      typeof comment.message === "string"
  );
  const researchImageList = (
    Array.isArray(apiMedia?.researchImages) ? apiMedia.researchImages : fallbackResearchImages
  ).filter((image): image is string => typeof image === "string" && image.trim().length > 0);
  const eventList = (Array.isArray(data?.events) ? data.events : fallbackEvents).filter(
    (event): event is EventCard =>
      isObjectRecord(event) &&
      typeof event.id === "string" &&
      typeof event.title === "string"
  );
  const timelinePosts = (Array.isArray(data?.timeline) ? data.timeline : fallbackTimelinePosts).filter(
    (post): post is ProfileTimelinePost =>
      isObjectRecord(post) &&
      typeof post.id === "string" &&
      typeof post.type === "string" &&
      typeof post.authorName === "string"
  );
  const leadingTimelinePosts = timelinePosts.slice(0, 2);
  const trailingTimelinePosts = timelinePosts.slice(2);
  const displayAvatarUrl = localAvatarUrl || profileData.avatarUrl;
  const displayCoverImageUrl = localCoverImageUrl || profileData.coverImageUrl;
  const profileFirstName = profileData.fullName.trim().split(/\s+/)[0] || "Researcher";

  const openFilePicker = (kind: UploadKind) => {
    setUploadError(null);
    if (kind === "avatar") {
      avatarInputRef.current?.click();
      return;
    }

    coverInputRef.current?.click();
  };

  const handleMediaUpload = async (kind: UploadKind, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file for your profile media.");
      return;
    }

    if (file.size > MAX_PROFILE_MEDIA_BYTES) {
      setUploadError("Please choose an image smaller than 10MB.");
      return;
    }

    setUploadingKind(kind);
    setUploadError(null);

    try {
      const uploaded = await uploadProfileAsset({ file, kind }).unwrap();
      const updated = await updateMyProfile(
        kind === "avatar" ? { avatarUrl: uploaded.url } : { coverImageUrl: uploaded.url },
      ).unwrap();

      if (kind === "avatar") {
        setLocalAvatarUrl(uploaded.url);
      } else {
        setLocalCoverImageUrl(uploaded.url);
      }

      if (updated.profile?.user) {
        const token = readStoredToken();
        setAuthSession(token, updated.profile.user);
      }
    } catch (uploadMutationError) {
      setUploadError(getErrorMessage(uploadMutationError));
    } finally {
      setUploadingKind(null);
    }
  };

  if (!user && !data?.profile && isLoading) {
    return (
      <section>
        <div className="gap">
          <div className="container">
            <div className="main-wraper">
              <h3 className="main-title">Loading profile</h3>
              <p>Fetching your account details and building the TSX profile layout.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!user && !data?.profile && error) {
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

  return (
    <>
      <SidebarNav />

      <div className="gap no-gap">
        <div className="top-area mate-black low-opacity">
          <div className="bg-image" style={{ backgroundImage: `url(${displayCoverImageUrl})` }}></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="post-subject">
                  <button
                    type="button"
                    className="profile-cover-trigger"
                    onClick={() => openFilePicker("cover")}
                    disabled={uploadingKind !== null}
                    aria-label={uploadingKind === "cover" ? "Updating banner image" : "Change banner image"}
                    title={uploadingKind === "cover" ? "Updating banner..." : "Change banner"}
                  >
                    <i className={uploadingKind === "cover" ? "icofont-spinner-alt-4" : "icofont-camera"}></i>
                  </button>
                  <div className="university-tag">
                    <figure className="profile-avatar-figure">
                      <img src={displayAvatarUrl} alt={profileData.fullName} />
                      <button
                        type="button"
                        className="profile-avatar-trigger"
                        onClick={() => openFilePicker("avatar")}
                        disabled={uploadingKind !== null}
                        aria-label={uploadingKind === "avatar" ? "Updating profile photo" : "Change profile photo"}
                        title={uploadingKind === "avatar" ? "Updating profile photo..." : "Change profile photo"}
                      >
                        <i className={uploadingKind === "avatar" ? "icofont-spinner-alt-4" : "icofont-camera"}></i>
                      </button>
                    </figure>
                    <div className="uni-name">
                      <h4>{profileData.fullName}</h4>
                      <span>{profileData.handle}</span>
                      {uploadError ? <p className="profile-media-error">{uploadError}</p> : null}
                    </div>
                    <ul className="sharing-options">
                      <li>
                        <a title="Invite Colleagues" href="#" data-toggle="tooltip">
                          <i className="icofont-id-card"></i>
                        </a>
                      </li>
                      <li>
                        <a title="Follow" href="#" data-toggle="tooltip">
                          <i className="icofont-star"></i>
                        </a>
                      </li>
                      <li>
                        <a title="Share" href="#" data-toggle="tooltip">
                          <i className="icofont-share-alt"></i>
                        </a>
                      </li>
                    </ul>
                    <a data-ripple="" title="" href="#" className="invite">
                      Invite Colleagues
                    </a>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="profile-media-input"
                    onChange={(event) => handleMediaUpload("avatar", event)}
                  />
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="profile-media-input"
                    onChange={(event) => handleMediaUpload("cover", event)}
                  />

                  <ul className="nav nav-tabs post-detail-btn">
                    <li className="nav-item">
                      <a
                        className={activeTab === "timeline" ? "active" : ""}
                        href="#timeline"
                        data-toggle="tab"
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveTab("timeline");
                        }}
                      >
                        Timeline
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={activeTab === "followers" ? "active" : ""}
                        href="#followers"
                        data-toggle="tab"
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveTab("followers");
                        }}
                      >
                        Followers
                      </a>
                      <span>{followersList.length}</span>
                    </li>
                    <li className="nav-item">
                      <a
                        className={activeTab === "follow" ? "active" : ""}
                        href="#follow"
                        data-toggle="tab"
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveTab("follow");
                        }}
                      >
                        Follow
                      </a>
                      <span>{followingList.length}</span>
                    </li>
                    <li className="nav-item">
                      <a
                        className={activeTab === "about" ? "active" : ""}
                        href="#about"
                        data-toggle="tab"
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveTab("about");
                        }}
                      >
                        About
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  <div className="col-lg-8">
                    <div className="tab-content">
                      <div className={`tab-pane fade ${activeTab === "timeline" ? "active show" : ""}`} id="timeline">
                        <div className="main-wraper">
                          <span className="new-title">Create New Post</span>
                          <div className="new-post">
                            <form method="post">
                              <i className="icofont-pen-alt-1"></i>
                              <input type="text" placeholder="Create New Post" />
                            </form>
                            <ul className="upload-media">
                              <li>
                                <i>
                                  <img src="/images/image.png" alt="" />
                                </i>
                                <span>Photo/Video</span>
                              </li>
                              <li>
                                <i>
                                  <img src="/images/activity.png" alt="" />
                                </i>
                                <span>Feeling/Activity</span>
                              </li>
                              <li>
                                <i>
                                  <img src="/images/live-stream.png" alt="" />
                                </i>
                                <span>Live Stream</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {leadingTimelinePosts.map((post) => renderTimelinePost(post, commentItems))}

                        <div className="main-wraper">
                          <div className="wraper-title">
                            <span>
                              <i className="icofont-video-alt"></i> Videos Play List
                            </span>
                            <SmartLink href="/videos" title="">
                              See all Videos
                            </SmartLink>
                          </div>
                          <div className="videos-caro">
                            {videoList.map((video) => (
                              <div className="item-video" data-merge="2" key={video.href}>
                                <a className="owl-video" href={video.href}></a>
                                <div className="posted-user">
                                  <img src={video.image} alt={video.name} />
                                  <span>{video.name}</span>
                                </div>
                                <div className="vid-info">
                                  <span>{video.meta}</span>
                                  <span>
                                    <i className="icofont-eye-open"></i> {video.views}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {trailingTimelinePosts.map((post) => renderTimelinePost(post, commentItems))}

                        <div className="main-wraper">
                          <div className="user-post">
                            <div className="friend-info">
                              <figure>
                                <i className="icofont-learn"></i>
                              </figure>
                              <div className="friend-name">
                                <ins>
                                  <a title="" href="#">
                                    Suggested
                                  </a>
                                </ins>
                                <span>
                                  <i className="icofont-runner-alt-1"></i> Follow similar research people
                                </span>
                              </div>
                              <ul className="suggested-caro">
                                {suggestedList.map((person) => (
                                  <li key={`${person.name}-${person.image}`}>
                                    <figure>
                                      <img src={person.image} alt={person.name} />
                                    </figure>
                                    <span>{person.name}</span>
                                    <ins>{person.subtitle}</ins>
                                    <a href="#" title="" data-ripple="">
                                      <i className="icofont-star"></i> {person.actionLabel}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`tab-pane fade ${activeTab === "followers" ? "active show" : ""}`} id="followers">
                        <PersonGrid people={followersList} />
                      </div>

                      <div className={`tab-pane fade ${activeTab === "follow" ? "active show" : ""}`} id="follow">
                        <PersonGrid people={followingList} />
                      </div>

                      <div className={`tab-pane fade ${activeTab === "about" ? "active show" : ""}`} id="about">
                        <div className="main-wraper">
                          <h3 className="main-title">About {profileFirstName}</h3>
                          <div className="lang">
                            <h6>Profile Snapshot</h6>
                            <span>
                              {profileData.researcherType}, {profileData.gender}
                            </span>
                          </div>
                          <p>{profileData.bio}</p>

                          <div className="dis-n-exp">
                            <h6>Disciplines</h6>
                            {profileData.disciplines.map((discipline) => (
                              <span key={discipline}>{discipline}</span>
                            ))}
                          </div>
                          <div className="dis-n-exp">
                            <h6>Skills &amp; Expertise</h6>
                            {profileData.skills.map((skill) => (
                              <span key={skill}>{skill}</span>
                            ))}
                          </div>
                        </div>

                        <div className="main-wraper">
                          <h3 className="main-title">Professional Experience</h3>
                          <div className="exp-col">
                            <div className="exp-meta">
                              <h5>
                                <i className="icofont-university"></i> {profileData.institute}
                              </h5>
                              <p>Joined {profileData.joined}</p>
                              <span>Position</span>
                              <ins>{profileData.position}</ins>
                            </div>
                            <img src="/images/resources/uni1.jpg" alt="" />
                          </div>
                          <div className="exp-col">
                            <div className="exp-meta">
                              <h5>
                                <i className="icofont-university"></i> {profileData.department}
                              </h5>
                              <p>Current department focus</p>
                              <span>Research area</span>
                              <ins>{profileData.researcherType}</ins>
                            </div>
                            <img src="/images/resources/uni3.jpg" alt="" />
                          </div>
                          <div className="exp-col">
                            <div className="exp-meta">
                              <h5>
                                <i className="icofont-university"></i> Account profile
                              </h5>
                              <p>{profileData.location}</p>
                              <span>Completion</span>
                              <ins>{profileData.completion}% complete</ins>
                            </div>
                            <img src="/images/resources/uni4.jpg" alt="" />
                          </div>
                        </div>

                        <div className="main-wraper">
                          <h3 className="main-title">Research Images &amp; PDF</h3>
                          <div className="row merged-10">
                            {researchImageList.map((image) => (
                              <div className="col-lg-4" key={image}>
                                <figure className="research-avatar">
                                  <a className="uk-inline" href={image} data-fancybox="">
                                    <img src={image} alt="" />
                                  </a>
                                </figure>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <aside className="sidebar static right">
                      <div className="widget">
                        <h4 className="widget-title">Post Analytics</h4>
                        <ul className="widget-analytics">
                          <li>
                            Profile completion <span>{profileData.analytics.profileCompletion}%</span>
                          </li>
                          <li>
                            Researcher type <span>{profileData.analytics.researcherType}</span>
                          </li>
                          <li>
                            Institute <span>{profileData.analytics.institute}</span>
                          </li>
                          <li>
                            Joined <span>{profileData.analytics.joined}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="widget">
                        <h4 className="widget-title">Ask Research Question?</h4>
                        <div className="ask-question">
                          <i className="icofont-question-circle"></i>
                          <h6>
                            {profileData.fullName} can start a new research discussion or ask for help from experts in
                            the field.
                          </h6>
                          <a className="ask-qst" href="#" title="">
                            Ask a question
                          </a>
                        </div>
                      </div>
                      <div className="widget">
                        <h4 className="widget-title">
                          Explore Events{" "}
                          <a className="see-all" href="#" title="">
                            See All
                          </a>
                        </h4>
                        {eventList.map((event) => (
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
                        <h4 className="widget-title">Who&apos;s following</h4>
                        <ul className="followers">
                          {whoIsFollowingList.map((person) => (
                            <li key={`${person.name}-${person.image}`}>
                              <figure>
                                <img alt={person.name} src={person.image} />
                              </figure>
                              <div className="friend-meta">
                                <h4>
                                  <a title="" href="time-line.html">
                                    {person.name}
                                  </a>
                                  <span>{person.subtitle}</span>
                                </h4>
                                <a className="underline" title="" href="#">
                                  {person.actionLabel}
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </aside>
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
    </>
  );
}
