import { beforeEach, describe, expect, it } from "vitest";
import {
  getLiveProductById,
  getLiveProducts,
  getLiveServiceById,
  getLiveServices,
} from "@/lib/catalog";
import {
  deleteCatalogProduct,
  deleteCatalogService,
  saveCatalogProduct,
  saveCatalogService,
} from "@/lib/store";

/**
 * Regression tests for the admin "Add Product" / "Add Service" create flow:
 * entries that don't exist in the seed data must still appear in the live
 * catalog, be findable by id, and survive deletion.
 */
describe("admin-created catalog entries", () => {
  beforeEach(async () => {
    await deleteCatalogProduct("test-created-product");
    await deleteCatalogService("test-created-service");
  });

  it("includes created products in the live catalog and by-id lookup", async () => {
    await saveCatalogProduct("test-created-product", {
      name: "Test Created Wig",
      description: "A wig created from the admin.",
      category: "Wigs",
      price: 150000,
      compareAtPrice: null,
      stockCount: 4,
      image: "https://example.com/wig.jpg",
      rating: 0,
      reviewCount: 0,
      details: [],
      featured: false,
      visible: true,
    });

    const all = await getLiveProducts();
    const created = all.find((p) => p.id === "test-created-product");
    expect(created).toBeDefined();
    expect(created?.name).toBe("Test Created Wig");
    expect(created?.price).toBe(150000);
    expect(created?.visible).toBe(true);

    const byId = await getLiveProductById("test-created-product");
    expect(byId?.name).toBe("Test Created Wig");
  });

  it("skips created products without a name or valid price", async () => {
    await saveCatalogProduct("test-created-product", {
      name: "",
      price: -5,
      category: "Wigs",
    });
    const all = await getLiveProducts();
    expect(all.find((p) => p.id === "test-created-product")).toBeUndefined();
  });

  it("includes created services in the live catalog and by-id lookup", async () => {
    await saveCatalogService("test-created-service", {
      name: "Test Created Service",
      description: "A service created from the admin.",
      category: "Hair",
      priceRange: "\u20A650,000 - \u20A690,000",
      startingPrice: 50000,
      duration: "1 hour",
      includes: [],
      featured: false,
      visible: true,
    });

    const all = await getLiveServices();
    const created = all.find((s) => s.id === "test-created-service");
    expect(created).toBeDefined();
    expect(created?.startingPrice).toBe(50000);
    expect(created?.visible).toBe(true);

    const byId = await getLiveServiceById("test-created-service");
    expect(byId?.name).toBe("Test Created Service");
  });

  it("still returns seed services", async () => {
    const all = await getLiveServices();
    expect(all.length).toBeGreaterThanOrEqual(6);
    expect(all.find((s) => s.id === "wig-making")).toBeDefined();
  });
});
