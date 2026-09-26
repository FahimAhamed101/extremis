"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

interface SponsorItem {
  _id?: string;
  id?: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  domain: string;
  isActive: boolean;
  order?: number;
}

interface AdvertisementBanner {
  title: string;
  imageUrl: string;
  targetUrl: string;
  altText: string;
  isActive: boolean;
}

const API_BASE = "http://localhost:4000/api";

const DEFAULT_BANNER: AdvertisementBanner = {
  title: "Advertisement",
  imageUrl: "/images/resources/ad-widget2.gif",
  targetUrl: "#",
  altText: "Advertisement",
  isActive: true,
};

const DEFAULT_SPONSORS: SponsorItem[] = [
  {
    id: "sp-1",
    title: "IQ Options Broker",
    imageUrl: "/images/resources/sponsor.jpg",
    targetUrl: "https://www.iqvie.com",
    domain: "www.iqvie.com",
    isActive: true,
    order: 1,
  },
  {
    id: "sp-2",
    title: "BM Fashion Designer",
    imageUrl: "/images/resources/sponsor2.jpg",
    targetUrl: "https://www.abcd.com",
    domain: "www.abcd.com",
    isActive: true,
    order: 2,
  },
];

export default function AdvertisementsPage() {
  const [banner, setBanner] = useState<AdvertisementBanner>(DEFAULT_BANNER);
  const [sponsors, setSponsors] = useState<SponsorItem[]>(DEFAULT_SPONSORS);
  const [loading, setLoading] = useState(true);
  const [savingBanner, setSavingBanner] = useState(false);
  const [savingSponsor, setSavingSponsor] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Sponsor modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<SponsorItem | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTargetUrl, setModalTargetUrl] = useState("");
  const [modalDomain, setModalDomain] = useState("");
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalIsActive, setModalIsActive] = useState(true);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial data
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/ads`);
      if (res.ok) {
        const data = await res.json();
        if (data.advertisement) {
          setBanner(data.advertisement);
        }
        if (Array.isArray(data.sponsors)) {
          setSponsors(data.sponsors);
        }
      }
    } catch (err) {
      console.warn("Could not fetch from backend, using defaults/stored:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save Banner
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingBanner(true);
      const res = await fetch(`${API_BASE}/ads`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertisement: banner }),
      });
      if (res.ok) {
        showToast("Sidebar Advertisement updated successfully!");
      } else {
        showToast("Failed to update advertisement.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating advertisement banner.", "error");
    } finally {
      setSavingBanner(false);
    }
  };

  // Handle Banner Image File Upload
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch(`${API_BASE}/ads/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, name: file.name }),
        });
        if (res.ok) {
          const data = await res.json();
          setBanner((prev) => ({ ...prev, imageUrl: data.url }));
          showToast("Banner image uploaded successfully!");
        } else {
          setBanner((prev) => ({ ...prev, imageUrl: base64 }));
          showToast("Image loaded as preview.", "success");
        }
      } catch {
        setBanner((prev) => ({ ...prev, imageUrl: base64 }));
        showToast("Image loaded as preview.", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Open modal for Add
  const openAddSponsorModal = () => {
    setEditingSponsor(null);
    setModalTitle("");
    setModalTargetUrl("");
    setModalDomain("");
    setModalImageUrl("");
    setModalIsActive(true);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const openEditSponsorModal = (sponsor: SponsorItem) => {
    setEditingSponsor(sponsor);
    setModalTitle(sponsor.title);
    setModalTargetUrl(sponsor.targetUrl);
    setModalDomain(sponsor.domain);
    setModalImageUrl(sponsor.imageUrl);
    setModalIsActive(sponsor.isActive !== false);
    setIsModalOpen(true);
  };

  // Handle Sponsor Image File Upload
  const handleSponsorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch(`${API_BASE}/ads/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, name: file.name }),
        });
        if (res.ok) {
          const data = await res.json();
          setModalImageUrl(data.url);
          showToast("Sponsor image uploaded successfully!");
        } else {
          setModalImageUrl(base64);
        }
      } catch {
        setModalImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Sponsor (Add or Edit)
  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) {
      showToast("Title is required", "error");
      return;
    }

    try {
      setSavingSponsor(true);
      const payload = {
        title: modalTitle.trim(),
        targetUrl: modalTargetUrl.trim() || "#",
        domain: modalDomain.trim() || (modalTargetUrl.includes("://") ? new URL(modalTargetUrl).hostname : modalTargetUrl),
        imageUrl: modalImageUrl.trim(),
        isActive: modalIsActive,
      };

      const sponsorId = editingSponsor?._id || editingSponsor?.id;

      if (editingSponsor && sponsorId) {
        // Update
        const res = await fetch(`${API_BASE}/ads/sponsors/${sponsorId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("Sponsor updated successfully!");
          await fetchAds();
          setIsModalOpen(false);
        } else {
          // Local fallback
          setSponsors((prev) =>
            prev.map((s) => ((s._id || s.id) === sponsorId ? { ...s, ...payload } : s))
          );
          showToast("Sponsor updated locally!");
          setIsModalOpen(false);
        }
      } else {
        // Create
        const res = await fetch(`${API_BASE}/ads/sponsors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast("New sponsor added successfully!");
          await fetchAds();
          setIsModalOpen(false);
        } else {
          // Local fallback
          const newLocalSponsor: SponsorItem = {
            id: "sp-" + Date.now(),
            ...payload,
          };
          setSponsors((prev) => [...prev, newLocalSponsor]);
          showToast("Sponsor added locally!");
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to save sponsor.", "error");
    } finally {
      setSavingSponsor(false);
    }
  };

  // Delete Sponsor
  const handleDeleteSponsor = async (sponsor: SponsorItem) => {
    const sponsorId = sponsor._id || sponsor.id;
    if (!sponsorId) return;

    if (!confirm(`Are you sure you want to delete sponsor "${sponsor.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/ads/sponsors/${sponsorId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Sponsor deleted successfully!");
        setSponsors((prev) => prev.filter((s) => (s._id || s.id) !== sponsorId));
      } else {
        setSponsors((prev) => prev.filter((s) => (s._id || s.id) !== sponsorId));
        showToast("Sponsor removed locally.");
      }
    } catch (err) {
      console.error(err);
      setSponsors((prev) => prev.filter((s) => (s._id || s.id) !== sponsorId));
      showToast("Sponsor removed locally.");
    }
  };

  // Toggle Sponsor active state directly
  const handleToggleSponsor = async (sponsor: SponsorItem) => {
    const sponsorId = sponsor._id || sponsor.id;
    if (!sponsorId) return;

    const newActiveState = !sponsor.isActive;
    setSponsors((prev) =>
      prev.map((s) => ((s._id || s.id) === sponsorId ? { ...s, isActive: newActiveState } : s))
    );

    try {
      await fetch(`${API_BASE}/ads/sponsors/${sponsorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActiveState }),
      });
      showToast(`Sponsor ${newActiveState ? "enabled" : "disabled"}!`);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <DashboardLayout pageTitle="Ads & Sponsors Management" breadcrumb="Advertisements">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 99999,
            padding: "14px 22px",
            borderRadius: "8px",
            background: toastMessage.type === "success" ? "#10b981" : "#ef4444",
            color: "#fff",
            fontWeight: 600,
            fontSize: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <span>{toastMessage.type === "success" ? "✓" : "⚠"}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #088dcd 0%, #005a9c 100%)",
            color: "#fff",
            padding: "26px 30px",
            borderRadius: "14px",
            marginBottom: "30px",
            boxShadow: "0 4px 20px rgba(8,141,205,0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "22px", fontWeight: 700 }}>
              📢 Advertisement & Sponsor Controls
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
              Update all sidebar advertisement boxes and sponsored cards in real-time across the Socimo frontend.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddSponsorModal}
            style={{
              background: "#fff",
              color: "#088dcd",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <span>+</span> Add New Sponsor
          </button>
        </div>

        {/* Two-Column Grid: Left Banner Settings, Right Live Previews & Sponsors List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "28px" }}>
          
          {/* 1. Main Sidebar Advertisement Banner Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #eaedf1",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#1e293b" }}>
                1. Main Sidebar Advertisement
              </h4>
              <span
                style={{
                  background: banner.isActive ? "#ecfdf5" : "#fef2f2",
                  color: banner.isActive ? "#059669" : "#dc2626",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {banner.isActive ? "Active on Frontend" : "Hidden"}
              </span>
            </div>

            {/* Live Preview Box matching user's Image 1 */}
            <div style={{ marginBottom: "22px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "8px" }}>
                LIVE PREVIEW (640px x 557px Widget):
              </span>
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#f8fafc",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div style={{ textAlign: "left", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#088dcd", fontSize: "14px" }}>ℹ</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                    {banner.title || "ADVERTISMENT"}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    minHeight: "220px",
                    background: "#e2e8f0",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.altText || "Ad"}
                      style={{ width: "100%", height: "220px", objectFit: "cover" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/resources/ad-widget2.gif";
                      }}
                    />
                  ) : (
                    <span style={{ color: "#64748b", fontWeight: 600 }}>640px x 557px</span>
                  )}
                </div>
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#64748b", textAlign: "left" }}>
                  Destination: <a href={banner.targetUrl || "#"} target="_blank" rel="noreferrer" style={{ color: "#088dcd" }}>{banner.targetUrl || "None"}</a>
                </div>
              </div>
            </div>

            {/* Form to update Advertisement */}
            <form onSubmit={handleSaveBanner}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Widget Title / Header
                </label>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                  placeholder="e.g. Advertisement"
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Image URL
                </label>
                <input
                  type="text"
                  value={banner.imageUrl}
                  onChange={(e) => setBanner({ ...banner, imageUrl: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                  placeholder="https://... or /images/resources/..."
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Or Upload New Image (JPG, PNG, GIF)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileUpload}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                    background: "#f8fafc",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Target Destination URL (Click Link)
                </label>
                <input
                  type="text"
                  value={banner.targetUrl}
                  onChange={(e) => setBanner({ ...banner, targetUrl: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                  placeholder="https://example.com"
                />
              </div>

              <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="bannerActiveCheckbox"
                  checked={banner.isActive}
                  onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="bannerActiveCheckbox" style={{ fontSize: "13px", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
                  Display Advertisement on Frontend
                </label>
              </div>

              <button
                type="submit"
                disabled={savingBanner}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: "#088dcd",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(8,141,205,0.3)",
                }}
              >
                {savingBanner ? "Saving Changes..." : "Save Advertisement Banner"}
              </button>
            </form>
          </div>

          {/* 2. Sponsored Cards Listing Card (Matching Image 2) */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              border: "1px solid #eaedf1",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#1e293b" }}>
                  2. Sponsored Listings ({sponsors.length})
                </h4>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                  Appears under &quot;🌐 Sponsored&quot; in the sidebar
                </p>
              </div>
              <button
                type="button"
                onClick={openAddSponsorModal}
                style={{
                  background: "#ecfdf5",
                  color: "#059669",
                  border: "1px solid #a7f3d0",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                + Add Sponsor
              </button>
            </div>

            {/* Live Preview of Sponsored Card widget */}
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "8px" }}>
                LIVE PREVIEW (Sponsored Card Widget):
              </span>
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  padding: "16px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🌐</span> <span>Sponsored</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {sponsors.filter((s) => s.isActive !== false).map((sp, idx) => (
                    <div key={sp._id || sp.id || idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div
                        style={{
                          width: "70px",
                          height: "60px",
                          borderRadius: "8px",
                          background: "#e2e8f0",
                          overflow: "hidden",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {sp.imageUrl ? (
                          <img
                            src={sp.imageUrl}
                            alt={sp.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/images/resources/sponsor.jpg";
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "10px", color: "#64748b" }}>Img</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h6 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: 700, color: "#088dcd" }}>
                          {sp.title}
                        </h6>
                        <a
                          href={sp.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: "12px", color: "#64748b", textDecoration: "none" }}
                        >
                          {sp.domain || sp.targetUrl}
                        </a>
                      </div>
                    </div>
                  ))}
                  {sponsors.filter((s) => s.isActive !== false).length === 0 && (
                    <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>No active sponsors currently.</p>
                  )}
                </div>
              </div>
            </div>

            {/* List Table of Sponsors */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sponsors.map((sp, idx) => (
                <div
                  key={sp._id || sp.id || idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={sp.imageUrl || "/images/resources/sponsor.jpg"}
                    alt={sp.title}
                    style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/resources/sponsor.jpg";
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{sp.title}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSponsor(sp)}
                        style={{
                          background: sp.isActive ? "#ecfdf5" : "#fef2f2",
                          color: sp.isActive ? "#059669" : "#dc2626",
                          border: "none",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "10px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {sp.isActive ? "ACTIVE" : "DISABLED"}
                      </button>
                    </div>
                    <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>
                      {sp.domain || sp.targetUrl}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => openEditSponsorModal(sp)}
                      style={{
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSponsor(sp)}
                      style={{
                        background: "#fee2e2",
                        border: "1px solid #fca5a5",
                        color: "#b91c1c",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Add / Edit Sponsor Modal */}
      {isModalOpen && (
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
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "26px",
              width: "500px",
              maxWidth: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h5 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
                {editingSponsor ? "Edit Sponsor Listing" : "Add New Sponsor Listing"}
              </h5>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSponsor}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Sponsor Name / Title *
                </label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. IQ Options Broker"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Target Destination URL (Click Link) *
                </label>
                <input
                  type="text"
                  value={modalTargetUrl}
                  onChange={(e) => {
                    setModalTargetUrl(e.target.value);
                    if (!modalDomain) {
                      try {
                        const u = new URL(e.target.value.startsWith("http") ? e.target.value : `https://${e.target.value}`);
                        setModalDomain(u.hostname);
                      } catch {}
                    }
                  }}
                  placeholder="https://www.iqvie.com"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Display Domain Text
                </label>
                <input
                  type="text"
                  value={modalDomain}
                  onChange={(e) => setModalDomain(e.target.value)}
                  placeholder="www.iqvie.com"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Image URL
                </label>
                <input
                  type="text"
                  value={modalImageUrl}
                  onChange={(e) => setModalImageUrl(e.target.value)}
                  placeholder="https://... or /images/resources/sponsor.jpg"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                  Or Upload Sponsor Image (JPG/PNG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSponsorFileUpload}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                    background: "#f8fafc",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="modalActiveCheckbox"
                  checked={modalIsActive}
                  onChange={(e) => setModalIsActive(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="modalActiveCheckbox" style={{ fontSize: "13px", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
                  Active and Visible on Frontend
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSponsor}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "6px",
                    background: "#088dcd",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  {savingSponsor ? "Saving..." : editingSponsor ? "Update Sponsor" : "Add Sponsor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
