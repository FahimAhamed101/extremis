"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function MessagesPage() {
  const [activeContactId, setActiveContactId] = useState(1);
  const [contacts, setContacts] = useState([
    { id: 1, name: "Oliver Queen", avatar: "/images/resources/friend-avatar.jpg", status: "online", lastSeen: "Active now" },
    { id: 2, name: "Sarah Jenkins", avatar: "/images/resources/friend-avatar2.jpg", status: "online", lastSeen: "Active 5m ago" },
    { id: 3, name: "Andrew Peeter", avatar: "/images/resources/friend-avatar3.jpg", status: "away", lastSeen: "Away" },
    { id: 4, name: "Mikaly Carter", avatar: "/images/resources/friend-avatar4.jpg", status: "offline", lastSeen: "Offline" },
    { id: 5, name: "Elena Rostova", avatar: "/images/resources/friend-avatar5.jpg", status: "online", lastSeen: "Active now" },
  ]);

  const [messageThreads, setMessageThreads] = useState<Record<number, Array<{ sender: "me" | "them"; text: string; time: string }>>>({
    1: [
      { sender: "them", text: "Hey Danial! Did you review the biotechnology dataset we posted?", time: "10:30 AM" },
      { sender: "me", text: "Yes Oliver! The statistical correlations look very promising.", time: "10:32 AM" },
      { sender: "them", text: "Awesome, should we present this at next week's symposium?", time: "10:35 AM" },
      { sender: "me", text: "Absolutely. I've prepared the slides and shared them in the group feed.", time: "10:36 AM" },
    ],
    2: [
      { sender: "them", text: "Hello! Quick question regarding the new research paper guidelines.", time: "Yesterday" },
      { sender: "me", text: "Sure Sarah, feel free to send the draft over.", time: "Yesterday" },
    ],
  });

  const [newMessageText, setNewMessageText] = useState("");

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];
  const activeThread = messageThreads[activeContact.id] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg = {
      sender: "me" as const,
      text: newMessageText.trim(),
      time: "Just now",
    };

    setMessageThreads((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    setNewMessageText("");

    // Simulate friendly auto-reply
    setTimeout(() => {
      setMessageThreads((prev) => ({
        ...prev,
        [activeContact.id]: [
          ...(prev[activeContact.id] || []),
          { sender: "them", text: "Got it! Thanks for keeping me updated.", time: "Just now" },
        ],
      }));
    }, 1200);
  };

  return (
    <DashboardLayout pageTitle="Messages" breadcrumb="Messages Inbox">
      <h4 className="main-title" style={{ marginBottom: "20px" }}>Chat & Messages Inbox</h4>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #edf2f6",
          overflow: "hidden",
          display: "flex",
          minHeight: "640px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        {/* Left Contacts Sidebar */}
        <div style={{ width: "300px", borderRight: "1px solid #edf2f6", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #edf2f6" }}>
            <h5 style={{ margin: "0 0 12px 0", fontWeight: 700, fontSize: "16px" }}>Conversations</h5>
            <input
              type="text"
              placeholder="Search chat..."
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "20px",
                border: "1px solid #e1e8ed",
                fontSize: "12px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {contacts.map((c) => {
              const isActive = c.id === activeContactId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveContactId(c.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 20px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f8f9fa",
                    background: isActive ? "#e8f4fd" : "transparent",
                    transition: "background 0.2s ease",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={c.avatar}
                      alt={c.name}
                      style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        border: "2px solid #fff",
                        background:
                          c.status === "online" ? "#28a745" : c.status === "away" ? "#ffc107" : "#adb5bd",
                      }}
                    ></span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h6 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.name}
                    </h6>
                    <span style={{ fontSize: "12px", color: "#888" }}>{c.lastSeen}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div
            style={{
              padding: "14px 24px",
              borderBottom: "1px solid #edf2f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fafbfc",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                }}
              />
              <div>
                <h6 style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>{activeContact.name}</h6>
                <span style={{ fontSize: "11px", color: activeContact.status === "online" ? "#28a745" : "#888" }}>
                  ● {activeContact.lastSeen}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => alert(`Starting video call with ${activeContact.name}...`)}
                style={{
                  background: "transparent",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                <i className="icofont-video-cam"></i> Call
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: "24px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              background: "#fdfdfd",
            }}
          >
            <div style={{ textAlign: "center", margin: "10px 0" }}>
              <span style={{ fontSize: "11px", color: "#aaa", background: "#f0f4f8", padding: "4px 12px", borderRadius: "10px" }}>
                Encrypted Peer-to-Peer Conversation
              </span>
            </div>

            {activeThread.map((msg, i) => {
              const isMe = msg.sender === "me";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "12px 16px",
                      borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                      background: isMe ? "#088dcd" : "#edf2f6",
                      color: isMe ? "#fff" : "#222",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    <span
                      style={{
                        display: "block",
                        fontSize: "10px",
                        textAlign: "right",
                        marginTop: "4px",
                        opacity: isMe ? 0.8 : 0.6,
                      }}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #edf2f6",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#fff",
            }}
          >
            <input
              type="text"
              placeholder="Write your message..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "24px",
                border: "1px solid #e1e8ed",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#088dcd",
                color: "#fff",
                border: "none",
                borderRadius: "24px",
                padding: "10px 22px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Send <i className="icofont-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
