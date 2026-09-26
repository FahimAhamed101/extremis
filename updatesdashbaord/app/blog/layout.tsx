import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Write, publish and manage blog posts for the Updates community.",
};

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
