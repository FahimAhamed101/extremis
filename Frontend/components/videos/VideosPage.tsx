"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Script from "next/script";
import type { AnchorHTMLAttributes, ReactNode, FormEvent, ChangeEvent } from "react";
import { useState, useMemo, useRef } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";
import PostInteractions from "@/components/posts/PostInteractions";
import PostMoreActions from "@/components/posts/PostMoreActions";
import {
  type FeedPost,
  useGetFeedPostsQuery,
  useCreatePostMutation,
  useGetDiscoverPeopleQuery,
  useGetCurrentUserQuery,
  useUploadProfileAssetMutation,
} from "@/lib/services/authApi";

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
    href: "/",
    iconClass: "icofont-home",
    active: true,
    children: [
      { label: "Newsfeed", href: "/" },
      { label: "User Profile", href: "/profile" },
      { label: "Chat/Messages", href: "/messages" },
      { label: "Groups", href: "/groups" },
    ],
  },
  {
    title: "Features",
    href: "/videos",
    iconClass: "icofont-flash",
    children: [
      { label: "Videos", href: "/videos" },
      { label: "Live Stream", href: "/videos" },
      { label: "Market Products", href: "/products" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Communities",
    href: "/groups",
    iconClass: "icofont-users",
    children: [
      { label: "All Groups", href: "/groups" },
      { label: "Research Friends", href: "/profile" },
    ],
  },
  {
    title: "Blogs & Articles",
    href: "/blog",
    iconClass: "icofont-coffee-cup",
  },
  {
    title: "Live Chat",
    href: "/messages",
    iconClass: "icofont-ui-messaging",
  },
];

const DEFAULT_VIDEO_POSTS: FeedPost[] = [
  {
    id: "curated-vid-1",
    type: "video",
    authorId: "author-1",
    authorName: "Jack Carter",
    authorHandle: "@jackcarter",
    authorImage: "/images/resources/user1.jpg",
    activity: "shared a video lecture",
    published: "2 hours ago",
    title: "Supervision & Leadership as a Development Device",
    content: "An insightful walkthrough on academic supervision, mentoring research students, and personnel development structures in higher education.",
    description: "An insightful walkthrough on academic supervision, mentoring research students, and personnel development structures in higher education.",
    href: "https://www.youtube.com/watch?v=JpxsRwnRwCQ",
    linkUrl: "https://www.youtube.com/watch?v=JpxsRwnRwCQ",
    embedUrl: "https://www.youtube.com/embed/JpxsRwnRwCQ",
    videoUrl: "https://www.youtube.com/watch?v=JpxsRwnRwCQ",
    attachmentUrl: null,
    attachmentType: null,
    attachmentName: null,
    image: "/images/resources/user-video1.jpg",
    audience: "public",
    activityFeed: true,
    myStory: false,
    scheduledFor: null,
    createdAt: new Date().toISOString(),
    status: "published",
    comments: [
      {
        id: "c1",
        userId: "u1",
        name: "Dr. Sarah Lin",
        image: "/images/resources/user2.jpg",
        time: "1 hour ago",
        message: "Remarkable breakdown! The points on collaborative frameworks are particularly useful.",
      },
    ],
    stats: {
      viewCount: 14200,
      likeCount: 620,
      commentCount: 42,
      shareCount: 108,
      likedByViewer: false,
    },
  },
  {
    id: "curated-vid-2",
    type: "video",
    authorId: "author-2",
    authorName: "Maria K.",
    authorHandle: "@mariak",
    authorImage: "/images/resources/user2.jpg",
    activity: "published research talk",
    published: "1 day ago",
    title: "Machine Learning & Neural Architectures in Modern Healthcare",
    content: "Discover how transformer models and computer vision pipelines are revolutionizing clinical diagnostics and drug discovery.",
    description: "Discover how transformer models and computer vision pipelines are revolutionizing clinical diagnostics and drug discovery.",
    href: "https://www.youtube.com/watch?v=8itUNRIWVIs",
    linkUrl: "https://www.youtube.com/watch?v=8itUNRIWVIs",
    embedUrl: "https://www.youtube.com/embed/8itUNRIWVIs",
    videoUrl: "https://www.youtube.com/watch?v=8itUNRIWVIs",
    attachmentUrl: null,
    attachmentType: null,
    attachmentName: null,
    image: "/images/resources/user-video2.jpg",
    audience: "public",
    activityFeed: true,
    myStory: false,
    scheduledFor: null,
    createdAt: new Date().toISOString(),
    status: "published",
    comments: [
      {
        id: "c2",
        userId: "u2",
        name: "Prof. Marcus Vance",
        image: "/images/resources/user3.jpg",
        time: "3 hours ago",
        message: "Fascinating results on multimodal evaluation benchmarks.",
      },
    ],
    stats: {
      viewCount: 8900,
      likeCount: 430,
      commentCount: 29,
      shareCount: 64,
      likedByViewer: false,
    },
  },
  {
    id: "curated-vid-3",
    type: "video",
    authorId: "author-3",
    authorName: "Frank J.",
    authorHandle: "@frankj",
    authorImage: "/images/resources/user3.jpg",
    activity: "uploaded workshop video",
    published: "3 days ago",
    title: "Quantitative Research Methods & Experimental Analysis",
    content: "Mastering hypothesis testing, variance estimation, and peer-reviewed data visualization techniques.",
    description: "Mastering hypothesis testing, variance estimation, and peer-reviewed data visualization techniques.",
    href: "https://www.youtube.com/watch?v=8iZTb9NWbz8",
    linkUrl: "https://www.youtube.com/watch?v=8iZTb9NWbz8",
    embedUrl: "https://www.youtube.com/embed/8iZTb9NWbz8",
    videoUrl: "https://www.youtube.com/watch?v=8iZTb9NWbz8",
    attachmentUrl: null,
    attachmentType: null,
    attachmentName: null,
    image: "/images/resources/user-video3.jpg",
    audience: "public",
    activityFeed: true,
    myStory: false,
    scheduledFor: null,
    createdAt: new Date().toISOString(),
    status: "published",
    comments: [],
    stats: {
      viewCount: 5100,
      likeCount: 290,
      commentCount: 16,
      shareCount: 38,
      likedByViewer: false,
    },
  },
  {
    id: "curated-vid-4",
    type: "video",
    authorId: "author-4",
    authorName: "Elena Rostova",
    authorHandle: "@elena",
    authorImage: "/images/resources/user4.jpg",
    activity: "shared demonstration",
    published: "4 days ago",
    title: "Nature's Beauty & Open Media Research Project",
    content: "Exploring open-source digital rendering and high-resolution animation pipelines with community researchers.",
    description: "Exploring open-source digital rendering and high-resolution animation pipelines with community researchers.",
    href: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    linkUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    embedUrl: null,
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    attachmentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    attachmentType: "video",
    attachmentName: "ElephantsDream.mp4",
    image: "/images/resources/user-video4.jpg",
    audience: "public",
    activityFeed: true,
    myStory: false,
    scheduledFor: null,
    createdAt: new Date().toISOString(),
    status: "published",
    comments: [],
    stats: {
      viewCount: 3200,
      likeCount: 180,
      commentCount: 11,
      shareCount: 22,
      likedByViewer: false,
    },
  },
  {
    id: "curated-reel-1",
    type: "video",
    authorId: "author-5",
    authorName: "Sophia Martinez",
    authorHandle: "@smartinez",
    authorImage: "/images/resources/user5.jpg",
    activity: "posted a new Reel 🔥",
    published: "25 mins ago",
    title: "High-Speed Optical Tracker Calibration #Shorts",
    content: "A 35-second behind-the-scenes look at optical sensor array synchronization under high acceleration! #reels #robotics #tech",
    description: "A 35-second behind-the-scenes look at optical sensor array synchronization under high acceleration! #reels #robotics #tech",
    href: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    linkUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    embedUrl: null,
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    attachmentUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    attachmentType: "video",
    attachmentName: "ForBiggerBlazes.mp4",
    image: "/images/resources/user-video1.jpg",
    audience: "public",
    activityFeed: true,
    myStory: false,
    scheduledFor: null,
    createdAt: new Date().toISOString(),
    status: "published",
    comments: [
      {
        id: "c-reel-1",
        userId: "u4",
        name: "Elena Rostova",
        image: "/images/resources/user4.jpg",
        time: "15 mins ago",
        message: "The framerate tracking on the optical sensor is super clean!",
      },
    ],
    stats: {
      viewCount: 19400,
      likeCount: 890,
      commentCount: 47,
      shareCount: 165,
      likedByViewer: false,
    },
  },
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

function extractEmbedUrl(urlOrPost: string | FeedPost): string | null {
  const url =
    typeof urlOrPost === "string"
      ? urlOrPost
      : urlOrPost.embedUrl || urlOrPost.linkUrl || urlOrPost.href || "";
  if (!url) return null;

  // YouTube match: https://www.youtube.com/watch?v=ID or https://youtu.be/ID or /embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo match
  const vimeoMatch = url.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i
  );
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }

  if (url.includes("/embed/")) {
    return url;
  }

  return null;
}

function isVideoPost(post: FeedPost): boolean {
  if (post.type === "video" || post.attachmentType === "video") return true;
  if (post.videoUrl || post.embedUrl) return true;
  const link = String(post.linkUrl || post.href || "").toLowerCase();
  if (link.includes("youtube.com") || link.includes("youtu.be") || link.includes("vimeo.com")) return true;
  const attachment = String(post.attachmentUrl || "").toLowerCase();
  if (attachment.match(/\.(mp4|webm|ogg|mov)$/i) || attachment.includes("/video/upload/")) return true;
  return false;
}

function isReelPost(post: FeedPost): boolean {
  const title = String(post.title || "").toLowerCase();
  const content = String(post.content || "").toLowerCase();
  const activity = String(post.activity || "").toLowerCase();
  const attachment = String(post.attachmentUrl || "").toLowerCase();
  const link = String(post.linkUrl || post.href || "").toLowerCase();

  return (
    title.includes("#reel") ||
    title.includes("reel") ||
    title.includes("#short") ||
    title.includes("short") ||
    content.includes("#reel") ||
    content.includes("reel") ||
    content.includes("#short") ||
    activity.includes("reel") ||
    link.includes("/shorts/") ||
    link.includes("/reel/") ||
    Boolean(attachment && attachment.match(/\.(mp4|webm|ogg|mov)$/i))
  );
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

function VideoCard({ post }: { post: FeedPost }) {
  const authorHref = post.authorId ? `/profile/${post.authorId}` : "/profile";
  const postHref = `/posts/${post.id}`;
  const title = getVideoTitle(post);
  const description = getVideoDescription(post);
  const videoUrl = post.linkUrl || post.embedUrl || post.href || "";
  const embedUrl = extractEmbedUrl(post);
  const isDirectVideo = Boolean(
    post.attachmentType === "video" ||
      (post.attachmentUrl && post.attachmentUrl.match(/\.(mp4|webm|ogg|mov)$/i)) ||
      (post.attachmentUrl && post.attachmentUrl.includes("/video/upload/"))
  );
  const directVideoSrc = post.attachmentUrl || (post.videoUrl && !embedUrl ? post.videoUrl : null);
  const isReel = isReelPost(post);

  return (
    <div className="main-wraper" style={{ borderRadius: "12px", marginBottom: "24px" }}>
      <div className="user-post video">
        <div className="friend-info">
          <figure>
            <img
              alt={post.authorName}
              src={post.authorImage || "/images/resources/user.jpg"}
              style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
              }}
            />
          </figure>
          <div className="friend-name">
            <PostMoreActions post={post} iconType="svg" />
            <ins>
              <Link title={post.authorName} href={authorHref}>
                {post.authorName}
              </Link>{" "}
              {post.activity}{" "}
              {isReel ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "12px",
                    marginLeft: "6px",
                  }}
                >
                  <i className="icofont-fire-burn"></i> REEL
                </span>
              ) : null}
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
          <div className="post-meta" style={{ marginTop: "12px" }}>
            {title ? (
              <h4 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px", color: "#1e293b" }}>
                {title}
              </h4>
            ) : null}
            {description ? (
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155", marginBottom: "14px" }}>
                {description}
              </p>
            ) : null}

            {/* Video Player Display */}
            {embedUrl ? (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "10px", marginBottom: "16px" }}>
                <iframe
                  title={`${post.authorName} shared video`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  src={embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : isDirectVideo && directVideoSrc ? (
              <div style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "16px", backgroundColor: "#000" }}>
                <video
                  controls
                  style={{ width: "100%", maxHeight: "450px", display: "block" }}
                  src={directVideoSrc}
                  poster={post.image || undefined}
                />
              </div>
            ) : post.image ? (
              <figure style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "16px", position: "relative" }}>
                <img src={post.image} alt={title || "Video thumbnail"} style={{ width: "100%", maxHeight: "380px", objectFit: "cover" }} />
                {videoUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <span
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "#088dcd",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                      }}
                    >
                      <i className="icofont-play"></i>
                    </span>
                  </a>
                )}
              </figure>
            ) : null}

            {/* Post Interactions (Likes, Comments, Reactions, Shares) */}
            <PostInteractions
              postId={post.id}
              initialStats={post.stats}
              initialComments={post.comments}
              initialReactions={post.reactions}
              shareUrl={post.linkUrl || post.href || undefined}
              postDetailHref={postHref}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateReelBox({
  currentUser,
  onPostCreated,
}: {
  currentUser?: { avatarUrl?: string | null; firstName?: string; lastName?: string };
  onPostCreated: () => void;
}) {
  const [createPostMutation, { isLoading: isPublishing }] = useCreatePostMutation();
  const [uploadAsset, { isLoading: isUploading }] = useUploadProfileAssetMutation();

  const [mode, setMode] = useState<"file" | "link">("file");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoLinkUrl, setVideoLinkUrl] = useState("");
  const [category, setCategory] = useState<"reel" | "lecture" | "demo">("reel");
  const [audience, setAudience] = useState<"public" | "only-friends" | "joined-groups">("public");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const authorName = currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() : "You";
  const avatarUrl = currentUser?.avatarUrl || "/images/resources/user.jpg";

  const handleFileSelect = (file: File) => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName);
    }
  };

  const handleClear = () => {
    setTitle("");
    setCaption("");
    setVideoFile(null);
    const oldUrl = videoPreviewUrl;
    setVideoPreviewUrl(null);
    if (oldUrl && oldUrl.startsWith("blob:")) {
      window.setTimeout(() => {
        try {
          URL.revokeObjectURL(oldUrl);
        } catch {
          // ignore
        }
      }, 500);
    }
    setVideoLinkUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatus({ type: "error", message: "Please enter a title or caption for your reel." });
      return;
    }

    if (mode === "file" && !videoFile) {
      setStatus({ type: "error", message: "Please select an MP4, WebM, or MOV video file to upload." });
      return;
    }

    if (mode === "link" && !videoLinkUrl.trim()) {
      setStatus({ type: "error", message: "Please enter a valid video or reel URL." });
      return;
    }

    setStatus(null);

    try {
      let attachmentUrl: string | null = null;
      let attachmentType: "video" | null = null;
      let linkUrl: string | null = null;

      if (mode === "file" && videoFile) {
        try {
          const uploadRes = await uploadAsset({ file: videoFile, kind: "video" }).unwrap();
          if (!uploadRes?.url) {
            throw new Error("Missing upload result URL.");
          }
          attachmentUrl = uploadRes.url;
          attachmentType = "video";
        } catch (uploadErr: unknown) {
          const errMsg =
            uploadErr && typeof uploadErr === "object" && "data" in uploadErr && (uploadErr as { data?: { message?: string } }).data?.message
              ? (uploadErr as { data?: { message?: string } }).data?.message
              : "Failed to upload video file. Please ensure it is an MP4 or WebM video up to 50MB and try again.";
          setStatus({
            type: "error",
            message: String(errMsg),
          });
          return;
        }
      } else if (mode === "link" && videoLinkUrl.trim()) {
        linkUrl = videoLinkUrl.trim();
        attachmentType = "video";
      }

      const activityLabel =
        category === "reel"
          ? "posted a new Reel 🔥"
          : category === "lecture"
          ? "published a research lecture"
          : "shared a video demonstration";

      await createPostMutation({
        title: title.trim(),
        content: caption.trim() || title.trim(),
        type: "video",
        postType: "video",
        attachmentType,
        attachmentUrl,
        attachmentName: videoFile ? videoFile.name : null,
        linkUrl,
        videoUrl: attachmentUrl || linkUrl,
        activity: activityLabel,
        activityLabel,
        audience,
      }).unwrap();

      setStatus({
        type: "success",
        message: "🎉 Your Reel has been published to the community feed!",
      });

      handleClear();
      onPostCreated();

      setTimeout(() => {
        setStatus(null);
      }, 4000);
    } catch {
      setStatus({
        type: "error",
        message: "Failed to publish reel. Please check your connection and try again.",
      });
    }
  };

  const previewEmbed = mode === "link" && videoLinkUrl.trim() ? extractEmbedUrl(videoLinkUrl.trim()) : null;

  return (
    <div
      className="main-wraper"
      style={{
        borderRadius: "14px",
        marginBottom: "24px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        padding: "20px 24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid #f1f5f9",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <img
              src={avatarUrl}
              alt={authorName}
              style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "2px solid #088dcd" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "1px",
                right: "1px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                border: "2px solid #fff",
              }}
            ></span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a" }}>Post Reel or Video</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                <i className="icofont-fire-burn"></i> REEL STUDIO
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              Share short video reels, research talks, or project demos
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: "inline-flex", background: "#f1f5f9", padding: "3px", borderRadius: "8px", gap: "4px" }}>
          <button
            type="button"
            onClick={() => setMode("file")}
            style={{
              border: "none",
              background: mode === "file" ? "#ffffff" : "transparent",
              color: mode === "file" ? "#088dcd" : "#64748b",
              fontWeight: 600,
              fontSize: "12px",
              padding: "5px 12px",
              borderRadius: "6px",
              boxShadow: mode === "file" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <i className="icofont-upload-alt"></i> Upload Video File
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            style={{
              border: "none",
              background: mode === "link" ? "#ffffff" : "transparent",
              color: mode === "link" ? "#088dcd" : "#64748b",
              fontWeight: 600,
              fontSize: "12px",
              padding: "5px 12px",
              borderRadius: "6px",
              boxShadow: mode === "link" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <i className="icofont-link"></i> Video Link
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Status Message */}
        {status && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "14px",
              fontSize: "13px",
              fontWeight: "500",
              background: status.type === "success" ? "#ecfdf5" : "#fef2f2",
              color: status.type === "success" ? "#065f46" : "#991b1b",
              border: status.type === "success" ? "1px solid #a7f3d0" : "1px solid #fecaca",
            }}
          >
            {status.message}
          </div>
        )}

        {/* Video File Upload Area */}
        {mode === "file" && (
          <div style={{ marginBottom: "14px" }}>
            {!videoFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("video/")) {
                    handleFileSelect(file);
                  }
                }}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "10px",
                  padding: "24px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#f8fafc",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#088dcd";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f9ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#cbd5e1";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc";
                }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e0f2fe", color: "#0284c7", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "8px" }}>
                  <i className="icofont-video-cam"></i>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                  Choose video file or drag and drop here
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  Supports MP4, WebM, MOV (Shorts, Reels, Lectures)
                </div>
                <button
                  type="button"
                  style={{
                    marginTop: "10px",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#334155",
                    cursor: "pointer",
                  }}
                >
                  Browse Video
                </button>
              </div>
            ) : (
              <div key="video-preview-panel" style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="icofont-film" style={{ fontSize: "20px", color: "#088dcd" }}></i>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{videoFile.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        <span>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to publish</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      border: "none",
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontSize: "12px",
                      fontWeight: "600",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <span>Remove</span>
                  </button>
                </div>
                {videoPreviewUrl ? (
                  <div key={videoPreviewUrl} style={{ borderRadius: "8px", overflow: "hidden", background: "#000", maxHeight: "280px" }}>
                    <video controls src={videoPreviewUrl} style={{ width: "100%", maxHeight: "280px", display: "block" }} />
                  </div>
                ) : null}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />
          </div>
        )}

        {/* Video Link Area */}
        {mode === "link" && (
          <div style={{ marginBottom: "14px" }}>
            <input
              type="text"
              placeholder="Paste YouTube, Vimeo, Instagram Reel, or direct MP4 link..."
              value={videoLinkUrl}
              onChange={(e) => setVideoLinkUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                outline: "none",
              }}
            />
            {previewEmbed && (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px", marginTop: "10px" }}>
                <iframe
                  title="Link preview"
                  src={previewEmbed}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            )}
          </div>
        )}

        {/* Reel Title Input */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Reel / Video Title (e.g., High-Speed Sensor Array Demo #Shorts)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              fontWeight: "600",
              outline: "none",
            }}
          />
        </div>

        {/* Reel Caption Input */}
        <div style={{ marginBottom: "12px" }}>
          <textarea
            placeholder="Add description, notes, takeaways, and tags (#reels #research)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              lineHeight: "1.5",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>

        {/* Format Selector & Actions Bar */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Format:</span>
            <button
              type="button"
              onClick={() => setCategory("reel")}
              style={{
                border: "none",
                background: category === "reel" ? "#fee2e2" : "#f1f5f9",
                color: category === "reel" ? "#e11d48" : "#475569",
                fontWeight: "600",
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "16px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <i className="icofont-fire-burn"></i> Reel / Short
            </button>
            <button
              type="button"
              onClick={() => setCategory("lecture")}
              style={{
                border: "none",
                background: category === "lecture" ? "#e0f2fe" : "#f1f5f9",
                color: category === "lecture" ? "#0284c7" : "#475569",
                fontWeight: "600",
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "16px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <i className="icofont-graduate-alt"></i> Lecture
            </button>
            <button
              type="button"
              onClick={() => setCategory("demo")}
              style={{
                border: "none",
                background: category === "demo" ? "#fef3c7" : "#f1f5f9",
                color: category === "demo" ? "#d97706" : "#475569",
                fontWeight: "600",
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "16px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <i className="icofont-flask"></i> Demo
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "12px",
                color: "#334155",
                background: "#ffffff",
                outline: "none",
              }}
            >
              <option value="public">🌍 Public</option>
              <option value="only-friends">👥 Friends Only</option>
              <option value="joined-groups">🏛️ Joined Groups</option>
            </select>

            <button
              type="submit"
              disabled={isPublishing || isUploading}
              style={{
                border: "none",
                background: "linear-gradient(135deg, #088dcd, #0284c7)",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "13px",
                padding: "8px 20px",
                borderRadius: "20px",
                cursor: isPublishing || isUploading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(8, 141, 205, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                opacity: isPublishing || isUploading ? 0.7 : 1,
              }}
            >
              {isUploading ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <i className="icofont-spinner icofont-spin"></i>
                  <span>Uploading Video...</span>
                </span>
              ) : isPublishing ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <i className="icofont-spinner icofont-spin"></i>
                  <span>Publishing...</span>
                </span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <i className="icofont-paper-plane"></i>
                  <span>Publish Reel</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function VideosPage() {
  const { data, isLoading, error, refetch } = useGetFeedPostsQuery();
  const { data: discoverData } = useGetDiscoverPeopleQuery({ limit: 6 });
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData?.user;
  const [createPostMutation, { isLoading: isPublishing }] = useCreatePostMutation();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "reels" | "latest" | "trending" | "live" | "saved">("all");
  const [savedVideoIds] = useState<string[]>(["curated-vid-1", "curated-vid-2"]);

  // Share Video Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoNotes, setNewVideoNotes] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  const allVideoPosts = useMemo(() => {
    const rawPosts = data?.posts || [];
    const serverVideos = rawPosts.filter(isVideoPost);

    // Merge server videos and curated defaults (avoiding duplicate IDs)
    const existingIds = new Set(serverVideos.map((p) => p.id));
    const combined = [...serverVideos];

    DEFAULT_VIDEO_POSTS.forEach((dp) => {
      if (!existingIds.has(dp.id)) {
        combined.push(dp);
      }
    });

    return combined;
  }, [data?.posts]);

  // Filtered and sorted videos
  const displayedVideos = useMemo(() => {
    let list = [...allVideoPosts];

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          (v.title && v.title.toLowerCase().includes(q)) ||
          (v.content && v.content.toLowerCase().includes(q)) ||
          (v.authorName && v.authorName.toLowerCase().includes(q))
      );
    }

    // Tab filter
    if (activeFilter === "reels") {
      list = list.filter(isReelPost);
      if (list.length === 0) {
        list = allVideoPosts.filter(isReelPost);
      }
    } else if (activeFilter === "trending") {
      list.sort((a, b) => (b.stats?.viewCount || 0) - (a.stats?.viewCount || 0));
    } else if (activeFilter === "saved") {
      list = list.filter((v) => savedVideoIds.includes(v.id));
      if (list.length === 0) {
        list = allVideoPosts.slice(0, 2);
      }
    }

    return list;
  }, [allVideoPosts, searchQuery, activeFilter, savedVideoIds]);

  const playlistVideos = useMemo(() => buildPlaylistVideos(displayedVideos), [displayedVideos]);
  const firstVideoPosts = displayedVideos.slice(0, 2);
  const remainingVideoPosts = displayedVideos.slice(2);

  const watchList = useMemo(() => {
    const users = discoverData?.users;
    if (users && users.length > 0) {
      return users.map((u, i) => ({
        name: u.name,
        image: u.image || `/images/resources/user${(i % 6) + 1}.jpg`,
        unread: i % 2 === 0,
      }));
    }
    return [
      { name: "Rosie Garebal", image: "/images/resources/user2.jpg", unread: true },
      { name: "Danial Cabral", image: "/images/resources/user3.jpg", unread: false },
      { name: "William John", image: "/images/resources/user4.jpg", unread: true },
      { name: "Andrew Jane", image: "/images/resources/user5.jpg", unread: false },
      { name: "Bill Gates", image: "/images/resources/user1.jpg", unread: true },
      { name: "Rita Arvind", image: "/images/resources/user6.jpg", unread: false },
    ];
  }, [discoverData]);

  const handleShareVideoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;

    try {
      await createPostMutation({
        title: newVideoTitle.trim(),
        content: newVideoNotes.trim() || newVideoTitle.trim(),
        linkUrl: newVideoUrl.trim(),
        type: "video",
        attachmentType: "video",
      }).unwrap();

      setShareStatus("Video published successfully!");
      refetch();

      setTimeout(() => {
        setShareStatus("");
        setNewVideoTitle("");
        setNewVideoUrl("");
        setNewVideoNotes("");
        setIsShareModalOpen(false);
      }, 1200);
    } catch {
      setShareStatus("Failed to publish video. Please try again.");
    }
  };

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
                      {/* Left Sidebar */}
                      <div className="col-lg-3">
                        <aside className="sidebar static left">
                          <div className="widget stick-widget">
                            <h4 className="widget-title">Watch</h4>
                            <form
                              className="video-search"
                              onSubmit={(e) => e.preventDefault()}
                              style={{ marginBottom: "16px" }}
                            >
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
                              <input
                                type="text"
                                placeholder="Search Video"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
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
                                <a
                                  href="#"
                                  title="Reels & Shorts"
                                  className={activeFilter === "reels" ? "active" : ""}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveFilter("reels");
                                  }}
                                  style={activeFilter === "reels" ? { color: "#e11d48", fontWeight: 700 } : {}}
                                >
                                  <i style={{ color: "#e11d48" }}>
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
                                      className="feather feather-film"
                                    >
                                      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                      <line x1="7" y1="2" x2="7" y2="22"></line>
                                      <line x1="17" y1="2" x2="17" y2="22"></line>
                                      <line x1="2" y1="12" x2="22" y2="12"></line>
                                      <line x1="2" y1="7" x2="7" y2="7"></line>
                                      <line x1="2" y1="17" x2="7" y2="17"></line>
                                      <line x1="17" y1="17" x2="22" y2="17"></line>
                                      <line x1="17" y1="7" x2="22" y2="7"></line>
                                    </svg>
                                  </i>{" "}
                                  Reels & Shorts
                                  <span style={{ marginLeft: "auto", background: "linear-gradient(135deg, #f43f5e, #e11d48)", color: "#fff", fontSize: "10px", padding: "1px 6px", borderRadius: "10px", fontWeight: 700 }}>HOT</span>
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  title="Latest"
                                  className={activeFilter === "latest" ? "active" : ""}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveFilter("latest");
                                  }}
                                >
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
                                <a
                                  href="#"
                                  title="Trending"
                                  className={activeFilter === "trending" ? "active" : ""}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveFilter("trending");
                                  }}
                                >
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
                                <a
                                  href="#"
                                  title="Live"
                                  className={activeFilter === "live" ? "active" : ""}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveFilter("live");
                                  }}
                                >
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
                                <a
                                  href="#"
                                  title="Saved Videos"
                                  className={activeFilter === "saved" ? "active" : ""}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveFilter("saved");
                                  }}
                                >
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

                            <h4 className="main-title" style={{ marginTop: "24px" }}>
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
                                    <img
                                      src={person.image}
                                      alt={person.name}
                                      style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                  </figure>
                                  <a href="#" title={person.name} onClick={(e) => e.preventDefault()}>
                                    {person.name}
                                  </a>
                                  <span className="new-highlight"></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </aside>
                      </div>

                      {/* Main Feed Column */}
                      <div className="col-lg-9">
                        {/* Interactive Reel & Video Creator Studio */}
                        <CreateReelBox
                          currentUser={currentUser}
                          onPostCreated={() => {
                            refetch();
                          }}
                        />

                        <div className="main-wraper">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                            <div className="main-title" style={{ margin: 0 }}>
                              {activeFilter === "reels"
                                ? "🔥 Reels & Shorts"
                                : activeFilter === "trending"
                                ? "Trending Videos"
                                : activeFilter === "saved"
                                ? "Saved Videos"
                                : activeFilter === "live"
                                ? "Live Streams"
                                : "Latest Videos"}
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  window.scrollTo({ top: 180, behavior: "smooth" });
                                }}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "8px 16px",
                                  borderRadius: "20px",
                                  background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                                  color: "#fff",
                                  border: "none",
                                  fontWeight: "600",
                                  fontSize: "13px",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px rgba(244, 63, 94, 0.25)",
                                }}
                              >
                                <i className="icofont-fire-burn"></i> Post Reel
                              </button>
                              <button
                                type="button"
                                className="main-btn"
                                onClick={() => setIsShareModalOpen(true)}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "8px 16px",
                                  borderRadius: "20px",
                                  background: "#088dcd",
                                  color: "#fff",
                                  border: "none",
                                  fontWeight: "600",
                                  fontSize: "13px",
                                  cursor: "pointer",
                                }}
                              >
                                <i className="icofont-plus"></i> Share Video
                              </button>
                            </div>
                          </div>

                          {/* Render First 2 Video Posts */}
                          {firstVideoPosts.map((post) => (
                            <VideoCard key={post.id} post={post} />
                          ))}

                          {/* Videos Playlist Carousel */}
                          {playlistVideos.length ? (
                            <div className="main-wraper" style={{ borderRadius: "12px", margin: "24px 0" }}>
                              <div className="wraper-title">
                                <span>
                                  <i className="icofont-video-alt"></i> Featured Video Playlists
                                </span>
                                <a href="#" title="See all Videos" onClick={(e) => { e.preventDefault(); setActiveFilter("all"); }}>
                                  See all Videos
                                </a>
                              </div>
                              <div className="videos-caro" style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
                                {playlistVideos.map((video) => (
                                  <div
                                    key={`${video.href}-${video.name}`}
                                    style={{
                                      minWidth: "220px",
                                      background: "#f8fafc",
                                      borderRadius: "8px",
                                      padding: "10px",
                                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    }}
                                  >
                                    <div className="posted-user" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                      <img
                                        src={video.image}
                                        alt={video.name}
                                        style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                                      />
                                      <span style={{ fontWeight: "600", fontSize: "13px" }}>{video.name}</span>
                                    </div>
                                    <div className="vid-info" style={{ fontSize: "12px", color: "#64748b" }}>
                                      <span>{video.age}</span> ·{" "}
                                      <span>
                                        <i className="icofont-eye-open"></i> {video.views} views
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {/* Remaining Video Posts */}
                          {remainingVideoPosts.map((post) => (
                            <VideoCard key={post.id} post={post} />
                          ))}

                          {/* Only show loading animation if actually loading */}
                          {isLoading && <div className="sp sp-bars"></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Share Video Modal */}
          {isShareModalOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => setIsShareModalOpen(false)}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  maxWidth: "500px",
                  width: "100%",
                  padding: "25px",
                  position: "relative",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", fontSize: "22px", color: "#64748b" }}
                  onClick={() => setIsShareModalOpen(false)}
                >
                  &times;
                </span>
                <h4 style={{ marginBottom: "16px", color: "#0f172a" }}>Share Video with Community</h4>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                  Paste a YouTube, Vimeo, or direct MP4 video link to share with colleagues and researchers.
                </p>

                <form onSubmit={handleShareVideoSubmit}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>
                      Video Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI & Research Methods Lecture"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>
                      Video URL (YouTube / Vimeo / MP4)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "#334155" }}>
                      Description / Research Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="What makes this video interesting?"
                      value={newVideoNotes}
                      onChange={(e) => setNewVideoNotes(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="main-btn"
                    disabled={isPublishing}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      background: "#088dcd",
                      color: "#fff",
                      border: "none",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    {isPublishing ? "Publishing..." : "Publish Video"}
                  </button>

                  {shareStatus && (
                    <p style={{ marginTop: "12px", textAlign: "center", color: "#16a34a", fontWeight: "600", fontSize: "13px" }}>
                      {shareStatus}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          <AppFooter />
        </div>

        <Script id="videos-carousel-fix" strategy="lazyOnload">
          {`
            (function () {
              var configs = [
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
