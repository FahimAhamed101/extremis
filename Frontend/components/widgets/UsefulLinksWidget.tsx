"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

export type UsefulLinkTab =
  | "overview"
  | "about"
  | "career"
  | "advertise"
  | "apps"
  | "blog"
  | "help"
  | "gifts"
  | "content-policy"
  | "user-policy";

interface UsefulLinksWidgetProps {
  initialTab?: UsefulLinkTab;
}

export default function UsefulLinksWidget({ initialTab }: UsefulLinksWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<UsefulLinkTab>(initialTab || "overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Feedback states
  const [careerSubmitted, setCareerSubmitted] = useState(false);
  const [adSubmitted, setAdSubmitted] = useState(false);
  const [helpSubmitted, setHelpSubmitted] = useState(false);
  const [redeemedItem, setRedeemedItem] = useState<string | null>(null);

  // Form states
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantRole, setApplicantRole] = useState("Senior Fullstack Engineer");

  const [adName, setAdName] = useState("");
  const [adEmail, setAdEmail] = useState("");
  const [adBudget, setAdBudget] = useState("$500 - $1,500");

  const [helpSubject, setHelpSubject] = useState("");
  const [helpMessage, setHelpMessage] = useState("");

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const openTab = (tab: UsefulLinkTab) => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // FAQ List
  const faqs = [
    {
      q: "How do I change my avatar or profile cover photo?",
      a: "Navigate to your User Profile by clicking your profile icon or sidebar link. Hover over your avatar or the cover banner and click the camera icon. Choose an image file from your device, and it will update immediately without logging you out.",
      tag: "Profile",
    },
    {
      q: "How does the auto-detect location feature work?",
      a: "When you sign up or edit your profile, clicking 'Auto-Detect' uses your browser geolocation or secure IP lookup to identify your city, country, and geographic coordinates so you can connect with nearby peers.",
      tag: "Location",
    },
    {
      q: "How do I create or join research groups?",
      a: "Visit the 'Groups' page from the main navigation. You can explore suggested groups by academic field, click 'Join', or create your own research cluster to collaborate on projects.",
      tag: "Groups",
    },
    {
      q: "Where can I find peer-reviewed books and courses?",
      a: "Check out the Books and Courses sections in the navigation menu. You can browse published academic materials, enroll in peer-led modules, and participate in discussion threads.",
      tag: "Learning",
    },
    {
      q: "How do I report spam, plagiarism, or harassment?",
      a: "Click the three dots on any post or message and select 'Report Content'. Our community moderation team investigates all reports in accordance with our Content Policy within 24 hours.",
      tag: "Safety",
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Widget Container matching the exact design in the sidebar */}
      <div className="widget web-links stick-widget" style={{ marginBottom: "20px" }}>
        <h4 className="widget-title">
          Useful Links{" "}
          <button
            type="button"
            className="see-all"
            onClick={() => openTab("overview")}
            style={{
              background: "none",
              border: "none",
              color: "#088dcd",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
            }}
          >
            See All
          </button>
        </h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("about")}
              style={linkBtnStyle}
            >
              About
            </button>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("career")}
              style={linkBtnStyle}
            >
              Career
            </button>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("advertise")}
              style={linkBtnStyle}
            >
              Advertise
            </button>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("apps")}
              style={linkBtnStyle}
            >
              Updates Apps
            </button>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <Link href="/blog" style={linkStyle}>
              Updates Blog
            </Link>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("help")}
              style={linkBtnStyle}
            >
              Help
            </button>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("gifts")}
              style={linkBtnStyle}
            >
              Updates Gifts
            </button>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("content-policy")}
              style={linkBtnStyle}
            >
              Content Policy
            </button>
          </li>
          <li>
            <i className="icofont-dotted-right"></i>{" "}
            <button
              type="button"
              onClick={() => openTab("user-policy")}
              style={linkBtnStyle}
            >
              User Policy
            </button>
          </li>
        </ul>
        <p style={{ marginTop: "12px", fontSize: "12px", color: "#82828e" }}>
          &copy; Updates {currentYear}. All Rights Reserved.
        </p>
      </div>

      {/* Interactive Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "960px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px",
                borderBottom: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    backgroundColor: "#088dcd",
                    color: "#fff",
                    borderRadius: "8px",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  U
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#1e293b" }}>
                    Updates Information Hub
                  </h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    Everything you need to know about Updates & Extremis
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "22px",
                  color: "#64748b",
                  cursor: "pointer",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s",
                }}
                title="Close"
              >
                &times;
              </button>
            </div>

            {/* Modal Body with Sidebar Tabs & Content Area */}
            <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
              {/* Tabs Column */}
              <div
                style={{
                  width: "220px",
                  borderRight: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  padding: "12px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {[
                  { id: "overview", label: "Directory / Hub", icon: "icofont-layout" },
                  { id: "about", label: "About Us", icon: "icofont-info-circle" },
                  { id: "career", label: "Careers & Jobs", icon: "icofont-briefcase" },
                  { id: "advertise", label: "Advertise", icon: "icofont-megaphone" },
                  { id: "apps", label: "Updates Apps", icon: "icofont-smart-phone" },
                  { id: "blog", label: "Updates Blog", icon: "icofont-newspaper" },
                  { id: "help", label: "Help & FAQ", icon: "icofont-question-circle" },
                  { id: "gifts", label: "Updates Gifts", icon: "icofont-gift" },
                  { id: "content-policy", label: "Content Policy", icon: "icofont-law-order" },
                  { id: "user-policy", label: "User Policy", icon: "icofont-shield" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as UsefulLinkTab)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: activeTab === t.id ? "#088dcd" : "transparent",
                      color: activeTab === t.id ? "#ffffff" : "#475569",
                      fontWeight: activeTab === t.id ? "600" : "500",
                      fontSize: "13px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <i className={t.icon} style={{ fontSize: "15px" }}></i>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Main Content Column */}
              <div
                style={{
                  flex: 1,
                  padding: "24px",
                  overflowY: "auto",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* 1. OVERVIEW / DIRECTORY */}
                {activeTab === "overview" && (
                  <div>
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                        Useful Links & Resources Directory
                      </h4>
                      <p style={{ color: "#64748b", fontSize: "14px" }}>
                        Quick access to all official resources, programs, mobile applications, and community guidelines.
                      </p>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                        gap: "14px",
                      }}
                    >
                      {[
                        { id: "about", title: "About Updates", desc: "Our mission, academic network, and platform stats.", icon: "icofont-info-circle", color: "#3b82f6" },
                        { id: "career", title: "Careers", desc: "Open engineering, design, and research roles.", icon: "icofont-briefcase", color: "#10b981" },
                        { id: "advertise", title: "Advertise", desc: "Reach 25,000+ verified researchers & learners.", icon: "icofont-megaphone", color: "#f59e0b" },
                        { id: "apps", title: "Updates Apps", desc: "Android APK download & mobile progressive app.", icon: "icofont-smart-phone", color: "#8b5cf6" },
                        { id: "blog", title: "Updates Blog", desc: "Read latest articles, field notes & tech news.", icon: "icofont-newspaper", color: "#ec4899" },
                        { id: "help", title: "Help Center", desc: "Searchable FAQs and 24/7 dedicated support.", icon: "icofont-question-circle", color: "#06b6d4" },
                        { id: "gifts", title: "Updates Gifts", desc: "Badges, reward vouchers, and community perks.", icon: "icofont-gift", color: "#ef4444" },
                        { id: "content-policy", title: "Content Policy", desc: "Academic integrity, safety, and publishing rules.", icon: "icofont-law-order", color: "#64748b" },
                        { id: "user-policy", title: "User Policy", desc: "Terms of service, privacy, and data security.", icon: "icofont-shield", color: "#0f766e" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActiveTab(item.id as UsefulLinkTab)}
                          style={{
                            padding: "16px",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#f8fafc",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#088dcd";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(8, 141, 205, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.transform = "none";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              backgroundColor: `${item.color}15`,
                              color: item.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "18px",
                              marginBottom: "10px",
                            }}
                          >
                            <i className={item.icon}></i>
                          </div>
                          <h5 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
                            {item.title}
                          </h5>
                          <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. ABOUT US */}
                {activeTab === "about" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                      About Updates & Extremis Network
                    </h4>
                    <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                      Updates is a global academic and creative knowledge-sharing network designed to connect scholars,
                      developers, creators, and students. We believe knowledge thrives when ideas can be exchanged
                      freely across disciplines with verified authenticity and real-time collaboration.
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "14px",
                        marginBottom: "24px",
                      }}
                    >
                      <div style={statCardStyle}>
                        <h3 style={{ margin: 0, fontSize: "24px", color: "#088dcd", fontWeight: "800" }}>25,000+</h3>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Active Members</span>
                      </div>
                      <div style={statCardStyle}>
                        <h3 style={{ margin: 0, fontSize: "24px", color: "#10b981", fontWeight: "800" }}>120+</h3>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Universities & Hubs</span>
                      </div>
                      <div style={statCardStyle}>
                        <h3 style={{ margin: 0, fontSize: "24px", color: "#8b5cf6", fontWeight: "800" }}>99.9%</h3>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Uptime & Reliability</span>
                      </div>
                    </div>

                    <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "10px" }}>
                      Our Core Principles
                    </h5>
                    <ul style={{ paddingLeft: "20px", color: "#475569", fontSize: "14px", lineHeight: "1.8" }}>
                      <li><strong>Verified Academic Identity:</strong> Fostering authentic interactions and peer feedback.</li>
                      <li><strong>Cross-Disciplinary Discovery:</strong> Bridging technology, humanities, and sciences.</li>
                      <li><strong>Privacy & Data Ownership:</strong> Your research and content remain 100% yours.</li>
                      <li><strong>Global Accessibility:</strong> Low-bandwidth optimizations and offline mobile sync.</li>
                    </ul>
                  </div>
                )}

                {/* 3. CAREERS */}
                {activeTab === "career" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                      Careers at Updates
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "18px" }}>
                      We are building the future of open scientific exchange. Join our global, remote-first team.
                    </p>

                    {careerSubmitted ? (
                      <div style={successBoxStyle}>
                        <i className="icofont-check-circled" style={{ fontSize: "24px", color: "#10b981" }}></i>
                        <div>
                          <strong style={{ display: "block", color: "#065f46" }}>Application Submitted!</strong>
                          <span style={{ fontSize: "13px", color: "#047857" }}>
                            Thank you {applicantName}. Our recruitment team will review your application for {applicantRole} within 3 business days.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
                          {[
                            { role: "Senior Fullstack Engineer", type: "Full-Time • Remote", desc: "React/Next.js, Node.js, and MongoDB architecture." },
                            { role: "Mobile Application Developer", type: "Full-Time • Remote", desc: "Android Native (Kotlin) and cross-platform experience." },
                            { role: "AI & NLP Research Scientist", type: "Full-Time • Hybrid", desc: "Recommender systems, LLM fine-tuning, and semantic graphs." },
                            { role: "UI/UX Product Designer", type: "Contract • Remote", desc: "Design systems, mobile user journey, and prototyping." },
                          ].map((pos, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: "14px",
                                borderRadius: "10px",
                                border: applicantRole === pos.role ? "2px solid #088dcd" : "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: applicantRole === pos.role ? "#f0f9ff" : "#fff",
                                cursor: "pointer",
                              }}
                              onClick={() => setApplicantRole(pos.role)}
                            >
                              <div>
                                <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                                  {pos.role}
                                </h6>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>{pos.desc}</span>
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: "600", color: "#088dcd", whiteSpace: "nowrap" }}>
                                {pos.type}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Quick Application Form */}
                        <div style={{ backgroundColor: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                          <h6 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                            Apply for: {applicantRole}
                          </h6>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                            <input
                              type="text"
                              placeholder="Your Full Name"
                              value={applicantName}
                              onChange={(e) => setApplicantName(e.target.value)}
                              style={inputStyle}
                              required
                            />
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={applicantEmail}
                              onChange={(e) => setApplicantEmail(e.target.value)}
                              style={inputStyle}
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (applicantName && applicantEmail) setCareerSubmitted(true);
                            }}
                            style={{
                              backgroundColor: "#088dcd",
                              color: "#fff",
                              border: "none",
                              padding: "9px 20px",
                              borderRadius: "8px",
                              fontWeight: "600",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            Submit Application &rarr;
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* 4. ADVERTISE */}
                {activeTab === "advertise" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                      Advertise on Updates
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "18px" }}>
                      Put your academic program, tech tools, conferences, or publications in front of 25,000+ verified scholars.
                    </p>

                    {adSubmitted ? (
                      <div style={successBoxStyle}>
                        <i className="icofont-check-circled" style={{ fontSize: "24px", color: "#10b981" }}></i>
                        <div>
                          <strong style={{ display: "block", color: "#065f46" }}>Campaign Inquiry Received!</strong>
                          <span style={{ fontSize: "13px", color: "#047857" }}>
                            Thank you {adName}. Our advertising partnerships manager will contact {adEmail} with our Media Kit and custom placement proposal.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                        <div>
                          <h6 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "10px" }}>
                            Available Ad Formats
                          </h6>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={adFormatCard}>
                              <strong>Sponsored Feed Posts</strong>
                              <span>Native feed placement with rich media, link cards, and analytics.</span>
                            </div>
                            <div style={adFormatCard}>
                              <strong>Sidebar Display Banners</strong>
                              <span>Persistent top/sidebar impressions targeted by academic field.</span>
                            </div>
                            <div style={adFormatCard}>
                              <strong>Conference & Event Boost</strong>
                              <span>Promote webinars, symposiums, and paper callouts.</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ backgroundColor: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                          <h6 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                            Request Media Kit
                          </h6>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
                            <input
                              type="text"
                              placeholder="Organization / Company Name"
                              value={adName}
                              onChange={(e) => setAdName(e.target.value)}
                              style={inputStyle}
                            />
                            <input
                              type="email"
                              placeholder="Work Email"
                              value={adEmail}
                              onChange={(e) => setAdEmail(e.target.value)}
                              style={inputStyle}
                            />
                            <select
                              value={adBudget}
                              onChange={(e) => setAdBudget(e.target.value)}
                              style={inputStyle}
                            >
                              <option>$500 - $1,500 / month</option>
                              <option>$1,500 - $5,000 / month</option>
                              <option>$5,000+ Enterprise</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (adName && adEmail) setAdSubmitted(true);
                            }}
                            style={{
                              backgroundColor: "#f59e0b",
                              color: "#fff",
                              border: "none",
                              padding: "9px 20px",
                              borderRadius: "8px",
                              fontWeight: "600",
                              fontSize: "13px",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            Send Advertising Inquiry
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. UPDATES APPS */}
                {activeTab === "apps" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                      Updates Mobile & Desktop Apps
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                      Take Updates everywhere you go with instant push notifications, camera photo uploads, and offline reading.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                      {/* Android Card */}
                      <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f0fdf4" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <i className="icofont-android" style={{ fontSize: "32px", color: "#16a34a" }}></i>
                          <div>
                            <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#15803d" }}>Updates for Android</h5>
                            <span style={{ fontSize: "12px", color: "#166534" }}>Version 2.4.0 • APK Package</span>
                          </div>
                        </div>
                        <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.5", marginBottom: "14px" }}>
                          High-performance native Android app with image cropping, instant messaging, and GPS discovery.
                        </p>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Updates Android APK package is ready! Downloading updates-v2.4.0.apk...");
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            padding: "9px 18px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "13px",
                            textDecoration: "none",
                          }}
                        >
                          <i className="icofont-download"></i> Download Android APK
                        </a>
                      </div>

                      {/* Web App / PWA Card */}
                      <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <i className="icofont-globe" style={{ fontSize: "32px", color: "#088dcd" }}></i>
                          <div>
                            <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0369a1" }}>Progressive Web App</h5>
                            <span style={{ fontSize: "12px", color: "#0284c7" }}>iOS, Windows, Mac & Linux</span>
                          </div>
                        </div>
                        <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.5", marginBottom: "14px" }}>
                          Install directly from your browser to your home screen or desktop with 1 click.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            alert("To install Updates PWA: In your browser menu, click 'Install Updates' or 'Add to Home Screen'.");
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#088dcd",
                            color: "#fff",
                            padding: "9px 18px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "13px",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <i className="icofont-plus-circle"></i> Add to Home Screen
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. UPDATES BLOG */}
                {activeTab === "blog" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <div>
                        <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                          Updates Official Blog
                        </h4>
                        <span style={{ color: "#64748b", fontSize: "13px" }}>
                          Insights, research breakthroughs, and technical announcements
                        </span>
                      </div>
                      <Link
                        href="/blog"
                        onClick={closeModal}
                        style={{
                          backgroundColor: "#ec4899",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Visit Full Blog &rarr;
                      </Link>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[
                        {
                          title: "Announcing Updates 2.0: Real-Time Academic Collaboration",
                          date: "September 15, 2026",
                          read: "4 min read",
                          desc: "Explore our revamped real-time feeds, profile customizations, and collaborative research clusters.",
                        },
                        {
                          title: "The Role of Micro-Communities in Scientific Discovery",
                          date: "August 28, 2026",
                          read: "6 min read",
                          desc: "How targeted groups enable researchers to solve specialized challenges faster than ever before.",
                        },
                        {
                          title: "Mobile-First Knowledge Sharing for Remote Institutions",
                          date: "August 10, 2026",
                          read: "5 min read",
                          desc: "Optimizing communication pipelines for students and faculties with intermittent connectivity.",
                        },
                      ].map((art, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "16px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#fdf2f8",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#db2777", fontWeight: "600" }}>{art.date}</span>
                            <span style={{ fontSize: "12px", color: "#9ca3af" }}>{art.read}</span>
                          </div>
                          <h6 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
                            {art.title}
                          </h6>
                          <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>{art.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. HELP & FAQ */}
                {activeTab === "help" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                      Help & Support Center
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "14px" }}>
                      Find instant answers to common questions or reach our support team directly.
                    </p>

                    <div style={{ marginBottom: "18px" }}>
                      <input
                        type="text"
                        placeholder="Search questions (e.g. avatar, location, groups)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          ...inputStyle,
                          padding: "10px 14px",
                          fontSize: "14px",
                          borderColor: "#cbd5e1",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                      {filteredFaqs.map((faq, index) => (
                        <details
                          key={index}
                          style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <summary style={{ fontWeight: "600", fontSize: "14px", color: "#1e293b", cursor: "pointer" }}>
                            <span
                              style={{
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                                fontSize: "11px",
                                fontWeight: "700",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                marginRight: "8px",
                              }}
                            >
                              {faq.tag}
                            </span>
                            {faq.q}
                          </summary>
                          <p style={{ margin: "10px 0 0 0", fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                            {faq.a}
                          </p>
                        </details>
                      ))}
                    </div>

                    {/* Send Support Ticket */}
                    <div style={{ padding: "18px", backgroundColor: "#f1f5f9", borderRadius: "12px" }}>
                      <h6 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                        Can't find what you are looking for? Contact Support
                      </h6>
                      {helpSubmitted ? (
                        <div style={successBoxStyle}>
                          <i className="icofont-check-circled" style={{ fontSize: "20px", color: "#10b981" }}></i>
                          <span style={{ fontSize: "13px", color: "#065f46" }}>
                            Ticket submitted! Ticket #UP-{Math.floor(1000 + Math.random() * 9000)} opened. Response within 2 hours.
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <input
                            type="text"
                            placeholder="Subject / Issue description"
                            value={helpSubject}
                            onChange={(e) => setHelpSubject(e.target.value)}
                            style={inputStyle}
                          />
                          <textarea
                            placeholder="Details of the issue or feedback..."
                            value={helpMessage}
                            onChange={(e) => setHelpMessage(e.target.value)}
                            rows={3}
                            style={{ ...inputStyle, resize: "none" }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (helpSubject && helpMessage) setHelpSubmitted(true);
                            }}
                            style={{
                              alignSelf: "flex-start",
                              backgroundColor: "#088dcd",
                              color: "#fff",
                              border: "none",
                              padding: "8px 18px",
                              borderRadius: "8px",
                              fontWeight: "600",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            Send Help Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 8. UPDATES GIFTS & REWARDS */}
                {activeTab === "gifts" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
                      Updates Gifts & Community Rewards
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "18px" }}>
                      Earn knowledge credits by authoring posts, answering academic questions, and helping fellow researchers.
                    </p>

                    <div style={{ padding: "16px", backgroundColor: "#fff7ed", borderRadius: "10px", border: "1px solid #fed7aa", marginBottom: "18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span style={{ fontSize: "12px", color: "#c2410c", fontWeight: "600" }}>Your Balance</span>
                        <h3 style={{ margin: 0, fontSize: "22px", color: "#ea580c", fontWeight: "800" }}>1,250 Knowledge Points</h3>
                      </div>
                      <Link
                        href="/products"
                        onClick={closeModal}
                        style={{
                          backgroundColor: "#ea580c",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontWeight: "600",
                          fontSize: "13px",
                          textDecoration: "none",
                        }}
                      >
                        View Rewards Store &rarr;
                      </Link>
                    </div>

                    {redeemedItem && (
                      <div style={{ ...successBoxStyle, marginBottom: "16px" }}>
                        <i className="icofont-check-circled" style={{ fontSize: "20px", color: "#10b981" }}></i>
                        <span style={{ fontSize: "13px", color: "#065f46" }}>
                          Successfully redeemed: <strong>{redeemedItem}</strong>! Check your profile badges or email for confirmation.
                        </span>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { name: "Verified Researcher Badge", pts: 500, desc: "Displays a verified scholar checkmark on your profile and posts." },
                        { name: "Academic Book Voucher ($25)", pts: 750, desc: "Redeemable against any textbook or publication in Books." },
                        { name: "Spotlight Post Boost", pts: 1000, desc: "Pin your research paper to the top of your group feed for 7 days." },
                        { name: "Official Swag Pack", pts: 2500, desc: "Updates notebook, mug, stickers, and developer laptop sleeve." },
                      ].map((reward, i) => (
                        <div
                          key={i}
                          style={{
                            padding: "16px",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "#f8fafc",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                              <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{reward.name}</h6>
                              <span style={{ fontSize: "12px", color: "#ea580c", fontWeight: "700" }}>{reward.pts} pts</span>
                            </div>
                            <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#64748b" }}>{reward.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRedeemedItem(reward.name)}
                            style={{
                              backgroundColor: "#ffffff",
                              border: "1px solid #088dcd",
                              color: "#088dcd",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            Redeem Gift
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. CONTENT POLICY */}
                {activeTab === "content-policy" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                      Updates Content & Community Policy
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>
                      Last updated: September 2026 • Version 3.1
                    </p>

                    <div style={{ color: "#334155", fontSize: "14px", lineHeight: "1.7", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          1. Academic Honesty & Intellectual Property
                        </h6>
                        <p style={{ margin: 0 }}>
                          Users must provide proper attribution and citations when quoting or building on external research.
                          Uploading plagiarized work, copyrighted journal papers without distribution rights, or proprietary data is strictly prohibited.
                        </p>
                      </section>

                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          2. Harassment & Hate Speech
                        </h6>
                        <p style={{ margin: 0 }}>
                          We maintain zero tolerance for personal attacks, discriminatory conduct, hate speech, or harassment based on race, ethnicity, gender, sexual orientation, disability, or religious beliefs.
                        </p>
                      </section>

                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          3. Misinformation & Manipulation
                        </h6>
                        <p style={{ margin: 0 }}>
                          Do not publish fabricated scientific conclusions, misleading medical claims, or deceptive impersonation. Content flagged by peer reviewers will undergo editorial verification.
                        </p>
                      </section>

                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          4. Enforcement & Reporting
                        </h6>
                        <p style={{ margin: 0 }}>
                          Violations result in progressive enforcement: warning notice, temporary post restriction, or permanent account termination.
                        </p>
                      </section>
                    </div>
                  </div>
                )}

                {/* 10. USER POLICY & PRIVACY */}
                {activeTab === "user-policy" && (
                  <div>
                    <h4 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                      User Policy & Privacy Terms
                    </h4>
                    <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>
                      Last updated: September 2026 • Compliant with GDPR & International Data Standards
                    </p>

                    <div style={{ color: "#334155", fontSize: "14px", lineHeight: "1.7", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          1. Account Credentials & Security
                        </h6>
                        <p style={{ margin: 0 }}>
                          You are responsible for safeguarding your login credentials. Updates will never request your password via direct message or email.
                        </p>
                      </section>

                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          2. Data Privacy & Encryption
                        </h6>
                        <p style={{ margin: 0 }}>
                          Personal identifiers, locations, and chat communications are protected with industry-standard encryption. We never sell your personal data to third-party ad networks.
                        </p>
                      </section>

                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          3. Your Content Rights
                        </h6>
                        <p style={{ margin: 0 }}>
                          You retain complete ownership of all articles, publications, slides, and media you submit to Updates. You grant Updates a non-exclusive license to display and index your content for community discovery.
                        </p>
                      </section>

                      <section>
                        <h6 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>
                          4. Account Termination & Data Export
                        </h6>
                        <p style={{ margin: 0 }}>
                          You can request a complete export of your research posts, comments, and messages, or delete your account at any time via Settings.
                        </p>
                      </section>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 24px",
                borderTop: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <span>Updates Knowledge Network • Built for Researchers & Creators</span>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  backgroundColor: "#088dcd",
                  color: "#fff",
                  border: "none",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const linkBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: "inherit",
  font: "inherit",
  cursor: "pointer",
  textTransform: "capitalize",
};

const linkStyle: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
};

const statCardStyle: React.CSSProperties = {
  padding: "14px",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  textAlign: "center",
};

const successBoxStyle: React.CSSProperties = {
  backgroundColor: "#ecfdf5",
  border: "1px solid #a7f3d0",
  borderRadius: "10px",
  padding: "14px 18px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "13px",
  outline: "none",
  backgroundColor: "#ffffff",
};

const adFormatCard: React.CSSProperties = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "13px",
};
