import type { Metadata } from "next";
import PayoutPageClient from "@/components/payout/PayoutPageClient";

export const metadata: Metadata = {
  title: "Creator Earnings & Payouts – Monetize on Updates",
  description:
    "View creator earnings, sales statements, and payout history on the Updates social platform.",
  alternates: {
    canonical: "/payout",
  },
};

export default function PayoutPage() {
  return <PayoutPageClient />;
}
