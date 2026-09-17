import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Updates Apps & Downloads | Updates",
  description: "Updates Apps & Downloads on the Updates Knowledge Network.",
};

export default function AppsPage() {
  return <UsefulLinksPageClient defaultTab="apps" pageTitle="Updates Apps & Downloads" />;
}
