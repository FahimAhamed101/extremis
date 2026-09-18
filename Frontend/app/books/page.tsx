"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";
import { CATALOG_BOOKS, POPULAR_SIDEBAR_BOOKS } from "@/data/marketplaceCatalog";
import { addToCart } from "@/lib/cart/cartService";

export default function BooksDirectoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleCardAddToCart = (book: (typeof CATALOG_BOOKS)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: book.id,
      name: book.name,
      price: book.price,
      img: book.img,
      type: "book",
      author: book.author,
      desc: book.description,
    });
    showToast(`"${book.name}" added to cart!`);
  };

  const handleCardBuyNow = (book: (typeof CATALOG_BOOKS)[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: book.id,
      name: book.name,
      price: book.price,
      img: book.img,
      type: "book",
      author: book.author,
      desc: book.description,
    });
    router.push("/checkout");
  };

  const categories = ["All", "Software Engineering", "Game Development", "UI/UX", "Artificial Intelligence"];

  const filteredBooks = useMemo(() => {
    return CATALOG_BOOKS.filter((b) => {
      const matchText =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        selectedCategory === "All" ||
        (b.category && b.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      return matchText && matchCat;
    });
  }, [search, selectedCategory]);

  return (
    <div className="theme-layout">
      <HomeHeader />

      {/* Main Section */}
      <section style={{ padding: "30px 0 60px 0", minHeight: "85vh" }}>
        <div className="container">
          {/* Header Banner */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              padding: "24px 28px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              marginBottom: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#088dcd", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Updates Community Library
              </span>
              <h2 style={{ margin: "4px 0 6px 0", fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                Books &amp; Publications
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Explore publications, literature, guides, and books shared by the community.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "30px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  minWidth: "260px",
                }}
              />
            </div>
          </div>

          {/* Category Chips */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "25px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: selectedCategory === cat ? "1px solid #088dcd" : "1px solid #e2e8f0",
                  background: selectedCategory === cat ? "#088dcd" : "#ffffff",
                  color: selectedCategory === cat ? "#ffffff" : "#475569",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="row">
            {filteredBooks.map((book) => (
              <div key={book.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.03)";
                  }}
                >
                  <Link
                    href={`/books/${book.id}`}
                    style={{
                      display: "block",
                      height: "230px",
                      background: "#f8fafc",
                      padding: "16px",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <img
                      src={book.img}
                      alt={book.name}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "6px" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/resources/book3.jpg";
                      }}
                    />
                    {book.tag && (
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "#ff9800",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "10px",
                        }}
                      >
                        {book.tag}
                      </span>
                    )}
                  </Link>

                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                      <i className="icofont-star" style={{ color: "#ff9800", fontSize: "13px" }}></i>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>{book.rating.toFixed(1)}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>({book.reviewsCount})</span>
                    </div>

                    <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "700", lineHeight: 1.3 }}>
                      <Link href={`/books/${book.id}`} style={{ color: "#0f172a", textDecoration: "none" }}>
                        {book.name}
                      </Link>
                    </h4>

                    <span style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                      by {book.author}
                    </span>

                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: "17px", fontWeight: "800", color: "#088dcd" }}>
                            ${book.price.toFixed(2)}
                          </span>
                          {book.oldPrice && (
                            <span style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through", marginLeft: "6px" }}>
                              ${book.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/books/${book.id}`}
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#64748b",
                            textDecoration: "none",
                          }}
                        >
                          Details &rarr;
                        </Link>
                      </div>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={(e) => handleCardAddToCart(book, e)}
                          style={{
                            flex: 1,
                            padding: "7px 10px",
                            borderRadius: "6px",
                            background: "#f1f5f9",
                            color: "#1e293b",
                            border: "1px solid #cbd5e1",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          <i className="icofont-cart-alt"></i> Cart
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleCardBuyNow(book, e)}
                          style={{
                            flex: 1,
                            padding: "7px 10px",
                            borderRadius: "6px",
                            background: "#088dcd",
                            color: "#ffffff",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          <i className="icofont-flash"></i> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 9999,
            fontSize: "14px",
            fontWeight: 500,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <span style={{ color: "#22c55e", fontSize: "16px" }}>✓</span>
          <span>{toastMsg}</span>
          <Link
            href="/checkout"
            style={{
              marginLeft: "12px",
              color: "#38bdf8",
              fontWeight: 700,
              textDecoration: "underline",
              fontSize: "13px",
            }}
          >
            Checkout &rarr;
          </Link>
        </div>
      )}

      {/* Full Course Footer */}
      <AppFooter />
    </div>
  );
}
