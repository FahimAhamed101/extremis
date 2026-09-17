import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Careers & Opportunities | Updates",
  description: "Careers & Opportunities on the Updates Knowledge Network.",
};

export default function CareerPage() {
  return <UsefulLinksPageClient defaultTab="career" pageTitle="Careers & Opportunities" />;
}
