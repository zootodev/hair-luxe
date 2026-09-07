"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrders, updateOrderStatus, deleteOrder, getBookings, deleteBooking } from "@/lib/orders";
import { formatPrice } from "@/lib/data/products";
import type { Order, Booking } from "@/lib/types";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

type Tab = "orders" | "bookings" | "deliveries";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");

  useEffect(() => {
    setOrders(getOrders());
    setBookings(getBookings());

    const refresh = () => {
      setOrders(getOrders());
      setBookings(getBookings());
    };
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const sOk = statusFilter === "all" || o.status === statusFilter;
      const dOk =
        deliveryFilter === "all" ||
        (deliveryFilter === "delivery" && o.customer.deliveryMethod === "delivery") ||
        (deliveryFilter === "pickup" && o.customer.deliveryMethod === "pickup");
      return sOk && dOk;
    });
  }, [orders, statusFilter, deliveryFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const deliveries = orders.filter(
      (o) => o.customer.deliveryMethod === "delivery"
    ).length;
    return { totalRevenue, pending, deliveries, total: orders.length };
  }, [orders]);

  const handleStatus = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
    deleteOrder(orderId);
    setOrders(getOrders());
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (!confirm(`Delete booking ${bookingId}?`)) return;
    deleteBooking(bookingId);
    setBookings(getBookings());
  };

  const allDeliveries = useMemo(() => {
    return orders
      .filter((o) => o.customer.deliveryMethod === "delivery" && o.status !== "cancelled")
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [orders]);

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">
              Private Dashboard
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">Order Management</h1>
          </div>
          <p className="text-xs text-muted">
            Data stored locally in this browser. Data is cleared with browser history.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: stats.total, color: "text-gold" },
            { label: "Pending Payment", value: stats.pending, color: "text-yellow-400" },
            { label: "Deliveries", value: stats.deliveries, color: "text-blue-400" },
            {
              label: "Revenue (est.)",
              value: formatPrice(stats.totalRevenue),
              color: "text-emerald-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-surface border border-surface-light p-5"
            >
              <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(
            [
              { key: "orders", label: "Orders" },
              { key: "bookings", label: "Bookings" },
              { key: "deliveries", label: "Deliveries" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === t.key
                  ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background"
                  : "bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40"
              }`}
            >
              {t.label}
              {t.key === "orders" && orders.length > 0 && (
                <span className="ml-1.5 opacity-70">({orders.length})</span>
              )}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "processing", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      statusFilter === s
                        ? "bg-gold text-background"
                        : "bg-surface border border-surface-light text-muted hover:text-gold"
                    }`}
                  >
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value)}
                className="h-9 rounded-full bg-surface border border-surface-light px-4 text-xs focus:border-gold focus:outline-none"
              >
                <option value="all">All Methods</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-surface border border-surface-light">
                <p className="text-muted">No orders found.</p>
                <p className="text-xs text-muted mt-2">
                  When customers place orders through the site, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-surface border border-surface-light overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedOrder(expandedOrder === order.id ? null : order.id)
                      }
                      className="w-full flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-surface-light/40 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-0">
                          {order.customer.firstName.charAt(0)}
                          {order.customer.lastName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{order.id}</p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {order.customer.firstName} {order.customer.lastName} &middot;{" "}
                            {order.customer.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted shrink-0">
                        <span className="hidden sm:flex items-center gap-1.5">
                          {order.customer.deliveryMethod === "delivery" ? (
                            <>
                              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                              </svg>
                              Delivery
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
                              </svg>
                              Pickup
                            </>
                          )}
                        </span>
                        <span className="font-bold text-gold">
                          {formatPrice(order.total)}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {expandedOrder === order.id && (
                      <div className="px-5 pb-5 border-t border-surface-light pt-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs text-muted uppercase tracking-wide mb-3">
                              Customer Information
                            </h4>
                            <div className="rounded-xl bg-surface-light/50 p-4 space-y-2 text-sm">
                              <p className="flex justify-between">
                                <span className="text-muted">Name</span>
                                <span className="font-medium">
                                  {order.customer.firstName} {order.customer.lastName}
                                </span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-muted">Email</span>
                                <span className="font-medium break-all">{order.customer.email}</span>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-muted">Phone</span>
                                <a
                                  href={`tel:${order.customer.phone.replace(/\s/g, "")}`}
                                  className="font-medium text-gold hover:underline"
                                >
                                  {order.customer.phone}
                                </a>
                              </p>
                              <p className="flex justify-between">
                                <span className="text-muted">City</span>
                                <span className="font-medium">{order.customer.city}</span>
                              </p>
                              {order.customer.address && (
                                <p className="flex justify-between">
                                  <span className="text-muted">Address</span>
                                  <span className="font-medium">{order.customer.address}</span>
                                </p>
                              )}
                              <p className="flex justify-between">
                                <span className="text-muted">Method</span>
                                <span className="font-medium capitalize">
                                  {order.customer.deliveryMethod}
                                  {order.customer.deliveryZone
                                    ? ` - ${order.customer.deliveryZone}`
                                    : ""}
                                </span>
                              </p>
                              {order.customer.notes && (
                                <p className="flex justify-between">
                                  <span className="text-muted">Notes</span>
                                  <span className="font-medium">{order.customer.notes}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs text-muted uppercase tracking-wide mb-3">
                              Items ({order.items.length})
                            </h4>
                            <div className="rounded-xl bg-surface-light/50 p-4 space-y-2 text-sm">
                              {order.items.map((item) => (
                                <p key={item.productId} className="flex justify-between gap-3">
                                  <span>
                                    {item.name} <span className="text-muted">x{item.quantity}</span>
                                  </span>
                                  <span className="font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </p>
                              ))}
                              <div className="border-t border-surface-light pt-2 space-y-1">
                                <p className="flex justify-between text-muted">
                                  <span>Subtotal</span>
                                  <span>{formatPrice(order.subtotal)}</span>
                                </p>
                                <p className="flex justify-between text-muted">
                                  <span>Delivery</span>
                                  <span>
                                    {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
                                  </span>
                                </p>
                                <p className="flex justify-between font-bold text-gold">
                                  <span>Total</span>
                                  <span>{formatPrice(order.total)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {order.paymentProof && (
                          <div className="mt-5">
                            <h4 className="text-xs text-muted uppercase tracking-wide mb-3">
                              Payment Proof {order.paymentProofName ? `- ${order.paymentProofName}` : ""}
                            </h4>
                            <div className="rounded-xl bg-surface-light/50 p-3 border border-emerald-500/20">
                              <a
                                href={order.paymentProof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg overflow-hidden group"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL */}
                                <img
                                  src={order.paymentProof}
                                  alt="Payment proof"
                                  className="w-full max-h-64 object-contain rounded-lg group-hover:opacity-90 transition-opacity bg-black/40"
                                />
                                <span className="flex items-center justify-center gap-1.5 text-xs mt-2 text-emerald-400">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                                  </svg>
                                  View full size
                                </span>
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-surface-light">
                          <span className="text-xs text-muted mr-2">Update Status:</span>
                          {(["pending", "processing", "completed", "cancelled"] as const).map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() => handleStatus(order.id, status)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                  order.status === status
                                    ? "bg-gold text-background"
                                    : "bg-surface-light text-muted hover:text-gold"
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            )
                          )}
                          <span className="flex-1" />
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-surface border border-surface-light">
                <p className="text-muted">No service bookings yet.</p>
                <p className="text-xs text-muted mt-2">
                  When clients book services, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl bg-surface border border-surface-light p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10 text-gold shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{booking.service}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {booking.name} &middot; {booking.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted">
                      {new Date(booking.date + "T00:00:00").toLocaleDateString("en-CA", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at {booking.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">
                        {booking.email}
                      </span>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                        aria-label="Delete booking"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "deliveries" && (
          <div>
            <div className="rounded-2xl bg-surface border border-surface-light p-5 mb-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Delivery Queue</p>
                <p className="text-xs text-muted">
                  {allDeliveries.length} active delivery orders to fulfill.
                </p>
              </div>
            </div>

            {allDeliveries.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-surface border border-surface-light">
                <p className="text-muted">No deliveries to show.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allDeliveries.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-surface border border-surface-light p-4 flex items-center gap-4"
                  >
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {order.customer.address}, {order.customer.city} ({order.customer.deliveryZone})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gold">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted">
                        {new Date(order.date).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}