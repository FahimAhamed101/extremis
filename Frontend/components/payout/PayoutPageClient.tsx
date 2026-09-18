"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";

interface SaleRecord {
  id: string;
  date: string;
  country: string;
  flagUrl: string;
  product: string;
  itemSales: number;
  earnings: number;
  year: string;
  isCurrentMonth: boolean;
}

interface PayoutHistoryItem {
  date: string;
  method: string;
  amount: number;
  status: "Completed" | "Processing" | "Pending";
}

const INITIAL_SALES: SaleRecord[] = [
  {
    id: "1",
    date: "Thursday, 1",
    country: "United Kingdom",
    flagUrl: "/images/flags/001-united-kingdom.png",
    product: "Basic PHP Laravel Course",
    itemSales: 1,
    earnings: 20.4,
    year: "2020",
    isCurrentMonth: true,
  },
  {
    id: "2",
    date: "Friday, 2",
    country: "United States",
    flagUrl: "/images/flags/002-united-states.png",
    product: "HTML5 Latest Book",
    itemSales: 6,
    earnings: 30.0,
    year: "2020",
    isCurrentMonth: true,
  },
  {
    id: "3",
    date: "Saturday, 3",
    country: "France",
    flagUrl: "/images/flags/003-france.png",
    product: "Vue.js Book by George Cane",
    itemSales: 2,
    earnings: 40.1,
    year: "2020",
    isCurrentMonth: true,
  },
  {
    id: "4",
    date: "Sunday, 4",
    country: "France",
    flagUrl: "/images/flags/003-france.png",
    product: "CSS3 Advance Book",
    itemSales: 5,
    earnings: 90.99,
    year: "2020",
    isCurrentMonth: true,
  },
  {
    id: "5",
    date: "Monday, 5",
    country: "Germany",
    flagUrl: "/images/flags/004-germany.png",
    product: "Laravel Advance Online",
    itemSales: 10,
    earnings: 101.55,
    year: "2020",
    isCurrentMonth: true,
  },
  {
    id: "6",
    date: "Tuesday, 6",
    country: "Spain",
    flagUrl: "/images/flags/005-spain.png",
    product: "Online React Course",
    itemSales: 20,
    earnings: 10.55,
    year: "2020",
    isCurrentMonth: true,
  },
  {
    id: "7",
    date: "Wednesday, 7",
    country: "China",
    flagUrl: "/images/flags/006-china.png",
    product: "Vue.js Book by George Cane",
    itemSales: 6,
    earnings: 15.67,
    year: "2020",
    isCurrentMonth: false,
  },
  {
    id: "8",
    date: "Thursday, 8",
    country: "Italy",
    flagUrl: "/images/flags/007-italy.png",
    product: "Laravel Advance Online",
    itemSales: 10,
    earnings: 15.67,
    year: "2020",
    isCurrentMonth: false,
  },
  {
    id: "9",
    date: "Friday, 9",
    country: "Japan",
    flagUrl: "/images/flags/008-japan.png",
    product: "Basic PHP Laravel Course",
    itemSales: 16,
    earnings: 15.67,
    year: "2020",
    isCurrentMonth: false,
  },
  {
    id: "10",
    date: "Saturday, 10",
    country: "Brazil",
    flagUrl: "/images/flags/009-brazil.png",
    product: "Laravel Advance Online",
    itemSales: 13,
    earnings: 15.67,
    year: "2020",
    isCurrentMonth: false,
  },
  {
    id: "11",
    date: "Sunday, 11",
    country: "South Korea",
    flagUrl: "/images/flags/010-south-korea.png",
    product: "CSS3 Advance Book",
    itemSales: 2,
    earnings: 15.67,
    year: "2020",
    isCurrentMonth: false,
  },
  {
    id: "12",
    date: "Monday, 12",
    country: "United Kingdom",
    flagUrl: "/images/flags/001-united-kingdom.png",
    product: "Laravel Advance Online",
    itemSales: 7,
    earnings: 15.67,
    year: "2020",
    isCurrentMonth: false,
  },
];

const PAYOUT_HISTORY: PayoutHistoryItem[] = [
  { date: "Jan, 15", method: "PayPal", amount: 549, status: "Completed" },
  { date: "Dec, 15", method: "PayPal", amount: 980, status: "Completed" },
  { date: "Nov, 15", method: "PayPal", amount: 1632, status: "Completed" },
  { date: "Oct, 15", method: "PayPal", amount: 1890, status: "Completed" },
];

export default function PayoutPageClient() {
  const [filterPeriod, setFilterPeriod] = useState<"all" | "2020" | "month">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const [paymentEmail, setPaymentEmail] = useState("danialcardos@example.com");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const filteredSales = useMemo(() => {
    return INITIAL_SALES.filter((item) => {
      if (filterPeriod === "month" && !item.isCurrentMonth) return false;
      if (filterPeriod === "2020" && item.year !== "2020") return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.product.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.date.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filterPeriod, searchTerm]);

  const totals = useMemo(() => {
    const totalSales = filteredSales.reduce((acc, curr) => acc + curr.itemSales, 0);
    const totalEarnings = filteredSales.reduce((acc, curr) => acc + curr.earnings, 0);
    return {
      sales: totalSales,
      earnings: totalEarnings.toFixed(2),
    };
  }, [filteredSales]);

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg("Payment method updated successfully!");
    setTimeout(() => {
      setSaveSuccessMsg("");
      setIsMethodModalOpen(false);
    }, 1500);
  };

  return (
    <div className="theme-layout">
      <HomeHeader />

      <section className="payout-content-section" style={{ padding: "40px 0 60px", background: "#f8fafc" }}>
        <div className="container">
          <div className="row">
            {/* Left Sidebar Widgets */}
            <div className="col-lg-4 col-md-12 mb-4">
              <aside className="sidebar">
                {/* Widget 1: Next Payouts */}
                <div
                  className="widget"
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "25px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    className="widget-title"
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      marginBottom: "16px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #edf2f7",
                      color: "#1e293b",
                    }}
                  >
                    Your Next Payouts
                  </h4>
                  <div className="card-credit text-center">
                    <p style={{ fontSize: "13.5px", color: "#64748b", marginBottom: "14px" }}>
                      Your payout will be processed on every month of 15th
                    </p>
                    <h6
                      style={{
                        fontSize: "34px",
                        fontWeight: 700,
                        color: "#0284c7",
                        margin: "10px 0",
                      }}
                    >
                      ${totals.earnings}
                    </h6>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "12px",
                        color: "#0369a1",
                        background: "#e0f2fe",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontWeight: 600,
                      }}
                    >
                      Payment Method: PayPal
                    </span>
                    <div
                      className="happy-spend"
                      style={{
                        marginTop: "20px",
                        padding: "12px",
                        background: "#f0fdf4",
                        borderRadius: "8px",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#166534",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <img
                          src="/images/smiles/smiling.png"
                          alt="Happy"
                          style={{ width: "20px", height: "20px", display: "inline-block" }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        Happy spending for the Next Month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Widget 2: Saved Cards */}
                <div
                  className="widget"
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "25px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    className="widget-title"
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      marginBottom: "16px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #edf2f7",
                      color: "#1e293b",
                    }}
                  >
                    Saved Cards & Accounts
                  </h4>
                  <div className="set-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src="/images/paypal.png"
                        alt="PayPal"
                        style={{ maxHeight: "40px", objectFit: "contain" }}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div>
                        <strong style={{ fontSize: "14px", color: "#1e293b" }}>PayPal Active</strong>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{paymentEmail}</div>
                      </div>
                    </div>
                    <p style={{ marginTop: "14px", fontSize: "13px", color: "#64748b" }}>
                      Get paid automatically by PayPal or linked debit / credit card.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>
                      <button
                        type="button"
                        onClick={() => setIsMethodModalOpen(true)}
                        style={{
                          background: "#0284c7",
                          color: "#ffffff",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: 600,
                          border: "none",
                          cursor: "pointer",
                          transition: "background 0.2s ease",
                        }}
                      >
                        Set Payment Method
                      </button>
                      <div className="added-complete" style={{ margin: 0 }}>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                          Added: <span style={{ color: "#475569", fontWeight: 500 }}>25 Mar 2020</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Widget 3: Payout History */}
                <div
                  className="widget"
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    className="widget-title"
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      marginBottom: "16px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid #edf2f7",
                      color: "#1e293b",
                    }}
                  >
                    Payout History
                  </h4>
                  <div className="table-responsive" style={{ overflowX: "auto" }}>
                    <table
                      className="table table-default table-striped"
                      style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ background: "#0284c7", color: "#ffffff", padding: "10px 14px", fontSize: "12.5px" }}>Date</th>
                          <th style={{ background: "#0284c7", color: "#ffffff", padding: "10px 14px", fontSize: "12.5px" }}>Method</th>
                          <th style={{ background: "#0284c7", color: "#ffffff", padding: "10px 14px", fontSize: "12.5px" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PAYOUT_HISTORY.map((item, idx) => (
                          <tr key={idx} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            <td style={{ padding: "10px 14px", fontSize: "12.5px", color: "#334155" }}>{item.date}</td>
                            <td style={{ padding: "10px 14px", fontSize: "12.5px", color: "#334155" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
                                {item.method}
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px", fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>
                              ${item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </aside>
            </div>

            {/* Right Main Sales Statement Area */}
            <div className="col-lg-8 col-md-12">
              <div
                className="main-wraper"
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "30px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <h4
                      className="main-title"
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      Sales Statement
                    </h4>
                    <h6
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: 400,
                        marginTop: "4px",
                      }}
                    >
                      You may add your payment method or withdraw credits to bank / cards.
                    </h6>
                  </div>

                  {/* Search box for products */}
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Search sales..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: "7px 12px",
                        fontSize: "13px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        minWidth: "200px",
                        outline: "none",
                      }}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          fontSize: "14px",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Timeframe Tabs */}
                <ul
                  className="list-crumb"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    listStyle: "none",
                    padding: 0,
                    margin: "12px 0 20px",
                    gap: "8px",
                  }}
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => setFilterPeriod("all")}
                      style={{
                        background: filterPeriod === "all" ? "#0284c7" : "#f1f5f9",
                        color: filterPeriod === "all" ? "#ffffff" : "#475569",
                        border: "none",
                        padding: "5px 14px",
                        borderRadius: "20px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      All Times
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setFilterPeriod("2020")}
                      style={{
                        background: filterPeriod === "2020" ? "#0284c7" : "#f1f5f9",
                        color: filterPeriod === "2020" ? "#ffffff" : "#475569",
                        border: "none",
                        padding: "5px 14px",
                        borderRadius: "20px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      2020
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setFilterPeriod("month")}
                      style={{
                        background: filterPeriod === "month" ? "#0284c7" : "#f1f5f9",
                        color: filterPeriod === "month" ? "#ffffff" : "#475569",
                        border: "none",
                        padding: "5px 14px",
                        borderRadius: "20px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      This Month
                    </button>
                  </li>
                </ul>

                {/* Sales Table */}
                <div className="table-responsive" style={{ overflowX: "auto" }}>
                  <table
                    className="table table-default table-responsive-md table-striped"
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      borderSpacing: 0,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ background: "#0284c7", color: "#ffffff", padding: "12px 16px", fontSize: "13px" }}>Date</th>
                        <th style={{ background: "#0284c7", color: "#ffffff", padding: "12px 16px", fontSize: "13px" }}>Country</th>
                        <th style={{ background: "#0284c7", color: "#ffffff", padding: "12px 16px", fontSize: "13px" }}>Product</th>
                        <th style={{ background: "#0284c7", color: "#ffffff", padding: "12px 16px", fontSize: "13px", textAlign: "center" }}>Item Sales</th>
                        <th style={{ background: "#0284c7", color: "#ffffff", padding: "12px 16px", fontSize: "13px", textAlign: "right" }}>Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                            No sales records found for the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredSales.map((item, idx) => (
                          <tr key={item.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", whiteSpace: "nowrap" }}>
                              {item.date}
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", whiteSpace: "nowrap" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                <img
                                  src={item.flagUrl}
                                  alt={item.country}
                                  title={item.country}
                                  style={{ width: "20px", height: "14px", objectFit: "cover", borderRadius: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                                <span>{item.country}</span>
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#0284c7", fontWeight: 500 }}>
                              <Link href="/courses" style={{ color: "#0284c7", textDecoration: "none" }}>
                                {item.product}
                              </Link>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", textAlign: "center", fontWeight: 500 }}>
                              {item.itemSales}
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#0f172a", fontWeight: 600, textAlign: "right" }}>
                              ${item.earnings.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                      <tr
                        className="total-balnce"
                        style={{
                          background: "#334155",
                          color: "#ffffff",
                          fontWeight: 700,
                        }}
                      >
                        <td colSpan={3} style={{ padding: "14px 16px", fontSize: "14px", color: "#ffffff" }}>
                          Total
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "14px", color: "#ffffff", textAlign: "center" }}>
                          {totals.sales}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: "15px", color: "#38bdf8", textAlign: "right" }}>
                          ${totals.earnings}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Manage payout note */}
                <p className="manage-payout" style={{ marginTop: "24px", fontSize: "13px", color: "#64748b" }}>
                  How to manage your payment and payouts?{" "}
                  <Link
                    href="/settings"
                    style={{
                      color: "#ef4444",
                      fontWeight: 600,
                      textDecoration: "underline",
                      marginLeft: "4px",
                    }}
                  >
                    Click Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Set Payment Method Modal */}
      {isMethodModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setIsMethodModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "28px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
                Set Payout Method
              </h4>
              <button
                type="button"
                onClick={() => setIsMethodModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" }}
              >
                ×
              </button>
            </div>

            {saveSuccessMsg && (
              <div style={{ padding: "10px 14px", background: "#f0fdf4", color: "#166534", borderRadius: "6px", marginBottom: "14px", fontSize: "13px" }}>
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSavePaymentMethod}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#334155" }}>
                  Select Method
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("paypal")}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: selectedMethod === "paypal" ? "2px solid #0284c7" : "1px solid #e2e8f0",
                      background: selectedMethod === "paypal" ? "#e0f2fe" : "#ffffff",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("card")}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: selectedMethod === "card" ? "2px solid #0284c7" : "1px solid #e2e8f0",
                      background: selectedMethod === "card" ? "#e0f2fe" : "#ffffff",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Bank / Card
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#334155" }}>
                  {selectedMethod === "paypal" ? "PayPal Email Address" : "Bank Account / Card IBAN"}
                </label>
                <input
                  type={selectedMethod === "paypal" ? "email" : "text"}
                  value={paymentEmail}
                  onChange={(e) => setPaymentEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsMethodModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#0284c7",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}
