"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo } from "react";
import type { ChatConversationDto } from "@/lib/services/authApi";

type HeaderSideSlideProps = {
  activeTab: "messages" | "notifications";
  conversations: ChatConversationDto[];
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: "messages" | "notifications") => void;
};

type NotificationItem = {
  id: string;
  image: string;
  name: string;
  message: string;
};

const fallbackNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    image: "/images/resources/user5.jpg",
    name: "Alis wells",
    message: "recommend your post",
  },
  {
    id: "notif-2",
    image: "/images/resources/user4.jpg",
    name: "Alis wells",
    message: "share your post a good time today!",
  },
  {
    id: "notif-3",
    image: "/images/resources/user2.jpg",
    name: "Alis wells",
    message: "recommend your post",
  },
  {
    id: "notif-4",
    image: "/images/resources/user1.jpg",
    name: "Alis wells",
    message: "share your post a good time today!",
  },
  {
    id: "notif-5",
    image: "/images/resources/user3.jpg",
    name: "Alis wells",
    message: "recommend your post",
  },
];

function getConversationHref(conversationId: string) {
  return `/messages?conversation=${encodeURIComponent(conversationId)}`;
}

function formatConversationPreview(conversation: ChatConversationDto) {
  const lastMessage = String(conversation.lastMessageText || "").trim();
  return lastMessage || "Open this conversation";
}

export default function HeaderSideSlide({
  activeTab,
  conversations,
  isOpen,
  onClose,
  onTabChange,
}: HeaderSideSlideProps) {
  const previewConversations = useMemo(() => {
    return conversations.slice(0, 5);
  }, [conversations]);

  return (
    <div className={`side-slide ${isOpen ? "active" : ""}`.trim()}>
      <span className="popup-closed side-slide-close" onClick={onClose} role="button" tabIndex={0} onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClose();
        }
      }}>
        <i className="icofont-close"></i>
      </span>
      <div className="slide-meta">
        <ul className="nav nav-tabs slide-btns">
          <li className="nav-item">
            <a
              className={activeTab === "messages" ? "active" : ""}
              href="#messages"
              data-toggle="tab"
              onClick={(event) => {
                event.preventDefault();
                onTabChange("messages");
              }}
            >
              Messages
            </a>
          </li>
          <li className="nav-item">
            <a
              className={activeTab === "notifications" ? "active" : ""}
              href="#notifications"
              data-toggle="tab"
              onClick={(event) => {
                event.preventDefault();
                onTabChange("notifications");
              }}
            >
              Notifications
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div className={`tab-pane fade ${activeTab === "messages" ? "active show" : ""}`.trim()} id="messages">
            <h4><i className="icofont-envelope"></i> messages</h4>
            <Link href="/messages" className="send-mesg" title="New Message" data-toggle="tooltip" onClick={onClose}>
              <i className="icofont-edit"></i>
            </Link>
            <ul className="new-messages">
              {previewConversations.map((conversation) => (
                <li key={conversation.conversationId}>
                  <Link
                    href={getConversationHref(conversation.conversationId)}
                    title="Open messages"
                    style={{ display: "inline-block", verticalAlign: "top" }}
                    onClick={onClose}
                  >
                    <figure><img src={conversation.participant.avatarUrl} alt={conversation.participant.name} /></figure>
                  </Link>
                  <div className="mesg-info">
                    <span>{conversation.participant.name}</span>
                    <Link href={getConversationHref(conversation.conversationId)} title="Open messages" onClick={onClose}>
                      {formatConversationPreview(conversation)}
                    </Link>
                  </div>
                </li>
              ))}
              {previewConversations.length === 0 ? (
                <li>
                  <figure><img src="/images/resources/user.jpg" alt="No conversations" /></figure>
                  <div className="mesg-info">
                    <span>No messages yet</span>
                    <Link href="/messages" title="Open messages" onClick={onClose}>
                      Open messages to start a conversation
                    </Link>
                  </div>
                </li>
              ) : null}
            </ul>
            <Link href="/messages" title="View all messages" className="main-btn" data-ripple="" onClick={onClose}>
              view all
            </Link>
          </div>
          <div className={`tab-pane fade ${activeTab === "notifications" ? "active show" : ""}`.trim()} id="notifications">
            <h4><i className="icofont-bell-alt"></i> notifications</h4>
            <ul className="notificationz">
              {fallbackNotifications.map((notification) => (
                <li key={notification.id}>
                  <figure><img src={notification.image} alt={notification.name} /></figure>
                  <div className="mesg-info">
                    <span>{notification.name}</span>
                    <a href="#" title="" onClick={(event) => event.preventDefault()}>{notification.message}</a>
                  </div>
                </li>
              ))}
            </ul>
            <a href="#" title="" className="main-btn" data-ripple="" onClick={(event) => event.preventDefault()}>
              view all
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
