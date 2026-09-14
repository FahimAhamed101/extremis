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
      {
        source: "/uploads/:path*",
        destination: "http://localhost:4000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
