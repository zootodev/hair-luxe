import { describe, expect, it } from "vitest";
import { addCartLine, cartLineKey, variantSummary } from "@/lib/cart";
import { priceForLength } from "@/lib/product-pricing";
import type { CartItem } from "@/lib/types";

const braidWig: CartItem = {
  productId: "closure-wig-goddess",
  name: "Braid wig",
  price: 180000,
  image: "https://example.com/braid-wig.jpg",
  quantity: 1,
  category: "Wigs",
  color: "Natural Black",
  length: "16 inches",
};

describe("cart variant lines", () => {
  it("keys the same product with a different colour or length separately", () => {
    const otherColour = { ...braidWig, color: "Dark Brown" };
    const otherLength = { ...braidWig, length: "20 inches" };

    expect(cartLineKey(braidWig)).not.toBe(cartLineKey(otherColour));
    expect(cartLineKey(braidWig)).not.toBe(cartLineKey(otherLength));
  });

  it("keeps different variants as separate lines and merges only identical ones", () => {
    const withBlack = addCartLine([], braidWig, 12);
    const withBrown = addCartLine(
      withBlack,
      { ...braidWig, color: "Dark Brown", length: "20 inches" },
      12
    );

    expect(withBrown).toHaveLength(2);
    expect(withBrown.filter((item) => item.productId === braidWig.productId)).toHaveLength(2);

    const merged = addCartLine(withBrown, { ...braidWig, quantity: 2 }, 12);
    expect(merged).toHaveLength(2);
    expect(
      merged.find((item) => cartLineKey(item) === cartLineKey(braidWig))?.quantity
    ).toBe(3);
  });

  it("describes the chosen colour and length for a cart line", () => {
    expect(variantSummary(braidWig)).toBe(
      "Colour: Natural Black · Length: 16 inches"
    );
    expect(variantSummary({ ...braidWig, color: undefined })).toBe("Length: 16 inches");
    expect(variantSummary({ color: undefined, length: undefined })).toBe("");
  });
});

describe("per-length pricing", () => {
  const pricedWig = {
    price: 180000,
    lengthPrices: {
      "16 inches": 180000,
      "20 inches": 205000,
      "24 inches": 230000,
    },
  };

  it("uses the price for the selected length", () => {
    expect(priceForLength(pricedWig, "20 inches")).toBe(205000);
  });

  it("falls back to the single price when a length has no override", () => {
    expect(priceForLength(pricedWig, "28 inches")).toBe(180000);
    expect(priceForLength({ price: 45000 }, "20 inches")).toBe(45000);
  });
});
