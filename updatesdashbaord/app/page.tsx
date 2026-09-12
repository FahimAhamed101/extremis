"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function DashboardPage() {
  // Mobile and dropdown states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSideSlideOpen, setIsSideSlideOpen] = useState(false);
  const [sideSlideTab, setSideSlideTab] = useState<"messages" | "notifications">("messages");
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Manage Users Toggle Switches
  const [userSwitches, setUserSwitches] = useState<Record<string, boolean>>({
    switch1: false,
    switch2: false,
    switch3: false,
    switch4: false,
    switch5: false,
    switch6: false,
    switch7: false,
    switch8: false,
    switch9: false,
    switch10: false,
  });

  const toggleSwitch = (id: string) => {
    setUserSwitches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ApexCharts initialization
  const chartsInitialized = useRef(false);

  useEffect(() => {
    let chartReferral: any = null;
    let chartUniqueVisits: any = null;

    const initCharts = () => {
      if (typeof window === "undefined") return;
      const ApexCharts = (window as any).ApexCharts;
      if (!ApexCharts) return;

      const refContainer = document.querySelector("#hybrid_followers1");
      const visitsContainer = document.querySelector("#uniqueVisits");

      if (refContainer && !refContainer.hasChildNodes()) {
        const referralOptions = {
          chart: {
            id: "sparkline1",
            type: "area",
            height: 160,
            sparkline: { enabled: true },
          },
          stroke: { curve: "smooth", width: 2 },
          series: [{ name: "Referrals", data: [60, 28, 52, 38, 40, 36, 38] }],
          labels: ["1", "2", "3", "4", "5", "6", "7"],
          yaxis: { min: 0 },
          colors: ["#e7515a"],
          tooltip: { x: { show: false } },
          fill: {
            type: "gradient",
            gradient: {
              type: "vertical",
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.4,
              opacityTo: 0.05,
              stops: [45, 100],
            },
          },
        };
        chartReferral = new ApexCharts(refContainer, referralOptions);
        chartReferral.render();
      }

      if (visitsContainer && !visitsContainer.hasChildNodes()) {
        const uniqueVisitsOptions = {
          chart: {
            height: 350,
            type: "bar",
            toolbar: { show: false },
            dropShadow: {
              enabled: true,
              top: 1,
              left: 1,
              blur: 2,
              color: "#acb0c3",
              opacity: 0.7,
            },
          },
          colors: ["#088dcd", "#a8d860"],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded",
            },
          },
          dataLabels: { enabled: false },
          legend: {
            position: "top",
            horizontalAlign: "right",
            fontSize: "14px",
            markers: { width: 10, height: 10 },
            itemMargin: { horizontal: 0, vertical: 8 },
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          series: [
            {
              name: "Direct",
              data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
            },
            {
              name: "Organic",
              data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
            },
          ],
          xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "light",
              type: "vertical",
              shadeIntensity: 0.3,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 0.8,
              stops: [0, 100],
            },
          },
          tooltip: {
            y: {
              formatter: function (val: number) {
                return val.toString();
              },
            },
          },
        };
        chartUniqueVisits = new ApexCharts(visitsContainer, uniqueVisitsOptions);
        chartUniqueVisits.render();
      }
    };

    const interval = setInterval(() => {
      if ((window as any).ApexCharts) {
        initCharts();
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      if (chartReferral) chartReferral.destroy();
      if (chartUniqueVisits) chartUniqueVisits.destroy();
    };
  }, []);

  return (
    <div className="theme-layout">
      {/* Responsive Header */}
      <div className="responsive-header">
        <div className="res-logo">
          <img src="/images/logo.png" alt="Socimo" />
        </div>

        <div className="user-avatar mobile">
          <Link href="/profile" title="View Profile">
            <img alt="" src="/images/resources/user.jpg" />
          </Link>
          <div className="name">
            <h4>Saim Turan</h4>
            <span>Antalya, Turkey</span>
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
                  <a className="dark-mod" href="#">
                    <i className="icofont-moon"></i>Dark Mode
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
            <img alt="Socimo" src="/images/logo.png" />
            <span>Socimo</span>
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
                    <a href="#">
                      <i className="icofont-plus"></i> New Course
                    </a>
                  </li>
                  <li>
                    <a className="invite-new" href="#">
                      <i className="icofont-brand-slideshare"></i> Invite Colleague
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icofont-price"></i> Payout
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icofont-flash"></i> Upgrade
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icofont-question-circle"></i> Help
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icofont-gear"></i> Setting
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="icofont-notepad"></i> Privacy
                    </a>
                  </li>
                  <li>
                    <a className="dark-mod" href="#">
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
                <h4>Dashboard</h4>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <ul className="breadcrumb">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/">Dashboard</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isSideMenuOpen ? "active" : ""}`}>
        <ul className="menu-slide">
          <li className="active">
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
          <li className="">
            <Link href="/analytics" title="">
              <i>
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
              </i>
              Analytics
            </Link>
          </li>
          <li className="">
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
          <li className="">
            <Link href="/reviews" title="">
              <i>
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
              </i>
              Reviews
            </Link>
          </li>
          <li className="">
            <Link href="/events" title="">
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
              Events
            </Link>
          </li>
          <li className="">
            <Link href="/products" title="">
              <i>
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
              </i>
              Products
            </Link>
          </li>
          <li className="">
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
              Blogs
            </Link>
          </li>
          <li className="">
            <Link href="/messages" title="">
              <i>
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
              </i>
              Messages
            </Link>
          </li>
          <li className="">
            <Link href="/team" title="">
              <i>
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
              </i>
              Team
            </Link>
          </li>
          <li className="">
            <Link href="/login" title="">
              <i>
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
              </i>
              Login/Register
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Dashboard Content */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="panel-content">
              <h4 className="main-title">Users Management</h4>

              {/* Realtime Stat Cards */}
              <div className="row merged20 mb-4">
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <div className="d-widget soft-red">
                    <div className="d-widget-title">
                      <h5>Realtime Users</h5>
                    </div>
                    <div className="d-widget-content">
                      <span className="realtime-ico pulse"></span>
                      <h6>Updating live</h6>
                      <h5>223</h5>
                      <i className="icofont-users-alt-3"></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <div className="d-widget soft-blue">
                    <div className="d-widget-title">
                      <h5>Realtime Watch</h5>
                    </div>
                    <div className="d-widget-content">
                      <span className="realtime-ico pulse"></span>
                      <h6>Updating live</h6>
                      <h5>5016</h5>
                      <i className="icofont-optic"></i>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <div className="d-widget soft-green">
                    <div className="d-widget-title">
                      <h5>Realtime Posts</h5>
                    </div>
                    <div className="d-widget-content">
                      <span className="realtime-ico pulse"></span>
                      <h6>Updating live</h6>
                      <h5>5.3K</h5>
                      <i className="icofont-computer"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Users & Today's Earnings */}
              <div className="row merged20 mb-4">
                <div className="col-lg-8">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Top Users</h5>
                    </div>
                    <table className="table-default table table-striped table-responsive-md">
                      <thead>
                        <tr>
                          <th className="wd-35p">Name</th>
                          <th className="wd-15p">Sales</th>
                          <th className="wd-25p">Ratings</th>
                          <th className="wd-25p">Earnings ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Socrates Itumay", initial: "s", bg: "bg-secondary", sales: 58, rating: "96%", earnings: "302,422.50" },
                          { name: "Dianne Aceron", img: "/images/resources/user2.jpg", sales: 49, rating: "85%", earnings: "264,090.00" },
                          { name: "Katherine Movera", img: "/images/resources/user6.jpg", sales: 40, rating: "79%", earnings: "238,720.80" },
                          { name: "Reynante Labares", initial: "r", bg: "bg-primary", sales: 38, rating: "45%", earnings: "227,063.20" },
                          { name: "Dexter Dela Cruz", initial: "d", bg: "bg-dark", sales: 26, rating: "76%", earnings: "202,918.00" },
                          { name: "Johnwyne Mendez", initial: "j", bg: "bg-purple", sales: 26, rating: "88%", earnings: "202,918.00" },
                          { name: "Evelyn Movera", img: "/images/resources/user8.jpg", sales: 40, rating: "79%", earnings: "238,720.80" },
                          { name: "Jackson Will", img: "/images/resources/user7.jpg", sales: 40, rating: "79%", earnings: "238,720.80" },
                          { name: "Katherine Sima", img: "/images/resources/user2.jpg", sales: 40, rating: "79%", earnings: "238,720.80" },
                        ].map((u, i) => (
                          <tr key={i}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar avatar-xs">
                                  {u.img ? (
                                    <img src={u.img} className="rounded-circle" alt="" />
                                  ) : (
                                    <span className={`avatar-initial rounded-circle ${u.bg}`}>
                                      {u.initial}
                                    </span>
                                  )}
                                </div>
                                <span className="tx-medium mg-l-10" style={{ marginLeft: "10px" }}>
                                  {u.name}
                                </span>
                              </div>
                            </td>
                            <td>{u.sales}</td>
                            <td>
                              <div className="rating-stars">
                                <span>{u.rating}</span>
                                <ul>
                                  <li><i className="icofont-star"></i></li>
                                  <li><i className="icofont-star"></i></li>
                                  <li><i className="icofont-star"></i></li>
                                  <li><i className="icofont-star"></i></li>
                                  <li><i className="icofont-star"></i></li>
                                </ul>
                              </div>
                            </td>
                            <td>{u.earnings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="d-widget mb-4">
                    <div className="d-widget-title">
                      <h5>Today&apos;s Earnings</h5>
                    </div>
                    <div className="d-widget-content">
                      <ul className="earningz">
                        <li><span>Books: </span> 55 sales <em>$200</em></li>
                        <li><span>Courses: </span> 20 sales <em>$500</em></li>
                        <li><span>Other: </span> 2 sales <em>$100</em></li>
                      </ul>
                      <div className="totl-blnce">
                        <span>Balance: <i>$205.03</i></span>
                      </div>
                      <svg
                        id="dolor-sign"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-dollar-sign earning"
                      >
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="d-widget">
                        <div className="d-widget-title">
                          <h5>Top Five Active</h5>
                        </div>
                        <ul className="top-5">
                          {[
                            { name: "Big Boss", time: "23hrs/day", img: "/images/resources/user1.jpg" },
                            { name: "Sarah Jane", time: "22hrs/day", img: "/images/resources/user2.jpg" },
                            { name: "Andrew", time: "20hrs/day", img: "/images/resources/user3.jpg" },
                            { name: "Frank", time: "19hrs/day", img: "/images/resources/user4.jpg" },
                            { name: "Bob Emily", time: "18hrs/day", img: "/images/resources/user5.jpg" },
                          ].map((user, idx) => (
                            <li key={idx}>
                              <figure>
                                <img src={user.img} alt="" />
                                <span className="status online"></span>
                              </figure>
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                {user.name}
                              </a>
                              <span className="user-active-time">{user.time}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Chart & Violation Reports & Daily Active Users */}
              <div className="row merged20 mb-4">
                <div className="col-lg-6">
                  <div className="d-widget pd-0 soft-red mb-4">
                    <div className="d-widget-meta">
                      <div className="w-icon">
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
                          className="feather feather-link"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </div>
                      <h5 className="">Referral</h5>
                      <p className="w-value">1,900</p>
                    </div>
                    <div className="d-widget-content">
                      <div className="w-chart">
                        <div id="hybrid_followers1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="d-widget bg-danger uk-light">
                    <div className="d-widget-title">
                      <h5>Violation Reports</h5>
                    </div>
                    <div className="d-widget-content">
                      <div className="violetion-message">
                        <p>
                          <i className="icofont-info-circle"></i>
                          Report about content policy violation on Socimo
                          <a className="button soft-danger circle" href="#" onClick={(e) => e.preventDefault()}>
                            Take Action
                          </a>
                        </p>
                        <p>
                          <i className="icofont-info-circle"></i>
                          Report about abuse behavior violation on Socimo
                          <a className="button soft-danger circle" href="#" onClick={(e) => e.preventDefault()}>
                            Take Action
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Daily Active Users</h5>
                    </div>
                    <div id="uniqueVisits"></div>
                  </div>
                </div>
              </div>

              {/* Manage Users Table */}
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Manage Users</h5>
                    </div>
                    <div className="d-widget-content">
                      <table className="table manage-user table-default table-responsive-md">
                        <thead>
                          <tr>
                            <th>User Name</th>
                            <th>View profile</th>
                            <th>Chat History</th>
                            <th>Blocked</th>
                            <th>Hide</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: "Maria K.", img: "/images/resources/user.png", sw1: "switch1", sw2: "switch2" },
                            { name: "Sarika Sing.", img: "/images/resources/user2.jpg", sw1: "switch3", sw2: "switch4" },
                            { name: "King Khan", img: "/images/resources/user3.jpg", sw1: "switch5", sw2: "switch6" },
                            { name: "Jacob", img: "/images/resources/user4.jpg", sw1: "switch7", sw2: "switch8" },
                            { name: "Andrew", img: "/images/resources/user5.jpg", sw1: "switch9", sw2: "switch10" },
                          ].map((row, i) => (
                            <tr key={i}>
                              <td>
                                <figure>
                                  <img src={row.img} alt="" />
                                </figure>
                                <h5>{row.name}</h5>
                              </td>
                              <td>
                                <Link className="mini-btn" href="/profile">
                                  view
                                </Link>
                              </td>
                              <td>
                                <Link className="mini-btn" href="/messages">
                                  view
                                </Link>
                              </td>
                              <td>
                                <div className="switch-btn">
                                  <input
                                    type="checkbox"
                                    id={row.sw1}
                                    checked={userSwitches[row.sw1] || false}
                                    onChange={() => toggleSwitch(row.sw1)}
                                  />
                                  <label
                                    className="switch"
                                    htmlFor={row.sw1}
                                    style={{
                                      background: userSwitches[row.sw1] ? "#088dcd" : "#ccc",
                                    }}
                                  ></label>
                                </div>
                              </td>
                              <td>
                                <div className="switch-btn">
                                  <input
                                    type="checkbox"
                                    id={row.sw2}
                                    checked={userSwitches[row.sw2] || false}
                                    onChange={() => toggleSwitch(row.sw2)}
                                  />
                                  <label
                                    className="switch"
                                    htmlFor={row.sw2}
                                    style={{
                                      background: userSwitches[row.sw2] ? "#088dcd" : "#ccc",
                                    }}
                                  ></label>
                                </div>
                              </td>
                              <td>
                                <div className="actions-btn">
                                  <span className="iconbox button soft-primary">
                                    <i className="icofont-pen-alt-1"></i>
                                  </span>
                                  <span className="iconbox button soft-danger">
                                    <i className="icofont-trash"></i>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Transactions Table */}
              <div className="row merged20 mb-4">
                <div className="col-lg-12">
                  <div className="d-widget">
                    <div className="d-widget-title">
                      <h5>Latest Transactions</h5>
                    </div>
                    <table className="table-default table table-striped table-responsive-md">
                      <thead>
                        <tr>
                          <th>Order#</th>
                          <th>Product Name</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Pay Method</th>
                          <th>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: "001", name: "Html Basics Book", img: "/images/resources/course-1.jpg", date: "17-Oct-24", total: "$50", status: "Delivered", method: "Paypal" },
                          { id: "002", name: "VU.Js Script Book", img: "/images/resources/course-2.jpg", date: "15-Oct-24", total: "$30", status: "On Way", method: "Payoneer" },
                          { id: "003", name: "Online Css3 Course", img: "/images/resources/course-3.jpg", date: "07-Oct-24", total: "$20", status: "Pending", method: "Visa" },
                          { id: "004", name: "Online Course Basic HTML", img: "/images/resources/course-4.jpg", date: "02-Oct-24", total: "$10", status: "Delivered", method: "Paypal" },
                          { id: "005", name: "PHP Advance Course", img: "/images/resources/course-5.jpg", date: "27-Sep-24", total: "$30", status: "Delivered", method: "COD" },
                          { id: "006", name: "Advance Wp Book", img: "/images/resources/course-6.jpg", date: "25-Sep-24", total: "$25", status: "Return", method: "Bitcoin" },
                          { id: "007", name: "Online Marketing Course", img: "/images/resources/course-2.png", date: "24-Sep-24", total: "$22", status: "Delivered", method: "Master Card" },
                          { id: "008", name: "Advance PHP Book", img: "/images/resources/course-1.jpg", date: "20-Sep-24", total: "$29", status: "Pending", method: "Visa" },
                        ].map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.id}</td>
                            <td className="productss">
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                <img src={item.img} alt="" /> {item.name}
                              </a>
                            </td>
                            <td>{item.date}</td>
                            <td>{item.total}</td>
                            <td>
                              <span
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  background:
                                    item.status === "Delivered"
                                      ? "#e6fffa"
                                      : item.status === "On Way"
                                      ? "#ebf8ff"
                                      : item.status === "Pending"
                                      ? "#fffaf0"
                                      : "#fff5f5",
                                  color:
                                    item.status === "Delivered"
                                      ? "#319795"
                                      : item.status === "On Way"
                                      ? "#3182ce"
                                      : item.status === "Pending"
                                      ? "#dd6b20"
                                      : "#e53e3e",
                                }}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td>{item.method}</td>
                            <td>
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                view invoice
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Message Popup Modal */}
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
                      { name: "Saim Turan", img: "/images/resources/user4.jpg", text: "Updated dashboard metrics" },
                      { name: "Alis Wells", img: "/images/resources/user5.jpg", text: "Confirmed the meeting room" },
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
                      { name: "Fatima J.", img: "/images/resources/user2.jpg", text: "commented on research article" },
                      { name: "Ibrahim Ahmed", img: "/images/resources/user1.jpg", text: "started following your lab" },
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
    </div>
  );
}
