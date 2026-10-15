"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { notFound } from "next/navigation";
import { getOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/data/products";
import type { Order } from "@/lib/types";

export default function OrderPage() {
  const params = useParams();
  const orderNumber = String(params.orderNumber ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    const orders = getOrders();
    const match = orders.find(
      (o) => o.id.toUpperCase() === orderNumber.toUpperCase()
    );
    if (match) {
      setOrder(match);
    } else {
      notFound();
    }
    setLoading(false);
  };

  if (orderNumber) {
    loadOrder();
  }

  if (loading) {
    return <p className="text-center py-16">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center py-16">Order not found.</p>;
  }

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Order {order.id}
          </h1>
          <p className="text-muted">
            {order.status.toLowerCase()} order
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-surface border border-surface-light p-6">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Order ID</p>
            <p className="font-serif text-xl font-bold text-gold">{order.id}</p>
          </div>
          <div className="rounded-2xl bg-surface border border-surface-light p-6">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Total</p>
            <p className="font-serif text-xl font-bold text-gold">
              {formatPrice(order.total)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface border border-surface-light p-6">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Payment Method</p>
            <p className="font-medium">
              {order.paymentMethod === "bank-transfer"
                ? "Bank transfer"
                : "Notification"}
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-surface border border-surface-light">
          <h4 className="font-serif text-lg mb-4">Customer Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted mb-1">Name</p>
              <p>{order.customer.firstName} {order.customer.lastName}</p>
            </div>
            <div>
              <p className="text-muted mb-1">Email</p>
              <p>{order.customer.email}</p>
            </div>
            <div>
              <p className="text-muted mb-1">Phone</p>
              <p>{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-muted mb-1">City</p>
              <p>{order.customer.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}