"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  breadcrumb?: string;
}

export default function DashboardLayout({
  children,
  pageTitle = "Dashboard",
  breadcrumb,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSideSlideOpen, setIsSideSlideOpen] = useState(false);
  const [sideSlideTab, setSideSlideTab] = useState<"messages" | "notifications">("messages");
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
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
      ),
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: (
        <svg
          id="ab7"
          className="feather feather-zap"
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
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
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
      ),
    },
    {
      label: "Reviews",
      href: "/reviews",
      icon: (
        <svg
          id="ab3"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-star"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: "Events",
      href: "/events",
      icon: (
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
      ),
    },
    {
      label: "Products",
      href: "/products",
      icon: (
        <svg
          id="ab5"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
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
    },
    {
      label: "Blogs",
      href: "/blog",
      icon: (
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
      ),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: (
        <svg
          id="ab2"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
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
      ),
    },
    {
      label: "Team",
      href: "/team",
      icon: (
        <svg
          id="team"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-smile"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
    },
    {
      label: "Login/Register",
      href: "/login",
      icon: (
        <svg
          id="ab9"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-lock"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="theme-layout">
      {/* Responsive Header */}
      <div className="responsive-header">
        <div className="res-logo">
          <Link href="/">
            <img src="/images/logo.png" alt="Socimo" />
          </Link>
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
          <div className="menu-area">
            <div
              id="nav-icon3"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ cursor: "pointer" }}
            >
              <i>
                <svg
                  className="feather feather-grid"
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
                  <rect height="7" width="7" y="3" x="3" />
                  <rect height="7" width="7" y="3" x="14" />
                  <rect height="7" width="7" y="14" x="14" />
                  <rect height="7" width="7" y="14" x="3" />
                </svg>
              </i>
            </div>
            {isMobileMenuOpen && (
              <ul className="drop-menu" style={{ display: "block" }}>
                <li>
                  <Link href="/profile">
                    <i className="icofont-user-alt-1"></i>Your Profile
                  </Link>
                </li>
                <li>
                  <a href="#">
                    <i className="icofont-question-circle"></i>Help
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="icofont-gear"></i>Setting
                  </a>
                </li>
                <li>
                  <Link href="/login" className="logout">
                    <i className="icofont-logout"></i>Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div className="res-search">
            <span>
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
                  className="feather feather-search"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </i>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="">
        <div className="topbar stick">
          <div className="logo">
            <Link href="/">
              <img alt="Socimo" src="/images/logo.png" />
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
                  <img src="/images/resources/user.jpg" alt="" />
                  <div className="name">
                    <h4>Danial Cardos</h4>
                  </div>
                </Link>
              </div>
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
                  setIsSendMessageModalOpen(true);
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
                title=""
                href="#"
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
                    <Link href="/analytics">
                      <i className="icofont-chart-line"></i> Analytics
                    </Link>
                  </li>
                  <li>
                    <Link href="/events">
                      <i className="icofont-calendar"></i> Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/products">
                      <i className="icofont-shopping-cart"></i> Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/reviews">
                      <i className="icofont-star"></i> Reviews
                    </Link>
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

      {/* Top Sub Bar */}
      <div className="top-sub-bar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div
                className="menu-btn"
                onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
                style={{ cursor: "pointer" }}
              >
                <i>
                  <svg
                    id="menu-btn"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
              <div className="page-title">
                <h4>{pageTitle}</h4>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <ul className="breadcrumb">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <span>{breadcrumb || pageTitle}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isSideMenuOpen ? "active" : ""}`}>
        <ul className="menu-slide">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href} className={isActive ? "active" : ""}>
                <Link href={item.href} title={item.label}>
                  <i>{item.icon}</i>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content Body */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="panel-content">{children}</div>
          </div>
        </div>
      </div>

      {/* Side Slide Drawer for Messages & Notifications */}
      {isSideSlideOpen && (
        <div
          className="side-slide active"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "360px",
            height: "100vh",
            background: "#fff",
            zIndex: 9999,
            boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #edf2f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setSideSlideTab("messages")}
                style={{
                  background: sideSlideTab === "messages" ? "#088dcd" : "transparent",
                  color: sideSlideTab === "messages" ? "#fff" : "#555",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Messages
              </button>
              <button
                type="button"
                onClick={() => setSideSlideTab("notifications")}
                style={{
                  background: sideSlideTab === "notifications" ? "#088dcd" : "transparent",
                  color: sideSlideTab === "notifications" ? "#fff" : "#555",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Notifications
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsSideSlideOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
                color: "#888",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "15px 20px" }}>
            {sideSlideTab === "messages" ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  { name: "Andrew Peeter", msg: "Hey, are you joining the conference?", time: "5m ago" },
                  { name: "Sarah Jenkins", msg: "Check out the new dataset analytics!", time: "2h ago" },
                  { name: "Danial Cardos", msg: "Updated the research paper review.", time: "1d ago" },
                ].map((m, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px 0",
                      borderBottom: "1px solid #f2f5f8",
                    }}
                  >
                    <img
                      src={`/images/resources/user${(i % 3) + 1}.jpg`}
                      alt={m.name}
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h6 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 600 }}>{m.name}</h6>
                      <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{m.msg}</p>
                      <span style={{ fontSize: "11px", color: "#aaa" }}>{m.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  { title: "New Review Posted", desc: "Dr. Elena left a 5-star review on Bio Labest.", time: "10m ago" },
                  { title: "New Group Member", desc: "John Doe joined Social Research community.", time: "1h ago" },
                  { title: "Revenue Milestone", desc: "Monthly revenue crossed $24,500 target.", time: "3h ago" },
                ].map((n, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #f2f5f8",
                    }}
                  >
                    <h6 style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: 700, color: "#088dcd" }}>
                      {n.title}
                    </h6>
                    <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>{n.desc}</p>
                    <span style={{ fontSize: "11px", color: "#aaa" }}>{n.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Send Message / Add Modal */}
      {isSendMessageModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "24px",
              width: "480px",
              maxWidth: "90%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Compose New Message</h5>
              <button
                type="button"
                onClick={() => setIsSendMessageModalOpen(false)}
                style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent successfully!");
                setIsSendMessageModalOpen(false);
              }}
            >
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Recipient
                </label>
                <input
                  type="text"
                  placeholder="Enter username or email..."
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your message..."
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsSendMessageModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    background: "#f8f9fa",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="main-btn"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "6px",
                    background: "#088dcd",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
