import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import EventsPageClient from "@/components/events/EventsPageClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "Events - Discover & Host Academic & Tech Meetups | Socimo",
  description: "Browse upcoming conferences, workshops, hackathons, and research symposiums. RSVP and connect with attendees.",
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
