import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "About Updates – The Modern Social Network & Facebook Alternative",
  description:
    "Learn about Updates, a human-first social platform designed to help you connect and stay in touch with friends and family, share updates, and participate in vibrant communities.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <UsefulLinksPageClient defaultTab="about" pageTitle="About Updates" />;
}
