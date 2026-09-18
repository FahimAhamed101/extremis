"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import HomeHeader from "@/components/layout/HomeHeader";
import {
  useInviteColleagueMutation,
  useGetDiscoverPeopleQuery,
  useToggleFollowUserMutation,
} from "@/lib/services/authApi";

type DepartmentItem = {
  id: string;
  name: string;
  membersCount: number;
  category: "engineering" | "health" | "sciences" | "humanities";
};

type FacultyMember = {
  id: string;
  name: string;
  department: string;
  avatar: string;
  isFollowing: boolean;
  isRealUser?: boolean;
  userId?: string;
};

const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  { id: "dept-1", name: "Department of Electrical and Electronics Engineering", membersCount: 65, category: "engineering" },
  { id: "dept-2", name: "Department of Food Engineering", membersCount: 55, category: "engineering" },
  { id: "dept-3", name: "Faculty of Nursing", membersCount: 38, category: "health" },
  { id: "dept-4", name: "Department of Computer Engineering", membersCount: 82, category: "engineering" },
  { id: "dept-5", name: "Faculty of Medicine", membersCount: 140, category: "health" },
  { id: "dept-6", name: "Department of Mechanical Engineering", membersCount: 72, category: "engineering" },
  { id: "dept-7", name: "Faculty of Law", membersCount: 45, category: "humanities" },
  { id: "dept-8", name: "Faculty of Architecture", membersCount: 50, category: "engineering" },
  { id: "dept-9", name: "Department of Civil Engineering", membersCount: 60, category: "engineering" },
  { id: "dept-10", name: "Department of Economics", membersCount: 58, category: "humanities" },
  { id: "dept-11", name: "Faculty of Agriculture", membersCount: 42, category: "sciences" },
  { id: "dept-12", name: "Faculty of Education", membersCount: 64, category: "humanities" },
];

const INITIAL_MEMBERS: FacultyMember[] = [
  { id: "mem-1", name: "Amy Watson", department: "Department of Sociology", avatar: "/images/resources/speak-1.jpg", isFollowing: false },
  { id: "mem-2", name: "Muhammad A.", department: "Department of Zoology", avatar: "/images/resources/speak-2.jpg", isFollowing: false },
  { id: "mem-3", name: "Sara Jean", department: "Department of Sociology", avatar: "/images/resources/speak-3.jpg", isFollowing: false },
  { id: "mem-4", name: "William Jhon", department: "Department of Biology", avatar: "/images/resources/speak-4.jpg", isFollowing: false },
  { id: "mem-5", name: "Amy Watson", department: "Department of Sociology", avatar: "/images/resources/speak-5.jpg", isFollowing: false },
  { id: "mem-6", name: "Maria K.", department: "Department of Zoology", avatar: "/images/resources/speak-6.jpg", isFollowing: false },
  { id: "mem-7", name: "Zing Zang", department: "Department of Sociology", avatar: "/images/resources/speak-7.jpg", isFollowing: false },
  { id: "mem-8", name: "William Jhon", department: "Department of Biology", avatar: "/images/resources/speak-8.jpg", isFollowing: false },
  { id: "mem-9", name: "Sara Will", department: "Department of Biology", avatar: "/images/resources/speak-9.jpg", isFollowing: false },
  { id: "mem-10", name: "Emily Jane", department: "Department of Biology", avatar: "/images/resources/speak-10.jpg", isFollowing: false },
  { id: "mem-11", name: "Bunny Bill", department: "Department of Biology", avatar: "/images/resources/speak-11.jpg", isFollowing: false },
  { id: "mem-12", name: "William Sam", department: "Department of Biology", avatar: "/images/resources/speak-12.jpg", isFollowing: false },
];

const INITIAL_FOLLOWERS = [
  { id: "fol-1", name: "Kelly Bill", subtitle: "Dept colleague", avatar: "/images/resources/friend-avatar.jpg", isFollowing: false },
  { id: "fol-2", name: "Issabel", subtitle: "Dept colleague", avatar: "/images/resources/friend-avatar2.jpg", isFollowing: false },
  { id: "fol-3", name: "Andrew", subtitle: "Dept colleague", avatar: "/images/resources/friend-avatar3.jpg", isFollowing: false },
  { id: "fol-4", name: "Sophia", subtitle: "Dept colleague", avatar: "/images/resources/friend-avatar4.jpg", isFollowing: false },
  { id: "fol-5", name: "Allen", subtitle: "Dept colleague", avatar: "/images/resources/friend-avatar5.jpg", isFollowing: false },
];

export default function UniversityProfileClient() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"overview" | "departments" | "members">("overview");

  // University following state
  const [isUniFollowing, setIsUniFollowing] = useState(false);
  const [uniFollowersCount, setUniFollowersCount] = useState(254);

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteStatus, setInviteStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Question form state
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionType, setQuestionType] = useState("Research");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Search & filter state
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  // Members & followers list
  const [members, setMembers] = useState<FacultyMember[]>(INITIAL_MEMBERS);
  const [followers, setFollowers] = useState(INITIAL_FOLLOWERS);

  // RTK Query endpoints
  const [inviteColleague, { isLoading: isInviting }] = useInviteColleagueMutation();
  const { data: discoverData } = useGetDiscoverPeopleQuery();
  const [toggleFollowUser] = useToggleFollowUserMutation();

  // Handle URL params e.g. ?action=invite or ?tab=members
  useEffect(() => {
    const action = searchParams.get("action");
    const tabParam = searchParams.get("tab");
    if (action === "invite") {
      setShowInviteModal(true);
    }
    if (tabParam === "departments" || tabParam === "members" || tabParam === "overview") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Merge real discover users into members if available
  useEffect(() => {
    if (discoverData && Array.isArray(discoverData.users) && discoverData.users.length > 0) {
      const realMembers: FacultyMember[] = (discoverData.users as any[]).slice(0, 8).map((u: any, index: number) => ({
        id: `real-${u.id || u._id || index}`,
        userId: u.id || u._id,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || u.username || "Academic Researcher",
        department: (u as { headline?: string }).headline || "Department of Research & Science",
        avatar: u.avatar || u.avatarUrl || `/images/resources/speak-${(index % 12) + 1}.jpg`,
        isFollowing: Boolean(u.isFollowing),
        isRealUser: true,
      }));

      setMembers((prev) => {
        // Keep initial members and prepend unique real members
        const existingIds = new Set(prev.map((m) => m.id));
        const newOnes = realMembers.filter((rm) => !existingIds.has(rm.id));
        return [...newOnes, ...prev];
      });
    }
  }, [discoverData]);

  // Handle Follow / Unfollow member
  const handleToggleMemberFollow = async (memberId: string, userId?: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, isFollowing: !m.isFollowing } : m))
    );
    if (userId) {
      try {
        await toggleFollowUser(userId).unwrap();
      } catch (e) {
        console.error("Error toggling follow user:", e);
      }
    }
  };

  // Handle Follow / Unfollow sidebar follower
  const handleToggleSidebarFollower = (followerId: string) => {
    setFollowers((prev) =>
      prev.map((f) => (f.id === followerId ? { ...f, isFollowing: !f.isFollowing } : f))
    );
  };

  // Handle University Follow
  const handleToggleUniFollow = () => {
    if (isUniFollowing) {
      setIsUniFollowing(false);
      setUniFollowersCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsUniFollowing(true);
      setUniFollowersCount((prev) => prev + 1);
    }
  };

  // Handle Invite Submit
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus(null);

    const email = inviteEmail.trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setInviteStatus({ type: "error", text: "Please provide a valid email address." });
      return;
    }

    try {
      const res = await inviteColleague({
        email,
        colleagueName: inviteName.trim() || undefined,
        note: inviteMessage.trim() || undefined,
      }).unwrap();

      setInviteStatus({
        type: "success",
        text: res.message || `Invitation successfully sent to ${email}!`,
      });
      setInviteEmail("");
      setInviteName("");
      setInviteMessage("");
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to send invitation. Please try again.";
      setInviteStatus({ type: "error", text: errorMsg });
    }
  };

  // Handle Question Submit
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionBody.trim()) {
      return;
    }
    setQuestionSubmitted(true);
    setTimeout(() => {
      setQuestionTitle("");
      setQuestionBody("");
      setQuestionSubmitted(false);
      setShowQuestionModal(false);
    }, 1800);
  };

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    if (!departmentSearch.trim()) return DEFAULT_DEPARTMENTS;
    const query = departmentSearch.toLowerCase();
    return DEFAULT_DEPARTMENTS.filter(
      (dept) => dept.name.toLowerCase().includes(query) || dept.category.includes(query)
    );
  }, [departmentSearch]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        !memberSearch.trim() ||
        member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.department.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesDept =
        selectedDeptFilter === "all" ||
        member.department.toLowerCase().includes(selectedDeptFilter.toLowerCase());
      return matchesSearch && matchesDept;
    });
  }, [members, memberSearch, selectedDeptFilter]);

  return (
    <div className="theme-layout">
      {/* Universal Top Header */}
      <HomeHeader />

      {/* University Banner & Header */}
      <div className="gap no-gap">
        <div
          className="top-area mate-black low-opacity"
          style={{
            position: "relative",
            minHeight: "340px",
            display: "flex",
            alignItems: "flex-end",
            background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(15,23,42,0.95) 100%)",
          }}
        >
          <div
            className="bg-image"
            style={{
              backgroundImage: "url(/images/resources/top-bg2.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              opacity: 0.65,
            }}
          />
          <div className="container" style={{ position: "relative", zIndex: 3, width: "100%" }}>
            <div className="row">
              <div className="col-lg-12">
                <div className="post-subject" style={{ paddingBottom: "10px" }}>
                  <div
                    className="university-tag"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "18px",
                      marginBottom: "24px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <figure
                        style={{
                          margin: 0,
                          width: "110px",
                          height: "110px",
                          borderRadius: "16px",
                          overflow: "hidden",
                          border: "4px solid #fff",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                          backgroundColor: "#fff",
                        }}
                      >
                        <img
                          src="/images/resources/uni4.jpg"
                          alt="Akdeniz University"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </figure>
                      <div className="uni-name">
                        <h2
                          style={{
                            margin: "0 0 6px 0",
                            color: "#fff",
                            fontSize: "28px",
                            fontWeight: "700",
                            letterSpacing: "-0.5px",
                          }}
                        >
                          Akdeniz University
                        </h2>
                        <span
                          style={{
                            color: "#94a3b8",
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i className="icofont-location-pin" style={{ color: "#38bdf8" }}></i> Antalya, Turkey
                          <span style={{ margin: "0 6px" }}>•</span>
                          <span style={{ color: "#cbd5e1" }}>
                            <strong>{uniFollowersCount}</strong> Followers
                          </span>
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <ul className="sharing-options" style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", gap: "8px" }}>
                        <li>
                          <button
                            type="button"
                            title="Invite Colleagues"
                            onClick={() => setShowInviteModal(true)}
                            style={{
                              background: "rgba(255,255,255,0.12)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "#fff",
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <i className="icofont-id-card" style={{ fontSize: "18px" }}></i>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            title={isUniFollowing ? "Following" : "Follow"}
                            onClick={handleToggleUniFollow}
                            style={{
                              background: isUniFollowing ? "#2563eb" : "rgba(255,255,255,0.12)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "#fff",
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <i
                              className={isUniFollowing ? "icofont-star" : "icofont-star-alt-1"}
                              style={{ fontSize: "18px", color: isUniFollowing ? "#fbbf24" : "#fff" }}
                            ></i>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            title="Share"
                            onClick={() => setShowShareModal(true)}
                            style={{
                              background: "rgba(255,255,255,0.12)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "#fff",
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <i className="icofont-share-alt" style={{ fontSize: "18px" }}></i>
                          </button>
                        </li>
                      </ul>

                      <button
                        type="button"
                        className="invite"
                        onClick={() => setShowInviteModal(true)}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          padding: "10px 22px",
                          borderRadius: "30px",
                          fontWeight: "600",
                          fontSize: "14px",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
                          transition: "background 0.2s ease, transform 0.1s ease",
                        }}
                      >
                        <i className="icofont-paper-plane"></i> Invite Colleagues
                      </button>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <ul
                    className="nav nav-tabs post-detail-btn"
                    style={{
                      borderBottom: "none",
                      display: "flex",
                      gap: "10px",
                      margin: 0,
                    }}
                  >
                    <li className="nav-item">
                      <button
                        type="button"
                        className={activeTab === "overview" ? "active" : ""}
                        onClick={() => setActiveTab("overview")}
                        style={{
                          padding: "10px 24px",
                          border: "none",
                          background: activeTab === "overview" ? "#2563eb" : "rgba(255,255,255,0.15)",
                          color: "#fff",
                          fontWeight: "600",
                          borderRadius: "8px 8px 0 0",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Overview
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={activeTab === "departments" ? "active" : ""}
                        onClick={() => setActiveTab("departments")}
                        style={{
                          padding: "10px 24px",
                          border: "none",
                          background: activeTab === "departments" ? "#2563eb" : "rgba(255,255,255,0.15)",
                          color: "#fff",
                          fontWeight: "600",
                          borderRadius: "8px 8px 0 0",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Departments ({DEFAULT_DEPARTMENTS.length})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={activeTab === "members" ? "active" : ""}
                        onClick={() => setActiveTab("members")}
                        style={{
                          padding: "10px 24px",
                          border: "none",
                          background: activeTab === "members" ? "#2563eb" : "rgba(255,255,255,0.15)",
                          color: "#fff",
                          fontWeight: "600",
                          borderRadius: "8px 8px 0 0",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Members ({members.length})
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Layout */}
      <section style={{ backgroundColor: "#f8fafc", padding: "40px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div id="page-contents" className="row merged20">
                {/* Left Column - Tab Contents */}
                <div className="col-lg-8">
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === "overview" && (
                    <div className="tab-pane-content">
                      {/* University Information Card */}
                      <div className="main-wraper" style={{ background: "#fff", borderRadius: "14px", padding: "24px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                        <h4 className="main-title" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                          University Information
                        </h4>
                        <div className="uni-info">
                          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ display: "flex", marginBottom: "14px", borderBottom: "1px dashed #f1f5f9", paddingBottom: "10px" }}>
                              <span style={{ width: "160px", fontWeight: "600", color: "#64748b" }}>Address</span>
                              <p style={{ margin: 0, color: "#1e293b", fontWeight: "500" }}>Dumlupınar Bulvarı, 07058, Antalya, Turkey</p>
                            </li>
                            <li style={{ display: "flex", marginBottom: "14px", borderBottom: "1px dashed #f1f5f9", paddingBottom: "10px" }}>
                              <span style={{ width: "160px", fontWeight: "600", color: "#64748b" }}>Head Of Institute</span>
                              <p style={{ margin: 0, color: "#1e293b", fontWeight: "500" }}>Prof. Dr. Mustafa ÜNAL</p>
                            </li>
                            <li style={{ display: "flex", marginBottom: "14px", borderBottom: "1px dashed #f1f5f9", paddingBottom: "10px" }}>
                              <span style={{ width: "160px", fontWeight: "600", color: "#64748b" }}>Official Website</span>
                              <p style={{ margin: 0 }}>
                                <a href="http://www.akdeniz.edu.tr" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline", fontWeight: "500" }}>
                                  http://www.akdeniz.edu.tr
                                </a>
                              </p>
                            </li>
                            <li style={{ display: "flex", marginBottom: "14px", borderBottom: "1px dashed #f1f5f9", paddingBottom: "10px" }}>
                              <span style={{ width: "160px", fontWeight: "600", color: "#64748b" }}>Phone Number</span>
                              <p style={{ margin: 0, color: "#1e293b", fontWeight: "500" }}>
                                <a href="tel:+902422274400" style={{ color: "#1e293b" }}>+90 242 2274400</a>
                              </p>
                            </li>
                            <li style={{ display: "flex" }}>
                              <span style={{ width: "160px", fontWeight: "600", color: "#64748b" }}>Fax</span>
                              <p style={{ margin: 0, color: "#1e293b", fontWeight: "500" }}>+90 242 2275540</p>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Departments Preview Card */}
                      <div className="main-wraper" style={{ background: "#fff", borderRadius: "14px", padding: "24px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                          <h4 className="main-title" style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
                            Departments
                          </h4>
                          <button
                            type="button"
                            onClick={() => setActiveTab("departments")}
                            style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
                          >
                            View All ({DEFAULT_DEPARTMENTS.length}) &rarr;
                          </button>
                        </div>
                        <div className="dept-info">
                          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {DEFAULT_DEPARTMENTS.slice(0, 3).map((dept) => (
                              <li
                                key={dept.id}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "12px 14px",
                                  background: "#f8fafc",
                                  borderRadius: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <h6 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
                                  {dept.name}
                                </h6>
                                <span style={{ fontSize: "13px", color: "#64748b", background: "#e2e8f0", padding: "4px 10px", borderRadius: "20px", fontWeight: "500" }}>
                                  Members <i style={{ fontStyle: "normal", fontWeight: "700", color: "#0f172a" }}>{dept.membersCount}</i>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Members Preview Card */}
                      <div className="main-wraper" style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                          <h4 className="main-title" style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>
                            Featured Faculty &amp; Members <span style={{ color: "#64748b", fontSize: "15px", fontWeight: "400" }}>({members.length})</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => setActiveTab("members")}
                            style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}
                          >
                            View All &rarr;
                          </button>
                        </div>
                        <div className="row merged-10">
                          {members.slice(0, 4).map((member) => (
                            <div key={member.id} className="col-lg-3 col-md-6 col-sm-6 mb-3">
                              <div
                                className="members"
                                style={{
                                  background: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "12px",
                                  padding: "16px 12px",
                                  textAlign: "center",
                                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                }}
                              >
                                <figure
                                  style={{
                                    margin: "0 auto 10px",
                                    width: "68px",
                                    height: "68px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "2px solid #3b82f6",
                                  }}
                                >
                                  <img
                                    alt={member.name}
                                    src={member.avatar}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                </figure>
                                <span style={{ display: "block", fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>
                                  {member.name}
                                </span>
                                <ins
                                  style={{
                                    display: "block",
                                    textDecoration: "none",
                                    color: "#64748b",
                                    fontSize: "12px",
                                    margin: "4px 0 12px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {member.department}
                                </ins>
                                <button
                                  type="button"
                                  onClick={() => handleToggleMemberFollow(member.id, member.userId)}
                                  style={{
                                    background: member.isFollowing ? "#e2e8f0" : "#2563eb",
                                    color: member.isFollowing ? "#334155" : "#fff",
                                    border: "none",
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <i className="icofont-star"></i> {member.isFollowing ? "Following" : "Follow"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DEPARTMENTS */}
                  {activeTab === "departments" && (
                    <div className="main-wraper" style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
                        <div>
                          <h4 className="main-title" style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
                            University Departments
                          </h4>
                          <span style={{ fontSize: "14px", color: "#64748b" }}>Browse academic faculties and departments</span>
                        </div>
                        <div style={{ position: "relative", minWidth: "260px" }}>
                          <input
                            type="text"
                            placeholder="Search department..."
                            value={departmentSearch}
                            onChange={(e) => setDepartmentSearch(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px 14px 8px 36px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "14px",
                            }}
                          />
                          <i className="icofont-search" style={{ position: "absolute", left: "12px", top: "11px", color: "#94a3b8" }}></i>
                        </div>
                      </div>

                      <div className="dept-info">
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {filteredDepartments.map((dept) => (
                            <li
                              key={dept.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "16px 18px",
                                background: "#f8fafc",
                                borderRadius: "10px",
                                marginBottom: "12px",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <div>
                                <h6 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                                  {dept.name}
                                </h6>
                                <span style={{ fontSize: "12px", color: "#64748b", textTransform: "capitalize" }}>
                                  Category: {dept.category}
                                </span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "13px", color: "#475569", background: "#e2e8f0", padding: "6px 14px", borderRadius: "20px", fontWeight: "500" }}>
                                  Members <strong style={{ color: "#0f172a" }}>{dept.membersCount}</strong>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDeptFilter(dept.name);
                                    setActiveTab("members");
                                  }}
                                  style={{
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    border: "1px solid #bfdbfe",
                                    borderRadius: "8px",
                                    padding: "6px 12px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                  }}
                                >
                                  View Members
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: MEMBERS */}
                  {activeTab === "members" && (
                    <div className="main-wraper" style={{ background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
                        <div>
                          <h4 className="main-title" style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
                            Faculty &amp; Members ({filteredMembers.length})
                          </h4>
                          <span style={{ fontSize: "14px", color: "#64748b" }}>Explore professors, researchers, and university fellows</span>
                        </div>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          {selectedDeptFilter !== "all" && (
                            <button
                              type="button"
                              onClick={() => setSelectedDeptFilter("all")}
                              style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              Clear Filter &times;
                            </button>
                          )}
                          <div style={{ position: "relative", minWidth: "220px" }}>
                            <input
                              type="text"
                              placeholder="Search member..."
                              value={memberSearch}
                              onChange={(e) => setMemberSearch(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "8px 14px 8px 34px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                              }}
                            />
                            <i className="icofont-search" style={{ position: "absolute", left: "10px", top: "10px", color: "#94a3b8" }}></i>
                          </div>
                        </div>
                      </div>

                      <div className="row merged-10">
                        {filteredMembers.map((member) => (
                          <div key={member.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                            <div
                              className="members"
                              style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "16px 10px",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <figure
                                  style={{
                                    margin: "0 auto 10px",
                                    width: "72px",
                                    height: "72px",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "2px solid #3b82f6",
                                  }}
                                >
                                  <img
                                    alt={member.name}
                                    src={member.avatar}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                </figure>
                                <span style={{ display: "block", fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>
                                  {member.name}
                                </span>
                                <ins
                                  style={{
                                    display: "block",
                                    textDecoration: "none",
                                    color: "#64748b",
                                    fontSize: "12px",
                                    margin: "4px 0 12px",
                                    lineHeight: "1.3",
                                  }}
                                >
                                  {member.department}
                                </ins>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleMemberFollow(member.id, member.userId)}
                                style={{
                                  background: member.isFollowing ? "#e2e8f0" : "#2563eb",
                                  color: member.isFollowing ? "#334155" : "#fff",
                                  border: "none",
                                  padding: "6px 14px",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <i className="icofont-star"></i> {member.isFollowing ? "Following" : "Follow"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Sidebar Widgets */}
                <div className="col-lg-4">
                  <aside className="sidebar static right">
                    {/* Post Analytics Widget */}
                    <div className="widget" style={{ background: "#fff", borderRadius: "14px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <h4 className="widget-title" style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                        Post Analytics
                      </h4>
                      <ul className="widget-analytics" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        <li style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #f1f5f9", fontSize: "14px", color: "#475569" }}>
                          <span>Reads</span> <strong style={{ color: "#0f172a" }}>56</strong>
                        </li>
                        <li style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #f1f5f9", fontSize: "14px", color: "#475569" }}>
                          <span>Recommendations</span> <strong style={{ color: "#0f172a" }}>3</strong>
                        </li>
                        <li style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed #f1f5f9", fontSize: "14px", color: "#475569" }}>
                          <span>Shares</span> <strong style={{ color: "#0f172a" }}>22</strong>
                        </li>
                        <li style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px", color: "#475569" }}>
                          <span>References</span> <strong style={{ color: "#0f172a" }}>17</strong>
                        </li>
                      </ul>
                    </div>

                    {/* Ask Research Question Widget */}
                    <div className="widget" style={{ background: "#fff", borderRadius: "14px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <h4 className="widget-title" style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                        Ask Research Question?
                      </h4>
                      <div className="ask-question" style={{ textAlign: "center", padding: "10px 0" }}>
                        <i className="icofont-question-circle" style={{ fontSize: "42px", color: "#2563eb", marginBottom: "10px", display: "block" }}></i>
                        <h6 style={{ fontSize: "14px", color: "#475569", fontWeight: "500", lineHeight: "1.5", marginBottom: "16px" }}>
                          Ask questions in Q&amp;A to get help from experts and researchers in your field.
                        </h6>
                        <button
                          type="button"
                          className="ask-qst"
                          onClick={() => setShowQuestionModal(true)}
                          style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "8px 20px",
                            borderRadius: "20px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(37,99,235,0.25)",
                          }}
                        >
                          Ask a question
                        </button>
                      </div>
                    </div>

                    {/* Explore Events Widget */}
                    <div className="widget" style={{ background: "#fff", borderRadius: "14px", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                        <h4 className="widget-title" style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
                          Explore Events
                        </h4>
                        <Link href="/events" style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600" }}>
                          See All
                        </Link>
                      </div>
                      <div
                        className="rec-events bg-purple"
                        style={{
                          background: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
                          borderRadius: "10px",
                          padding: "14px",
                          color: "#fff",
                          marginBottom: "12px",
                          position: "relative",
                        }}
                      >
                        <i className="icofont-gift" style={{ fontSize: "20px", marginBottom: "6px", display: "block" }}></i>
                        <h6 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "600" }}>
                          <Link href="/events" style={{ color: "#fff" }}>
                            BZ University good night event in columbia
                          </Link>
                        </h6>
                        <span style={{ fontSize: "12px", opacity: 0.9 }}>Upcoming • 18:00 EST</span>
                      </div>
                      <div
                        className="rec-events bg-blue"
                        style={{
                          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                          borderRadius: "10px",
                          padding: "14px",
                          color: "#fff",
                          position: "relative",
                        }}
                      >
                        <i className="icofont-microphone" style={{ fontSize: "20px", marginBottom: "6px", display: "block" }}></i>
                        <h6 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "600" }}>
                          <Link href="/events" style={{ color: "#fff" }}>
                            The 3rd International Conference 2026
                          </Link>
                        </h6>
                        <span style={{ fontSize: "12px", opacity: 0.9 }}>Academic Symposium</span>
                      </div>
                    </div>

                    {/* Who's Following Widget */}
                    <div className="widget stick-widget" style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <h4 className="widget-title" style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
                        Who&apos;s following
                      </h4>
                      <ul className="followers" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {followers.map((fol) => (
                          <li
                            key={fol.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "14px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <figure
                                style={{
                                  margin: 0,
                                  width: "42px",
                                  height: "42px",
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  alt={fol.name}
                                  src={fol.avatar}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </figure>
                              <div className="friend-meta">
                                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
                                  <span style={{ color: "#1e293b" }}>{fol.name}</span>
                                </h4>
                                <span style={{ fontSize: "12px", color: "#64748b" }}>{fol.subtitle}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleSidebarFollower(fol.id)}
                              style={{
                                background: fol.isFollowing ? "#f1f5f9" : "none",
                                border: fol.isFollowing ? "1px solid #cbd5e1" : "none",
                                color: fol.isFollowing ? "#475569" : "#2563eb",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                padding: "4px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              {fol.isFollowing ? "Following" : "Follow"}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL 1: Invite Colleagues */}
      {showInviteModal && (
        <div
          className="wraper-invite active"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="popup"
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "520px",
              width: "90%",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              position: "relative",
            }}
          >
            <button
              type="button"
              className="popup-closed"
              onClick={() => {
                setShowInviteModal(false);
                setInviteStatus(null);
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              <i className="icofont-close"></i>
            </button>

            <div className="popup-meta">
              <div className="popup-head" style={{ marginBottom: "16px" }}>
                <h5 style={{ margin: 0, fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                  <i className="icofont-brand-slideshare" style={{ color: "#2563eb", fontSize: "24px" }}></i> Invite Colleagues
                </h5>
              </div>
              <div className="invitation-meta">
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
                  Enter an email address to invite a colleague or co-author to join you on Socimo and connect with Akdeniz University. They will receive an invitation link.
                </p>

                {inviteStatus && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      background: inviteStatus.type === "success" ? "#dcfce7" : "#fee2e2",
                      color: inviteStatus.type === "success" ? "#15803d" : "#b91c1c",
                      border: `1px solid ${inviteStatus.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    }}
                  >
                    {inviteStatus.text}
                  </div>
                )}

                <form onSubmit={handleInviteSubmit} className="c-form">
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                      Colleague&apos;s Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. colleague@university.edu"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                      Colleague&apos;s Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Jane Watson"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                      Personal Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Hi! Join me on Socimo to collaborate on research and publications..."
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      style={{
                        padding: "10px 20px",
                        background: "#f1f5f9",
                        color: "#475569",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isInviting}
                      className="main-btn"
                      style={{
                        padding: "10px 24px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: isInviting ? "not-allowed" : "pointer",
                        opacity: isInviting ? 0.7 : 1,
                      }}
                    >
                      {isInviting ? "Sending..." : "Send Invitation"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Ask Research Question */}
      {showQuestionModal && (
        <div
          className="new-question-popup active"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="popup"
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "560px",
              width: "90%",
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              position: "relative",
            }}
          >
            <button
              type="button"
              className="popup-closed"
              onClick={() => setShowQuestionModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              <i className="icofont-close"></i>
            </button>

            <div className="popup-head" style={{ marginBottom: "18px" }}>
              <h5 style={{ margin: 0, fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="icofont-question-circle" style={{ color: "#2563eb", fontSize: "24px" }}></i> Ask Research Question
              </h5>
            </div>

            {questionSubmitted ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <i className="icofont-check-circled" style={{ fontSize: "52px", color: "#16a34a", marginBottom: "14px", display: "block" }}></i>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a", fontWeight: "700" }}>Question Submitted!</h4>
                <p style={{ color: "#64748b", margin: 0 }}>Faculty and research experts will review and answer your inquiry shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleQuestionSubmit} className="c-form">
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                    Question Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. What are the latest developments in nanofluid thermal conductivity?"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                    Field / Question Type
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      background: "#fff",
                    }}
                  >
                    <option value="Research">Research</option>
                    <option value="Article">Article</option>
                    <option value="Book">Book</option>
                    <option value="Chapter">Chapter</option>
                    <option value="Code">Code / Implementation</option>
                    <option value="Conference Paper">Conference Paper</option>
                    <option value="Data">Dataset Inquiry</option>
                    <option value="Experiment Finding">Experiment Finding</option>
                    <option value="Method">Methodology</option>
                    <option value="Thesis">Thesis / Dissertation</option>
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
                    Question Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details, background literature, hypotheses, or context for the community..."
                    value={questionBody}
                    onChange={(e) => setQuestionBody(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(false)}
                    style={{
                      padding: "10px 20px",
                      background: "#f1f5f9",
                      color: "#475569",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="main-btn"
                    style={{
                      padding: "10px 24px",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Post Question
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Share Profile */}
      {showShareModal && (
        <div
          className="share-wraper active"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="share-options"
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "480px",
              width: "90%",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              position: "relative",
            }}
          >
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowShareModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              <i className="icofont-close"></i>
            </button>

            <h5 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="icofont-share-alt" style={{ color: "#2563eb" }}></i> Share University Profile
            </h5>

            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
              Share Akdeniz University with your colleagues, networks, or social circles:
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : "http://localhost:3000/about-university"}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "13px",
                  background: "#f8fafc",
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Profile URL copied to clipboard!");
                  }
                }}
                style={{
                  padding: "10px 16px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Copy
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
              <a
                href="https://www.facebook.com/sharer/sharer.php"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#1877f2",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                <i className="icofont-facebook"></i>
              </a>
              <a
                href="https://twitter.com/intent/tweet"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#0ea5e9",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                <i className="icofont-twitter"></i>
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#0a66c2",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                <i className="icofont-linkedin"></i>
              </a>
              <a
                href="https://api.whatsapp.com/send"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#22c55e",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                <i className="icofont-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottombar & Mockup */}
      <figure className="bottom-mockup" style={{ margin: 0, textAlign: "center" }}>
        <img src="/images/footer.png" alt="" style={{ maxWidth: "100%" }} />
      </figure>
      <div className="bottombar" style={{ background: "#0f172a", padding: "18px 0", color: "#94a3b8", textAlign: "center", fontSize: "14px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span>&copy; {new Date().getFullYear()} All rights reserved by Socimo.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
