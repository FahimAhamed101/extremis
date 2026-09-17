"use client";

import React from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import UsefulLinksWidget, { UsefulLinkTab } from "./UsefulLinksWidget";
import Link from "next/link";

interface UsefulLinksPageClientProps {
  defaultTab: UsefulLinkTab;
  pageTitle: string;
}

export default function UsefulLinksPageClient({ defaultTab, pageTitle }: UsefulLinksPageClientProps) {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />

        <div style={{ backgroundColor: "#f8fafc", minHeight: "calc(100vh - 70px)", padding: "40px 16px" }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            {/* Breadcrumb & Navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b" }}>
                <Link href="/" style={{ color: "#088dcd", textDecoration: "none", fontWeight: "600" }}>
                  Home
                </Link>
                <span>/</span>
                <span style={{ color: "#1e293b", fontWeight: "600" }}>{pageTitle}</span>
              </div>

              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#088dcd",
                  fontSize: "13px",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                &larr; Back to Newsfeed
              </Link>
            </div>

            {/* Layout Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px", alignItems: "start" }}>
              {/* Left Sidebar */}
              <aside>
                <UsefulLinksWidget initialTab={defaultTab} />

                <div style={{ backgroundColor: "#fff", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <h5 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
                    Quick Support
                  </h5>
                  <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                    Need urgent assistance with your account or publications? Our team is available 24/7.
                  </p>
                  <a
                    href="mailto:support@updates.today"
                    style={{
                      display: "inline-block",
                      backgroundColor: "#f1f5f9",
                      color: "#0f172a",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    <i className="icofont-envelope"></i> support@updates.today
                  </a>
                </div>
              </aside>

              {/* Main Content Card */}
              <main
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "32px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
                }}
              >
                <div style={{ marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#e0f2fe",
                      color: "#0369a1",
                      fontSize: "12px",
                      fontWeight: "700",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    Updates Platform
                  </span>
                  <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#0f172a" }}>
                    {pageTitle}
                  </h1>
                </div>

                {/* Render the embedded tab view */}
                <div style={{ minHeight: "450px" }}>
                  {defaultTab === "about" && (
                    <div>
                      <p style={{ fontSize: "16px", color: "#334155", lineHeight: "1.7", marginBottom: "24px" }}>
                        Updates is an academic and professional social platform built to make peer-to-peer knowledge
                        sharing instant, structured, and rewarding. Connecting thousands of creators and researchers
                        worldwide, we bridge the gap between preliminary insights and formal publication.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                        <div style={statBox}>
                          <h2 style={{ color: "#088dcd", margin: 0, fontSize: "28px", fontWeight: "800" }}>25,000+</h2>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>Active Contributors</span>
                        </div>
                        <div style={statBox}>
                          <h2 style={{ color: "#10b981", margin: 0, fontSize: "28px", fontWeight: "800" }}>120+</h2>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>Universities & Labs</span>
                        </div>
                        <div style={statBox}>
                          <h2 style={{ color: "#8b5cf6", margin: 0, fontSize: "28px", fontWeight: "800" }}>45,000+</h2>
                          <span style={{ fontSize: "13px", color: "#64748b" }}>Papers & Field Notes</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "12px" }}>
                        Platform Features
                      </h3>
                      <ul style={{ color: "#475569", lineHeight: "1.8", fontSize: "15px", paddingLeft: "20px" }}>
                        <li><strong>Collaborative Groups:</strong> Field-specific clusters for focused discussions.</li>
                        <li><strong>Geo-Nearby Discovery:</strong> Discover nearby researchers and local academic meetups.</li>
                        <li><strong>Live Stories & Media:</strong> Share visual progress reports, field experiments, and demos.</li>
                        <li><strong>Instant Messaging:</strong> End-to-end encrypted direct peer messaging.</li>
                      </ul>
                    </div>
                  )}

                  {defaultTab === "career" && (
                    <div>
                      <p style={{ fontSize: "16px", color: "#334155", lineHeight: "1.7", marginBottom: "24px" }}>
                        We are looking for passionate engineers, researchers, and community builders to join our distributed team.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {[
                          { title: "Senior Fullstack Engineer", team: "Engineering • Remote", salary: "$110k - $140k", desc: "Lead the frontend & API development of our Next.js + Node microservices architecture." },
                          { title: "Android Mobile Engineer", team: "Mobile • Remote", salary: "$100k - $130k", desc: "Build native features for our Android app (Kotlin, offline sync, media processing)." },
                          { title: "AI Recommender Scientist", team: "AI & Search • Hybrid", salary: "$120k - $155k", desc: "Develop knowledge graphs and citation discovery algorithms." },
                          { title: "Product UI/UX Designer", team: "Design • Remote", salary: "$85k - $115k", desc: "Shape the next generation of academic collaboration tools." },
                        ].map((job, idx) => (
                          <div key={idx} style={{ padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                              <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>{job.title}</h4>
                              <span style={{ fontSize: "13px", fontWeight: "700", color: "#10b981" }}>{job.salary}</span>
                            </div>
                            <span style={{ fontSize: "12px", color: "#088dcd", fontWeight: "600", display: "block", marginBottom: "8px" }}>{job.team}</span>
                            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#475569" }}>{job.desc}</p>
                            <a
                              href="mailto:careers@updates.today"
                              style={{
                                display: "inline-block",
                                backgroundColor: "#088dcd",
                                color: "#fff",
                                padding: "6px 16px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                textDecoration: "none",
                              }}
                            >
                              Apply via Email &rarr;
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {defaultTab === "advertise" && (
                    <div>
                      <p style={{ fontSize: "16px", color: "#334155", lineHeight: "1.7", marginBottom: "24px" }}>
                        Partner with Updates to reach over 25,000 highly engaged researchers, graduate scholars, software developers, and academic institutions.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                        <div style={adCard}>
                          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>Sponsored Posts</h4>
                          <p style={{ fontSize: "13px", color: "#64748b" }}>Native feed integration with verified sponsor badge, custom link tracking, and performance analytics.</p>
                          <span style={{ color: "#088dcd", fontWeight: "700", fontSize: "14px" }}>From $450 / campaign</span>
                        </div>
                        <div style={adCard}>
                          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>Sidebar Banners</h4>
                          <p style={{ fontSize: "13px", color: "#64748b" }}>High-visibility placement on desktop feeds and topic explore pages with 100% brand safety.</p>
                          <span style={{ color: "#088dcd", fontWeight: "700", fontSize: "14px" }}>From $350 / month</span>
                        </div>
                        <div style={adCard}>
                          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>Event Promotion</h4>
                          <p style={{ fontSize: "13px", color: "#64748b" }}>Highlight your conferences, hackathons, and calls for papers to target discipline groups.</p>
                          <span style={{ color: "#088dcd", fontWeight: "700", fontSize: "14px" }}>From $600 / event</span>
                        </div>
                      </div>

                      <div style={{ backgroundColor: "#f1f5f9", padding: "20px", borderRadius: "12px" }}>
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Request Media Kit</h4>
                        <p style={{ margin: "0 0 14px 0", fontSize: "13px", color: "#475569" }}>
                          Contact our partnerships team at <strong>advertising@updates.today</strong> for detailed audience demographics and custom sponsorship proposals.
                        </p>
                        <a
                          href="mailto:advertising@updates.today?subject=Updates Media Kit Request"
                          style={{
                            display: "inline-block",
                            backgroundColor: "#f59e0b",
                            color: "#fff",
                            padding: "8px 20px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            fontWeight: "600",
                            textDecoration: "none",
                          }}
                        >
                          Request Media Kit &rarr;
                        </a>
                      </div>
                    </div>
                  )}

                  {defaultTab === "help" && (
                    <div>
                      <p style={{ fontSize: "16px", color: "#334155", lineHeight: "1.7", marginBottom: "24px" }}>
                        Have questions about account management, media uploads, group collaborations, or security?
                        Browse our answers below or reach out to our team.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                        {[
                          { q: "How do I change my avatar or profile cover?", a: "Go to your Profile page, hover over the profile photo or banner, and click the camera icon. Select an image from your device and it will save immediately without logging you out." },
                          { q: "How does the auto-detect location feature work?", a: "Clicking 'Auto-Detect' on the registration or profile screen uses browser geolocation and secure IP lookup to identify your approximate coordinates so you can connect with local researchers." },
                          { q: "How can I join research groups?", a: "Visit the Groups page from the navigation bar. You can browse suggested groups by category and click 'Join' or start your own research circle." },
                          { q: "How do I report inappropriate content?", a: "Click the options menu on any post or comment and select 'Report'. Our moderation team reviews all flagged items within 24 hours." },
                        ].map((faq, i) => (
                          <div key={i} style={{ padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                            <h5 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>{faq.q}</h5>
                            <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(defaultTab === "content-policy" || defaultTab === "user-policy") && (
                    <div>
                      <p style={{ fontSize: "16px", color: "#334155", lineHeight: "1.7", marginBottom: "24px" }}>
                        Our platform policies ensure safety, academic rigor, and mutual respect across the entire Updates community.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "18px", color: "#334155", lineHeight: "1.7" }}>
                        <div>
                          <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                            1. Academic Integrity & Proper Attribution
                          </h4>
                          <p style={{ margin: 0, fontSize: "14px" }}>
                            All members must respect copyright and accurately cite peer contributions. Plagiarized materials or unauthorized uploads will be removed immediately.
                          </p>
                        </div>

                        <div>
                          <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                            2. Privacy & Data Protection
                          </h4>
                          <p style={{ margin: 0, fontSize: "14px" }}>
                            Your personal data is encrypted at rest and in transit. We comply with GDPR and CCPA standards and never sell member information to third-party brokers.
                          </p>
                        </div>

                        <div>
                          <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                            3. Community Code of Conduct
                          </h4>
                          <p style={{ margin: 0, fontSize: "14px" }}>
                            Harassment, personal attacks, and discriminatory language are strictly prohibited. Violators are subject to immediate account restriction.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}

const statBox: React.CSSProperties = {
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  textAlign: "center",
};

const adCard: React.CSSProperties = {
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};
