"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import Link from "next/link";

export default function AppFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <>
      <footer
        style={{
          position: "relative",
          width: "100%",
          backgroundColor: "#deebf3",
          borderTop: "1px solid #9ab2c1",
          marginTop: "auto",
        }}
      >
        <div className="gap" style={{ padding: "60px 0 50px", position: "relative" }}>
          {/* Subtle background watermarks */}
          <div
            className="bg-image"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url(/images/resources/footer-bg.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "cover",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />

          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="row">
              {/* Col 1: Brand & Contact */}
              <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                <div className="web-info">
                  <Link href="/" title="Home" style={{ display: "inline-block", marginBottom: "16px" }}>
                    <img
                      src="/images/logo.png"
                      alt="Updates"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "22px",
                        objectFit: "cover",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/fav.png";
                      }}
                    />
                  </Link>
                  <p style={{ color: "#3e3f5e", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>
                    Subscribe our newsletter for getting notifications and alerts
                  </p>
                  <div className="contact-little" style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#3e3f5e" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="icofont-phone-circle" style={{ fontSize: "18px", color: "#088dcd" }}></i>
                      +1-235-099-34
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className="icofont-email" style={{ fontSize: "18px", color: "#088dcd" }}></i>
                      info@akedmic.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Col 2: Company */}
              <div className="col-lg-2 col-md-3 col-sm-6 mb-4">
                <div className="widget" style={{ background: "transparent", border: "none", padding: 0, boxShadow: "none" }}>
                  <div className="widget-title" style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", position: "relative", display: "inline-block" }}>
                      Company
                    </h4>
                  </div>
                  <ul className="quick-links" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <li><Link href="/about" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>About Us</Link></li>
                    <li><Link href="/career" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Career</Link></li>
                    <li><Link href="/policy" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Privacy</Link></li>
                    <li><Link href="/policy" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Terms</Link></li>
                    <li><Link href="/help" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>FAQ</Link></li>
                    <li><Link href="/messages" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Contact</Link></li>
                  </ul>
                </div>
              </div>

              {/* Col 3: Quick Links */}
              <div className="col-lg-2 col-md-3 col-sm-6 mb-4">
                <div className="widget" style={{ background: "transparent", border: "none", padding: 0, boxShadow: "none" }}>
                  <div className="widget-title" style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                      Quick Links
                    </h4>
                  </div>
                  <ul className="quick-links" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <li><Link href="/products" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Product</Link></li>
                    <li><Link href="/books" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Market</Link></li>
                    <li><Link href="/courses" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Courses</Link></li>
                    <li><Link href="/add-new-course" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Services</Link></li>
                    <li><Link href="/advertise" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Enterprise</Link></li>
                    <li><Link href="/sitemap.xml" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }}>Sitemap</Link></li>
                  </ul>
                </div>
              </div>

              {/* Col 4: Follow Us */}
              <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
                <div className="widget" style={{ background: "transparent", border: "none", padding: 0, boxShadow: "none" }}>
                  <div className="widget-title" style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                      Follow Us
                    </h4>
                  </div>
                  <ul className="quick-links" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <li>
                      <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="icofont-facebook" style={{ color: "#1877f2" }}></i> Facebook
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="icofont-twitter" style={{ color: "#1da1f2" }}></i> Twitter
                      </a>
                    </li>
                    <li>
                      <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="icofont-instagram" style={{ color: "#e1306c" }}></i> Instagram
                      </a>
                    </li>
                    <li>
                      <a href="https://google.com" target="_blank" rel="noreferrer" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="icofont-google-plus" style={{ color: "#db4437" }}></i> Google +
                      </a>
                    </li>
                    <li>
                      <a href="https://whatsapp.com" target="_blank" rel="noreferrer" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="icofont-whatsapp" style={{ color: "#25d366" }}></i> Whatsapp
                      </a>
                    </li>
                    <li>
                      <a href="https://reddit.com" target="_blank" rel="noreferrer" style={{ color: "#475569", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="icofont-reddit" style={{ color: "#ff4500" }}></i> Reddit
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Col 5: Newsletter & App Download */}
              <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                <div className="widget" style={{ background: "transparent", border: "none", padding: 0, boxShadow: "none" }}>
                  <div className="widget-title" style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
                      Newsletter
                    </h4>
                  </div>
                  <div className="news-lettr">
                    <form className="newsletter" onSubmit={handleSubscribe} style={{ position: "relative", marginBottom: "12px" }}>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 48px 10px 16px",
                          borderRadius: "30px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          outline: "none",
                          backgroundColor: "#ffffff",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          position: "absolute",
                          right: "4px",
                          top: "4px",
                          bottom: "4px",
                          width: "36px",
                          border: "none",
                          borderRadius: "50%",
                          backgroundColor: "#088dcd",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "15px",
                          transition: "background-color 0.2s",
                        }}
                      >
                        <i className="icofont-paper-plane"></i>
                      </button>
                    </form>

                    {subscribed && (
                      <div
                        style={{
                          backgroundColor: "#ecfdf5",
                          border: "1px solid #10b981",
                          color: "#065f46",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          marginBottom: "12px",
                          fontWeight: 500,
                        }}
                      >
                        ✓ Thank you for subscribing!
                      </div>
                    )}

                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>
                      It is a long established fact that a reader will be distracted by.
                    </p>

                    <h5 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>
                      Download App
                    </h5>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <a href="#" title="Download Android App" onClick={(e) => e.preventDefault()}>
                        <img src="/images/android.png" alt="Android" style={{ height: "26px", objectFit: "contain" }} />
                      </a>
                      <a href="#" title="Download Apple iOS App" onClick={(e) => e.preventDefault()}>
                        <img src="/images/apple.png" alt="Apple" style={{ height: "26px", objectFit: "contain" }} />
                      </a>
                      <a href="#" title="Download Windows App" onClick={(e) => e.preventDefault()}>
                        <img src="/images/windows.png" alt="Windows" style={{ height: "26px", objectFit: "contain" }} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bottombar" style={{ backgroundColor: "#deebf3", borderTop: "1px solid #c9dbe6", padding: "16px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                &copy; copyright All rights reserved by Socimo 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
