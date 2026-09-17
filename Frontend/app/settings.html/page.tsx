import { Suspense } from "react";
import type { Metadata } from "next";
import SettingsClient from "@/components/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Account Settings | Socimo",
  description: "Manage your Socimo account, notification preferences, privacy, billing and payout methods, and API clients.",
};

export default function SettingsHtmlPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading settings...</div>}>
      <SettingsClient />
    </Suspense>
  );
}
