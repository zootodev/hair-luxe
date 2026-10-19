import type { Order } from "@/lib/types";

/**
 * Single source of truth for order status presentation, shared by the admin
 * dashboard, the order confirmation page and Track Order.
 */
export function statusLabel(status: Order["status"]): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

/** Badge classes (background, text and border) for each order status. */
export const STATUS_BADGE_CLASSES: Record<Order["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};
