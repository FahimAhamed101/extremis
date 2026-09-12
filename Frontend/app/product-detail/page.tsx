"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ItemDetailPage from "@/components/detail/ItemDetailPage";
import { findCatalogItem } from "@/data/marketplaceCatalog";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "p-1";
  const item = findCatalogItem(id, "product");

  return <ItemDetailPage item={item} type="product" />;
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px", textAlign: "center" }}>Loading product details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
