import type { Metadata } from "next";
import ItemDetailPage from "@/components/detail/ItemDetailPage";
import { findCatalogItem } from "@/data/marketplaceCatalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = findCatalogItem(id, "book");
  const title = item ? `${item.name} – Books on Updates` : "Book Details | Updates";
  const description = item?.description || "Explore books and publications on Updates social network.";

  return {
    title,
    description,
    alternates: {
      canonical: `/books/${id}`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

export default async function DynamicBookPage({ params }: PageProps) {
  const { id } = await params;
  const item = findCatalogItem(id, "book");

  return <ItemDetailPage item={item} type="book" />;
}
