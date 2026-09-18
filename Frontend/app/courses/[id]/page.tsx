import React from "react";
import type { Metadata } from "next";
import CourseDetailClient from "@/components/courses/CourseDetailClient";
import { findCourseItem } from "@/data/coursesCatalog";

interface CoursePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const course = findCourseItem(id);
  return {
    title: `${course.title} | Socimo Courses`,
    description: course.description,
  };
}

export default async function CourseDynamicPage({ params }: CoursePageProps) {
  const { id } = await params;
  const course = findCourseItem(id);

  return <CourseDetailClient initialCourse={course} courseId={id} />;
}
