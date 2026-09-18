import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy & Community Guidelines – Safe Social Networking on Updates",
  description:
    "Read our Privacy Policy, data protection commitments, and community safety guidelines for the Updates social network.",
  alternates: {
    canonical: "/policy",
  },
};

export default function PolicyPage() {
  return <UsefulLinksPageClient defaultTab="user-policy" pageTitle="Platform & Privacy Policy" />;
}
