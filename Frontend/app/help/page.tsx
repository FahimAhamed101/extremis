import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Help Center & Support – Get Assistance on Updates",
  description:
    "Find answers to frequently asked questions, account help, security tips, and support for the Updates social network.",
  alternates: {
    canonical: "/help",
  },
};

export default function HelpPage() {
  return <UsefulLinksPageClient defaultTab="help" pageTitle="Help & Support Center" />;
}
