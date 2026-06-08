import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/blog", "/friends", "/messages", "/posts/", "/profile", "/videos"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
