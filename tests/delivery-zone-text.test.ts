import { describe, expect, it } from "vitest";
import {
  deliveryFeeLabel,
  freeDeliveryThresholdText,
} from "@/lib/delivery-display";

const base = {
  deliveryMethod: "delivery" as const,
  deliveryZone: "",
  deliveryFee: 5000,
  subtotal: 300000,
  freeDeliveryOver: 250000,
};

describe("cart delivery-zone text", () => {
  it("never says Free before a delivery zone is chosen", () => {
    expect(deliveryFeeLabel(base)).toBe("Delivery: choose a zone at checkout");
  });

  it("says Free once a zone is chosen and the order qualifies", () => {
    expect(deliveryFeeLabel({ ...base, deliveryZone: "Lagos Mainland" })).toBe("Free");
  });

  it("shows the zone fee below the threshold", () => {
    expect(
      deliveryFeeLabel({
        ...base,
        deliveryZone: "Lagos Mainland",
        subtotal: 100000,
      })
    ).toBe("₦5,000");
  });

  it("keeps pickup free", () => {
    expect(deliveryFeeLabel({ ...base, deliveryMethod: "pickup" })).toBe("Free");
  });
});

describe("free-delivery threshold text", () => {
  it("uses the settings threshold", () => {
    expect(freeDeliveryThresholdText(250000)).toBe(
      "Free delivery on orders over ₦250,000"
    );
  });

  it("is omitted when there is no threshold", () => {
    expect(freeDeliveryThresholdText(0)).toBe("");
  });
});
