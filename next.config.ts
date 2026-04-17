import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
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
