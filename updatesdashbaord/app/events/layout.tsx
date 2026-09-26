import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Create and manage community events, schedules and attendees.",
};

export default function EventsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
