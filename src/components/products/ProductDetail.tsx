"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/data/products";
import { useCart } from "@/lib/context/CartContext";
import { getAvailableStock } from "@/lib/stock";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const available = getAvailableStock(product.id);
  const outOfStock = available <= 0;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const stockLabel =
    outOfStock
      ? "Out of Stock"
      : available <= 10
        ? `Only ${available} left - Order soon!`
        : `In Stock (${available})`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      <div>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-surface-light">
          <Image
            src={product.images[activeImage] || product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-background text-xs font-bold uppercase">
              Save {discount}%
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImage === i ? "border-gold" : "border-surface-light"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-gold uppercase tracking-wider text-xs font-semibold mb-2">
          {product.category}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">{product.name}</h1>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating) ? "" : "opacity-25"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-muted">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-serif text-4xl font-bold text-gold">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xl text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="text-muted leading-relaxed mb-6">{product.description}</p>

        <div className="mb-6">
          <p
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              outOfStock ? "text-red-400" : "text-emerald-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                outOfStock ? "bg-red-400" : "bg-emerald-400 animate-pulse"
              }`}
            />
            {stockLabel}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center rounded-full border border-surface-light bg-surface">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex items-center justify-center w-11 h-11 text-xl text-muted hover:text-gold transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(available || 1, q + 1))}
              className="flex items-center justify-center w-11 h-11 text-xl text-muted hover:text-gold transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`flex-1 h-12 rounded-full font-semibold text-sm transition-all ${
              added
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {outOfStock ? "Sold Out" : added ? "Added to Cart!" : "Add to Cart"}
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-surface-light mb-6">
          <span className="text-gold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z"
              />
            </svg>
          </span>
          <div className="text-sm">
            <p className="font-semibold">Delivery or Pickup</p>
            <p className="text-muted">Local delivery across Ontario or in-store pickup</p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold mb-3">Product Details</h3>
          <ul className="space-y-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}