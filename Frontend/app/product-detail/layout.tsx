import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details – Updates Social Marketplace",
  description: "View product specifications, seller ratings, community reviews, and order on Updates.",
  alternates: {
    canonical: "/product-detail",
  },
};

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
