"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, DeliveryMethod, DeliveryZoneSettings } from "@/lib/types";
import { BUSINESS, DELIVERY_ZONES } from "@/lib/config";
import { getAvailableStock } from "@/lib/stock";

export interface LiveCatalogProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  stockCount: number;
  sold: number;
  visible: boolean;
}

export interface LiveCatalogBusiness {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  phoneFormatted: string;
  address: string;
  city: string;
  hours: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

interface LiveCatalogPayload {
  products: LiveCatalogProduct[];
  settings: {
    deliveryZones: DeliveryZoneSettings[];
    deliveryFee: number;
    freeDeliveryOver: number;
    business: LiveCatalogBusiness;
    announcement: { enabled: boolean; text: string };
  };
}

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
  deliveryZones: DeliveryZoneSettings[];
  business: LiveCatalogBusiness;
  announcement: { enabled: boolean; text: string };
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "hair-luxe-cart";

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

function reconcileItems(items: CartItem[], products: LiveCatalogProduct[]): CartItem[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  return items.flatMap((i) => {
    const p = byId.get(i.productId);
    if (!p || p.visible === false) return [];
    const quantity = Math.min(i.quantity, Math.max(0, p.stockCount - p.sold));
    if (quantity <= 0) return [];
    return [
      {
        ...i,
        name: p.name,
        price: p.price,
        image: p.image,
        quantity,
      },
    ];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [deliveryZone, setDeliveryZone] = useState<string>(DELIVERY_ZONES[1].name);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZoneSettings[]>(
    DELIVERY_ZONES.map((z) => ({ ...z }))
  );
  const [deliveryFeeDefaults, setDeliveryFeeDefaults] = useState({
    fee: BUSINESS.deliveryFee,
    freeOver: BUSINESS.freeDeliveryOver,
  });
  const [business, setBusiness] = useState<LiveCatalogBusiness>({
    name: BUSINESS.name,
    tagline: BUSINESS.tagline,
    email: BUSINESS.email,
    phone: BUSINESS.phone,
    phoneFormatted: BUSINESS.phoneFormatted,
    address: BUSINESS.address,
    city: BUSINESS.city,
    hours: BUSINESS.hours,
    bankDetails: { ...BUSINESS.bankDetails },
  });
  const [announcement, setAnnouncement] = useState({
    enabled: false,
    text: "",
  });
  const [loaded, setLoaded] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time local storage hydrate after mount */
  useEffect(() => {
    setItems(loadCart());
    if (typeof window !== "undefined") {
      const method = localStorage.getItem("hair-luxe-method") as DeliveryMethod | null;
      const zone = localStorage.getItem("hair-luxe-zone");
      if (method) setDeliveryMethod(method);
      if (zone) setDeliveryZone(zone);
    }
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;

    fetch("/api/catalog", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<LiveCatalogPayload>) : null))
      .then((data) => {
        if (!data || cancelled) return;
        if (data.settings.deliveryZones.length > 0) {
          setDeliveryZones(data.settings.deliveryZones);
          setDeliveryFeeDefaults({
            fee: data.settings.deliveryFee,
            freeOver: data.settings.freeDeliveryOver,
          });
          setDeliveryZone((zone) =>
            data.settings.deliveryZones.some((z) => z.name === zone)
              ? zone
              : data.settings.deliveryZones[0].name
          );
        }
        setBusiness(data.settings.business);
        setAnnouncement(data.settings.announcement);
        setItems((prev) => reconcileItems(prev, data.products));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("hair-luxe-method", deliveryMethod);
  }, [deliveryMethod, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("hair-luxe-zone", deliveryZone);
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
          i.productId === item.productId
            ? { ...i, quantity: capped, price: item.price, name: item.name, image: item.image }
            : i
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
  const deliveryFee = (() => {
    if (deliveryMethod === "pickup") return 0;
    const info = deliveryZones.find((z) => z.name === deliveryZone);
    const fee = info?.fee ?? deliveryFeeDefaults.fee;
    if (deliveryFeeDefaults.freeOver > 0 && subtotal >= deliveryFeeDefaults.freeOver) {
      return 0;
    }
    return fee;
  })();
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
    deliveryZones,
    business,
    announcement,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}