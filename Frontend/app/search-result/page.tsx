import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResultClient from "@/components/search/SearchResultClient";

export const metadata: Metadata = {
  title: "Search Results | Socimo",
  description: "Search research publications, community members, academic departments, and discussions on Socimo.",
};

export default function SearchResultPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading search results...</div>}>
      <SearchResultClient />
    </Suspense>
  );
}
