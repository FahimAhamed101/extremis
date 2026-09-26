import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "Privacy Policy & Community Guidelines – Safe Social Networking on Updates",
  description:
    "Read our Privacy Policy, data protection commitments, and community safety guidelines for the Updates social network.",
  alternates: {
    canonical: "/policy",
  },
};

export default function PolicyPage() {
  return (
    <>
      <UsefulLinksPageClient defaultTab="user-policy" pageTitle="Platform & Privacy Policy" />
      <SeoContentSection
        heading="Privacy policy and community guidelines"
        intro="This page explains what data Updates collects, why it is collected, how long it is kept and the controls you have over it — alongside the community guidelines that keep conversations safe for everyone. If a rule is unclear, the help centre explains how to appeal a decision."
        features={[
          {
            title: "Data you control",
            body: "Review, download or delete your account data from settings, and see exactly which device and session is active.",
          },
          {
            title: "Clear retention rules",
            body: "Deleted posts are removed from public view immediately and purged from backups on a defined schedule.",
          },
          {
            title: "Community guidelines",
            body: "No harassment, hate speech, spam or misleading health and financial claims — with transparent enforcement.",
          },
          {
            title: "Appeals and reporting",
            body: "Report content in one tap and appeal a moderation decision from the same screen that told you about it.",
          },
        ]}
        faqs={[
          {
            q: "What personal data does Updates collect?",
            a: "Account details you provide such as your name, email and profile information; content you post; and technical data such as device type and approximate location needed to run the service. Advertising and analytics data is described in the full privacy policy.",
          },
          {
            q: "How do I delete my Updates account and data?",
            a: "Open settings, choose the account section and select delete account. Your profile and posts are removed from public view immediately, and residual copies in backups are purged on the retention schedule described in the policy.",
          },
          {
            q: "What content is not allowed on Updates?",
            a: "Harassment, hate speech, sexual content involving minors, spam, malware, and deliberately misleading health, financial or political claims. The community guidelines list each rule with examples and the action taken.",
          },
          {
            q: "How do I appeal a moderation decision?",
            a: "Every enforcement notice includes an appeal link. Submit the appeal from that screen and a different reviewer will reassess the content, usually within a few days.",
          },
        ]}
        related={[
          { href: "/about", label: "About Updates" },
          { href: "/help", label: "Help centre" },
          { href: "/settings", label: "Privacy settings" },
          { href: "/advertise", label: "Advertising policy" },
        ]}
      />
    </>
  );
}
