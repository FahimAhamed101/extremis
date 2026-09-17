import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Platform & Privacy Policy | Updates",
  description: "Platform & Privacy Policy on the Updates Knowledge Network.",
};

export default function PolicyPage() {
  return <UsefulLinksPageClient defaultTab="user-policy" pageTitle="Platform & Privacy Policy" />;
}
