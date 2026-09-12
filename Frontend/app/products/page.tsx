"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, useMemo, useEffect, ChangeEvent, FormEvent } from "react";
import HomeHeader from "@/components/layout/HomeHeader";

type Product = {
  id: string;
  name: string;
  category: "Apparel" | "Books" | "Courses" | "Electronics" | "Accessories";
  price: number;
  rating: number;
  img: string;
  description: string;
  isCustom?: boolean;
  author?: string;
};

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p-1",
    name: "Technical Words 2024 Research World",
    category: "Books",
    price: 39,
    rating: 5.0,
    img: "/images/resources/book5.jpg",
    description: "Complete handbook for academic research, terminology, and paper writing.",
    author: "Georg Peeter",
  },
  {
    id: "p-2",
    name: "Complete Python Data Science & AI Bootcamp",
    category: "Courses",
    price: 89,
    rating: 4.9,
    img: "/images/resources/course-1.jpg",
    description: "Master modern AI models, PyTorch, pandas, and data science workflows.",
    author: "Dr. Amy Watson",
  },
  {
    id: "p-3",
    name: "Pro Research Laptop & Workstation Kit",
    category: "Electronics",
    price: 499,
    rating: 4.8,
    img: "/images/resources/laptop.png",
    description: "Ultra-portable performance laptop suited for research computation and design.",
    author: "Socimo Tech",
  },
  {
    id: "p-4",
    name: "Egyptian Mythology & Ancient History",
    category: "Books",
    price: 29,
    rating: 4.7,
    img: "/images/resources/book1.jpg",
    description: "An illustrated historical journey into ancient civilisations and archaeology.",
    author: "Prof. John Carter",
  },
  {
    id: "p-5",
    name: "Advanced AI & Machine Learning Specialization",
    category: "Courses",
    price: 99,
    rating: 5.0,
    img: "/images/resources/course-2.jpg",
    description: "In-depth specialization exploring deep neural nets, transformers, and LLMs.",
    author: "AI Research Lab",
  },
  {
    id: "p-6",
    name: "Wireless Active Noise-Cancelling Headphones",
    category: "Accessories",
    price: 79,
    rating: 4.6,
    img: "/images/resources/sponsor-prod1.jpg",
    description: "High-fidelity audio with deep focus mode for library study sessions.",
    author: "AudioCraft",
  },
  {
    id: "p-7",
    name: "Socimo Premium Researcher Hoodie",
    category: "Apparel",
    price: 45,
    rating: 4.9,
    img: "/images/resources/sponsor-prod2.jpg",
    description: "Heavyweight organic cotton hoodie with soft brushed fleece interior.",
    author: "Socimo Apparel",
  },
  {
    id: "p-8",
    name: "Modern Science & Astrophysics Fundamentals",
    category: "Books",
    price: 42,
    rating: 4.8,
    img: "/images/resources/book3.jpg",
    description: "Explore planetary physics, quantum mechanics, and cosmology.",
    author: "Cambridge Science Press",
  },
  {
    id: "p-9",
    name: "Global UX & Interaction Design Masterclass",
    category: "Courses",
    price: 65,
    rating: 4.7,
    img: "/images/resources/course-4.jpg",
    description: "Learn Figma, design systems, micro-interactions, and design research.",
    author: "Elena Rostova",
  },
  {
    id: "p-10",
    name: "Ergonomic Desk Tech Organizer & Stand",
    category: "Accessories",
    price: 28,
    rating: 4.5,
    img: "/images/resources/sponsor-prod4.jpg",
    description: "Solid wood multi-device stand for phones, tablets, and pens.",
    author: "WoodCraft Studios",
  },
  {
    id: "p-11",
    name: "Campus Heritage Oxford Cotton Shirt",
    category: "Apparel",
    price: 35,
    rating: 4.6,
    img: "/images/resources/sponsor-prod3.jpg",
    description: "Breathable crisp cotton Oxford button-down shirt.",
    author: "Socimo Apparel",
  },
  {
    id: "p-12",
    name: "Quantum Computing & Algorithms for Beginners",
    category: "Books",
    price: 54,
    rating: 5.0,
    img: "/images/resources/book6.jpg",
    description: "Gentle introduction to qubits, quantum gates, and quantum simulators.",
    author: "Dr. Robert Frank",
  },
];

const PRESET_IMAGES = [
  { label: "Book 1", url: "/images/resources/book5.jpg" },
  { label: "Book 2", url: "/images/resources/book1.jpg" },
  { label: "Book 3", url: "/images/resources/book3.jpg" },
  { label: "Book 4", url: "/images/resources/book6.jpg" },
  { label: "Course 1", url: "/images/resources/course-1.jpg" },
  { label: "Course 2", url: "/images/resources/course-2.jpg" },
  { label: "Course 3", url: "/images/resources/course-4.jpg" },
  { label: "Laptop Tech", url: "/images/resources/laptop.png" },
  { label: "Headphones", url: "/images/resources/sponsor-prod1.jpg" },
  { label: "Hoodie", url: "/images/resources/sponsor-prod2.jpg" },
  { label: "Shirt", url: "/images/resources/sponsor-prod3.jpg" },
  { label: "Desk Stand", url: "/images/resources/sponsor-prod4.jpg" },
];

const STORAGE_KEY = "socimo_custom_products_v1";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<Product["category"]>("Books");
  const [newPrice, setNewPrice] = useState("");
  const [newRating, setNewRating] = useState("5.0");
  const [newDescription, setNewDescription] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

  // Quick View Modal
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // Load custom products from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts([...parsed, ...DEFAULT_PRODUCTS]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCustomImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCustomImagePreview(reader.result);
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e: FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    const priceNum = parseFloat(newPrice);

    if (!title) {
      alert("Please provide a product title.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const newProductItem: Product = {
      id: `custom-${Date.now()}`,
      name: title,
      category: newCategory,
      price: Math.round(priceNum * 100) / 100,
      rating: parseFloat(newRating) || 5.0,
      img: selectedImage || "/images/resources/book5.jpg",
      description: newDescription.trim() || "Quality product listed on Socimo Marketplace.",
      isCustom: true,
      author: newAuthor.trim() || "Verified Creator",
    };

    setProducts((prev) => [newProductItem, ...prev]);

    // Persist custom products
    try {
      const existingSaved = localStorage.getItem(STORAGE_KEY);
      const customList: Product[] = existingSaved ? JSON.parse(existingSaved) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newProductItem, ...customList]));
    } catch {
      // storage error fallback
    }

    // Reset Form
    setNewTitle("");
    setNewPrice("");
    setNewDescription("");
    setNewAuthor("");
    setCustomImagePreview(null);
    setSelectedImage(PRESET_IMAGES[0].url);
    setIsAddModalOpen(false);

    setToastMessage(`Product "${newProductItem.name}" published successfully!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      const existingSaved = localStorage.getItem(STORAGE_KEY);
      if (existingSaved) {
        const customList: Product[] = JSON.parse(existingSaved);
        const updated = customList.filter((p) => p.id !== productId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
    setToastMessage("Product removed.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.author && product.author.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setToastMessage(`Added "${product.name}" to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="theme-layout">
      <HomeHeader />

      {/* Main Scoped Products Section */}
      <section style={{ minHeight: "85vh", padding: "20px 0 60px 0" }}>
        <div className="container" style={{ maxWidth: "1240px" }}>
          
          {/* Top Controls & Banner */}
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px 25px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              marginBottom: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#1f273f", margin: "0 0 4px 0" }}>
                Socimo Marketplace &amp; Products
              </h3>
              <span style={{ fontSize: "13px", color: "#82828e" }}>
                Browse publications, research books, educational courses, apparel, and hardware gear
              </span>
            </div>

            {/* Actions: Search, Add Product, Cart */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              {/* Search Bar */}
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "8px 36px 8px 14px",
                    borderRadius: "20px",
                    border: "1px solid #dfdfdf",
                    fontSize: "13px",
                    outline: "none",
                    width: "200px",
                  }}
                />
                <i
                  className="icofont-search"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "10px",
                    color: "#888",
                    fontSize: "14px",
                  }}
                ></i>
              </div>

              {/* Add Product Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(40,167,69,0.25)",
                }}
              >
                <i className="icofont-plus-circle" style={{ fontSize: "15px" }}></i> Add Product
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                style={{
                  background: "#088dcd",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 8px rgba(8,141,205,0.25)",
                }}
              >
                <i className="icofont-cart-alt"></i> Cart ({totalCartCount})
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginRight: "5px" }}>
              Filter By:
            </span>
            {["All", "Books", "Courses", "Electronics", "Apparel", "Accessories"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? "#088dcd" : "#fff",
                  color: selectedCategory === cat ? "#fff" : "#555",
                  border: selectedCategory === cat ? "1px solid #088dcd" : "1px solid #e1e8ed",
                  borderRadius: "20px",
                  padding: "6px 18px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: selectedCategory === cat ? "0 2px 6px rgba(8,141,205,0.2)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: "13px", color: "#888" }}>
              Showing <strong>{filteredProducts.length}</strong> items
            </span>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div
              style={{
                position: "fixed",
                bottom: "25px",
                right: "25px",
                background: "#1f273f",
                color: "#fff",
                padding: "12px 22px",
                borderRadius: "8px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                zIndex: 99999,
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i className="icofont-check-circled" style={{ color: "#28a745", fontSize: "18px" }}></i>{" "}
              {toastMessage}
            </div>
          )}

          {/* Products Grid */}
          <div className="row merged20">
            {filteredProducts.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className="prod-item"
                  style={{
                    background: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #eaeaea",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Rating Tag */}
                  <span
                    className="prod-rating"
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "rgba(255, 152, 0, 0.95)",
                      color: "#fff",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      zIndex: 2,
                    }}
                  >
                    <i className="icofont-star"></i> {product.rating.toFixed(1)}
                  </span>

                  {/* Category / Custom Badge */}
                  {product.isCustom && (
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "#28a745",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: "700",
                        zIndex: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      New
                    </span>
                  )}

                  {/* Product Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "210px",
                      background: "#f9fafb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: "15px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onClick={() => setViewProduct(product)}
                  >
                    <img
                      alt={product.name}
                      src={product.img}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        transition: "transform 0.3s ease",
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/resources/book5.jpg";
                      }}
                    />
                  </div>

                  {/* Product Meta Body */}
                  <div style={{ padding: "15px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        color: "#088dcd",
                        fontWeight: "700",
                        marginBottom: "4px",
                      }}
                    >
                      {product.category}
                    </span>
                    <h4
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#1f273f",
                        margin: "0 0 6px 0",
                        lineHeight: "1.3",
                        height: "40px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        cursor: "pointer",
                      }}
                      onClick={() => setViewProduct(product)}
                    >
                      {product.name}
                    </h4>

                    {product.author && (
                      <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px 0" }}>
                        By {product.author}
                      </p>
                    )}

                    {/* Price and Cart Button */}
                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "10px",
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#088dcd" }}>
                        ${product.price}
                      </span>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <Link
                          href={`/products/${product.id}`}
                          style={{
                            background: "#f1f5f9",
                            color: "#334155",
                            borderRadius: "20px",
                            padding: "6px 10px",
                            fontSize: "11px",
                            fontWeight: "600",
                            textDecoration: "none",
                          }}
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          style={{
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "20px",
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className="icofont-cart-alt"></i> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #eaeaea",
              }}
            >
              <i className="icofont-shopping-bag" style={{ fontSize: "48px", color: "#ccc" }}></i>
              <h4 style={{ marginTop: "15px", color: "#1f273f" }}>No products found</h4>
              <p style={{ color: "#888", fontSize: "13px" }}>
                Try adjusting your search query or filter, or click &quot;Add Product&quot; to publish a new one!
              </p>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="main-btn"
                style={{ marginTop: "10px" }}
              >
                + Add Your First Product
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddModalOpen && (
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
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "25px",
              position: "relative",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                cursor: "pointer",
                fontSize: "22px",
                color: "#666",
              }}
              onClick={() => setIsAddModalOpen(false)}
            >
              &times;
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#e8f5e9",
                  color: "#28a745",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                <i className="icofont-cart"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1f273f" }}>
                  Publish New Product
                </h4>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  List your book, course, hardware, or merchandise for sale on Socimo
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateProduct}>
              {/* Product Name */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deep Learning with Python 2026 Edition"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #dfdfdf",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                  required
                />
              </div>

              {/* Category & Price */}
              <div className="row" style={{ marginBottom: "14px" }}>
                <div className="col-lg-6">
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Product["category"])}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #dfdfdf",
                      borderRadius: "6px",
                      fontSize: "13px",
                      background: "#fff",
                    }}
                  >
                    <option value="Books">Books &amp; Publications</option>
                    <option value="Courses">Online Courses</option>
                    <option value="Electronics">Electronics &amp; Hardware</option>
                    <option value="Apparel">Apparel &amp; Clothing</option>
                    <option value="Accessories">Accessories &amp; Supplies</option>
                  </select>
                </div>
                <div className="col-lg-6">
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="e.g. 49.99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #dfdfdf",
                      borderRadius: "6px",
                      fontSize: "13px",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Author / Creator & Rating */}
              <div className="row" style={{ marginBottom: "14px" }}>
                <div className="col-lg-6">
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                    Author / Creator
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cambridge Research Press"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #dfdfdf",
                      borderRadius: "6px",
                      fontSize: "13px",
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                    Rating (1.0 - 5.0)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      border: "1px solid #dfdfdf",
                      borderRadius: "6px",
                      fontSize: "13px",
                      background: "#fff",
                    }}
                  >
                    <option value="5.0">⭐ 5.0 (Excellent)</option>
                    <option value="4.8">⭐ 4.8 (Very Good)</option>
                    <option value="4.5">⭐ 4.5 (Great)</option>
                    <option value="4.0">⭐ 4.0 (Good)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px" }}>
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the key features, syllabus, or benefits of this item..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #dfdfdf",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                ></textarea>
              </div>

              {/* Product Image Selection & Upload */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
                  Product Image
                </label>

                {/* Preset image selector */}
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
                  {PRESET_IMAGES.map((imgItem, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedImage(imgItem.url);
                        setCustomImagePreview(null);
                      }}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "6px",
                        border: selectedImage === imgItem.url && !customImagePreview ? "2px solid #088dcd" : "1px solid #dfdfdf",
                        cursor: "pointer",
                        overflow: "hidden",
                        flexShrink: 0,
                        padding: "3px",
                        background: "#fdfdfd",
                      }}
                      title={imgItem.label}
                    >
                      <img
                        src={imgItem.url}
                        alt={imgItem.label}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Or Custom File Upload */}
                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <label
                    style={{
                      background: "#f0f4f8",
                      border: "1px dashed #088dcd",
                      borderRadius: "6px",
                      padding: "8px 14px",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "#088dcd",
                      fontWeight: "600",
                    }}
                  >
                    <i className="icofont-upload-alt"></i> Upload Custom Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                  {customImagePreview && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <img
                        src={customImagePreview}
                        alt="Uploaded"
                        style={{ width: "35px", height: "35px", borderRadius: "4px", objectFit: "cover" }}
                      />
                      <span style={{ fontSize: "11px", color: "#28a745", fontWeight: "600" }}>
                        Custom image ready
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    background: "#f5f5f5",
                    color: "#555",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 18px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 24px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(40,167,69,0.3)",
                  }}
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PRODUCT QUICK VIEW MODAL ================= */}
      {viewProduct && (
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
          onClick={() => setViewProduct(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              maxWidth: "700px",
              width: "100%",
              padding: "25px",
              position: "relative",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                cursor: "pointer",
                fontSize: "24px",
                color: "#666",
              }}
              onClick={() => setViewProduct(null)}
            >
              &times;
            </span>

            <div className="row align-items-center">
              <div className="col-lg-5 text-center">
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "260px",
                  }}
                >
                  <img
                    src={viewProduct.img}
                    alt={viewProduct.name}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#088dcd",
                    textTransform: "uppercase",
                  }}
                >
                  {viewProduct.category}
                </span>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1f273f", margin: "6px 0" }}>
                  {viewProduct.name}
                </h3>
                {viewProduct.author && (
                  <span style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "8px" }}>
                    By <strong>{viewProduct.author}</strong>
                  </span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ color: "#ff9800", fontWeight: "700", fontSize: "14px" }}>
                    ⭐ {viewProduct.rating.toFixed(1)} / 5.0
                  </span>
                  <span style={{ fontSize: "12px", color: "#aaa" }}>• Verified Quality</span>
                </div>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.5", marginBottom: "16px" }}>
                  {viewProduct.description}
                </p>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#088dcd", marginBottom: "18px" }}>
                  ${viewProduct.price}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(viewProduct);
                      setViewProduct(null);
                    }}
                    style={{
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "25px",
                      padding: "10px 24px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <i className="icofont-cart-alt"></i> Add To Cart
                  </button>
                  <Link
                    href={`/products/${viewProduct.id}`}
                    style={{
                      background: "#088dcd",
                      color: "#fff",
                      borderRadius: "25px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    Full Details →
                  </Link>
                  {viewProduct.isCustom && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteProduct(viewProduct.id);
                        setViewProduct(null);
                      }}
                      style={{
                        background: "#ffebee",
                        color: "#d32f2f",
                        border: "none",
                        borderRadius: "25px",
                        padding: "10px 16px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Delete Product
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CART DRAWER ================= */}
      {isCartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "#fff",
              height: "100%",
              boxShadow: "-8px 0 30px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              padding: "25px",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #eaeaea",
                paddingBottom: "15px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1f273f" }}>
                Your Cart ({totalCartCount})
              </h4>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: "80px", color: "#888" }}>
                  <i className="icofont-cart-alt" style={{ fontSize: "42px", color: "#ddd" }}></i>
                  <p style={{ marginTop: "12px", fontSize: "14px" }}>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "15px",
                      paddingBottom: "15px",
                      borderBottom: "1px dashed #eaeaea",
                    }}
                  >
                    <img
                      src={product.img}
                      alt={product.name}
                      style={{ width: "55px", height: "55px", objectFit: "contain", borderRadius: "6px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#1f273f" }}>
                        {product.name}
                      </h5>
                      <span style={{ fontSize: "13px", color: "#088dcd", fontWeight: "600" }}>
                        ${product.price} x {quantity} = ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCartItems((prev) => prev.filter((item) => item.product.id !== product.id))
                      }
                      style={{
                        background: "#ffe5e5",
                        color: "#ff4141",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px", marginTop: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "15px",
                    color: "#1f273f",
                  }}
                >
                  <span>Subtotal:</span>
                  <span>${totalCartPrice.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Order placed successfully via Socimo Payments!")}
                  style={{
                    width: "100%",
                    background: "#088dcd",
                    color: "#fff",
                    border: "none",
                    borderRadius: "25px",
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <div className="cart-product">
        <Link href="/cart" title="View Cart">
          <i className="icofont-cart-alt"></i>
        </Link>
        <span>{totalCartCount > 0 ? totalCartCount.toString().padStart(2, "0") : "03"}</span>
      </div>
    </div>
  );
}
