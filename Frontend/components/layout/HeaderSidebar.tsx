"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string | null;
  } | null;
}

type SubmenuItem = {
  label: string;
  href: string;
};

type MenuItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: SubmenuItem[];
};

export default function HeaderSidebar({ isOpen, onClose, user }: HeaderSidebarProps) {
  const pathname = usePathname();

  // Track which submenus are expanded
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    home: true,
    features: false,
    marketplace: false,
    blogs: false,
  });

  const toggleSubmenu = (menuId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("mobile-nav-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("mobile-nav-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("mobile-nav-open");
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuItems: MenuItem[] = [
    {
      id: "home",
      title: "Home",
      icon: (
        <svg
          className="feather feather-home"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      children: [
        { label: "Newsfeed", href: "/" },
        { label: "User Profile", href: "/profile" },
        { label: "Groups", href: "/groups" },
        { label: "Chat / Messages", href: "/messages" },
        { label: "Search Result", href: "/search-result" },
      ],
    },
    {
      id: "features",
      title: "Features",
      icon: (
        <svg
          className="feather feather-zap"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      children: [
        { label: "Videos", href: "/videos" },
        { label: "Live Stream", href: "/live-stream" },
        { label: "Events Page", href: "/events" },
        { label: "Support & Help", href: "/help" },
      ],
    },
    {
      id: "marketplace",
      title: "Market Place",
      icon: (
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
          className="feather feather-shopping-bag"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
      children: [
        { label: "Courses", href: "/courses" },
        { label: "Course Detail", href: "/course-detail" },
        { label: "Add New Course", href: "/add-new-course" },
        { label: "Books", href: "/books" },
        { label: "Book Detail", href: "/book-detail" },
        { label: "Market Products", href: "/products" },
        { label: "Cart Page", href: "/cart" },
        { label: "Checkout", href: "/checkout" },
      ],
    },
    {
      id: "blogs",
      title: "Blogs",
      icon: (
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
          className="feather feather-coffee"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
      children: [{ label: "Blog Feed", href: "/blog" }],
    },
    {
      id: "university",
      title: "University Profile",
      href: "/about-university",
      icon: (
        <svg
          className="feather feather-users"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle r="4" cy="7" cx="9" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "chat",
      title: "Live Chat",
      href: "/messages",
      icon: (
        <svg
          className="feather feather-message-square"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          height="16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "privacy",
      title: "Privacy Policies",
      href: "/policy",
      icon: (
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
          className="feather feather-airplay"
        >
          <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
          <polygon points="12 15 17 21 7 21 12 15" />
        </svg>
      ),
    },
    {
      id: "settings",
      title: "Web Settings",
      href: "/settings",
      icon: (
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
          className="feather feather-settings"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User"
    : null;

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="socimo-sidebar-overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(2px)",
            zIndex: 99998,
            transition: "opacity 0.3s ease",
          }}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <nav
        className={`sidebar ${isOpen ? "hide" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? 0 : "-320px",
          width: "280px",
          maxWidth: "85vw",
          height: "100vh",
          backgroundColor: "#ffffff",
          boxShadow: isOpen ? "4px 0 25px rgba(0,0,0,0.18)" : "none",
          zIndex: 99999,
          transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
          paddingTop: 0,
          paddingBottom: "30px",
          display: "flex",
          flexDirection: "column",
        }}
        role="navigation"
        aria-label="Sidebar Navigation"
      >
        {/* Drawer Header with Logo and Close button */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid #eef2f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f8fafc",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Link
            href="/"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "#088dcd",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            <img
              src="/images/logo.png"
              alt="Socimo Logo"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
            <span>Updates</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sidebar"
            style={{
              background: "#e2e8f0",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#475569",
              fontSize: "18px",
              lineHeight: 1,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#cbd5e1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#e2e8f0")}
          >
            &times;
          </button>
        </div>

        {/* User preview if authenticated */}
        {displayName && (
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#ffffff",
            }}
          >
            <img
              src={user?.avatarUrl || "/images/resources/user.jpg"}
              alt={displayName}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #088dcd",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </div>
              <Link
                href="/profile"
                onClick={onClose}
                style={{
                  fontSize: "12px",
                  color: "#088dcd",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                View Profile &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Menu list */}
        <ul className="menu-slide" style={{ listStyle: "none", padding: "15px 0", margin: 0, flex: 1 }}>
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus[item.id] || false;
            const isActive =
              (item.href && pathname === item.href) ||
              (hasChildren && item.children?.some((c) => pathname === c.href));

            return (
              <li
                key={item.id}
                className={`${hasChildren ? "menu-item-has-children" : ""} ${isActive ? "active" : ""}`}
                style={{
                  position: "relative",
                  width: "100%",
                  marginBottom: "4px",
                  padding: "0 12px",
                }}
              >
                {hasChildren ? (
                  <a
                    href="#"
                    onClick={(e) => toggleSubmenu(item.id, e)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: isActive ? "700" : "500",
                      color: isActive ? "#088dcd" : "#334155",
                      backgroundColor: isActive ? "#f0f9ff" : "transparent",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: isActive ? "#088dcd" : "#64748b", display: "flex" }}>
                        {item.icon}
                      </span>
                      {item.title}
                    </span>
                    <i
                      className={`icofont-rounded-${isExpanded ? "down" : "right"}`}
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        transition: "transform 0.2s",
                      }}
                    ></i>
                  </a>
                ) : (
                  <Link
                    href={item.href || "/"}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: isActive ? "700" : "500",
                      color: isActive ? "#088dcd" : "#334155",
                      backgroundColor: isActive ? "#f0f9ff" : "transparent",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ color: isActive ? "#088dcd" : "#64748b", display: "flex" }}>
                      {item.icon}
                    </span>
                    {item.title}
                  </Link>
                )}

                {/* Collapsible Submenu */}
                {hasChildren && isExpanded && (
                  <ul
                    className="submenu"
                    style={{
                      listStyle: "none",
                      padding: "4px 0 6px 36px",
                      margin: 0,
                      display: "block",
                    }}
                  >
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <li key={child.label} style={{ margin: "3px 0" }}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            style={{
                              display: "block",
                              padding: "6px 12px",
                              fontSize: "13px",
                              fontWeight: isChildActive ? "600" : "400",
                              color: isChildActive ? "#088dcd" : "#64748b",
                              textDecoration: "none",
                              borderRadius: "6px",
                              backgroundColor: isChildActive ? "#e0f2fe" : "transparent",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer info in sidebar */}
        <div
          style={{
            padding: "15px 20px",
            borderTop: "1px solid #f1f5f9",
            fontSize: "11px",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          &copy; {new Date().getFullYear()} Updates • All rights reserved
        </div>
      </nav>
    </>
  );
}
