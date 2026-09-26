import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Moderate product, course and seller reviews across the marketplace.",
};

export default function ReviewsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
