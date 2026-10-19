import type { Product } from "@/lib/types";

/**
 * Case-insensitive shop search: matches a product's name, category or
 * description. Used by both the server-rendered shop page and the client-side
 * grid so the result count and the grid always describe the same list.
 */
export function productMatchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    product.name.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q)
  );
}
