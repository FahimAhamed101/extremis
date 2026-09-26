import type { MetadataRoute } from "next";

/**
 * The dashboard is a private back office. Block every crawler explicitly so the
 * `noindex` metadata is never the only line of defence — a robots.txt disallow
 * stops the fetch before the page (and any data it renders) is ever requested.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
