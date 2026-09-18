import type { Metadata } from "next";
import LiveStreamPageClient from "@/components/livestream/LiveStreamPageClient";

export const metadata: Metadata = {
  title: "Live Stream | Socimo Social Network",
  description: "Join or broadcast interactive live streams with real-time video, audio, and live chat.",
};

export default function LiveStreamPage() {
  return <LiveStreamPageClient />;
}
