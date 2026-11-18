import { formatPriceShort } from "@/lib/format";

interface DeliveryFeeLabelInput {
  deliveryMethod: "delivery" | "pickup";
  deliveryZone: string;
  deliveryFee: number;
  subtotal: number;
  freeDeliveryOver: number;
}

/**
 * What the cart/checkout summary shows next to "Delivery".
 *
 * A fee is never called "Free" before a zone is chosen, even when the order is
 * above the free-delivery threshold.
 */
export function deliveryFeeLabel({
  deliveryMethod,
  deliveryZone,
  deliveryFee,
  subtotal,
  freeDeliveryOver,
}: DeliveryFeeLabelInput): string {
  if (deliveryMethod === "pickup") return "Free";
  if (!deliveryZone) return "Delivery: choose a zone at checkout";
  if (freeDeliveryOver > 0 && subtotal >= freeDeliveryOver) return "Free";
  return formatPriceShort(deliveryFee);
}

/** The threshold sentence, read from settings, shown before a zone is chosen. */
export function freeDeliveryThresholdText(freeDeliveryOver: number): string {
  if (!Number.isFinite(freeDeliveryOver) || freeDeliveryOver <= 0) return "";
  return `Free delivery on orders over ${formatPriceShort(freeDeliveryOver)}`;
}
