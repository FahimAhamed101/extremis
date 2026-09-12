import ItemDetailPage from "@/components/detail/ItemDetailPage";
import { findCatalogItem } from "@/data/marketplaceCatalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { id } = await params;
  const item = findCatalogItem(id, "product");

  return <ItemDetailPage item={item} type="product" />;
}
