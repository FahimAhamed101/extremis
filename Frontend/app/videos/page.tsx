import type { Metadata } from "next";
import VideosPage from "@/components/videos/VideosPage";

export const metadata: Metadata = {
  title: "Watch & Share Videos – Video Community on Updates",
  description:
    "Discover trending videos, watch stories from friends and family, and upload your favorite moments on the Updates video platform.",
  alternates: {
    canonical: "/videos",
  },
};

export default function VideosRoutePage() {
  return <VideosPage />;
}
