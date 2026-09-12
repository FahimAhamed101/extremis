import ItemDetailPage from "@/components/detail/ItemDetailPage";
import { findCatalogItem } from "@/data/marketplaceCatalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DynamicBookPage({ params }: PageProps) {
  const { id } = await params;
  const item = findCatalogItem(id, "book");

  return <ItemDetailPage item={item} type="book" />;
}
