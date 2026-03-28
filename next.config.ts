import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/videos.html",
        destination: "/videos",
      },
    ];
  },
};

export default nextConfig;
