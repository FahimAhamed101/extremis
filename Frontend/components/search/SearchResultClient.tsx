"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";
import { FeedPostCard } from "@/components/posts/HomeFeedClient";
import {
  useSearchEverythingQuery,
  useToggleFollowUserMutation,
  useJoinGroupMutation,
  SearchMemberDto,
  SearchPhotoDto,
  SearchVideoDto,
  SearchGroupDto,
  SearchDepartmentDto,
  FeedPost,
} from "@/lib/services/authApi";

type SearchTab = "allposts" | "depart" | "members" | "photos" | "videos" | "groups";

export default function SearchResultClient() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || searchParams.get("search") || "Computer";

  const [activeTab, setActiveTab] = useState<SearchTab>("allposts");
  const [activeVideoModal, setActiveVideoModal] = useState<SearchVideoDto | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<SearchPhotoDto | null>(null);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [joinedGroupsMap, setJoinedGroupsMap] = useState<Record<string, boolean>>({});

  const [toggleFollow] = useToggleFollowUserMutation();
  const [joinGroup] = useJoinGroupMutation();

  const { data, isLoading, error, refetch } = useSearchEverythingQuery(
    { q: rawQuery },
    { refetchOnMountOrArgChange: true }
  );

  const posts = useMemo(() => data?.posts || [], [data?.posts]);
  const members = useMemo(() => data?.members || [], [data?.members]);
  const departments = useMemo(() => data?.departments || [], [data?.departments]);
  const photos = useMemo(() => data?.photos || [], [data?.photos]);
  const videos = useMemo(() => data?.videos || [], [data?.videos]);
  const groups = useMemo(() => data?.groups || [], [data?.groups]);

  const counts = data?.counts || {
    all: posts.length + members.length + departments.length + photos.length + videos.length + groups.length,
    posts: posts.length,
    departments: departments.length,
    members: members.length,
    photos: photos.length,
    videos: videos.length,
    groups: groups.length,
  };

  const handleFollow = async (memberId: string) => {
    setFollowingMap((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
    try {
      await toggleFollow({ targetUserId: memberId }).unwrap();
    } catch {
      // Revert if API fails
      setFollowingMap((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    setJoinedGroupsMap((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    try {
      await joinGroup(groupId).unwrap();
    } catch {
      setJoinedGroupsMap((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    }
  };

  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />

        {/* ================= TOP HERO AREA ================= */}
        <section>
          <div className="top-area bluesh high-opacity">
            <div
              className="bg-image"
              style={{
                backgroundImage: "url(/images/resources/top-bg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="post-subject">
                    <div className="university-tag">
                      <div className="Search-result">
                        <h4>
                          Search Result for <strong>&quot;{rawQuery}&quot;</strong>
                        </h4>
                        <span style={{ fontSize: "14px", color: "#e0f2fe", fontWeight: "500" }}>
                          Found {counts.all} matching results across research articles, people, media, and groups
                        </span>
                      </div>
                    </div>

                    <ul className="nav nav-tabs post-detail-btn">
                      <li className="nav-item">
                        <a
                          className={activeTab === "allposts" ? "active" : ""}
                          href="#allposts"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("allposts");
                          }}
                        >
                          All Posts ({counts.posts})
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "depart" ? "active" : ""}
                          href="#depart"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("depart");
                          }}
                        >
                          Departments ({counts.departments})
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "members" ? "active" : ""}
                          href="#members"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("members");
                          }}
                        >
                          Members ({counts.members})
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "photos" ? "active" : ""}
                          href="#photos"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("photos");
                          }}
                        >
                          Photos ({counts.photos})
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "videos" ? "active" : ""}
                          href="#videos"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("videos");
                          }}
                        >
                          Videos ({counts.videos})
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "groups" ? "active" : ""}
                          href="#groups"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("groups");
                          }}
                        >
                          Groups ({counts.groups})
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SEARCH CONTENT ================= */}
        <section>
          <div className="gap">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div id="page-contents" className="row merged20">
                    <div className="col-lg-8">
                      {isLoading && (
                        <div style={{ textAlign: "center", padding: "60px 0" }}>
                          <i className="icofont-spinner icofont-spin" style={{ fontSize: "36px", color: "#088dcd" }}></i>
                          <p style={{ marginTop: "12px", color: "#64748b" }}>Searching community database...</p>
                        </div>
                      )}

                      {!isLoading && error && (
                        <div
                          style={{
                            padding: "24px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fca5a5",
                            borderRadius: "12px",
                            marginBottom: "24px",
                            textAlign: "center",
                          }}
                        >
                          <h5 style={{ color: "#991b1b", marginBottom: "8px" }}>Search failed to load</h5>
                          <p style={{ color: "#7f1d1d", fontSize: "14px" }}>Please verify your connection and try again.</p>
                          <button
                            type="button"
                            onClick={() => refetch()}
                            className="main-btn"
                            style={{ marginTop: "10px" }}
                          >
                            Retry Search
                          </button>
                        </div>
                      )}

                      {!isLoading && !error && (
                        <div className="tab-content">
                          {/* ================= TAB 1: ALL POSTS ================= */}
                          {activeTab === "allposts" && (
                            <div className="tab-pane fade active show" id="allposts">
                              {/* Photos Preview */}
                              {photos.length > 0 && (
                                <div className="main-wraper">
                                  <h4 className="main-title">
                                    Photos{" "}
                                    <a
                                      href="#photos"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("photos");
                                      }}
                                    >
                                      view all ({photos.length})
                                    </a>
                                  </h4>
                                  <div className="row merged-10 remove-ext20">
                                    {photos.slice(0, 6).map((photo) => (
                                      <div className="col-lg-4 col-md-4 col-sm-4" key={photo.id}>
                                        <div
                                          className="images-post"
                                          style={{ cursor: "pointer", borderRadius: "8px", overflow: "hidden" }}
                                          onClick={() => setActivePhotoModal(photo)}
                                        >
                                          <img
                                            src={photo.src}
                                            alt={photo.title || "Search Photo"}
                                            style={{ width: "100%", height: "130px", objectFit: "cover" }}
                                            onError={(e) => {
                                              (e.currentTarget as HTMLImageElement).src = "/images/resources/study.jpg";
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Videos Preview */}
                              {videos.length > 0 && (
                                <div className="main-wraper">
                                  <h4 className="main-title">
                                    Videos{" "}
                                    <a
                                      href="#videos"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("videos");
                                      }}
                                    >
                                      view all ({videos.length})
                                    </a>
                                  </h4>
                                  <div className="row merged-10 remove-ext20">
                                    {videos.slice(0, 6).map((video) => (
                                      <div className="col-lg-4 col-md-4 col-sm-4" key={video.id}>
                                        <div
                                          className="video-posts"
                                          style={{ cursor: "pointer", borderRadius: "8px", overflow: "hidden", position: "relative" }}
                                          onClick={() => setActiveVideoModal(video)}
                                        >
                                          <img
                                            src={video.poster || "/images/resources/post-video1.jpg"}
                                            alt={video.title}
                                            style={{ width: "100%", height: "130px", objectFit: "cover" }}
                                            onError={(e) => {
                                              (e.currentTarget as HTMLImageElement).src = "/images/resources/post-video1.jpg";
                                            }}
                                          />
                                          <span className="play-btn">
                                            <i className="icofont-play"></i>
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Members Preview */}
                              {members.length > 0 && (
                                <div className="main-wraper">
                                  <h4 className="main-title">
                                    Members <span>({members.length})</span>{" "}
                                    <a
                                      href="#members"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("members");
                                      }}
                                    >
                                      view all
                                    </a>
                                  </h4>
                                  <div className="row col-xs-6 merged-10">
                                    {members.slice(0, 4).map((m) => {
                                      const isFollowing = followingMap[m.id];
                                      return (
                                        <div className="col-lg-3 col-md-3 col-sm-6" key={m.id}>
                                          <div className="members">
                                            <figure>
                                              <img
                                                alt={m.name}
                                                src={m.avatarUrl || "/images/resources/user.jpg"}
                                                onError={(e) => {
                                                  (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                                                }}
                                              />
                                            </figure>
                                            <span>
                                              <Link href={`/profile/${m.id}`}>{m.name}</Link>
                                            </span>
                                            <ins>{m.department}</ins>
                                            <a
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleFollow(m.id);
                                              }}
                                              style={
                                                isFollowing
                                                  ? { background: "#e0f2fe", color: "#0284c7" }
                                                  : undefined
                                              }
                                            >
                                              <i className="icofont-star"></i>{" "}
                                              {isFollowing ? "Following" : "Follow"}
                                            </a>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Departments Preview */}
                              {departments.length > 0 && (
                                <div className="main-wraper">
                                  <h4 className="main-title">
                                    Departments{" "}
                                    <a
                                      href="#depart"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab("depart");
                                      }}
                                    >
                                      view all ({departments.length})
                                    </a>
                                  </h4>
                                  <div className="dept-info">
                                    <ul>
                                      {departments.slice(0, 4).map((d, idx) => (
                                        <li key={idx}>
                                          <h6>
                                            <a
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                setActiveTab("depart");
                                              }}
                                            >
                                              {d.name}
                                            </a>
                                          </h6>
                                          <span>
                                            Members <i>{d.membersCount}</i>
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {/* Matching Timeline Feed Posts */}
                              {posts.length > 0 ? (
                                <div style={{ marginTop: "24px" }}>
                                  <h4 className="main-title" style={{ marginBottom: "16px" }}>
                                    Matching Community Posts ({posts.length})
                                  </h4>
                                  {posts.map((post) => (
                                    <FeedPostCard key={post.id} post={post} />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          )}

                          {/* ================= TAB 2: DEPARTMENTS ================= */}
                          {activeTab === "depart" && (
                            <div className="tab-pane fade active show" id="depart">
                              <div className="main-wraper">
                                <h4 className="main-title">Academic Departments ({departments.length})</h4>
                                <div className="dept-info">
                                  <ul>
                                    {departments.map((d, idx) => (
                                      <li
                                        key={idx}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          padding: "16px",
                                          borderBottom: "1px solid #f1f5f9",
                                        }}
                                      >
                                        <div>
                                          <span
                                            style={{
                                              fontSize: "11px",
                                              background: "#e0f2fe",
                                              color: "#0284c7",
                                              padding: "2px 8px",
                                              borderRadius: "4px",
                                              fontWeight: "700",
                                              textTransform: "uppercase",
                                              marginRight: "8px",
                                            }}
                                          >
                                            {d.shortName}
                                          </span>
                                          <h6 style={{ display: "inline-block", margin: 0, fontSize: "15px" }}>
                                            {d.name}
                                          </h6>
                                          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                                            {d.faculty}
                                          </p>
                                        </div>
                                        <span>
                                          Members <i>{d.membersCount}</i>
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= TAB 3: MEMBERS ================= */}
                          {activeTab === "members" && (
                            <div className="tab-pane fade active show" id="members">
                              <div className="main-wraper">
                                <h4 className="main-title">Members &amp; Researchers ({members.length})</h4>
                                <div className="row remove-ext20 col-xs-6 merged-10">
                                  {members.map((m) => {
                                    const isFollowing = followingMap[m.id];
                                    return (
                                      <div className="col-lg-3 col-md-3 col-sm-6" key={m.id}>
                                        <div className="members">
                                          <figure>
                                            <img
                                              alt={m.name}
                                              src={m.avatarUrl || "/images/resources/user.jpg"}
                                              onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/images/resources/user.jpg";
                                              }}
                                            />
                                          </figure>
                                          <span>
                                            <Link href={`/profile/${m.id}`}>{m.name}</Link>
                                          </span>
                                          <ins>{m.department}</ins>
                                          <a
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleFollow(m.id);
                                            }}
                                            style={
                                              isFollowing
                                                ? { background: "#e0f2fe", color: "#0284c7" }
                                                : undefined
                                            }
                                          >
                                            <i className="icofont-star"></i>{" "}
                                            {isFollowing ? "Following" : "Follow"}
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= TAB 4: PHOTOS ================= */}
                          {activeTab === "photos" && (
                            <div className="tab-pane fade active show" id="photos">
                              <div className="main-wraper">
                                <h4 className="main-title">Photos &amp; Research Imagery ({photos.length})</h4>
                                <div className="row merged-10 remove-ext20">
                                  {photos.map((photo) => (
                                    <div className="col-lg-4 col-md-4 col-sm-4" key={photo.id}>
                                      <div
                                        className="images-post"
                                        style={{
                                          cursor: "pointer",
                                          borderRadius: "8px",
                                          overflow: "hidden",
                                          marginBottom: "16px",
                                        }}
                                        onClick={() => setActivePhotoModal(photo)}
                                      >
                                        <img
                                          src={photo.src}
                                          alt={photo.title || "Photo"}
                                          style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/images/resources/study.jpg";
                                          }}
                                        />
                                        {photo.title && (
                                          <div
                                            style={{
                                              padding: "8px 10px",
                                              fontSize: "12px",
                                              fontWeight: "600",
                                              color: "#1e293b",
                                              background: "#f8fafc",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                            }}
                                          >
                                            {photo.title}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= TAB 5: VIDEOS ================= */}
                          {activeTab === "videos" && (
                            <div className="tab-pane fade active show" id="videos">
                              <div className="main-wraper">
                                <h4 className="main-title">Videos &amp; Research Demos ({videos.length})</h4>
                                <div className="row merged-10 remove-ext20">
                                  {videos.map((video) => (
                                    <div className="col-lg-4 col-md-4 col-sm-4" key={video.id}>
                                      <div
                                        className="video-posts"
                                        style={{
                                          cursor: "pointer",
                                          borderRadius: "8px",
                                          overflow: "hidden",
                                          marginBottom: "16px",
                                          position: "relative",
                                        }}
                                        onClick={() => setActiveVideoModal(video)}
                                      >
                                        <img
                                          src={video.poster || "/images/resources/post-video1.jpg"}
                                          alt={video.title}
                                          style={{ width: "100%", height: "160px", objectFit: "cover" }}
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/images/resources/post-video1.jpg";
                                          }}
                                        />
                                        <span className="play-btn">
                                          <i className="icofont-play"></i>
                                        </span>
                                        <div
                                          style={{
                                            padding: "8px 10px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            color: "#1e293b",
                                            background: "#f8fafc",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {video.title}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ================= TAB 6: GROUPS ================= */}
                          {activeTab === "groups" && (
                            <div className="tab-pane fade active show" id="groups">
                              <div className="main-wraper">
                                <h4 className="main-title">Community Groups ({groups.length})</h4>
                                <div className="row col-xs-6">
                                  {groups.map((g) => {
                                    const isJoined = joinedGroupsMap[g.id] || g.isMember;
                                    return (
                                      <div className="col-lg-4 col-md-4 col-sm-6" key={g.id}>
                                        <div className="group-box" style={{ marginBottom: "20px" }}>
                                          <figure>
                                            <img
                                              alt={g.name}
                                              src={g.coverUrl || "/images/resources/group1.jpg"}
                                              style={{ height: "120px", objectFit: "cover" }}
                                              onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/images/resources/group1.jpg";
                                              }}
                                            />
                                          </figure>
                                          <Link href="/groups" title={g.name}>
                                            {g.name}
                                          </Link>
                                          <span>{g.memberCountDisplay}</span>
                                          <button
                                            type="button"
                                            onClick={() => handleJoinGroup(g.id)}
                                            style={
                                              isJoined
                                                ? { background: "#e0f2fe", color: "#0284c7" }
                                                : undefined
                                            }
                                          >
                                            {isJoined ? "joined" : "join group"}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Related Searches Box */}
                      <div className="main-wraper">
                        <h4 className="main-title">Related Searches</h4>
                        <ul className="related-searches">
                          <li>
                            <Link href="/search-result?q=Computer%20Science">Computer Science</Link>
                          </li>
                          <li>
                            <Link href="/search-result?q=Quantum%20Computing">Quantum Computing</Link>
                          </li>
                          <li>
                            <Link href="/search-result?q=Artificial%20Intelligence">Artificial Intelligence</Link>
                          </li>
                          <li>
                            <Link href="/search-result?q=Data%20Science">Data Science</Link>
                          </li>
                          <li>
                            <Link href="/search-result?q=Robotics">Robotics &amp; Automation</Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* ================= RIGHT SIDEBAR ================= */}
                    <div className="col-lg-4">
                      <aside className="sidebar static right">
                        {/* Post Analytics Widget */}
                        <div className="widget">
                          <h4 className="widget-title">Post Analytics</h4>
                          <ul className="widget-analytics">
                            <li>
                              Reads <span>{counts.all * 7 + 56}</span>
                            </li>
                            <li>
                              Recommendations <span>{Math.floor(counts.all / 3) + 3}</span>
                            </li>
                            <li>
                              Shares <span>{counts.posts * 2 + 14}</span>
                            </li>
                            <li>
                              References <span>{counts.departments * 3 + 8}</span>
                            </li>
                          </ul>
                        </div>

                        {/* Ask Research Question Widget */}
                        <div className="widget">
                          <h4 className="widget-title">Ask Research Question?</h4>
                          <div className="ask-question">
                            <i className="icofont-question-circle"></i>
                            <h6>Ask questions in Q&amp;A to get help from experts in your field.</h6>
                            <Link className="ask-qst" href="/" title="">
                              Ask a question
                            </Link>
                          </div>
                        </div>

                        {/* Explore Events Widget */}
                        <div className="widget">
                          <h4 className="widget-title">
                            Explore Events{" "}
                            <Link className="see-all" href="/events">
                              See All
                            </Link>
                          </h4>
                          <div className="rec-events bg-purple">
                            <i className="icofont-gift"></i>
                            <h6>
                              <Link href="/events">
                                Cambridge Academic &amp; Research Meetup 2026
                              </Link>
                            </h6>
                            <img alt="" src="/images/clock.png" />
                          </div>
                          <div className="rec-events bg-blue">
                            <i className="icofont-microphone"></i>
                            <h6>
                              <Link href="/events">
                                The 4th International AI &amp; Robotics Conference
                              </Link>
                            </h6>
                            <img alt="" src="/images/clock.png" />
                          </div>
                        </div>

                        {/* Who's following Widget */}
                        <div className="widget stick-widget">
                          <h4 className="widget-title">Who&apos;s following</h4>
                          <ul className="followers">
                            {members.slice(0, 5).map((m) => (
                              <li key={m.id}>
                                <figure>
                                  <img
                                    alt={m.name}
                                    src={m.avatarUrl || "/images/resources/friend-avatar.jpg"}
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = "/images/resources/friend-avatar.jpg";
                                    }}
                                  />
                                </figure>
                                <div className="friend-meta">
                                  <h4>
                                    <Link href={`/profile/${m.id}`}>{m.name}</Link>
                                    <span>{m.department}</span>
                                  </h4>
                                  <a
                                    className="underline"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleFollow(m.id);
                                    }}
                                  >
                                    {followingMap[m.id] ? "Following" : "Follow"}
                                  </a>
                                </div>
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
          </div>
        </section>

        {/* ================= PHOTO LIGHTBOX MODAL ================= */}
        {activePhotoModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              zIndex: 999999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setActivePhotoModal(null)}
          >
            <div
              style={{
                position: "relative",
                maxWidth: "800px",
                width: "100%",
                background: "#000",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "16px",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                ✕
              </button>
              <img
                src={activePhotoModal.src}
                alt={activePhotoModal.title || "Photo"}
                style={{ width: "100%", maxHeight: "75vh", objectFit: "contain", display: "block" }}
              />
              {activePhotoModal.title && (
                <div style={{ padding: "16px", background: "#111", color: "#fff" }}>
                  <h5 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>{activePhotoModal.title}</h5>
                  {activePhotoModal.author && (
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>By {activePhotoModal.author}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= VIDEO PLAYER MODAL ================= */}
        {activeVideoModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              zIndex: 999999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setActiveVideoModal(null)}
          >
            <div
              style={{
                position: "relative",
                maxWidth: "800px",
                width: "100%",
                background: "#000",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "16px",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                ✕
              </button>
              <video
                controls
                autoPlay
                src={activeVideoModal.src}
                poster={activeVideoModal.poster}
                style={{ width: "100%", maxHeight: "70vh", display: "block" }}
              />
              <div style={{ padding: "16px", background: "#111", color: "#fff" }}>
                <h5 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>{activeVideoModal.title}</h5>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  By {activeVideoModal.authorName} • {activeVideoModal.published}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= UNIFIED APP FOOTER ================= */}
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
