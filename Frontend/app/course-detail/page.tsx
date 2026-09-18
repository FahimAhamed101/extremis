"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CourseDetailClient from "@/components/courses/CourseDetailClient";

function CourseDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "learn-basic-javascript";

  return <CourseDetailClient courseId={id} />;
}

export default function CourseDetailPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <div className="loader">
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
          </div>
        </div>
      }
    >
      <CourseDetailContent />
    </Suspense>
  );
}
