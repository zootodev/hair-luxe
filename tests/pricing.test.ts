import { describe, expect, it } from "vitest";
import { isStartPriceInRange, parsePriceRange } from "@/lib/pricing";
import { services } from "@/lib/data/services";
import { products } from "@/lib/data/products";

describe("parsePriceRange", () => {
  it("parses a naira range", () => {
    expect(parsePriceRange("\u20A6120,000 - \u20A6250,000")).toEqual({
      min: 120000,
      max: 250000,
    });
  });

  it("handles a single value", () => {
    expect(parsePriceRange("From \u20A680,000")).toEqual({ min: 80000, max: 80000 });
  });

  it("returns null when nothing can be parsed", () => {
    expect(parsePriceRange("free")).toBeNull();
    expect(parsePriceRange("")).toBeNull();
  });
});

describe("isStartPriceInRange", () => {
  it("accepts values inside the range", () => {
    expect(isStartPriceInRange(120000, "\u20A6120,000 - \u20A6250,000")).toBe(true);
    expect(isStartPriceInRange(250000, "\u20A6120,000 - \u20A6250,000")).toBe(true);
    expect(isStartPriceInRange(180000, "\u20A6120,000 - \u20A6250,000")).toBe(true);
  });

  it("rejects values outside the range (the 1000x-too-small regression)", () => {
    expect(isStartPriceInRange(80, "\u20A6120,000 - \u20A6250,000")).toBe(false);
    expect(isStartPriceInRange(999999, "\u20A6120,000 - \u20A6250,000")).toBe(false);
    expect(isStartPriceInRange(NaN, "\u20A6120,000 - \u20A6250,000")).toBe(false);
  });

  it("does not block saves when the range is unparseable", () => {
    expect(isStartPriceInRange(50000, "Call for pricing")).toBe(true);
  });
});

describe("seed data sanity", () => {
  it("every seed service start price falls within its advertised range", () => {
    for (const service of services) {
      expect(
        isStartPriceInRange(service.startingPrice, service.priceRange),
        `${service.id}: startingPrice ${service.startingPrice} outside "${service.priceRange}"`
      ).toBe(true);
    }
  });

  it("seed service start prices are in naira, not dollars-scale", () => {
    for (const service of services) {
      expect(
        service.startingPrice,
        `${service.id}: startingPrice ${service.startingPrice} looks like a pre-naira value`
      ).toBeGreaterThanOrEqual(10000);
    }
  });

  it("seed product prices are in naira, not dollars-scale", () => {
    for (const product of products) {
      expect(
        product.price,
        `${product.id}: price ${product.price} looks like a pre-naira value`
      ).toBeGreaterThanOrEqual(10000);
    }
  });
});
