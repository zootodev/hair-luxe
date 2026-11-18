"use client";

import { useState } from "react";
import { getOrders } from "@/lib/orders";
import { cartLineKey, variantSummary } from "@/lib/cart";
import { formatPriceShort } from "@/lib/format";
import { phonesMatch, studioLocation } from "@/lib/format";
import { statusLabel, STATUS_BADGE_CLASSES } from "@/lib/order-status";
import { useCart } from "@/lib/context/CartContext";
import type { Order } from "@/lib/types";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [found, setFound] = useState<Order | null>(null);
  const [searching, setSearching] = useState(false);
  const { business } = useCart();

  const checkoutLocal = (id: string, ph: string) => {
    const orders = getOrders();
    // phonesMatch normalises both sides, so 08123456789 finds an order
    // stored as +2348123456789 (and vice versa).
    const match = orders.find(
      (o) => o.id.toUpperCase() === id && phonesMatch(o.customer.phone, ph)
    );
    if (match) {
      setFound(match);
      return true;
    }
    return false;
  };

  const lookup = async () => {
    const id = orderId.trim().toUpperCase();
    const ph = phone.trim();
    if (!id || !ph.replace(/\D/g, "")) {
      setError("Please enter both order number and phone number.");
      setFound(null);
      return;
    }
    setSearching(true);
    setError("");

    try {
      // Send the raw input; the server normalises both formats before matching.
      const res = await fetch(`/api/order/${encodeURIComponent(id)}?phone=${encodeURIComponent(ph)}`);
      if (res.status === 429) {
        setError("Too many lookups. Please wait a moment and try again.");
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as { order: Order };
        setFound(data.order);
        return;
      }
      if (res.status === 503) {
        if (checkoutLocal(id, ph)) return;
        setError("Order tracking is being set up. Please try again in a moment.");
        return;
      }
      if (res.status === 400 || res.status === 404) {
        if (checkoutLocal(id, ph)) return;
        setError("No order found. Please check your order number and phone number.");
        return;
      }
      setError("Unexpected error. Please try again.");
    } catch {
      if (checkoutLocal(id, ph)) return;
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-brand text-xs font-medium mb-3">
            Order tracking
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Track your order</h1>
          <p className="text-muted text-sm">
            Enter your order number and the phone number you used at checkout.
          </p>
        </div>

        <div className="rounded-md bg-surface border border-surface-light p-6 sm:p-8">
          <label className="block mb-4">
            <span className="text-xs text-muted mb-1.5 block">
              Order number
            </span>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="HL-2026-0123"
              className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-brand focus:outline-none"
            />
          </label>
          <label className="block mb-6">
            <span className="text-xs text-muted mb-1.5 block">
              Phone number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 812 345 6789"
              className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-brand focus:outline-none"
            />
          </label>

          {error && (
            <p className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <button
            onClick={lookup}
            disabled={searching}
            className="w-full h-11 rounded-md bg-brand text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {searching ? "Looking up..." : "Look up order"}
          </button>
        </div>

        {found && (
          <div className="rounded-md bg-surface border border-brand/20 p-6 mt-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand/10">
              <div>
                <p className="text-xs text-muted">Order</p>
                <p className="text-lg font-semibold text-brand tabular">{found.id}</p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${
                  STATUS_BADGE_CLASSES[found.status]
                }`}
              >
                {statusLabel(found.status)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {found.items.map((item) => (
                <div key={cartLineKey(item)} className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    {item.name} <span className="text-muted">x{item.quantity}</span>
                    {variantSummary(item) && (
                      <span className="block text-xs text-muted">{variantSummary(item)}</span>
                    )}
                  </span>
                  <span className="font-semibold price tabular">{formatPriceShort(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-brand/10 pt-4">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="price tabular">{formatPriceShort(found.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className="price tabular">{found.deliveryFee === 0 ? "Free" : formatPriceShort(found.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-brand/10 pt-3">
                <span>Total</span>
                <span className="text-brand price tabular">{formatPriceShort(found.total)}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-brand/10 text-sm space-y-2 text-muted">
              <p>
                <span className="font-medium">Method: </span>
                {found.customer.deliveryMethod === "delivery" ? (
                  <>
                    Delivery to {found.customer.address}, {found.customer.city}
                    {found.customer.deliveryZone ? ` (${found.customer.deliveryZone})` : ""}
                  </>
                ) : (
                  <>Pickup at {studioLocation(business.address, business.city)}</>
                )}
              </p>
              {found.paymentProofName && (
                <p>
                  <span className="font-medium text-brand">Payment proof uploaded: </span>
                  {found.paymentProofName}
                </p>
              )}
              <p>
                <span className="font-medium">Ordered: </span>
                {new Date(found.date).toLocaleString("en-CA", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            {found.status === "pending" && (
              <div className="mt-4 p-3 rounded-md bg-warning-soft border border-warning/30 text-xs text-warning flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Your bank transfer is being checked. Please allow 1 to 2 hours.
              </div>
            )}
          </div>
        )}

        {!found && (
          <p className="text-center text-xs text-muted mt-6">
            Your order number is shown on the checkout confirmation screen (for example{" "}
            <span className="text-brand">HL-2026-0123</span>). Please check your email
            for a copy.
          </p>
        )}
      </div>
    </div>
  );
}