import { describe, expect, it } from "vitest";
import { productGallery } from "@/lib/product-gallery";

describe("productGallery", () => {
  it("shows the stored product image first and drops the old seed image", () => {
    expect(
      productGallery({
        image: "https://example.com/admin-image.jpg",
        images: [
          "https://example.com/seed-image.jpg",
          "https://example.com/second-image.jpg",
        ],
      })
    ).toEqual([
      "https://example.com/admin-image.jpg",
      "https://example.com/second-image.jpg",
    ]);
  });

  it("keeps the seed gallery when the stored image matches its first image", () => {
    expect(
      productGallery({
        image: "https://example.com/seed-image.jpg",
        images: [
          "https://example.com/seed-image.jpg",
          "https://example.com/second-image.jpg",
        ],
      })
    ).toEqual([
      "https://example.com/seed-image.jpg",
      "https://example.com/second-image.jpg",
    ]);
  });

  it("falls back to the product image when there are no gallery images", () => {
    expect(
      productGallery({
        image: "https://example.com/admin-image.jpg",
        images: [],
      })
    ).toEqual(["https://example.com/admin-image.jpg"]);
  });
});
