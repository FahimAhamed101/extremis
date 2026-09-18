import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResultClient from "@/components/search/SearchResultClient";

export const metadata: Metadata = {
  title: "Search Friends, Groups & Posts – Updates Social Network",
  description:
    "Search people, friends, family members, community groups, pages, and posts across the Updates social platform.",
  alternates: {
    canonical: "/search-result",
  },
};

export default function SearchResultPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading search results...</div>}>
      <SearchResultClient />
    </Suspense>
  );
}
