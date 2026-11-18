import { describe, expect, it } from "vitest";
import { products } from "@/lib/data/products";

const UNVERIFIABLE_CLAIMS = [
  /luxurious/i,
  /\bpremium\b/i,
  /undetectable/i,
  /zero install/i,
  /100% unprocessed/i,
  /100% virgin/i,
  /virgin hair/i,
  /tangle-free/i,
  /zero shedding/i,
  /hypoallergenic/i,
  /cruelty-free/i,
];

const MINOR_WORDS = new Set(["and", "for", "in", "of", "on", "the", "to", "with"]);

describe("seed product copy", () => {
  it("does not make unverifiable product claims", () => {
    for (const product of products) {
      const copy = [product.name, product.description, ...(product.details ?? [])].join(" ");
      for (const claim of UNVERIFIABLE_CLAIMS) {
        expect(copy, product.id).not.toMatch(claim);
      }
    }
  });

  it("uses title case and unique names, with one growth serum oil", () => {
    const names = products.map((product) => product.name);

    expect(new Set(names.map((name) => name.toLowerCase())).size).toBe(names.length);

    for (const name of names) {
      for (const word of name.split(/\s+/)) {
        if (!/^[A-Za-z]/.test(word)) continue;
        if (MINOR_WORDS.has(word.toLowerCase())) continue;
        expect(word[0], name).toBe(word[0].toUpperCase());
      }
    }

    expect(names.filter((name) => /growth serum oil/i.test(name))).toHaveLength(1);
  });
});
