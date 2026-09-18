"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";
import { CourseItem, CourseReview, findCourseItem } from "@/data/coursesCatalog";
import { addToCart } from "@/lib/cart/cartService";
import { POPULAR_SIDEBAR_BOOKS, UPCOMING_EVENTS } from "@/data/marketplaceCatalog";

interface CourseDetailClientProps {
  courseId?: string;
  initialCourse?: CourseItem;
}

export default function CourseDetailClient({ courseId, initialCourse }: CourseDetailClientProps) {
  const router = useRouter();
  const course = initialCourse || findCourseItem(courseId);

  // Interactive State
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(course.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [dislikesCount, setDislikesCount] = useState(course.dislikes);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor">("overview");
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);

  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Share Modal & Toast
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ask Question Modal
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionCategory, setQuestionCategory] = useState("Code");
  const [questionText, setQuestionText] = useState("");

  // Reviews State
  const [reviews, setReviews] = useState<CourseReview[]>(course.reviews);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  // Bookmarks in sidebar
  const [bookmarkedBooks, setBookmarkedBooks] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    showToast(nextState ? `You are now following ${course.instructor.name}!` : `Unfollowed ${course.instructor.name}.`);
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      if (hasDisliked) {
        setDislikesCount((prev) => Math.max(0, prev - 1));
        setHasDisliked(false);
      }
      showToast("Thank you for liking this course!");
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setDislikesCount((prev) => prev - 1);
      setHasDisliked(false);
    } else {
      setDislikesCount((prev) => prev + 1);
      setHasDisliked(true);
      if (hasLiked) {
        setLikesCount((prev) => Math.max(0, prev - 1));
        setHasLiked(false);
      }
      showToast("Feedback recorded.");
    }
  };

  const handleToggleWishlist = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const next = !isWishlisted;
    setIsWishlisted(next);
    showToast(next ? `"${course.title}" saved to your wishlist!` : `Removed from wishlist.`);
  };

  const handleEnrollOrStart = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addToCart({
      id: course.id,
      name: course.title,
      price: course.price,
      img: course.videoPreview.thumbnail,
      type: "course",
      author: course.instructor.name,
      desc: course.description,
    });
    showToast(`"${course.title}" added to cart! Proceeding to checkout...`);
    setTimeout(() => {
      router.push("/checkout");
    }, 600);
  };

  const handleAddToCartOnly = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addToCart({
      id: course.id,
      name: course.title,
      price: course.price,
      img: course.videoPreview.thumbnail,
      type: "course",
      author: course.instructor.name,
      desc: course.description,
    });
    showToast(`"${course.title}" added to shopping cart!`);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Course link copied to clipboard!");
      setIsShareModalOpen(false);
    }
  };

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewMessage.trim()) {
      showToast("Please enter your name and review details.");
      return;
    }

    const newRev: CourseReview = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      date: "Just now",
      rating: reviewRating,
      avatar: "/images/resources/commenter-1.jpg",
      comment: reviewMessage.trim(),
    };

    setReviews([newRev, ...reviews]);
    setReviewerName("");
    setReviewerEmail("");
    setReviewMessage("");
    showToast("Review submitted successfully! Thank you for your feedback.");
  };

  const handleSubmitQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionText.trim()) {
      showToast("Please provide question title and explanation.");
      return;
    }
    setIsAskQuestionOpen(false);
    setQuestionTitle("");
    setQuestionText("");
    showToast("Research question submitted to Q&A community!");
  };

  const handleToggleSidebarBook = (id: string, title: string) => {
    setBookmarkedBooks((prev) => {
      const next = !prev[id];
      showToast(next ? `Bookmarked "${title}"` : `Removed "${title}" from bookmarks`);
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="theme-layout">
      {/* Main Top Header */}
      <HomeHeader />

      {/* Main Container Gap */}
      <section>
        <div className="gap">
          <div className="container">
            {/* Breadcrumb Navigation */}
            <div
              style={{
                marginBottom: "22px",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
                Home
              </Link>
              <span>/</span>
              <Link href="/courses" style={{ color: "#64748b", textDecoration: "none" }}>
                Courses
              </Link>
              <span>/</span>
              <span style={{ color: "#088dcd", fontWeight: "600" }}>{course.title}</span>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  <div className="col-lg-12">
                    {/* Course Hero Banner Card */}
                    <div className="main-wraper">
                      <div className="row">
                        {/* Left Info Column */}
                        <div className="col-lg-7 col-md-7">
                          <div className="course-details">
                            <ul className="rating-stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <li key={star}>
                                  <i
                                    className="icofont-star"
                                    style={{
                                      color: star <= Math.round(course.rating) ? "#fec42d" : "#e2e8f0",
                                    }}
                                  ></i>
                                </li>
                              ))}
                              <li>
                                <span>{course.rating.toFixed(1)}</span>
                              </li>
                            </ul>

                            <h4>{course.title}</h4>

                            <span className="course-price">
                              ${course.price.toFixed(2)}
                              {course.oldPrice && <del style={{ marginLeft: "8px" }}>${course.oldPrice.toFixed(2)}</del>}
                            </span>

                            <p style={{ marginTop: "12px", color: "#64748b", lineHeight: "1.7", fontSize: "14px" }}>
                              {course.description}
                            </p>

                            <div className="create-by" style={{ marginTop: "15px" }}>
                              <figure>
                                <img
                                  src={course.instructor.avatar}
                                  alt={course.instructor.name}
                                  style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                                />
                              </figure>
                              <div>
                                <span>{course.instructor.name}</span>
                                <em>Last Update: {course.instructor.lastUpdate}</em>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleToggleFollow}
                              style={{
                                background: isFollowing ? "#10b981" : "#088dcd",
                                borderColor: isFollowing ? "#10b981" : "#088dcd",
                                color: "#fff",
                                border: "1px solid",
                                borderRadius: "30px",
                                float: "right",
                                fontWeight: "600",
                                padding: "6px 20px",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                            >
                              {isFollowing ? "Following" : "Follow"}
                            </button>

                            <ul className="statistic" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px" }}>
                              <li title="Total Views">
                                <i className="icofont-eye-alt"></i> {course.views.toLocaleString()}
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={handleLike}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: hasLiked ? "#088dcd" : "#82828e",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontSize: "12px",
                                    padding: 0,
                                  }}
                                >
                                  <i className="icofont-thumbs-up" style={{ fontSize: "14px" }}></i> {likesCount}
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={handleDislike}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: hasDisliked ? "#ef4444" : "#82828e",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontSize: "12px",
                                    padding: 0,
                                  }}
                                >
                                  <i className="icofont-thumbs-down" style={{ fontSize: "14px" }}></i> {dislikesCount}
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => setIsShareModalOpen(true)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#82828e",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontSize: "12px",
                                    padding: 0,
                                  }}
                                >
                                  <i className="icofont-share-alt" style={{ fontSize: "14px" }}></i> Share
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Right Video / CTA Column */}
                        <div className="col-lg-5 col-md-5">
                          <div className="course-video">
                            <figure style={{ position: "relative", borderRadius: "10px", overflow: "hidden" }}>
                              <img
                                src={course.videoPreview.thumbnail}
                                alt={course.title}
                                style={{ width: "100%", height: "230px", objectFit: "cover", display: "block" }}
                              />
                              <button
                                type="button"
                                onClick={() => setIsVideoModalOpen(true)}
                                className="play-btn"
                                title="Watch Video Preview"
                                style={{
                                  border: "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  outline: "none",
                                }}
                              >
                                <i className="icofont-play"></i>
                              </button>
                            </figure>

                            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                              <button
                                type="button"
                                onClick={handleEnrollOrStart}
                                className="main-btn"
                                style={{
                                  flex: 1,
                                  border: "none",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "8px",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="icofont-play"></i> Start Course
                              </button>
                              <button
                                type="button"
                                onClick={handleAddToCartOnly}
                                title="Add to Cart"
                                style={{
                                  background: "#f1f5f9",
                                  color: "#088dcd",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "30px",
                                  padding: "9px 16px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                }}
                              >
                                <i className="icofont-cart-alt"></i>
                              </button>
                              <button
                                type="button"
                                onClick={handleToggleWishlist}
                                className="wish-btn"
                                style={{
                                  border: "none",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: isWishlisted ? "#ff9800" : "#ffd550",
                                  color: isWishlisted ? "#fff" : "#333",
                                }}
                              >
                                <i className="icofont-heart"></i> {isWishlisted ? "Wishlisted" : "Wishlist"}
                              </button>
                            </div>

                            <span style={{ color: "#64748b", marginTop: "12px", display: "inline-block" }}>
                              <i className="icofont-shield-check" style={{ color: "#10b981", marginRight: "4px" }}></i>
                              30 days money back guarantee • Lifetime access
                            </span>
                          </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="col-lg-12" style={{ marginTop: "15px" }}>
                          <div style={{ borderBottom: "1px solid #e2e8f0", display: "flex", gap: "20px" }}>
                            <button
                              type="button"
                              onClick={() => setActiveTab("overview")}
                              style={{
                                background: "none",
                                border: "none",
                                borderBottom: activeTab === "overview" ? "3px solid #088dcd" : "3px solid transparent",
                                padding: "10px 16px",
                                fontWeight: activeTab === "overview" ? "700" : "500",
                                color: activeTab === "overview" ? "#088dcd" : "#64748b",
                                cursor: "pointer",
                                fontSize: "15px",
                              }}
                            >
                              Overview
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab("curriculum")}
                              style={{
                                background: "none",
                                border: "none",
                                borderBottom: activeTab === "curriculum" ? "3px solid #088dcd" : "3px solid transparent",
                                padding: "10px 16px",
                                fontWeight: activeTab === "curriculum" ? "700" : "500",
                                color: activeTab === "curriculum" ? "#088dcd" : "#64748b",
                                cursor: "pointer",
                                fontSize: "15px",
                              }}
                            >
                              Curriculum ({course.curriculum.length} Modules)
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab("instructor")}
                              style={{
                                background: "none",
                                border: "none",
                                borderBottom: activeTab === "instructor" ? "3px solid #088dcd" : "3px solid transparent",
                                padding: "10px 16px",
                                fontWeight: activeTab === "instructor" ? "700" : "500",
                                color: activeTab === "instructor" ? "#088dcd" : "#64748b",
                                cursor: "pointer",
                                fontSize: "15px",
                              }}
                            >
                              Instructor
                            </button>
                          </div>
                        </div>

                        {/* Tab Content Display */}
                        <div className="col-lg-12" style={{ marginTop: "20px" }}>
                          {activeTab === "overview" && (
                            <div className="desc-course">
                              <h4 className="main-title">Course Description:</h4>
                              <p style={{ color: "#475569", lineHeight: "1.8", fontSize: "14px" }}>
                                {course.extendedDescription}
                              </p>

                              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                                <div
                                  style={{
                                    marginTop: "20px",
                                    padding: "20px",
                                    background: "#f8fafc",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                >
                                  <h5 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#1e293b" }}>
                                    What You Will Learn:
                                  </h5>
                                  <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                                    {course.whatYouWillLearn.map((pt, i) => (
                                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#334155" }}>
                                        <i className="icofont-check-circled" style={{ color: "#10b981", fontSize: "16px", marginTop: "2px" }}></i>
                                        <span>{pt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {activeTab === "curriculum" && (
                            <div style={{ marginBottom: "30px" }}>
                              <h4 className="main-title">Curriculum & Course Content:</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {course.curriculum.map((mod, idx) => {
                                  const isOpen = openModuleIndex === idx;
                                  return (
                                    <div
                                      key={mod.id}
                                      style={{
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => setOpenModuleIndex(isOpen ? null : idx)}
                                        style={{
                                          width: "100%",
                                          textAlign: "left",
                                          background: isOpen ? "#f1f5f9" : "#ffffff",
                                          border: "none",
                                          padding: "14px 18px",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          cursor: "pointer",
                                          fontWeight: "600",
                                          fontSize: "14px",
                                          color: "#1e293b",
                                        }}
                                      >
                                        <span>
                                          <i className={`icofont-caret-${isOpen ? "down" : "right"}`} style={{ marginRight: "8px", color: "#088dcd" }}></i>
                                          {mod.title}
                                        </span>
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                          {mod.lectures.length} Lectures • {mod.duration}
                                        </span>
                                      </button>

                                      {isOpen && (
                                        <ul style={{ listStyle: "none", margin: 0, padding: "0 18px", background: "#fff" }}>
                                          {mod.lectures.map((lec) => (
                                            <li
                                              key={lec.id}
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "10px 0",
                                                borderBottom: "1px solid #f1f5f9",
                                                fontSize: "13px",
                                              }}
                                            >
                                              <span style={{ display: "flex", alignItems: "center", gap: "10px", color: "#334155" }}>
                                                <i className="icofont-play-alt-1" style={{ color: "#94a3b8" }}></i>
                                                {lec.title}
                                              </span>
                                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                {lec.isFreePreview && (
                                                  <button
                                                    type="button"
                                                    onClick={() => setIsVideoModalOpen(true)}
                                                    style={{
                                                      background: "#e0f2fe",
                                                      color: "#0284c7",
                                                      border: "none",
                                                      borderRadius: "4px",
                                                      padding: "2px 8px",
                                                      fontSize: "11px",
                                                      fontWeight: "600",
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    Preview
                                                  </button>
                                                )}
                                                <span style={{ color: "#64748b", fontSize: "12px" }}>{lec.duration}</span>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {activeTab === "instructor" && (
                            <div style={{ marginBottom: "30px", padding: "20px", background: "#f8fafc", borderRadius: "8px" }}>
                              <h4 className="main-title">About the Instructor:</h4>
                              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "15px" }}>
                                <img
                                  src={course.instructor.avatar}
                                  alt={course.instructor.name}
                                  style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
                                />
                                <div>
                                  <h5 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>{course.instructor.name}</h5>
                                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>
                                    {course.instructor.bio || "Senior Web Technologies Instructor and Mentor"}
                                  </p>
                                  <span style={{ fontSize: "12px", color: "#088dcd", fontWeight: "600" }}>
                                    {course.instructor.followersCount?.toLocaleString() || "3,200"} Students Enrolled
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Course Perks & Features Column */}
                        <div className="col-lg-5">
                          <div className="incldes">
                            <h4 className="main-title">This Course Includes:</h4>
                            <ul>
                              {course.includes.map((inc, i) => (
                                <li key={i}>
                                  <i className={inc.icon} style={{ color: "#088dcd", marginRight: "6px" }}></i>
                                  <span>{inc.label}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Ratings & Breakdown Column */}
                        <div className="col-lg-7">
                          <h4 className="main-title">Feedback & Course Rating</h4>
                          <div className="course-ratings row merged-10">
                            <div className="rating-column col-lg-3 col-md-3 col-sm-3">
                              <div className="inner-column">
                                <div className="total-rating">{course.ratingsBreakdown.totalRating.toFixed(1)}</div>
                                <div className="rating">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <span
                                      key={s}
                                      className="icofont-star"
                                      style={{
                                        color: s <= Math.round(course.ratingsBreakdown.totalRating) ? "#fec42d" : "#e2e8f0",
                                      }}
                                    ></span>
                                  ))}
                                </div>
                                <span>Course Rating</span>
                              </div>
                            </div>

                            {/* Animated Skills Bars */}
                            <div className="graph-column col-lg-6 col-md-6 col-sm-6">
                              <div className="skills">
                                {course.ratingsBreakdown.distribution.map((dist) => (
                                  <div className="bar" key={dist.star} style={{ marginBottom: "12px" }}>
                                    <div className="bar-outer" style={{ background: "#e2e8f0", height: "12px", borderRadius: "4px", overflow: "hidden" }}>
                                      <div
                                        className={`bar-inner ${dist.key}`}
                                        style={{
                                          width: `${dist.percentage}%`,
                                          height: "100%",
                                          background: "#f89d94",
                                          borderRadius: "4px",
                                          transition: "width 1s ease-in-out",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Stars breakdown percentage */}
                            <div className="stars-column col-lg-3 col-md-3 col-sm-3">
                              {course.ratingsBreakdown.distribution.map((dist) => (
                                <div className="rating" key={dist.star} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                                  <div>
                                    {[...Array(dist.star)].map((_, idx) => (
                                      <span key={idx} className="icofont-star" style={{ color: "#fec42d", fontSize: "11px" }}></span>
                                    ))}
                                  </div>
                                  <i style={{ fontStyle: "normal", fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                                    {dist.percentage}%
                                  </i>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Comments and Sidebar */}
                    <div className="row" style={{ marginTop: "20px" }}>
                      {/* Left 9 Cols: Reviews and Related Courses */}
                      <div className="col-lg-9">
                        <div className="main-wraper">
                          <div className="comment-area product">
                            <h4 className="comment-title">{reviews.length.toString().padStart(2, "0")} Feedback Reviews</h4>
                            <ul className="comments" style={{ listStyle: "none", padding: 0 }}>
                              {reviews.map((rev) => (
                                <li key={rev.id} style={{ marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>
                                  <div className="comment-box" style={{ display: "flex", gap: "15px" }}>
                                    <div className="commenter-photo">
                                      <img
                                        alt={rev.author}
                                        src={rev.avatar}
                                        style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).src = "/images/resources/commenter-1.jpg";
                                        }}
                                      />
                                    </div>
                                    <div className="commenter-meta" style={{ flex: 1 }}>
                                      <div className="comment-titles" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                          <h6 style={{ margin: 0, textTransform: "capitalize", fontWeight: "700" }}>{rev.author}</h6>
                                          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{rev.date}</span>
                                        </div>
                                        <ins
                                          style={{
                                            background: "#fec42d",
                                            borderRadius: "30px",
                                            color: "#ffffff",
                                            padding: "2px 12px",
                                            textDecoration: "none",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                          }}
                                        >
                                          <i className="icofont-star"></i> {rev.rating.toFixed(1)}
                                        </ins>
                                      </div>
                                      <p style={{ marginTop: "8px", color: "#475569", fontSize: "13px", lineHeight: "1.6" }}>
                                        {rev.comment}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>

                            {/* Give Your Reviews Form */}
                            <div className="add-comment mt-5" style={{ marginTop: "35px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" }}>
                                <span style={{ fontWeight: "700", fontSize: "15px", color: "#1e293b" }}>
                                  Give Your Review:
                                </span>
                                <ul className="stars" style={{ display: "flex", gap: "4px", margin: 0, padding: 0, listStyle: "none" }}>
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <li
                                      key={s}
                                      onMouseEnter={() => setHoverRating(s)}
                                      onMouseLeave={() => setHoverRating(0)}
                                      onClick={() => setReviewRating(s)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <i
                                        className="icofont-star"
                                        style={{
                                          color: s <= (hoverRating || reviewRating) ? "#fec42d" : "#cbd5e1",
                                          fontSize: "18px",
                                        }}
                                      ></i>
                                    </li>
                                  ))}
                                  <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "6px" }}>
                                    ({(hoverRating || reviewRating)}.0 stars)
                                  </span>
                                </ul>
                              </div>

                              <form onSubmit={handleSubmitReview} className="c-form">
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                  <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                    required
                                    style={{
                                      width: "100%",
                                      padding: "10px 14px",
                                      borderRadius: "6px",
                                      border: "1px solid #cbd5e1",
                                    }}
                                  />
                                  <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={reviewerEmail}
                                    onChange={(e) => setReviewerEmail(e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "10px 14px",
                                      borderRadius: "6px",
                                      border: "1px solid #cbd5e1",
                                    }}
                                  />
                                </div>
                                <textarea
                                  rows={4}
                                  placeholder="Write your constructive review about this course..."
                                  value={reviewMessage}
                                  onChange={(e) => setReviewMessage(e.target.value)}
                                  required
                                  style={{
                                    width: "100%",
                                    marginTop: "15px",
                                    padding: "10px 14px",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1",
                                  }}
                                ></textarea>
                                <button
                                  className="main-btn"
                                  type="submit"
                                  style={{ marginTop: "15px", border: "none", cursor: "pointer", fontWeight: "600" }}
                                >
                                  Add Review
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>

                        {/* Related Courses Carousel / Grid */}
                        <div className="main-wraper" style={{ marginTop: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                            <h4 className="main-title" style={{ margin: 0 }}>
                              Related Courses
                            </h4>
                            <Link href="/courses" style={{ fontSize: "12px", color: "#088dcd", fontWeight: "600" }}>
                              view all
                            </Link>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                              gap: "15px",
                            }}
                          >
                            {course.relatedCourses.map((rc) => (
                              <div
                                key={rc.id}
                                style={{
                                  background: "#ffffff",
                                  border: "1px solid #f1f5f9",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                                  textAlign: "center",
                                  paddingBottom: "10px",
                                }}
                              >
                                <figure style={{ margin: 0, position: "relative" }}>
                                  <Link href={`/course-detail?id=${rc.id}`}>
                                    <img
                                      src={rc.img}
                                      alt={rc.title}
                                      style={{ width: "100%", height: "110px", objectFit: "cover", display: "block" }}
                                    />
                                  </Link>
                                </figure>
                                <div style={{ padding: "8px" }}>
                                  <Link
                                    href={`/course-detail?id=${rc.id}`}
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      color: "#1e293b",
                                      textDecoration: "none",
                                      display: "block",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {rc.title}
                                  </Link>
                                  <span style={{ fontSize: "12px", color: "#088dcd", fontWeight: "700", display: "block", marginTop: "4px" }}>
                                    ${rc.price.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar: 3 Cols */}
                      <div className="col-lg-3">
                        <aside className="sidebar static right">
                          {/* Widget: Ask Research Question */}
                          <div className="widget">
                            <h4 className="widget-title">Ask Research Question?</h4>
                            <div className="ask-question" style={{ textAlign: "center", padding: "15px" }}>
                              <i className="icofont-question-circle" style={{ fontSize: "40px", color: "#088dcd" }}></i>
                              <h6 style={{ fontSize: "13px", color: "#64748b", margin: "10px 0 15px" }}>
                                Ask questions in Q&A to get help from experts in your field.
                              </h6>
                              <button
                                type="button"
                                onClick={() => setIsAskQuestionOpen(true)}
                                className="ask-qst"
                                style={{
                                  background: "#088dcd",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "30px",
                                  padding: "7px 20px",
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                Ask a question
                              </button>
                            </div>
                          </div>

                          {/* Widget: Explore Events */}
                          <div className="widget">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <h4 className="widget-title" style={{ margin: 0 }}>
                                Explore Events
                              </h4>
                              <Link href="/events" style={{ fontSize: "12px", color: "#088dcd" }}>
                                See All
                              </Link>
                            </div>
                            <div style={{ marginTop: "12px" }}>
                              {UPCOMING_EVENTS.map((evt, i) => (
                                <div
                                  key={i}
                                  className={`rec-events ${evt.bgClass}`}
                                  style={{
                                    padding: "14px",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    color: "#fff",
                                  }}
                                >
                                  <i className={evt.icon} style={{ fontSize: "24px" }}></i>
                                  <div>
                                    <h6 style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: "#fff" }}>
                                      {evt.title}
                                    </h6>
                                    <span style={{ fontSize: "11px", opacity: 0.85 }}>{evt.date}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Widget: Popular Books */}
                          <div className="widget stick-widget">
                            <h4 className="widget-title">Popular Books</h4>
                            {POPULAR_SIDEBAR_BOOKS.map((bk) => {
                              const isSaved = bookmarkedBooks[bk.id] || false;
                              return (
                                <div
                                  key={bk.id}
                                  className="popular-book"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "8px 0",
                                    borderBottom: "1px solid #f1f5f9",
                                  }}
                                >
                                  <figure style={{ margin: 0 }}>
                                    <img
                                      src={bk.img}
                                      alt={bk.title}
                                      style={{ width: "45px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                                    />
                                  </figure>
                                  <div className="book-about" style={{ flex: 1 }}>
                                    <h6 style={{ margin: 0, fontSize: "13px", fontWeight: "700" }}>
                                      <Link href={bk.href} style={{ color: "#1e293b", textDecoration: "none" }}>
                                        {bk.title}
                                      </Link>
                                    </h6>
                                    <span style={{ fontSize: "11px", color: "#64748b" }}>{bk.author}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSidebarBook(bk.id, bk.title)}
                                    title="Bookmark"
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: isSaved ? "#088dcd" : "#94a3b8",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 24 24"
                                      fill={isSaved ? "currentColor" : "none"}
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="feather feather-bookmark"
                                    >
                                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </aside>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {isVideoModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "850px",
              background: "#000",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
                background: "#18181b",
                color: "#fff",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>{course.title} - Video Preview</span>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`${course.videoPreview.url}?autoplay=1`}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "450px",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Share This Course</h5>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "15px" }}>
              Share this course link with your colleagues, study groups, or on social media.
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "12px",
                  color: "#334155",
                }}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  background: "#088dcd",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Copy Link
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              {["facebook", "twitter", "linkedin", "whatsapp"].map((network) => (
                <button
                  key={network}
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    color: "#088dcd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <i className={`icofont-${network}`}></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ask Research Question Modal */}
      {isAskQuestionOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsAskQuestionOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "500px",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                <i className="icofont-question-circle" style={{ color: "#088dcd", marginRight: "6px" }}></i>
                Ask a Research Question
              </h5>
              <button
                type="button"
                onClick={() => setIsAskQuestionOpen(false)}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmitQuestion}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#334155" }}>
                  Question Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. How to optimize async event loops in JS?"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#334155" }}>
                  Topic Category
                </label>
                <select
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                >
                  <option>Code</option>
                  <option>Frontend Architecture</option>
                  <option>Algorithms & Data Structures</option>
                  <option>Research Paper</option>
                  <option>Database Optimization</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#334155" }}>
                  Details & Context
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain what you are trying to achieve and where you are stuck..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                ></textarea>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsAskQuestionOpen(false)}
                  style={{
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#088dcd",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 18px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#1e293b",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            fontSize: "13px",
            fontWeight: "500",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          <i className="icofont-check-circled" style={{ color: "#10b981", fontSize: "18px" }}></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Footer */}
      <AppFooter />
    </div>
  );
}
