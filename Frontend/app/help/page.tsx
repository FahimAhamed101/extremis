import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Help & Support Center | Updates",
  description: "Help & Support Center on the Updates Knowledge Network.",
};

export default function HelpPage() {
  return <UsefulLinksPageClient defaultTab="help" pageTitle="Help & Support Center" />;
}
