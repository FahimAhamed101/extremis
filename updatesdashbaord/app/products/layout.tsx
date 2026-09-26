import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage the marketplace catalogue, stock levels and pricing.",
};

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
