import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Marketplace & Products – Updates Community Shop",
  description:
    "Buy and sell products, discover items from friends and creators, and browse the community marketplace on Updates.",
  alternates: {
    canonical: "/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
