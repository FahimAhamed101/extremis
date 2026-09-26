import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "Advertise on Updates – Reach Engaged Communities & Audiences",
  description:
    "Promote your business, brand, or creator content on Updates. Connect with relevant audiences across groups, feeds, and local communities.",
  alternates: {
    canonical: "/advertise",
  },
};

export default function AdvertisePage() {
  return (
    <>
      <UsefulLinksPageClient defaultTab="advertise" pageTitle="Advertise with Updates" />
      <SeoContentSection
        heading="Advertise on Updates – reach real communities, not just impressions"
        intro="Updates advertising puts your business in front of people who are already talking about what you sell. Target by community, interest and location, then measure what actually happened — clicks, messages and purchases — instead of guessing from reach alone."
        features={[
          {
            title: "Community-level targeting",
            body: "Place your ad inside the groups and topics where your customers already spend their time.",
          },
          {
            title: "Local and national reach",
            body: "Run a neighbourhood campaign for a shopfront, or scale the same creative across a whole country.",
          },
          {
            title: "Formats that fit the feed",
            body: "Single image, carousel, video and event promotion, all rendered natively rather than as a banner.",
          },
          {
            title: "Transparent reporting",
            body: "See spend, reach, engagement and conversions per campaign, exportable at any time.",
          },
        ]}
        faqs={[
          {
            q: "How do I start advertising on Updates?",
            a: "Create a business profile, choose an objective such as reach, engagement or conversions, define your audience by location and interest, then set a daily budget and submit your creative for review.",
          },
          {
            q: "What is the minimum advertising budget?",
            a: "You can start with a small daily budget and scale up or pause at any time. The exact minimum depends on your country and objective and is shown in the campaign builder before you confirm.",
          },
          {
            q: "How long does ad review take?",
            a: "Most creatives are reviewed within a few hours. Ads that make misleading health, financial or political claims take longer and may be rejected with a reason you can appeal.",
          },
          {
            q: "Can I advertise a local business to nearby people only?",
            a: "Yes. Location targeting lets you restrict delivery to a radius around your address, a city, or a set of postcodes so you only pay for people who can actually visit.",
          },
        ]}
        related={[
          { href: "/about", label: "About Updates" },
          { href: "/products", label: "Community marketplace" },
          { href: "/policy", label: "Advertising policy" },
          { href: "/help", label: "Help centre" },
        ]}
      />
    </>
  );
}
