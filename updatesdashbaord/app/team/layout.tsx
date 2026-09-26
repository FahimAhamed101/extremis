import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description: "Manage team members, roles and permissions for the dashboard.",
};

export default function TeamLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
