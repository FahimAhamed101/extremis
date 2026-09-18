import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart – Updates Community Shop",
  description: "View and manage items in your Updates cart.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
