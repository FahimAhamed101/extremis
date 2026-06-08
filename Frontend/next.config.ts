import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/videos.html",
        destination: "/videos",
      },
      {
        source: "/courses.html",
        destination: "/courses",
      },
      {
        source: "/groups.html",
        destination: "/groups",
      },
    ];
  },
};

export default nextConfig;
