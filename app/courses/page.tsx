import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

function resolveCoursesTemplatePath(): string {
  const candidates = [
    path.join(process.cwd(), "content", "courses.txt"),
    path.join(process.cwd(), "extremis", "content", "courses.txt"),
  ];

  const foundPath = candidates.find((candidatePath) => fs.existsSync(candidatePath));
  if (!foundPath) {
    throw new Error("courses.txt template was not found.");
  }

  return foundPath;
}

function normalizeTemplateHtml(html: string): string {
  const bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;

  return bodyContent
    .replace(
      /<div[^>]*id=["']page-loader["'][^>]*>[\s\S]*?<\/div>\s*<!--\s*page loader\s*-->/gi,
      ""
    )
    .replace(/<div[^>]*id=["']page-loader["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\b(src|href)=["']images\//gi, '$1="/images/')
    .replace(/\b(src|href)=["']js\//gi, '$1="/js/')
    .replace(/\b(src|href)=["']css\//gi, '$1="/css/')
    .replace(/url\((['"]?)images\//gi, "url($1/images/")
    .replace(/\bhref=(['"])index\.html\1/gi, 'href="/"')
    .replace(/\bhref=(['"])videos\.html\1/gi, 'href="/videos"')
    .replace(/\bhref=(['"])courses\.html\1/gi, 'href="/courses"')
    .replace(/\bhref=(['"])blog\.html\1/gi, 'href="/blog"')
    .replace(/\bhref=(['"])messages\.html\1/gi, 'href="/messages"')
    .replace(/\bhref=(['"])profile(?:-page2)?\.html\1/gi, 'href="/profile"')
    .replace(/\bhref=(['"])sign-?in\.html\1/gi, 'href="/login"')
    .replace(/\bhref=(['"])signup\.html\1/gi, 'href="/signup"');
}

const coursesTemplate = fs.readFileSync(resolveCoursesTemplatePath(), "utf8");
const coursesMarkup = normalizeTemplateHtml(coursesTemplate);

export default function CoursesPage() {
  return <div dangerouslySetInnerHTML={{ __html: coursesMarkup }} />;
}
