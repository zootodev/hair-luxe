"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPriceShort, productSpec } from "@/lib/format";
import { useCart } from "@/lib/context/CartContext";
import { getSoldCount } from "@/lib/stock";
import Toast from "@/components/ui/Toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  // Seed with the SSR-safe value so hydration matches, then adopt the
  // localStorage-backed stock from the client on mount.
  const [available, setAvailable] = useState(() =>
    Math.max(0, product.stockCount - (product.sold ?? 0))
  );
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- local stock is only known after mount */
  useEffect(() => {
    setAvailable(Math.max(0, product.stockCount - getSoldCount(product.id)));
  }, [product.id, product.stockCount]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const outOfStock = available <= 0;
  const lowStock = available > 0 && available <= 5;
  const spec = productSpec(product);

  const handleQuickAdd = () => {
    if (outOfStock || adding) return;
    setAdding(true);
    // Brief loading state guards against double-clicks before the item lands.
    window.setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category,
      });
      setAdding(false);
      setToast("Added to cart");
    }, 350);
  };

  return (
    <div className="flex flex-col rounded-md bg-surface border border-surface-light overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-surface-light">
        <Image
          src={product.image}
          alt={`${product.name} — ${spec}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-md bg-surface border border-surface-light text-foreground text-xs font-semibold">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <Link href={`/shop/${product.slug ?? product.id}`} className="hover:text-brand transition-colors">
          <h3 className="text-base font-semibold leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted mt-1">{spec}</p>
        <p className="text-lg font-semibold text-brand price tabular mt-3">
          {formatPriceShort(product.price)}
        </p>

        {outOfStock && <p className="mt-2 text-xs text-danger">Out of stock</p>}
        {lowStock && <p className="mt-2 text-xs text-warning">Only {available} left</p>}

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleQuickAdd}
            disabled={outOfStock || adding}
            className="flex-1 h-10 rounded-md bg-brand text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {outOfStock ? "Out of stock" : adding ? "Adding..." : "Add to cart"}
          </button>
          <Link
            href={`/shop/${product.slug ?? product.id}`}
            className="flex items-center justify-center w-10 h-10 rounded-md border border-brand/30 text-brand hover:bg-brand/10 transition-colors"
            aria-label={`View ${product.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l6-6m-5.5.5a4.5 4.5 0 116 6l-6-6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 4.5l3.75 3.75-9 9-3.75-3.75 9-9z" />
            </svg>
          </Link>
        </div>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
