import { Suspense } from "react";
import type { Metadata } from "next";
import SettingsClient from "@/components/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Account Settings & Privacy – Updates Social Network",
  description:
    "Manage your Updates account, notification preferences, privacy, security, and profile details.",
};

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading settings...</div>}>
      <SettingsClient />
    </Suspense>
  );
}
