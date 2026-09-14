"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  projects: number;
  tasks: number;
  rating: number;
  status: "active" | "away" | "offline";
}

const initialMembers: TeamMember[] = [
  {
    id: 1,
    name: "David son",
    role: "UI/UX Lead Designer",
    department: "Design",
    avatar: "/images/resources/team1.jpg",
    email: "david.son@socimo.io",
    projects: 14,
    tasks: 42,
    rating: 4.9,
    status: "active",
  },
  {
    id: 2,
    name: "Sarah K.",
    role: "Support Admin & Ops",
    department: "Support",
    avatar: "/images/resources/team2.jpg",
    email: "sarah.k@socimo.io",
    projects: 8,
    tasks: 19,
    rating: 4.8,
    status: "active",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Senior Project Manager",
    department: "Management",
    avatar: "/images/resources/team3.jpg",
    email: "m.chen@socimo.io",
    projects: 22,
    tasks: 68,
    rating: 5.0,
    status: "active",
  },
  {
    id: 4,
    name: "Emily Kate",
    role: "Public Relations Officer",
    department: "Marketing",
    avatar: "/images/resources/team4.jpg",
    email: "emily.kate@socimo.io",
    projects: 11,
    tasks: 31,
    rating: 4.7,
    status: "away",
  },
  {
    id: 5,
    name: "Olivia Mac",
    role: "Lead Frontend Engineer",
    department: "Engineering",
    avatar: "/images/resources/team5.jpg",
    email: "olivia.mac@socimo.io",
    projects: 19,
    tasks: 57,
    rating: 4.9,
    status: "active",
  },
  {
    id: 6,
    name: "Bob Frank",
    role: "Core Backend Architect",
    department: "Engineering",
    avatar: "/images/resources/team6.jpg",
    email: "bob.frank@socimo.io",
    projects: 16,
    tasks: 44,
    rating: 4.8,
    status: "active",
  },
  {
    id: 7,
    name: "Sapna Malhotra",
    role: "Product Growth Strategist",
    department: "Marketing",
    avatar: "/images/resources/team2.jpg",
    email: "sapna.m@socimo.io",
    projects: 13,
    tasks: 29,
    rating: 4.9,
    status: "offline",
  },
  {
    id: 8,
    name: "James Wilson",
    role: "DevOps & Cloud Engineer",
    department: "Engineering",
    avatar: "/images/resources/team1.jpg",
    email: "j.wilson@socimo.io",
    projects: 17,
    tasks: 51,
    rating: 4.8,
    status: "active",
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [filterDept, setFilterDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Member Form State
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    department: "Engineering",
    email: "",
    avatar: "/images/resources/team1.jpg",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredMembers = members.filter((m) => {
    const matchDept = filterDept === "all" || m.department.toLowerCase() === filterDept.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;

    const created: TeamMember = {
      id: Date.now(),
      name: newMember.name,
      role: newMember.role,
      department: newMember.department,
      avatar: newMember.avatar || "/images/resources/team1.jpg",
      email: newMember.email || `${newMember.name.toLowerCase().replace(/\s+/g, ".")}@socimo.io`,
      projects: 1,
      tasks: 5,
      rating: 5.0,
      status: "active",
    };

    setMembers([created, ...members]);
    setIsAddModalOpen(false);
    setNewMember({
      name: "",
      role: "",
      department: "Engineering",
      email: "",
      avatar: "/images/resources/team1.jpg",
    });
    showToast(`Team member ${created.name} added successfully!`);
  };

  const handleDeleteMember = (id: number, name: string) => {
    setMembers(members.filter((m) => m.id !== id));
    setActiveMenuId(null);
    showToast(`Removed ${name} from team.`);
  };

  return (
    <DashboardLayout pageTitle="Our Team" breadcrumb="Our Team">
      <div className="panel-content">
        {/* Toast */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              background: "#088dcd",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              zIndex: 9999,
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="icofont-check-circled" style={{ fontSize: "18px" }}></i>
            {toastMessage}
          </div>
        )}

        {/* Header Stats */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                  background: "rgba(8, 141, 205, 0.1)",
                  color: "#088dcd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                <i className="icofont-users-alt-2"></i>
              </div>
              <div>
                <span style={{ fontSize: "13px", color: "#888", display: "block" }}>Total Members</span>
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>{members.length}</h4>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                  background: "rgba(46, 204, 113, 0.1)",
                  color: "#2ecc71",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                <i className="icofont-check-circled"></i>
              </div>
              <div>
                <span style={{ fontSize: "13px", color: "#888", display: "block" }}>Active Now</span>
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>
                  {members.filter((m) => m.status === "active").length}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                  background: "rgba(243, 156, 18, 0.1)",
                  color: "#f39c12",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                <i className="icofont-chart-growth"></i>
              </div>
              <div>
                <span style={{ fontSize: "13px", color: "#888", display: "block" }}>Active Projects</span>
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>38</h4>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "10px",
                  background: "rgba(155, 89, 182, 0.1)",
                  color: "#9b59b6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                <i className="icofont-star"></i>
              </div>
              <div>
                <span style={{ fontSize: "13px", color: "#888", display: "block" }}>Avg. Team Score</span>
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>4.88</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "16px 20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            marginBottom: "24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Department Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["all", "Engineering", "Design", "Marketing", "Management", "Support"].map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.2s",
                  background: filterDept.toLowerCase() === dept.toLowerCase() ? "#088dcd" : "#f1f2f6",
                  color: filterDept.toLowerCase() === dept.toLowerCase() ? "#fff" : "#555",
                }}
              >
                {dept === "all" ? "All Departments" : dept}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "220px" }}>
              <input
                type="text"
                placeholder="Search member or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 14px 8px 36px",
                  border: "1px solid #e1e8ed",
                  borderRadius: "20px",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <i
                className="icofont-search"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                }}
              ></i>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                background: "#088dcd",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className="icofont-plus"></i> Add Member
            </button>
          </div>
        </div>

        {/* Members Grid */}
        <h4 className="main-title" style={{ marginBottom: "20px" }}>
          Team Directory ({filteredMembers.length})
        </h4>

        <div className="row merged-10">
          {/* Add Member Card */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div
              className="add-member"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                cursor: "pointer",
                border: "2px dashed #088dcd",
                background: "rgba(8, 141, 205, 0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "340px",
                borderRadius: "10px",
                marginBottom: "20px",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#088dcd",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  marginBottom: "12px",
                  boxShadow: "0 4px 14px rgba(8, 141, 205, 0.4)",
                }}
              >
                <i className="icofont-plus"></i>
              </div>
              <h5 style={{ fontWeight: 700, color: "#333", margin: "0 0 6px 0" }}>Add New Member</h5>
              <span style={{ fontSize: "13px", color: "#888" }}>Invite colleague to team</span>
            </div>
          </div>

          {/* Member Cards */}
          {filteredMembers.map((member) => (
            <div key={member.id} className="col-lg-3 col-md-6 col-sm-6">
              <div
                className="team"
                style={{
                  position: "relative",
                  background: "#fff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  marginBottom: "20px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                  <img
                    alt={member.name}
                    src={member.avatar}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Status Indicator */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      right: "12px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      background:
                        member.status === "active"
                          ? "#2ecc71"
                          : member.status === "away"
                          ? "#f39c12"
                          : "#95a5a6",
                    }}
                    title={member.status}
                  ></span>
                  {/* Department Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "rgba(0,0,0,0.65)",
                      backdropFilter: "blur(4px)",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {member.department}
                  </span>
                </div>

                <div className="team-info-sec" style={{ padding: "16px" }}>
                  <div className="team-info">
                    <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0" }}>
                      <a href="#" onClick={(e) => e.preventDefault()} style={{ color: "#333" }}>
                        {member.name}
                      </a>
                    </h3>
                    <span style={{ fontSize: "13px", color: "#088dcd", fontWeight: 500 }}>
                      {member.role}
                    </span>
                    <p style={{ fontSize: "12px", color: "#888", margin: "6px 0 12px 0" }}>
                      <i className="icofont-envelope" style={{ marginRight: "4px" }}></i>
                      {member.email}
                    </p>
                  </div>

                  {/* Member Stats */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #f1f2f6",
                      borderBottom: "1px solid #f1f2f6",
                      padding: "8px 0",
                      marginBottom: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "11px", color: "#999", display: "block" }}>Projects</span>
                      <strong style={{ fontSize: "14px", color: "#333" }}>{member.projects}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "11px", color: "#999", display: "block" }}>Tasks</span>
                      <strong style={{ fontSize: "14px", color: "#333" }}>{member.tasks}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "11px", color: "#999", display: "block" }}>Rating</span>
                      <strong style={{ fontSize: "14px", color: "#f39c12" }}>★ {member.rating}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => showToast(`Opening chat with ${member.name}...`)}
                      style={{
                        flex: 1,
                        background: "#f1f4f8",
                        border: "none",
                        padding: "6px 0",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#088dcd",
                        cursor: "pointer",
                      }}
                    >
                      <i className="icofont-speech-comments" style={{ marginRight: "4px" }}></i> Message
                    </button>
                    <button
                      onClick={() => showToast(`Sent email link to ${member.email}`)}
                      style={{
                        flex: 1,
                        background: "#f1f4f8",
                        border: "none",
                        padding: "6px 0",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#555",
                        cursor: "pointer",
                      }}
                    >
                      <i className="icofont-email" style={{ marginRight: "4px" }}></i> Email
                    </button>
                  </div>
                </div>

                {/* More Options Dropdown */}
                <div
                  className="more-opt"
                  style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}
                >
                  <span
                    onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.9)",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  >
                    <i className="icofont-dotted-down" style={{ color: "#333" }}></i>
                  </span>

                  {activeMenuId === member.id && (
                    <ul
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "35px",
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                        listStyle: "none",
                        padding: "6px 0",
                        margin: 0,
                        width: "120px",
                        zIndex: 20,
                      }}
                    >
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast(`Edit details for ${member.name}`);
                            setActiveMenuId(null);
                          }}
                          style={{
                            display: "block",
                            padding: "6px 12px",
                            fontSize: "13px",
                            color: "#333",
                            textDecoration: "none",
                          }}
                        >
                          <i className="icofont-pen-alt-1" style={{ marginRight: "6px" }}></i> Edit
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast(`${member.name} permissions toggled.`);
                            setActiveMenuId(null);
                          }}
                          style={{
                            display: "block",
                            padding: "6px 12px",
                            fontSize: "13px",
                            color: "#e67e22",
                            textDecoration: "none",
                          }}
                        >
                          <i className="icofont-ban" style={{ marginRight: "6px" }}></i> Suspend
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteMember(member.id, member.name);
                          }}
                          style={{
                            display: "block",
                            padding: "6px 12px",
                            fontSize: "13px",
                            color: "#e74c3c",
                            textDecoration: "none",
                          }}
                        >
                          <i className="icofont-trash" style={{ marginRight: "6px" }}></i> Delete
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Member Modal */}
        {isAddModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              backdropFilter: "blur(3px)",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "480px",
                padding: "24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: "18px" }}>Add New Team Member</h5>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddMember}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Department
                  </label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. alex.morgan@socimo.io"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                    Select Avatar
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["team1.jpg", "team2.jpg", "team3.jpg", "team4.jpg", "team5.jpg", "team6.jpg"].map((pic) => (
                      <img
                        key={pic}
                        src={`/images/resources/${pic}`}
                        alt=""
                        onClick={() => setNewMember({ ...newMember, avatar: `/images/resources/${pic}` })}
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          cursor: "pointer",
                          objectFit: "cover",
                          border:
                            newMember.avatar === `/images/resources/${pic}`
                              ? "3px solid #088dcd"
                              : "2px solid transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      background: "#f8f9fa",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 20px",
                      border: "none",
                      borderRadius: "6px",
                      background: "#088dcd",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
