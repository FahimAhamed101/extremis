import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "Gifts & Badges – Send Virtual Gifts to Friends on Updates",
  description:
    "Send virtual gifts, reward friends and creators, and celebrate milestones on the Updates social platform.",
  alternates: {
    canonical: "/gifts",
  },
};

export default function GiftsPage() {
  return (
    <>
      <UsefulLinksPageClient defaultTab="gifts" pageTitle="Updates Gifts & Rewards" />
      <SeoContentSection
        heading="Virtual gifts and badges on Updates"
        intro="Send a gift to mark a birthday, congratulate a friend or support a creator whose work you enjoy. Gifts appear on the post itself and in your activity history, and creators can withdraw their balance once it clears the payout threshold."
        features={[
          {
            title: "Gift any post",
            body: "Choose a gift from the tray under any post, add a short message and send it in one tap.",
          },
          {
            title: "Support creators directly",
            body: "Creator balances accumulate in the payout dashboard, with clear fees shown before withdrawal.",
          },
          {
            title: "Badges that mean something",
            body: "Earn profile badges for consistent contribution, helpful answers and community moderation.",
          },
          {
            title: "Milestones and celebrations",
            body: "Birthdays, work anniversaries and group milestones are surfaced so nobody gets forgotten.",
          },
        ]}
        faqs={[
          {
            q: "What are virtual gifts on Updates?",
            a: "Virtual gifts are small paid items — such as stars, cakes or trophies — that you attach to a post or profile to celebrate an occasion or support a creator. They appear publicly on the post and in the recipient's activity feed.",
          },
          {
            q: "How do creators receive the money from gifts?",
            a: "Gift revenue is credited to the creator's balance, which can be withdrawn from the payout dashboard once it clears the minimum threshold. Processing fees are shown before you confirm a withdrawal.",
          },
          {
            q: "Can I get a refund for a gift I sent by mistake?",
            a: "Gifts are generally final because they are delivered instantly, but if you believe a payment was made in error or fraudulently, contact support from the payout or help section and we will review it.",
          },
          {
            q: "How do I earn profile badges?",
            a: "Badges are awarded automatically for sustained contribution — for example consistent posting, helpful answers, or moderating a group. Some badges are temporary and reflect recent activity.",
          },
        ]}
        related={[
          { href: "/payout", label: "Creator payouts" },
          { href: "/groups", label: "Community groups" },
          { href: "/policy", label: "Payments policy" },
          { href: "/help", label: "Help centre" },
        ]}
      />
    </>
  );
}
