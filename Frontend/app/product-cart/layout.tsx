import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart – Updates Marketplace",
  description: "View and manage items in your Updates marketplace cart.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductCartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
