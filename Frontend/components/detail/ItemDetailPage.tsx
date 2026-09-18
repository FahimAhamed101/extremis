"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";
import { addToCart } from "@/lib/cart/cartService";
import {
  CatalogItem,
  ReviewItem,
  CATALOG_BOOKS,
  CATALOG_PRODUCTS,
  POPULAR_SIDEBAR_BOOKS,
  UPCOMING_EVENTS,
  WHOS_FOLLOWING,
} from "@/data/marketplaceCatalog";

interface ItemDetailPageProps {
  item: CatalogItem;
  type: "book" | "product";
}

export default function ItemDetailPage({ item, type }: ItemDetailPageProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>(item.reviews);
  const [activeTab, setActiveTab] = useState<"desc" | "chapters" | "author" | "reviews">("desc");

  // Review Form
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  // Reader Modal
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);

  // Ask Question Modal
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDetails, setQuestionDetails] = useState("");

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Following list state
  const [colleagues, setColleagues] = useState(WHOS_FOLLOWING);

  // Cart quantity & modal
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleToggleFollow = (name: string) => {
    setColleagues((prev) =>
      prev.map((c) => (c.name === name ? { ...c, following: !c.following } : c))
    );
    const target = colleagues.find((c) => c.name === name);
    showToast(target?.following ? `Unfollowed ${name}` : `Following ${name}!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      type: type,
      author: item.author,
      desc: item.description,
    });
    setIsAddedToCart(true);
    showToast(`"${item.name}" added to shopping cart!`);
  };

  const handleBuyNow = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      type: type,
      author: item.author,
      desc: item.description,
    });
    router.push("/checkout");
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(!isBookmarked ? `"${item.name}" saved to your bookmarks!` : "Removed from bookmarks.");
  };

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewMessage.trim()) {
      alert("Please provide your name and review message.");
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      date: "Today, just now",
      rating: newReviewRating,
      avatar: "/images/resources/commenter-1.jpg",
      comment: reviewMessage.trim(),
    };

    setReviews([newRev, ...reviews]);
    setReviewerName("");
    setReviewerEmail("");
    setReviewMessage("");
    showToast("Thank you! Your review has been posted successfully.");
  };

  const handleSubmitQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim()) return;
    setIsAskQuestionOpen(false);
    setQuestionTitle("");
    setQuestionDetails("");
    showToast("Research question submitted to Q&A community!");
  };

  const relatedItems = type === "book" ? CATALOG_BOOKS.filter((b) => b.id !== item.id) : CATALOG_PRODUCTS.filter((p) => p.id !== item.id);

  return (
    <div className="theme-layout">
      {/* Top Main Navigation Header */}
      <HomeHeader />

      {/* Main Content Area */}
      <section>
        <div className="gap">
          <div className="container">
            {/* Breadcrumb Navigation */}
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
              <span>/</span>
              <Link href={type === "book" ? "/book-detail" : "/products"} style={{ color: "#64748b", textDecoration: "none" }}>
                {type === "book" ? "Books & Publications" : "Marketplace & Products"}
              </Link>
              <span>/</span>
              <span style={{ color: "#088dcd", fontWeight: "600" }}>{item.name}</span>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  
                  {/* Left Column: 9 Columns */}
                  <div className="col-lg-9">
                    {/* Item Showcase Card */}
                    <div className="main-wraper">
                      <div className="row">
                        {/* Cover Image & Quick Stats */}
                        <div className="col-lg-4 col-md-4 col-sm-4">
                          <div className="full-book">
                            <figure style={{ position: "relative", overflow: "hidden", borderRadius: "8px", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                              <img
                                src={item.img}
                                alt={item.name}
                                style={{ width: "100%", height: "auto", display: "block" }}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/images/resources/book3.jpg";
                                }}
                              />
                              {item.tag && (
                                <span style={{ background: "#ff9800", color: "#fff", fontWeight: "700" }}>
                                  {item.tag}
                                </span>
                              )}
                            </figure>
                            <div className="prod-stat" style={{ marginTop: "15px" }}>
                              <ul>
                                <li>
                                  <span>Visited:</span> {item.visited}
                                </li>
                                <li>
                                  <span>Downloads:</span> {item.downloads}
                                </li>
                                <li>
                                  <span>Availability:</span>{" "}
                                  <strong style={{ color: "#28a745" }}>{item.availability}</strong>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Title, Details, Pricing & Action Buttons */}
                        <div className="col-lg-8 col-md-8 col-sm-8">
                          <div className="prod-detail">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <ul className="stars" style={{ display: "flex", gap: "2px", margin: 0, padding: 0, listStyle: "none" }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <li key={s}>
                                    <i
                                      className="icofont-star"
                                      style={{ color: s <= Math.round(item.rating) ? "#ff9800" : "#cbd5e1" }}
                                    ></i>
                                  </li>
                                ))}
                                <span style={{ fontSize: "12px", color: "#64748b", marginLeft: "6px" }}>
                                  ({item.rating.toFixed(1)} / 5.0 • {reviews.length} ratings)
                                </span>
                              </ul>

                              <button
                                type="button"
                                onClick={handleToggleBookmark}
                                title={isBookmarked ? "Bookmarked" : "Bookmark this item"}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: isBookmarked ? "#088dcd" : "#94a3b8",
                                  padding: "4px",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 24 24"
                                  fill={isBookmarked ? "currentColor" : "none"}
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

                            <h4 style={{ marginTop: "10px", fontSize: "22px", fontWeight: "800", color: "#1f273f", lineHeight: 1.3 }}>
                              {item.name}
                            </h4>

                            <div style={{ margin: "10px 0 14px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ fontSize: "16px", color: "#64748b" }}>
                                Price:{" "}
                                <i style={{ fontStyle: "normal", fontSize: "24px", fontWeight: "800", color: "#088dcd" }}>
                                  ${item.price.toFixed(2)}
                                </i>
                              </span>
                              {item.oldPrice && (
                                <span style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "15px" }}>
                                  ${item.oldPrice.toFixed(2)}
                                </span>
                              )}
                              {item.oldPrice && (
                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    background: "#ecfdf5",
                                    color: "#059669",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  {Math.round((1 - item.price / item.oldPrice) * 100)}% OFF
                                </span>
                              )}
                            </div>

                            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, marginBottom: "18px" }}>
                              {item.description}
                            </p>

                            <ul className="item-info">
                              <li>
                                <span>Author / Creator:</span> {item.author} {item.authorRole && `(${item.authorRole})`}
                              </li>
                              {item.pages && (
                                <li>
                                  <span>Pages:</span> {item.pages}
                                </li>
                              )}
                              {item.publishDate && (
                                <li>
                                  <span>Publish Date:</span> {item.publishDate}
                                </li>
                              )}
                              {item.barcode && (
                                <li>
                                  <span>Barcode / ISBN:</span> {item.barcode}
                                </li>
                              )}
                              {item.publisher && (
                                <li>
                                  <span>Publisher:</span> {item.publisher}
                                </li>
                              )}
                              {item.specs?.map((spec, idx) => (
                                <li key={idx}>
                                  <span>{spec.label}:</span> {spec.value}
                                </li>
                              ))}
                            </ul>

                            {/* Sale Buttons */}
                            <div className="sale-button" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
                              <button
                                type="button"
                                className="main-btn"
                                onClick={() => setIsReaderModalOpen(true)}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  background: "#088dcd",
                                  cursor: "pointer",
                                }}
                              >
                                <i className="icofont-book-alt"></i> Read Free Sample
                              </button>

                              <button
                                type="button"
                                className="main-btn purchase-btn"
                                onClick={handleAddToCart}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  background: isAddedToCart ? "#16a34a" : "#2563eb",
                                  cursor: "pointer",
                                  color: "#fff",
                                  fontWeight: 600,
                                }}
                              >
                                <i className="icofont-cart-alt"></i> {isAddedToCart ? "Added to Cart ✓" : "Add to Cart"}
                              </button>

                              <button
                                type="button"
                                className="main-btn"
                                onClick={handleBuyNow}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  background: "#e11d48",
                                  cursor: "pointer",
                                  color: "#fff",
                                  fontWeight: 600,
                                }}
                              >
                                <i className="icofont-flash"></i> Buy Now
                              </button>

                              <Link
                                href="/cart"
                                className="main-btn"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  background: "#f1f5f9",
                                  color: "#334155",
                                  textDecoration: "none",
                                  border: "1px solid #cbd5e1",
                                  fontWeight: 500,
                                }}
                              >
                                <i className="icofont-shopping-cart"></i> View Cart
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tabbed Navigation: Description, Chapters, Reviews */}
                      <div style={{ marginTop: "35px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
                        <ul style={{ display: "flex", gap: "20px", borderBottom: "2px solid #f1f5f9", paddingBottom: "10px", margin: "0 0 20px 0", listStyle: "none" }}>
                          <li>
                            <button
                              type="button"
                              onClick={() => setActiveTab("desc")}
                              style={{
                                background: "none",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "700",
                                color: activeTab === "desc" ? "#088dcd" : "#64748b",
                                borderBottom: activeTab === "desc" ? "2px solid #088dcd" : "2px solid transparent",
                                paddingBottom: "10px",
                                cursor: "pointer",
                              }}
                            >
                              Description &amp; Highlights
                            </button>
                          </li>
                          {item.chapters && (
                            <li>
                              <button
                                type="button"
                                onClick={() => setActiveTab("chapters")}
                                style={{
                                  background: "none",
                                  border: "none",
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  color: activeTab === "chapters" ? "#088dcd" : "#64748b",
                                  borderBottom: activeTab === "chapters" ? "2px solid #088dcd" : "2px solid transparent",
                                  paddingBottom: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                Chapters &amp; Curriculum
                              </button>
                            </li>
                          )}
                          <li>
                            <button
                              type="button"
                              onClick={() => setActiveTab("author")}
                              style={{
                                background: "none",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "700",
                                color: activeTab === "author" ? "#088dcd" : "#64748b",
                                borderBottom: activeTab === "author" ? "2px solid #088dcd" : "2px solid transparent",
                                paddingBottom: "10px",
                                cursor: "pointer",
                              }}
                            >
                              About the Author
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              onClick={() => setActiveTab("reviews")}
                              style={{
                                background: "none",
                                border: "none",
                                fontSize: "14px",
                                fontWeight: "700",
                                color: activeTab === "reviews" ? "#088dcd" : "#64748b",
                                borderBottom: activeTab === "reviews" ? "2px solid #088dcd" : "2px solid transparent",
                                paddingBottom: "10px",
                                cursor: "pointer",
                              }}
                            >
                              Feedback ({reviews.length})
                            </button>
                          </li>
                        </ul>

                        {/* Tab Content: Description */}
                        {activeTab === "desc" && (
                          <div className="book-description">
                            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#334155" }}>
                              {item.extendedDescription || item.description}
                            </p>
                            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#334155" }}>
                              All chapters, exercises, and companion assets are curated in collaboration with academic reviewers and verified industry leads. Once purchased, you get immediate access to digital formats (PDF, ePub) along with source code repositories and discussion rights.
                            </p>
                          </div>
                        )}

                        {/* Tab Content: Chapters */}
                        {activeTab === "chapters" && (
                          <div>
                            <h5 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "15px", color: "#1e293b" }}>
                              Table of Contents &amp; Modules
                            </h5>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                              {item.chapters?.map((ch, idx) => (
                                <li
                                  key={idx}
                                  style={{
                                    padding: "12px 16px",
                                    background: idx % 2 === 0 ? "#f8fafc" : "#ffffff",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#334155",
                                    border: "1px solid #f1f5f9",
                                  }}
                                >
                                  <span>{ch}</span>
                                  <span style={{ fontSize: "11px", color: "#088dcd", background: "#e0f2fe", padding: "2px 8px", borderRadius: "10px" }}>
                                    Full Access
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tab Content: Author */}
                        {activeTab === "author" && (
                          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", background: "#f8fafc", padding: "20px", borderRadius: "10px" }}>
                            <img
                              src="/images/resources/user-avatar-pro.jpg"
                              alt={item.author}
                              style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                              }}
                            />
                            <div>
                              <h5 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700", color: "#1f273f" }}>
                                {item.author}
                              </h5>
                              <span style={{ fontSize: "12px", color: "#088dcd", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                                {item.authorRole || "Academic Author & Contributor"}
                              </span>
                              <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                                Published researcher with over 15 years of industry leadership in distributed computer architecture, algorithmic modeling, and modern pedagogical software books.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Tab Content: Reviews / Feedback Area */}
                        {activeTab === "reviews" && (
                          <div className="comment-area product mt-4">
                            <h4 className="comment-title" style={{ fontSize: "16px", fontWeight: "700", color: "#1f273f" }}>
                              {reviews.length.toString().padStart(2, "0")} Feedback &amp; Reviews
                            </h4>
                            <ul className="comments" style={{ padding: 0, listStyle: "none" }}>
                              {reviews.map((rev) => (
                                <li key={rev.id} style={{ marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>
                                  <div className="comment-box" style={{ display: "flex", gap: "15px" }}>
                                    <div className="commenter-photo" style={{ width: "48px", height: "48px", flexShrink: 0 }}>
                                      <img
                                        alt={rev.author}
                                        src={rev.avatar}
                                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).src = "/images/resources/commenter-1.jpg";
                                        }}
                                      />
                                    </div>
                                    <div className="commenter-meta" style={{ flex: 1 }}>
                                      <div className="comment-titles" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                        <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1f273f" }}>
                                          {rev.author}
                                        </h6>
                                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>{rev.date}</span>
                                        <ins style={{ textDecoration: "none", color: "#ff9800", fontSize: "12px", fontWeight: "700", marginLeft: "auto" }}>
                                          <i className="icofont-star"></i> {rev.rating.toFixed(1)}
                                        </ins>
                                      </div>
                                      <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                                        {rev.comment}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>

                            {/* Add Review Form */}
                            <div className="add-comment" style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px", marginTop: "25px" }}>
                              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1f273f", display: "block", marginBottom: "8px" }}>
                                Give Your Rating
                              </span>
                              <div style={{ display: "flex", gap: "6px", marginBottom: "15px" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <i
                                    key={star}
                                    className="icofont-star"
                                    style={{
                                      fontSize: "20px",
                                      color: star <= newReviewRating ? "#ff9800" : "#cbd5e1",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => setNewReviewRating(star)}
                                  ></i>
                                ))}
                              </div>
                              <form onSubmit={handleSubmitReview} className="c-form">
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
                                  <input
                                    type="text"
                                    placeholder="Your Full Name"
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                                  />
                                  <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={reviewerEmail}
                                    onChange={(e) => setReviewerEmail(e.target.value)}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                                  />
                                </div>
                                <textarea
                                  rows={4}
                                  placeholder="Write your review or feedback..."
                                  value={reviewMessage}
                                  onChange={(e) => setReviewMessage(e.target.value)}
                                  required
                                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", marginBottom: "12px" }}
                                ></textarea>
                                <button className="main-btn" type="submit" style={{ background: "#088dcd", cursor: "pointer" }}>
                                  Add Review
                                </button>
                              </form>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Related Books / Products Section */}
                    <div className="main-wraper" style={{ marginTop: "25px" }}>
                      <h4 className="main-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>Related {type === "book" ? "Books & Publications" : "Marketplace Items"}</span>
                        <Link className="view-all" href={type === "book" ? "/book-detail" : "/products"} title="">
                          view all
                        </Link>
                      </h4>
                      <div className="row">
                        {relatedItems.slice(0, 4).map((rel) => (
                          <div key={rel.id} className="col-lg-3 col-md-6 col-sm-6 mb-3">
                            <div
                              style={{
                                background: "#ffffff",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                              }}
                            >
                              <Link
                                href={type === "book" ? `/book-detail?id=${rel.id}` : `/product-detail?id=${rel.id}`}
                                style={{ display: "block", height: "180px", background: "#f8fafc", padding: "10px", textAlign: "center" }}
                              >
                                <img
                                  src={rel.img}
                                  alt={rel.name}
                                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/images/resources/book1.jpg";
                                  }}
                                />
                              </Link>
                              <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column" }}>
                                <h6 style={{ fontSize: "13px", fontWeight: "700", margin: "0 0 4px 0", lineHeight: 1.3 }}>
                                  <Link
                                    href={type === "book" ? `/book-detail?id=${rel.id}` : `/product-detail?id=${rel.id}`}
                                    style={{ color: "#1f273f", textDecoration: "none" }}
                                  >
                                    {rel.name}
                                  </Link>
                                </h6>
                                <span style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px" }}>
                                  by {rel.author}
                                </span>
                                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <strong style={{ color: "#088dcd", fontSize: "14px" }}>${rel.price.toFixed(2)}</strong>
                                  <Link
                                    href={type === "book" ? `/book-detail?id=${rel.id}` : `/product-detail?id=${rel.id}`}
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      padding: "3px 8px",
                                      background: "#f1f5f9",
                                      borderRadius: "4px",
                                      color: "#334155",
                                      textDecoration: "none",
                                    }}
                                  >
                                    Details
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar: 3 Columns */}
                  <div className="col-lg-3">
                    <aside className="sidebar static right">
                      
                      {/* Popular Books Widget */}
                      <div className="widget">
                        <h4 className="widget-title">Popular Books</h4>
                        {POPULAR_SIDEBAR_BOOKS.map((pop, idx) => (
                          <div key={idx} className="popular-book">
                            <figure>
                              <img src={pop.img} alt={pop.title} />
                            </figure>
                            <div className="book-about">
                              <h6>
                                <Link href={pop.href} title={pop.title}>
                                  {pop.title}
                                </Link>
                              </h6>
                              <span>{pop.author}</span>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  showToast(`"${pop.title}" bookmarked!`);
                                }}
                                title="Book Mark"
                              >
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
                                  className="feather feather-bookmark"
                                >
                                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Ask Research Question Widget */}
                      <div className="widget">
                        <h4 className="widget-title">Ask Research Question?</h4>
                        <div className="ask-question">
                          <i className="icofont-question-circle"></i>
                          <h6>Ask questions in Q&amp;A to get help from experts in your field.</h6>
                          <a
                            className="ask-qst"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsAskQuestionOpen(true);
                            }}
                            title=""
                          >
                            Ask a question
                          </a>
                        </div>
                      </div>

                      {/* Explore Events Widget */}
                      <div className="widget">
                        <h4 className="widget-title">
                          Explore Events{" "}
                          <a className="see-all" href="#" onClick={(e) => e.preventDefault()} title="">
                            See All
                          </a>
                        </h4>
                        {UPCOMING_EVENTS.map((ev, idx) => (
                          <div key={idx} className={`rec-events ${ev.bgClass}`}>
                            <i className={ev.icon}></i>
                            <h6>
                              <a href="#" onClick={(e) => e.preventDefault()} title="">
                                {ev.title}
                              </a>
                            </h6>
                            <img alt="" src="/images/clock.png" />
                          </div>
                        ))}
                      </div>

                      {/* Who's Following Widget */}
                      <div className="widget stick-widget">
                        <h4 className="widget-title">Who&apos;s following</h4>
                        <ul className="followers">
                          {colleagues.map((col, idx) => (
                            <li key={idx}>
                              <figure>
                                <img
                                  alt={col.name}
                                  src={col.img}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/images/resources/friend-avatar.jpg";
                                  }}
                                />
                              </figure>
                              <div className="friend-meta">
                                <h4>
                                  <Link title="" href="/profile">
                                    {col.name}
                                  </Link>
                                  <span>{col.role}</span>
                                </h4>
                                <a
                                  className="underline"
                                  title=""
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleToggleFollow(col.name);
                                  }}
                                  style={{ color: col.following ? "#28a745" : "#088dcd", fontWeight: "600" }}
                                >
                                  {col.following ? "Following" : "Follow"}
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Sample Reader Modal */}
      {isReaderModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setIsReaderModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "28px",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
              onClick={() => setIsReaderModalOpen(false)}
            >
              ✕
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#088dcd", background: "#e0f2fe", padding: "2px 8px", borderRadius: "10px" }}>
                FREE PREVIEW SAMPLE
              </span>
              <span style={{ fontSize: "12px", color: "#64748b" }}>{item.author}</span>
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>
              {item.name}
            </h3>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "8px",
                padding: "20px",
                fontSize: "14px",
                lineHeight: "1.8",
                color: "#334155",
                whiteSpace: "pre-line",
                fontFamily: "Georgia, serif",
                border: "1px solid #e2e8f0",
              }}
            >
              {item.sampleText ||
                `Chapter 1 Excerpt: Architectural Foundations\n\nIn modern systems programming, maintaining clear boundaries between modules is the single greatest determinant of long-term reliability. As codebases expand and concurrent requests multiply, naive patterns degrade into complex synchronization locks.\n\nThroughout this volume, you will master production-tested techniques to write clean, decoupled, and highly maintainable systems.`}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Full book: <strong>{item.pages || "Full Edition"}</strong> • <strong>${item.price.toFixed(2)}</strong>
              </span>
              <button
                type="button"
                className="main-btn"
                onClick={() => {
                  setIsReaderModalOpen(false);
                  handleAddToCart();
                }}
                style={{ background: "#28a745", cursor: "pointer" }}
              >
                Buy Full Book (${item.price.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {isAskQuestionOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
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
              background: "#ffffff",
              borderRadius: "14px",
              maxWidth: "520px",
              width: "100%",
              padding: "25px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{ position: "absolute", top: "14px", right: "16px", cursor: "pointer", fontSize: "20px", color: "#64748b" }}
              onClick={() => setIsAskQuestionOpen(false)}
            >
              ✕
            </span>
            <h4 style={{ margin: "0 0 14px 0", fontSize: "18px", fontWeight: "700", color: "#1f273f" }}>
              Ask a Research Question
            </h4>
            <form onSubmit={handleSubmitQuestion}>
              <input
                type="text"
                placeholder="Question Title (e.g. Memory optimization in async Python)"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                required
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "12px" }}
              />
              <textarea
                rows={4}
                placeholder="Describe your research context and question details..."
                value={questionDetails}
                onChange={(e) => setQuestionDetails(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "16px" }}
              ></textarea>
              <button type="submit" className="main-btn" style={{ width: "100%", background: "#088dcd" }}>
                Submit Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "30px",
            fontSize: "13px",
            fontWeight: "600",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Full Course Footer */}
      <AppFooter />
    </div>
  );
}
