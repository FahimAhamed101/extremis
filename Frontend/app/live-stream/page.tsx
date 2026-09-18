import type { Metadata } from "next";
import LiveStreamPageClient from "@/components/livestream/LiveStreamPageClient";

export const metadata: Metadata = {
  title: "Live Streaming – Broadcast & Watch Live Streams with Friends on Updates",
  description:
    "Broadcast live video, interact with friends and family in real time, and watch streams from creators across the Updates community.",
  alternates: {
    canonical: "/live-stream",
  },
};

export default function LiveStreamPage() {
  return <LiveStreamPageClient />;
}
