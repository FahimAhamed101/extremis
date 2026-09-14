"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventsList, setEventsList] = useState([
    {
      id: "1001",
      client: "Andrew",
      clientAvatar: "/images/resources/user1.jpg",
      eventName: "Developers Meetup 2026",
      venue: "Columbia University Campus",
      speakers: ["/images/resources/user1.jpg", "/images/resources/user2.jpg", "/images/resources/user3.jpg"],
      email: "andrew@socimo.com",
      status: "Upcoming",
      time: "10:00 AM",
      date: "Sep 28, 2026",
    },
    {
      id: "1002",
      client: "Sarah Jenkins",
      clientAvatar: "/images/resources/user2.jpg",
      eventName: "Global Biotech Symposium",
      venue: "Grand Science Hall",
      speakers: ["/images/resources/user4.jpg", "/images/resources/user5.jpg"],
      email: "sarah.j@biolab.org",
      status: "Live",
      time: "02:30 PM",
      date: "Sep 20, 2026",
    },
    {
      id: "1003",
      client: "Danial Cardos",
      clientAvatar: "/images/resources/user3.jpg",
      eventName: "Social Science Forum",
      venue: "Online Webinar (Zoom)",
      speakers: ["/images/resources/user6.jpg"],
      email: "cardos@research.net",
      status: "Upcoming",
      time: "04:00 PM",
      date: "Oct 05, 2026",
    },
    {
      id: "1004",
      client: "Elena Rostova",
      clientAvatar: "/images/resources/user4.jpg",
      eventName: "AI & Neural Networks Expo",
      venue: "Convention Center Hall B",
      speakers: ["/images/resources/user1.jpg", "/images/resources/user5.jpg"],
      email: "elena@techguild.ai",
      status: "Completed",
      time: "11:00 AM",
      date: "Aug 15, 2026",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [newDate, setNewDate] = useState("");

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newVenue.trim()) return;

    const newEvt = {
      id: String(1000 + eventsList.length + 1),
      client: "Danial Cardos",
      clientAvatar: "/images/resources/user.jpg",
      eventName: newEventName.trim(),
      venue: newVenue.trim(),
      speakers: ["/images/resources/user.jpg"],
      email: "danial@socimo.com",
      status: "Upcoming",
      time: "09:00 AM",
      date: newDate || "Nov 12, 2026",
    };

    setEventsList([newEvt, ...eventsList]);
    setNewEventName("");
    setNewVenue("");
    setNewDate("");
    setIsCreateOpen(false);
  };

  const filtered = eventsList.filter(
    (e) =>
      e.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Events" breadcrumb="Events">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h4 className="main-title" style={{ margin: 0 }}>Events Management</h4>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="main-btn"
          style={{
            background: "#088dcd",
            color: "#fff",
            border: "none",
            padding: "8px 18px",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <i className="icofont-plus"></i> Add New Event
        </button>
      </div>

      {/* 4 Event Metrics */}
      <div className="row merged20 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e8f4fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#088dcd" }}>
              <i className="icofont-calendar" style={{ fontSize: "20px" }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>140</h3>
              <span style={{ fontSize: "12px", color: "#888" }}>New Events</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e6f9ed", display: "flex", alignItems: "center", justifyContent: "center", color: "#28a745" }}>
              <i className="icofont-users-alt-2" style={{ fontSize: "20px" }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>1,200</h3>
              <span style={{ fontSize: "12px", color: "#888" }}>Registered Users</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fef6e7", display: "flex", alignItems: "center", justifyContent: "center", color: "#f1b44c" }}>
              <i className="icofont-ticket" style={{ fontSize: "20px" }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>4,021</h3>
              <span style={{ fontSize: "12px", color: "#888" }}>Tickets Sold</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="d-widget" style={{ background: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #edf2f6", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fde8ec", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc3545" }}>
              <i className="icofont-dollar" style={{ fontSize: "20px" }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "22px" }}>$14,400</h3>
              <span style={{ fontSize: "12px", color: "#888" }}>Total Earnings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="d-widget" style={{ background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid #edf2f6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h5 style={{ margin: 0, fontWeight: 700 }}>All Scheduled Events</h5>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "240px", padding: "6px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px" }}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #edf2f6", fontSize: "13px", textAlign: "left" }}>
                <th style={{ padding: "12px 10px" }}>ID#</th>
                <th style={{ padding: "12px 10px" }}>Organizer</th>
                <th style={{ padding: "12px 10px" }}>Event Name</th>
                <th style={{ padding: "12px 10px" }}>Venue</th>
                <th style={{ padding: "12px 10px" }}>Speakers</th>
                <th style={{ padding: "12px 10px" }}>Status</th>
                <th style={{ padding: "12px 10px" }}>Date & Time</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "13px" }}>
              {filtered.map((evt) => (
                <tr key={evt.id} style={{ borderBottom: "1px solid #edf2f6" }}>
                  <td style={{ padding: "12px 10px", fontWeight: 600, color: "#888" }}>{evt.id}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img
                        src={evt.clientAvatar}
                        alt={evt.client}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                        }}
                      />
                      <span>{evt.client}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px", fontWeight: 600, color: "#222" }}>{evt.eventName}</td>
                  <td style={{ padding: "12px 10px", color: "#666" }}>{evt.venue}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {evt.speakers.map((s, i) => (
                        <img
                          key={i}
                          src={s}
                          alt="speaker"
                          style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover", border: "1px solid #fff" }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                          }}
                        />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background:
                          evt.status === "Live"
                            ? "#e6f9ed"
                            : evt.status === "Upcoming"
                            ? "#e8f4fd"
                            : "#f2f5f8",
                        color:
                          evt.status === "Live"
                            ? "#28a745"
                            : evt.status === "Upcoming"
                            ? "#088dcd"
                            : "#666",
                      }}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px", color: "#555" }}>
                    {evt.date} • {evt.time}
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => alert(`Viewing details for ${evt.eventName}`)}
                      style={{
                        background: "transparent",
                        border: "1px solid #088dcd",
                        color: "#088dcd",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Event Modal */}
      {isCreateOpen && (
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
          }}
        >
          <div style={{ background: "#fff", borderRadius: "10px", padding: "24px", width: "480px", maxWidth: "90%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>Schedule New Event</h5>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. AI Research Keynote"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Venue / Link</label>
                <input
                  type="text"
                  placeholder="e.g. Columbia University or Zoom"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  required
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f8f9fa" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 20px", borderRadius: "6px", background: "#088dcd", color: "#fff", border: "none" }}
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
