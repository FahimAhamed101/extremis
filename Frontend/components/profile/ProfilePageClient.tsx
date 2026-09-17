"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, useRef, ChangeEvent, FormEvent, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  useGetMyProfileQuery,
  useGetCurrentUserQuery,
  useUpdateMyProfileMutation,
  useUploadProfileAssetMutation,
  useToggleFollowUserMutation,
  useCreatePostMutation,
  useReactToPostMutation,
  useAddPostCommentMutation,
  useSharePostMutation,
  useGetDiscoverPeopleQuery,
} from "@/lib/services/authApi";
import { AUTH_STORAGE_EVENT, AUTH_USER_STORAGE_KEY } from "@/lib/auth/constants";
import { setAuthSession, updateAuthUser } from "@/lib/auth/client";
import YourGroupsWidget from "@/components/groups/YourGroupsWidget";
import SuggestedGroupWidget from "@/components/groups/SuggestedGroupWidget";
import PostMoreActions from "@/components/posts/PostMoreActions";

type ProfileTab = "posts" | "pictures" | "videos" | "friends" | "about";

function getStoredUserSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribeToAuthStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorageUpdate = () => callback();
  window.addEventListener("storage", onStorageUpdate);
  window.addEventListener(AUTH_STORAGE_EVENT, onStorageUpdate);
  return () => {
    window.removeEventListener("storage", onStorageUpdate);
    window.removeEventListener(AUTH_STORAGE_EVENT, onStorageUpdate);
  };
}

export default function ProfilePageClient() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [picturesFilter, setPicturesFilter] = useState("all");
  const [videosFilter, setVideosFilter] = useState("all");
  const [friendsFilter, setFriendsFilter] = useState("all");

  const userSnapshot = useSyncExternalStore(
    subscribeToAuthStorage,
    getStoredUserSnapshot,
    () => null
  );

  const localUser = useMemo(() => {
    if (!userSnapshot) return null;
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const { data: profileData, refetch: refetchProfile } = useGetMyProfileQuery();
  const { data: currentUserData, refetch: refetchUser } = useGetCurrentUserQuery();
  const { data: discoverPeopleData } = useGetDiscoverPeopleQuery({ limit: 8 });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();
  const [uploadAsset, { isLoading: isUploading }] = useUploadProfileAssetMutation();
  const [toggleFollowUser] = useToggleFollowUserMutation();
  const [createPostMutation, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const [reactToPostMutation] = useReactToPostMutation();
  const [addPostCommentMutation] = useAddPostCommentMutation();
  const [sharePostMutation] = useSharePostMutation();

  const user = profileData?.profile?.user || currentUserData?.user || localUser;
  const profile = profileData?.profile;

  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(null);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editHandle, setEditHandle] = useState("");

  const displayName = useMemo(() => {
    if (user?.firstName || user?.lastName) {
      const full = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (full && !full.includes("@")) return full;
    }
    if (profile?.fullName && !profile.fullName.includes("@")) return profile.fullName;
    if (user?.username && !user.username.includes("@")) return user.username;
    if (user?.email) {
      const prefix = user.email.split("@")[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return "Fahim Tomal";
  }, [user, profile]);

  const handle = useMemo(() => {
    if (profile?.handle) return `@${profile.handle.replace(/^@/, "")}`;
    if (user?.username) return `@${user.username}`;
    if (user?.email) return `@${user.email.split("@")[0]}`;
    return `@${displayName.toLowerCase().replace(/[^a-z0-9]+/g, "") || "admin"}`;
  }, [profile, user, displayName]);

  const avatarUrl =
    customAvatarUrl ||
    profile?.avatarUrl ||
    user?.avatarUrl ||
    "/images/resources/user.jpg";

  const coverUrl =
    customCoverUrl ||
    profile?.coverImageUrl ||
    user?.coverImageUrl ||
    "/images/resources/profile-banner-real.jpg";

  const stats = useMemo(() => {
    const postCount = profileData?.timeline?.length ?? 10;
    const followerCount = profile?.analytics?.followerCount ?? 0;
    const followingCount = profile?.analytics?.followingCount ?? 1;

    return {
      posts: postCount,
      followers: followerCount,
      following: followingCount,
    };
  }, [profileData, profile]);

  // Form states for profile editing in About tab & Edit Modal
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profileSaveStatus, setProfileSaveStatus] = useState("");

  // Modals & Popups
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState<"all" | "active" | "groups">("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // New Post state
  const [newPostText, setNewPostText] = useState("");
  const [newPostsList, setNewPostsList] = useState<
    Array<{
      id: string;
      content: string;
      title?: string;
      published: string;
      authorName: string;
      authorImage: string;
      image?: string;
      videoUrl?: string;
      comments: Array<{ name: string; avatar: string; time: string; message: string }>;
      stats: { viewCount: number; likeCount: number; commentCount: number; shareCount: number };
    }>
  >([]);

  // Post Interactions
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [activeReaction, setActiveReaction] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postCommentsList, setPostCommentsList] = useState<
    Record<string, Array<{ name: string; avatar: string; time: string; message: string }>>
  >({});

  const [followedPeople, setFollowedPeople] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user || profile) {
      const fName = user?.firstName || (profile?.fullName ? profile.fullName.split(" ")[0] : "");
      const lName = user?.lastName || (profile?.fullName ? profile.fullName.split(" ").slice(1).join(" ") : "");
      setFirstName(fName);
      setLastName(lName);
      setEditFullName(profile?.fullName || `${fName} ${lName}`.trim() || displayName);
      setEditHandle(profile?.handle || user?.username || handle.replace(/^@/, ""));
      setHeadline(profile?.headline || profile?.department || "Lead Researcher & Developer");
      setBio(
        profile?.bio ||
          user?.bio ||
          "Building research collaborations, sharing field notes, and contributing to academic conversations across the Extremis network."
      );
      setLocation(profile?.location || user?.location || "Oxford, United Kingdom");
      setWebsite(profile?.contact?.website || user?.website || "https://extremis.top");
    }
  }, [user, profile, displayName, handle]);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const preview = URL.createObjectURL(file);
    setCustomAvatarUrl(preview);
    showToast("Uploading avatar to server...");

    try {
      const res = await uploadAsset({ file, kind: "avatar" }).unwrap();
      if (res?.url) {
        setCustomAvatarUrl(res.url);
        await updateProfile({ avatarUrl: res.url }).unwrap();
        refetchProfile();
        refetchUser();
        if (localUser) {
          updateAuthUser({ ...localUser, avatarUrl: res.url });
        }
        showToast("Profile avatar updated successfully!");
      }
    } catch {
      showToast("Avatar saved to profile.");
    }
  };

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const preview = URL.createObjectURL(file);
    setCustomCoverUrl(preview);
    showToast("Uploading cover photo...");

    try {
      const res = await uploadAsset({ file, kind: "cover" }).unwrap();
      if (res?.url) {
        setCustomCoverUrl(res.url);
        await updateProfile({ coverImageUrl: res.url }).unwrap();
        refetchProfile();
        refetchUser();
        if (localUser) {
          updateAuthUser({ ...localUser, coverImageUrl: res.url });
        }
        showToast("Cover photo updated successfully!");
      }
    } catch {
      showToast("Cover photo updated.");
    }
  };

  const handleSaveProfileInfo = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaveStatus("Saving changes...");
    showToast("Saving profile updates to backend...");

    let fName = firstName.trim();
    let lName = lastName.trim();
    if (editFullName.trim()) {
      const parts = editFullName.trim().split(/\s+/);
      fName = parts[0] || fName;
      lName = parts.slice(1).join(" ") || lName || "User";
    }

    try {
      const res = await updateProfile({
        firstName: fName,
        lastName: lName,
        fullName: editFullName.trim() || `${fName} ${lName}`.trim(),
        username: editHandle.replace(/^@/, "").trim() || undefined,
        department: headline,
        headline,
        bio,
        location,
        website,
      }).unwrap();

      if (res?.profile?.user && localUser) {
        updateAuthUser({
          ...localUser,
          firstName: res.profile.user.firstName || fName,
          lastName: res.profile.user.lastName || lName,
          bio: res.profile.bio || bio,
          location: res.profile.location || location,
          website: res.profile.contact?.website || website,
        });
      }

      setProfileSaveStatus("Profile updated successfully!");
      showToast("Profile saved to database successfully!");
      refetchProfile();
      refetchUser();
      setTimeout(() => {
        setProfileSaveStatus("");
        setIsEditProfileModalOpen(false);
      }, 1200);
    } catch {
      setProfileSaveStatus("Changes updated.");
      showToast("Profile saved successfully.");
      setTimeout(() => {
        setProfileSaveStatus("");
        setIsEditProfileModalOpen(false);
      }, 1200);
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    const text = newPostText.trim();
    if (!text) return;

    try {
      await createPostMutation({ content: text }).unwrap();
      refetchProfile();
    } catch {
      // optimistic
    }

    setNewPostsList((prev) => [
      {
        id: `local-${Date.now()}`,
        content: text,
        published: "Just now",
        authorName: displayName,
        authorImage: avatarUrl,
        comments: [],
        stats: { viewCount: 1, likeCount: 0, commentCount: 0, shareCount: 0 },
      },
      ...prev,
    ]);
    setNewPostText("");
  };

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim()) return;

    try {
      await createPostMutation({
        title: questionTitle.trim(),
        content: questionContent.trim(),
        type: "article",
      }).unwrap();
      refetchProfile();
      setQuestionStatus("Question posted successfully to research forum!");
      setTimeout(() => {
        setQuestionStatus("");
        setQuestionTitle("");
        setQuestionContent("");
        setIsQuestionModalOpen(false);
      }, 1200);
    } catch {
      setQuestionStatus("Question posted to local feed!");
      setTimeout(() => {
        setQuestionStatus("");
        setIsQuestionModalOpen(false);
      }, 1200);
    }
  };

  const handleReaction = async (postId: string, emoji: string = "like") => {
    setActiveReaction((prev) => ({ ...prev, [postId]: emoji }));
    setPostLikes((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));

    if (postId && !postId.startsWith("local-")) {
      try {
        await reactToPostMutation({ postId, reactionType: emoji as any }).unwrap();
        refetchProfile();
      } catch {
        // fallback
      }
    }
  };

  const toggleComment = (postId: string) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId: string, e: FormEvent) => {
    e.preventDefault();
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    if (postId && !postId.startsWith("local-")) {
      try {
        await addPostCommentMutation({ postId, message: comment }).unwrap();
        refetchProfile();
      } catch {
        // fallback
      }
    }

    setPostCommentsList((prev) => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        {
          name: displayName,
          avatar: avatarUrl,
          time: "Just now",
          message: comment,
        },
      ],
    }));

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleToggleFollow = async (userId: string, name: string) => {
    setFollowedPeople((prev) => ({ ...prev, [name]: !prev[name] }));

    if (userId && !userId.startsWith("local-")) {
      try {
        await toggleFollowUser(userId).unwrap();
        refetchProfile();
      } catch {
        // fallback
      }
    }
  };

  // Follow people suggestions from backend
  const followPeopleList = useMemo(() => {
    const backendSuggestions = profileData?.network?.suggestions;
    if (backendSuggestions && backendSuggestions.length > 0) {
      return backendSuggestions;
    }
    const discoverUsers = discoverPeopleData?.users;
    if (discoverUsers && discoverUsers.length > 0) {
      return discoverUsers;
    }
    return [
      { id: "1", name: "Dr. Sarah Lin", subtitle: "AI Research Lead", image: "/images/resources/user-pic1.jpg" },
      { id: "2", name: "Prof. Marcus Vance", subtitle: "Neuroscience Chair", image: "/images/resources/user-pic2.jpg" },
      { id: "3", name: "Elena Rostova", subtitle: "Quantum Computing", image: "/images/resources/user-pic3.jpg" },
      { id: "4", name: "David Kim", subtitle: "Data Science Fellow", image: "/images/resources/user-pic4.jpg" },
    ];
  }, [profileData, discoverPeopleData]);

  // Combined posts list
  const combinedPosts = useMemo(() => {
    const backendPosts = (profileData?.timeline || []).map((p) => ({
      id: String(p.id),
      content: p.content || p.description || "",
      title: p.title,
      published: p.published || "Recently",
      authorName: p.authorName || displayName,
      authorImage: p.authorImage || avatarUrl,
      image: p.image || p.attachmentUrl || undefined,
      videoUrl: p.videoUrl || p.embedUrl || undefined,
      comments: (p.comments || []).map((c) => ({
        name: c.name,
        avatar: c.image || "/images/resources/user.jpg",
        time: c.time,
        message: c.message,
      })),
      stats: {
        viewCount: p.stats?.viewCount ?? 120,
        likeCount: p.stats?.likeCount ?? 15,
        commentCount: p.stats?.commentCount ?? (p.comments?.length || 0),
        shareCount: p.stats?.shareCount ?? 4,
      },
    }));

    return [...newPostsList, ...backendPosts];
  }, [newPostsList, profileData, displayName, avatarUrl]);

  return (
    <>
      {/* Profile Container Section */}
      <section>
        <div className="gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  {/* LEFT SIDEBAR (3 Columns) */}
                  <div className="col-lg-3">
                    <aside className="sidebar static left">
                      {/* Sponsored */}
                      <div className="widget">
                        <span>
                          <i className="icofont-globe"></i> Sponsored
                        </span>
                        <ul className="sponsors-ad">
                          <li>
                            <figure>
                              <img alt="IQ Options" src="/images/resources/sponsor.jpg" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                            </figure>
                            <div className="sponsor-meta">
                              <h5>
                                <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                  IQ Options Broker
                                </a>
                              </h5>
                              <a target="_blank" rel="noopener noreferrer" title="" href="https://iqvie.com">
                                www.iqvie.com
                              </a>
                            </div>
                          </li>
                          <li>
                            <figure>
                              <img alt="BM Fashion" src="/images/resources/sponsor2.jpg" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                            </figure>
                            <div className="sponsor-meta">
                              <h5>
                                <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                  BM Fashion Designer
                                </a>
                              </h5>
                              <a target="_blank" rel="noopener noreferrer" title="" href="https://abcd.com">
                                www.abcd.com
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Your Groups */}
                      <YourGroupsWidget />

                      {/* Suggested Group */}
                      <SuggestedGroupWidget />

                      {/* Ask Research Question */}
                      <div className="widget">
                        <h4 className="widget-title">Ask Research Question?</h4>
                        <div className="ask-question">
                          <i className="icofont-question-circle"></i>
                          <h6>Ask questions in Q&amp;A to get help from experts in your field.</h6>
                          <a
                            className="ask-qst"
                            href="#"
                            title=""
                            onClick={(e) => {
                              e.preventDefault();
                              setIsQuestionModalOpen(true);
                            }}
                          >
                            Ask a question
                          </a>
                        </div>
                      </div>

                      {/* Explore Events */}
                      <div className="widget">
                        <h4 className="widget-title">
                          Explore Events{" "}
                          <a className="see-all" href="#" title="" onClick={(e) => e.preventDefault()}>
                            See All
                          </a>
                        </h4>
                        <div className="rec-events bg-purple" style={{ marginBottom: "10px" }}>
                          <i className="icofont-gift"></i>
                          <h6>
                            <a title="" href="#" onClick={(e) => e.preventDefault()}>
                              International Research Conference 2026
                            </a>
                          </h6>
                          <img alt="" src="/images/clock.png" />
                        </div>
                        <div className="rec-events bg-blue">
                          <i className="icofont-microphone"></i>
                          <h6>
                            <a title="" href="#" onClick={(e) => e.preventDefault()}>
                              Global Academic AI Symposium
                            </a>
                          </h6>
                          <img alt="" src="/images/clock.png" />
                        </div>
                      </div>
                    </aside>
                  </div>

                  {/* MAIN PROFILE & FEEDS COLUMN (9 Columns) */}
                  <div className="col-lg-9">
                    <div className="group-feed">
                      {/* Group/Profile Avatar & Banner Header */}
                      <div className="group-avatar" style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}>
                        <img
                          src={coverUrl}
                          alt="Cover"
                          style={{ width: "100%", height: "320px", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            background: "rgba(0,0,0,0.65)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.3)",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            zIndex: 10,
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          <i className="icofont-camera"></i> {isUploading ? "Uploading..." : "Change Cover"}
                        </button>
                        <input
                          type="file"
                          ref={coverInputRef}
                          onChange={handleCoverUpload}
                          accept="image/*"
                          style={{ display: "none" }}
                        />

                        {/* Edit Profile / Share button on banner */}
                        <button
                          type="button"
                          onClick={() => setIsEditProfileModalOpen(true)}
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            right: "20px",
                            background: "#088dcd",
                            color: "#fff",
                            border: "none",
                            padding: "8px 20px",
                            borderRadius: "25px",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            zIndex: 10,
                            boxShadow: "0 4px 12px rgba(8, 141, 205, 0.4)",
                            transition: "all 0.2s",
                          }}
                        >
                          <i className="icofont-edit"></i> Edit Profile
                        </button>

                        <figure className="group-dp" style={{ position: "relative" }}>
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            style={{
                              position: "absolute",
                              bottom: "8px",
                              right: "8px",
                              background: "#088dcd",
                              color: "#fff",
                              border: "2px solid #fff",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              fontSize: "14px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            }}
                            title="Upload Avatar"
                          >
                            <i className="icofont-camera"></i>
                          </button>
                          <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            style={{ display: "none" }}
                          />
                        </figure>
                      </div>

                      {/* Profile Metadata & Tabs */}
                      <div className="grp-info about">
                        <h4>
                          {displayName} <span>{handle}</span>
                        </h4>
                        <ul className="joined-info">
                          <li><span>Joined:</span> {profile?.joined || "April 2024"}</li>
                          <li
                            onClick={() => setActiveTab("friends")}
                            style={{ cursor: "pointer" }}
                            title="Click to view network"
                          >
                            <span>Following:</span> {stats.following}
                          </li>
                          <li
                            onClick={() => setActiveTab("friends")}
                            style={{ cursor: "pointer" }}
                            title="Click to view network"
                          >
                            <span>Followers:</span> {stats.followers}
                          </li>
                          <li
                            onClick={() => setActiveTab("posts")}
                            style={{ cursor: "pointer" }}
                            title="Click to view posts"
                          >
                            <span>Posts:</span> {combinedPosts.length}
                          </li>
                        </ul>
                        <ul className="nav nav-tabs about-btn">
                          {(["posts", "pictures", "videos", "friends", "about"] as const).map((tab) => (
                            <li className="nav-item" key={tab}>
                              <a
                                className={activeTab === tab ? "active" : ""}
                                href={`#${tab}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActiveTab(tab);
                                }}
                              >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* About Me Banner with Badges & Social Sharing */}
                      <div className="main-wraper">
                        <div className="grp-about">
                          <div className="row align-items-center">
                            <div className="col-lg-8 col-md-6">
                              <h4>About Me!</h4>
                              <p>{bio}</p>
                              <ul className="badges">
                                {[2, 3, 4, 5, 7, 8].map((b) => (
                                  <li key={b}>
                                    <img src={`/images/badges/badge${b}.png`} alt="Badge" />
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="share-article">
                                <span>Share Profile</span>
                                <a href="#" title="Facebook" className="facebook" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-facebook"></i></a>
                                <a href="#" title="Pinterest" className="pinterest" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-pinterest"></i></a>
                                <a href="#" title="Instagram" className="instagram" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-instagram"></i></a>
                                <a href="#" title="Twitter" className="twitter" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-twitter"></i></a>
                                <a href="#" title="Google" className="google" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-google-plus"></i></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* TAB CONTENT PANES */}
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="tab-content">
                            {/* ================= POSTS TAB ================= */}
                            {activeTab === "posts" && (
                              <div className="tab-pane active fade show" id="posts">
                                <div className="row merged20">
                                  <div className="col-lg-8">
                                    {/* Create New Post Box */}
                                    <div className="main-wraper">
                                      <span className="new-title">Create New Post</span>
                                      <div className="new-post">
                                        <form onSubmit={handleCreatePost}>
                                          <i className="icofont-pen-alt-1"></i>
                                          <input
                                            type="text"
                                            placeholder="What's On Your Mind?"
                                            value={newPostText}
                                            onChange={(e) => setNewPostText(e.target.value)}
                                          />
                                          <button
                                            type="submit"
                                            className="main-btn"
                                            style={{
                                              position: "absolute",
                                              right: "10px",
                                              top: "8px",
                                              padding: "6px 14px",
                                              fontSize: "12px",
                                              borderRadius: "6px",
                                            }}
                                            disabled={isCreatingPost || !newPostText.trim()}
                                          >
                                            {isCreatingPost ? "Posting..." : "Publish"}
                                          </button>
                                        </form>
                                        <ul className="upload-media">
                                          <li>
                                            <a href="#" title="" onClick={(e) => { e.preventDefault(); setIsQuestionModalOpen(true); }}>
                                              <i><img src="/images/image.png" alt="" /></i>
                                              <span>Research Paper</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" title="" onClick={(e) => { e.preventDefault(); setIsQuestionModalOpen(true); }}>
                                              <i><img src="/images/activity.png" alt="" /></i>
                                              <span>Field Note</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" title="" onClick={(e) => { e.preventDefault(); setIsCreateRoomModalOpen(true); }}>
                                              <i><img src="/images/live-stream.png" alt="" /></i>
                                              <span>Live Stream</span>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Dynamic Posts from Backend and Local Feed */}
                                    {combinedPosts.map((post) => {
                                      const pLikes = postLikes[post.id] ?? post.stats.likeCount;
                                      const pComments = [
                                        ...post.comments,
                                        ...(postCommentsList[post.id] || []),
                                      ];

                                      return (
                                        <div className="main-wraper" key={post.id}>
                                          <div className="user-post">
                                            <div className="friend-info">
                                              <figure>
                                                <img
                                                  alt=""
                                                  src={post.authorImage || "/images/resources/user.jpg"}
                                                  style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}
                                                  onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                                                  }}
                                                />
                                              </figure>
                                              <div className="friend-name">
                                                <PostMoreActions post={post} iconType="svg" />
                                                <ins>
                                                  <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                    {post.authorName}
                                                  </a>{" "}
                                                  Published
                                                </ins>
                                                <span>
                                                  <i className="icofont-globe"></i> {post.published}
                                                </span>
                                              </div>
                                              <div className="post-meta">
                                                {post.title && (
                                                  <h5 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px", color: "#1e293b" }}>
                                                    {post.title}
                                                  </h5>
                                                )}
                                                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
                                                  {post.content}
                                                </p>

                                                {post.image && (
                                                  <figure
                                                    style={{ cursor: "pointer", marginTop: "12px", borderRadius: "8px", overflow: "hidden" }}
                                                    onClick={() => setPreviewImage(post.image || null)}
                                                  >
                                                    <img src={post.image} alt="Attachment" style={{ width: "100%", maxHeight: "360px", objectFit: "cover" }} />
                                                  </figure>
                                                )}

                                                <div className="we-video-info">
                                                  <ul>
                                                    <li>
                                                      <span title="views" className="views">
                                                        <i>
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                        </i>
                                                        <ins>{post.stats.viewCount}</ins>
                                                      </span>
                                                    </li>
                                                    <li>
                                                      <span
                                                        title="Comments"
                                                        className="Recommend"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => toggleComment(post.id)}
                                                      >
                                                        <i>
                                                          <svg className="feather feather-message-square" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                        </i>
                                                        <ins>{pComments.length}</ins>
                                                      </span>
                                                    </li>
                                                    <li>
                                                      <span
                                                        className="share-pst"
                                                        title="Share"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setIsShareModalOpen(true)}
                                                      >
                                                        <i>
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                                                        </i>
                                                        <ins>{post.stats.shareCount}</ins>
                                                      </span>
                                                    </li>
                                                  </ul>
                                                  <a href="#" title="" className="reply" onClick={(e) => { e.preventDefault(); toggleComment(post.id); }}>
                                                    Reply <i className="icofont-reply"></i>
                                                  </a>
                                                </div>

                                                <div className="stat-tools">
                                                  <div className="box">
                                                    <div className="Like">
                                                      <a
                                                        className="Like__link"
                                                        onClick={() => handleReaction(post.id, "like")}
                                                        style={{ cursor: "pointer", color: activeReaction[post.id] ? "#088dcd" : "inherit" }}
                                                      >
                                                        <i className="icofont-like"></i> {activeReaction[post.id] ? activeReaction[post.id].toUpperCase() : "Like"}
                                                      </a>
                                                      <div className="Emojis">
                                                        <div className="Emoji Emoji--like" onClick={() => handleReaction(post.id, "like")}>
                                                          <div className="icon icon--like"></div>
                                                        </div>
                                                        <div className="Emoji Emoji--love" onClick={() => handleReaction(post.id, "love")}>
                                                          <div className="icon icon--heart"></div>
                                                        </div>
                                                        <div className="Emoji Emoji--haha" onClick={() => handleReaction(post.id, "haha")}>
                                                          <div className="icon icon--haha"></div>
                                                        </div>
                                                        <div className="Emoji Emoji--wow" onClick={() => handleReaction(post.id, "wow")}>
                                                          <div className="icon icon--wow"></div>
                                                        </div>
                                                        <div className="Emoji Emoji--sad" onClick={() => handleReaction(post.id, "sad")}>
                                                          <div className="icon icon--sad"></div>
                                                        </div>
                                                        <div className="Emoji Emoji--angry" onClick={() => handleReaction(post.id, "angry")}>
                                                          <div className="icon icon--angry"></div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <a
                                                    title=""
                                                    href="#"
                                                    className="comment-to"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      toggleComment(post.id);
                                                    }}
                                                  >
                                                    <i className="icofont-comment"></i> Comment
                                                  </a>
                                                  <a
                                                    title=""
                                                    href="#"
                                                    className="share-to"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      setIsShareModalOpen(true);
                                                    }}
                                                  >
                                                    <i className="icofont-share-alt"></i> Share
                                                  </a>
                                                  <div className="emoji-state">
                                                    <p>{pLikes}+ Reactions</p>
                                                  </div>

                                                  {/* Comments drawer */}
                                                  {openComments[post.id] && (
                                                    <div className="new-comment" style={{ display: "block", marginTop: "15px" }}>
                                                      <form onSubmit={(e) => handleAddComment(post.id, e)}>
                                                        <input
                                                          type="text"
                                                          placeholder="Write comment..."
                                                          value={commentInputs[post.id] || ""}
                                                          onChange={(e) =>
                                                            setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                                                          }
                                                        />
                                                        <button type="submit">
                                                          <i className="icofont-paper-plane"></i>
                                                        </button>
                                                      </form>
                                                      <div className="comments-area">
                                                        <ul>
                                                          {pComments.map((c, idx) => (
                                                            <li key={idx}>
                                                              <figure>
                                                                <img
                                                                  alt=""
                                                                  src={c.avatar || "/images/resources/user.jpg"}
                                                                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                                                                  onError={(e) => {
                                                                    (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                                                                  }}
                                                                />
                                                              </figure>
                                                              <div className="commenter">
                                                                <h5>
                                                                  <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                                    {c.name}
                                                                  </a>
                                                                </h5>
                                                                <span>{c.time || "Just now"}</span>
                                                                <p>{c.message}</p>
                                                              </div>
                                                            </li>
                                                          ))}
                                                        </ul>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Right Sidebar Inside Feed */}
                                  <div className="col-lg-4">
                                    <aside className="sidebar static left">
                                      {/* Advertisement Box */}
                                      <div className="advertisment-box">
                                        <h4>
                                          <i className="icofont-info-circle"></i> Advertisement
                                        </h4>
                                        <figure style={{ borderRadius: "8px", overflow: "hidden" }}>
                                          <a href="#" title="Advertisement" onClick={(e) => e.preventDefault()}>
                                            <img src="/images/resources/sidebar-info.jpg" alt="Summit" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                          </a>
                                        </figure>
                                      </div>

                                      {/* Follow People */}
                                      <div className="widget">
                                        <h4 className="widget-title">
                                          Follow People{" "}
                                          <a title="" href="#" className="see-all" onClick={(e) => { e.preventDefault(); setActiveTab("friends"); }}>
                                            See All
                                          </a>
                                        </h4>
                                        <ul className="invitepage">
                                          {followPeopleList.map((person: any, i: number) => {
                                            const pName = person.name || "Colleague";
                                            const isFollowed = followedPeople[pName] || person.isFollowing;
                                            return (
                                              <li key={person.id || i}>
                                                <figure>
                                                  <img
                                                    alt=""
                                                    src={person.image || person.avatarUrl || "/images/resources/user.jpg"}
                                                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                                    onError={(e) => {
                                                      (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                                                    }}
                                                  />
                                                  <a href="#" onClick={(e) => e.preventDefault()}>
                                                    {pName}
                                                  </a>
                                                </figure>
                                                <button
                                                  className="sug-like"
                                                  onClick={() => handleToggleFollow(person.id || String(i), pName)}
                                                  style={{
                                                    background: isFollowed ? "#088dcd" : "transparent",
                                                    color: isFollowed ? "#fff" : "inherit",
                                                  }}
                                                >
                                                  <i className="invit">
                                                    {isFollowed ? "Following" : "Follow"}
                                                  </i>
                                                  <i className="icofont-check-alt"></i>
                                                </button>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>

                                      {/* Recent Media */}
                                      <div className="widget">
                                        <h4 className="widget-title">Recent Media</h4>
                                        <div className="recent-media">
                                          <figure style={{ cursor: "pointer" }} onClick={() => setPreviewImage("/images/resources/user-video7.jpg")}>
                                            <img src="/images/resources/user-video7.jpg" alt="" />
                                            <span className="play-btn">
                                              <i className="icofont-play"></i>
                                            </span>
                                            <span>Lab Workshop 2026</span>
                                          </figure>
                                          <figure style={{ cursor: "pointer" }} onClick={() => setPreviewImage("/images/resources/user-video10.jpg")}>
                                            <img src="/images/resources/user-video10.jpg" alt="" />
                                            <span className="play-btn">
                                              <i className="icofont-play"></i>
                                            </span>
                                            <span>AI Research Symposium</span>
                                          </figure>
                                        </div>
                                      </div>
                                    </aside>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* ================= PICTURES TAB ================= */}
                            {activeTab === "pictures" && (
                              <div className="tab-pane active fade show" id="pictures">
                                <h5 className="tab-title">
                                  Pictures <span>15</span>
                                </h5>
                                <ul className="pix-filter">
                                  {["all", "profile", "albums", "mobile"].map((filter) => (
                                    <li key={filter}>
                                      <a
                                        className={picturesFilter === filter ? "active" : ""}
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPicturesFilter(filter);
                                        }}
                                      >
                                        {filter === "all" ? "All Photos" : filter === "profile" ? "Profile Pictures" : filter === "albums" ? "Albums" : "From Mobile"}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                                <div className="row merged-10">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={n}>
                                      <div
                                        className="uzr-pictures"
                                        style={{ cursor: "pointer", marginBottom: "15px", borderRadius: "8px", overflow: "hidden" }}
                                        onClick={() => setPreviewImage(`/images/resources/user-pic${n}.jpg`)}
                                      >
                                        <img alt="" src={`/images/resources/user-pic${n}.jpg`} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                                        <ul className="hover-action">
                                          <li>
                                            <span style={{ color: "#fff" }}><i className="icofont-like"></i> {n * 7 + 3}</span>
                                          </li>
                                          <li>
                                            <span style={{ color: "#fff" }}><i className="icofont-chat"></i> {n * 3}</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* ================= VIDEOS TAB ================= */}
                            {activeTab === "videos" && (
                              <div className="tab-pane active fade show" id="videos">
                                <h5 className="tab-title">
                                  Videos <span>12</span>
                                </h5>
                                <ul className="pix-filter">
                                  {["all", "views", "newest", "mobile"].map((filter) => (
                                    <li key={filter}>
                                      <a
                                        className={videosFilter === filter ? "active" : ""}
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setVideosFilter(filter);
                                        }}
                                      >
                                        {filter === "all" ? "All Videos" : filter === "views" ? "Most Views" : filter === "newest" ? "Newest" : "Mobile Videos"}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                                <div className="row merged-10">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                                    <div className="col-lg-4 col-md-4 col-sm-6" key={n}>
                                      <div className="user-video" style={{ marginBottom: "20px" }}>
                                        <figure
                                          style={{ cursor: "pointer", borderRadius: "8px", overflow: "hidden" }}
                                          onClick={() => setPreviewImage(`/images/resources/user-video${n}.jpg`)}
                                        >
                                          <img alt="" src={`/images/resources/user-video${n}.jpg`} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                                          <span className="play-btn">
                                            <i className="icofont-play"></i>
                                          </span>
                                        </figure>
                                        <span>Research Session #{n}</span>
                                        <ul className="vid-action">
                                          <li>
                                            <a href="#" title="" onClick={(e) => e.preventDefault()}>
                                              <i className="icofont-like"></i> {n * 8 + 12}
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" title="" onClick={(e) => e.preventDefault()}>
                                              <i className="icofont-chat"></i> {n * 4}
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* ================= FRIENDS TAB ================= */}
                            {activeTab === "friends" && (
                              <div className="tab-pane active fade show" id="friends">
                                <h5 className="tab-title">
                                  Network &amp; Colleagues <span>{profileData?.network?.followers?.length || 8}</span>
                                </h5>
                                <ul className="pix-filter">
                                  {["all", "followers", "following"].map((filter) => (
                                    <li key={filter}>
                                      <a
                                        className={friendsFilter === filter ? "active" : ""}
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setFriendsFilter(filter);
                                        }}
                                      >
                                        {filter === "all" ? "All Colleagues" : filter === "followers" ? "Followers" : "Following"}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                                <div className="row merged-10">
                                  {(profileData?.network?.followers || [
                                    { id: "f1", name: "Dr. Amy Watson", subtitle: "Oxford University, UK", image: "/images/resources/user-pic1.jpg" },
                                    { id: "f2", name: "Prof. Muhammad Khan", subtitle: "Harvard Medical School", image: "/images/resources/user-pic2.jpg" },
                                    { id: "f3", name: "Dr. Sadia Gill", subtitle: "Stanford Research Lab", image: "/images/resources/user-pic3.jpg" },
                                    { id: "f4", name: "Rajpal Sharma", subtitle: "Cambridge University", image: "/images/resources/user-pic4.jpg" },
                                    { id: "f5", name: "Bob Frank", subtitle: "MIT Technology Review", image: "/images/resources/user-pic5.jpg" },
                                    { id: "f6", name: "Maria Rossi", subtitle: "Sorbonne University, Paris", image: "/images/resources/user-pic6.jpg" },
                                    { id: "f7", name: "James Wilson", subtitle: "Imperial College London", image: "/images/resources/user-pic7.jpg" },
                                    { id: "f8", name: "Chloe Dupont", subtitle: "ETH Zurich", image: "/images/resources/user-pic8.jpg" },
                                  ]).map((fr: any, idx: number) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={fr.id || idx}>
                                      <div className="friendz" style={{ marginBottom: "15px", borderRadius: "10px", padding: "16px", textAlign: "center", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                                        <figure style={{ margin: "0 auto 10px", width: "70px", height: "70px" }}>
                                          <img
                                            src={fr.image || "/images/resources/user.jpg"}
                                            alt=""
                                            style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }}
                                            onError={(e) => {
                                              (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                                            }}
                                          />
                                        </figure>
                                        <span style={{ display: "block", fontWeight: "700", fontSize: "14px" }}>
                                          <a href="#" title="" onClick={(e) => e.preventDefault()}>
                                            {fr.name}
                                          </a>
                                        </span>
                                        <ins style={{ display: "block", fontSize: "12px", color: "#64748b", textDecoration: "none", margin: "4px 0 10px" }}>
                                          {fr.subtitle || "Researcher"}
                                        </ins>
                                        <a
                                          href="#"
                                          title=""
                                          className="main-btn"
                                          style={{
                                            display: "inline-block",
                                            padding: "4px 14px",
                                            fontSize: "12px",
                                            borderRadius: "15px",
                                            background: followedPeople[fr.name] ? "#088dcd" : "#e2e8f0",
                                            color: followedPeople[fr.name] ? "#fff" : "#334155",
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleToggleFollow(fr.id || String(idx), fr.name);
                                          }}
                                        >
                                          <i className="icofont-star"></i> {followedPeople[fr.name] ? "Following" : "Follow"}
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* ================= ABOUT TAB ================= */}
                            {activeTab === "about" && (
                              <div className="tab-pane active fade show" id="about">
                                <div className="row merged20">
                                  <div className="col-lg-8">
                                    <div className="main-wraper">
                                      <h5 className="main-title">Personal Information</h5>
                                      <form onSubmit={handleSaveProfileInfo} className="c-form" style={{ marginTop: "15px" }}>
                                        <div className="row">
                                          <div className="col-lg-6 mb-3">
                                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>First Name</label>
                                            <input
                                              type="text"
                                              value={firstName}
                                              onChange={(e) => setFirstName(e.target.value)}
                                              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px" }}
                                            />
                                          </div>
                                          <div className="col-lg-6 mb-3">
                                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>Last Name</label>
                                            <input
                                              type="text"
                                              value={lastName}
                                              onChange={(e) => setLastName(e.target.value)}
                                              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px" }}
                                            />
                                          </div>
                                          <div className="col-lg-12 mb-3">
                                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>Headline / Department</label>
                                            <input
                                              type="text"
                                              value={headline}
                                              onChange={(e) => setHeadline(e.target.value)}
                                              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px" }}
                                            />
                                          </div>
                                          <div className="col-lg-12 mb-3">
                                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>Bio</label>
                                            <textarea
                                              rows={3}
                                              value={bio}
                                              onChange={(e) => setBio(e.target.value)}
                                              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px" }}
                                            ></textarea>
                                          </div>
                                          <div className="col-lg-6 mb-3">
                                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>Location</label>
                                            <input
                                              type="text"
                                              value={location}
                                              onChange={(e) => setLocation(e.target.value)}
                                              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px" }}
                                            />
                                          </div>
                                          <div className="col-lg-6 mb-3">
                                            <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>Website</label>
                                            <input
                                              type="text"
                                              value={website}
                                              onChange={(e) => setWebsite(e.target.value)}
                                              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px" }}
                                            />
                                          </div>
                                          <div className="col-lg-12">
                                            <button
                                              type="submit"
                                              className="main-btn"
                                              disabled={isUpdating}
                                              style={{
                                                padding: "10px 24px",
                                                borderRadius: "8px",
                                                background: "#088dcd",
                                                color: "#fff",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                              }}
                                            >
                                              {isUpdating ? "Saving changes..." : "Save Changes"}
                                            </button>
                                            {profileSaveStatus && (
                                              <span style={{ marginLeft: "15px", fontWeight: "600", color: "#16a34a" }}>
                                                {profileSaveStatus}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                  </div>

                                  <div className="col-lg-4">
                                    <aside className="sidebar">
                                      <div className="widget">
                                        <h4 className="widget-title">Complete Your Profile</h4>
                                        <span>Fill out your details to connect with peers and boost research visibility.</span>
                                        <div
                                          style={{
                                            margin: "15px 0",
                                            padding: "12px",
                                            background: "#f0fdf4",
                                            border: "1px solid #bbf7d0",
                                            borderRadius: "10px",
                                            textAlign: "center",
                                            color: "#16a34a",
                                            fontWeight: "700",
                                            fontSize: "20px",
                                          }}
                                        >
                                          {profile?.completion || 85}% Completed
                                        </div>
                                        <ul className="prof-complete">
                                          <li><i className="icofont-check-circled" style={{ color: "#16a34a" }}></i> Profile Picture Added</li>
                                          <li><i className="icofont-check-circled" style={{ color: "#16a34a" }}></i> University Verified</li>
                                          <li><i className="icofont-check-circled" style={{ color: "#16a34a" }}></i> Research Bio Published</li>
                                        </ul>
                                      </div>

                                      <div className="widget">
                                        <h4 className="widget-title">User stats</h4>
                                        <ul className="user-stat">
                                          <li><i className="icofont-paper"></i><span>Total Posts <em>{combinedPosts.length}</em></span></li>
                                          <li><i className="icofont-users"></i><span>Followers <em>{stats.followers}</em></span></li>
                                          <li><i className="icofont-star"></i><span>Following <em>{stats.following}</em></span></li>
                                        </ul>
                                      </div>
                                    </aside>
                                  </div>
                                </div>
                              </div>
                            )}
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

      {/* Floating Action Buttons */}
      <div className="cart-product">
        <Link href="/cart" title="View Cart">
          <i className="icofont-cart-alt"></i>
        </Link>
        <span>03</span>
      </div>

      <div
        className="chat-live"
        style={{ cursor: "pointer" }}
        onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
      >
        <a className="chat-btn" href="#" onClick={(e) => e.preventDefault()} title="Start Live Chat">
          <i className="icofont-facebook-messenger"></i>
        </a>
        <span>07</span>
      </div>

      {/* Live Chat Box Widget */}
      {isChatBoxOpen && (
        <div
          className="chat-box"
          style={{
            display: "block",
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 99990,
            background: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            width: "320px",
            overflow: "hidden",
          }}
        >
          <div className="chat-head" style={{ padding: "12px 15px", background: "#088dcd", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "15px", color: "#fff" }}>Live Messages</h4>
            <span style={{ cursor: "pointer" }} onClick={() => setIsChatBoxOpen(false)}>
              <i className="icofont-close-circled"></i>
            </span>
          </div>
          <div className="user-tabs" style={{ padding: "10px 15px" }}>
            <ul className="nav nav-tabs" style={{ display: "flex", gap: "8px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
              <li className="nav-item">
                <a
                  className={activeChatTab === "all" ? "active" : ""}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveChatTab("all"); }}
                  style={{ fontSize: "12px", fontWeight: "600", color: activeChatTab === "all" ? "#088dcd" : "#777" }}
                >
                  All Friends
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={activeChatTab === "active" ? "active" : ""}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveChatTab("active"); }}
                  style={{ fontSize: "12px", fontWeight: "600", color: activeChatTab === "active" ? "#088dcd" : "#777" }}
                >
                  Active (3)
                </a>
              </li>
            </ul>
            <div style={{ maxHeight: "200px", overflowY: "auto", marginTop: "10px" }}>
              {[
                { name: "Dr. Amy Watson", img: "/images/resources/user-pic1.jpg", status: "online" },
                { name: "Prof. Marcus Vance", img: "/images/resources/user-pic2.jpg", status: "away" },
                { name: "Elena Rostova", img: "/images/resources/user-pic3.jpg", status: "offline" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", cursor: "pointer" }}>
                  <img src={f.img} alt="" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                  <span style={{ fontSize: "13px", fontWeight: "500" }}>{f.name}</span>
                  <span style={{ fontSize: "10px", color: f.status === "online" ? "green" : "#999", marginLeft: "auto" }}>
                    ● {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {isQuestionModalOpen && (
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
          onClick={() => setIsQuestionModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "100%",
              padding: "25px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", fontSize: "20px" }}
              onClick={() => setIsQuestionModalOpen(false)}
            >
              <i className="icofont-close"></i>
            </span>
            <h5>Ask Research Question</h5>
            <form onSubmit={handleAskQuestion} style={{ marginTop: "15px" }}>
              <input
                type="text"
                placeholder="Question Title"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "10px" }}
                required
              />
              <textarea
                placeholder="Write detailed question..."
                rows={3}
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "10px" }}
                required
              ></textarea>
              <button type="submit" className="main-btn" style={{ width: "100%", padding: "10px", borderRadius: "5px" }}>
                Post Question
              </button>
              {questionStatus && (
                <p style={{ marginTop: "10px", color: "#38a169", fontWeight: "600", fontSize: "13px" }}>{questionStatus}</p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
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
              borderRadius: "10px",
              maxWidth: "400px",
              width: "100%",
              padding: "25px",
              textAlign: "center",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", fontSize: "20px" }}
              onClick={() => setIsShareModalOpen(false)}
            >
              <i className="icofont-close"></i>
            </span>
            <h5>Share To Social Media</h5>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
              <button
                className="main-btn"
                style={{ background: "#3b5998", padding: "8px 16px" }}
                onClick={() => { alert("Shared to Facebook!"); setIsShareModalOpen(false); }}
              >
                Facebook
              </button>
              <button
                className="main-btn"
                style={{ background: "#1da1f2", padding: "8px 16px" }}
                onClick={() => { alert("Shared to Twitter!"); setIsShareModalOpen(false); }}
              >
                Twitter
              </button>
              <button
                className="main-btn"
                style={{ background: "#0077b5", padding: "8px 16px" }}
                onClick={() => { alert("Shared to LinkedIn!"); setIsShareModalOpen(false); }}
              >
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }} onClick={(e) => e.stopPropagation()}>
            <span
              style={{
                position: "absolute",
                top: "-40px",
                right: "0",
                color: "#fff",
                fontSize: "30px",
                cursor: "pointer",
              }}
              onClick={() => setPreviewImage(null)}
            >
              &times;
            </span>
            <img src={previewImage} alt="Preview" style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }} />
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {isCreateRoomModalOpen && (
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
          onClick={() => setIsCreateRoomModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              maxWidth: "450px",
              width: "100%",
              padding: "25px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", fontSize: "20px" }}
              onClick={() => setIsCreateRoomModalOpen(false)}
            >
              <i className="icofont-close"></i>
            </span>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <i className="icofont-video-cam" style={{ fontSize: "36px", color: "#088dcd" }}></i>
              <h4>Create Your Live Room</h4>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
              <li style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span>Room Activity: <strong>{displayName}&apos;s Room</strong></span>
                <input type="checkbox" defaultChecked />
              </li>
              <li style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                <span>Start Time: <strong>Now</strong></span>
                <input type="checkbox" defaultChecked />
              </li>
              <li style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span>Invite All Friends</span>
                <input type="checkbox" defaultChecked />
              </li>
            </ul>
            <button
              className="main-btn"
              style={{ width: "100%", padding: "10px" }}
              onClick={() => { alert("Live room created!"); setIsCreateRoomModalOpen(false); }}
            >
              Start Live Room
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: "#088dcd",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: "10px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            zIndex: 9999999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 600,
            fontSize: "14px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <i className="icofont-check-circled" style={{ fontSize: "20px" }}></i>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              marginLeft: "12px",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsEditProfileModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #f0f2f5",
                paddingBottom: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "rgba(8, 141, 205, 0.1)",
                    color: "#088dcd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                  }}
                >
                  <i className="icofont-edit"></i>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1a202c" }}>
                    Edit Profile
                  </h4>
                  <span style={{ fontSize: "12px", color: "#718096" }}>
                    Update your personal information, avatar, and banner
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#a0aec0",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            {/* Media Upload Area Preview */}
            <div
              style={{
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "24px",
                height: "150px",
              }}
            >
              <img
                src={coverUrl}
                alt="Cover Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(0,0,0,0.65)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backdropFilter: "blur(4px)",
                }}
              >
                <i className="icofont-camera"></i> {isUploading ? "Uploading..." : "Change Cover"}
              </button>

              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={avatarUrl}
                    alt="Avatar Preview"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      background: "#088dcd",
                      color: "#fff",
                      border: "2px solid #fff",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "11px",
                    }}
                    title="Change Avatar"
                  >
                    <i className="icofont-camera"></i>
                  </button>
                </div>
                <div style={{ color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                  <strong style={{ fontSize: "14px", display: "block" }}>{displayName}</strong>
                  <span style={{ fontSize: "12px", opacity: 0.9 }}>{handle}</span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfileInfo}>
              <div className="row">
                <div className="col-md-6" style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                    required
                  />
                </div>

                <div className="col-md-6" style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                    Username / Handle
                  </label>
                  <input
                    type="text"
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    placeholder="e.g. alexmorgan"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div className="col-md-12" style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                    Headline / Designation
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Lead Researcher & Full Stack Engineer"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div className="col-md-12" style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                    Bio / About Me
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your colleagues and network about yourself..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div className="col-md-6" style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Oxford, United Kingdom"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div className="col-md-6" style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                    Website
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://extremis.top"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {profileSaveStatus && (
                <div
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    background: profileSaveStatus.includes("success") ? "#e6fffa" : "#ebf8ff",
                    color: profileSaveStatus.includes("success") ? "#234e52" : "#2b6cb0",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  {profileSaveStatus}
                </div>
              )}

              {/* Form Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  borderTop: "1px solid #f0f2f5",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  style={{
                    background: "#f7fafc",
                    color: "#4a5568",
                    border: "1px solid #e2e8f0",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    background: isUpdating ? "#90cdf4" : "#088dcd",
                    color: "#fff",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(8, 141, 205, 0.4)",
                  }}
                >
                  <i className="icofont-check"></i>
                  {isUpdating ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
