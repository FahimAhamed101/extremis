"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";

interface AdData {
  title: string;
  imageUrl: string;
  targetUrl: string;
  altText: string;
  isActive: boolean;
}

const DEFAULT_AD: AdData = {
  title: "advertisment",
  imageUrl: "/images/resources/ad-widget2.gif",
  targetUrl: "#",
  altText: "Advertisment",
  isActive: true,
};

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) {
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export default function AdvertismentWidget({ customImageStyle }: { customImageStyle?: React.CSSProperties }) {
  const [ad, setAd] = useState<AdData>(DEFAULT_AD);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAd = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/ads`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.advertisement) {
            setAd({
              title: data.advertisement.title || "advertisment",
              imageUrl: data.advertisement.imageUrl || "/images/resources/ad-widget2.gif",
              targetUrl: data.advertisement.targetUrl || "#",
              altText: data.advertisement.altText || data.advertisement.title || "Advertisment",
              isActive: data.advertisement.isActive !== false,
            });
          }
        }
      } catch (err) {
        // Silently keep default ad
      } finally {
        if (isMounted) setLoaded(true);
      }
    };

    fetchAd();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loaded && !ad.isActive) {
    return null;
  }

  const isExternal = ad.targetUrl && (ad.targetUrl.startsWith("http://") || ad.targetUrl.startsWith("https://"));

  return (
    <div className="advertisment-box">
      <h4 className="">
        <i className="icofont-info-circle"></i> {ad.title || "advertisment"}
      </h4>
      <figure style={{ borderRadius: "8px", overflow: "hidden" }}>
        <a
          href={ad.targetUrl || "#"}
          title={ad.altText || ad.title}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={ad.targetUrl === "#" ? (e) => e.preventDefault() : undefined}
        >
          <img
            src={ad.imageUrl || "/images/resources/ad-widget2.gif"}
            alt={ad.altText || ad.title || "Advertisment"}
            style={customImageStyle || { width: "100%", height: "auto", display: "block" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/resources/ad-widget2.gif";
            }}
          />
        </a>
      </figure>
    </div>
  );
}
