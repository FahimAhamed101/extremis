import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";

export const metadata: Metadata = {
  title: "Groups",
};

function resolveGroupsTemplatePath(): string {
  const candidates = [
    path.join(process.cwd(), "content", "groups.txt"),
    path.join(process.cwd(), "extremis", "content", "groups.txt"),
  ];

  const foundPath = candidates.find((candidatePath) => fs.existsSync(candidatePath));
  if (!foundPath) {
    throw new Error("groups.txt template was not found.");
  }

  return foundPath;
}

function normalizeTemplateHtml(html: string): string {
  const bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;

  return bodyContent
    .replace(/<div\s+class=["']responsive-header["'][\s\S]*?<!--\s*responsive header\s*-->/i, "")
    .replace(/<header\b[\s\S]*?<!--\s*header\s*-->/i, "")
    .replace(/<nav\s+class=["']sidebar["'][\s\S]*?<!--\s*nav sidebar\s*-->/i, "")
    .replace(/<section>\s*<div\s+class=["']white-bg["'][\s\S]*?<!--\s*carousel menu\s*-->/i, "")
    .replace(/<div[^>]*class=["'][^"']*\bresponsive-header\b[^"']*["'][^>]*>[\s\S]*?<\/div>\s*<header\b/i, "<header")
    .replace(/<header\b[\s\S]*?<\/header>/gi, "")
    .replace(/<section[^>]*class=["'][^"']*\bheader-shortcuts\b[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, "")
    .replace(/<nav[^>]*class=["'][^"']*\bsidebar\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/gi, "")
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
    .replace(/\bhref=(['"])groups\.html\1/gi, 'href="/groups"')
    .replace(/\bhref=(['"])blog\.html\1/gi, 'href="/blog"')
    .replace(/\bhref=(['"])messages\.html\1/gi, 'href="/messages"')
    .replace(/\bhref=(['"])profile(?:-page2)?\.html\1/gi, 'href="/profile"')
    .replace(/\bhref=(['"])sign-?in\.html\1/gi, 'href="/login"')
    .replace(/\bhref=(['"])signup\.html\1/gi, 'href="/signup"');
}

const groupsTemplate = fs.readFileSync(resolveGroupsTemplatePath(), "utf8");
const groupsMarkup = normalizeTemplateHtml(groupsTemplate);

export default function GroupsPage() {
  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />
        <div dangerouslySetInnerHTML={{ __html: groupsMarkup }} />
      </div>
    </RequireAuth>
  );
}

