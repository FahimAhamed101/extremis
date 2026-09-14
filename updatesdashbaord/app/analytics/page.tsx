"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function AnalyticsPage() {
  const [revenueTimeframe, setRevenueTimeframe] = useState("Monthly");
  const chartsInitialized = useRef(false);

  useEffect(() => {
    let chartRevenue: any = null;
    let chartSales: any = null;
    let chartVisitors: any = null;
    let chartUsers: any = null;
    let chartOrders: any = null;

    const initCharts = () => {
      if (typeof window === "undefined") return;
      const ApexCharts = (window as any).ApexCharts;
      if (!ApexCharts) return;

      const revContainer = document.querySelector("#revenueMonthly");
      if (revContainer && !revContainer.hasChildNodes()) {
        const revOptions = {
          chart: {
            type: "line",
            height: 290,
            toolbar: { show: false },
          },
          stroke: { curve: "smooth", width: 3 },
          colors: ["#088dcd", "#28a745"],
          series: [
            { name: "Gross Revenue", data: [45, 52, 38, 65, 74, 88, 95, 110, 102, 125, 140, 155] },
            { name: "Net Profit", data: [30, 36, 25, 48, 55, 68, 72, 85, 80, 96, 110, 120] },
          ],
          xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          },
          tooltip: {
            y: {
              formatter: (val: number) => `$${val}k`,
            },
          },
        };
        chartRevenue = new ApexCharts(revContainer, revOptions);
        chartRevenue.render();
      }

      const salesContainer = document.querySelector("#chart-2");
      if (salesContainer && !salesContainer.hasChildNodes()) {
        const salesOptions = {
          chart: { type: "donut", height: 260 },
          series: [44, 25, 18, 13],
          labels: ["Courses", "Subscriptions", "E-Books", "Merch"],
          colors: ["#088dcd", "#34c38f", "#f1b44c", "#f46a6a"],
          legend: { position: "bottom" },
        };
        chartSales = new ApexCharts(salesContainer, salesOptions);
        chartSales.render();
      }

      const visitsContainer = document.querySelector("#uniqueVisits");
      if (visitsContainer && !visitsContainer.hasChildNodes()) {
        const visitOptions = {
          chart: { type: "bar", height: 260, toolbar: { show: false } },
          series: [
            { name: "Direct", data: [65, 59, 80, 81, 56, 55, 70, 85, 92, 105, 110, 120] },
            { name: "Referral", data: [28, 48, 40, 19, 86, 27, 45, 60, 68, 75, 80, 90] },
          ],
          colors: ["#088dcd", "#f1b44c"],
          xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          },
        };
        chartVisitors = new ApexCharts(visitsContainer, visitOptions);
        chartVisitors.render();
      }
    };

    const interval = setInterval(() => {
      if ((window as any).ApexCharts) {
        initCharts();
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      if (chartRevenue) chartRevenue.destroy();
      if (chartSales) chartSales.destroy();
      if (chartVisitors) chartVisitors.destroy();
    };
  }, []);

  return (
    <DashboardLayout pageTitle="Analytics" breadcrumb="Analytics">
      <h4 className="main-title">Analytics Overview</h4>

      {/* Top 3 Stat Cards */}
      <div className="row merged20 mb-4">
        <div className="col-lg-4 col-md-6">
          <div className="w-chart-section" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div className="w-detail" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="w-title" style={{ margin: 0, color: "#888", fontSize: "13px" }}>Total Visits</p>
                <p className="w-stats" style={{ margin: "5px 0 0", fontSize: "24px", fontWeight: 700, color: "#222" }}>423,964</p>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e8f4fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#088dcd" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="w-chart-section" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div className="w-detail" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="w-title" style={{ margin: 0, color: "#888", fontSize: "13px" }}>Total Orders</p>
                <p className="w-stats" style={{ margin: "5px 0 0", fontSize: "24px", fontWeight: 700, color: "#222" }}>7,929</p>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e6f9ed", display: "flex", alignItems: "center", justifyContent: "center", color: "#28a745" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-12">
          <div className="w-chart-section" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div className="w-detail" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p className="w-title" style={{ margin: 0, color: "#888", fontSize: "13px" }}>Total Downloads</p>
                <p className="w-stats" style={{ margin: "5px 0 0", fontSize: "24px", fontWeight: 700, color: "#222" }}>24,812</p>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fef6e7", display: "flex", alignItems: "center", justifyContent: "center", color: "#f1b44c" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download-cloud">
                  <polyline points="8 17 12 21 16 17" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Section & Monthly Orders */}
      <div className="row merged20 mb-4">
        <div className="col-lg-8 col-md-12">
          <div className="d-widget" style={{ background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div className="d-widget-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Revenue Performance</h5>
              <select
                className="browser-default custom-select"
                value={revenueTimeframe}
                onChange={(e) => setRevenueTimeframe(e.target.value)}
                style={{ width: "130px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd" }}
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div id="revenueMonthly" style={{ minHeight: "290px" }}></div>
          </div>
        </div>

        <div className="col-lg-4 col-md-12">
          <div className="d-widget blue-bg" style={{ background: "linear-gradient(135deg, #088dcd 0%, #005a9c 100%)", padding: "24px", borderRadius: "10px", color: "#fff", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ background: "rgba(255,255,255,0.2)", padding: "8px", borderRadius: "50%", display: "inline-flex" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </span>
                <span style={{ fontSize: "14px", fontWeight: 500, opacity: 0.9 }}>This Month Orders</span>
              </div>
              <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "10px 0" }}>3,192</h2>
              <p style={{ fontSize: "13px", opacity: 0.85, margin: 0 }}>+14.5% compared to last month</p>
            </div>

            <div style={{ marginTop: "20px", background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                <span>Conversion Rate</span>
                <span style={{ fontWeight: 700 }}>4.8%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                <span>Average Order Value</span>
                <span style={{ fontWeight: 700 }}>$68.50</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span>Refunds Rate</span>
                <span style={{ fontWeight: 700 }}>0.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Micro KPI Cards */}
      <div className="row merged20 mb-4">
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>Daily Sales</p>
                <h4 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>$1,204</h4>
              </div>
              <span style={{ color: "#28a745", fontWeight: 700, fontSize: "13px" }}>+8.2%</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>Followers</p>
                <h4 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>31.6K</h4>
              </div>
              <span style={{ color: "#088dcd", fontWeight: 700, fontSize: "13px" }}>+1.2K</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>Referrals</p>
                <h4 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>1,900</h4>
              </div>
              <span style={{ color: "#f1b44c", fontWeight: 700, fontSize: "13px" }}>+5.4%</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>Engagement</p>
                <h4 style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>18.2%</h4>
              </div>
              <span style={{ color: "#e83e8c", fontWeight: 700, fontSize: "13px" }}>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Breakdown & Monthly Visitors Charts */}
      <div className="row merged20">
        <div className="col-lg-4 col-md-12">
          <div className="d-widget" style={{ background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <h5 style={{ margin: "0 0 15px 0", fontWeight: 700 }}>Sales by Category</h5>
            <div id="chart-2" style={{ minHeight: "260px" }}></div>
          </div>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="d-widget" style={{ background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
            <h5 style={{ margin: "0 0 15px 0", fontWeight: 700 }}>Monthly Visitors Traffic</h5>
            <div id="uniqueVisits" style={{ minHeight: "260px" }}></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
