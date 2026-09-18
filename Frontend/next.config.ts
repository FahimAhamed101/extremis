import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/about-university.html",
        destination: "/about-university",
      },
      {
        source: "/add-new-course.html",
        destination: "/add-new-course",
      },
      {
        source: "/course-detail.html",
        destination: "/course-detail",
      },
      {
        source: "/live-stream.html",
        destination: "/live-stream",
      },
      {
        source: "/search-result.html",
        destination: "/search-result",
      },
      {
        source: "/settings.html",
        destination: "/settings",
      },
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
        source: "/books.html",
        destination: "/books",
      },
      {
        source: "/events.html",
        destination: "/events",
      },
      {
        source: "/messages.html",
        destination: "/messages",
      },
      {
        source: "/sign-in.html",
        destination: "/login",
      },
      {
        source: "/signup.html",
        destination: "/signup",
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:4000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
