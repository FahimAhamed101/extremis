import React, { Suspense } from "react";
import { Metadata } from "next";
import UniversityProfileClient from "@/components/university/UniversityProfileClient";

export const metadata: Metadata = {
  title: "Akdeniz University Profile | Socimo",
  description: "Explore Akdeniz University faculty, academic departments, researchers, and invite colleagues on Socimo.",
};

export default function AboutUniversityHtmlPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <div className="loader">
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
          </div>
        </div>
      }
    >
      <UniversityProfileClient />
    </Suspense>
  );
}
