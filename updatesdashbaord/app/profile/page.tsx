"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  // Mobile & Sidebar States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"posts" | "pictures" | "videos" | "friends" | "about">("posts");
  const [picturesFilter, setPicturesFilter] = useState("all");
  const [videosFilter, setVideosFilter] = useState("all");
  const [friendsFilter, setFriendsFilter] = useState("all");

  // Popups & Drawers
  const [isSideSlideOpen, setIsSideSlideOpen] = useState(false);
  const [sideSlideTab, setSideSlideTab] = useState<"messages" | "notifications">("messages");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState<"all" | "active" | "groups">("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Post Reactions & Comments States
  const [postLikes, setPostLikes] = useState<Record<number, number>>({
    1: 1200,
    2: 1200,
    3: 1200,
    4: 1200,
    5: 1200,
    6: 1200,
    7: 1200,
  });
  const [activeReaction, setActiveReaction] = useState<Record<number, string>>({});
  const [activeComments, setActiveComments] = useState<Record<number, boolean>>({
    2: true, // open by default in template
    5: true,
  });
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [postCommentsList, setPostCommentsList] = useState<
    Record<number, Array<{ name: string; avatar: string; time: string; text: string }>>
  >({
    1: [
      {
        name: "Jack Carter",
        avatar: "/images/resources/user1.jpg",
        time: "2 hours ago",
        text: "I think that somehow, we learn who we really are and then live with that decision, great post!",
      },
      {
        name: "Ching xang",
        avatar: "/images/resources/user2.jpg",
        time: "2 hours ago",
        text: "I think that somehow, we learn who we really are and then live with that decision, great post!",
      },
    ],
    2: [
      {
        name: "Jack Carter",
        avatar: "/images/resources/user1.jpg",
        time: "2 hours ago",
        text: "I think that somehow, we learn who we really are and then live with that decision, great post!",
      },
      {
        name: "Ching xang",
        avatar: "/images/resources/user2.jpg",
        time: "2 hours ago",
        text: "I think that somehow, we learn who we really are and then live with that decision, great post!",
      },
    ],
  });

  // Follow State
  const [isFollowingGeorg, setIsFollowingGeorg] = useState(false);
  const [followedPeople, setFollowedPeople] = useState<Record<string, boolean>>({});

  const toggleFollowPerson = (name: string) => {
    setFollowedPeople((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLike = (postId: number, emoji: string = "like") => {
    setActiveReaction((prev) => ({ ...prev, [postId]: emoji }));
    setPostLikes((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
  };

  const toggleCommentSection = (postId: number) => {
    setActiveComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId: number, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const newComment = {
      name: "Georg Peeter",
      avatar: "/images/resources/user.jpg",
      time: "Just now",
      text,
    };
    setPostCommentsList((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="theme-layout">
      {/* Responsive Header */}
      <div className="responsive-header">
        <div className="logo res">
          <img src="/images/logo.png" alt="Socimo" />
          <span>Socimo</span>
        </div>
        <div className="user-avatar mobile">
          <Link href="/profile" title="View Profile">
            <img alt="" src="/images/resources/user.jpg" />
          </Link>
          <div className="name">
            <h4>Danial Cardos</h4>
            <span>Ontario, Canada</span>
          </div>
        </div>
        <div className="right-compact">
          <div className="sidemenu" onClick={() => setIsSideMenuOpen(!isSideMenuOpen)} style={{ cursor: "pointer" }}>
            <i>
              <svg
                id="side-menu2"
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </i>
          </div>
          <div className="res-search" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ cursor: "pointer" }}>
            <span>
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
            </span>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="restop-search" style={{ display: "block" }}>
            <span className="hide-search" onClick={() => setIsMobileMenuOpen(false)} style={{ cursor: "pointer" }}>
              <i className="icofont-close-circled"></i>
            </span>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Search..." />
            </form>
          </div>
        )}
      </div>

      {/* Main Top Header */}
      <header className="">
        <div className="topbar stick">
          <div className="logo">
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <img src="/images/logo.png" alt="Socimo" />
              <span>Socimo</span>
            </Link>
          </div>
          <div className="searches">
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Search..." />
              <button type="submit">
                <i className="icofont-search"></i>
              </button>
            </form>
          </div>
          <ul className="web-elements">
            <li>
              <div className="user-dp">
                <Link href="/profile" title="">
                  <img alt="" src="/images/resources/user.jpg" />
                  <div className="name">
                    <h4>Danial Cardos</h4>
                  </div>
                </Link>
              </div>
            </li>
            <li className="go-live">
              <a href="#" title="Go Live" onClick={(e) => e.preventDefault()}>
                <i>
                  <svg fill="#f00" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18px" height="18px">
                    <path d="M 6.1015625 6.1015625 C 3.5675625 8.6345625 2 12.134 2 16 C 2 19.866 3.5675625 23.365437 6.1015625 25.898438 L 7.5195312 24.480469 C 5.3465312 22.307469 4 19.308 4 16 C 4 12.692 5.3465312 9.6925313 7.5195312 7.5195312 L 6.1015625 6.1015625 z M 25.898438 6.1015625 L 24.480469 7.5195312 C 26.653469 9.6925312 28 12.692 28 16 C 28 19.308 26.653469 22.307469 24.480469 24.480469 L 25.898438 25.898438 C 28.432437 23.365437 30 19.866 30 16 C 30 12.134 28.432437 8.6345625 25.898438 6.1015625 z M 9.6367188 9.6367188 C 8.0077188 11.265719 7 13.515 7 16 C 7 18.485 8.0077187 20.734281 9.6367188 22.363281 L 11.052734 20.947266 C 9.7847344 19.680266 9 17.93 9 16 C 9 14.07 9.7847344 12.319734 11.052734 11.052734 L 9.6367188 9.6367188 z M 22.363281 9.6367188 L 20.947266 11.052734 C 22.215266 12.319734 23 14.07 23 16 C 23 17.93 22.215266 19.680266 20.947266 20.947266 L 22.363281 22.363281 C 23.992281 20.734281 25 18.485 25 16 C 25 13.515 23.992281 11.265719 22.363281 9.6367188 z M 16 12 A 4 4 0 0 0 16 20 A 4 4 0 0 0 16 12 z" />
                  </svg>
                </i>
              </a>
            </li>
            <li>
              <Link href="/" title="Home">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </i>
              </Link>
            </li>
            <li>
              <a
                className="mesg-notif"
                href="#"
                title="Messages"
                onClick={(e) => {
                  e.preventDefault();
                  setSideSlideTab("messages");
                  setIsSideSlideOpen(true);
                }}
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-message-square"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </i>
              </a>
              <span></span>
            </li>
            <li>
              <a
                className="mesg-notif"
                href="#"
                title="Notifications"
                onClick={(e) => {
                  e.preventDefault();
                  setSideSlideTab("notifications");
                  setIsSideSlideOpen(true);
                }}
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-bell"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </i>
              </a>
              <span></span>
            </li>
            <li>
              <a
                className="create"
                href="#"
                title="Add New"
                onClick={(e) => {
                  e.preventDefault();
                  setIsNewPostModalOpen(true);
                }}
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-plus"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </i>
              </a>
            </li>
            <li style={{ position: "relative" }}>
              <a
                href="#"
                title=""
                onClick={(e) => {
                  e.preventDefault();
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                }}
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-grid"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </i>
              </a>
              {isUserDropdownOpen && (
                <ul className="dropdown" style={{ display: "block" }}>
                  <li>
                    <Link href="/profile">
                      <i className="icofont-user-alt-3"></i> Your Profile
                    </Link>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsInviteModalOpen(true); }}>
                      <i className="icofont-brand-slideshare"></i> Invite Colleague
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsSendMessageModalOpen(true); }}>
                      <i className="icofont-envelope"></i> Send Message
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsAskQuestionModalOpen(true); }}>
                      <i className="icofont-question-circle"></i> Ask Question
                    </a>
                  </li>
                  <li>
                    <a className="dark-mod" href="#" onClick={(e) => e.preventDefault()}>
                      <i className="icofont-moon"></i> Dark Mode
                    </a>
                  </li>
                  <li className="logout">
                    <Link href="/login">
                      <i className="icofont-power"></i> Logout
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </header>

      {/* Sidebar Slide Navigation */}
      <nav className={`sidebar ${isSideMenuOpen ? "active" : ""}`}>
        <ul className="menu-slide">
          <li>
            <Link href="/" title="">
              <i>
                <svg
                  id="icon-home"
                  className="feather feather-home"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="14"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </i>{" "}
              Dashboard
            </Link>
          </li>
          <li className="active">
            <Link href="/profile" title="">
              <i>
                <svg
                  id="ab1"
                  className="feather feather-users"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="14"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle r="4" cy="7" cx="9" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </i>
              Profile
            </Link>
          </li>
          <li>
            <Link href="/videos" title="">
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
              </i>
              Videos
            </Link>
          </li>
          <li>
            <Link href="/courses" title="">
              <i>
                <svg
                  id="ab4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-airplay"
                >
                  <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                  <polygon points="12 15 17 21 7 21 12 15" />
                </svg>
              </i>
              Courses
            </Link>
          </li>
          <li>
            <Link href="/books" title="">
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-book"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </i>
              Books
            </Link>
          </li>
          <li>
            <Link href="/blog" title="">
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-coffee"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </i>
              Blog
            </Link>
          </li>
          <li>
            <Link href="/groups" title="">
              <i>
                <svg
                  className="feather feather-users"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height="14"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle r="4" cy="7" cx="9" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </i>
              Groups
            </Link>
          </li>
        </ul>
      </nav>

      {/* Carousel Shortcuts Bar */}
      <section>
        <div className="white-bg">
          <div className="container-fluid">
            <div className="menu-caro">
              <div className="row align-items-center">
                <div className="col-lg-2 col-md-2 col-2">
                  <div
                    className="sidemenu"
                    onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                    style={{ cursor: "pointer" }}
                  >
                    <i>
                      <svg
                        id="side-menu"
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-menu"
                      >
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="col-lg-8 col-md-8 col-7">
                  <div
                    className="page-caro"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "nowrap",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {[
                      {
                        name: "Newsfeed",
                        href: "/",
                        active: false,
                        icon: (
                          <svg className="feather feather-zap" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="24" width="24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        ),
                      },
                      {
                        name: "Videos",
                        href: "/videos",
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                        ),
                      },
                      {
                        name: "Courses",
                        href: "/courses",
                        active: false,
                        icon: (
                          <svg className="feather feather-airplay" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="24" width="24"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" /><polygon points="12 15 17 21 7 21 12 15" /></svg>
                        ),
                      },
                      {
                        name: "Books",
                        href: "/books",
                        active: false,
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                        ),
                      },
                      {
                        name: "Blog",
                        href: "/blog",
                        active: false,
                        icon: (
                          <svg className="feather feather-layout" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="24" width="24"><rect ry="2" rx="2" height="18" width="18" y="3" x="3" /><line y2="9" x2="21" y1="9" x1="3" /><line y2="9" x2="9" y1="21" x1="9" /></svg>
                        ),
                      },
                      {
                        name: "Groups",
                        href: "/groups",
                        active: false,
                        icon: (
                          <svg className="feather feather-users" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="24" width="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle r="4" cy="7" cx="9" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        ),
                      },
                    ].map((item, idx) => (
                      <div className="link-item" key={idx} style={{ flex: "1 1 0px", textAlign: "center" }}>
                        <Link className={item.active ? "active" : ""} href={item.href} title={item.name}>
                          <i>{item.icon}</i>
                          <p>{item.name}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-lg-2 col-md-2 col-3">
                  <div className="user-inf">
                    <div className="folowerz">Followers: 2.2K</div>
                    <ul className="stars">
                      <li><i className="icofont-star"></i></li>
                      <li><i className="icofont-star"></i></li>
                      <li><i className="icofont-star"></i></li>
                      <li><i className="icofont-star"></i></li>
                      <li><i className="icofont-star"></i></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile & Feeds Section */}
      <section>
        <div className="gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  {/* Left Sidebar */}
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
                              <img alt="" src="/images/resources/sponsor.jpg" />
                            </figure>
                            <div className="sponsor-meta">
                              <h5>
                                <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                  IQ Options Broker
                                </a>
                              </h5>
                              <a target="_blank" title="" href="#">
                                www.iqvie.com
                              </a>
                            </div>
                          </li>
                          <li>
                            <figure>
                              <img alt="" src="/images/resources/sponsor2.jpg" />
                            </figure>
                            <div className="sponsor-meta">
                              <h5>
                                <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                  BM Fashion Designer
                                </a>
                              </h5>
                              <a target="_blank" title="" href="#">
                                www.abcd.com
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Your Groups */}
                      <div className="widget">
                        <h4 className="widget-title">Your Groups</h4>
                        <ul className="ak-groups">
                          <li>
                            <figure>
                              <img alt="" src="/images/resources/your-group1.jpg" />
                            </figure>
                            <div className="your-grp">
                              <h5>
                                <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                  Good Group
                                </a>
                              </h5>
                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                <i className="icofont-bell-alt"></i> Notifications <span>13</span>
                              </a>
                              <a className="promote" title="" href="#" onClick={(e) => e.preventDefault()}>
                                view feed
                              </a>
                            </div>
                          </li>
                          <li>
                            <figure>
                              <img alt="" src="/images/resources/your-group2.jpg" />
                            </figure>
                            <div className="your-grp">
                              <h5>
                                <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                  E-course Group
                                </a>
                              </h5>
                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                <i className="icofont-bell-alt"></i> Notifications <span>13</span>
                              </a>
                              <a className="promote" title="" href="#" onClick={(e) => e.preventDefault()}>
                                view feed
                              </a>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Suggested Group */}
                      <div className="widget">
                        <h4 className="widget-title">Suggested Group</h4>
                        <div className="sug-caro">
                          <div className="friend-box" style={{ marginBottom: "15px" }}>
                            <figure>
                              <img alt="" src="/images/resources/sidebar-info.jpg" />
                              <span>Members: 505K</span>
                            </figure>
                            <div className="frnd-meta">
                              <img alt="" src="/images/resources/frnd-figure2.jpg" />
                              <div className="frnd-name">
                                <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                  Social Research
                                </a>
                                <span>@biolabest</span>
                              </div>
                              <a className="main-btn2" href="#" title="" onClick={(e) => e.preventDefault()}>
                                Join Community
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ask Question */}
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
                              setIsAskQuestionModalOpen(true);
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
                              BZ University good night event in columbia
                            </a>
                          </h6>
                          <img alt="" src="/images/clock.png" />
                        </div>
                        <div className="rec-events bg-blue">
                          <i className="icofont-microphone"></i>
                          <h6>
                            <a title="" href="#" onClick={(e) => e.preventDefault()}>
                              The 3rd International Conference 2024
                            </a>
                          </h6>
                          <img alt="" src="/images/clock.png" />
                        </div>
                      </div>

                      {/* Group Terms */}
                      <div className="widget">
                        <h4 className="widget-title">Group Terms</h4>
                        <div className="grop-rules">
                          <p>
                            Hi! To ensure that this is a great place for everyone to have a wonderful time, we have some rules. Breaking them will result in a ban from the group.
                          </p>
                          <ol>
                            <li><i className="icofont-dotted-right"></i> Be positive! Respect and help others</li>
                            <li><i className="icofont-dotted-right"></i> No insults or bad language</li>
                            <li><i className="icofont-dotted-right"></i> No self promotions</li>
                            <li><i className="icofont-dotted-right"></i> Avoid political discussions</li>
                            <li><i className="icofont-dotted-right"></i> No comment spamming</li>
                          </ol>
                        </div>
                      </div>

                      {/* Featured Universities */}
                      <div className="widget stick-widget">
                        <h4 className="widget-title">
                          Featured Universities{" "}
                          <a className="see-all" href="#" title="" onClick={(e) => e.preventDefault()}>
                            See All
                          </a>
                        </h4>
                        <ul className="featured-comp">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <li key={n}>
                              <a href="#" title="" onClick={(e) => e.preventDefault()}>
                                <img src={`/images/resources/company${n}.png`} alt="" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </aside>
                  </div>

                  {/* Center Main Feed Column */}
                  <div className="col-lg-9">
                    <div className="group-feed">
                      {/* Group/Profile Avatar & Banner */}
                      <div className="group-avatar">
                        <img src="/images/resources/profile-banner.jpg" alt="" />
                        <a
                          href="#"
                          title=""
                          onClick={(e) => {
                            e.preventDefault();
                            setIsFollowingGeorg(!isFollowingGeorg);
                          }}
                          style={{
                            background: isFollowingGeorg ? "#38a169" : "#088dcd",
                            color: "#fff",
                          }}
                        >
                          <i className="icofont-check-circled"></i>
                          {isFollowingGeorg ? " Following" : " Follow"}
                        </a>
                        <figure className="group-dp">
                          <img src="/images/resources/user.jpg" alt="" />
                        </figure>
                      </div>

                      {/* Profile Details & Tabs */}
                      <div className="grp-info about">
                        <h4>
                          Georg Peeter <span>@Georgofficial</span>
                        </h4>
                        <ul className="joined-info">
                          <li><span>Joined:</span> April 2020</li>
                          <li><span>Follow:</span> 55K</li>
                          <li><span>Followers:</span> {isFollowingGeorg ? "2.2K + 1" : "2.2K"}</li>
                          <li><span>Posts:</span> 932</li>
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
                        <ul className="more-grp-info">
                          <li>
                            <form className="c-form" onSubmit={(e) => e.preventDefault()}>
                              <input type="text" placeholder="Search..." />
                              <i className="icofont-search-1"></i>
                            </form>
                          </li>
                          <li>
                            <div className="more">
                              <div className="more-post-optns">
                                <i>
                                  <svg
                                    className="feather feather-more-horizontal"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    height="24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle r="1" cy="12" cx="12" />
                                    <circle r="1" cy="12" cx="19" />
                                    <circle r="1" cy="12" cx="5" />
                                  </svg>
                                </i>
                                <ul>
                                  <li><i className="icofont-pen-alt-1"></i>Edit Profile</li>
                                  <li><i className="icofont-ban"></i>Hide Activity</li>
                                  <li><i className="icofont-flag"></i>Report Account</li>
                                </ul>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* About Me Banner */}
                      <div className="main-wraper">
                        <div className="grp-about">
                          <div className="row">
                            <div className="col-lg-8 col-md-6">
                              <h4>About Me!</h4>
                              <p>
                                Hi! My name is Georg Peeter but some people may know me as peeter! I stream, research, and review emerging technologies and academic publications.
                              </p>
                              <ul className="badges">
                                {[2, 3, 4, 5, 7, 8].map((b) => (
                                  <li key={b}>
                                    <img src={`/images/badges/badge${b}.png`} alt="" />
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="share-article">
                                <span>Share Profile</span>
                                <a href="#" title="" className="facebook" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-facebook"></i></a>
                                <a href="#" title="" className="pinterest" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-pinterest"></i></a>
                                <a href="#" title="" className="instagram" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-instagram"></i></a>
                                <a href="#" title="" className="twitter" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-twitter"></i></a>
                                <a href="#" title="" className="google" onClick={(e) => { e.preventDefault(); setIsShareModalOpen(true); }}><i className="icofont-google-plus"></i></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tab Content Display */}
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="tab-content">
                            {/* POSTS TAB */}
                            {activeTab === "posts" && (
                              <div className="tab-pane active fade show" id="posts">
                                <div className="row merged20">
                                  <div className="col-lg-8">
                                    {/* Create New Post Widget */}
                                    <div className="main-wraper">
                                      <span className="new-title">Create New Post</span>
                                      <div className="new-post">
                                        <form onSubmit={(e) => { e.preventDefault(); setIsNewPostModalOpen(true); }}>
                                          <i className="icofont-pen-alt-1"></i>
                                          <input
                                            type="text"
                                            placeholder="Create New Post"
                                            onClick={() => setIsNewPostModalOpen(true)}
                                          />
                                        </form>
                                        <ul className="upload-media">
                                          <li>
                                            <a href="#" title="" onClick={(e) => { e.preventDefault(); setIsNewPostModalOpen(true); }}>
                                              <i><img src="/images/image.png" alt="" /></i>
                                              <span>Photo/Video</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" title="" onClick={(e) => { e.preventDefault(); setIsNewPostModalOpen(true); }}>
                                              <i><img src="/images/activity.png" alt="" /></i>
                                              <span>Feeling/Activity</span>
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

                                    {/* Post 1: Share Post without image */}
                                    <div className="main-wraper">
                                      <div className="user-post">
                                        <div className="friend-info">
                                          <figure>
                                            <img alt="" src="/images/resources/user4.jpg" />
                                          </figure>
                                          <div className="friend-name">
                                            <ins>
                                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                Jack Carter
                                              </a>{" "}
                                              Shared Post
                                            </ins>
                                            <span>
                                              <i className="icofont-globe"></i> published: Sep, 15 2024
                                            </span>
                                          </div>
                                          <div className="post-meta">
                                            <a href="#" className="post-title" onClick={(e) => e.preventDefault()}>
                                              Supervision as a Personnel Development Device
                                            </a>
                                            <p>
                                              Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.
                                            </p>
                                            <div className="we-video-info">
                                              <ul>
                                                <li>
                                                  <span title="views" className="views">
                                                    <i>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                    </i>
                                                    <ins>1.2k</ins>
                                                  </span>
                                                </li>
                                                <li>
                                                  <span
                                                    title="Comments"
                                                    className="Recommend"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleCommentSection(1)}
                                                  >
                                                    <i>
                                                      <svg className="feather feather-message-square" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                    </i>
                                                    <ins>{postCommentsList[1]?.length || 54}</ins>
                                                  </span>
                                                </li>
                                                <li>
                                                  <span title="follow" className="Follow">
                                                    <i>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                    </i>
                                                    <ins>5k</ins>
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
                                                    <ins>205</ins>
                                                  </span>
                                                </li>
                                              </ul>
                                              <a href="#" title="" className="reply" onClick={(e) => { e.preventDefault(); toggleCommentSection(1); }}>
                                                Reply <i className="icofont-reply"></i>
                                              </a>
                                            </div>
                                            <div className="stat-tools">
                                              <div className="box">
                                                <div className="Like">
                                                  <a
                                                    className="Like__link"
                                                    onClick={() => handleLike(1, "like")}
                                                    style={{ cursor: "pointer", color: activeReaction[1] ? "#088dcd" : "inherit" }}
                                                  >
                                                    <i className="icofont-like"></i> {activeReaction[1] ? activeReaction[1].toUpperCase() : "Like"}
                                                  </a>
                                                  <div className="Emojis">
                                                    <div className="Emoji Emoji--like" onClick={() => handleLike(1, "like")}>
                                                      <div className="icon icon--like"></div>
                                                    </div>
                                                    <div className="Emoji Emoji--love" onClick={() => handleLike(1, "love")}>
                                                      <div className="icon icon--heart"></div>
                                                    </div>
                                                    <div className="Emoji Emoji--haha" onClick={() => handleLike(1, "haha")}>
                                                      <div className="icon icon--haha"></div>
                                                    </div>
                                                    <div className="Emoji Emoji--wow" onClick={() => handleLike(1, "wow")}>
                                                      <div className="icon icon--wow"></div>
                                                    </div>
                                                    <div className="Emoji Emoji--sad" onClick={() => handleLike(1, "sad")}>
                                                      <div className="icon icon--sad"></div>
                                                    </div>
                                                    <div className="Emoji Emoji--angry" onClick={() => handleLike(1, "angry")}>
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
                                                  toggleCommentSection(1);
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
                                                <div className="popover_wrapper">
                                                  <a className="popover_title" href="#" onClick={(e) => e.preventDefault()}>
                                                    <img alt="" src="/images/smiles/thumb.png" />
                                                  </a>
                                                </div>
                                                <div className="popover_wrapper">
                                                  <a className="popover_title" href="#" onClick={(e) => e.preventDefault()}>
                                                    <img alt="" src="/images/smiles/heart.png" />
                                                  </a>
                                                </div>
                                                <div className="popover_wrapper">
                                                  <a className="popover_title" href="#" onClick={(e) => e.preventDefault()}>
                                                    <img alt="" src="/images/smiles/smile.png" />
                                                  </a>
                                                </div>
                                                <p>{postLikes[1]}+</p>
                                              </div>

                                              {/* Comments section */}
                                              {activeComments[1] && (
                                                <div className="new-comment" style={{ display: "block" }}>
                                                  <form onSubmit={(e) => handleAddComment(1, e)}>
                                                    <input
                                                      type="text"
                                                      placeholder="Write comment..."
                                                      value={commentInputs[1] || ""}
                                                      onChange={(e) =>
                                                        setCommentInputs({ ...commentInputs, 1: e.target.value })
                                                      }
                                                    />
                                                    <button type="submit">
                                                      <i className="icofont-paper-plane"></i>
                                                    </button>
                                                  </form>
                                                  <div className="comments-area">
                                                    <ul>
                                                      {(postCommentsList[1] || []).map((c, idx) => (
                                                        <li key={idx}>
                                                          <figure>
                                                            <img alt="" src={c.avatar} />
                                                          </figure>
                                                          <div className="commenter">
                                                            <h5>
                                                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                                {c.name}
                                                              </a>
                                                            </h5>
                                                            <span>{c.time}</span>
                                                            <p>{c.text}</p>
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

                                    {/* Post 2: Sell Book card */}
                                    <div className="main-wraper">
                                      <div className="user-post">
                                        <div className="friend-info">
                                          <figure>
                                            <img alt="" src="/images/resources/user4.jpg" />
                                          </figure>
                                          <div className="friend-name">
                                            <ins>
                                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                Georg Peeter
                                              </a>{" "}
                                              Premium Product
                                            </ins>
                                            <span>
                                              <i className="icofont-globe"></i> published: Sep, 15 2024
                                            </span>
                                          </div>
                                          <div className="post-meta">
                                            <figure className="premium-post">
                                              <img src="/images/resources/book5.jpg" alt="" />
                                            </figure>
                                            <div className="premium">
                                              <a href="#" className="post-title" onClick={(e) => e.preventDefault()}>
                                                Technical Words 2024 Book World
                                              </a>
                                              <p>
                                                Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero.
                                              </p>
                                              <a
                                                className="main-btn purchase-btn"
                                                title=""
                                                href="#"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  alert("Book added to cart!");
                                                }}
                                              >
                                                <i className="icofont-cart-alt"></i> Buy Now ($29.99)
                                              </a>
                                            </div>
                                            <div className="we-video-info">
                                              <ul>
                                                <li>
                                                  <span title="views" className="views">
                                                    <i>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                    </i>
                                                    <ins>1.2k</ins>
                                                  </span>
                                                </li>
                                                <li>
                                                  <span
                                                    title="Comments"
                                                    className="Recommend"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => toggleCommentSection(2)}
                                                  >
                                                    <i>
                                                      <svg className="feather feather-message-square" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                    </i>
                                                    <ins>{postCommentsList[2]?.length || 54}</ins>
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
                                                    <ins>205</ins>
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                            <div className="stat-tools">
                                              <div className="box">
                                                <div className="Like">
                                                  <a
                                                    className="Like__link"
                                                    onClick={() => handleLike(2, "like")}
                                                    style={{ cursor: "pointer" }}
                                                  >
                                                    <i className="icofont-like"></i> Like
                                                  </a>
                                                </div>
                                              </div>
                                              <a
                                                title=""
                                                href="#"
                                                className="comment-to"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  toggleCommentSection(2);
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

                                              {/* Comments section */}
                                              {activeComments[2] && (
                                                <div className="new-comment" style={{ display: "block" }}>
                                                  <form onSubmit={(e) => handleAddComment(2, e)}>
                                                    <input
                                                      type="text"
                                                      placeholder="Write comment..."
                                                      value={commentInputs[2] || ""}
                                                      onChange={(e) =>
                                                        setCommentInputs({ ...commentInputs, 2: e.target.value })
                                                      }
                                                    />
                                                    <button type="submit">
                                                      <i className="icofont-paper-plane"></i>
                                                    </button>
                                                  </form>
                                                  <div className="comments-area">
                                                    <ul>
                                                      {(postCommentsList[2] || []).map((c, idx) => (
                                                        <li key={idx}>
                                                          <figure>
                                                            <img alt="" src={c.avatar} />
                                                          </figure>
                                                          <div className="commenter">
                                                            <h5>
                                                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                                {c.name}
                                                              </a>
                                                            </h5>
                                                            <span>{c.time}</span>
                                                            <p>{c.text}</p>
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

                                    {/* Post 3: Image with Album */}
                                    <div className="main-wraper">
                                      <div className="user-post">
                                        <div className="friend-info">
                                          <figure>
                                            <img alt="" src="/images/resources/user4.jpg" />
                                          </figure>
                                          <div className="friend-name">
                                            <ins>
                                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                Georg Peeter
                                              </a>{" "}
                                              Added Image Album
                                            </ins>
                                            <span>
                                              <i className="icofont-globe"></i> published: Sep, 15 2024
                                            </span>
                                          </div>
                                          <div className="post-meta">
                                            <figure>
                                              <div className="img-bunch">
                                                <div className="row">
                                                  <div className="col-lg-6 col-md-6 col-sm-6">
                                                    <figure style={{ cursor: "pointer" }} onClick={() => setPreviewImage("/images/resources/album1.jpg")}>
                                                      <img src="/images/resources/album1.jpg" alt="" />
                                                    </figure>
                                                    <figure style={{ cursor: "pointer" }} onClick={() => setPreviewImage("/images/resources/album2.jpg")}>
                                                      <img src="/images/resources/album2.jpg" alt="" />
                                                    </figure>
                                                  </div>
                                                  <div className="col-lg-6 col-md-6 col-sm-6">
                                                    <figure style={{ cursor: "pointer" }} onClick={() => setPreviewImage("/images/resources/album6.jpg")}>
                                                      <img src="/images/resources/album6.jpg" alt="" />
                                                    </figure>
                                                    <figure style={{ cursor: "pointer" }} onClick={() => setPreviewImage("/images/resources/album5.jpg")}>
                                                      <img src="/images/resources/album5.jpg" alt="" />
                                                    </figure>
                                                    <figure
                                                      style={{ position: "relative", cursor: "pointer" }}
                                                      onClick={() => setPreviewImage("/images/resources/album4.jpg")}
                                                    >
                                                      <img src="/images/resources/album4.jpg" alt="" />
                                                      <div className="more-photos">
                                                        <span>+15</span>
                                                      </div>
                                                    </figure>
                                                  </div>
                                                </div>
                                              </div>
                                            </figure>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Post 4: Embedded Video */}
                                    <div className="main-wraper">
                                      <div className="user-post">
                                        <div className="friend-info">
                                          <figure>
                                            <img alt="" src="/images/resources/user4.jpg" />
                                          </figure>
                                          <div className="friend-name">
                                            <ins>
                                              <a title="" href="#" onClick={(e) => e.preventDefault()}>
                                                Georg Peeter
                                              </a>{" "}
                                              Shared Video
                                            </ins>
                                            <span>
                                              <i className="icofont-globe"></i> published: Sep, 15 2024
                                            </span>
                                          </div>
                                          <div className="post-meta">
                                            <iframe
                                              height="285"
                                              style={{ width: "100%", borderRadius: "8px", border: "none" }}
                                              src="https://www.youtube.com/embed/zdow47FQRfQ"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                            ></iframe>
                                            <p style={{ marginTop: "10px" }}>
                                              Cookie? Biscuit? Bikkie? They all mean the same thing! Our lovely English teachers will quickly show you pronunciation differences!
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right Sidebar Inside Feed */}
                                  <div className="col-lg-4">
                                    <aside className="sidebar static left">
                                      {/* Advertisment Box */}
                                      <div className="advertisment-box">
                                        <h4 className="">
                                          <i className="icofont-info-circle"></i> Advertisement
                                        </h4>
                                        <figure>
                                          <a href="#" title="Advertisement" onClick={(e) => e.preventDefault()}>
                                            <img src="/images/resources/ad-widget2.gif" alt="" />
                                          </a>
                                        </figure>
                                      </div>

                                      {/* Follow People */}
                                      <div className="widget">
                                        <h4 className="widget-title">
                                          Follow People{" "}
                                          <a title="" href="#" className="see-all" onClick={(e) => e.preventDefault()}>
                                            See All
                                          </a>
                                        </h4>
                                        <ul className="invitepage">
                                          {[
                                            { name: "Jack carter", img: "/images/resources/friend-avatar.jpg" },
                                            { name: "Emma watson", img: "/images/resources/friend-avatar2.jpg" },
                                            { name: "Andrew", img: "/images/resources/friend-avatar3.jpg" },
                                            { name: "Moona Singh", img: "/images/resources/friend-avatar4.jpg" },
                                            { name: "Harry pooter", img: "/images/resources/friend-avatar5.jpg" },
                                          ].map((person, i) => (
                                            <li key={i}>
                                              <figure>
                                                <img alt="" src={person.img} />
                                                <a href="#" onClick={(e) => e.preventDefault()}>
                                                  {person.name}
                                                </a>
                                              </figure>
                                              <button
                                                className="sug-like"
                                                onClick={() => toggleFollowPerson(person.name)}
                                                style={{
                                                  background: followedPeople[person.name] ? "#088dcd" : "transparent",
                                                  color: followedPeople[person.name] ? "#fff" : "inherit",
                                                }}
                                              >
                                                <i className="invit">
                                                  {followedPeople[person.name] ? "Following" : "Follow"}
                                                </i>
                                                <i className="icofont-check-alt"></i>
                                              </button>
                                            </li>
                                          ))}
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
                                            <span>Pool Party 2024</span>
                                          </figure>
                                          <figure style={{ cursor: "pointer" }} onClick={() => setPreviewImage("/images/resources/user-video10.jpg")}>
                                            <img src="/images/resources/user-video10.jpg" alt="" />
                                            <span className="play-btn">
                                              <i className="icofont-play"></i>
                                            </span>
                                            <span>Spring Break Pool</span>
                                          </figure>
                                        </div>
                                      </div>

                                      {/* You May Like Groups */}
                                      <div className="widget stick-widget">
                                        <h4 className="widget-title">You May Like Groups</h4>
                                        <ul className="suggestd">
                                          {[
                                            { name: "Physics Shop", img: "/images/resources/sug-page-1.jpg" },
                                            { name: "Sun Rise", img: "/images/resources/sug-page-2.jpg" },
                                            { name: "Big Botany", img: "/images/resources/sug-page-3.jpg" },
                                            { name: "King Work", img: "/images/resources/sug-page-4.jpg" },
                                            { name: "18teen Guys", img: "/images/resources/sug-page-5.jpg" },
                                          ].map((grp, i) => (
                                            <li key={i}>
                                              <a className="sug-pic" href="#" onClick={(e) => e.preventDefault()}>
                                                <img src={grp.img} alt="" />
                                              </a>
                                              <a className="sug-title" href="#" onClick={(e) => e.preventDefault()}>
                                                {grp.name}
                                              </a>
                                              <button className="sug-like" onClick={() => alert(`Joined ${grp.name}!`)}>
                                                <i className="icofont-like"></i>
                                                <i className="icofont-check-alt"></i>
                                              </button>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </aside>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* PICTURES TAB */}
                            {activeTab === "pictures" && (
                              <div className="tab-pane active fade show" id="pictures">
                                <h5 className="tab-title">
                                  Pictures <span>20</span>
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
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={n}>
                                      <div
                                        className="uzr-pictures"
                                        style={{ cursor: "pointer", marginBottom: "15px" }}
                                        onClick={() => setPreviewImage(`/images/resources/user-pic${n}.jpg`)}
                                      >
                                        <img alt="" src={`/images/resources/user-pic${n}.jpg`} />
                                        <ul className="hover-action">
                                          <li>
                                            <span style={{ color: "#fff" }}><i className="icofont-like"></i> {n * 3}</span>
                                          </li>
                                          <li>
                                            <span style={{ color: "#fff" }}><i className="icofont-chat"></i> {n * 2}</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* VIDEOS TAB */}
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
                                          style={{ cursor: "pointer" }}
                                          onClick={() => setPreviewImage(`/images/resources/user-video${n}.jpg`)}
                                        >
                                          <img alt="" src={`/images/resources/user-video${n}.jpg`} />
                                          <span className="play-btn">
                                            <i className="icofont-play"></i>
                                          </span>
                                        </figure>
                                        <span>Video Clip #{n}</span>
                                        <ul className="vid-action">
                                          <li>
                                            <a href="#" title="" onClick={(e) => e.preventDefault()}>
                                              <i className="icofont-like"></i> {n * 4}
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" title="" onClick={(e) => e.preventDefault()}>
                                              <i className="icofont-chat"></i> {n * 2}
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* FRIENDS TAB */}
                            {activeTab === "friends" && (
                              <div className="tab-pane active fade show" id="friends">
                                <h5 className="tab-title">
                                  Friends <span>102</span>
                                </h5>
                                <ul className="pix-filter">
                                  {["all", "family", "close", "mutual"].map((filter) => (
                                    <li key={filter}>
                                      <a
                                        className={friendsFilter === filter ? "active" : ""}
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setFriendsFilter(filter);
                                        }}
                                      >
                                        {filter === "all" ? "All Friends" : filter === "family" ? "Family Friends" : filter === "close" ? "Close Friends" : "Mutual Friends"}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                                <div className="row merged-10">
                                  {[
                                    { name: "Amy Watson", uni: "Bz University, Pakistan", img: "/images/resources/speak-10.jpg" },
                                    { name: "Muhammad Khan", uni: "Oxford University, UK", img: "/images/resources/speak-11.jpg" },
                                    { name: "Sadia Gill", uni: "WB University, USA", img: "/images/resources/speak-12.jpg" },
                                    { name: "Rajpal", uni: "Km University, India", img: "/images/resources/speak-4.jpg" },
                                    { name: "Amy Watson", uni: "Oxford University, UK", img: "/images/resources/speak-1.jpg" },
                                    { name: "Bob Frank", uni: "WB University, Canada", img: "/images/resources/speak-2.jpg" },
                                    { name: "Amy Watson", uni: "Bz University, Pakistan", img: "/images/resources/speak-5.jpg" },
                                    { name: "Muhammad Khan", uni: "Oxford University, UK", img: "/images/resources/speak-7.jpg" },
                                  ].map((fr, idx) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6" key={idx}>
                                      <div className="friendz" style={{ marginBottom: "15px" }}>
                                        <figure>
                                          <img src={fr.img} alt="" />
                                        </figure>
                                        <span>
                                          <a href="#" title="" onClick={(e) => e.preventDefault()}>
                                            {fr.name}
                                          </a>
                                        </span>
                                        <ins>{fr.uni}</ins>
                                        <a
                                          href="#"
                                          title=""
                                          onClick={(e) => {
                                            e.preventDefault();
                                            alert(`Unfollowed ${fr.name}`);
                                          }}
                                        >
                                          <i className="icofont-star"></i> Unfollow
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* ABOUT TAB */}
                            {activeTab === "about" && (
                              <div className="tab-pane active fade show" id="about">
                                <div className="row merged20">
                                  <div className="col-lg-8">
                                    <div className="main-wraper">
                                      <h5 className="main-title">Personal Information</h5>
                                      <div className="info-block-list">
                                        <ul>
                                          <li>Date of Birth: <span>Dec, 17 1990</span></li>
                                          <li>Location: <span>Los Angeles, California</span></li>
                                          <li>Web: <span>www.georgpeeter.com</span></li>
                                          <li>Email: <span>georg@socimo.io</span></li>
                                          <li>Occupation: <span>Lead Researcher &amp; Developer</span></li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="main-wraper">
                                      <h5 className="main-title">Interests &amp; Favorites</h5>
                                      <div className="info-block-list">
                                        <div className="info-block" style={{ marginBottom: "15px" }}>
                                          <h6>Favourite TV Shows</h6>
                                          <p>Breaking Good, RedDevil, People of Interest, The Running Dead, Game of Wars.</p>
                                        </div>
                                        <div className="info-block" style={{ marginBottom: "15px" }}>
                                          <h6>Favourite Music Bands / Artists</h6>
                                          <p>Iron Maid, DC/AC, Megablow, Kung Fighters, System of a Revenge.</p>
                                        </div>
                                        <div className="info-block" style={{ marginBottom: "15px" }}>
                                          <h6>Favourite Books</h6>
                                          <p>The Crime of the Century, Egyptian Mythology 101, Lord of the Wings, Amongst Gods.</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <aside className="sidebar">
                                      <div className="widget">
                                        <h4 className="widget-title">Complete Your Profile</h4>
                                        <span>Complete your profile by filling profile info fields, completing quests &amp; unlocking badges</span>
                                        <div
                                          style={{
                                            margin: "15px 0",
                                            padding: "10px",
                                            background: "#e6fffa",
                                            borderRadius: "8px",
                                            textAlign: "center",
                                            color: "#319795",
                                            fontWeight: "700",
                                            fontSize: "20px",
                                          }}
                                        >
                                          82% Completed
                                        </div>
                                        <ul className="prof-complete">
                                          <li><i className="icofont-plus-square"></i> Upload Your Picture <em>10%</em></li>
                                          <li><i className="icofont-plus-square"></i> Your University? <em>20%</em></li>
                                          <li><i className="icofont-plus-square"></i> Invite 10+ members <em>20%</em></li>
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
      <div className="cart-product" style={{ cursor: "pointer" }} onClick={() => alert("Cart: 3 items ($99.97)")}>
        <a href="#" onClick={(e) => e.preventDefault()} title="View Cart">
          <i className="icofont-cart-alt"></i>
        </a>
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
                { name: "Oliver", img: "/images/resources/user1.jpg", status: "online" },
                { name: "Amelia", img: "/images/resources/user2.jpg", status: "away" },
                { name: "George", img: "/images/resources/user3.jpg", status: "offline" },
                { name: "Jacob", img: "/images/resources/user4.jpg", status: "online" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", cursor: "pointer" }}>
                  <img src={f.img} alt="" style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
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

      {/* Invite Colleagues Modal */}
      {isInviteModalOpen && (
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
          onClick={() => setIsInviteModalOpen(false)}
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
              onClick={() => setIsInviteModalOpen(false)}
            >
              <i className="icofont-close"></i>
            </span>
            <div className="popup-head" style={{ marginBottom: "15px" }}>
              <h5>
                <i className="icofont-brand-slideshare" style={{ color: "#088dcd", marginRight: "8px" }}></i> Invite Colleagues
              </h5>
            </div>
            <p style={{ fontSize: "13px", color: "#666" }}>
              Enter an email address to invite a colleague or co-author to join you on Socimo.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Invitation sent!");
                setIsInviteModalOpen(false);
              }}
              className="c-form"
            >
              <input
                type="email"
                placeholder="Enter Email Address"
                style={{ width: "100%", padding: "10px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "12px" }}
                required
              />
              <button type="submit" className="main-btn" style={{ width: "100%", padding: "10px", borderRadius: "5px" }}>
                Invite
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {isSendMessageModalOpen && (
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
          onClick={() => setIsSendMessageModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "100%",
              padding: "30px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", fontSize: "20px" }}
              onClick={() => setIsSendMessageModalOpen(false)}
            >
              <i className="icofont-close"></i>
            </span>
            <div className="popup-head" style={{ marginBottom: "20px" }}>
              <h5>
                <i className="icofont-envelope" style={{ color: "#088dcd", marginRight: "8px" }}></i> Send Message
              </h5>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent!");
                setIsSendMessageModalOpen(false);
              }}
              className="c-form"
            >
              <input
                type="text"
                placeholder="Enter Name..."
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "12px" }}
                required
              />
              <input
                type="text"
                placeholder="Subject"
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "12px" }}
                required
              />
              <textarea
                placeholder="Write Message"
                rows={4}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "12px" }}
                required
              ></textarea>
              <button type="submit" className="main-btn" style={{ width: "100%", padding: "10px", borderRadius: "5px" }}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create New Post Modal */}
      {isNewPostModalOpen && (
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
          onClick={() => setIsNewPostModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "100%",
              padding: "25px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", fontSize: "20px" }}
              onClick={() => setIsNewPostModalOpen(false)}
            >
              <i className="icofont-close"></i>
            </span>
            <h5>Create New Post</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Post published successfully!");
                setIsNewPostModalOpen(false);
              }}
              style={{ marginTop: "15px" }}
            >
              <textarea
                placeholder="What's On Your Mind?"
                rows={4}
                style={{ width: "100%", padding: "10px", border: "1px solid #dfdfdf", borderRadius: "6px", marginBottom: "12px" }}
                required
              ></textarea>
              <button type="submit" className="main-btn" style={{ width: "100%", padding: "10px", borderRadius: "5px" }}>
                Publish Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {isAskQuestionModalOpen && (
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
          onClick={() => setIsAskQuestionModalOpen(false)}
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
              onClick={() => setIsAskQuestionModalOpen(false)}
            >
              <i className="icofont-close"></i>
            </span>
            <h5>Ask Research Question</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Question posted to research community!");
                setIsAskQuestionModalOpen(false);
              }}
              style={{ marginTop: "15px" }}
            >
              <input
                type="text"
                placeholder="Question Title"
                style={{ width: "100%", padding: "10px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "10px" }}
                required
              />
              <textarea
                placeholder="Write detailed question..."
                rows={3}
                style={{ width: "100%", padding: "10px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "10px" }}
                required
              ></textarea>
              <select style={{ width: "100%", padding: "10px", border: "1px solid #dfdfdf", borderRadius: "5px", marginBottom: "15px" }}>
                <option>Select Question Category</option>
                <option>Research Methodology</option>
                <option>Data Analysis</option>
                <option>Conference Papers</option>
                <option>Scientific Coding</option>
              </select>
              <button type="submit" className="main-btn" style={{ width: "100%", padding: "10px", borderRadius: "5px" }}>
                Post Question
              </button>
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

      {/* Image Preview Modal */}
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

      {/* Side Slide Drawer for Messages and Notifications */}
      {isSideSlideOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99998,
          }}
          onClick={() => setIsSideSlideOpen(false)}
        >
          <div
            className="side-slide active"
            style={{
              display: "block",
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "350px",
              background: "#fff",
              boxShadow: "-5px 0 25px rgba(0,0,0,0.15)",
              zIndex: 99999,
              padding: "25px",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="popup-closed"
              onClick={() => setIsSideSlideOpen(false)}
              style={{ position: "absolute", top: "15px", right: "20px", cursor: "pointer", fontSize: "20px" }}
            >
              <i className="icofont-close"></i>
            </span>
            <div className="slide-meta">
              <ul className="nav nav-tabs slide-btns" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <li className="nav-item">
                  <a
                    className={sideSlideTab === "messages" ? "active" : ""}
                    href="#messages"
                    onClick={(e) => {
                      e.preventDefault();
                      setSideSlideTab("messages");
                    }}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "20px",
                      background: sideSlideTab === "messages" ? "#088dcd" : "#f1f2f6",
                      color: sideSlideTab === "messages" ? "#fff" : "#555",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    Messages
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={sideSlideTab === "notifications" ? "active" : ""}
                    href="#notifications"
                    onClick={(e) => {
                      e.preventDefault();
                      setSideSlideTab("notifications");
                    }}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "20px",
                      background: sideSlideTab === "notifications" ? "#088dcd" : "#f1f2f6",
                      color: sideSlideTab === "notifications" ? "#fff" : "#555",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    Notifications
                  </a>
                </li>
              </ul>

              {sideSlideTab === "messages" ? (
                <div className="tab-pane active fade show" id="messages">
                  <h4>
                    <i className="icofont-envelope"></i> Messages
                  </h4>
                  <ul className="new-messages" style={{ listStyle: "none", padding: 0, marginTop: "15px" }}>
                    {[
                      { name: "Ibrahim Ahmed", img: "/images/resources/user1.jpg", text: "Hello dear, let's discuss project" },
                      { name: "Fatima J.", img: "/images/resources/user2.jpg", text: "Sent you new research notes" },
                      { name: "Fawad Ahmed", img: "/images/resources/user3.jpg", text: "Can we schedule a call today?" },
                    ].map((msg, i) => (
                      <li key={i} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "15px" }}>
                        <figure style={{ margin: 0 }}>
                          <img src={msg.img} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                        </figure>
                        <div className="mesg-info">
                          <span style={{ fontWeight: "600", fontSize: "13px", display: "block" }}>{msg.name}</span>
                          <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "12px", color: "#777" }}>
                            {msg.text}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="tab-pane active fade show" id="notifications">
                  <h4>
                    <i className="icofont-bell-alt"></i> Notifications
                  </h4>
                  <ul className="notificationz" style={{ listStyle: "none", padding: 0, marginTop: "15px" }}>
                    {[
                      { name: "Alis Wells", img: "/images/resources/user5.jpg", text: "recommended your post" },
                      { name: "Saim Turan", img: "/images/resources/user4.jpg", text: "shared your new publication" },
                    ].map((n, i) => (
                      <li key={i} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "15px" }}>
                        <figure style={{ margin: 0 }}>
                          <img src={n.img} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                        </figure>
                        <div className="mesg-info">
                          <span style={{ fontWeight: "600", fontSize: "13px", display: "block" }}>{n.name}</span>
                          <span style={{ fontSize: "12px", color: "#777" }}>{n.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Bottom Bar */}
      <figure className="bottom-mockup">
        <img alt="" src="/images/footer.png" />
      </figure>
      <div className="bottombar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <span>&copy; copyright All rights reserved by Socimo 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
