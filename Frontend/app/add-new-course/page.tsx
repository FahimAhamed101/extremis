import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AddNewCourseClient from "@/components/courses/AddNewCourseClient";

export const metadata: Metadata = {
  title: "Add New Course or Book | Socimo",
  description: "Publish your interactive course or academic textbook to the Socimo marketplace.",
};

export default function AddNewCoursePage() {
  return (
    <RequireAuth>
      <AddNewCourseClient />
    </RequireAuth>
  );
}
