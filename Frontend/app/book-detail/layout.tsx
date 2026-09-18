import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Details – Updates Community Library",
  description: "View book details, reviews, author information, and reader discussions on Updates.",
  alternates: {
    canonical: "/book-detail",
  },
};

export default function BookDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
