import type { MetadataRoute } from "next";

/**
 * Web app manifest — makes Updates installable on Android/iOS home screens and
 * run chrome-less in standalone mode, so the mobile experience feels like a
 * native app rather than a browser tab.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Updates – The Social Media Network",
    short_name: "Updates",
    description:
      "Connect with friends and family. Share posts, photos, videos and stories, join groups, chat in real time, and discover communities.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#0b1220",
    theme_color: "#075985",
    lang: "en",
    dir: "ltr",
    categories: ["social", "communication", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Newsfeed", url: "/", description: "Open your home feed" },
      { name: "Videos", url: "/videos", description: "Watch short videos and reels" },
      { name: "Messages", url: "/messages", description: "Chat with friends" },
      { name: "Groups", url: "/groups", description: "Discover communities" },
    ],
  };
}
