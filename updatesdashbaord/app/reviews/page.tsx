"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function ReviewsPage() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: "Socrates Itumay",
      avatar: "/images/resources/user1.jpg",
      rating: 5,
      date: "2 days ago",
      comment:
        "The Socimo platform provides incredible flexibility and community engagement tools. Our student research teams have significantly accelerated collaboration!",
      sales: 58,
      helpful: 24,
    },
    {
      id: 2,
      name: "Dianne Aceron",
      avatar: "/images/resources/user2.jpg",
      rating: 5,
      date: "1 week ago",
      comment:
        "Outstanding dashboard interface and lightning fast responsiveness! The analytics section makes monitoring course progress seamless.",
      sales: 49,
      helpful: 19,
    },
    {
      id: 3,
      name: "Katherine Movera",
      avatar: "/images/resources/user3.jpg",
      rating: 4,
      date: "2 weeks ago",
      comment:
        "Very clean and well thought out layout. Group discussions and notification feeds work intuitively across all devices.",
      sales: 40,
      helpful: 12,
    },
    {
      id: 4,
      name: "Reynante Labares",
      avatar: "/images/resources/user4.jpg",
      rating: 5,
      date: "3 weeks ago",
      comment:
        "Everything from the team directory to event tracking is top tier. Highly recommended for academic and commercial communities alike.",
      sales: 38,
      helpful: 8,
    },
  ]);

  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newReviewer, setNewReviewer] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer.trim() || !newComment.trim()) return;

    const added = {
      id: Date.now(),
      name: newReviewer.trim(),
      avatar: "/images/resources/user.jpg",
      rating: newRating,
      date: "Just now",
      comment: newComment.trim(),
      sales: 1,
      helpful: 0,
    };

    setReviewsList([added, ...reviewsList]);
    setNewReviewer("");
    setNewComment("");
    setIsAddReviewOpen(false);
  };

  const filteredReviews = filterRating
    ? reviewsList.filter((r) => r.rating === filterRating)
    : reviewsList;

  return (
    <DashboardLayout pageTitle="Reviews" breadcrumb="Reviews">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 className="main-title" style={{ margin: 0 }}>Community Reviews & Ratings</h4>
        <button
          type="button"
          onClick={() => setIsAddReviewOpen(true)}
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
          <i className="icofont-plus"></i> Write Review
        </button>
      </div>

      {/* Overview Breakdown Cards */}
      <div className="row merged20 mb-4">
        <div className="col-lg-4 col-md-12">
          <div className="d-widget" style={{ background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid #edf2f6", textAlign: "center" }}>
            <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#222", margin: 0 }}>4.9</h1>
            <div style={{ color: "#f1b44c", fontSize: "18px", margin: "8px 0" }}>
              {"★★★★★"}
            </div>
            <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>Based on 1,428 verified ratings</p>

            <div style={{ marginTop: "20px" }}>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div
                  key={stars}
                  onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: filterRating === stars ? "#e8f4fd" : "transparent",
                  }}
                >
                  <span style={{ fontSize: "12px", width: "45px", textAlign: "left", color: "#666" }}>{stars} Star</span>
                  <div style={{ flex: 1, height: "6px", background: "#edf2f6", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: stars === 5 ? "85%" : stars === 4 ? "12%" : "3%",
                        height: "100%",
                        background: "#088dcd",
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#888", width: "30px", textAlign: "right" }}>
                    {stars === 5 ? "85%" : stars === 4 ? "12%" : "3%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Rated Leaders Table */}
        <div className="col-lg-8 col-md-12">
          <div className="d-widget" style={{ background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Top Rated Contributors</h5>
              <span style={{ fontSize: "12px", color: "#088dcd", fontWeight: 600 }}>Active Top Performers</span>
            </div>

            <div className="table-responsive">
              <table className="table table-striped" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #edf2f6", textAlign: "left", fontSize: "13px" }}>
                    <th style={{ padding: "10px" }}>Name</th>
                    <th style={{ padding: "10px" }}>Courses/Sales</th>
                    <th style={{ padding: "10px" }}>Score</th>
                    <th style={{ padding: "10px" }}>Total Earnings</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "13px" }}>
                  {[
                    { name: "Socrates Itumay", avatar: "/images/resources/user1.jpg", sales: 58, score: "96%", earn: "$302,422" },
                    { name: "Dianne Aceron", avatar: "/images/resources/user2.jpg", sales: 49, score: "85%", earn: "$264,090" },
                    { name: "Katherine Movera", avatar: "/images/resources/user3.jpg", sales: 40, score: "79%", earn: "$238,720" },
                    { name: "Reynante Labares", avatar: "/images/resources/user4.jpg", sales: 38, score: "74%", earn: "$227,063" },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #edf2f6" }}>
                      <td style={{ padding: "12px 10px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={row.avatar}
                          alt={row.name}
                          style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                          }}
                        />
                        <span style={{ fontWeight: 600, color: "#222" }}>{row.name}</span>
                      </td>
                      <td style={{ padding: "12px 10px" }}>{row.sales}</td>
                      <td style={{ padding: "12px 10px", color: "#28a745", fontWeight: 700 }}>{row.score}</td>
                      <td style={{ padding: "12px 10px", fontWeight: 700 }}>{row.earn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews List */}
      <div className="d-widget" style={{ background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
        <h5 style={{ margin: "0 0 20px 0", fontWeight: 700 }}>
          Latest Reviews {filterRating ? `(${filterRating} Stars)` : ""}
        </h5>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                border: "1px solid #edf2f6",
                borderRadius: "8px",
                padding: "16px 20px",
                background: "#fafbfc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                    }}
                  />
                  <div>
                    <h6 style={{ margin: 0, fontWeight: 700, fontSize: "14px" }}>{rev.name}</h6>
                    <span style={{ fontSize: "11px", color: "#888" }}>{rev.date} • Verified Member</span>
                  </div>
                </div>
                <div style={{ color: "#f1b44c", fontSize: "14px" }}>
                  {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
                </div>
              </div>

              <p style={{ margin: "10px 0", fontSize: "13px", color: "#444", lineHeight: "1.6" }}>
                {rev.comment}
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "14px", fontSize: "12px", color: "#777" }}>
                <button
                  type="button"
                  onClick={() => {
                    setReviewsList((prev) =>
                      prev.map((r) => (r.id === rev.id ? { ...r, helpful: r.helpful + 1 } : r))
                    );
                  }}
                  style={{ background: "transparent", border: "none", color: "#088dcd", cursor: "pointer", fontWeight: 600 }}
                >
                  <i className="icofont-like"></i> Helpful ({rev.helpful})
                </button>
                <button
                  type="button"
                  onClick={() => alert("Reply feature submitted to reviewer.")}
                  style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}
                >
                  <i className="icofont-reply"></i> Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {isAddReviewOpen && (
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
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Write a Review</h5>
              <button
                type="button"
                onClick={() => setIsAddReviewOpen(false)}
                style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddReview}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={newReviewer}
                  onChange={(e) => setNewReviewer(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Rating
                </label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                  Review
                </label>
                <textarea
                  rows={4}
                  placeholder="Share your experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddReviewOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f8f9fa" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "6px", background: "#088dcd", color: "#fff", border: "none" }}
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
