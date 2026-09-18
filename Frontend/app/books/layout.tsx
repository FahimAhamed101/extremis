import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books & Literature – Community Library on Updates",
  description:
    "Explore, read, and share books, literature, and educational publications with friends and community members on Updates.",
  alternates: {
    canonical: "/books",
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
