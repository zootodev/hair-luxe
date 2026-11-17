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
  pending: "bg-warning-soft text-warning border-warning/30",
  processing: "bg-brand-soft text-brand border-brand/30",
  completed: "bg-success-soft text-success border-success/30",
  cancelled: "bg-danger-soft text-danger border-danger/30",
};
