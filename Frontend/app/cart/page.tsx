"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, useMemo, FormEvent, useEffect } from "react";
import HomeHeader from "@/components/layout/HomeHeader";
import {
  CartItem,
  getCartItems,
  onCartChange,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "@/lib/cart/cartService";

const SHIPPING_OPTIONS: { [key: string]: { label: string; cost: number; eta: string } } = {
  US: { label: "United States (Standard 2-4 Days)", cost: 8.0, eta: "2-4 business days" },
  CA: { label: "Canada (Express 3-5 Days)", cost: 10.0, eta: "3-5 business days" },
  UK: { label: "United Kingdom & Europe (Express 3-5 Days)", cost: 12.0, eta: "3-5 business days" },
  AU: { label: "Australia & Asia Pacific (5-7 Days)", cost: 15.0, eta: "5-7 business days" },
  DIGITAL: { label: "Digital Download / Instant Delivery", cost: 0.0, eta: "Instant delivery to email" },
};

export default function ProductCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>({
    code: "WELCOME",
    discount: 5.0,
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  const [selectedCountry, setSelectedCountry] = useState("US");
  const shippingInfo = SHIPPING_OPTIONS[selectedCountry] || SHIPPING_OPTIONS.US;

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Floating Live Chat
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState<"all" | "active">("all");

  // Synchronize cart items reactively
  useEffect(() => {
    setCartItems(getCartItems());
    const unsubscribe = onCartChange((newItems) => {
      setCartItems(newItems);
    });
    return unsubscribe;
  }, []);

  // Quantity controllers
  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    updateCartQuantity(id, newQty);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to remove all items from your cart?")) {
      clearCart();
    }
  };

  const handleApplyCoupon = (e?: FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    const code = (directCode || couponCode).trim().toUpperCase();
    if (!code) return;

    setCouponError(null);

    if (code === "SOCIMO10" || code === "SAVE10") {
      setAppliedCoupon({ code, discount: 10.0 });
      setCouponCode("");
    } else if (code === "FREESHIP") {
      setAppliedCoupon({ code, discount: shippingInfo.cost });
      setCouponCode("");
    } else if (code === "WELCOME") {
      setAppliedCoupon({ code, discount: 5.0 });
      setCouponCode("");
    } else {
      setCouponError(`Coupon code "${code}" is invalid or expired.`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cartItems]);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingCost = shippingInfo.cost;

  const grandTotal = useMemo(() => {
    const total = subTotal - discountAmount + shippingCost;
    return total > 0 ? total : 0;
  }, [subTotal, discountAmount, shippingCost]);

  const handleProceedCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add products before checking out.");
      return;
    }
    window.location.href = "/checkout";
  };

  const handleConfirmOrder = (e: FormEvent) => {
    e.preventDefault();
    setIsProcessingOrder(true);
    setTimeout(() => {
      setIsProcessingOrder(false);
      setIsOrderPlaced(true);
      setTimeout(() => {
        setCartItems([]);
      }, 500);
    }, 1200);
  };

  return (
    <div className="theme-layout" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <HomeHeader />

      {/* Cart Breadcrumb & Header Bar */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "24px 0",
          marginBottom: "30px",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", marginBottom: "6px" }}>
                <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
                <span>/</span>
                <Link href="/products" style={{ color: "#64748b", textDecoration: "none" }}>Marketplace</Link>
                <span>/</span>
                <span style={{ color: "#088dcd", fontWeight: "600" }}>Cart</span>
              </nav>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
                Shopping Cart
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "3px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              </h2>
            </div>

            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "30px",
                background: "#f1f5f9",
                color: "#334155",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e2e8f0";
                e.currentTarget.style.color = "#0f172a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.color = "#334155";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Main Section: 2-Column Responsive Layout */}
      <section style={{ paddingBottom: "60px" }}>
        <div className="container">
          <div className="row">
            {/* Left Column: Cart Items List (col-lg-8) */}
            <div className="col-lg-8 col-md-12">
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  marginBottom: "25px",
                }}
              >
                {/* Cart Card Header */}
                <div
                  style={{
                    padding: "18px 24px",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                    Your Selected Items
                  </span>
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Clear Bag
                    </button>
                  )}
                </div>

                {/* Items List */}
                {cartItems.length > 0 ? (
                  <div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Product
                            </th>
                            <th style={{ padding: "14px 16px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Price
                            </th>
                            <th style={{ padding: "14px 16px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Quantity
                            </th>
                            <th style={{ padding: "14px 20px", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>
                              Subtotal
                            </th>
                            <th style={{ width: "50px", padding: "14px 16px" }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: "1px solid #f1f5f9",
                                transition: "background 0.15s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              {/* Product Info */}
                              <td style={{ padding: "18px 20px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                  <div
                                    style={{
                                      width: "72px",
                                      height: "72px",
                                      borderRadius: "10px",
                                      overflow: "hidden",
                                      flexShrink: 0,
                                      border: "1px solid #e2e8f0",
                                      background: "#f8fafc",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src={item.img}
                                      alt={item.name}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "/images/resources/book1.jpg";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span
                                      style={{
                                        display: "inline-block",
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        color: "#088dcd",
                                        background: "#e0f2fe",
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {item.category}
                                    </span>
                                    <h5
                                      style={{
                                        margin: "0 0 4px 0",
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "#0f172a",
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {item.name}
                                    </h5>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#64748b" }}>
                                      <span>By: {item.author}</span>
                                      <span>•</span>
                                      <span style={{ color: "#10b981", fontWeight: "600" }}>✓ In Stock</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td style={{ padding: "18px 16px", fontSize: "15px", fontWeight: "600", color: "#334155" }}>
                                ${item.price.toFixed(2)}
                              </td>

                              {/* Quantity Stepper */}
                              <td style={{ padding: "18px 16px" }}>
                                <div
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "8px",
                                    background: "#ffffff",
                                    overflow: "hidden",
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      border: "none",
                                      background: "#f8fafc",
                                      color: "#475569",
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </button>
                                  <span
                                    style={{
                                      width: "38px",
                                      textAlign: "center",
                                      fontSize: "14px",
                                      fontWeight: "700",
                                      color: "#0f172a",
                                    }}
                                  >
                                    {item.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      border: "none",
                                      background: "#f8fafc",
                                      color: "#475569",
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "background 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              {/* Subtotal */}
                              <td style={{ padding: "18px 20px", fontSize: "16px", fontWeight: "700", color: "#088dcd", textAlign: "right" }}>
                                ${(item.price * item.qty).toFixed(2)}
                              </td>

                              {/* Remove Trash Button */}
                              <td style={{ padding: "18px 16px", textAlign: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  title="Remove item"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#94a3b8",
                                    cursor: "pointer",
                                    padding: "6px",
                                    borderRadius: "6px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.15s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "#ef4444";
                                    e.currentTarget.style.background = "#fef2f2";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "#94a3b8";
                                    e.currentTarget.style.background = "none";
                                  }}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Bottom Row Actions */}
                    <div
                      style={{
                        padding: "16px 24px",
                        background: "#fafafa",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <Link
                        href="/products"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 18px",
                          borderRadius: "8px",
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                          fontSize: "13px",
                          fontWeight: "600",
                          textDecoration: "none",
                          width: "auto",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#94a3b8";
                          e.currentTarget.style.background = "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          e.currentTarget.style.background = "#ffffff";
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="19" y1="12" x2="5" y2="12"></line>
                          <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Continue Shopping
                      </Link>

                      <button
                        type="button"
                        onClick={() => alert("Cart amounts and stock updated successfully!")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 18px",
                          borderRadius: "8px",
                          background: "#f0f9ff",
                          border: "1px solid #bae6fd",
                          color: "#0369a1",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#e0f2fe";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f0f9ff";
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Update Shopping Cart
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty Cart State */
                  <div style={{ textAlign: "center", padding: "60px 24px" }}>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        margin: "0 auto 16px auto",
                        borderRadius: "50%",
                        background: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                      }}
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </div>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
                      Your Shopping Cart is Empty
                    </h4>
                    <p style={{ margin: "0 auto 20px auto", maxWidth: "360px", fontSize: "14px", color: "#64748b" }}>
                      You don&apos;t have any books, courses, or digital assets in your bag right now.
                    </p>
                    <Link
                      href="/products"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 24px",
                        borderRadius: "30px",
                        background: "#088dcd",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "600",
                        textDecoration: "none",
                        boxShadow: "0 4px 12px rgba(8, 141, 205, 0.3)",
                      }}
                    >
                      Explore Marketplace
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* Guarantees / Reassurance Row */}
              <div className="row" style={{ marginTop: "15px" }}>
                {[
                  {
                    icon: "⚡",
                    title: "Instant Digital Access",
                    desc: "Course & ebook materials delivered instantly upon checkout.",
                  },
                  {
                    icon: "🔒",
                    title: "Bank-Grade Security",
                    desc: "256-bit SSL encrypted payment gateway for zero fraud risk.",
                  },
                  {
                    icon: "↺",
                    title: "30-Day Guarantee",
                    desc: "100% money-back guarantee if you are not fully satisfied.",
                  },
                  {
                    icon: "💬",
                    title: "24/7 Expert Support",
                    desc: "Our community & customer support team is always here to help.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="col-lg-6 col-md-6 col-sm-12" style={{ marginBottom: "15px" }}>
                    <div
                      style={{
                        background: "#ffffff",
                        padding: "16px 18px",
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                      }}
                    >
                      <span style={{ fontSize: "24px", lineHeight: 1 }}>{item.icon}</span>
                      <div>
                        <h6 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                          {item.title}
                        </h6>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: 1.4 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sticky Order Summary Card (col-lg-4) */}
            <div className="col-lg-4 col-md-12">
              <div
                style={{
                  position: "sticky",
                  top: "90px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
                  padding: "24px",
                }}
              >
                {/* Summary Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                    Order Summary
                  </h4>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
                    {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* 1. Integrated Coupon Code */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
                    Promotional Coupon
                  </label>
                  <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          fontSize: "13px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          outline: "none",
                          transition: "border 0.2s ease",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#088dcd")}
                        onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 18px",
                        fontSize: "13px",
                        fontWeight: "600",
                        background: "#088dcd",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#0275a8")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#088dcd")}
                    >
                      Apply
                    </button>
                  </form>

                  {/* Coupon Error */}
                  {couponError && (
                    <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#ef4444", fontWeight: "500" }}>
                      {couponError}
                    </p>
                  )}

                  {/* Active Applied Coupon Tag */}
                  {appliedCoupon && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "8px 12px",
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#065f46", fontWeight: "600" }}>
                        <span>🏷️</span>
                        <span>Coupon &quot;{appliedCoupon.code}&quot; applied (-${appliedCoupon.discount.toFixed(2)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#059669",
                          fontSize: "14px",
                          fontWeight: "700",
                          cursor: "pointer",
                          padding: "0 4px",
                        }}
                        title="Remove coupon"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Quick Promo Chips */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Quick apply:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(undefined, "SOCIMO10")}
                      style={{
                        background: "#f1f5f9",
                        border: "1px dashed #94a3b8",
                        borderRadius: "12px",
                        padding: "2px 8px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#334155",
                        cursor: "pointer",
                      }}
                    >
                      SOCIMO10 (-$10)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(undefined, "FREESHIP")}
                      style={{
                        background: "#f1f5f9",
                        border: "1px dashed #94a3b8",
                        borderRadius: "12px",
                        padding: "2px 8px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#334155",
                        cursor: "pointer",
                      }}
                    >
                      FREESHIP
                    </button>
                  </div>
                </div>

                {/* 2. Shipping Destination Selector */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", margin: 0 }}>
                      Shipping Destination
                    </label>
                    <span style={{ fontSize: "11px", color: "#088dcd", fontWeight: "600" }}>
                      {shippingInfo.eta}
                    </span>
                  </div>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "13px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#1e293b",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {Object.entries(SHIPPING_OPTIONS).map(([key, opt]) => (
                      <option key={key} value={key}>
                        {opt.label} (${opt.cost.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Cost Breakdown */}
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: "600", color: "#1e293b" }}>${subTotal.toFixed(2)}</span>
                    </li>

                    {discountAmount > 0 && (
                      <li style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#10b981", marginBottom: "10px" }}>
                        <span>Discount</span>
                        <span style={{ fontWeight: "600" }}>-${discountAmount.toFixed(2)}</span>
                      </li>
                    )}

                    <li style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>
                      <span>Estimated Shipping</span>
                      <span style={{ fontWeight: "600", color: shippingCost === 0 ? "#10b981" : "#1e293b" }}>
                        {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </li>

                    <li style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>
                      <span>Estimated Tax</span>
                      <span style={{ fontWeight: "600", color: "#1e293b" }}>$0.00</span>
                    </li>

                    <li style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <span style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", display: "block" }}>
                          Grand Total
                        </span>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>Inclusive of all duties</span>
                      </div>
                      <span style={{ fontSize: "22px", fontWeight: "800", color: "#088dcd" }}>
                        ${grandTotal.toFixed(2)}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Primary CTA: Proceed to Checkout */}
                <button
                  type="button"
                  onClick={handleProceedCheckout}
                  disabled={cartItems.length === 0}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderRadius: "10px",
                    background: cartItems.length === 0 ? "#cbd5e1" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: cartItems.length === 0 ? "none" : "0 8px 20px rgba(16, 185, 129, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (cartItems.length > 0) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 10px 24px rgba(16, 185, 129, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (cartItems.length > 0) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
                    }
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Proceed To Checkout
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                {/* Security Guarantee Notice */}
                <div style={{ marginTop: "16px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span>Guaranteed Safe &amp; Secure Checkout</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
                    {["VISA", "MC", "AMEX", "PAYPAL", "APPLE PAY"].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: "#64748b",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          background: "#f8fafc",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="gap">
          <div className="bg-image" style={{ backgroundImage: "url(/images/resources/footer-bg.png)" }}></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="web-info">
                  <Link href="/" title="">
                    <img src="/images/logo.png" alt="Socimo" />
                  </Link>
                  <p>The ultimate social learning and creators community hub.</p>
                  <div className="contact-little">
                    <span><i className="icofont-phone-circle"></i> +1-235-099-34</span>
                    <span><i className="icofont-email"></i> support@socimo.io</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-3 col-sm-6">
                <div className="widget">
                  <div className="widget-title">
                    <h4>Company</h4>
                  </div>
                  <ul className="quick-links">
                    <li><Link href="/" title="">About Us</Link></li>
                    <li><Link href="/courses" title="">Courses</Link></li>
                    <li><Link href="/products" title="">Products</Link></li>
                    <li><Link href="/blog" title="">Blog</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-3 col-sm-6">
                <div className="widget">
                  <div className="widget-title">
                    <h4>Quick Links</h4>
                  </div>
                  <ul className="quick-links">
                    <li><Link href="/products" title="">Products</Link></li>
                    <li><Link href="/cart" title="">Cart</Link></li>
                    <li><Link href="/courses" title="">Courses</Link></li>
                    <li><Link href="/groups" title="">Groups</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-4 col-sm-6">
                <div className="widget">
                  <div className="widget-title">
                    <h4>Follow Us</h4>
                  </div>
                  <ul className="quick-links">
                    <li><a href="#" title="" onClick={(e) => e.preventDefault()}><i className="icofont-facebook"></i>Facebook</a></li>
                    <li><a href="#" title="" onClick={(e) => e.preventDefault()}><i className="icofont-twitter"></i>Twitter</a></li>
                    <li><a href="#" title="" onClick={(e) => e.preventDefault()}><i className="icofont-instagram"></i>Instagram</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="widget">
                  <div className="widget-title">
                    <h4>Newsletter</h4>
                  </div>
                  <div className="news-lettr">
                    <form className="newsletter" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
                      <input type="text" placeholder="Email Address" />
                      <button type="submit"><i className="icofont-paper-plane"></i></button>
                    </form>
                    <p>Subscribe to get weekly discounts and exclusive marketplace drops.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottombar */}
      <div className="bottombar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span>&copy; copyright All rights reserved by Socimo 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Cart Badge */}
      <div className="cart-product">
        <Link href="/cart" title="View Cart">
          <i className="icofont-cart-alt"></i>
        </Link>
        <span>{cartItems.length.toString().padStart(2, "0")}</span>
      </div>

      {/* Floating Live Chat Trigger */}
      <div
        className="chat-live"
        style={{ cursor: "pointer" }}
        onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
      >
        <a className="chat-btn" href="#" onClick={(e) => e.preventDefault()} title="Start Live Chat">
          <i className="icofont-facebook-messenger"></i>
        </a>
        <span>03</span>
      </div>

      {/* Live Chat Box Widget */}
      {isChatBoxOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 99990,
            background: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            borderRadius: "14px",
            width: "320px",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ padding: "14px 16px", background: "#088dcd", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#fff" }}>Live Community Chat</h5>
            <span style={{ cursor: "pointer", fontSize: "18px" }} onClick={() => setIsChatBoxOpen(false)}>
              ✕
            </span>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
              <button
                type="button"
                onClick={() => setActiveChatTab("all")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: activeChatTab === "all" ? "#088dcd" : "#94a3b8",
                  cursor: "pointer",
                  paddingBottom: "4px",
                  borderBottom: activeChatTab === "all" ? "2px solid #088dcd" : "2px solid transparent",
                }}
              >
                All Members
              </button>
              <button
                type="button"
                onClick={() => setActiveChatTab("active")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: activeChatTab === "active" ? "#088dcd" : "#94a3b8",
                  cursor: "pointer",
                  paddingBottom: "4px",
                  borderBottom: activeChatTab === "active" ? "2px solid #088dcd" : "2px solid transparent",
                }}
              >
                Online (3)
              </button>
            </div>
            <div style={{ maxHeight: "220px", overflowY: "auto", marginTop: "10px" }}>
              {[
                { name: "Oliver David", img: "/images/resources/user1.jpg", status: "online" },
                { name: "Amelia Rose", img: "/images/resources/user2.jpg", status: "online" },
                { name: "George Miller", img: "/images/resources/user3.jpg", status: "away" },
                { name: "Sarah Connor", img: "/images/resources/user4.jpg", status: "online" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", cursor: "pointer" }}>
                  <img src={f.img} alt="" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{f.name}</span>
                  <span style={{ fontSize: "11px", color: f.status === "online" ? "#10b981" : "#f59e0b", marginLeft: "auto", fontWeight: "600" }}>
                    ● {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => {
            if (!isProcessingOrder) setIsCheckoutModalOpen(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "520px",
              width: "100%",
              padding: "28px",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #e2e8f0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {!isProcessingOrder && (
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "18px",
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                ✕
              </button>
            )}

            {isOrderPlaced ? (
              /* Success State */
              <div style={{ textAlign: "center", padding: "20px 10px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "#ecfdf5",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "22px", fontWeight: "800", color: "#0f172a" }}>
                  Payment Confirmed!
                </h3>
                <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 16px 0" }}>
                  Thank you for your order. We have sent your receipt and download access links to your registered email.
                </p>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "13px",
                    color: "#334155",
                    marginBottom: "20px",
                  }}
                >
                  Order Ref: <strong>#SOC-2026-{Math.floor(1000 + Math.random() * 9000)}</strong> • Total: <strong>${grandTotal.toFixed(2)}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setIsOrderPlaced(false);
                  }}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "8px",
                    background: "#088dcd",
                    color: "#fff",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Return To Marketplace
                </button>
              </div>
            ) : (
              /* Checkout Form */
              <>
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#10b981", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Fast &amp; Secure Checkout
                  </span>
                  <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                    Complete Your Purchase
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                    Total payable amount: <strong style={{ color: "#088dcd" }}>${grandTotal.toFixed(2)}</strong>
                  </p>
                </div>

                <form onSubmit={handleConfirmOrder}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Full Name &amp; Contact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Henderson"
                      defaultValue="David Gray"
                      required
                      style={{ width: "100%", padding: "10px 12px", fontSize: "13px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Email Address (for receipt &amp; instant course access)
                    </label>
                    <input
                      type="email"
                      placeholder="alex@example.com"
                      defaultValue="alex@socimo.io"
                      required
                      style={{ width: "100%", padding: "10px 12px", fontSize: "13px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "4px" }}>
                      Delivery / Billing Address
                    </label>
                    <input
                      type="text"
                      placeholder="Street address, City, Postal Code"
                      defaultValue="742 Evergreen Terrace, Springfield, OR"
                      required
                      style={{ width: "100%", padding: "10px 12px", fontSize: "13px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                      Payment Method
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div
                        style={{
                          padding: "10px",
                          border: "2px solid #088dcd",
                          borderRadius: "8px",
                          background: "#f0f9ff",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#0369a1",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                        }}
                      >
                        💳 Card / PayPal
                      </div>
                      <div
                        style={{
                          padding: "10px",
                          border: "1px solid #cbd5e1",
                          borderRadius: "8px",
                          background: "#ffffff",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                        }}
                      >
                        ⚡ Socimo Wallet
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingOrder}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "10px",
                      background: isProcessingOrder ? "#94a3b8" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "15px",
                      fontWeight: "700",
                      cursor: isProcessingOrder ? "wait" : "pointer",
                      boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {isProcessingOrder ? (
                      "Processing Payment Securely..."
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Pay ${grandTotal.toFixed(2)} &amp; Confirm Order
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
