import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/getSiteUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/settings",
          "/messages",
          "/profile",
          "/cart",
          "/checkout",
          "/product-cart",
          "/product-checkout",
          "/payout",
          "/add-new-course",
          "/search",
          "/search-result",
          "/login?*",
          "/*?from=",
        ],
      },
      // Image and video bots should still be able to fetch media so that
      // thumbnails and video previews can appear in Search.
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Googlebot-Video", allow: "/" },
      { userAgent: "AdsBot-Google", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
