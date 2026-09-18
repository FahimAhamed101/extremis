"use client";

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/auth/client";
import { AUTH_STORAGE_EVENT, AUTH_USER_STORAGE_KEY } from "@/lib/auth/constants";
import CreatePostModal from "@/components/posts/CreatePostModal";
import { useGetChatConversationsQuery } from "@/lib/services/authApi";
import HeaderSideSlide from "@/components/layout/HeaderSideSlide";
import HeaderSidebar from "@/components/layout/HeaderSidebar";
import { getCartTotalCount, onCartChange } from "@/lib/cart/cartService";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSideSlideOpen, setIsSideSlideOpen] = useState(false);
  const [activeSideSlideTab, setActiveSideSlideTab] = useState<"messages" | "notifications">("messages");
  const [headerSearchTerm, setHeaderSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState<number>(3);

  useEffect(() => {
    const handleToggle = () => setIsSidebarOpen((prev) => !prev);
    const handleOpen = () => setIsSidebarOpen(true);
    const handleClose = () => setIsSidebarOpen(false);

    window.addEventListener("toggle-socimo-sidebar", handleToggle);
    window.addEventListener("open-socimo-sidebar", handleOpen);
    window.addEventListener("close-socimo-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-socimo-sidebar", handleToggle);
      window.removeEventListener("open-socimo-sidebar", handleOpen);
      window.removeEventListener("close-socimo-sidebar", handleClose);
    };
  }, []);

  useEffect(() => {
    setCartCount(getCartTotalCount());
    const unsubscribe = onCartChange(() => {
      setCartCount(getCartTotalCount());
    });
    return unsubscribe;
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = headerSearchTerm.trim();
    if (query) {
      router.push(`/search-result?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search-result");
    }
  };

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
  function isRouteActive(itemHref: string, currentPath: string): boolean {
    if (itemHref === "/") {
      return currentPath === "/" || currentPath === "/index.html" || currentPath === "/feed.html";
    }
    const cleanPath = (currentPath || "").split("?")[0].replace(/\.html$/, "").replace(/\/$/, "");
    const cleanHref = (itemHref || "").split("?")[0].replace(/\.html$/, "").replace(/\/$/, "");
    return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`);
  }

  const isHomePage = isRouteActive("/", pathname);
  const isVideosPage = isRouteActive("/videos", pathname);
  const isLiveStreamPage = isRouteActive("/live-stream", pathname);
  const isCoursesPage = isRouteActive("/courses", pathname);
  const isProductsPage = isRouteActive("/products", pathname);
  const isBlogPage = isRouteActive("/blog", pathname);
  const isGroupsPage = isRouteActive("/groups", pathname);
  const isFriendsPage = isRouteActive("/friends", pathname);
  const isEventsPage = isRouteActive("/events", pathname);
  const isPagesPage = isRouteActive("/pages", pathname);
  const isNearbyPage = isRouteActive("/nearby", pathname);
  const isWorldTourPage = isRouteActive("/world-tour", pathname);

  // Ordered list of top shortcut pages
  const navItems = useMemo(
    () => [
      { key: "newsfeed", label: "Newsfeed", href: "/", isActive: isRouteActive("/", pathname) },
      { key: "videos", label: "Videos", href: "/videos", isActive: isRouteActive("/videos", pathname) },
      { key: "live", label: "Live", href: "/live-stream", isActive: isRouteActive("/live-stream", pathname) },
      { key: "courses", label: "Courses", href: "/courses", isActive: isRouteActive("/courses", pathname) },
      { key: "products", label: "Products", href: "/products", isActive: isRouteActive("/products", pathname) },
      { key: "blog", label: "Blog", href: "/blog", isActive: isRouteActive("/blog", pathname) },
      { key: "groups", label: "Groups", href: "/groups", isActive: isRouteActive("/groups", pathname) },
      { key: "friends", label: "Friends", href: "/friends", isActive: isRouteActive("/friends", pathname) },
      { key: "events", label: "Events", href: "/events", isActive: isRouteActive("/events", pathname) },
      { key: "pages", label: "Pages", href: "/pages", isActive: isRouteActive("/pages", pathname) },
      { key: "nearby", label: "Nearby", href: "/nearby", isActive: isRouteActive("/nearby", pathname) },
      { key: "world-tour", label: "World Tour", href: "/world-tour", isActive: isRouteActive("/world-tour", pathname) },
    ],
    [pathname]
  );

  const currentNavIndex = useMemo(() => {
    return navItems.findIndex((item) => item.isActive);
  }, [navItems]);

  const prevNavIndex = useMemo(() => {
    if (currentNavIndex === -1) return navItems.length - 1;
    return (currentNavIndex - 1 + navItems.length) % navItems.length;
  }, [currentNavIndex, navItems.length]);

  const nextNavIndex = useMemo(() => {
    if (currentNavIndex === -1) return 0;
    return (currentNavIndex + 1) % navItems.length;
  }, [currentNavIndex, navItems.length]);

  const prevItem = navItems[prevNavIndex];
  const nextItem = navItems[nextNavIndex];

  // Prefetch adjacent routes for instant transitions
  useEffect(() => {
    if (prevItem?.href) router.prefetch(prevItem.href);
    if (nextItem?.href) router.prefetch(nextItem.href);
  }, [prevItem?.href, nextItem?.href, router]);

  const navScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkNavScroll = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    checkNavScroll();
    const t = setTimeout(checkNavScroll, 120);
    el.addEventListener("scroll", checkNavScroll, { passive: true });
    window.addEventListener("resize", checkNavScroll);
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", checkNavScroll);
      window.removeEventListener("resize", checkNavScroll);
    };
  }, [checkNavScroll]);

  // Smoothly center the active navigation item whenever pathname changes
  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      const activeLink = el.querySelector<HTMLElement>(".link-item > a.active");
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
      checkNavScroll();
    }, 60);
    return () => clearTimeout(t);
  }, [pathname, checkNavScroll]);

  const handleArrowNavigate = useCallback(
    (direction: "left" | "right") => {
      const targetIndex = direction === "right" ? nextNavIndex : prevNavIndex;
      const targetItem = navItems[targetIndex];
      if (!targetItem) return;

      // 1. Immediately smooth-scroll the target link item into center view
      const targetLink = navScrollRef.current?.querySelectorAll<HTMLElement>(".link-item > a")[targetIndex];
      if (targetLink) {
        targetLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }

      // 2. Navigate to target page
      router.push(targetItem.href);
    },
    [nextNavIndex, prevNavIndex, navItems, router]
  );

  const handleNavKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleArrowNavigate("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleArrowNavigate("right");
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = navScrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftStartRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const el = navScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    el.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

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
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/images/logo.png"
              alt="Updates"
              style={{ width: "34px", height: "34px", borderRadius: "8px", objectFit: "cover" }}
            />
            <span style={{ marginLeft: "8px" }}>Updates</span>
          </Link>
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
          <div className="res-cart">
            <Link
              href="/cart"
              title="Cart"
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                color: "#1e293b",
                borderRadius: "8px",
                transition: "background 0.2s ease",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-4px",
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 700,
                    lineHeight: "15px",
                    minWidth: "17px",
                    height: "17px",
                    borderRadius: "10px",
                    textAlign: "center",
                    padding: "0 3px",
                    border: "1.5px solid #ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount.toString().padStart(2, "0")}
                </span>
              )}
            </Link>
          </div>
          <div
            className="sidemenu"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-label="Toggle navigation menu"
            style={{ cursor: "pointer" }}
          >
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
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={headerSearchTerm}
              onChange={(e) => setHeaderSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>

      <header className="">
        <div className="topbar stick">
          <div className="logo">
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              <img
                src="/images/logo.png"
                alt="Updates"
                style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover" }}
              />
              <span style={{ marginLeft: "8px" }}>Updates</span>
            </Link>
          </div>
          <div className="searches">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={headerSearchTerm}
                onChange={(e) => setHeaderSearchTerm(e.target.value)}
              />
              <button type="submit" title="Search">
                <i className="icofont-search"></i>
              </button>
              <span
                className="cancel-search"
                style={{ cursor: "pointer" }}
                onClick={() => setHeaderSearchTerm("")}
                title="Clear search"
              >
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
              <Link href="/live-stream" title="Go Live" data-toggle="tooltip">
                <i>
                  <svg fill="#f00" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18px" height="18px">
                    <path d="M 6.1015625 6.1015625 C 3.5675625 8.6345625 2 12.134 2 16 C 2 19.866 3.5675625 23.365437 6.1015625 25.898438 L 7.5195312 24.480469 C 5.3465312 22.307469 4 19.308 4 16 C 4 12.692 5.3465312 9.6925313 7.5195312 7.5195312 L 6.1015625 6.1015625 z M 25.898438 6.1015625 L 24.480469 7.5195312 C 26.653469 9.6925312 28 12.692 28 16 C 28 19.308 26.653469 22.307469 24.480469 24.480469 L 25.898438 25.898438 C 28.432437 23.365437 30 19.866 30 16 C 30 12.134 28.432437 8.6345625 25.898438 6.1015625 z M 9.6367188 9.6367188 C 8.0077188 11.265719 7 13.515 7 16 C 7 18.485 8.0077187 20.734281 9.6367188 22.363281 L 11.052734 20.947266 C 9.7847344 19.680266 9 17.93 9 16 C 9 14.07 9.7847344 12.319734 11.052734 11.052734 L 9.6367188 9.6367188 z M 22.363281 9.6367188 L 20.947266 11.052734 C 22.215266 12.319734 23 14.07 23 16 C 23 17.93 22.215266 19.680266 20.947266 20.947266 L 22.363281 22.363281 C 23.992281 20.734281 25 18.485 25 16 C 25 13.515 23.992281 11.265719 22.363281 9.6367188 z M 16 12 A 4 4 0 0 0 16 20 A 4 4 0 0 0 16 12 z" />
                  </svg>
                </i>
              </Link>
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
              <Link
                href="/cart"
                className="cart-nav-link"
                title="Shopping Cart"
                data-toggle="tooltip"
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
                    className="feather feather-shopping-cart"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </i>
              </Link>
              <span aria-hidden="true">
                {cartCount > 0 ? (cartCount > 99 ? "99+" : cartCount.toString().padStart(2, "0")) : ""}
              </span>
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
                  <Link href="/add-new-course" title="">
                    <i className="icofont-plus"></i> New Course
                  </Link>
                </li>
                <li>
                  <Link href="/about-university?action=invite" title="Invite Colleagues">
                    <i className="icofont-brand-slideshare"></i> Invite Collegue
                  </Link>
                </li>
                <li>
                  <Link href="/payout" title="Payouts & Earnings">
                    <i className="icofont-price"></i> Payout
                  </Link>
                </li>
                <li>
                  <Link href="/nearby" title="Nearby">
                    <i className="icofont-location-pin"></i> Nearby People
                  </Link>
                </li>
                <li>
                  <Link href="/world-tour" title="World Tour">
                    <i className="icofont-globe"></i> World Tour
                  </Link>
                </li>
                <li>
                  <a href="price-plan.html" title="">
                    <i className="icofont-flash"></i> Upgrade
                  </a>
                </li>
                <li>
                  <a href="/help" title="">
                    <i className="icofont-question-circle"></i> Help
                  </a>
                </li>
                <li>
                  <Link href="/settings" title="Account Settings">
                    <i className="icofont-gear"></i> Setting
                  </Link>
                </li>
                <li>
                  <a href="/policy" title="">
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
              <div className="header-shortcuts-wrapper">
                <div className="header-sidemenu-box">
                  <div
                    className="sidemenu"
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                    role="button"
                    tabIndex={0}
                    aria-label="Toggle navigation menu"
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
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="header-nav-scroll-container">
                  <Link
                    href={prevItem.href}
                    className="header-nav-scroll-btn btn-prev"
                    aria-label={`Go to previous page: ${prevItem.label}`}
                    title={`Previous page: ${prevItem.label}`}
                    onClick={() => {
                      const targetLink = navScrollRef.current?.querySelectorAll<HTMLElement>(".link-item > a")[prevNavIndex];
                      if (targetLink) {
                        targetLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </Link>

                  <div
                    ref={navScrollRef}
                    className="header-nav-shortcuts header-nav-scroll-track"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={handleMouseUpOrLeave}
                  >
                      <div className="link-item">
                        <Link className={isHomePage ? "active" : ""} href="/" title="Newsfeed">
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
                        <Link className={isLiveStreamPage ? "active" : ""} href="/live-stream" title="Live Stream">
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
                              className="feather feather-video"
                            >
                              <polygon points="23 7 16 12 23 17 23 7" />
                              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                          </i>
                          <p>Live</p>
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
                        <Link className={isProductsPage ? "active" : ""} href="/products" title="Products">
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
                              className="feather feather-shopping-bag"
                            >
                              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                              <line x1="3" y1="6" x2="21" y2="6"></line>
                              <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                          </i>
                          <p>Products</p>
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
                      <div className="link-item">
                        <Link className={isEventsPage ? "active" : ""} href="/events" title="Events">
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
                              className="feather feather-calendar"
                            >
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          </i>
                          <p>Events</p>
                        </Link>
                      </div>
                      <div className="link-item">
                        <Link className={isPagesPage ? "active" : ""} href="/pages" title="Pages">
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
                              className="feather feather-flag"
                            >
                              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                              <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                          </i>
                          <p>Pages</p>
                        </Link>
                      </div>
                      <div className="link-item link-item-highlight">
                        <Link className={isNearbyPage ? "active" : ""} href="/nearby" title="Nearby People">
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
                              className="feather feather-map-pin"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                          </i>
                          <p>Nearby</p>
                        </Link>
                      </div>
                      <div className="link-item link-item-highlight">
                        <Link className={isWorldTourPage ? "active" : ""} href="/world-tour" title="World Tour">
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
                              className="feather feather-globe"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          </i>
                          <p>World Tour</p>
                        </Link>
                      </div>
                    </div>

                  <Link
                    href={nextItem.href}
                    className="header-nav-scroll-btn btn-next"
                    aria-label={`Go to next page: ${nextItem.label}`}
                    title={`Next page: ${nextItem.label}`}
                    onClick={() => {
                      const targetLink = navScrollRef.current?.querySelectorAll<HTMLElement>(".link-item > a")[nextNavIndex];
                      if (targetLink) {
                        targetLink.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </Link>
                </div>
                  <div className="header-user-inf-box">
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

      <HeaderSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />

      {isAuthenticated ? <CreatePostModal /> : null}
    </>
  );
}
