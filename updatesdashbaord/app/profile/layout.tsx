import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your dashboard account details, security and preferences.",
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
