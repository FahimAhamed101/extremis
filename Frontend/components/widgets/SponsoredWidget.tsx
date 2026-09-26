"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";

interface SponsorItem {
  id?: string;
  _id?: string;
  title: string;
  imageUrl?: string;
  targetUrl?: string;
  href?: string;
  domain?: string;
  isActive?: boolean;
}

const DEFAULT_SPONSORS: SponsorItem[] = [
  {
    id: "sp-1",
    title: "IQ Options Broker",
    imageUrl: "/images/resources/sponsor.jpg",
    targetUrl: "https://iqvie.com",
    domain: "www.iqvie.com",
  },
  {
    id: "sp-2",
    title: "BM Fashion Designer",
    imageUrl: "/images/resources/sponsor2.jpg",
    targetUrl: "https://abcd.com",
    domain: "www.abcd.com",
  },
];

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) {
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export default function SponsoredWidget() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>(DEFAULT_SPONSORS);

  useEffect(() => {
    let isMounted = true;
    const fetchSponsors = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/ads`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data?.sponsors) && data.sponsors.length > 0) {
            const activeList = data.sponsors.filter((s: SponsorItem) => s.isActive !== false);
            if (activeList.length > 0) {
              setSponsors(activeList);
              return;
            }
          }
        }

        // Fallback to /sidebar/sponsors
        const sideRes = await fetch(`${baseUrl}/sidebar/sponsors`, { cache: "no-store" });
        if (sideRes.ok) {
          const sideData = await sideRes.json();
          if (isMounted && Array.isArray(sideData?.sponsors) && sideData.sponsors.length > 0) {
            setSponsors(sideData.sponsors);
          }
        }
      } catch (err) {
        // Keep default sponsors on error
      }
    };

    fetchSponsors();
    return () => {
      isMounted = false;
    };
  }, []);

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <div className="widget">
      <span>
        <i className="icofont-globe"></i> Sponsored
      </span>
      <ul className="sponsors-ad">
        {sponsors.map((item, index) => {
          const key = item.id || item._id || `sponsor-${index}`;
          const rawUrl = item.targetUrl || item.href || "#";
          const isExternal = rawUrl.startsWith("http://") || rawUrl.startsWith("https://");
          const displayDomain =
            item.domain ||
            (isExternal
              ? (() => {
                  try {
                    return new URL(rawUrl).hostname;
                  } catch {
                    return rawUrl;
                  }
                })()
              : rawUrl);

          return (
            <li key={key}>
              <figure>
                <img
                  src={item.imageUrl || "/images/resources/sponsor.jpg"}
                  alt={item.title}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/resources/sponsor.jpg";
                  }}
                />
              </figure>
              <div className="sponsor-meta">
                <h5>
                  <a
                    href={rawUrl}
                    title={item.title}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={rawUrl === "#" ? (e) => e.preventDefault() : undefined}
                  >
                    {item.title}
                  </a>
                </h5>
                <a
                  href={rawUrl}
                  title={displayDomain}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  onClick={rawUrl === "#" ? (e) => e.preventDefault() : undefined}
                >
                  {displayDomain}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
