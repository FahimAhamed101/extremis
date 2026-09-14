"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productsList, setProductsList] = useState([
    {
      id: 1,
      title: "Academic Research Journal",
      category: "Publications",
      price: 39,
      rating: "5.0",
      image: "/images/resources/course-5.jpg",
      stock: 45,
    },
    {
      id: 2,
      title: "Data Science Interactive Kit",
      category: "Learning Kit",
      price: 68,
      rating: "4.9",
      image: "/images/resources/course-3.jpg",
      stock: 22,
    },
    {
      id: 3,
      title: "Socimo Branded Hoodie",
      category: "Apparel",
      price: 48,
      rating: "4.7",
      image: "/images/resources/course-1.jpg",
      stock: 80,
    },
    {
      id: 4,
      title: "Python Machine Learning Masterclass",
      category: "Online Course",
      price: 89,
      rating: "5.0",
      image: "/images/resources/course-2.jpg",
      stock: 150,
    },
    {
      id: 5,
      title: "Biotech Laboratory Manual 2026",
      category: "Books",
      price: 29,
      rating: "4.5",
      image: "/images/resources/course-4.jpg",
      stock: 60,
    },
    {
      id: 6,
      title: "Smart Ergonomic Desk Mat",
      category: "Accessories",
      price: 24,
      rating: "4.8",
      image: "/images/resources/course-6.jpg",
      stock: 35,
    },
  ]);

  const [cartCount, setCartCount] = useState(0);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Courses");
  const [newPrice, setNewPrice] = useState(49);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      price: Number(newPrice),
      rating: "5.0",
      image: "/images/resources/course-1.jpg",
      stock: 50,
    };

    setProductsList([newProd, ...productsList]);
    setNewTitle("");
    setIsAddProductOpen(false);
  };

  const filtered = productsList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Products" breadcrumb="Products">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 className="main-title" style={{ margin: 0 }}>Products & Store Catalog</h4>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "6px" }}>
            <i className="icofont-cart-alt" style={{ fontSize: "16px", color: "#088dcd" }}></i>
            Cart: <strong>{cartCount}</strong>
          </span>
          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
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
            <i className="icofont-plus"></i> Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="d-widget" style={{ background: "#fff", padding: "16px 20px", borderRadius: "10px", border: "1px solid #edf2f6", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search products or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "280px", padding: "8px 14px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px" }}
          />
          <span style={{ fontSize: "13px", color: "#888" }}>
            Showing <strong>{filtered.length}</strong> items
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row merged-10">
        {filtered.map((prod) => (
          <div key={prod.id} className="col-lg-4 col-md-6 mb-4">
            <div
              className="prod-item"
              style={{
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #edf2f6",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                transition: "transform 0.2s ease",
              }}
            >
              <div style={{ position: "relative", height: "180px", overflow: "hidden", background: "#f8f9fa" }}>
                <img
                  src={prod.image}
                  alt={prod.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/resources/course-5.jpg";
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "#fff",
                    color: "#f1b44c",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  ★ {prod.rating}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "12px",
                  }}
                >
                  {prod.category}
                </span>
              </div>

              <div style={{ padding: "16px 20px" }}>
                <h5 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 700, color: "#222" }}>
                  {prod.title}
                </h5>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <div>
                    <span style={{ fontSize: "20px", fontWeight: 800, color: "#088dcd" }}>
                      ${prod.price}
                    </span>
                    <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "6px" }}>
                      ({prod.stock} in stock)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCartCount((prev) => prev + 1);
                      alert(`Added "${prod.title}" to cart!`);
                    }}
                    style={{
                      background: "#e8f4fd",
                      color: "#088dcd",
                      border: "1px solid #c9e6f9",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <i className="icofont-cart"></i> Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
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
          <div style={{ background: "#fff", borderRadius: "10px", padding: "24px", width: "450px", maxWidth: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Add Store Product</h5>
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Masterclass Course"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                >
                  <option value="Online Course">Online Course</option>
                  <option value="Publications">Publications</option>
                  <option value="Books">Books</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Price ($)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f8f9fa" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "6px", background: "#088dcd", color: "#fff", border: "none" }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
