"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatIntlPhone, formatPriceShort, telHref } from "@/lib/format";
import { adminFetch } from "@/lib/admin-fetch";
import { statusLabel, STATUS_BADGE_CLASSES } from "@/lib/order-status";
import type { Booking, Order } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";

type Tab = "orders" | "deliveries";

function csvValue(value: string | number): string {
  let s = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map(csvValue).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function OrdersManager() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [storeConfigured, setStoreConfigured] = useState(true);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null
  );
  const [emailTarget, setEmailTarget] = useState<{
    id: string;
    customerName: string;
    email: string;
  } | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    kind: "status" | "delete";
    orderId: string;
    from: Order["status"];
    to?: Order["status"];
  } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      setApiError("");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        setApiError("Could not load orders. Please refresh the page.");
        setLoading(false);
        return;
      }
      const data = (await res.json()) as {
        orders: Order[];
        bookings: Booking[];
        storeConfigured: boolean;
      };
      setOrders(data.orders);
      setBookings(data.bookings);
      setStoreConfigured(data.storeConfigured);
    } catch {
      setApiError("Could not load orders. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  /* eslint-disable react-hooks/set-state-in-effect -- data fetch (all setState calls are post-await) */
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const refetch = () => void fetchData();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refetch();
    };
    window.addEventListener("focus", refetch);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const timer = setInterval(refetch, 60_000);
    return () => {
      window.removeEventListener("focus", refetch);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(timer);
    };
  }, [fetchData]);

  const filteredOrders = useMemo(
    () =>
      orders.filter((o) => {
        const sOk = statusFilter === "all" || o.status === statusFilter;
        const dOk =
          deliveryFilter === "all" ||
          (deliveryFilter === "delivery" && o.customer.deliveryMethod === "delivery") ||
          (deliveryFilter === "pickup" && o.customer.deliveryMethod === "pickup");
        return sOk && dOk;
      }),
    [orders, statusFilter, deliveryFilter]
  );

  const allDeliveries = useMemo(
    () =>
      orders
        .filter(
          (o) =>
            o.customer.deliveryMethod === "delivery" &&
            o.status !== "completed" &&
            o.status !== "cancelled"
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [orders]
  );

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    return {
      totalRevenue,
      pending: orders.filter((o) => o.status === "pending").length,
      activeDeliveries: allDeliveries.length,
      total: orders.length,
      upcomingBookings: bookings.length,
    };
  }, [orders, bookings, allDeliveries]);

  const handleStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setToast({ message: err.error ?? "Failed to update status.", variant: "error" });
        if (res.status === 401) router.push("/admin/login");
        return;
      }
      setToast({ message: `Status updated to ${statusLabel(status)}.`, variant: "success" });
    } catch {
      setToast({ message: "Network error. Please try again.", variant: "error" });
    }
    await fetchData();
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setToast({ message: err.error ?? "Failed to delete order.", variant: "error" });
        if (res.status === 401) router.push("/admin/login");
        return;
      }
      setToast({ message: `Order ${orderId} deleted.`, variant: "success" });
    } catch {
      setToast({ message: "Network error. Please try again.", variant: "error" });
    }
    await fetchData();
  };

  const exportOrders = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`hair-luxe-orders-${date}.csv`, [
      [
        "id", "date", "status", "first_name", "last_name", "email", "phone", "city",
        "address", "delivery_method", "delivery_zone", "items", "subtotal",
        "delivery_fee", "total", "notes",
      ],
      ...orders.map((o) => [
        o.id, o.date, o.status, o.customer.firstName, o.customer.lastName,
        o.customer.email, o.customer.phone, o.customer.city,
        o.customer.address ?? "", o.customer.deliveryMethod, o.customer.deliveryZone ?? "",
        o.items.map((i) => `${i.name} (x${i.quantity})`).join("; "),
        o.subtotal, o.deliveryFee, o.total, o.customer.notes ?? "",
      ]),
    ]);
  };

  const sendCustomerEmail = async () => {
    if (!emailTarget) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      setEmailError("Subject and message are required.");
      return;
    }
    setEmailSending(true);
    setEmailError("");
    const targetName = emailTarget.customerName;
    try {
      const res = await adminFetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: emailTarget.id,
          subject: emailSubject,
          message: emailMessage,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setEmailError(err.error ?? "Failed to send email. Please try again.");
        return;
      }
      setEmailSubject("");
      setEmailMessage("");
      setEmailTarget(null);
      setToast({ message: `Email sent to ${targetName}.`, variant: "success" });
    } catch {
      setEmailError("Network error. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-brand text-xs font-medium mb-1">Admin area</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Orders</h1>
        </div>
        <p className="text-xs text-muted max-w-sm">
          {storeConfigured
            ? "Orders are stored securely on the server and shared across all admin browsers."
            : "Orders are stored in server memory only."}
        </p>
      </div>

      {!storeConfigured && (
        <div className="rounded-md bg-warning-soft border border-warning/30 p-4 mb-8 text-sm text-warning">
          Persistent storage is not configured. Orders placed now are kept in server memory only.
        </div>
      )}

      {apiError && (
        <div className="rounded-md bg-danger-soft border border-danger/30 p-4 mb-8 text-sm text-danger">
          {apiError}
        </div>
      )}

      {loading && <p className="text-center py-16 text-muted">Loading orders...</p>}

      {!loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total orders", value: stats.total, color: "text-brand" },
              { label: "Pending payment", value: stats.pending, color: "text-warning" },
              { label: "Upcoming bookings", value: stats.upcomingBookings, color: "text-brand" },
              { label: "Estimated revenue", value: formatPriceShort(stats.totalRevenue), color: "text-success" },
            ].map((s) => (
              <div key={s.label} className="rounded-md bg-surface border border-surface-light p-5">
                <p className={`text-2xl font-semibold tabular ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {(
                [
                  { key: "orders", label: "Orders", count: orders.length },
                  { key: "deliveries", label: "Deliveries", count: allDeliveries.length },
                ] as { key: Tab; label: string; count: number }[]
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`shrink-0 px-5 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                    tab === t.key
                      ? "bg-brand text-background"
                      : "bg-surface border border-surface-light text-muted hover:text-brand"
                  }`}
                >
                  {t.label}
                  {t.count > 0 && <span className="ml-1.5 opacity-70">({t.count})</span>}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={exportOrders}
                disabled={orders.length === 0}
                className="shrink-0 px-4 py-2.5 rounded-md text-xs font-semibold bg-surface border border-surface-light text-muted hover:text-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Export orders
              </button>
              {tab === "orders" && (
                <select
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value)}
                  aria-label="Filter by delivery method"
                  className="h-9 shrink-0 rounded-md bg-surface border border-surface-light px-4 text-xs focus:border-brand focus:outline-none"
                >
                  <option value="all">All methods</option>
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                </select>
              )}
            </div>
          </div>

          {tab === "orders" && (
            <div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5">
                {["all", "pending", "processing", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === s
                        ? "bg-brand text-background"
                        : "bg-surface border border-surface-light text-muted hover:text-brand"
                    }`}
                  >
                    {s === "all" ? "All" : statusLabel(s as Order["status"])}
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 rounded-md bg-surface border border-surface-light">
                  <p className="text-muted">
                    {orders.length === 0 ? "No orders yet." : "No orders match the current filters."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-md bg-surface border border-surface-light overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order.id ? null : order.id)
                        }
                        className="w-full flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-surface-light/40 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-11 h-11 rounded-md bg-brand text-background font-sans font-bold text-sm shrink-0">
                            {order.customer.firstName.charAt(0)}
                            {order.customer.lastName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm">{order.id}</p>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${STATUS_BADGE_CLASSES[order.status]}`}
                              >
                                {statusLabel(order.status)}
                              </span>
                            </div>
                            <p className="text-xs text-muted truncate mt-0.5">
                              {order.customer.firstName} {order.customer.lastName} &middot;{" "}
                              {formatIntlPhone(order.customer.phone)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6 text-xs text-muted shrink-0">
                          <span className="hidden sm:inline">
                            {order.customer.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
                          </span>
                          <span className="font-bold tabular text-brand">
                            {formatPriceShort(order.total)}
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
                              <h4 className="text-xs text-muted mb-3">Customer details</h4>
                              <div className="rounded-md bg-surface-light/50 p-4 space-y-2 text-sm">
                                <p className="flex justify-between gap-3">
                                  <span className="text-muted">Name</span>
                                  <span className="font-medium text-right">
                                    {order.customer.firstName} {order.customer.lastName}
                                  </span>
                                </p>
                                <p className="flex justify-between gap-3">
                                  <span className="text-muted">Email</span>
                                  <span className="font-medium break-all text-right">
                                    {order.customer.email}
                                  </span>
                                </p>
                                <p className="flex justify-between gap-3">
                                  <span className="text-muted">Phone</span>
                                  <a
                                    href={`tel:${telHref(order.customer.phone)}`}
                                    className="font-medium text-brand hover:underline"
                                  >
                                    {formatIntlPhone(order.customer.phone)}
                                  </a>
                                </p>
                                <p className="flex justify-between gap-3">
                                  <span className="text-muted">City</span>
                                  <span className="font-medium text-right">{order.customer.city}</span>
                                </p>
                                {order.customer.address && (
                                  <p className="flex justify-between gap-3">
                                    <span className="text-muted">Address</span>
                                    <span className="font-medium text-right">{order.customer.address}</span>
                                  </p>
                                )}
                                <p className="flex justify-between gap-3">
                                  <span className="text-muted">Method</span>
                                  <span className="font-medium text-right">
                                    {order.customer.deliveryMethod}
                                    {order.customer.deliveryZone
                                      ? ` (${order.customer.deliveryZone})`
                                      : ""}
                                  </span>
                                </p>
                                {order.customer.notes && (
                                  <p className="flex justify-between gap-3">
                                    <span className="text-muted">Notes</span>
                                    <span className="font-medium text-right">{order.customer.notes}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs text-muted mb-3">Items ({order.items.length})</h4>
                              <div className="rounded-md bg-surface-light/50 p-4 space-y-2 text-sm">
                                {order.items.map((item) => (
                                  <p key={item.productId} className="flex justify-between gap-3">
                                    <span>
                                      {item.name} <span className="text-muted">x{item.quantity}</span>
                                    </span>
                                    <span className="font-medium tabular">
                                      {formatPriceShort(item.price * item.quantity)}
                                    </span>
                                  </p>
                                ))}
                                <div className="border-t border-surface-light pt-2 space-y-1">
                                  <p className="flex justify-between text-muted">
                                    <span>Subtotal</span>
                                    <span className="tabular">{formatPriceShort(order.subtotal)}</span>
                                  </p>
                                  <p className="flex justify-between text-muted">
                                    <span>Delivery</span>
                                    <span className="tabular">
                                      {order.deliveryFee === 0 ? "Free" : formatPriceShort(order.deliveryFee)}
                                    </span>
                                  </p>
                                  <p className="flex justify-between font-bold text-brand">
                                    <span>Total</span>
                                    <span className="tabular">{formatPriceShort(order.total)}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {order.paymentProof && (
                            <div className="mt-5">
                              <h4 className="text-xs text-muted mb-3">Payment proof</h4>
                              <div className="rounded-md bg-surface-light/50 p-3 border border-success/30">
                                <a
                                  href={order.paymentProof}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={order.paymentProofName || "payment-proof"}
                                  className="block rounded-lg overflow-hidden"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL */}
                                  <img
                                    src={order.paymentProof}
                                    alt="Payment proof"
                                    className="w-full max-h-64 object-contain rounded-lg bg-surface-light"
                                  />
                                </a>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-surface-light">
                            <span className="text-xs text-muted mr-2">Update status</span>
                            {(["pending", "processing", "completed", "cancelled"] as const).map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    order.status !== status &&
                                    setConfirmAction({
                                      kind: "status",
                                      orderId: order.id,
                                      from: order.status,
                                      to: status,
                                    })
                                  }
                                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                    order.status === status
                                      ? "bg-brand text-background"
                                      : "bg-surface-light text-muted hover:text-brand"
                                  }`}
                                >
                                  {statusLabel(status)}
                                </button>
                              )
                            )}
                            <span className="flex-1" />
                            <button
                              onClick={() => {
                                setEmailError("");
                                setEmailSubject(`Regarding your order ${order.id}`);
                                setEmailMessage("");
                                setEmailTarget({
                                  id: order.id,
                                  customerName: `${order.customer.firstName} ${order.customer.lastName}`,
                                  email: order.customer.email,
                                });
                              }}
                              className="px-3 py-1.5 rounded-md text-xs font-medium text-brand hover:bg-brand/10 border border-brand/30 transition-colors cursor-pointer"
                            >
                              Email customer
                            </button>
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  kind: "delete",
                                  orderId: order.id,
                                  from: order.status,
                                })
                              }
                              className="px-3 py-1.5 rounded-md text-xs font-semibold text-background bg-danger transition-colors cursor-pointer"
                            >
                              Delete order
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

          {tab === "deliveries" && (
            <div>
              <div className="rounded-md bg-surface border border-surface-light p-5 mb-4">
                <p className="font-semibold text-sm">Delivery queue</p>
                <p className="text-xs text-muted">
                  {allDeliveries.length === 0
                    ? "No active delivery orders."
                    : `${allDeliveries.length} active delivery order${allDeliveries.length === 1 ? "" : "s"} to fulfill.`}
                </p>
              </div>
              <div className="space-y-3">
                {allDeliveries.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-md bg-surface border border-surface-light p-4 flex items-center gap-4"
                  >
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${STATUS_BADGE_CLASSES[order.status]}`}
                    >
                      {statusLabel(order.status)}
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
                      <p className="text-sm font-bold tabular text-brand">
                        {formatPriceShort(order.total)}
                      </p>
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
            </div>
          )}
        </>
      )}

      {emailTarget && (
        <div className="fixed inset-0 z-[60] bg-scrim flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-md bg-surface border border-surface-light p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">
                Email {emailTarget.customerName}
                <span className="block text-xs text-muted font-normal mt-0.5">
                  Order {emailTarget.id}
                </span>
              </h3>
              <button
                onClick={() => setEmailTarget(null)}
                className="text-muted hover:text-brand p-1 cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {emailError && (
              <div className="rounded-md bg-danger-soft border border-danger/30 p-3 mb-4 text-sm text-danger">
                {emailError}
              </div>
            )}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-background border border-surface-light px-3 h-9">
                <span className="text-xs text-muted">To:</span>
                <span className="text-sm font-medium break-all text-right">{emailTarget.email}</span>
              </div>
              <label className="block">
                <span className="block text-xs text-muted mb-1">Subject</span>
                <input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-brand focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="block text-xs text-muted mb-1">Message</span>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-brand focus:outline-none resize-y"
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setEmailTarget(null)}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-surface-light text-muted hover:text-brand transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={sendCustomerEmail}
                disabled={emailSending}
                className="px-4 py-2 rounded-md text-sm font-semibold bg-brand text-background hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                {emailSending ? "Sending..." : "Send email"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.kind === "delete" ? "Delete order?" : "Change order status?"}
      >
        {confirmAction && (
          <>
            <div className="text-sm space-y-3 mb-6">
              <p className="text-muted">
                Order{" "}
                <span className="text-foreground font-semibold">{confirmAction.orderId}</span>
              </p>
              {confirmAction.kind === "status" && confirmAction.to && (
                <div className="flex items-center gap-2 rounded-md bg-surface-light/60 border border-surface-light px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_BADGE_CLASSES[confirmAction.from]}`}
                  >
                    {statusLabel(confirmAction.from)}
                  </span>
                  <span className="text-muted">&rarr;</span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_BADGE_CLASSES[confirmAction.to]}`}
                  >
                    {statusLabel(confirmAction.to)}
                  </span>
                </div>
              )}
              {confirmAction.kind === "delete" && (
                <p className="text-danger">
                  This permanently removes the order and its payment proof. This cannot be undone.
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 h-10 rounded-md text-sm font-semibold bg-surface-light text-muted hover:text-brand transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {confirmAction.kind === "status" && confirmAction.to && (
                <button
                  onClick={async () => {
                    const to = confirmAction.to;
                    if (!to) return;
                    const orderId = confirmAction.orderId;
                    setConfirmAction(null);
                    await handleStatus(orderId, to);
                  }}
                  className="px-4 h-10 rounded-md text-sm font-semibold bg-brand text-background hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Change status
                </button>
              )}
              {confirmAction.kind === "delete" && (
                <button
                  onClick={async () => {
                    const { orderId } = confirmAction;
                    setConfirmAction(null);
                    await handleDeleteOrder(orderId);
                  }}
                  className="px-4 h-10 rounded-md text-sm font-semibold text-background bg-danger transition-colors cursor-pointer"
                >
                  Delete order
                </button>
              )}
            </div>
          </>
        )}
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
          duration={4000}
        />
      )}
    </div>
  );
}
