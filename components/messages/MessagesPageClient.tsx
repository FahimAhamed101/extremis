"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { skipToken } from "@reduxjs/toolkit/query";
import type { FormEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { clearAuthSession } from "@/lib/auth/client";
import type {
  ChatConversationDto,
  ChatParticipantDto,
} from "@/lib/services/authApi";
import {
  useGetChatContactsQuery,
  useGetChatConversationsQuery,
  useGetChatMessagesQuery,
  useGetCurrentUserQuery,
  useGetOrCreateChatConversationMutation,
  useMarkChatConversationReadMutation,
  useSendChatMessageMutation,
} from "@/lib/services/authApi";

type ChatHeaderItem = ChatParticipantDto & {
  conversationId: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

function formatConversationDate(value?: string | null) {
  const source = value ? new Date(value) : new Date();
  if (Number.isNaN(source.getTime())) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(source);
}

function formatLastSeenLabel(participant?: ChatParticipantDto | null, conversation?: ChatConversationDto | null) {
  if (participant?.localTime) {
    return `last seen on today at ${participant.localTime}`;
  }

  const source = conversation?.lastMessageAt ? new Date(conversation.lastMessageAt) : null;
  if (!source || Number.isNaN(source.getTime())) {
    return "last seen recently";
  }

  return `last seen on ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(source)}`;
}

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "error" in error &&
    typeof error.error === "string" &&
    error.error.trim()
  ) {
    return error.error;
  }

  return "Unable to complete the chat action.";
}

function toProfileValue(value: string | null | undefined, fallback = "Not added") {
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

export default function MessagesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    data: currentUserResponse,
    isLoading: isCurrentUserLoading,
  } = useGetCurrentUserQuery();
  const {
    data: conversationsResponse,
    isLoading: isConversationsLoading,
  } = useGetChatConversationsQuery(
    { page: 1, limit: 50 },
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const { data: contactsResponse, isLoading: isContactsLoading } = useGetChatContactsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [getOrCreateConversation, { isLoading: isCreatingConversation }] =
    useGetOrCreateChatConversationMutation();
  const [sendChatMessage, { isLoading: isSendingMessage }] = useSendChatMessageMutation();
  const [markChatConversationRead] = useMarkChatConversationReadMutation();

  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const messageListRef = useRef<HTMLUListElement | null>(null);

  const currentUser = currentUserResponse?.user ?? null;
  const currentUserId = String(currentUser?.id || "").trim();
  const conversations = (conversationsResponse?.data ?? []).filter(
    (conversation) =>
      String(conversation.participant.id || "").trim() &&
      String(conversation.participant.id || "").trim() !== currentUserId
  );
  const contacts = contactsResponse?.data ?? [];
  const requestedConversationId = String(searchParams?.get("conversation") || "").trim();

  const headerItems: ChatHeaderItem[] = [
    ...conversations.map((conversation) => ({
      ...conversation.participant,
      conversationId: conversation.conversationId,
      lastMessageAt: conversation.lastMessageAt,
      unreadCount: conversation.unreadCount,
    })),
    ...contacts
      .filter(
        (contact) =>
          String(contact.id || "").trim() &&
          String(contact.id || "").trim() !== currentUserId &&
          !conversations.some((conversation) => conversation.participant.id === contact.id)
      )
      .map((contact) => ({
        ...contact,
        conversationId: contact.conversationId ?? null,
        lastMessageAt: null,
        unreadCount: 0,
      })),
  ];

  const selectedConversation =
    conversations.find((conversation) => conversation.conversationId === selectedConversationId) || null;
  const selectedParticipant =
    selectedConversation?.participant ||
    headerItems.find((item) => item.id === selectedParticipantId) ||
    null;

  const {
    data: messagesResponse,
    error: messagesError,
    isFetching: isMessagesFetching,
  } = useGetChatMessagesQuery(
    selectedParticipant
      ? {
          conversationId: selectedConversationId || "new",
          recipientId: selectedParticipant?.id,
          limit: 200,
        }
      : skipToken,
    {
      pollingInterval: selectedConversationId ? 5000 : 0,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const messages = messagesResponse?.data ?? [];
  const isBusy = isCreatingConversation || isSendingMessage;
  const showLoadingState = isCurrentUserLoading || isConversationsLoading || isContactsLoading;
  const resolvedConversationId = String(messagesResponse?.conversationId || "").trim() || null;
  const activeConversationId = resolvedConversationId || selectedConversation?.conversationId || null;
  const conversationDate = messages[0]?.createdAt || selectedConversation?.lastMessageAt || null;
  const emptyConversationLabel = selectedParticipant
    ? activeConversationId
      ? "No messages in this conversation yet."
      : `Start the first conversation with ${selectedParticipant.name}.`
    : "Select a contact to start chatting.";

  useEffect(() => {
    if (!requestedConversationId) {
      return;
    }

    const requestedConversation = conversations.find(
      (conversation) => conversation.conversationId === requestedConversationId
    );

    if (!requestedConversation) {
      return;
    }

    if (
      selectedConversationId === requestedConversation.conversationId &&
      selectedParticipantId === requestedConversation.participant.id
    ) {
      return;
    }

    setSelectedParticipantId(requestedConversation.participant.id);
    setSelectedConversationId(requestedConversation.conversationId);
  }, [conversations, requestedConversationId, selectedConversationId, selectedParticipantId]);

  useEffect(() => {
    if (selectedParticipantId || selectedConversationId) {
      return;
    }

    const firstConversation = conversations[0];
    if (firstConversation) {
      setSelectedParticipantId(firstConversation.participant.id);
      setSelectedConversationId(firstConversation.conversationId);
      return;
    }

    const firstContact = headerItems[0];
    if (firstContact) {
      setSelectedParticipantId(firstContact.id);
      setSelectedConversationId(firstContact.conversationId);
    }
  }, [conversations, headerItems, selectedConversationId, selectedParticipantId]);

  useEffect(() => {
    if (!selectedParticipantId || selectedConversationId) {
      return;
    }

    const matchedHeaderItem = headerItems.find((item) => item.id === selectedParticipantId);
    if (matchedHeaderItem?.conversationId) {
      setSelectedConversationId(matchedHeaderItem.conversationId);
    }
  }, [headerItems, selectedConversationId, selectedParticipantId]);

  useEffect(() => {
    if (!selectedParticipantId || !selectedConversationId) {
      return;
    }

    const matchedHeaderItem = headerItems.find((item) => item.id === selectedParticipantId);
    if (!matchedHeaderItem) {
      return;
    }

    const nextConversationId = matchedHeaderItem.conversationId ?? null;
    if (nextConversationId === selectedConversationId) {
      return;
    }

    const conversationStillExists = conversations.some(
      (conversation) => conversation.conversationId === selectedConversationId
    );
    if (conversationStillExists) {
      return;
    }

    setSelectedConversationId(nextConversationId);
  }, [conversations, headerItems, selectedConversationId, selectedParticipantId]);

  useEffect(() => {
    if (!activeConversationId || !selectedConversation?.unreadCount) {
      return;
    }

    markChatConversationRead(activeConversationId).catch(() => {
      return;
    });
  }, [activeConversationId, markChatConversationRead, selectedConversation?.unreadCount]);

  useEffect(() => {
    const listNode = messageListRef.current;
    if (!listNode || messages.length === 0) {
      return;
    }

    listNode.lastElementChild?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [messages.length, selectedConversationId]);

  useEffect(() => {
    if (!resolvedConversationId || resolvedConversationId === selectedConversationId) {
      return;
    }

    setSelectedConversationId(resolvedConversationId);
  }, [resolvedConversationId, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId || selectedConversation || resolvedConversationId !== null) {
      return;
    }

    setSelectedConversationId(null);
  }, [resolvedConversationId, selectedConversation, selectedConversationId]);

  useEffect(() => {
    const status =
      messagesError && typeof messagesError === "object" && "status" in messagesError
        ? (messagesError as { status?: number | string }).status
        : null;

    if (status === 401) {
      clearAuthSession();
      router.replace("/login");
      return;
    }

    if (status !== 404) {
      return;
    }

    const matchedHeaderItem = headerItems.find((item) => item.id === selectedParticipantId);
    const nextConversationId = matchedHeaderItem?.conversationId ?? null;

    if (nextConversationId !== selectedConversationId) {
      setSelectedConversationId(nextConversationId);
      return;
    }

    setSelectedConversationId(null);
  }, [headerItems, messagesError, router, selectedConversationId, selectedParticipantId]);

  async function handleSelectContact(item: ChatHeaderItem) {
    setActionError(null);
    setSelectedParticipantId(item.id);
    setSelectedConversationId(item.conversationId);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError(null);

    const content = messageText.trim();
    if (!content || !selectedParticipant) {
      return;
    }

     if (String(selectedParticipant.id || "").trim() === currentUserId) {
      setActionError("You cannot send a message to your own account.");
      return;
    }

    try {
      const conversation = await getOrCreateConversation({
        recipientId: selectedParticipant.id,
      }).unwrap();

      const conversationId = String(conversation.conversationId || "").trim();
      if (!conversationId) {
        throw new Error("Conversation could not be created.");
      }

      setSelectedParticipantId(conversation.participant.id);
      setSelectedConversationId(conversation.conversationId);

      await sendChatMessage({
        conversationId,
        recipientId: selectedParticipant.id,
        content,
      }).unwrap();

      setMessageText("");
    } catch (error) {
      setActionError(getErrorMessage(error));
    }
  }

  function handlePlaceholderAction(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
  }

  const profileDetails = [
    { label: "Display Name", value: selectedParticipant?.name || "Select a contact" },
    { label: "Local time", value: toProfileValue(selectedParticipant?.localTime, "Not available") },
    { label: "Email Address", value: toProfileValue(selectedParticipant?.email, "Not available") },
    { label: "Phone Number", value: toProfileValue(selectedParticipant?.phoneNumber, "Not added") },
    { label: "Skype Id", value: toProfileValue(selectedParticipant?.skypeId, "Not added") },
  ];

  return (
    <>
      <div className="col-lg-8">
        <div className="main-wraper">
          <h3 className="main-title">Messages</h3>
          <div className="message-box">
            <div className="message-header">
              {headerItems.map((contact) => {
                const isActive =
                  (contact.conversationId && contact.conversationId === selectedConversationId) ||
                  (!selectedConversationId && contact.id === selectedParticipantId);

                return (
                  <div
                    className={`useravatar ${isActive ? "active" : ""}`.trim()}
                    key={`${contact.id}-${contact.conversationId || "new"}`}
                    onClick={() => {
                      void handleSelectContact(contact);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        void handleSelectContact(contact);
                      }
                    }}
                  >
                    <img src={contact.avatarUrl} alt={contact.name} />
                    <span>{contact.name}</span>
                    <div className={`status ${contact.status}`}></div>
                  </div>
                );
              })}
            </div>

            <div className="message-content">
              <div className="chat-header">
                <div className={`status ${selectedParticipant?.status || "offline"}`}></div>
                <h6>{formatLastSeenLabel(selectedParticipant, selectedConversation)}</h6>
                <div className="corss">
                  <span className="report"><i className="icofont-flag"></i></span>
                  <span className="options"><i className="icofont-brand-flikr"></i></span>
                </div>
              </div>

              <div className="chat-content">
                <div className="date">
                  {conversationDate ? formatConversationDate(conversationDate) : "New conversation"}
                </div>

                <ul className="chatting-area" ref={messageListRef}>
                  {messages.map((message) => {
                    const isCurrentUser = String(message.senderId) === String(currentUser?.id || "");
                    return (
                      <li className={isCurrentUser ? "me" : "you"} key={message.id}>
                        <figure>
                          <img
                            src={
                              isCurrentUser
                                ? currentUser?.avatarUrl || "/images/resources/user.jpg"
                                : selectedParticipant?.avatarUrl || "/images/resources/user.jpg"
                            }
                            alt={isCurrentUser ? "me" : selectedParticipant?.name || "contact"}
                          />
                        </figure>
                        <p>{message.content}</p>
                      </li>
                    );
                  })}
                </ul>

                {!showLoadingState && !isMessagesFetching && messages.length === 0 ? (
                  <div className="date">
                    {emptyConversationLabel}
                  </div>
                ) : null}

                <div className="message-text-container">
                  <div className="more-attachments">
                    <i className="icofont-plus"></i>
                  </div>
                  <div className="attach-options">
                    <a href="#" title="" onClick={handlePlaceholderAction}><i className="icofont-camera"></i> Open Camera</a>
                    <a href="#" title="" onClick={handlePlaceholderAction}><i className="icofont-video-cam"></i> Photo &amp; video Library</a>
                    <a href="#" title="" onClick={handlePlaceholderAction}><i className="icofont-paper-clip"></i> Attach Document</a>
                    <a href="#" title="" onClick={handlePlaceholderAction}><i className="icofont-location-pin"></i> Share Location</a>
                    <a href="#" title="" onClick={handlePlaceholderAction}><i className="icofont-contact-add"></i> Share Contact</a>
                  </div>
                  <form className="chat-message-form" onSubmit={handleSubmit}>
                    <span className="emojie"><img src="/images/smiles/happy.png" alt="emoji" /></span>
                    <textarea
                      rows={1}
                      placeholder="say someting..."
                      value={messageText}
                      onChange={(event) => {
                        setMessageText(event.target.value);
                        if (actionError) {
                          setActionError(null);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      disabled={!selectedParticipant || isBusy}
                    ></textarea>
                    <button type="submit" title="send" disabled={!selectedParticipant || !messageText.trim() || isBusy}>
                      <i className="icofont-paper-plane"></i>
                    </button>
                    <div className="smiles-bunch">
                      <i><img src="/images/smiles/angry-1.png" alt="" /></i>
                      <i><img src="/images/smiles/angry.png" alt="" /></i>
                      <i><img src="/images/smiles/bored-1.png" alt="" /></i>
                      <i><img src="/images/smiles/bored-2.png" alt="" /></i>
                      <i><img src="/images/smiles/bored.png" alt="" /></i>
                      <i><img src="/images/smiles/confused-1.png" alt="" /></i>
                      <i><img src="/images/smiles/confused.png" alt="" /></i>
                      <i><img src="/images/smiles/crying-1.png" alt="" /></i>
                      <i><img src="/images/smiles/crying.png" alt="" /></i>
                      <i><img src="/images/smiles/tongue-out.png" alt="" /></i>
                      <i><img src="/images/smiles/wink.png" alt="" /></i>
                      <i><img src="/images/smiles/suspicious.png" alt="" /></i>
                    </div>
                  </form>
                  {showLoadingState || isMessagesFetching ? (
                    <div className="date">Loading conversations...</div>
                  ) : null}
                  {actionError ? <div className="date">{actionError}</div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="profile-short">
          <div className="chating-head">
            <div className="s-left">
              <h5>{selectedParticipant?.name || "No contact selected"}</h5>
              <p>{selectedParticipant?.location || selectedParticipant?.roleLabel || "Select a contact to view details"}</p>
            </div>
            <div className="s-right">
              <span title="Call Video"><i className="icofont-video-cam"></i></span>
              <span title="Call Audio"><i className="icofont-ui-call"></i></span>
            </div>
          </div>

          <div className="short-intro">
            <figure><img src={selectedParticipant?.avatarUrl || "/images/resources/user.jpg"} alt={selectedParticipant?.name || "Contact"} /></figure>
            <ul>
              {profileDetails.map((detail) => (
                <li key={detail.label}>
                  <span>{detail.label}</span>
                  <p>{detail.value}</p>
                </li>
              ))}
            </ul>
            {selectedParticipant ? (
              <Link
                className="button primary circle"
                href={`/profile/${selectedParticipant.id}`}
                title="View Profile"
              >
                view Profile
              </Link>
            ) : (
              <a className="button primary circle" href="#" title="View Profile" onClick={handlePlaceholderAction}>
                view Profile
              </a>
            )}
            <a className="button primary circle danger" href="#" title="Block Chat" onClick={handlePlaceholderAction}>
              Block Chat
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
