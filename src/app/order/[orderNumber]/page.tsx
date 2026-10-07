"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { getOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/data/products";
import { BUSINESS } from "@/lib/config";
import type { Order } from "@/lib/types";

export default function OrderConfirmationPage() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber.toUpperCase().replace("ORDER ", "");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrders().find((o) => o.id.toUpperCase() === orderNumber) ?? null);
  }, [orderNumber]);

  if (order === undefined) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-[70vh] flex items-center justify-center">
        <p className="text-muted">Loading your order...</p>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-[70vh]">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-emerald-500/15 text-emerald-400 mb-6 animate-fade-in-up">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
          Thank You, {order.customer.firstName}!
        </h1>
        <p className="text-muted mb-6">Your order has been placed successfully.</p>

        <div className="rounded-2xl bg-surface border border-gold/20 p-6 mb-6 text-left animate-fade-in-up">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/10">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">Order Reference</p>
              <p className="font-serif text-xl font-bold text-gold">{order.id}</p>
            </div>
            <p className="text-xs text-muted">Status: Pending</p>
          </div>

          {order.items.map((item) => {
            const productSlug = item.productId;
            return (
              <div key={item.productId} className="flex items-center gap-3 py-2">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-light shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${productSlug}`}
                    className="text-sm font-medium truncate block hover:text-gold transition-colors"
                  >
                    {item.name}
                    <span className="text-muted font-normal"> x{item.quantity}</span>
                  </Link>
                </div>
                <span className="text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            );
          })}

          <div className="space-y-2 text-sm border-t border-gold/10 pt-4">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Delivery Fee</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2">
              <span>Total</span>
              <span className="text-gold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gold/5 border border-gold/30 p-5 mb-8 text-left">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gold text-background shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 4h-2.153a1 1 0 00-.986.836l-.74 4.435a1 1 0 01.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V21a1 1 0 01-1 1h-2C7.82 22 2 16.18 2 5V3a1 1 0 011-1zM8 5v2.5a5.5 5.5 0 005.5 5.5H16v-0.5a1 1 0 00-1-1h-1.5a4 4 0 01-4-4V5a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
              </svg>
            </span>
            <p className="font-semibold text-sm">
              Complete your Interac e-Transfer to confirm
            </p>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="flex justify-between">
              <span className="text-muted">Send To:</span>
              <span className="font-medium">{BUSINESS.interacEmail}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted">Amount:</span>
              <span className="font-medium text-gold">{formatPrice(order.total)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted">Message:</span>
              <span className="font-medium">Order {order.id}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted mb-6">
          {order.customer.deliveryMethod === "delivery" ? (
            <>
              Delivery to {order.customer.address}, {order.customer.city}.
            </>
          ) : (
            <>
              Pickup at {BUSINESS.address}. Please call {BUSINESS.phone} when you arrive.
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"
          >
            Track My Order
          </Link>
        </div>
      </div>
    </div>
  );
}