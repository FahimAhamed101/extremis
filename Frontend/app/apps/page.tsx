import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "Updates Apps & Downloads – Mobile & Desktop Social Platform",
  description:
    "Download the Updates mobile and desktop apps. Stay connected with friends and family wherever you are.",
  alternates: {
    canonical: "/apps",
  },
};

export default function AppsPage() {
  return (
    <>
      <UsefulLinksPageClient defaultTab="apps" pageTitle="Updates Apps & Downloads" />
      <SeoContentSection
        heading="Download the Updates app for Android, iOS and desktop"
        intro="Updates works in any modern browser, and the dedicated apps add the things a browser tab cannot: push notifications, camera and gallery access, background uploads and offline reading. Sign in once and your feed, groups and messages stay in sync across every device."
        features={[
          {
            title: "Native Android and iOS apps",
            body: "Full-screen photos and video, share sheet integration, and instant push notifications for messages and mentions.",
          },
          {
            title: "Installable web app",
            body: "Add Updates to your home screen straight from the browser — no store account or download required.",
          },
          {
            title: "Desktop experience",
            body: "A wide multi-column layout for the feed, groups and messaging, plus keyboard shortcuts for power users.",
          },
          {
            title: "Sync everywhere",
            body: "Drafts, saved posts and read state follow you between phone, tablet and desktop automatically.",
          },
        ]}
        faqs={[
          {
            q: "Where can I download the Updates app?",
            a: "The Android app is available from the Google Play Store and the iOS app from the Apple App Store. Links are listed on this page, and the web app can be installed directly from your browser.",
          },
          {
            q: "Does Updates work without installing an app?",
            a: "Yes. Everything on Updates works in a modern browser. You can also install it as a progressive web app to get an icon on your home screen and faster launch times.",
          },
          {
            q: "Which Android and iOS versions are supported?",
            a: "The mobile apps support recent Android and iOS releases. Older devices can still use the browser version, which is kept compatible with a wider range of software.",
          },
          {
            q: "Is the Updates app free?",
            a: "Yes, the app is free to download and use. Optional in-app purchases such as virtual gifts and promoted posts are clearly labelled before you confirm.",
          },
        ]}
        related={[
          { href: "/about", label: "About Updates" },
          { href: "/live-stream", label: "Live streaming" },
          { href: "/help", label: "Help centre" },
          { href: "/policy", label: "Privacy policy" },
        ]}
      />
    </>
  );
}
