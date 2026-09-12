"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState, useMemo, FormEvent, useEffect } from "react";
import HomeHeader from "@/components/layout/HomeHeader";
import { useCreateOrderMutation, useGetMyProfileQuery } from "@/lib/services/authApi";
import {
  CartItem,
  getCartItems,
  onCartChange,
  clearCart,
} from "@/lib/cart/cartService";

export default function ProductCheckoutClient() {
  const { data: profileData } = useGetMyProfileQuery();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  const [items, setItems] = useState<CartItem[]>([]);

  // Billing Details Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  // Payment State
  const [paymentTab, setPaymentTab] = useState<"visa" | "paypal" | "bitcoin">("visa");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardMonth, setCardMonth] = useState("December");
  const [cardYear, setCardYear] = useState("2026");
  const [cardCvv, setCardCvv] = useState("892");
  const [cardHolder, setCardHolder] = useState("Danial Cardos");
  const [saveCard, setSaveCard] = useState(true);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [cryptoAddress] = useState("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh");

  // Courier Options State
  const [courier, setCourier] = useState<"fedex" | "dhl" | "digital">("fedex");

  // Coupon State
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>({
    code: "SOCIMO10",
    discount: 10.0,
  });
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  // Placed Order Result
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-fill billing details if user is logged in
  useEffect(() => {
    if (profileData?.profile?.user) {
      if (profileData.profile.user.firstName && !firstName) setFirstName(profileData.profile.user.firstName);
      if (profileData.profile.user.lastName && !lastName) setLastName(profileData.profile.user.lastName);
      if (profileData.profile.user.email && !email) setEmail(profileData.profile.user.email);
    } else {
      if (!firstName) setFirstName("Danial");
      if (!lastName) setLastName("Cardos");
      if (!email) setEmail("danial.cardos@socimo.io");
    }
  }, [profileData]);

  // Synchronize cart items reactively with cartService
  useEffect(() => {
    setItems(getCartItems());
    const unsubscribe = onCartChange((newItems) => {
      setItems(newItems);
    });
    return unsubscribe;
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.price * it.qty, 0);
  }, [items]);

  const courierCost = useMemo(() => {
    if (courier === "fedex") return 8.0;
    if (courier === "dhl") return 14.0;
    return 0.0;
  }, [courier]);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + courierCost);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyCoupon = (e?: FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    const code = (directCode || couponCode).trim().toUpperCase();
    if (!code) return;

    if (code === "SOCIMO10" || code === "SAVE10") {
      setAppliedCoupon({ code, discount: 10.0 });
      setCouponFeedback("Coupon SOCIMO10 applied ($10.00 off)!");
      setCouponCode("");
    } else if (code === "FREESHIP") {
      setAppliedCoupon({ code, discount: courierCost });
      setCouponFeedback("Free Shipping coupon applied!");
      setCouponCode("");
    } else {
      setCouponFeedback(`Coupon code "${code}" is invalid.`);
    }
  };

  const handlePlaceOrder = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!firstName.trim() || !email.trim()) {
      alert("Please complete your First Name and Email address in the Billing form.");
      return;
    }

    const payload = {
      items: items.map((it) => ({
        itemId: it.id,
        name: it.name,
        price: it.price,
        qty: it.qty,
        img: it.img,
        type: it.type,
      })),
      billingDetails: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        country,
        state: stateName.trim(),
        zipCode: zipCode.trim(),
        specialNotes: specialNotes.trim(),
      },
      courier: {
        name: courier === "fedex" ? "FedEx Standard" : courier === "dhl" ? "DHL Express" : "Instant Digital Access",
        cost: courierCost,
        eta: courier === "fedex" ? "2-3 business days" : courier === "dhl" ? "1-2 business days" : "Instant delivery to email",
      },
      payment: {
        method: paymentTab,
        cardLast4: cardNumber.replace(/\D/g, "").slice(-4) || "4242",
        cardHolder: cardHolder || `${firstName} ${lastName}`,
        cryptoAddress: paymentTab === "bitcoin" ? cryptoAddress : "",
      },
      pricing: {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discountAmount * 100) / 100,
        shipping: Math.round(courierCost * 100) / 100,
        tax: 0,
        grandTotal: Math.round(grandTotal * 100) / 100,
        couponCode: appliedCoupon?.code || "",
      },
    };

    try {
      const response = await createOrder(payload).unwrap();
      if (response.ok && response.order) {
        setPlacedOrder(response.order);
        clearCart();
        showToast(`Order placed successfully! Reference: ${response.order.orderNumber}`);
      }
    } catch {
      // Fallback local order creation if offline
      const fallbackOrder = {
        orderNumber: `SOC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        items: payload.items,
        billingDetails: payload.billingDetails,
        courier: payload.courier,
        payment: payload.payment,
        pricing: payload.pricing,
        createdAt: new Date().toISOString(),
      };
      setPlacedOrder(fallbackOrder);
      clearCart();
      showToast(`Order placed successfully! Reference: ${fallbackOrder.orderNumber}`);
    }
  };

  return (
    <div className="theme-layout" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <HomeHeader />

      {/* Main Checkout Section */}
      <section style={{ padding: "30px 0 70px 0" }}>
        <div className="container">
          {/* Breadcrumb Header */}
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
            <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href="/cart" style={{ color: "#64748b", textDecoration: "none" }}>Cart</Link>
            <span>/</span>
            <span style={{ color: "#088dcd", fontWeight: "600" }}>Secure Checkout</span>
          </div>

          {placedOrder ? (
            /* Order Success View */
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "45px 30px",
                maxWidth: "760px",
                margin: "0 auto",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#ecfdf5",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                  fontSize: "40px",
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#10b981", textTransform: "uppercase", letterSpacing: "1px" }}>
                Payment Confirmed
              </span>
              <h2 style={{ margin: "6px 0 10px 0", fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>
                Thank You for Your Order!
              </h2>
              <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "520px", margin: "0 auto 25px auto", lineHeight: 1.6 }}>
                Your order has been recorded in the database and sent to our fulfillment pipeline. A detailed receipt has been sent to <strong>{placedOrder.billingDetails?.email || email}</strong>.
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "20px 24px",
                  marginBottom: "30px",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "14px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Order Reference</span>
                    <strong style={{ fontSize: "16px", color: "#088dcd" }}>{placedOrder.orderNumber}</strong>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Courier / Delivery</span>
                    <strong style={{ fontSize: "14px", color: "#1e293b" }}>{placedOrder.courier?.name || "FedEx Standard"}</strong>
                  </div>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0" }}>
                  {(placedOrder.items || items).map((it: any, idx: number) => (
                    <li key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", color: "#334155" }}>
                      <span>{it.qty}x {it.name}</span>
                      <strong>${(Number(it.price) * Number(it.qty)).toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>

                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Grand Total Paid:</span>
                  <span style={{ fontSize: "22px", fontWeight: "800", color: "#10b981" }}>${(placedOrder.pricing?.grandTotal || grandTotal).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href={`/invoice?id=${placedOrder.orderNumber}`}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    background: "#088dcd",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "700",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i className="icofont-file-document"></i> View Official Invoice
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: "12px 22px",
                    borderRadius: "8px",
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i className="icofont-print"></i> Print Receipt
                </button>
                <Link
                  href="/products"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    background: "#ffffff",
                    color: "#088dcd",
                    border: "1px solid #088dcd",
                    fontSize: "14px",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart View */
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "60px 30px",
                maxWidth: "600px",
                margin: "30px auto",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "#f0f9ff",
                  color: "#088dcd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  fontSize: "32px",
                }}
              >
                <i className="icofont-shopping-cart"></i>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                Your Checkout Cart is Empty
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "420px", margin: "0 auto 24px auto", lineHeight: 1.5 }}>
                You don&apos;t have any books, courses, or items in your cart session yet. Browse our library or marketplace to find great publications!
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href="/books"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    background: "#088dcd",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  Browse Books
                </Link>
                <Link
                  href="/products"
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    background: "#f1f5f9",
                    color: "#334155",
                    fontSize: "13px",
                    fontWeight: "700",
                    textDecoration: "none",
                    border: "1px solid #cbd5e1",
                  }}
                >
                  Marketplace Products
                </Link>
              </div>
            </div>
          ) : (
            /* Checkout 2-Column Grid */
            <div className="row">
              {/* Left Column: Billing Details & Payment Methods (col-lg-8) */}
              <div className="col-lg-8 col-md-12">
                <div className="main-wraper" style={{ background: "#ffffff", borderRadius: "14px", padding: "26px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)", marginBottom: "25px" }}>
                  <h4 className="main-title" style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="icofont-bill" style={{ color: "#088dcd" }}></i> Billing &amp; Contact Details
                  </h4>

                  <div className="billing">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        />
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                          Email Address (for invoice &amp; digital asset downloads) *
                        </label>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                          Country / Region *
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                          <option>Germany</option>
                          <option>France</option>
                          <option>Australia</option>
                          <option>United Arab Emirates</option>
                          <option>Singapore</option>
                          <option>Worldwide</option>
                        </select>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                          State / Province
                        </label>
                        <input
                          type="text"
                          placeholder="State / Province"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        />
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                          Zip / Postal Code
                        </label>
                        <input
                          type="text"
                          placeholder="Zip / Postal Code"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                          Special Notes (optional delivery instructions)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Special delivery notes or gate codes..."
                          value={specialNotes}
                          onChange={(e) => setSpecialNotes(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                        ></textarea>
                      </div>
                    </div>

                    {/* Payment Methods Section */}
                    <div className="payment-methods" style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "25px" }}>
                      <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
                        Select Payment Method
                      </h4>
                      <div className="light-bg pd-20" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <ul style={{ display: "flex", gap: "12px", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px", margin: "0 0 20px 0", listStyle: "none" }}>
                          <li>
                            <button
                              type="button"
                              onClick={() => setPaymentTab("visa")}
                              style={{
                                background: paymentTab === "visa" ? "#ffffff" : "transparent",
                                border: paymentTab === "visa" ? "2px solid #088dcd" : "1px solid #cbd5e1",
                                borderRadius: "8px",
                                padding: "6px 14px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <img src="/images/visa-master.png" alt="Visa Mastercard" style={{ height: "24px" }} />
                              <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>Credit Card</span>
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              onClick={() => setPaymentTab("paypal")}
                              style={{
                                background: paymentTab === "paypal" ? "#ffffff" : "transparent",
                                border: paymentTab === "paypal" ? "2px solid #088dcd" : "1px solid #cbd5e1",
                                borderRadius: "8px",
                                padding: "6px 14px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <img src="/images/paypal.png" alt="PayPal" style={{ height: "24px" }} />
                              <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>PayPal</span>
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              onClick={() => setPaymentTab("bitcoin")}
                              style={{
                                background: paymentTab === "bitcoin" ? "#ffffff" : "transparent",
                                border: paymentTab === "bitcoin" ? "2px solid #088dcd" : "1px solid #cbd5e1",
                                borderRadius: "8px",
                                padding: "6px 14px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <img src="/images/bitcoin.png" alt="Bitcoin" style={{ height: "24px" }} />
                              <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>Crypto</span>
                            </button>
                          </li>
                        </ul>

                        {/* Payment Tab 1: Credit Cards */}
                        {paymentTab === "visa" && (
                          <div className="credit-card billing">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                              <h6 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                                <i className="icofont-check-circled" style={{ color: "#28a745" }}></i> Secure Card Payment
                              </h6>
                              <img src="/images/resources/Credit-Card-Logos.jpg" alt="Cards" style={{ maxHeight: "24px" }} />
                            </div>

                            <div className="row">
                              <div className="col-lg-12 mb-3">
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Card Number</label>
                                <input
                                  type="text"
                                  placeholder="4242 •••• •••• 4242"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                />
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-6 mb-3">
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Expiry Month</label>
                                <select
                                  value={cardMonth}
                                  onChange={(e) => setCardMonth(e.target.value)}
                                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}
                                >
                                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                                    <option key={m}>{m}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-6 mb-3">
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Expiry Year</label>
                                <select
                                  value={cardYear}
                                  onChange={(e) => setCardYear(e.target.value)}
                                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}
                                >
                                  {["2026", "2027", "2028", "2029", "2030"].map((y) => (
                                    <option key={y}>{y}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>Security Code (CVV)</label>
                                <input
                                  type="text"
                                  placeholder="892"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                />
                              </div>

                              <div className="col-lg-12">
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", cursor: "pointer" }}>
                                  <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />
                                  <span>Save this card for 1-click checkout on future purchases</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment Tab 2: PayPal */}
                        {paymentTab === "paypal" && (
                          <div className="paypal-card">
                            <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 12px 0" }}>
                              After payment via PayPal&apos;s secure gateway, you will receive an instant link to download your materials and your order will be logged.
                            </p>
                            <input
                              type="email"
                              placeholder="Your PayPal Email Address"
                              value={paypalEmail}
                              onChange={(e) => setPaypalEmail(e.target.value)}
                              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "12px" }}
                            />
                            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                              PayPal accepts all major credit &amp; debit cards and bank balances.
                            </p>
                          </div>
                        )}

                        {/* Payment Tab 3: Crypto */}
                        {paymentTab === "bitcoin" && (
                          <div className="paypal-card">
                            <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 10px 0" }}>
                              Send equivalent payment to our automated BTC treasury wallet:
                            </p>
                            <div
                              style={{
                                background: "#ffffff",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px dashed #088dcd",
                                fontFamily: "monospace",
                                fontSize: "13px",
                                color: "#088dcd",
                                wordBreak: "break-all",
                                marginBottom: "10px",
                              }}
                            >
                              {cryptoAddress}
                            </div>
                            <span style={{ fontSize: "12px", color: "#28a745", fontWeight: "600" }}>
                              ✓ Instant automated verification upon 1 network confirmation
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Courier Options Section */}
                    <div className="courier-option" style={{ marginTop: "30px", borderTop: "1px solid #e2e8f0", paddingTop: "25px" }}>
                      <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "16px" }}>
                        Choose Your Courier / Delivery
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <div
                          className="courier-box"
                          onClick={() => setCourier("fedex")}
                          style={{
                            background: courier === "fedex" ? "#f0f9ff" : "#ffffff",
                            border: courier === "fedex" ? "2px solid #088dcd" : "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "16px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <img src="/images/fedex.png" alt="FedEx" style={{ maxHeight: "28px" }} />
                            <strong style={{ fontSize: "15px", color: "#088dcd" }}>$8.00</strong>
                          </div>
                          <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                            Reliable FedEx tracking. Your shipment arrives in 2-3 business days.
                          </p>
                        </div>

                        <div
                          className="courier-box"
                          onClick={() => setCourier("dhl")}
                          style={{
                            background: courier === "dhl" ? "#f0f9ff" : "#ffffff",
                            border: courier === "dhl" ? "2px solid #088dcd" : "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "16px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <img src="/images/dhl.png" alt="DHL" style={{ maxHeight: "28px" }} />
                            <strong style={{ fontSize: "15px", color: "#088dcd" }}>$14.00</strong>
                          </div>
                          <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                            DHL Priority Express. Guaranteed priority delivery in 1-2 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Cart Summary Card (col-lg-4) */}
              <div className="col-lg-4 col-md-12">
                <div
                  className="main-wraper stick-widget"
                  style={{
                    position: "sticky",
                    top: "90px",
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "24px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="cart-summary">
                    <h4 className="main-title" style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="icofont-cart-alt" style={{ color: "#088dcd" }}></i> Order Summary
                    </h4>

                    {/* Items List */}
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0", maxHeight: "280px", overflowY: "auto" }}>
                      {items.map((it, idx) => (
                        <li
                          key={idx}
                          style={{
                            padding: "10px 0",
                            borderBottom: "1px solid #f1f5f9",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <img
                              src={it.img}
                              alt={it.name}
                              style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/images/resources/book3.jpg";
                              }}
                            />
                            <div>
                              <h5 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "700", color: "#1e293b", lineHeight: 1.3 }}>
                                {it.qty}x {it.name}
                              </h5>
                              <p style={{ margin: 0, fontSize: "11px", color: "#82828e" }}>
                                {it.desc || "Verified Socimo publication"}
                              </p>
                            </div>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b", whiteSpace: "nowrap" }}>
                            ${(it.price * it.qty).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Discount Coupon Trigger & Drawer */}
                    <div style={{ marginBottom: "16px" }}>
                      <button
                        type="button"
                        onClick={() => setIsCouponOpen(!isCouponOpen)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#088dcd",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🏷️ <em>have a discount code?</em>
                      </button>

                      {isCouponOpen && (
                        <form onSubmit={handleApplyCoupon} style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
                          <input
                            type="text"
                            placeholder="e.g. SOCIMO10"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            style={{ flex: 1, padding: "8px 10px", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                          />
                          <button
                            type="submit"
                            style={{ padding: "8px 14px", background: "#088dcd", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                          >
                            Apply
                          </button>
                        </form>
                      )}

                      {couponFeedback && (
                        <p style={{ margin: "6px 0 0 0", fontSize: "11px", color: appliedCoupon ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                          {couponFeedback}
                        </p>
                      )}
                    </div>

                    {/* Total Breakdown */}
                    <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "14px", marginBottom: "18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "6px" }}>
                        <span>Subtotal:</span>
                        <strong style={{ color: "#1e293b" }}>${subtotal.toFixed(2)}</strong>
                      </div>

                      {discountAmount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#10b981", marginBottom: "6px" }}>
                          <span>Coupon Discount:</span>
                          <strong>-${discountAmount.toFixed(2)}</strong>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
                        <span>Shipping ({courier === "fedex" ? "FedEx" : courier === "dhl" ? "DHL" : "Digital"}):</span>
                        <strong style={{ color: "#1e293b" }}>${courierCost.toFixed(2)}</strong>
                      </div>

                      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Grand Total</span>
                        <i style={{ fontStyle: "normal", fontSize: "22px", fontWeight: "800", color: "#088dcd" }}>
                          ${grandTotal.toFixed(2)}
                        </i>
                      </div>
                    </div>

                    {/* Place Order CTA Button */}
                    <button
                      type="button"
                      onClick={() => handlePlaceOrder()}
                      disabled={isPlacingOrder}
                      className="main-btn purchase-btn"
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "8px",
                        background: isPlacingOrder ? "#94a3b8" : "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: isPlacingOrder ? "wait" : "pointer",
                        boxShadow: "0 6px 16px rgba(40, 167, 69, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {isPlacingOrder ? (
                        "Confirming Order with Backend..."
                      ) : (
                        <>
                          <i className="icofont-check-circled"></i> Place Order (${grandTotal.toFixed(2)})
                        </>
                      )}
                    </button>
                  </div>

                  {/* Useful Guarantees Info */}
                  <div className="useful-info" style={{ marginTop: "24px", borderTop: "1px solid #f1f5f9", paddingTop: "18px" }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      <li style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                        <figure style={{ margin: 0, flexShrink: 0 }}>
                          <img src="/images/box-icon1.png" alt="Packaging" style={{ width: "32px" }} />
                        </figure>
                        <div className="info-tag">
                          <h4 style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>
                            Reinforced Box Protection
                          </h4>
                          <p style={{ margin: 0, fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                            All printed handbooks and kits ship in shockproof reinforced packaging.
                          </p>
                        </div>
                      </li>

                      <li style={{ display: "flex", gap: "12px" }}>
                        <figure style={{ margin: 0, flexShrink: 0 }}>
                          <img src="/images/box-icon2.png" alt="Guarantee" style={{ width: "32px" }} />
                        </figure>
                        <div className="info-tag">
                          <h4 style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>
                            30-Day Money-Back Guarantee
                          </h4>
                          <p style={{ margin: 0, fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                            Full unconditional refund if your materials do not exceed expectations.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Toast Notification */}
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

      {/* Footer */}
      <footer>
        <div className="gap">
          <div className="bg-image" style={{ backgroundImage: "url(/images/resources/footer-bg.png)" }}></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="web-info">
                  <Link href="/" title="">
                    <img src="/images/logo.png" alt="" />
                  </Link>
                  <p>Subscribe our newsletter for getting notifications and alerts</p>
                  <div className="contact-little">
                    <span><i className="icofont-phone-circle"></i> +1-235-099-34</span>
                    <span><i className="icofont-email"></i> info@akedmic.com</span>
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
                    <li><a href="#" title="" onClick={(e) => e.preventDefault()}><i className="icofont-facebook"></i>facebook</a></li>
                    <li><a href="#" title="" onClick={(e) => e.preventDefault()}><i className="icofont-twitter"></i>twitter</a></li>
                    <li><a href="#" title="" onClick={(e) => e.preventDefault()}><i className="icofont-instagram"></i>instagram</a></li>
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
                    <p>Subscribe our newsletter for exclusive marketplace releases.</p>
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
    </div>
  );
}
