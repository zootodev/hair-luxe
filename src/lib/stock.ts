import { getProductById, products } from "@/lib/data/products";
import type { CartItem } from "@/lib/types";

const SOLD_KEY = "zooto-luxe-sold";

export interface StockRecord {
  productId: string;
  quantity: number;
}

function readSold(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SOLD_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function getSoldCount(productId: string): number {
  return readSold()[productId] ?? 0;
}

export function getAvailableStock(productId: string): number {
  const product = getProductById(productId);
  if (!product) return 0;
  const sold = getSoldCount(productId);
  return Math.max(0, product.stockCount - sold);
}

export function recordSold(items: CartItem[]): void {
  const sold = readSold();
  for (const item of items) {
    sold[item.productId] = (sold[item.productId] ?? 0) + item.quantity;
  }
  localStorage.setItem(SOLD_KEY, JSON.stringify(sold));
}

export function availableStockForItem(item: CartItem): number {
  return getAvailableStock(item.productId);
}

export function outOfStockProducts(): string[] {
  return products.filter((p) => getAvailableStock(p.id) <= 0).map((p) => p.id);
}