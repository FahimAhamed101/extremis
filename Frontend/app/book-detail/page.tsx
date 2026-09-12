"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ItemDetailPage from "@/components/detail/ItemDetailPage";
import { findCatalogItem } from "@/data/marketplaceCatalog";

function BookDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "python-tricks";
  const item = findCatalogItem(id, "book");

  return <ItemDetailPage item={item} type="book" />;
}

export default function BookDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading book details...</div>}>
      <BookDetailContent />
    </Suspense>
  );
}
