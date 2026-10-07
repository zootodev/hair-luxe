import { BUSINESS, DELIVERY_ZONES } from "@/lib/config";
import type { DeliveryMethod } from "@/lib/types";

export interface DeliveryZoneInfo {
  name: string;
  fee: number;
  days: string;
}

export function getDeliveryZoneInfo(name: string): DeliveryZoneInfo {
  return (
    DELIVERY_ZONES.find((z) => z.name === name) ?? {
      name,
      fee: BUSINESS.deliveryFee,
      days: "2-3 business days",
    }
  );
}

export function computeDeliveryFee(
  method: DeliveryMethod,
  zone: string,
  subtotal: number
): number {
  if (method === "pickup") return 0;
  const info = getDeliveryZoneInfo(zone);
  if (BUSINESS.freeDeliveryOver > 0 && subtotal >= BUSINESS.freeDeliveryOver) {
    return 0;
  }
  return info.fee;
}