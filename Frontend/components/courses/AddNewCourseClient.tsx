"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";

type PublishType = "course" | "book";

const CATEGORIES_DATA: Record<string, string[]> = {
  "IT & Software": [
    "React & Next.js",
    "Python & Machine Learning",
    "Node.js & Backend Architecture",
    "Cybersecurity & Networks",
    "Cloud Computing & DevOps",
  ],
  "AI & Data Science": [
    "Deep Learning & PyTorch",
    "Natural Language Processing",
    "Computer Vision",
    "Data Engineering",
    "Reinforcement Learning",
  ],
  "Engineering & Robotics": [
    "Autonomous Systems",
    "Control Engineering",
    "Embedded Systems",
    "VLSI & Circuit Design",
  ],
  "Medicine & BioSciences": [
    "Computational Biology",
    "Genomics & Bioinformatics",
    "Clinical Research Methods",
    "Neuroscience",
  ],
  "Business & Finance": [
    "Quantitative Finance",
    "Venture Capital & Startups",
    "Data Analytics for Managers",
    "Microeconomics",
  ],
};

export default function AddNewCourseClient() {
  const router = useRouter();

  // Form State
  const [publishType, setPublishType] = useState<PublishType>("course");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("IT & Software");
  const [subcategory, setSubcategory] = useState("React & Next.js");
  const [level, setLevel] = useState("All Levels");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [price, setPrice] = useState("29.99");
  const [isFree, setIsFree] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  // Dynamic Objectives & Requirements
  const [objectives, setObjectives] = useState<string[]>([
    "Build full-stack production-grade applications",
    "Master state management and scalable API design",
  ]);
  const [newObjective, setNewObjective] = useState("");

  const [requirements, setRequirements] = useState<string[]>([
    "Basic knowledge of modern JavaScript (ES6+)",
  ]);
  const [newRequirement, setNewRequirement] = useState("");

  // Cover image upload preview
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status & Feedback
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [savedDraft, setSavedDraft] = useState(false);

  // Recent video modal
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const subcats = CATEGORIES_DATA[newCategory] || [];
    if (subcats.length > 0) {
      setSubcategory(subcats[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError("Please enter a title for your course or book.");
      return;
    }

    if (!description.trim()) {
      setValidationError("Please provide a course description or syllabus overview.");
      return;
    }

    setIsPublishing(true);

    // Simulate creation/publishing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsPublishing(false);
    setPublishedSuccess(true);
  };

  return (
    <div className="theme-layout">
      <HomeHeader />

      {/* Top Carousel Nav Shortcuts */}
      <section>
        <div className="white-bg" style={{ borderBottom: "1px solid #eef2f6" }}>
          <div className="container-fluid">
            <div className="menu-caro">
              <div className="row align-items-center">
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
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="page-caro" style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
                    <div className="link-item">
                      <Link href="/" title="">
                        <i>
                          <svg
                            className="feather feather-zap"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                            height="20"
                            width="20"
                          >
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                        </i>
                        <p>Newsfeed</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link href="/videos" title="">
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
                            className="feather feather-youtube"
                          >
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                          </svg>
                        </i>
                        <p>Videos</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link className="active" href="/courses" title="">
                        <i>
                          <svg
                            className="feather feather-airplay"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                            height="20"
                            width="20"
                          >
                            <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                            <polygon points="12 15 17 21 7 21 12 15" />
                          </svg>
                        </i>
                        <p>Courses</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link href="/books" title="">
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
                            className="feather feather-book"
                          >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        </i>
                        <p>Books</p>
                      </Link>
                    </div>
                    <div className="link-item">
                      <Link href="/blog" title="">
                        <i>
                          <svg
                            className="feather feather-layout"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                            height="20"
                            width="20"
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
                            height="20"
                            width="20"
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
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="user-inf text-end" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
                    <div className="folowerz" style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>
                      Instructor: <span style={{ color: "#2563eb" }}>Dr. Danial</span>
                    </div>
                    <ul className="stars" style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, gap: "2px", color: "#f59e0b" }}>
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

      {/* Main Section */}
      <section>
        <div className="gap" style={{ padding: "35px 0" }}>
          <div className="container">
            <div className="row">
              {/* Left Column: Sidebar Widgets */}
              <div className="col-lg-4">
                <aside className="sidebar">
                  {/* Recent Media Widget */}
                  <div
                    className="widget"
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "20px",
                      border: "1px solid #e2e8f0",
                      marginBottom: "24px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    <h4 className="widget-title" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>
                      🎬 Instructor Media Inspiration
                    </h4>
                    <div className="recent-media" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <figure style={{ position: "relative", borderRadius: "10px", overflow: "hidden", margin: 0 }}>
                        <img
                          src="/images/resources/course-6.jpg"
                          alt="Vue.js Tutorial"
                          style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/resources/user1.jpg";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setActiveVideoModal("https://www.youtube.com/embed/nOCXXHGMezU")}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "rgba(37, 99, 235, 0.9)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "18px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i className="icofont-play"></i>
                        </button>
                        <span
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            left: "10px",
                            background: "rgba(15, 23, 42, 0.8)",
                            color: "#ffffff",
                            fontSize: "12px",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontWeight: 500,
                          }}
                        >
                          Vue.js Interactive Masterclass
                        </span>
                      </figure>

                      <figure style={{ position: "relative", borderRadius: "10px", overflow: "hidden", margin: 0 }}>
                        <img
                          src="/images/resources/course-1.jpg"
                          alt="CSS3 Modern Layouts"
                          style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/resources/user2.jpg";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setActiveVideoModal("https://www.youtube.com/embed/nOCXXHGMezU")}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "rgba(37, 99, 235, 0.9)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "18px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i className="icofont-play"></i>
                        </button>
                        <span
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            left: "10px",
                            background: "rgba(15, 23, 42, 0.8)",
                            color: "#ffffff",
                            fontSize: "12px",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontWeight: 500,
                          }}
                        >
                          CSS3 Flexbox & Grid Architecture
                        </span>
                      </figure>
                    </div>
                  </div>

                  {/* Post Analytics Widget */}
                  <div
                    className="widget"
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "20px",
                      border: "1px solid #e2e8f0",
                      marginBottom: "24px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    <h4 className="widget-title" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>
                      📊 Author & Course Reach
                    </h4>
                    <ul
                      className="widget-analytics"
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                        <span>Student Reads / Views</span>
                        <span style={{ fontWeight: 700, color: "#0f172a" }}>1,456</span>
                      </li>
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                        <span>Recommendations</span>
                        <span style={{ fontWeight: 700, color: "#2563eb" }}>142</span>
                      </li>
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                        <span>Community Shares</span>
                        <span style={{ fontWeight: 700, color: "#059669" }}>328</span>
                      </li>
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b" }}>
                        <span>Academic Citations</span>
                        <span style={{ fontWeight: 700, color: "#7c3aed" }}>89</span>
                      </li>
                    </ul>
                  </div>

                  {/* Add Credits / Payout Setup Widget */}
                  <div
                    className="widget"
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "20px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    <h4 className="widget-title" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>
                      💳 Instructor Payout Account
                    </h4>
                    <div className="set-card" style={{ textAlign: "center" }}>
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "10px",
                          padding: "16px",
                          marginBottom: "14px",
                          border: "1px dashed #cbd5e1",
                        }}
                      >
                        <img
                          src="/images/paypal.png"
                          alt="PayPal"
                          style={{ height: "30px", marginBottom: "8px", objectFit: "contain" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                          Receive automated payouts directly when scholars purchase your course or book.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert("Payout configuration modal opened.")}
                        style={{
                          background: "#2563eb",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "9px 20px",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Configure Payouts
                      </button>
                      <div className="added-complete" style={{ marginTop: "14px" }}>
                        <h6 style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                          Account Status: <span style={{ color: "#10b981", fontWeight: 600 }}>Active & Verified</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Right Column: Main Form */}
              <div className="col-lg-8">
                <div
                  className="main-wraper"
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "32px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Title & Description */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                    <div>
                      <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
                        Publish New Course or Book
                      </h3>
                      <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                        Add an interactive course or academic textbook to the <b>Socimo Marketplace</b> for global scholars.
                      </p>
                    </div>

                    {/* Format Toggle */}
                    <div
                      style={{
                        display: "flex",
                        background: "#f1f5f9",
                        borderRadius: "10px",
                        padding: "4px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setPublishType("course")}
                        style={{
                          background: publishType === "course" ? "#2563eb" : "transparent",
                          color: publishType === "course" ? "#ffffff" : "#475569",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        🎓 Online Course
                      </button>
                      <button
                        type="button"
                        onClick={() => setPublishType("book")}
                        style={{
                          background: publishType === "book" ? "#2563eb" : "transparent",
                          color: publishType === "book" ? "#ffffff" : "#475569",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        📚 Academic Book
                      </button>
                    </div>
                  </div>

                  {/* Success Alert */}
                  {publishedSuccess && (
                    <div
                      style={{
                        background: "#ecfdf5",
                        border: "1px solid #10b981",
                        borderRadius: "12px",
                        padding: "18px 22px",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "24px" }}>🎉</span>
                        <div>
                          <h5 style={{ margin: 0, color: "#065f46", fontWeight: 700, fontSize: "15px" }}>
                            Successfully Published!
                          </h5>
                          <p style={{ margin: 0, color: "#047857", fontSize: "13px" }}>
                            Your {publishType === "course" ? "course" : "book"} &ldquo;{title}&rdquo; is now live in the Socimo Marketplace catalog.
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Link
                          href={publishType === "course" ? "/courses" : "/books"}
                          style={{
                            background: "#059669",
                            color: "#ffffff",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                        >
                          View Marketplace
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setPublishedSuccess(false);
                            setTitle("");
                            setSubtitle("");
                            setDescription("");
                            setCoverPreview(null);
                          }}
                          style={{
                            background: "transparent",
                            border: "1px solid #059669",
                            color: "#059669",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Create Another
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Validation Error Alert */}
                  {validationError && (
                    <div
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #ef4444",
                        color: "#991b1b",
                        borderRadius: "10px",
                        padding: "12px 18px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span>⚠️</span>
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Draft Saved Toast */}
                  {savedDraft && (
                    <div
                      style={{
                        background: "#eff6ff",
                        border: "1px solid #3b82f6",
                        color: "#1d4ed8",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        marginBottom: "20px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      💾 Draft saved to your local storage!
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Title */}
                      <div className="col-lg-6 col-md-6 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          {publishType === "course" ? "Course Title" : "Book Title"} *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={publishType === "course" ? "e.g. Master Modern Distributed Systems" : "e.g. Quantum Algorithms in Practice"}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="col-lg-6 col-md-6 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Subtitle / Tagline
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. From first principles to production deployments"
                          value={subtitle}
                          onChange={(e) => setSubtitle(e.target.value)}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        />
                      </div>

                      {/* Language */}
                      <div className="col-lg-4 col-md-6 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Primary Language
                        </label>
                        <select
                          className="form-select"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish (Español)</option>
                          <option value="French">French (Français)</option>
                          <option value="German">German (Deutsch)</option>
                          <option value="Mandarin">Mandarin (中文)</option>
                          <option value="Japanese">Japanese (日本語)</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div className="col-lg-4 col-md-6 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Academic Domain / Category
                        </label>
                        <select
                          className="form-select"
                          value={category}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        >
                          {Object.keys(CATEGORIES_DATA).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory */}
                      <div className="col-lg-4 col-md-6 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Topic / Subcategory
                        </label>
                        <select
                          className="form-select"
                          value={subcategory}
                          onChange={(e) => setSubcategory(e.target.value)}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        >
                          {(CATEGORIES_DATA[category] || []).map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Level & Format */}
                      <div className="col-lg-4 col-md-6 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Difficulty Level
                        </label>
                        <select
                          className="form-select"
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        >
                          <option value="All Levels">All Levels</option>
                          <option value="Beginner">Beginner / Undergraduate</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced / Post-Doc</option>
                        </select>
                      </div>

                      {/* Pricing Model */}
                      <div className="col-lg-4 col-md-6 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Access Type
                        </label>
                        <select
                          className="form-select"
                          value={isFree ? "Free" : "Paid"}
                          onChange={(e) => setIsFree(e.target.value === "Free")}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        >
                          <option value="Paid">Paid Marketplace Item</option>
                          <option value="Free">Open Access (Free)</option>
                        </select>
                      </div>

                      {/* Price & Currency */}
                      {!isFree && (
                        <div className="col-lg-4 col-md-6 mb-3">
                          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                            Price ({currency})
                          </label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <select
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              style={{
                                width: "90px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                padding: "10px 8px",
                                fontSize: "14px",
                              }}
                            >
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="CAD">CAD ($)</option>
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="form-control"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              style={{
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                padding: "10px 14px",
                                fontSize: "14px",
                                flex: 1,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      <div className="col-12 mb-3">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          {publishType === "course" ? "Course Description & Syllabus Overview" : "Book Abstract & Chapter Summary"} *
                        </label>
                        <textarea
                          rows={5}
                          className="form-control"
                          placeholder="Describe the topics covered, learning methodology, theoretical background, and hands-on exercises..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "12px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        />
                      </div>

                      {/* Learning Objectives dynamic builder */}
                      <div className="col-12 mb-4">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Key Learning Objectives (What scholars will learn)
                        </label>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add a key outcome or learning objective..."
                            value={newObjective}
                            onChange={(e) => setNewObjective(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddObjective();
                              }
                            }}
                            style={{
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              padding: "9px 14px",
                              fontSize: "14px",
                              flex: 1,
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddObjective}
                            style={{
                              background: "#f1f5f9",
                              color: "#334155",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              padding: "0 18px",
                              fontWeight: 600,
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            + Add
                          </button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {objectives.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#f8fafc",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                fontSize: "13px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ color: "#2563eb", fontWeight: "bold" }}>✓</span>
                                <span>{item}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveObjective(idx)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#94a3b8",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  lineHeight: 1,
                                }}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dropzone / Media Upload */}
                      <div className="col-12 mb-4">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Course Cover Image / Video Teaser
                        </label>
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border: "2px dashed #93c5fd",
                            borderRadius: "12px",
                            background: "#f8fafc",
                            padding: "30px 20px",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                          />

                          {coverPreview ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                              <img
                                src={coverPreview}
                                alt="Cover preview"
                                style={{
                                  maxHeight: "160px",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                }}
                              />
                              <span style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600 }}>
                                {coverFileName} (Click or drag to replace)
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  background: "#eff6ff",
                                  color: "#2563eb",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto 12px",
                                  fontSize: "22px",
                                }}
                              >
                                📁
                              </div>
                              <h6 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>
                                Drag and drop your cover thumbnail here
                              </h6>
                              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                                High-resolution JPG, PNG or WEBP recommended (1280x720)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Preview Teaser URL */}
                      <div className="col-12 mb-4">
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Promotional Video Preview URL (YouTube / Vimeo / Cloud)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://www.youtube.com/watch?v=nOCXXHGMezU"
                          value={previewVideoUrl}
                          onChange={(e) => setPreviewVideoUrl(e.target.value)}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            padding: "10px 14px",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="col-12" style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "10px" }}>
                        <button
                          type="submit"
                          disabled={isPublishing}
                          style={{
                            background: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "30px",
                            padding: "12px 32px",
                            fontSize: "15px",
                            fontWeight: 700,
                            cursor: isPublishing ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {isPublishing ? (
                            <>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "16px",
                                  height: "16px",
                                  border: "2px solid #ffffff",
                                  borderTopColor: "transparent",
                                  borderRadius: "50%",
                                  animation: "spin 0.8s linear infinite",
                                }}
                              />
                              Publishing...
                            </>
                          ) : (
                            <>🚀 Publish to Marketplace</>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          style={{
                            background: "#f1f5f9",
                            color: "#334155",
                            border: "1px solid #cbd5e1",
                            borderRadius: "30px",
                            padding: "12px 24px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          Save Draft
                        </button>

                        <Link
                          href="/courses"
                          style={{
                            color: "#64748b",
                            fontSize: "14px",
                            fontWeight: 500,
                            marginLeft: "8px",
                            textDecoration: "none",
                          }}
                        >
                          Cancel
                        </Link>
                      </div>

                      {/* Special Note Box */}
                      <div className="col-12 mt-4">
                        <div
                          style={{
                            background: "#f8fafc",
                            borderLeft: "4px solid #2563eb",
                            padding: "14px 18px",
                            borderRadius: "0 8px 8px 0",
                          }}
                        >
                          <b style={{ color: "#1e293b", fontSize: "13px" }}>Socimo Quality Standard:</b>
                          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
                            All educational content is verified against academic authenticity and open research guidelines. You retain full intellectual property and publication royalties.
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview Modal */}
      {activeVideoModal && (
        <div
          onClick={() => setActiveVideoModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              aspectRatio: "16/9",
              background: "#000000",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setActiveVideoModal(null)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                zIndex: 10,
                fontSize: "18px",
              }}
            >
              &times;
            </button>
            <iframe
              src={activeVideoModal}
              title="Video Tutorial"
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Full Course Footer */}
      <AppFooter />
    </div>
  );
}
