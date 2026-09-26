import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertisements",
  description:
    "Create, schedule and measure advertising campaigns across the Updates platform.",
};

export default function AdvertisementsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
