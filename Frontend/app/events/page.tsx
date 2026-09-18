import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import EventsPageClient from "@/components/events/EventsPageClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "Events & Meetups – Plan & Attend Gatherings with Friends on Updates",
  description:
    "Discover local and virtual events, plan meetups with friends and family, RSVP, and see who is attending on Updates.",
  alternates: {
    canonical: "/events",
  },
};

export default function EventsPage() {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <EventsPageClient />
        <AppFooter />
      </div>
    </RequireAuth>
  );
}
