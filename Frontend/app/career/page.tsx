import type { Metadata } from "next";
import UsefulLinksPageClient from "@/components/widgets/UsefulLinksPageClient";
import SeoContentSection from "@/components/seo/SeoContentSection";

export const metadata: Metadata = {
  title: "Careers at Updates – Help Us Build the Open Social Platform",
  description:
    "Join our team and build the future of social networking. Explore job openings, culture, and opportunities at Updates.",
  alternates: {
    canonical: "/career",
  },
};

export default function CareerPage() {
  return (
    <>
      <UsefulLinksPageClient defaultTab="career" pageTitle="Careers & Opportunities" />
      <SeoContentSection
        heading="Careers at Updates"
        intro="We are a small, product-focused team building a social network that puts people ahead of engagement metrics. Engineering, design, trust and safety, and community roles open regularly — and most of the team works remotely across several time zones."
        features={[
          {
            title: "Work on the whole product",
            body: "Small teams own features end to end, from database schema to the interaction detail users actually feel.",
          },
          {
            title: "Remote-first",
            body: "Work from wherever you are productive, with overlapping hours agreed per team rather than a fixed office.",
          },
          {
            title: "Ship to real people",
            body: "Changes reach a live community quickly, so you see the impact of your work within days rather than quarters.",
          },
          {
            title: "Privacy as a constraint, not an afterthought",
            body: "Data minimisation and user control shape what we build, not a compliance review at the end.",
          },
        ]}
        faqs={[
          {
            q: "How do I apply for a role at Updates?",
            a: "Browse the open positions listed on this page, choose the one that matches your experience and submit your application through the form. You will get an acknowledgement by email, and a first response usually within two weeks.",
          },
          {
            q: "Does Updates hire remote employees?",
            a: "Yes. Most roles are remote-first with a few hours of daily overlap with the rest of the team. Some positions are tied to a specific region for legal or on-call reasons and state that clearly in the listing.",
          },
          {
            q: "Do you offer internships or graduate roles?",
            a: "We run a limited number of paid internships each year, mainly in engineering, design and community operations. They are advertised on this page when applications open.",
          },
          {
            q: "What does the interview process look like?",
            a: "Typically an introductory call, a craft-specific conversation or exercise, and a final discussion about how you like to work. We aim to complete the whole process within three weeks and give specific feedback at each stage.",
          },
        ]}
        related={[
          { href: "/about", label: "About Updates" },
          { href: "/advertise", label: "Advertise with us" },
          { href: "/policy", label: "Privacy policy" },
          { href: "/help", label: "Help centre" },
        ]}
      />
    </>
  );
}
