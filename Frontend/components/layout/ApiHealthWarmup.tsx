"use client";

import { useEffect, useRef } from "react";
import { apiBaseUrl } from "@/lib/services/authApi";

/**
 * ApiHealthWarmup
 * Fires an early health ping to the backend API as soon as the user opens the page.
 * This pre-warms the Node.js Express server and MongoDB connection pool,
 * eliminating cold-start latency for all subsequent user actions.
 */
export default function ApiHealthWarmup() {
  const pinged = useRef(false);

  useEffect(() => {
    if (pinged.current) return;
    pinged.current = true;

    try {
      const rootUrl = apiBaseUrl ? `${apiBaseUrl}/health` : "/api/health";
      fetch(rootUrl, {
        method: "GET",
        keepalive: true,
        headers: { "X-Warmup": "true" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[API Warmup] Backend health check success:", data);
          }
        })
        .catch(() => {
          // Fallback to relative /api/health
          fetch("/api/health", { method: "GET", keepalive: true }).catch(() => {});
        });
    } catch {
      // Ignore background warmup errors
    }
  }, []);

  return null;
}
