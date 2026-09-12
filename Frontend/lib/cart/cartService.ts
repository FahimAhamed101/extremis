export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  type?: string;
  author?: string;
  category?: string;
  desc?: string;
};

export const CART_STORAGE_KEY = "socimo_cart_items";
export const CART_EVENT_KEY = "socimo_cart_updated";

export const DEFAULT_INITIAL_CART: CartItem[] = [
  {
    id: "c-1",
    name: "The Complete Web Architecture Guide",
    author: "Gray David",
    category: "Hardcover & eBook",
    price: 29.99,
    qty: 1,
    img: "/images/resources/cart1.jpg",
    type: "book",
    desc: "Comprehensive guide to full-stack cloud and distributed systems.",
  },
  {
    id: "c-2",
    name: "Vue.js 3 & TypeScript Masterclass",
    author: "Sarah Jenkins",
    category: "Video Course",
    price: 49.99,
    qty: 1,
    img: "/images/resources/cart2.jpg",
    type: "course",
    desc: "In-depth video training with production composition API architecture.",
  },
  {
    id: "c-3",
    name: "Advanced CSS3 Animations & Grid Systems",
    author: "Alex Rivera",
    category: "Interactive Handbook",
    price: 34.99,
    qty: 1,
    img: "/images/resources/cart3.jpg",
    type: "book",
    desc: "Modern layouts, flexbox, grid, and hardware-accelerated transitions.",
  },
];

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return DEFAULT_INITIAL_CART;
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      // First time initialization
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_CART));
      return DEFAULT_INITIAL_CART;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_INITIAL_CART;
  } catch {
    return DEFAULT_INITIAL_CART;
  }
}

export function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(CART_EVENT_KEY, { detail: items }));
  } catch (err) {
    console.error("Failed to save cart items:", err);
  }
}

export function addToCart(item: Omit<CartItem, "qty"> & { qty?: number }): CartItem[] {
  const currentItems = getCartItems();
  const quantityToAdd = item.qty && item.qty > 0 ? item.qty : 1;

  const existingIndex = currentItems.findIndex((it) => it.id === item.id);
  let updatedItems: CartItem[];

  if (existingIndex >= 0) {
    updatedItems = currentItems.map((it, idx) =>
      idx === existingIndex ? { ...it, qty: it.qty + quantityToAdd } : it
    );
  } else {
    updatedItems = [
      ...currentItems,
      {
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        qty: quantityToAdd,
        img: item.img || "/images/resources/book3.jpg",
        type: item.type || "product",
        author: item.author || "",
        category: item.category || "",
        desc: item.desc || "",
      },
    ];
  }

  saveCartItems(updatedItems);
  return updatedItems;
}

export function updateCartQuantity(id: string, qty: number): CartItem[] {
  const currentItems = getCartItems();
  let updatedItems: CartItem[];

  if (qty <= 0) {
    updatedItems = currentItems.filter((it) => it.id !== id);
  } else {
    updatedItems = currentItems.map((it) => (it.id === id ? { ...it, qty } : it));
  }

  saveCartItems(updatedItems);
  return updatedItems;
}

export function removeFromCart(id: string): CartItem[] {
  const currentItems = getCartItems();
  const updatedItems = currentItems.filter((it) => it.id !== id);
  saveCartItems(updatedItems);
  return updatedItems;
}

export function clearCart(): void {
  saveCartItems([]);
}

export function getCartTotalCount(): number {
  const items = getCartItems();
  return items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
}

export function getCartSubtotal(): number {
  const items = getCartItems();
  return items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
}

export function onCartChange(callback: (items: CartItem[]) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CartItem[]>;
    if (customEvent.detail && Array.isArray(customEvent.detail)) {
      callback(customEvent.detail);
    } else {
      callback(getCartItems());
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      callback(getCartItems());
    }
  };

  window.addEventListener(CART_EVENT_KEY, handler);
  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(CART_EVENT_KEY, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
