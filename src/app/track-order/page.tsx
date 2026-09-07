"use client";

import { useState } from "react";
import { getOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/data/products";
import type { Order } from "@/lib/types";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  processing: "bg-blue-500/15 text-blue-400",
  completed: "bg-emerald-500/15 text-emerald-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [found, setFound] = useState<Order | null>(null);

  const lookup = () => {
    const id = orderId.trim().toUpperCase();
    const ph = phone.trim().replace(/\D/g, "");
    if (!id || !ph) {
      setError("Please enter both Order ID and phone number.");
      setFound(null);
      return;
    }
    const orders = getOrders();
    const match = orders.find(
      (o) =>
        o.id.toUpperCase() === id &&
        o.customer.phone.replace(/\D/g, "").includes(ph)
    );
    if (match) {
      setFound(match);
      setError("");
    } else {
      setError("No order found. Please check your Order ID and phone number.");
      setFound(null);
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Order Status
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Track Your Order</h1>
          <p className="text-muted text-sm">
            Enter your Order ID and the phone number you used at checkout.
          </p>
        </div>

        <div className="rounded-2xl bg-surface border border-surface-light p-6 sm:p-8">
          <label className="block mb-4">
            <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
              Order ID
            </span>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="HL-2026-0001"
              className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
            />
          </label>
          <label className="block mb-6">
            <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
              Phone Number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(647) 555-0123"
              className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <button
            onClick={lookup}
            className="w-full h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Look Up Order
          </button>
        </div>

        {found && (
          <div className="rounded-2xl bg-surface border border-gold/20 p-6 mt-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/10">
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">Order</p>
                <p className="font-serif text-xl font-bold text-gold">{found.id}</p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  STATUS_STYLES[found.status]
                } border border-current/20`}
              >
                {found.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {found.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <span>
                    {item.name} <span className="text-muted">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-gold/10 pt-4">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(found.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span>{found.deliveryFee === 0 ? "FREE" : formatPrice(found.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gold/10 pt-3">
                <span>Total</span>
                <span className="text-gold">{formatPrice(found.total)}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gold/10 text-sm space-y-2 text-muted">
              <p>
                <span className="font-medium">Method: </span>
                {found.customer.deliveryMethod === "delivery" ? (
                  <>
                    Delivery to {found.customer.address}, {found.customer.city}
                    {found.customer.deliveryZone && ` (${found.customer.deliveryZone})`}
                  </>
                ) : (
                  "Pickup at our studio"
                )}
              </p>
              {found.paymentProofName && (
                <p>
                  <span className="font-medium text-gold">Payment proof uploaded: </span>
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
              <div className="mt-4 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-xs text-yellow-400 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Your Interac e-Transfer is being verified. Please allow 1-2 business hours.
              </div>
            )}
          </div>
        )}

        {!found && (
          <p className="text-center text-xs text-muted mt-6">
            Your Order ID is shown on the checkout confirmation screen (e.g.{" "}
            <span className="text-gold">HL-2026-0001</span>). Please check your email
            for a copy.
          </p>
        )}
      </div>
    </div>
  );
}