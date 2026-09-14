"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogsList, setBlogsList] = useState([
    {
      id: 1,
      title: "Exploring New Frontiers in Genetic Bio-engineering",
      desc: "An in-depth investigation into modern laboratory CRISPR techniques, ethical boundaries, and synthetic biology breakthroughs.",
      image: "/images/resources/recentlink-1.jpg",
      author: "Dr. Danial Cardos",
      authorAvatar: "/images/resources/user.jpg",
      views: "43K",
      comments: 393,
      likes: 1250,
      isLiked: false,
      date: "Sep 12, 2026",
    },
    {
      id: 2,
      title: "AI-Assisted Peer Review: Transforming Scientific Publications",
      desc: "How decentralized machine learning models assist academic journals in detecting statistical anomalies and accelerating research velocity.",
      image: "/images/resources/recentlink-2.jpg",
      author: "Sarah Jenkins",
      authorAvatar: "/images/resources/user2.jpg",
      views: "67K",
      comments: 248,
      likes: 980,
      isLiked: false,
      date: "Sep 08, 2026",
    },
    {
      id: 3,
      title: "The Rise of Open Academic Communities on Social Networks",
      desc: "Why modern researchers and university students are trading isolated ivory towers for real-time collaborative discussion forums.",
      image: "/images/resources/recentlink-3.jpg",
      author: "Andrew Peeter",
      authorAvatar: "/images/resources/user1.jpg",
      views: "29K",
      comments: 115,
      likes: 620,
      isLiked: false,
      date: "Sep 01, 2026",
    },
    {
      id: 4,
      title: "Effective Online Course Pedagogies for STEM Students",
      desc: "Key frameworks for interactive quizzes, virtual laboratories, and student retention in online education curricula.",
      image: "/images/resources/course-5.jpg",
      author: "Elena Rostova",
      authorAvatar: "/images/resources/user4.jpg",
      views: "18K",
      comments: 84,
      likes: 410,
      isLiked: false,
      date: "Aug 27, 2026",
    },
  ]);

  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newTitle.trim(),
      desc: newDesc.trim(),
      image: "/images/resources/recentlink-1.jpg",
      author: "Danial Cardos",
      authorAvatar: "/images/resources/user.jpg",
      views: "1.2K",
      comments: 0,
      likes: 1,
      isLiked: true,
      date: "Just now",
    };

    setBlogsList([newPost, ...blogsList]);
    setNewTitle("");
    setNewDesc("");
    setIsNewPostOpen(false);
  };

  const filtered = blogsList.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Blogs" breadcrumb="Blog Posts">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 className="main-title" style={{ margin: 0 }}>Community Blogs & Research Articles</h4>
        <button
          type="button"
          onClick={() => setIsNewPostOpen(true)}
          className="main-btn"
          style={{
            background: "#088dcd",
            color: "#fff",
            border: "none",
            padding: "8px 18px",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <i className="icofont-plus"></i> Write Article
        </button>
      </div>

      {/* Search Header */}
      <div className="d-widget" style={{ background: "#fff", padding: "16px 20px", borderRadius: "10px", border: "1px solid #edf2f6", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search articles and keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "320px", maxWidth: "100%", padding: "8px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px" }}
        />
      </div>

      {/* Featured Blog Card (first item) */}
      {filtered.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #edf2f6",
            overflow: "hidden",
            marginBottom: "24px",
            display: "flex",
            flexWrap: "wrap",
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ flex: "1 1 400px", minHeight: "260px", background: "#f8f9fa" }}>
            <img
              src={filtered[0].image}
              alt={filtered[0].title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/resources/recentlink-1.jpg";
              }}
            />
          </div>
          <div style={{ flex: "1 1 450px", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#088dcd", textTransform: "uppercase", letterSpacing: "1px" }}>
                Featured Story
              </span>
              <h3 style={{ margin: "8px 0 12px 0", fontSize: "22px", fontWeight: 800, color: "#222", lineHeight: "1.3" }}>
                {filtered[0].title}
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                {filtered[0].desc}
              </p>
            </div>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #edf2f6", paddingTop: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={filtered[0].authorAvatar}
                  alt={filtered[0].author}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                  }}
                />
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 700, display: "block" }}>{filtered[0].author}</span>
                  <span style={{ fontSize: "11px", color: "#888" }}>{filtered[0].date}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#777" }}>
                <span><i className="icofont-eye-alt"></i> {filtered[0].views}</span>
                <span><i className="icofont-comment"></i> {filtered[0].comments}</span>
                <span><i className="icofont-like"></i> {filtered[0].likes}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Articles */}
      <div className="row merged-10">
        {filtered.slice(1).map((blog) => (
          <div key={blog.id} className="col-lg-4 col-md-6 mb-4">
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #edf2f6",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ height: "180px", overflow: "hidden", background: "#f8f9fa" }}>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/resources/recentlink-2.jpg";
                  }}
                />
              </div>

              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h5 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: 700, lineHeight: "1.4" }}>
                    {blog.title}
                  </h5>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.5" }}>
                    {blog.desc}
                  </p>
                </div>

                <div style={{ marginTop: "16px", borderTop: "1px solid #edf2f6", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#888" }}>
                  <span>{blog.author}</span>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span><i className="icofont-eye"></i> {blog.views}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setBlogsList((prev) =>
                          prev.map((b) =>
                            b.id === blog.id
                              ? { ...b, isLiked: !b.isLiked, likes: b.isLiked ? b.likes - 1 : b.likes + 1 }
                              : b
                          )
                        );
                      }}
                      style={{ background: "transparent", border: "none", color: blog.isLiked ? "#e83e8c" : "#888", cursor: "pointer", fontSize: "12px" }}
                    >
                      <i className="icofont-like"></i> {blog.likes}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Article Modal */}
      {isNewPostOpen && (
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
          <div style={{ background: "#fff", borderRadius: "10px", padding: "24px", width: "500px", maxWidth: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Write New Article</h5>
              <button
                type="button"
                onClick={() => setIsNewPostOpen(false)}
                style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Article Title</label>
                <input
                  type="text"
                  placeholder="Catchy headline..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Content Summary</label>
                <textarea
                  rows={4}
                  placeholder="Key insights and research findings..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f8f9fa" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "6px", background: "#088dcd", color: "#fff", border: "none" }}
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
