import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "Help Center & Support – Get Assistance on Updates",
  description:
    "Find answers to frequently asked questions, account help, security tips, and support for the Updates social network.",
  alternates: {
    canonical: "/help",
  },
};

export default function HelpPage() {
  return (
    <>
      <UsefulLinksPageClient defaultTab="help" pageTitle="Help & Support Center" />
      <SeoContentSection
        heading="Help Centre and Support"
        intro="Get answers about your Updates account, privacy, security, uploads and communities. If you cannot find what you need below, our support team is available around the clock."
        features={[
          {
            title: "Account and profile help",
            body: "Update your name, photo, cover image, contact details and privacy settings at any time from the Settings page.",
          },
          {
            title: "Privacy and security",
            body: "Control who can message you, see your posts and find you in search. Two-factor options help keep your account safe.",
          },
          {
            title: "Reporting and moderation",
            body: "Report any post, comment or profile that breaks our community standards. Reports are reviewed by our moderation team.",
          },
          {
            title: "Policies and standards",
            body: "Read the content policy and user agreement that keep Updates a respectful place for everyone.",
          },
        ]}
        faqs={[
          {
            q: "How do I reset my password?",
            a: "Open the login page and choose the forgotten password option. We will email you a secure link to set a new password.",
          },
          {
            q: "How do I delete my account?",
            a: "Go to Settings, then Close Account. You can also contact support and we will remove your data in line with our privacy policy.",
          },
          {
            q: "How do I report a post or a user?",
            a: "Use the options menu on any post or profile and select Report. Our moderation team reviews every report within 24 hours.",
          },
          {
            q: "Why can I not upload a photo or video?",
            a: "Uploads usually fail because of an unsupported file type or a slow connection. Check the format and size limits, then try again.",
          },
        ]}
        related={[
          { href: "/policy", label: "Policies" },
          { href: "/about", label: "About Updates" },
          { href: "/videos", label: "Watch videos" },
          { href: "/signup", label: "Create an account" },
        ]}
      />
    </>
  );
}
