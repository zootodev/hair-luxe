import { describe, expect, it } from "vitest";
import { computeLiveDeliveryFee, defaultSettings, getPublicCatalog } from "@/lib/catalog";
import type { SiteSettings } from "@/lib/types";

/**
 * The client-side formula in src/lib/context/CartContext.tsx. CartContext
 * mirrors the server so the checkout total always matches the total the
 * server computes in createOrderServer(); if either side changes, this test
 * must fail.
 */
function clientDeliveryFee(
  subtotal: number,
  zoneFee: number,
  freeDeliveryOver: number
): number {
  if (freeDeliveryOver > 0 && subtotal >= freeDeliveryOver) return 0;
  return zoneFee;
}

function withThreshold(freeDeliveryOver: number): SiteSettings {
  return { ...defaultSettings(), freeDeliveryOver };
}

describe("server delivery fee (computeLiveDeliveryFee)", () => {
  it("charges nothing for pickup", () => {
    const settings = defaultSettings();
    expect(computeLiveDeliveryFee(settings, "pickup", "Lagos Mainland", 999_999_999)).toBe(0);
  });

  it("charges the zone fee below the free-delivery threshold", () => {
    const settings = withThreshold(250_000);
    const zone = settings.deliveryZones[1];
    expect(computeLiveDeliveryFee(settings, "delivery", zone.name, zone.fee)).toBe(zone.fee);
  });

  it("waives the fee exactly at the threshold, not just above it", () => {
    const settings = withThreshold(250_000);
    expect(computeLiveDeliveryFee(settings, "delivery", "Lagos Mainland", 250_000)).toBe(0);
    expect(computeLiveDeliveryFee(settings, "delivery", "Lagos Mainland", 250_001)).toBe(0);
    expect(computeLiveDeliveryFee(settings, "delivery", "Lagos Mainland", 249_999)).toBeGreaterThan(0);
  });

  it("keeps charging when the threshold is disabled (0)", () => {
    const settings = withThreshold(0);
    expect(computeLiveDeliveryFee(settings, "delivery", "Lagos Mainland", 900_000)).toBe(
      settings.deliveryZones[0].fee
    );
  });

  it("falls back to the default fee for an unknown zone", () => {
    const settings = withThreshold(250_000);
    expect(computeLiveDeliveryFee(settings, "delivery", "Not A Zone", 1_000)).toBe(
      settings.deliveryFee
    );
  });

  it("matches the client formula for every zone, threshold and subtotal", () => {
    const settings = defaultSettings();
    const thresholds = [0, 100_000, settings.freeDeliveryOver];
    const subtotals = [0, 1, 99_999, 100_000, 249_999, 250_000, 250_001, 900_000];

    for (const zone of settings.deliveryZones) {
      for (const threshold of thresholds) {
        for (const subtotal of subtotals) {
          expect({
            zone: zone.name,
            threshold,
            subtotal,
            fee: computeLiveDeliveryFee(
              withThreshold(threshold),
              "delivery",
              zone.name,
              subtotal
            ),
          }).toEqual({
            zone: zone.name,
            threshold,
            subtotal,
            fee: clientDeliveryFee(subtotal, zone.fee, threshold),
          });
        }
      }
    }
  });
});

describe("catalog payload used by the cart", () => {
  it("publishes the same fee values the client mirrors", async () => {
    const catalog = await getPublicCatalog();
    const settings = defaultSettings();

    expect(catalog.settings.deliveryZones).toEqual(settings.deliveryZones);
    expect(catalog.settings.deliveryFee).toBe(settings.deliveryFee);
    expect(catalog.settings.freeDeliveryOver).toBe(settings.freeDeliveryOver);
  });
});
