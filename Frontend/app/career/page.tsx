import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Careers at Updates – Help Us Build the Open Social Platform",
  description:
    "Join our team and build the future of social networking. Explore job openings, culture, and opportunities at Updates.",
  alternates: {
    canonical: "/career",
  },
};

export default function CareerPage() {
  return <UsefulLinksPageClient defaultTab="career" pageTitle="Careers & Opportunities" />;
}
