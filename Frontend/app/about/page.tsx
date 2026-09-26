import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "About Updates – The Modern Social Network & Facebook Alternative",
  description:
    "Learn about Updates, a human-first social platform designed to help you connect and stay in touch with friends and family, share updates, and participate in vibrant communities.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <UsefulLinksPageClient defaultTab="about" pageTitle="About Updates" />
      <SeoContentSection
        heading="About Updates – a human-first social network"
        intro="Updates is a social platform built around the people you already know. Instead of chasing reach and virality, it focuses on real conversations with friends, family and the communities you actually belong to — with a feed you control, groups that stay on topic, and privacy settings that are readable rather than buried."
        features={[
          {
            title: "A feed you actually chose",
            body: "Follow the people and topics you care about, and mute the rest. No algorithm decides what you see before you do.",
          },
          {
            title: "Groups for every interest",
            body: "Join public communities or run a private group for family, a class, a club or a team — with moderation tools that scale.",
          },
          {
            title: "Share in every format",
            body: "Post text, photos, video, live streams, polls, events and marketplace listings, all from one composer.",
          },
          {
            title: "Privacy by default",
            body: "Decide who sees each post, review your audience before publishing, and download or delete your data at any time.",
          },
        ]}
        faqs={[
          {
            q: "What is Updates?",
            a: "Updates is a social networking platform for sharing posts, photos, videos and live streams with friends, family and community groups. It combines a personal feed with groups, events, a marketplace, courses and messaging.",
          },
          {
            q: "Is Updates free to use?",
            a: "Yes. Creating an account, posting, joining groups and messaging are free. Optional paid features such as promoted posts, virtual gifts and marketplace listings are clearly priced before you confirm.",
          },
          {
            q: "How is Updates different from other social networks?",
            a: "Updates keeps the feed chronological and community-driven rather than purely algorithmic, puts groups and real conversations at the centre, and gives you granular control over who can see each post.",
          },
          {
            q: "Which devices does Updates support?",
            a: "Updates runs in any modern web browser on desktop, tablet and mobile, and also offers dedicated Android and iOS apps so you can stay connected on the move.",
          },
        ]}
        related={[
          { href: "/advertise", label: "Advertise on Updates" },
          { href: "/apps", label: "Apps and downloads" },
          { href: "/policy", label: "Privacy policy" },
          { href: "/help", label: "Help centre" },
        ]}
      />
    </>
  );
}
