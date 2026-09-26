import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Traffic, engagement and growth metrics for the Updates social platform.",
};

export default function AnalyticsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
