"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { cartLineKey, variantSummary } from "@/lib/cart";
import { deliveryFeeLabel, freeDeliveryThresholdText } from "@/lib/delivery-display";
import { formatPriceShort } from "@/lib/format";
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
    deliveryZones,
    freeDeliveryOver,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-24 md:pt-28 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-md bg-brand/10 text-brand mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-semibold mb-3">Your cart is empty</h1>
          <p className="text-muted mb-8">
            Browse wigs, bundles, lashes and hair care, with prices in naira.
          </p>
          <Button href="/shop" size="lg">
            Shop products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-8">Your cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const lineKey = cartLineKey(item);
              const variant = variantSummary(item);
              return (
              <div
                key={lineKey}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-md bg-surface border border-surface-light"
              >
                <Link
                  href={`/shop/${item.productId}`}
                  className="relative w-full sm:w-24 h-32 sm:h-24 rounded-md overflow-hidden bg-surface-light shrink-0"
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-brand mb-1">{item.category}</p>
                      <Link
                        href={`/shop/${item.productId}`}
                        className="font-semibold hover:text-brand transition-colors"
                      >
                        {item.name}
                      </Link>
                      {variant && <p className="text-xs text-muted mt-0.5">{variant}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(lineKey)}
                      className="text-muted hover:text-danger transition-colors cursor-pointer"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-surface-light bg-surface-light">
                      <button
                        onClick={() => updateQuantity(lineKey, item.quantity - 1)}
                        className="flex items-center justify-center w-9 h-9 text-lg text-muted hover:text-brand transition-colors cursor-pointer"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(lineKey, item.quantity + 1)}
                        className="flex items-center justify-center w-9 h-9 text-lg text-muted hover:text-brand transition-colors cursor-pointer"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-brand text-lg price tabular">
                      {formatPriceShort(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
              );
            })}

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Continue shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-md bg-surface border border-surface-light p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-2">Order summary</h2>
              {freeDeliveryOver > 0 && (
                <p className="text-xs text-muted mb-6">
                  {freeDeliveryThresholdText(freeDeliveryOver)}
                </p>
              )}

              <div className="mb-6">
                <p className="text-xs text-muted mb-3">Fulfilment method</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`h-10 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      deliveryMethod === "delivery"
                        ? "bg-brand text-background"
                        : "bg-surface-light text-muted hover:text-brand"
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`h-10 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      deliveryMethod === "pickup"
                        ? "bg-brand text-background"
                        : "bg-surface-light text-muted hover:text-brand"
                    }`}
                  >
                    Pickup
                  </button>
                </div>
              </div>

              {deliveryMethod === "delivery" && (
                <div className="mb-6">
                  <p className="text-xs text-muted mb-3">Delivery zone</p>
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    aria-label="Delivery zone"
                    className="w-full h-10 rounded-md bg-surface-light border border-surface-light px-3 text-sm focus:border-brand focus:outline-none"
                  >
                    <option value="">Select delivery zone</option>
                    {deliveryZones.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.name} — {formatPriceShort(z.fee)} ({z.days})
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
                  <span className="text-foreground price tabular">{formatPriceShort(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-muted">
                  <span>{deliveryMethod === "delivery" ? "Delivery" : "Pickup"}</span>
                  <span className="text-foreground price tabular text-right">
                    {deliveryFeeLabel({
                      deliveryMethod,
                      deliveryZone,
                      deliveryFee,
                      subtotal,
                      freeDeliveryOver,
                    })}
                  </span>
                </div>
                {deliveryMethod === "delivery" &&
                  deliveryZone &&
                  freeDeliveryOver > 0 &&
                  subtotal < freeDeliveryOver && (
                    <p className="text-xs text-muted">
                      Add {formatPriceShort(freeDeliveryOver - subtotal)} more for free delivery.
                    </p>
                  )}
                <div className="flex justify-between font-semibold text-base border-t border-surface-light pt-3">
                  <span>Total</span>
                  <span className="text-brand price tabular">{formatPriceShort(total)}</span>
                </div>
              </div>

              <Button href="/checkout" size="lg" fullWidth className="mt-6">
                Go to checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
