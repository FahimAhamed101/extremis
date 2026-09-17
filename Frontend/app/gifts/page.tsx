import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Updates Gifts & Rewards | Updates",
  description: "Updates Gifts & Rewards on the Updates Knowledge Network.",
};

export default function GiftsPage() {
  return <UsefulLinksPageClient defaultTab="gifts" pageTitle="Updates Gifts & Rewards" />;
}
