import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";

export const metadata: Metadata = {
  title: "Advertise with Updates | Updates",
  description: "Advertise with Updates on the Updates Knowledge Network.",
};

export default function AdvertisePage() {
  return <UsefulLinksPageClient defaultTab="advertise" pageTitle="Advertise with Updates" />;
}
