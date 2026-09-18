import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Advertise on Updates – Reach Engaged Communities & Audiences",
  description:
    "Promote your business, brand, or creator content on Updates. Connect with relevant audiences across groups, feeds, and local communities.",
  alternates: {
    canonical: "/advertise",
  },
};

export default function AdvertisePage() {
  return <UsefulLinksPageClient defaultTab="advertise" pageTitle="Advertise with Updates" />;
}
