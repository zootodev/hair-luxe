"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { cartLineKey, variantSummary } from "@/lib/cart";
import { deliveryFeeLabel, freeDeliveryThresholdText } from "@/lib/delivery-display";
import { formatPriceShort } from "@/lib/format";
import { formatNigerianPhone, studioLocation } from "@/lib/format";
import { statusLabel } from "@/lib/order-status";
import { saveOrder } from "@/lib/orders";
import { recordSold } from "@/lib/stock";
import type { DeliveryZoneSettings, Order } from "@/lib/types";

const STATUS_STEPS = [
  { label: "Your details", step: 1 },
  { label: "Bank transfer", step: 2 },
  { label: "Confirmation", step: 3 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryFee,
    total,
    deliveryMethod,
    deliveryZone,
    setDeliveryZone,
    clearCart,
    business,
    deliveryZones,
    freeDeliveryOver,
  } = useCart();

  const zoneInfo =
    deliveryZones.find((z) => z.name === deliveryZone) ??
    ({ name: deliveryZone, zones: [], fee: 0, days: "2 to 3 days" } satisfies DeliveryZoneSettings);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [proofFile, setProofFile] = useState<{ dataUrl: string; name: string } | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [proofError, setProofError] = useState("");
  const proofInputRef = useRef<HTMLInputElement>(null);

  const handleProofFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofError("");
    if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/webp") {
      setProofError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProofError("File must be under 5MB.");
      return;
    }
    setProofLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new window.Image();
          img.onload = () => {
            const MAX_DIM = 1200;
            const canvas = document.createElement("canvas");
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            const scale = w > MAX_DIM || h > MAX_DIM ? Math.min(MAX_DIM / w, MAX_DIM / h) : 1;
            canvas.width = Math.round(w * scale);
            canvas.height = Math.round(h * scale);
            const ctx = canvas.getContext("2d");
            if (!ctx) { reject(new Error("Canvas failed")); return; }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          };
          img.onerror = () => reject(new Error("Could not read image"));
          img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      });
      setProofFile({ dataUrl, name: file.name });
    } catch {
      setProofError("Could not process the image. Try a different file.");
    }
    setProofLoading(false);
    if (proofInputRef.current) proofInputRef.current.value = "";
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!formatNigerianPhone(form.phone)) {
      newErrors.phone = "Enter a valid Nigerian phone number, for example 08123456789";
    }
    if (!form.city.trim()) newErrors.city = "Required";
    if (deliveryMethod === "delivery" && !form.address.trim()) newErrors.address = "Required";
    if (deliveryMethod === "delivery" && !deliveryZone) {
      newErrors.deliveryZone = "Select a delivery zone";
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep1();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setStep(2);
    }
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep(1);
  };

const handlePlaceOrder = async () => {
    if (!agreed) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          deliveryMethod,
          deliveryZone,
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            // Stored normalised (+234XXXXXXXXXX) and always as a string.
            phone: formatNigerianPhone(form.phone) ?? form.phone,
            city: form.city,
            address: deliveryMethod === "delivery" ? form.address : undefined,
            notes: form.notes,
          },
          paymentProof: proofFile?.dataUrl,
          paymentProofName: proofFile?.name,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.error ?? "We could not place your order. Please try again.");
        return;
      }

      const order: Order = data.order;
      try {
        saveOrder(order);
      } catch {
        console.error("Failed to save order locally; it is saved on the server.");
      }
      try {
        recordSold(items);
      } catch {
        console.error("Failed to update the local stock counter.");
      }
      clearCart();
      setPlacedOrder(order);
      router.push(`/order/${order.id}`);
    } catch {
      alert("We could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-md bg-brand/10 text-brand mb-6">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Nothing to check out</h1>
          <p className="text-muted mb-8">Your cart is empty. Add a product to your cart first.</p>
<Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Shop products
          </Link>
        </div>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-md bg-success-soft text-success mb-6">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Thank you, {placedOrder.customer.firstName}
          </h1>
          <p className="text-muted mb-6">Your order is with us. We will confirm it after checking your payment.</p>

          <div className="rounded-md bg-surface border border-brand/20 p-6 mb-6 text-left">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand/10">
              <div>
                <p className="text-xs text-muted">Order reference</p>
                <p className="text-lg font-semibold text-brand tabular">{placedOrder.id}</p>
              </div>
              <p className="text-xs text-muted">Status: {statusLabel(placedOrder.status)}</p>
            </div>

            <div className="space-y-3 mb-4">
              {placedOrder.items.map((item) => (
                <div key={cartLineKey(item)} className="flex items-center justify-between text-sm">
                  <span>
                    {item.name} <span className="text-muted">x{item.quantity}</span>
                    {variantSummary(item) && (
                      <span className="block text-xs text-muted">{variantSummary(item)}</span>
                    )}
                  </span>
                  <span className="font-semibold">
                    {formatPriceShort(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-brand/10 pt-4">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="price tabular">{formatPriceShort(placedOrder.subtotal)}</span>
              </div>
              {placedOrder.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Delivery fee</span>
                  <span className="price tabular">{formatPriceShort(placedOrder.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2">
                <span>Total</span>
                <span className="text-brand price tabular">{formatPriceShort(placedOrder.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-brand/5 border border-brand/30 p-5 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-md bg-brand text-background shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 4h-2.153a1 1 0 00-.986.836l-.74 4.435a1 1 0 01.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V21a1 1 0 01-1 1h-2C7.82 22 2 16.18 2 5V3a1 1 0 011-1zM8 5v2.5a5.5 5.5 0 005.5 5.5H16v-0.5a1 1 0 00-1-1h-1.5a4 4 0 01-4-4V5a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                </svg>
              </span>
              <p className="font-semibold text-sm">
                Complete your bank transfer to confirm
              </p>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="flex justify-between">
                <span className="text-muted">Bank:</span>
                <span className="font-medium">{business.bankDetails.bankName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">Account name:</span>
                <span className="font-medium">{business.bankDetails.accountName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">Account number:</span>
                <span className="font-medium">{business.bankDetails.accountNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">Amount:</span>
                <span className="font-medium text-brand price tabular">{formatPriceShort(placedOrder.total)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">Reference:</span>
                <span className="font-medium">Order {placedOrder.id}</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-muted mb-6">
            {placedOrder.customer.deliveryMethod === "delivery" ? (
              <>
                Delivery to {placedOrder.customer.address}, {placedOrder.customer.city}.
              </>
            ) : (
              <>
                Pickup at {studioLocation(business.address, business.city)}. Please call{" "}
                {business.phone} when you arrive.
              </>
            )}
          </p>

{placedOrder.paymentProofName && (
            <div className="rounded-md bg-success-soft border border-success/30 p-3 mb-5 text-sm text-success flex items-center gap-2 justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Payment proof received: {placedOrder.paymentProofName}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Continue shopping
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center h-12 px-8 rounded-md border border-brand/40 text-brand font-semibold text-sm hover:bg-brand/10 transition-colors"
            >
              Track order
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-md border border-brand/40 text-brand font-semibold text-sm hover:bg-brand/10 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-8 text-center">Checkout</h1>

        <div className="rounded-md bg-brand/5 border border-brand/20 p-6 mb-8 text-left">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Demo store</p>
              <p className="text-xs text-muted">This is a demo store. No real orders or payments will be processed. Bank details (GTBank 0123456789) are placeholder only.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {STATUS_STEPS.map((s, i) => (
            <div key={s.step} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold ${
                    step >= s.step
                      ? "bg-brand text-background"
                      : "bg-surface border border-surface-light text-muted"
                  }`}
                >
                  {s.step}
                </span>
                <span
                  className={`hidden sm:block text-xs font-medium ${
                    step >= s.step ? "text-brand" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <span
                  className={`w-8 sm:w-16 h-px ${
                    step > s.step ? "bg-brand" : "bg-surface-light"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 1 && (
              <div className="rounded-md bg-surface border border-surface-light p-6">
                <h2 className="font-display text-xl font-bold mb-6">Contact and delivery details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="text-xs text-muted mb-1.5 block">
                      First name *
                    </span>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.firstName ? "border-danger" : "border-surface-light focus:border-brand"
                      }`}
                      placeholder="Jane"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-danger mt-1">{errors.firstName}</p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted mb-1.5 block">
                      Last name *
                    </span>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.lastName ? "border-danger" : "border-surface-light focus:border-brand"
                      }`}
                      placeholder="Smith"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-danger mt-1">{errors.lastName}</p>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="text-xs text-muted mb-1.5 block">
                      Email *
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.email ? "border-danger" : "border-surface-light focus:border-brand"
                      }`}
                      placeholder="jane@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-danger mt-1">{errors.email}</p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted mb-1.5 block">
                      Phone number *
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.phone ? "border-danger" : "border-surface-light focus:border-brand"
                      }`}
                      placeholder="+234 800 000 0000"
                    />
                    {errors.phone && (
                      <p className="text-xs text-danger mt-1">{errors.phone}</p>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <label
                    className={`block ${deliveryMethod === "delivery" ? "" : "sm:col-span-2"}`}
                  >
                    <span className="text-xs text-muted mb-1.5 block">
                      City *
                    </span>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.city ? "border-danger" : "border-surface-light focus:border-brand"
                      }`}
                      placeholder="Lagos"
                    />
                    {errors.city && <p className="text-xs text-danger mt-1">{errors.city}</p>}
                  </label>
                  {deliveryMethod === "delivery" && (
                    <label className="block">
                      <span className="text-xs text-muted mb-1.5 block">
                        Delivery zone
                      </span>
                      <select
                        value={deliveryZone}
                        onChange={(e) => setDeliveryZone(e.target.value)}
                        className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                          errors.deliveryZone
                            ? "border-danger"
                            : "border-surface-light focus:border-brand"
                        }`}
                      >
                        <option value="">Select delivery zone</option>
                        {deliveryZones.map((z) => (
                          <option key={z.name} value={z.name}>
                            {z.name} — {formatPriceShort(z.fee)} ({z.days})
                          </option>
                        ))}
                      </select>
                      {errors.deliveryZone && (
                        <p className="text-xs text-danger mt-1">{errors.deliveryZone}</p>
                      )}
                    </label>
                  )}
                </div>

                {deliveryMethod === "delivery" && (
                  <label className="block mb-4">
                    <span className="text-xs text-muted mb-1.5 block">
                      Street address *
                    </span>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.address ? "border-danger" : "border-surface-light focus:border-brand"
                      }`}
                      placeholder="14 Allen Avenue, Ikeja"
                    />
                    {errors.address && (
                      <p className="text-xs text-danger mt-1">{errors.address}</p>
                    )}
                  </label>
                )}

                <label className="block mb-6">
                  <span className="text-xs text-muted mb-1.5 block">
                    Delivery notes (optional)
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-brand focus:outline-none min-h-[90px] resize-none"
                    placeholder="Delivery instructions, gift note, etc."
                  />
                </label>

                {deliveryMethod === "delivery" ? (
                  <div className="rounded-md bg-brand/5 border border-brand/20 p-4 mb-6 text-sm flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-brand shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-muted">
                      {deliveryZone ? (
                        <>
                          Delivery is{" "}
                          {deliveryFee === 0 ? "Free" : formatPriceShort(deliveryFee)} to{" "}
                          {deliveryZone} and takes {zoneInfo.days}. We&apos;ll call you on your
                          phone number before delivery.
                        </>
                      ) : (
                        <>
                          Choose a delivery zone above to see the fee and delivery time.
                          {freeDeliveryOver > 0 && (
                            <> {freeDeliveryThresholdText(freeDeliveryOver)}.</>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md bg-brand/5 border border-brand/20 p-4 mb-6 text-sm flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-brand shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 0110 18v-5H6a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-muted">
                      Pick up your order at {studioLocation(business.address, business.city)}.
                      Please call{" "}
                      {business.phoneFormatted || business.phone} when you&apos;re on the way.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full h-12 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Continue to payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-md bg-surface border border-surface-light p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold">Bank transfer</h2>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand/10 text-brand text-xs font-semibold">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Bank details
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    {[
                      {
                        title: "Step 1: open your banking app",
                        desc: "Log into your bank's app or website and start a new transfer.",
                      },
                      {
                        title: `Step 2: transfer to ${business.bankDetails.bankName}`,
                        desc: `Send to account number ${business.bankDetails.accountNumber} (${business.bankDetails.accountName}). Confirm the account name matches before sending.`,
                      },
                      {
                        title: `Step 3: send exactly ${formatPriceShort(total)}`,
                        desc: `Transfer the exact amount of ${formatPriceShort(total)}. Double-check to avoid errors.`,
                      },
                      {
                        title: "Step 4: keep your transfer receipt",
                        desc: "Keep the transfer confirmation. Once you place the order, we will show the order reference to use when you contact us.",
                      },
                      {
                        title: "Step 5: confirm below",
                        desc: "Once you've sent the transfer, tick the checkbox below and place your order. We'll verify the payment and begin processing.",
                      },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-brand/10 text-brand text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-sm mb-1">{s.title}</p>
                          <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md bg-brand/5 p-5 mb-6 border border-brand/20">
                    <p className="text-xs text-muted mb-3">
                      Payment summary
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-muted">Bank</span>
                        <span className="font-medium text-brand">{business.bankDetails.bankName}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted">Account name</span>
                        <span className="font-medium">{business.bankDetails.accountName}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted">Account number</span>
                        <span className="font-medium">{business.bankDetails.accountNumber}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted">Amount</span>
                        <span className="font-bold tabular text-brand text-base">
                          {formatPriceShort(total)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-surface-light border border-surface-light p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted font-semibold">
                        Payment proof <span className="text-foreground/50 normal-case">(optional)</span>
                      </p>
                      {proofFile && (
                        <button
                          onClick={() => { setProofFile(null); setProofError(""); }}
                          className="text-xs text-danger hover:text-danger cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {!proofFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-surface-light rounded-lg cursor-pointer hover:border-brand/40 transition-colors">
                        <input
                          ref={proofInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleProofFile}
                          className="sr-only"
                        />
                        {proofLoading ? (
                          <span className="text-xs text-muted">Processing...</span>
                        ) : (
                          <>
                            <svg className="w-6 h-6 text-muted mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-xs text-muted">Attach a transfer screenshot</span>
                          </>
                        )}
                      </label>
                    ) : (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL */}
                        <img
                          src={proofFile.dataUrl}
                          alt="Payment proof preview"
                          className="w-full h-40 object-contain rounded-lg"
                        />
                        <p className="text-xs text-muted mt-2 truncate">{proofFile.name}</p>
                      </div>
                    )}
                    {proofError && (
                      <p className="text-xs text-danger mt-2">{proofError}</p>
                    )}
                    <p className="text-xs text-muted/60 mt-2">
                      Upload a screenshot of your transfer confirmation so we can check your payment.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border border-surface-light accent-brand cursor-pointer"
                    />
                    <span className="text-sm text-foreground/85 leading-relaxed">
                      I confirm I have sent a bank transfer of{" "}
                      <strong className="text-brand">{formatPriceShort(total)}</strong> to{" "}
                      <strong>
                        {business.bankDetails.bankName}, account {business.bankDetails.accountNumber}
                      </strong>
                      .
                    </span>
                  </label>

                  {!agreed && (
                    <p className="text-xs text-muted mb-4">
                       You must send the transfer first, then confirm to place your order.
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="h-12 px-6 rounded-md border border-brand/40 text-brand font-semibold text-sm hover:bg-brand/10 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!agreed || submitting}
                      className="flex-1 h-12 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? "Placing order..." : "Place order"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-md bg-surface border border-surface-light p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-2">Order summary</h2>
              {freeDeliveryOver > 0 && (
                <p className="text-xs text-muted mb-5">
                  {freeDeliveryThresholdText(freeDeliveryOver)}
                </p>
              )}
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={cartLineKey(item)} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface-light shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      {variantSummary(item) && (
                        <p className="text-xs text-muted truncate">{variantSummary(item)}</p>
                      )}
                      <p className="text-xs text-muted">
                        {formatPriceShort(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular">
                      {formatPriceShort(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-sm border-t border-surface-light pt-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-foreground price tabular">{formatPriceShort(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-muted">
                  <span>
                    {deliveryMethod === "delivery"
                      ? `Delivery${deliveryZone ? ` (${deliveryZone})` : ""}`
                      : "Pickup"}
                  </span>
                  <span className="text-foreground tabular text-right">
                    {deliveryFeeLabel({
                      deliveryMethod,
                      deliveryZone,
                      deliveryFee,
                      subtotal,
                      freeDeliveryOver,
                    })}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-surface-light pt-3">
                  <span>Total</span>
                  <span className="text-brand price tabular">{formatPriceShort(total)}</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-md bg-success-soft border border-success/30 text-sm">
                <p className="flex items-center gap-2 text-success font-semibold mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Why bank transfer?
                </p>
                <p className="text-muted leading-relaxed">
                  You can pay from any Nigerian bank account. We check transfers manually
                  and email you when your payment is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
</div>
    </div>
  );
}
