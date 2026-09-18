"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import HomeHeader from "@/components/layout/HomeHeader";
import GlobalShellScripts from "@/components/layout/GlobalShellScripts";
import {
  useGetActiveLiveStreamQuery,
  useStartLiveStreamMutation,
  useSendLiveChatMessageMutation,
  useEndLiveStreamMutation,
  useGetCurrentUserQuery,
  useGetMyProfileQuery,
  type LiveChatMessageDto,
} from "@/lib/services/authApi";
import { AUTH_USER_STORAGE_KEY, AUTH_STORAGE_EVENT } from "@/lib/auth/constants";

function getStoredUserSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribeToAuthStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorageUpdate = () => callback();
  window.addEventListener("storage", onStorageUpdate);
  window.addEventListener(AUTH_STORAGE_EVENT, onStorageUpdate);
  return () => {
    window.removeEventListener("storage", onStorageUpdate);
    window.removeEventListener(AUTH_STORAGE_EVENT, onStorageUpdate);
  };
}

export default function LiveStreamPageClient() {
  const [wizardOpen, setWizardOpen] = useState(true);
  const [wizardStep, setWizardStep] = useState(1);
  const [whenLive, setWhenLive] = useState<"now" | "later">("now");
  const [checkMode, setCheckMode] = useState<"video" | "audio">("video");
  const [streamTitle, setStreamTitle] = useState("Socimo Live Room - Interactive Stream");
  const [privacy, setPrivacy] = useState("Public");
  const [allowChat, setAllowChat] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [scheduleForLater, setScheduleForLater] = useState(false);

  // Stream controls state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<"stream" | "manage" | "webcam" | "settings" | "feedback">("stream");

  // Chat message input
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Video element and media stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Auth User
  const userSnapshot = useSyncExternalStore(subscribeToAuthStorage, getStoredUserSnapshot, () => null);
  const localUser = useMemo(() => {
    if (!userSnapshot) return null;
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const { data: profileData } = useGetMyProfileQuery();
  const { data: currentUserData } = useGetCurrentUserQuery();
  const user = profileData?.profile?.user || currentUserData?.user || localUser;

  // Backend queries & mutations
  const { data: activeStreamData, refetch: refetchStream } = useGetActiveLiveStreamQuery();
  const [startStreamMutation, { isLoading: isStartingStream }] = useStartLiveStreamMutation();
  const [sendChatMessageMutation, { isLoading: isSendingChat }] = useSendLiveChatMessageMutation();
  const [endStreamMutation] = useEndLiveStreamMutation();

  const stream = activeStreamData?.stream;

  // Real-time polling for stream chat messages every 4 seconds
  useEffect(() => {
    const interval = window.setInterval(() => {
      refetchStream();
    }, 4000);
    return () => window.clearInterval(interval);
  }, [refetchStream]);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stream?.chatMessages]);

  // Setup WebCam or Screen stream
  const initWebcam = async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }
    } catch (err) {
      console.warn("Camera/Mic access could not be initialized directly:", err);
    }
  };

  useEffect(() => {
    initWebcam();
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle Mute
  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  // Toggle Video
  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoStopped((prev) => !prev);
    } else {
      setIsVideoStopped((prev) => !prev);
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // revert to webcam
        await initWebcam();
        setIsScreenSharing(false);
      } else {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }
          mediaStreamRef.current = displayStream;
          if (videoRef.current) {
            videoRef.current.srcObject = displayStream;
            videoRef.current.play().catch(() => {});
          }
          setIsScreenSharing(true);

          displayStream.getVideoTracks()[0].onended = () => {
            initWebcam();
            setIsScreenSharing(false);
          };
        }
      }
    } catch (err) {
      console.warn("Screen share error:", err);
      setIsScreenSharing(false);
    }
  };

  // Toggle Record
  const toggleRecord = () => {
    if (!mediaStreamRef.current) {
      alert("No active media stream found to record.");
      return;
    }

    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(mediaStreamRef.current);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `socimo-livestream-${Date.now()}.webm`;
          a.click();
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.error("Recording error:", err);
      }
    }
  };

  // Handle Wizard Submit (Go Live)
  const handleWizardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await startStreamMutation({
        title: streamTitle,
        privacy,
        allowChat,
        allowComments,
        scheduleForLater,
      }).unwrap();
      setWizardOpen(false);
      refetchStream();
    } catch (err) {
      console.error("Failed to start stream:", err);
      setWizardOpen(false);
    }
  };

  // Handle Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const streamId = stream?._id;
    if (!streamId) return;

    const msg = chatInput.trim();
    setChatInput("");

    try {
      await sendChatMessageMutation({
        streamId,
        message: msg,
      }).unwrap();
      refetchStream();
    } catch (err) {
      console.error("Failed to send chat message:", err);
    }
  };

  // Handle End Stream
  const handleEndStream = async () => {
    if (confirm("Are you sure you want to end this live stream?")) {
      if (stream?._id) {
        await endStreamMutation(stream._id);
        refetchStream();
      }
    }
  };

  return (
    <>
      <div className="theme-layout">
        <HomeHeader />

        <section>
          <div className="gap no-gap">
            <div className="container-fluid no-pad">
              <div className="row no-gutters">
                {/* Left side menu */}
                <div className="col-lg-2">
                  <div className="side-area">
                    <ul className="side-links">
                      <li>
                        <a
                          className={activeTab === "stream" ? "active" : ""}
                          href="#live-stream"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("stream");
                          }}
                          title="Live Stream"
                        >
                          <i className="icofont-video-cam"></i> Live Stream
                        </a>
                      </li>
                      <li>
                        <a
                          className={activeTab === "manage" ? "active" : ""}
                          href="#manage"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("manage");
                            setWizardOpen(true);
                          }}
                          title="Manage"
                        >
                          <i className="icofont-calendar"></i> Manage Room
                        </a>
                      </li>
                      <li>
                        <a
                          className={activeTab === "webcam" ? "active" : ""}
                          href="#webcam"
                          onClick={(e) => {
                            e.preventDefault();
                            initWebcam();
                          }}
                          title="Webcam"
                        >
                          <i className="icofont-camera-alt"></i> Reset Webcam
                        </a>
                      </li>
                      <li>
                        <a
                          className={activeTab === "settings" ? "active" : ""}
                          href="#settings"
                          onClick={(e) => {
                            e.preventDefault();
                            setWizardStep(3);
                            setWizardOpen(true);
                          }}
                          title="Settings"
                        >
                          <i className="icofont-gears"></i> Settings
                        </a>
                      </li>
                      <li>
                        <a
                          className={activeTab === "feedback" ? "active" : ""}
                          href="#feedback"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Thank you for using Socimo Live Stream!");
                          }}
                          title="Feedback"
                        >
                          <i className="icofont-comment"></i> Feedback
                        </a>
                      </li>
                    </ul>

                    {/* Stream Info in Sidebar */}
                    <div
                      style={{
                        marginTop: "auto",
                        background: "#fff",
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #eaeaea",
                      }}
                    >
                      <h6 style={{ fontSize: "12px", fontWeight: 600, margin: "0 0 5px 0", color: "#333" }}>
                        STREAM STATUS
                      </h6>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: stream?.status === "live" ? "#28a745" : "#ffc107",
                          }}
                        ></span>
                        <span style={{ fontWeight: 500, textTransform: "uppercase" }}>
                          {stream?.status || "LIVE"}
                        </span>
                      </div>
                      <p style={{ margin: "5px 0 0 0", fontSize: "11px", color: "#777" }}>
                        {stream?.title || "Socimo Live Room"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center video area */}
                <div className={isChatVisible ? "col-lg-7" : "col-lg-10"}>
                  <div className="screen-area">
                    <div id="my_camera">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={isMuted}
                        style={{
                          display: isVideoStopped ? "none" : "block",
                        }}
                      />
                      {isVideoStopped && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            gap: "10px",
                          }}
                        >
                          <i className="icofont-video" style={{ fontSize: "50px", opacity: 0.5 }}></i>
                          <p style={{ margin: 0, fontSize: "15px" }}>Camera is paused</p>
                        </div>
                      )}

                      {/* Live Badge overlay */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          left: "20px",
                          background: "rgba(220, 53, 69, 0.9)",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          fontSize: "12px",
                          letterSpacing: "1px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#fff",
                            animation: "pulse 1.5s infinite",
                          }}
                        ></span>
                        LIVE
                      </div>

                      {/* Streamer details overlay */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          background: "rgba(0, 0, 0, 0.6)",
                          backdropFilter: "blur(5px)",
                          color: "#fff",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                        }}
                      >
                        <img
                          src={stream?.streamerAvatar || "/images/resources/user.jpg"}
                          alt=""
                          style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span>{stream?.streamerName || "Danial Cardos"}</span>
                      </div>
                    </div>

                    {/* Stream Controls bar */}
                    <div className="stream-controls">
                      <ul>
                        <li>
                          <i className="icofont-users-alt-3"></i> Participants{" "}
                          <span>{stream?.viewerCount ?? 2}</span>
                        </li>
                        <li
                          onClick={toggleMute}
                          className={isMuted ? "active-danger" : ""}
                          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                        >
                          <i className={isMuted ? "icofont-ui-mute" : "icofont-record"}></i>
                          {isMuted ? "Unmute" : "Mute"}
                        </li>
                        <li
                          onClick={toggleVideo}
                          className={isVideoStopped ? "active-danger" : ""}
                          title={isVideoStopped ? "Start Video" : "Stop Video"}
                        >
                          <i className="icofont-video"></i>
                          {isVideoStopped ? "Start video" : "Stop video"}
                        </li>
                        <li
                          onClick={toggleRecord}
                          className={isRecording ? "active-danger" : ""}
                          title={isRecording ? "Stop Recording" : "Record Stream"}
                        >
                          <i className="icofont-dotcms"></i>
                          {isRecording ? "Stop Recording" : "Record Video"}
                        </li>
                        <li
                          onClick={() => setIsChatVisible((prev) => !prev)}
                          className={isChatVisible ? "active-active" : ""}
                          title="Toggle Live Chat"
                        >
                          <i className="icofont-comment"></i>
                          {isChatVisible ? "Hide Chat" : "Show Chat"}
                        </li>
                        <li
                          onClick={toggleScreenShare}
                          className={isScreenSharing ? "active-active" : ""}
                          title="Share your desktop screen"
                        >
                          <i className="icofont-slidshare"></i>
                          {isScreenSharing ? "Stop Share" : "Share Screen"}
                        </li>
                        <li
                          onClick={handleEndStream}
                          style={{ borderColor: "#dc3545", color: "#dc3545" }}
                          title="End this stream"
                        >
                          <i className="icofont-power"></i> End Stream
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right live chat */}
                {isChatVisible && (
                  <div className="col-lg-3">
                    <div className="livestream-chat">
                      <div className="livechat-head">
                        <h5>
                          <i className="icofont-live-support"></i> Live Chat
                        </h5>
                        <div className="more">
                          <div className="more-post-optns">
                            <i
                              style={{ cursor: "pointer" }}
                              onClick={() => setWizardOpen(true)}
                              title="Room options"
                            >
                              <svg
                                className="feather feather-more-horizontal"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                                height="20"
                                width="20"
                              >
                                <circle r="1" cy="12" cx="12" />
                                <circle r="1" cy="12" cx="19" />
                                <circle r="1" cy="12" cx="5" />
                              </svg>
                            </i>
                          </div>
                        </div>
                      </div>

                      <div className="chat-content" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        <div className="date" style={{ textAlign: "center", fontSize: "12px", color: "#888", marginBottom: "12px" }}>
                          Today &bull; Live Discussion
                        </div>
                        <ul className="chatting-area max-height" style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto" }}>
                          {(stream?.chatMessages || []).map((msg: LiveChatMessageDto, index: number) => {
                            const isMe = msg.senderName === (user?.firstName || "You") || msg.senderName === "Danial Cardos";
                            return (
                              <li
                                key={msg._id || index}
                                className={isMe ? "me" : "you"}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "8px",
                                  marginBottom: "12px",
                                  flexDirection: isMe ? "row-reverse" : "row",
                                }}
                              >
                                <figure style={{ margin: 0, width: "32px", height: "32px", flexShrink: 0 }}>
                                  <img
                                    src={msg.senderAvatar || "/images/resources/userlist-1.jpg"}
                                    alt=""
                                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                                  />
                                </figure>
                                <div
                                  style={{
                                    maxWidth: "75%",
                                    background: isMe ? "#088dcd" : "#eaeaea",
                                    color: isMe ? "#fff" : "#333",
                                    padding: "8px 12px",
                                    borderRadius: "14px",
                                    fontSize: "13px",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  <div style={{ fontSize: "10.5px", opacity: 0.8, marginBottom: "2px", fontWeight: 600 }}>
                                    {msg.senderName}
                                  </div>
                                  <p style={{ margin: 0 }}>{msg.message}</p>
                                </div>
                              </li>
                            );
                          })}
                          <div ref={chatBottomRef} />
                        </ul>
                      </div>

                      {/* Chat Input Form */}
                      <form onSubmit={handleSendMessage} className="text-bottom" style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="text"
                            placeholder="Write something..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "10px 14px",
                              borderRadius: "20px",
                              border: "1px solid #ddd",
                              outline: "none",
                              fontSize: "13px",
                            }}
                          />
                          <button
                            type="submit"
                            disabled={isSendingChat || !chatInput.trim()}
                            style={{
                              background: "#088dcd",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: "38px",
                              height: "38px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              opacity: chatInput.trim() ? 1 : 0.6,
                            }}
                          >
                            <i className="icofont-paper-plane" style={{ fontSize: "14px" }}></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Setup Wizard Modal Popup */}
        {wizardOpen && (
          <div className="auto-popup">
            <div className="wizard-wrapper">
              <span
                onClick={() => setWizardOpen(false)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "15px",
                  cursor: "pointer",
                  zIndex: 10,
                  fontSize: "20px",
                  color: "#999",
                }}
                title="Close"
              >
                <i className="icofont-close-circled"></i>
              </span>

              <form onSubmit={handleWizardSubmit}>
                {/* Wizard Step 1: When do you want to go live */}
                {wizardStep === 1 && (
                  <article>
                    <div className="inner">
                      <div className="image-holder">
                        <img src="/images/resources/form-wizard-1.jpg" alt="" />
                      </div>
                      <div className="popup-content">
                        <div>
                          <h2>Welcome to Socimo Live Room</h2>
                          <span>When do You Want To Go Live</span>
                          <div className="box-data">
                            <div
                              className={`starting-ask ${whenLive === "now" ? "selected" : ""}`}
                              onClick={() => setWhenLive("now")}
                            >
                              <i>
                                <svg height="18px" width="18px" viewBox="0 0 32 32" fill="#f00">
                                  <path d="M 6.1015625 6.1015625 C 3.5675625 8.6345625 2 12.134 2 16 C 2 19.866 3.5675625 23.365437 6.1015625 25.898438 L 7.5195312 24.480469 C 5.3465312 22.307469 4 19.308 4 16 C 4 12.692 5.3465312 9.6925313 7.5195312 7.5195312 L 6.1015625 6.1015625 z M 25.898438 6.1015625 L 24.480469 7.5195312 C 26.653469 9.6925312 28 12.692 28 16 C 28 19.308 26.653469 22.307469 24.480469 24.480469 L 25.898438 25.898438 C 28.432437 23.365437 30 19.866 30 16 C 30 12.134 28.432437 8.6345625 25.898438 6.1015625 z M 9.6367188 9.6367188 C 8.0077188 11.265719 7 13.515 7 16 C 7 18.485 8.0077187 20.734281 9.6367188 22.363281 L 11.052734 20.947266 C 9.7847344 19.680266 9 17.93 9 16 C 9 14.07 9.7847344 12.319734 11.052734 11.052734 L 9.6367188 9.6367188 z M 22.363281 9.6367188 L 20.947266 11.052734 C 22.215266 12.319734 23 14.07 23 16 C 23 17.93 22.215266 19.680266 20.947266 20.947266 L 22.363281 22.363281 C 23.992281 20.734281 25 18.485 25 16 C 25 13.515 23.992281 11.265719 22.363281 9.6367188 z M 16 12 A 4 4 0 0 0 16 20 A 4 4 0 0 0 16 12 z" />
                                </svg>
                              </i>
                              <h6>Right Now</h6>
                              <p>Get up to live stream now. You can review and adjust camera & mic before broadcasting.</p>
                            </div>
                            <div
                              className={`starting-ask ${whenLive === "later" ? "selected" : ""}`}
                              onClick={() => {
                                setWhenLive("later");
                                setScheduleForLater(true);
                              }}
                            >
                              <i>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                  <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                              </i>
                              <h6>Live Later</h6>
                              <p>Schedule a stream for a later time and notify your followers ahead of time.</p>
                            </div>
                          </div>
                        </div>
                        <div className="wizard-actions">
                          <div></div>
                          <button
                            type="button"
                            className="btn-next"
                            onClick={() => setWizardStep(2)}
                          >
                            Next Step &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {/* Wizard Step 2: Check Camera & Mic */}
                {wizardStep === 2 && (
                  <article>
                    <div className="inner">
                      <div className="image-holder">
                        <img src="/images/resources/form-wizard-1.jpg" alt="" />
                      </div>
                      <div className="popup-content">
                        <div>
                          <h2>Go live and pick the stream</h2>
                          <span>Check hardware devices and permissions</span>
                          <div className="box-data">
                            <div
                              className={`starting-ask ${checkMode === "video" ? "selected" : ""}`}
                              onClick={() => {
                                setCheckMode("video");
                                initWebcam();
                              }}
                            >
                              <i>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="23 7 16 12 23 17 23 7" />
                                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                </svg>
                              </i>
                              <h6>Check Video Camera</h6>
                              <p>Verify your webcam is connected and video signal is streaming properly.</p>
                            </div>
                            <div
                              className={`starting-ask ${checkMode === "audio" ? "selected" : ""}`}
                              onClick={() => {
                                setCheckMode("audio");
                                initWebcam();
                              }}
                            >
                              <i>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                  <line x1="12" y1="19" x2="12" y2="23" />
                                  <line x1="8" y1="23" x2="16" y2="23" />
                                </svg>
                              </i>
                              <h6>Check Audio & Mic</h6>
                              <p>Verify your microphone input is active and audio level is optimal.</p>
                            </div>
                          </div>
                        </div>
                        <div className="wizard-actions">
                          <button
                            type="button"
                            className="btn-back"
                            onClick={() => setWizardStep(1)}
                          >
                            &larr; Back
                          </button>
                          <button
                            type="button"
                            className="btn-next"
                            onClick={() => setWizardStep(3)}
                          >
                            Next Step &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {/* Wizard Step 3: Stream Details & Settings */}
                {wizardStep === 3 && (
                  <article>
                    <div className="inner">
                      <div className="image-holder">
                        <img src="/images/resources/form-wizard-1.jpg" alt="" />
                      </div>
                      <div className="popup-content">
                        <div>
                          <h2>Room Settings & Audience</h2>
                          <span>Customize stream title and privacy controls</span>
                          <div className="box-data">
                            <input
                              type="text"
                              placeholder="Create a stream title..."
                              value={streamTitle}
                              onChange={(e) => setStreamTitle(e.target.value)}
                              required
                            />
                            <select
                              value={privacy}
                              onChange={(e) => setPrivacy(e.target.value)}
                            >
                              <option value="Public">Public</option>
                              <option value="Private">Private</option>
                              <option value="only friends">Only Friends</option>
                            </select>

                            <div className="seting-mode">
                              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  checked={allowChat}
                                  onChange={(e) => setAllowChat(e.target.checked)}
                                />
                                <span><strong>Allow Live Chat</strong></span>
                              </label>
                              <p>Viewers can send comments and interact in real-time</p>
                            </div>

                            <div className="seting-mode">
                              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  checked={allowComments}
                                  onChange={(e) => setAllowComments(e.target.checked)}
                                />
                                <span><strong>Allow Comments & Reactions</strong></span>
                              </label>
                              <p>Notify followers about activity from your live room</p>
                            </div>

                            <div className="seting-mode">
                              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                <input
                                  type="checkbox"
                                  checked={scheduleForLater}
                                  onChange={(e) => setScheduleForLater(e.target.checked)}
                                />
                                <span><strong>Schedule for Later</strong></span>
                              </label>
                              <p>Set a scheduled event banner on your channel profile</p>
                            </div>
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <button
                            type="button"
                            className="btn-back"
                            onClick={() => setWizardStep(2)}
                          >
                            &larr; Back
                          </button>
                          <button
                            type="submit"
                            className="btn-finish"
                            disabled={isStartingStream}
                          >
                            {isStartingStream ? "Starting..." : "Go Live Now"} &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
      <GlobalShellScripts />
    </>
  );
}
