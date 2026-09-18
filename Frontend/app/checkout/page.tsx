import ProductCheckoutClient from "@/components/checkout/ProductCheckoutClient";

export const metadata = {
  title: "Secure Checkout – Updates Community Shop",
  description: "Secure checkout for Updates marketplace orders.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <ProductCheckoutClient />;
}
