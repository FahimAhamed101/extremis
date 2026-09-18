import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const publicRoutes: Array<{
    path: string;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/signup", changeFrequency: "weekly", priority: 0.95 },
    { path: "/login", changeFrequency: "weekly", priority: 0.9 },
    { path: "/groups", changeFrequency: "daily", priority: 0.9 },
    { path: "/pages", changeFrequency: "daily", priority: 0.9 },
    { path: "/friends", changeFrequency: "daily", priority: 0.85 },
    { path: "/videos", changeFrequency: "daily", priority: 0.85 },
    { path: "/live-stream", changeFrequency: "daily", priority: 0.85 },
    { path: "/events", changeFrequency: "daily", priority: 0.85 },
    { path: "/nearby", changeFrequency: "daily", priority: 0.8 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.85 },
    { path: "/products", changeFrequency: "daily", priority: 0.8 },
    { path: "/courses", changeFrequency: "weekly", priority: 0.8 },
    { path: "/books", changeFrequency: "weekly", priority: 0.75 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/about-university", changeFrequency: "monthly", priority: 0.7 },
    { path: "/career", changeFrequency: "monthly", priority: 0.7 },
    { path: "/advertise", changeFrequency: "monthly", priority: 0.75 },
    { path: "/payout", changeFrequency: "monthly", priority: 0.7 },
    { path: "/world-tour", changeFrequency: "weekly", priority: 0.75 },
    { path: "/apps", changeFrequency: "monthly", priority: 0.7 },
    { path: "/help", changeFrequency: "monthly", priority: 0.65 },
    { path: "/policy", changeFrequency: "monthly", priority: 0.65 },
    { path: "/search-result", changeFrequency: "daily", priority: 0.6 },
  ];

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

