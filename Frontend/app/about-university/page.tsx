import React, { Suspense } from "react";
import { Metadata } from "next";
import UniversityProfileClient from "@/components/university/UniversityProfileClient";

export const metadata: Metadata = {
  title: "University & Campus Communities – Updates Social Network",
  description:
    "Explore university faculties, student clubs, campus groups, and connect with classmates and alumni on Updates.",
  alternates: {
    canonical: "/about-university",
  },
};

export default function AboutUniversityPage() {
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
