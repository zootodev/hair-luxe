import type { Product } from "@/lib/types";

type PricedProduct = Pick<Product, "price"> & Partial<Pick<Product, "colors" | "lengths" | "lengthPrices">>;

/**
 * The price a customer pays for a product at the chosen length.
 *
 * Wigs can list a different price per length. Products without a matching
 * per-length price (or without per-length pricing at all) keep the single
 * `price` shown everywhere else.
 */
export function priceForLength(
  product: PricedProduct,
  length?: string | null
): number {
  if (!length) return product.price;
  const lengthPrice = product.lengthPrices?.[length];
  return typeof lengthPrice === "number" && Number.isFinite(lengthPrice) && lengthPrice > 0
    ? lengthPrice
    : product.price;
}

/** The variants shown by default when a customer adds straight from a card. */
export function defaultVariant(product: PricedProduct): {
  color?: string;
  length?: string;
} {
  return {
    color: product.colors?.[0],
    length: product.lengths?.[0],
  };
}

/**
 * True when a product's prices differ by length, so the storefront can say
 * "From ₦..." instead of implying every length costs the same.
 */
export function hasVaryingLengthPrices(product: PricedProduct): boolean {
  const lengths = product.lengths ?? [];
  if (lengths.length < 2) return false;
  return new Set(lengths.map((length) => priceForLength(product, length))).size > 1;
}
