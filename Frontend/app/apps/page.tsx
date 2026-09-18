import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Updates Apps & Downloads – Mobile & Desktop Social Platform",
  description:
    "Download the Updates mobile and desktop apps. Stay connected with friends and family wherever you are.",
  alternates: {
    canonical: "/apps",
  },
};

export default function AppsPage() {
  return <UsefulLinksPageClient defaultTab="apps" pageTitle="Updates Apps & Downloads" />;
}
