import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AddNewCourseClient from "@/components/courses/AddNewCourseClient";

export const metadata: Metadata = {
  title: "Publish Course or Book – Updates Creator Studio",
  description:
    "Publish your educational course or publication to the Updates community marketplace and reach thousands of learners.",
  alternates: {
    canonical: "/add-new-course",
  },
};

export default function AddNewCoursePage() {
  return (
    <RequireAuth>
      <AddNewCourseClient />
    </RequireAuth>
  );
}
