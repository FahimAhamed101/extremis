"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useMemo } from "react";
import Link from "next/link";

export type PageItem = {
  id: string;
  name: string;
  handle: string;
  category: "Research Labs" | "Universities" | "Tech Companies" | "Scientific Journals" | "Open Source";
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  followersCount: number;
  postsCount: number;
  isFollowing?: boolean;
  verified?: boolean;
  featuredPost?: {
    title: string;
    date: string;
    snippet: string;
  };
};

const INITIAL_PAGES: PageItem[] = [
  {
    id: "pg-1",
    name: "MIT CSAIL Robotics & AI",
    handle: "@mit_csail_robotics",
    category: "Research Labs",
    avatar: "/images/resources/friend-avatar.jpg",
    coverImage: "/images/resources/slider1.jpg",
    bio: "Computer Science & Artificial Intelligence Laboratory at MIT. Pioneering autonomous perception, dexterous manipulation, and robotic foundation models.",
    location: "Cambridge, MA, USA",
    website: "https://csail.mit.edu",
    followersCount: 84200,
    postsCount: 1420,
    isFollowing: true,
    verified: true,
    featuredPost: {
      title: "Real-Time Diffusion Policy for Quadruped Locomotion on Unstructured Terrain",
      date: "2 days ago",
      snippet: "Our latest preprint demonstrates zero-shot sim-to-real transfer of agile climbing policies on loose gravel and slippery ice.",
    },
  },
  {
    id: "pg-2",
    name: "CERN Particle Physics Directorate",
    handle: "@cern_official",
    category: "Research Labs",
    avatar: "/images/resources/friend-avatar2.jpg",
    coverImage: "/images/resources/slider2.jpg",
    bio: "European Organization for Nuclear Research. Probing fundamental particle interactions, Higgs precision measurements, and High-Luminosity LHC upgrades.",
    location: "Geneva, Switzerland",
    website: "https://home.cern",
    followersCount: 195000,
    postsCount: 3800,
    isFollowing: false,
    verified: true,
    featuredPost: {
      title: "New Upper Bounds on Rare B-Meson Lepton Flavor Universality Tests",
      date: "Yesterday",
      snippet: "ATLAS and CMS complete combined analysis on 13.6 TeV collision dataset, tightening limits on leptoquark candidates.",
    },
  },
  {
    id: "pg-3",
    name: "Stanford University School of Engineering",
    handle: "@stanford_engineering",
    category: "Universities",
    avatar: "/images/resources/friend-avatar3.jpg",
    coverImage: "/images/resources/slider3.jpg",
    bio: "Innovating across biological engineering, applied physics, materials science, and human-centered artificial intelligence.",
    location: "Stanford, CA, USA",
    website: "https://engineering.stanford.edu",
    followersCount: 128400,
    postsCount: 2200,
    isFollowing: true,
    verified: true,
    featuredPost: {
      title: "Fall 2026 Distinguished Lecture Series in Quantum Computing & Photonics",
      date: "Sep 10, 2026",
      snippet: "Open campus lectures featuring guest keynotes from pioneers in topological qubits and optical neural networks.",
    },
  },
  {
    id: "pg-4",
    name: "DeepMind AlphaFold & Biomolecular Systems",
    handle: "@deepmind_bio",
    category: "Tech Companies",
    avatar: "/images/resources/friend-avatar4.jpg",
    coverImage: "/images/resources/slider1.jpg",
    bio: "Applying advanced deep neural architectures to macromolecular structural biology, ligand docking, and novel enzyme generation.",
    location: "London, UK",
    website: "https://deepmind.google/technologies/alphafold",
    followersCount: 164000,
    postsCount: 940,
    isFollowing: false,
    verified: true,
    featuredPost: {
      title: "AlphaFold 3 Multimer Complexes Validated on Cryo-EM Crystal Datasets",
      date: "3 days ago",
      snippet: "High-accuracy predictions for RNA-protein complexes and covalent drug candidates now available to the academic community.",
    },
  },
  {
    id: "pg-5",
    name: "Journal of Open Source Software & Science (JOSS)",
    handle: "@joss_journal",
    category: "Scientific Journals",
    avatar: "/images/resources/friend-avatar5.jpg",
    coverImage: "/images/resources/slider2.jpg",
    bio: "Peer-reviewed developer-friendly academic journal for research software, reproducible benchmarks, and computational workflows.",
    location: "Global / Open Access",
    website: "https://joss.theoj.org",
    followersCount: 41200,
    postsCount: 650,
    isFollowing: false,
    verified: true,
    featuredPost: {
      title: "Special Issue on High-Performance Rust & Julia Numerical Libraries",
      date: "5 days ago",
      snippet: "Submissions open for verified scientific packages with continuous integration testing and automated documentation.",
    },
  },
  {
    id: "pg-6",
    name: "Hugging Face Open Science Initiative",
    handle: "@huggingface_science",
    category: "Open Source",
    avatar: "/images/resources/user-avatar.jpg",
    coverImage: "/images/resources/slider3.jpg",
    bio: "Democratizing machine learning through open-weights weights, shared datasets, distributed evaluation hubs, and public benchmarks.",
    location: "Paris, France & New York, USA",
    website: "https://huggingface.co",
    followersCount: 210000,
    postsCount: 3100,
    isFollowing: true,
    verified: true,
    featuredPost: {
      title: "Announcing Open-R1: Reproducing High-Tier Reasoning Models Fully Open",
      date: "Just now",
      snippet: "Training logs, RL datasets, and reward models released under permissive Apache 2.0 license for community inspection.",
    },
  },
];

const CATEGORIES = [
  "All Pages",
  "Research Labs",
  "Universities",
  "Tech Companies",
  "Scientific Journals",
  "Open Source",
] as const;

export default function PagesDirectoryClient() {
  const [pages, setPages] = useState<PageItem[]>(INITIAL_PAGES);
  const [activeCategory, setActiveCategory] = useState<string>("All Pages");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "following" | "verified">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Page Detail Modal
  const [detailPage, setDetailPage] = useState<PageItem | null>(null);

  // Create Page Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHandle, setNewHandle] = useState("");
  const [newCategory, setNewCategory] = useState<PageItem["category"]>("Research Labs");
  const [newLocation, setNewLocation] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newBio, setNewBio] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleFollow = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPages((prev) =>
      prev.map((pg) => {
        if (pg.id !== id) return pg;
        const nowFollowing = !pg.isFollowing;
        return {
          ...pg,
          isFollowing: nowFollowing,
          followersCount: nowFollowing ? pg.followersCount + 1 : Math.max(0, pg.followersCount - 1),
        };
      })
    );
    showToast("✓ Page following preferences updated!");
  };

  const handleSharePage = (pg: PageItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`${window.location.origin}/pages#${pg.handle.replace("@", "")}`);
      showToast("✓ Page URL copied to clipboard!");
    } else {
      showToast("✓ Page link ready to share!");
    }
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const formattedHandle = newHandle.trim()
      ? (newHandle.startsWith("@") ? newHandle.trim() : `@${newHandle.trim()}`)
      : `@${newName.toLowerCase().replace(/\s+/g, "_")}`;

    const created: PageItem = {
      id: `pg-${Date.now()}`,
      name: newName.trim(),
      handle: formattedHandle,
      category: newCategory,
      avatar: "/images/resources/user-avatar.jpg",
      coverImage: "/images/resources/slider1.jpg",
      bio: newBio.trim() || "Official Page on Socimo.",
      location: newLocation.trim() || "Global",
      website: newWebsite.trim() || "https://socimo.org",
      followersCount: 1,
      postsCount: 0,
      isFollowing: true,
      verified: true,
      featuredPost: {
        title: `Welcome to the official ${newName} page!`,
        date: "Just now",
        snippet: "Follow us to stay updated with our latest papers, publications, and collaborative projects.",
      },
    };

    setPages((prev) => [created, ...prev]);
    setIsCreateModalOpen(false);
    setNewName("");
    setNewHandle("");
    setNewLocation("");
    setNewWebsite("");
    setNewBio("");
    showToast(`🎉 Official page for "${created.name}" created successfully!`);
  };

  const filteredPages = useMemo(() => {
    return pages.filter((pg) => {
      // Category filter
      if (activeCategory !== "All Pages" && pg.category !== activeCategory) {
        return false;
      }
      // Tab filter
      if (activeTab === "following" && !pg.isFollowing) return false;
      if (activeTab === "verified" && !pg.verified) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pg.name.toLowerCase().includes(q);
        const matchesHandle = pg.handle.toLowerCase().includes(q);
        const matchesBio = pg.bio.toLowerCase().includes(q);
        const matchesLoc = pg.location.toLowerCase().includes(q);
        if (!matchesName && !matchesHandle && !matchesBio && !matchesLoc) {
          return false;
        }
      }
      return true;
    });
  }, [pages, activeCategory, activeTab, searchQuery]);

  return (
    <section className="pages-directory-section" style={{ minHeight: "90vh", backgroundColor: "#f0f2f5", paddingBottom: "60px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: 500,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Area */}
      <div
        style={{
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)",
          color: "#ffffff",
          padding: "36px 0 28px 0",
          boxShadow: "0 4px 20px -2px rgba(2, 132, 199, 0.25)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-7">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Facebook-Style Pages
                </span>
                <span style={{ fontSize: "13px", opacity: 0.9 }}>• Discover Academic & Tech Pages</span>
              </div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "0 0 10px 0", color: "#ffffff" }}>
                Official Pages & Organizations
              </h1>
              <p style={{ fontSize: "15px", margin: 0, opacity: 0.92, maxWidth: "640px", lineHeight: "1.5" }}>
                Follow official pages for research laboratories, university faculties, tech innovators, open-science institutions, and journals.
              </p>
            </div>
            <div className="col-lg-4 col-md-5 text-md-right mt-3 mt-md-0">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0284c7",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "24px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "all 0.2s ease",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                + Create Official Page
              </button>
            </div>
          </div>

          {/* Search & Top Filters Bar */}
          <div
            style={{
              marginTop: "26px",
              backgroundColor: "rgba(255,255,255,0.12)",
              borderRadius: "14px",
              padding: "12px 16px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px",
              backdropFilter: "blur(6px)",
            }}
          >
            {/* Search Input */}
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <svg
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages by name, handle, or field..."
                style={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  color: "#1e293b",
                  border: "none",
                  borderRadius: "20px",
                  padding: "9px 16px 9px 40px",
                  fontSize: "13.5px",
                  outline: "none",
                }}
              />
            </div>

            {/* Quick View Tabs */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(
                [
                  { id: "all", label: "All Pages" },
                  { id: "following", label: "Following" },
                  { id: "verified", label: "Verified Only" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    backgroundColor: activeTab === tab.id ? "#ffffff" : "rgba(255,255,255,0.2)",
                    color: activeTab === tab.id ? "#0284c7" : "#ffffff",
                    border: "none",
                    borderRadius: "16px",
                    padding: "6px 14px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    whiteSpace: "nowrap",
                    backgroundColor: isSelected ? "#0284c7" : "#f1f5f9",
                    color: isSelected ? "#ffffff" : "#475569",
                    border: "none",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="container" style={{ marginTop: "28px" }}>
        {filteredPages.length === 0 ? (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontSize: "42px", marginBottom: "12px" }}>🚩</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
              No Pages Found
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "420px", margin: "0 auto 18px" }}>
              No pages match your current filter. Clear your query or create a brand new official page.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("All Pages");
                setActiveTab("all");
                setSearchQuery("");
              }}
              style={{
                backgroundColor: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row">
            {filteredPages.map((pg) => (
              <div key={pg.id} className="col-lg-4 col-md-6 col-sm-12" style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    border: "1px solid #e2e8f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Page Cover Photo Banner */}
                  <div style={{ position: "relative", height: "130px", backgroundColor: "#0f172a", overflow: "hidden" }}>
                    <img
                      src={pg.coverImage}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setDetailPage(pg)}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "rgba(15, 23, 42, 0.75)",
                        color: "#ffffff",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {pg.category}
                    </span>
                  </div>

                  {/* Overlapping Avatar & Header */}
                  <div style={{ padding: "0 18px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-32px", marginBottom: "10px" }}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={pg.avatar}
                          alt={pg.name}
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            border: "3px solid #ffffff",
                            objectFit: "cover",
                            backgroundColor: "#ffffff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                            cursor: "pointer",
                          }}
                          onClick={() => setDetailPage(pg)}
                        />
                        {pg.verified && (
                          <span
                            title="Verified Organization"
                            style={{
                              position: "absolute",
                              bottom: "2px",
                              right: "2px",
                              backgroundColor: "#0284c7",
                              color: "#ffffff",
                              borderRadius: "50%",
                              width: "18px",
                              height: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              border: "2px solid #ffffff",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Follow / Liked button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFollow(pg.id, e)}
                        style={{
                          backgroundColor: pg.isFollowing ? "#e0f2fe" : "#0284c7",
                          color: pg.isFollowing ? "#0369a1" : "#ffffff",
                          border: pg.isFollowing ? "1px solid #bae6fd" : "none",
                          borderRadius: "20px",
                          padding: "6px 16px",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {pg.isFollowing ? "✓ Following" : "+ Follow"}
                      </button>
                    </div>

                    {/* Page Name & Handle */}
                    <h3
                      onClick={() => setDetailPage(pg)}
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#1e293b",
                        margin: "0 0 2px 0",
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {pg.name}
                    </h3>
                    <div style={{ fontSize: "12.5px", color: "#64748b", marginBottom: "10px" }}>
                      {pg.handle} • {pg.location}
                    </div>

                    {/* Bio snippet */}
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#475569",
                        lineHeight: "1.45",
                        margin: "0 0 14px 0",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {pg.bio}
                    </p>

                    {/* Stats */}
                    <div
                      style={{
                        marginTop: "auto",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "12.5px",
                        color: "#64748b",
                        fontWeight: 500,
                        marginBottom: "12px",
                      }}
                    >
                      <span>
                        <strong style={{ color: "#1e293b" }}>{pg.followersCount.toLocaleString()}</strong> followers
                      </span>
                      <span>
                        <strong style={{ color: "#1e293b" }}>{pg.postsCount}</strong> posts
                      </span>
                    </div>

                    {/* Facebook-style Bottom Action Bar */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => setDetailPage(pg)}
                        style={{
                          flex: 1,
                          backgroundColor: "#f8fafc",
                          color: "#334155",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "8px 0",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        View Page
                      </button>

                      <Link
                        href="/messages"
                        style={{
                          backgroundColor: "#f8fafc",
                          color: "#334155",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textDecoration: "none",
                        }}
                        title="Send Message"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleSharePage(pg, e)}
                        style={{
                          backgroundColor: "#f8fafc",
                          color: "#334155",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          width: "36px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                        title="Share Page"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="18" cy="5" r="3"></circle>
                          <circle cx="6" cy="12" r="3"></circle>
                          <circle cx="18" cy="19" r="3"></circle>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page Detail Modal */}
      {detailPage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setDetailPage(null)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner */}
            <div style={{ position: "relative", height: "190px", backgroundColor: "#0f172a" }}>
              <img src={detailPage.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                type="button"
                onClick={() => setDetailPage(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Profile Info */}
            <div style={{ padding: "0 24px 24px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-40px", marginBottom: "16px" }}>
                <div style={{ position: "relative" }}>
                  <img
                    src={detailPage.avatar}
                    alt=""
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      border: "4px solid #ffffff",
                      objectFit: "cover",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    }}
                  />
                  {detailPage.verified && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        right: "4px",
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        border: "2px solid #ffffff",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleToggleFollow(detailPage.id)}
                    style={{
                      backgroundColor: detailPage.isFollowing ? "#e0f2fe" : "#0284c7",
                      color: detailPage.isFollowing ? "#0369a1" : "#ffffff",
                      border: detailPage.isFollowing ? "1px solid #bae6fd" : "none",
                      borderRadius: "20px",
                      padding: "8px 20px",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {detailPage.isFollowing ? "✓ Following" : "+ Follow"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSharePage(detailPage)}
                    style={{
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      border: "1px solid #e2e8f0",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Share
                  </button>
                </div>
              </div>

              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", margin: "0 0 4px 0" }}>
                {detailPage.name}
              </h2>
              <div style={{ fontSize: "13.5px", color: "#64748b", marginBottom: "14px" }}>
                {detailPage.handle} • {detailPage.category} • {detailPage.location}
              </div>

              <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6", marginBottom: "16px" }}>
                {detailPage.bio}
              </p>

              <div style={{ display: "flex", gap: "20px", fontSize: "13.5px", color: "#475569", marginBottom: "20px" }}>
                <div>
                  <strong style={{ color: "#0f172a" }}>{detailPage.followersCount.toLocaleString()}</strong> followers
                </div>
                <div>
                  <strong style={{ color: "#0f172a" }}>{detailPage.postsCount}</strong> publications
                </div>
                {detailPage.website && (
                  <a
                    href={detailPage.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0284c7", textDecoration: "none", fontWeight: 500 }}
                  >
                    🌐 {detailPage.website.replace("https://", "")}
                  </a>
                )}
              </div>

              {detailPage.featuredPost && (
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#0284c7", textTransform: "uppercase" }}>
                      Featured Publication
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{detailPage.featuredPost.date}</span>
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: "0 0 6px 0" }}>
                    {detailPage.featuredPost.title}
                  </h4>
                  <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>
                    {detailPage.featuredPost.snippet}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Page Modal */}
      {isCreateModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              maxWidth: "560px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                Create Official Page
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePage} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                  Page / Lab Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oxford Bio-Robotics Institute"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "9px 12px",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Handle (@username)
                  </label>
                  <input
                    type="text"
                    placeholder="@oxford_biorobotics"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PageItem["category"])}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <option value="Research Labs">Research Labs</option>
                    <option value="Universities">Universities</option>
                    <option value="Tech Companies">Tech Companies</option>
                    <option value="Scientific Journals">Scientific Journals</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oxford, United Kingdom"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Official Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.edu"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    style={{
                      width: "100%",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      padding: "9px 12px",
                      fontSize: "13.5px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                  Bio & Research Focus
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your organization's mission, research projects, and facilities..."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "9px 12px",
                    fontSize: "13.5px",
                    outline: "none",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontSize: "13.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 22px",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Publish Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
