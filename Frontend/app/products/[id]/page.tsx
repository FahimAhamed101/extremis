import type { Metadata } from "next";
import ItemDetailPage from "@/components/detail/ItemDetailPage";
import { findCatalogItem } from "@/data/marketplaceCatalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = findCatalogItem(id, "product");
  const title = item ? `${item.name} – Marketplace on Updates` : "Product Details | Updates";
  const description = item?.description || "Explore marketplace products on Updates social network.";

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${id}`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { id } = await params;
  const item = findCatalogItem(id, "product");

  return <ItemDetailPage item={item} type="product" />;
}
