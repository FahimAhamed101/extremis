import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Gifts & Badges – Send Virtual Gifts to Friends on Updates",
  description:
    "Send virtual gifts, reward friends and creators, and celebrate milestones on the Updates social platform.",
  alternates: {
    canonical: "/gifts",
  },
};

export default function GiftsPage() {
  return <UsefulLinksPageClient defaultTab="gifts" pageTitle="Updates Gifts & Rewards" />;
}
