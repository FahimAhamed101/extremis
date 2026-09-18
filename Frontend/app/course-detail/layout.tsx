import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Overview – Updates Learning & Community",
  description: "View course lessons, curriculum, student reviews, and instructor details on Updates.",
  alternates: {
    canonical: "/course-detail",
  },
};

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
