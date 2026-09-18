"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartTotalCount, onCartChange } from "@/lib/cart/cartService";

export default function FloatingCartButton() {
  const [cartCount, setCartCount] = useState<number>(3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCartCount(getCartTotalCount());
    const unsubscribe = onCartChange(() => {
      setCartCount(getCartTotalCount());
    });
    return unsubscribe;
  }, []);

  const displayCount = cartCount > 99 ? "99+" : cartCount.toString().padStart(2, "0");

  return (
    <div className="cart-product" title="Shopping Cart">
      <Link href="/cart" aria-label={`View Cart (${cartCount} items)`}>
        <i className="icofont-cart-alt"></i>
      </Link>
      <span aria-hidden="true">{mounted ? displayCount : "03"}</span>
    </div>
  );
}
