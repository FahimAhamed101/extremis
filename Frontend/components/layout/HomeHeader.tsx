"use client";

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { MouseEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/auth/client";
import { AUTH_STORAGE_EVENT, AUTH_USER_STORAGE_KEY } from "@/lib/auth/constants";
import CreatePostModal from "@/components/posts/CreatePostModal";
import { useGetChatConversationsQuery } from "@/lib/services/authApi";
import HeaderSideSlide from "@/components/layout/HeaderSideSlide";

type StoredUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | null;
};

function getStoredUserSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribeToAuthStorage(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorageUpdate = () => {
    callback();
  };

  window.addEventListener("storage", onStorageUpdate);
  window.addEventListener(AUTH_STORAGE_EVENT, onStorageUpdate);

  return () => {
    window.removeEventListener("storage", onStorageUpdate);
    window.removeEventListener(AUTH_STORAGE_EVENT, onStorageUpdate);
  };
}

export default function HomeHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSideSlideOpen, setIsSideSlideOpen] = useState(false);
  const [activeSideSlideTab, setActiveSideSlideTab] = useState<"messages" | "notifications">("messages");
  const userSnapshot = useSyncExternalStore(
    subscribeToAuthStorage,
    getStoredUserSnapshot,
    () => null,
  );

  const user = useMemo<StoredUser | null>(() => {
    if (!userSnapshot) {
      return null;
    }

    try {
      const parsed = JSON.parse(userSnapshot) as StoredUser;
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const isAuthenticated = Boolean(user);
  const { data: chatConversations } = useGetChatConversationsQuery(
    isAuthenticated
      ? {
          page: 1,
          limit: 50,
        }
      : skipToken,
    {
      pollingInterval: isAuthenticated ? 15000 : 0,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const displayName = useMemo(() => {
    if (!user) {
      return "Guest User";
    }

    const first = String(user.firstName || "").trim();
    const last = String(user.lastName || "").trim();
    const fullName = `${first} ${last}`.trim();

    if (fullName) {
      return fullName;
    }

    return String(user.email || "Guest User");
  }, [user]);

  const avatarSrc = useMemo(() => {
    const avatarUrl = String(user?.avatarUrl || "").trim();
    return avatarUrl || "/images/resources/user.jpg";
  }, [user]);

  const unreadChatCount = useMemo(() => {
    return (chatConversations?.data || []).reduce((total, conversation) => {
      return total + Number(conversation.unreadCount || 0);
    }, 0);
  }, [chatConversations]);
  const isHomePage = pathname === "/";
  const isVideosPage = pathname === "/videos" || pathname === "/videos.html";
  const isCoursesPage = pathname === "/courses";
  const isBlogPage = pathname === "/blog";
  const isGroupsPage = pathname === "/groups";
  const isFriendsPage = pathname === "/friends";

  const handleLogout = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    clearAuthSession();
    router.replace("/login");
    router.refresh();
  };

  const handleSideSlideOpen = (
    tab: "messages" | "notifications",
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveSideSlideTab(tab);
    setIsSideSlideOpen(true);
  };

  useEffect(() => {
    const handleEscapeClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSideSlideOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeClose);
    return () => {
      document.removeEventListener("keydown", handleEscapeClose);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsSideSlideOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return (
    <>
      <div className="responsive-header">
        <div className="logo res">
          <img src="/images/logo.png" alt="" />
          <span>Extremis</span>
        </div>
        <div className="user-avatar mobile">
          <Link href="/profile" title="View Profile">
            <img alt="" src={avatarSrc} />
          </Link>
          <div className="name">
            <h4>{displayName}</h4>
            <span>Ontario, Canada</span>
          </div>
        </div>
        <div className="right-compact">
          <div className="sidemenu">
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
          <div className="res-search">
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
        <div className="restop-search">
          <span className="hide-search">
            <i className="icofont-close-circled"></i>
          </span>
          <form method="post">
            <input type="text" placeholder="Search..." />
          </form>
        </div>
      </div>

      <header className="">
        <div className="topbar stick">
          <div className="logo">
            <img src="/images/logo.png" alt="" />
            <span>Extremis</span>
          </div>
          <div className="searches">
            <form method="post">
              <input type="text" placeholder="Search..." />
              <button type="submit">
                <i className="icofont-search"></i>
              </button>
              <span className="cancel-search">
                <i className="icofont-close"></i>
              </span>
            </form>
          </div>

          <ul className="web-elements">
            <li>
              <div className="user-dp">
                <Link href="/profile" title="">
                  <img alt="" src={avatarSrc} />
                  <div className="name">
                    <h4>{displayName}</h4>
                  </div>
                </Link>
              </div>
            </li>
            <li className="go-live">
              <a href="live-stream.html" title="Go Live" data-toggle="tooltip">
                <i>
                  <svg fill="#f00" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18px" height="18px">
                    <path d="M 6.1015625 6.1015625 C 3.5675625 8.6345625 2 12.134 2 16 C 2 19.866 3.5675625 23.365437 6.1015625 25.898438 L 7.5195312 24.480469 C 5.3465312 22.307469 4 19.308 4 16 C 4 12.692 5.3465312 9.6925313 7.5195312 7.5195312 L 6.1015625 6.1015625 z M 25.898438 6.1015625 L 24.480469 7.5195312 C 26.653469 9.6925312 28 12.692 28 16 C 28 19.308 26.653469 22.307469 24.480469 24.480469 L 25.898438 25.898438 C 28.432437 23.365437 30 19.866 30 16 C 30 12.134 28.432437 8.6345625 25.898438 6.1015625 z M 9.6367188 9.6367188 C 8.0077188 11.265719 7 13.515 7 16 C 7 18.485 8.0077187 20.734281 9.6367188 22.363281 L 11.052734 20.947266 C 9.7847344 19.680266 9 17.93 9 16 C 9 14.07 9.7847344 12.319734 11.052734 11.052734 L 9.6367188 9.6367188 z M 22.363281 9.6367188 L 20.947266 11.052734 C 22.215266 12.319734 23 14.07 23 16 C 23 17.93 22.215266 19.680266 20.947266 20.947266 L 22.363281 22.363281 C 23.992281 20.734281 25 18.485 25 16 C 25 13.515 23.992281 11.265719 22.363281 9.6367188 z M 16 12 A 4 4 0 0 0 16 20 A 4 4 0 0 0 16 12 z" />
                  </svg>
                </i>
              </a>
            </li>
            <li>
              <Link href="/" title="Home" data-toggle="tooltip">
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
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </i>
              </Link>
            </li>
            <li>
              <a
                className="message-nav-link"
                href="#messages-preview"
                title="Messages"
                data-toggle="tooltip"
                onClick={(event) => handleSideSlideOpen("messages", event)}
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </i>
              </a>
              <span aria-hidden="true">{unreadChatCount > 0 ? unreadChatCount : ""}</span>
            </li>
            <li>
              <a
                className="notification-nav-link"
                href="#notifications-preview"
                title="Notifications"
                data-toggle="tooltip"
                onClick={(event) => handleSideSlideOpen("notifications", event)}
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
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </i>
              </a>
              <span></span>
            </li>
            <li>
              <a className="create" href="#" title="Add New" data-toggle="tooltip">
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
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </i>
              </a>
            </li>
            <li>
              <a href="#" title="">
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
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </i>
              </a>
              <ul className="dropdown">
                <li>
                  <Link href="/profile" title="">
                    <i className="icofont-user-alt-3"></i> Your Profile
                  </Link>
                </li>
                <li>
                  <a href="add-new-course.html" title="">
                    <i className="icofont-plus"></i> New Course
                  </a>
                </li>
                <li>
                  <a className="invite-new" href="#" title="">
                    <i className="icofont-brand-slideshare"></i> Invite Collegue
                  </a>
                </li>
                <li>
                  <a href="pay-out.html" title="">
                    <i className="icofont-price"></i> Payout
                  </a>
                </li>
                <li>
                  <a href="price-plan.html" title="">
                    <i className="icofont-flash"></i> Upgrade
                  </a>
                </li>
                <li>
                  <a href="help-faq.html" title="">
                    <i className="icofont-question-circle"></i> Help
                  </a>
                </li>
                <li>
                  <a href="settings.html" title="">
                    <i className="icofont-gear"></i> Setting
                  </a>
                </li>
                <li>
                  <a href="privacy-n-policy.html" title="">
                    <i className="icofont-notepad"></i> Privacy
                  </a>
                </li>
                <li>
                  <a className="dark-mod" href="#" title="">
                    <i className="icofont-moon"></i> Dark Mode
                  </a>
                </li>
                {isAuthenticated ? (
                  <li className="logout">
                    <a href="/login" title="" onClick={handleLogout}>
                      <i className="icofont-power"></i> Logout
                    </a>
                  </li>
                ) : (
                  <li className="logout">
                    <Link href="/login" title="">
                      <i className="icofont-sign-in"></i> Login
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </header>

      <section className="header-shortcuts">
        <div className="white-bg">
          <div className="container-fluid">
            <div className="menu-caro">
              <div className="row">
                <div className="col-lg-2">
                  <div className="sidemenu">
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
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="page-caro">
                    <div className="link-item">
                      <Link className={isHomePage ? "active" : ""} href="/" title="">
                        <i>
                          <svg
                            className="feather feather-zap"
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
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                        </i>
                        <p>Newsfeed</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link className={isVideosPage ? "active" : ""} href="/videos" title="Videos">
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
                            className="feather feather-youtube"
                          >
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                          </svg>
                        </i>
                        <p>Videos</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link className={isCoursesPage ? "active" : ""} href="/courses" title="Courses">
                        <i>
                          <svg
                            className="feather feather-airplay"
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
                            <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                            <polygon points="12 15 17 21 7 21 12 15" />
                          </svg>
                        </i>
                        <p>Courses</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link className={isBlogPage ? "active" : ""} href="/blog" title="Blog">
                        <i>
                          <svg
                            className="feather feather-layout"
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
                            <rect ry="2" rx="2" height="18" width="18" y="3" x="3" />
                            <line y2="9" x2="21" y1="9" x1="3" />
                            <line y2="9" x2="9" y1="21" x1="9" />
                          </svg>
                        </i>
                        <p>Blog</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link className={isGroupsPage ? "active" : ""} href="/groups" title="Groups">
                        <i>
                          <svg
                            className="feather feather-users"
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
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle r="4" cy="7" cx="9" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </i>
                        <p>Groups</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link className={isFriendsPage ? "active" : ""} href="/friends" title="Friends">
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
                            className="feather feather-user-plus"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="17" y1="11" x2="23" y2="11"></line>
                          </svg>
                        </i>
                        <p>Friends</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="user-inf">
                    <div className="folowerz">Followers: 204</div>
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

      <HeaderSideSlide
        activeTab={activeSideSlideTab}
        conversations={chatConversations?.data || []}
        isOpen={isSideSlideOpen}
        onClose={() => setIsSideSlideOpen(false)}
        onTabChange={setActiveSideSlideTab}
      />

      {isAuthenticated ? <CreatePostModal /> : null}
    </>
  );
}
