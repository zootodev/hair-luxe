"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/data/products";
import { BUSINESS } from "@/lib/config";
import { sendOrderEmail } from "@/lib/email/sendOrderEmail";
import { generateOrderId, saveOrder } from "@/lib/orders";
import { recordSold } from "@/lib/stock";
import type { Order } from "@/lib/types";

const STATUS_STEPS = [
  { label: "Order Details", step: 1 },
  { label: "Interac Payment", step: 2 },
  { label: "Confirmation", step: 3 },
];

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, deliveryMethod, deliveryZone, clearCart } =
    useCart();

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
const [emailStatus, setEmailStatus] = useState<string>("");
  const [proofFile, setProofFile] = useState<{ dataUrl: string; name: string } | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [proofError, setProofError] = useState("");
  const proofInputRef = useRef<HTMLInputElement>(null);
  const previewId = generateOrderId();

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
    if (!/^[\d\s()+-]{7,}$/.test(form.phone)) newErrors.phone = "Enter a valid phone number";
    if (!form.city.trim()) newErrors.city = "Required";
    if (deliveryMethod === "delivery" && !form.address.trim()) newErrors.address = "Required";
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
    setEmailStatus("");

    const order: Order = {
      id: generateOrderId(),
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        address: deliveryMethod === "delivery" ? form.address : undefined,
        deliveryMethod,
        deliveryZone: deliveryMethod === "delivery" ? deliveryZone : undefined,
        notes: form.notes,
      },
      items,
      subtotal,
      deliveryFee,
      total,
      status: "pending",
      paymentMethod: "interac",
      date: new Date().toISOString(),
      paymentProof: proofFile?.dataUrl,
      paymentProofName: proofFile?.name,
    };

    const emailResult = await sendOrderEmail(order);
    saveOrder(order);
    recordSold(items);
    clearCart();

    setEmailStatus(
      emailResult.ok
        ? "Order confirmation email sent successfully."
        : emailResult.status === 412
          ? "Order placed. Email blocked by EmailJS domain policy (412). The dashboard allowlist is a paid feature - see the console or contact setup support."
          : emailResult.status === 401
            ? "Order placed. Email failed: Invalid EmailJS Public Key (401). Check src/lib/config.ts."
            : emailResult.status
              ? `Order placed. Email failed (error ${emailResult.status}: ${emailResult.text}). Check the console for details.`
              : "Order placed, but the email notification could not be sent (no response from EmailJS). Check your internet / any firewall or ad-blocker, then verify the order in the admin dashboard."
    );
    setPlacedOrder(order);
    setSubmitting(false);
  };

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gold/10 text-gold mb-6">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold mb-3">No Items to Checkout</h1>
          <p className="text-muted mb-8">Your cart is empty. Add some luxury products first.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-[70vh] flex items-center justify-center">
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
            Thank You, {placedOrder.customer.firstName}!
          </h1>
          <p className="text-muted mb-6">Your order has been placed successfully.</p>

          <div className="rounded-2xl bg-surface border border-gold/20 p-6 mb-6 text-left animate-fade-in-up">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gold/10">
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">Order Reference</p>
                <p className="font-serif text-xl font-bold text-gold">{placedOrder.id}</p>
              </div>
              <p className="text-xs text-muted">Status: Pending</p>
            </div>

            <div className="space-y-3 mb-4">
              {placedOrder.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <span>
                    {item.name} <span className="text-muted">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-gold/10 pt-4">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(placedOrder.subtotal)}</span>
              </div>
              {placedOrder.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Delivery Fee</span>
                  <span>{formatPrice(placedOrder.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2">
                <span>Total</span>
                <span className="text-gold">{formatPrice(placedOrder.total)}</span>
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
                <span className="font-medium text-gold">{formatPrice(placedOrder.total)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted">Message:</span>
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
                Pickup at {BUSINESS.address}. Please call {BUSINESS.phone} when you arrive.
              </>
            )}
          </p>

          {placedOrder.paymentProofName && (
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 mb-5 text-sm text-emerald-400 flex items-center gap-2 justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Payment proof received: {placedOrder.paymentProofName}
            </div>
          )}

          {emailStatus && (
            <p className="text-sm text-emerald-400 mb-6">{emailStatus}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
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
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">Checkout</h1>

        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {STATUS_STEPS.map((s, i) => (
            <div key={s.step} className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                    step >= s.step
                      ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background"
                      : "bg-surface border border-surface-light text-muted"
                  }`}
                >
                  {s.step}
                </span>
                <span
                  className={`hidden sm:block text-xs font-medium ${
                    step >= s.step ? "text-gold" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <span
                  className={`w-8 sm:w-16 h-px ${
                    step > s.step ? "bg-gold" : "bg-surface-light"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 1 && (
              <div className="rounded-2xl bg-surface border border-surface-light p-6">
                <h2 className="font-serif text-xl font-bold mb-6">Contact &amp; Delivery Info</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                      First Name *
                    </span>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.firstName ? "border-red-500" : "border-surface-light focus:border-gold"
                      }`}
                      placeholder="Jane"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                      Last Name *
                    </span>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.lastName ? "border-red-500" : "border-surface-light focus:border-gold"
                      }`}
                      placeholder="Smith"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                      Email *
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.email ? "border-red-500" : "border-surface-light focus:border-gold"
                      }`}
                      placeholder="jane@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                      Phone Number *
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.phone ? "border-red-500" : "border-surface-light focus:border-gold"
                      }`}
                      placeholder="(647) 555-0123"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <label className="block">
                    <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                      City *
                    </span>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.city ? "border-red-500" : "border-surface-light focus:border-gold"
                      }`}
                      placeholder="Toronto"
                    />
                    {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                  </label>
                  <label className="block">
                    <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                      Delivery Zone
                    </span>
                    <div className="w-full h-11 rounded-lg bg-surface-light border border-surface-light px-4 text-sm flex items-center text-muted">
                      {deliveryZone}
                    </div>
                  </label>
                </div>

                {deliveryMethod === "delivery" && (
                  <label className="block mb-4">
                    <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                      Street Address *
                    </span>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={`w-full h-11 rounded-lg bg-surface-light border px-4 text-sm focus:outline-none ${
                        errors.address ? "border-red-500" : "border-surface-light focus:border-gold"
                      }`}
                      placeholder="123 Maple Street, Apt 4"
                    />
                    {errors.address && (
                      <p className="text-xs text-red-400 mt-1">{errors.address}</p>
                    )}
                  </label>
                )}

                <label className="block mb-6">
                  <span className="text-xs text-muted uppercase tracking-wide mb-1.5 block">
                    Order Notes (optional)
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full rounded-lg bg-surface-light border border-surface-light px-4 py-3 text-sm focus:border-gold focus:outline-none min-h-[90px] resize-none"
                    placeholder="Delivery instructions, gift note, etc."
                  />
                </label>

                <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 mb-6 text-sm flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gold shrink-0 mt-0.5"
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
                    Delivery is {formatPrice(deliveryFee)} to {deliveryZone} and takes 2-3
                    business days. We&apos;ll call you on your phone number before delivery.
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-surface border border-surface-light p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl font-bold">Interac e-Transfer</h2>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secure &amp; Encrypted
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    {[
                      {
                        title: "Step 1: Log into your online banking",
                        desc: "Open your bank's app or website and navigate to Interac e-Transfer.",
                      },
                      {
                        title: `Step 2: Send to ${BUSINESS.interacEmail}`,
                        desc: `Enter the email ${BUSINESS.interacEmail} as the recipient. Does the recipient have the security question set up? No problem, select "No security question" if available.`,
                      },
                      {
                        title: `Step 3: Send exactly ${formatPrice(total)}`,
                        desc: `Transfer the exact amount of ${formatPrice(total)}. Double-check to avoid errors.`,
                      },
                      {
                        title: `Step 4: Include message "Order ${previewId}"`,
                        desc: "Add your order number as the e-Transfer message so we can match your payment quickly.",
                      },
                      {
                        title: "Step 5: Confirm below",
                        desc: "Once you've sent the transfer, tick the checkbox below and place your order. We'll verify the payment and begin processing.",
                      },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-sm mb-1">{s.title}</p>
                          <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-overlay p-5 mb-6 border border-gold/20" style={{ backgroundColor: "rgba(212,175,55,0.05)" }}>
                    <p className="text-xs text-muted uppercase tracking-wide mb-3">
                      Payment Summary
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-muted">Recipient</span>
                        <span className="font-medium text-gold">{BUSINESS.interacEmail}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted">Amount</span>
                        <span className="font-bold text-gold text-base">
                          {formatPrice(total)}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-muted">Message</span>
                        <span className="font-medium">Order {previewId}</span>
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface-light border border-surface-light p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted uppercase tracking-wide font-semibold">
                        Payment Proof <span className="text-foreground/50 normal-case">(optional)</span>
                      </p>
                      {proofFile && (
                        <button
                          onClick={() => { setProofFile(null); setProofError(""); }}
                          className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {!proofFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-surface-light rounded-lg cursor-pointer hover:border-gold/40 transition-colors">
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
                            <span className="text-xs text-muted">Attach screenshot of e-Transfer</span>
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
                      <p className="text-xs text-red-400 mt-2">{proofError}</p>
                    )}
                    <p className="text-xs text-muted/60 mt-2">
                      Upload a screenshot of your e-Transfer confirmation to help us verify your payment faster.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border border-surface-light accent-[#d4af37] cursor-pointer"
                    />
                    <span className="text-sm text-foreground/85 leading-relaxed">
                      I confirm I have sent the Interac e-Transfer of{" "}
                      <strong className="text-gold">{formatPrice(total)}</strong> to{" "}
                      <strong>{BUSINESS.interacEmail}</strong> with message{" "}
                      <strong>Order {previewId}</strong>.
                    </span>
                  </label>

                  {!agreed && (
                    <p className="text-xs text-muted mb-4">
                      You must send the e-Transfer first, then confirm to place your order.
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleBack}
                      className="h-12 px-6 rounded-full border border-gold/40 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!agreed || submitting}
                      className="flex-1 h-12 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? "Placing Order..." : "Place Order & Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-surface border border-surface-light p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
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
                      <p className="text-xs text-muted">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-sm border-t border-surface-light pt-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>{deliveryMethod === "delivery" ? `Delivery (${deliveryZone})` : "Pickup"}</span>
                  <span className="text-foreground">
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-surface-light pt-3">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-sm">
                <p className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Why e-Transfer?
                </p>
                <p className="text-muted leading-relaxed">
                  Interac e-Transfer is fast, secure and available with every Canadian bank. No
                  card fees, no delays - we confirm manually and ship within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
</div>
    </div>
  );
}
