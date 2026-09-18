import ProductCheckoutClient from "@/components/checkout/ProductCheckoutClient";

export const metadata = {
  title: "Product Checkout – Updates Marketplace",
  description: "Secure checkout for Updates products and community items.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductCheckoutPage() {
  return <ProductCheckoutClient />;
}
