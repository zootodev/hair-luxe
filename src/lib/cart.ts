import type { CartItem } from "@/lib/types";

/**
 * Identity for a cart line: one product plus its chosen colour and length.
 * The same product with a different variant is a different line.
 */
export function cartLineKey(
  item: Pick<CartItem, "productId" | "color" | "length">
): string {
  return [item.productId, item.color ?? "", item.length ?? ""]
    .map((part) => encodeURIComponent(part))
    .join("::");
}

/** Human-readable variant summary used on cart lines and order summaries. */
export function variantSummary(
  item: Pick<CartItem, "color" | "length">
): string {
  const parts: string[] = [];
  if (item.color) parts.push(`Colour: ${item.color}`);
  if (item.length) parts.push(`Length: ${item.length}`);
  return parts.join(" · ");
}

function otherQuantityForProduct(
  items: CartItem[],
  productId: string,
  lineKey: string
): number {
  return items.reduce((sum, item) => {
    if (item.productId !== productId) return sum;
    if (cartLineKey(item) === lineKey) return sum;
    return sum + item.quantity;
  }, 0);
}

/**
 * Add an item, merging only an identical product + colour + length line.
 * `maxQty` is the product's total stock, shared across all its variants.
 */
export function addCartLine(
  items: CartItem[],
  item: CartItem,
  maxQty: number
): CartItem[] {
  const lineKey = cartLineKey(item);
  const existing = items.find((line) => cartLineKey(line) === lineKey);
  const roomOnLine = Math.max(
    0,
    maxQty - otherQuantityForProduct(items, item.productId, lineKey)
  );
  const quantity = Math.min((existing?.quantity ?? 0) + item.quantity, roomOnLine);
  if (quantity <= 0) return items;

  if (existing) {
    return items.map((line) =>
      cartLineKey(line) === lineKey
        ? {
            ...line,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            color: item.color,
            length: item.length,
            quantity,
          }
        : line
    );
  }

  return [...items, { ...item, quantity }];
}

/** Set a line's quantity, still capped by the product's shared stock. */
export function setCartLineQuantity(
  items: CartItem[],
  lineKey: string,
  quantity: number,
  maxQty: number
): CartItem[] {
  const target = items.find((line) => cartLineKey(line) === lineKey);
  if (!target) return items;
  if (quantity <= 0) {
    return items.filter((line) => cartLineKey(line) !== lineKey);
  }

  const roomOnLine = Math.max(
    0,
    maxQty - otherQuantityForProduct(items, target.productId, lineKey)
  );
  const capped = Math.min(quantity, roomOnLine);
  if (capped <= 0) {
    return items.filter((line) => cartLineKey(line) !== lineKey);
  }

  return items.map((line) =>
    cartLineKey(line) === lineKey ? { ...line, quantity: capped } : line
  );
}
