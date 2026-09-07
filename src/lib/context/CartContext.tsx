"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, DeliveryMethod } from "@/lib/types";
import { BUSINESS, DELIVERY_ZONES } from "@/lib/config";
import { getAvailableStock } from "@/lib/stock";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  restockCheck: (items: CartItem[]) => CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  deliveryZone: string;
  setDeliveryZone: (zone: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "zooto-luxe-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as CartItem[]) : [];
    return parsed
      .map((i) => ({ ...i, quantity: Math.min(i.quantity, getAvailableStock(i.productId)) }))
      .filter((i) => i.quantity > 0);
  } catch {
    return [];
  }
}

function findDeliveryFee(method: DeliveryMethod, zone: string): number {
  if (method === "pickup") return 0;
  const found = DELIVERY_ZONES.find((z) => z.name === zone);
  return found ? found.fee : BUSINESS.deliveryFee;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [deliveryZone, setDeliveryZone] = useState<string>(DELIVERY_ZONES[1].name);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    if (typeof window !== "undefined") {
      const method = localStorage.getItem("zooto-luxe-method") as DeliveryMethod | null;
      const zone = localStorage.getItem("zooto-luxe-zone");
      if (method) setDeliveryMethod(method);
      if (zone) setDeliveryZone(zone);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("zooto-luxe-method", deliveryMethod);
  }, [deliveryMethod, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("zooto-luxe-zone", deliveryZone);
  }, [deliveryZone, loaded]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      const newQty = (existing?.quantity ?? 0) + item.quantity;
      const maxQty = getAvailableStock(item.productId);
      const capped = Math.max(0, Math.min(newQty, maxQty));
      if (capped <= 0) return prev;
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: capped } : i
        );
      }
      return [...prev, { ...item, quantity: capped }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    const maxQty = getAvailableStock(productId);
    const capped = Math.min(quantity, maxQty);
    if (capped <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: capped } : i))
    );
  };

  const clearCart = () => setItems([]);

  const restockCheck = (itemsToCheck: CartItem[]): CartItem[] => {
    return itemsToCheck
      .filter((i) => i.quantity > 0)
      .map((i) => {
        const maxQty = getAvailableStock(i.productId);
        return { ...i, quantity: Math.min(i.quantity, maxQty) };
      })
      .filter((i) => i.quantity > 0);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const fee = findDeliveryFee(deliveryMethod, deliveryZone);
  const deliveryFee = deliveryMethod === "delivery" ? fee : 0;
  const total = subtotal + deliveryFee;

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    restockCheck,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    deliveryMethod,
    setDeliveryMethod,
    deliveryZone,
    setDeliveryZone,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}