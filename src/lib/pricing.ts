/**
 * Pricing helpers for the admin catalog editor.
 */

export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Parse a human price range such as "₦120,000 - ₦250,000" into numbers.
 * Returns null when no range can be extracted.
 */
export function parsePriceRange(range: string): PriceRange | null {
  const matches = (range ?? "").match(/\d[\d,]*/g);
  if (!matches || matches.length === 0) return null;
  const values = matches.map((m) => Number(m.replace(/,/g, ""))).filter(Number.isFinite);
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max };
}

/**
 * A start price is valid when it sits inside the advertised range
 * (inclusive, with a small tolerance for rounding).
 */
export function isStartPriceInRange(startingPrice: number, range: string): boolean {
  const parsed = parsePriceRange(range);
  if (!parsed) return true; // nothing to validate against
  if (!Number.isFinite(startingPrice)) return false;
  return startingPrice >= parsed.min && startingPrice <= parsed.max;
}
