import type { Metadata } from "next";
import VideosPage from "@/components/videos/VideosPage";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "Watch & Share Videos – Video Community on Updates",
  description:
    "Discover trending videos, watch stories from friends and family, and upload your favorite moments on the Updates video platform.",
  alternates: {
    canonical: "/videos",
  },
};

export default function VideosRoutePage() {
  return (
    <>
      <VideosPage />
      <SeoContentSection
        heading="Watch and share videos on Updates"
        intro="Updates is a social video community where you can watch trending clips, catch up on stories from friends and family, and publish your own moments. Browse by topic, follow the creators you like, and join the conversation in the comments."
        features={[
          {
            title: "Trending video feed",
            body: "A personalised stream of short videos, reels and longer uploads from the people and pages you follow.",
          },
          {
            title: "Upload from any device",
            body: "Publish straight from your phone camera or pick an existing clip from your gallery in a few taps.",
          },
          {
            title: "Watch anywhere",
            body: "The player adapts to your screen and connection so playback stays smooth on mobile data.",
          },
          {
            title: "Privacy you control",
            body: "Choose who can see each video — friends, groups, or the whole Updates community.",
          },
        ]}
        faqs={[
          {
            q: "Do I need an account to watch videos on Updates?",
            a: "You can browse the public video pages without an account. Creating a free account lets you follow creators, comment, save videos and upload your own.",
          },
          {
            q: "What video formats can I upload?",
            a: "Updates accepts the common web video formats including MP4 and WebM. For the smoothest playback we recommend MP4 with H.264 video.",
          },
          {
            q: "Is there a length limit on videos?",
            a: "Short clips and reels have no practical minimum, and longer uploads are supported. Very large files may take longer to process after upload.",
          },
          {
            q: "Who can see the videos I post?",
            a: "You choose the audience for every upload. Videos can be shared publicly, with friends only, or inside a specific group.",
          },
        ]}
        related={[
          { href: "/groups", label: "Explore groups" },
          { href: "/products", label: "Marketplace" },
          { href: "/signup", label: "Create an account" },
          { href: "/help", label: "Help centre" },
        ]}
      />
    </>
  );
}
