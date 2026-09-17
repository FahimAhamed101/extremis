import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "About Updates | Updates",
  description: "About Updates on the Updates Knowledge Network.",
};

export default function AboutPage() {
  return <UsefulLinksPageClient defaultTab="about" pageTitle="About Updates" />;
}
