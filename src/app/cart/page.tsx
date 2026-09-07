"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/data/products";
import { DELIVERY_ZONES } from "@/lib/config";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    deliveryMethod,
    setDeliveryMethod,
    deliveryZone,
    setDeliveryZone,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-gold/10 text-gold mb-6">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold mb-3">Your Cart is Empty</h1>
          <p className="text-muted mb-8">
            Explore our premium wigs, hair bundles and beauty essentials.
          </p>
          <Button href="/products" size="lg">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-8 text-center">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-surface border border-surface-light"
              >
                <Link
                  href={`/products/${item.productId}`}
                  className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-surface-light shrink-0"
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gold uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-serif font-semibold hover:text-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted hover:text-red-400 transition-colors cursor-pointer"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-surface-light bg-surface-light">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex items-center justify-center w-9 h-9 text-lg text-muted hover:text-gold transition-colors cursor-pointer"
                        aria-label="Decrease"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex items-center justify-center w-9 h-9 text-lg text-muted hover:text-gold transition-colors cursor-pointer"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-gold text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-surface border border-surface-light p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>

              <div className="mb-6">
                <p className="text-xs text-muted uppercase tracking-wide mb-3">
                  Fulfillment Method
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`h-10 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      deliveryMethod === "delivery"
                        ? "bg-gold text-background"
                        : "bg-surface-light text-muted hover:text-gold"
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`h-10 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      deliveryMethod === "pickup"
                        ? "bg-gold text-background"
                        : "bg-surface-light text-muted hover:text-gold"
                    }`}
                  >
                    Pickup
                  </button>
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="mb-6">
                  <p className="text-xs text-muted uppercase tracking-wide mb-3">
                    Delivery Zone
                  </p>
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    className="w-full h-10 rounded-lg bg-surface-light border border-surface-light px-3 text-sm focus:border-gold focus:outline-none"
                  >
                    {DELIVERY_ZONES.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.name} - ${z.fee.toFixed(2)} ({z.days})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-3 text-sm border-t border-surface-light pt-4">
                <div className="flex justify-between text-muted">
                  <span>
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>
                    {deliveryMethod === "delivery" ? "Delivery Fee" : "Pickup"}
                  </span>
                  <span className="text-foreground">
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-surface-light pt-3">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button href="/checkout" size="lg" fullWidth className="mt-6">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}