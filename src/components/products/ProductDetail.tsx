"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPriceShort, productSpec, swatchColor } from "@/lib/format";
import { hasVaryingLengthPrices, priceForLength } from "@/lib/product-pricing";
import { useCart } from "@/lib/context/CartContext";
import Toast from "@/components/ui/Toast";
import type { Product } from "@/lib/types";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState<string | null>(product.colors?.[0] ?? null);
  const [length, setLength] = useState<string | null>(product.lengths?.[0] ?? null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const available = Math.max(0, product.stockCount - (product.sold ?? 0));
  const outOfStock = available <= 0;
  const lowStock = available > 0 && available <= 5;
  const selectedPrice = priceForLength(product, length);
  const varyingLengthPrices = hasVaryingLengthPrices(product);

  const handleAdd = () => {
    if (outOfStock || adding) return;
    setAdding(true);
    // Brief loading state guards against double-clicks before the item lands.
    window.setTimeout(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: selectedPrice,
        image: product.image,
        quantity,
        category: product.category,
        color: color ?? undefined,
        length: length ?? undefined,
      });
      setAdding(false);
      setToast("Added to cart");
    }, 350);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      <div>
        <div className="relative aspect-square rounded-md overflow-hidden bg-surface-light border border-surface-light">
          <Image
            src={product.images[activeImage] || product.image}
            alt={`${product.name} — ${productSpec(product)}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                  activeImage === i ? "border-brand" : "border-surface-light"
                }`}
                aria-label={`View image ${i + 1} of ${product.name}`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-brand text-xs font-semibold mb-2">{product.category}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">{product.name}</h1>
        <p className="text-sm text-muted mb-4">{productSpec(product)}</p>

        <p className="text-3xl font-semibold text-brand price tabular mb-6">
          {formatPriceShort(selectedPrice)}
        </p>

        <p className="text-muted leading-relaxed mb-6">{product.description}</p>

        {outOfStock && <p className="text-sm text-danger mb-5">Out of stock</p>}
        {lowStock && <p className="text-sm text-warning mb-5">Only {available} left</p>}

        {product.colors && product.colors.length > 0 && (
          <div className="mb-5">
            <p className="text-xs text-muted mb-2">
              Colour: <span className="text-foreground font-semibold">{color}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {product.colors.map((c) => {
                const selected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Colour: ${c}`}
                    aria-pressed={selected}
                    title={c}
                    className={`relative w-9 h-9 rounded-md border-2 transition-colors cursor-pointer ${
                      selected ? "border-brand" : "border-surface-light"
                    }`}
                    style={{ backgroundColor: swatchColor(c) }}
                  >
                    {selected && (
                      <svg
                        className="w-4 h-4 absolute inset-0 m-auto text-background"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {product.lengths && product.lengths.length > 0 && (
          <div className="mb-5">
            {product.lengths.length === 1 ? (
              <p className="text-sm">
                <span className="text-muted">Length:</span>{" "}
                <span className="font-semibold">{product.lengths[0]}</span>
              </p>
            ) : (
              <>
                <p className="text-xs text-muted mb-2">
                  Length: <span className="text-foreground font-semibold">{length}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.lengths.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLength(l)}
                      aria-pressed={length === l}
                      title={l}
                      className={`px-3 py-2 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                        length === l
                          ? "bg-brand text-background border-brand"
                          : "bg-surface text-muted border-surface-light hover:border-brand/40 hover:text-brand"
                      }`}
                    >
                      <span>{l}</span>
                      {varyingLengthPrices && (
                        <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                          {formatPriceShort(priceForLength(product, l))}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center rounded-md border border-surface-light bg-surface">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex items-center justify-center w-11 h-11 text-xl text-muted hover:text-brand transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold tabular">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(available || 1, q + 1))}
              className="flex items-center justify-center w-11 h-11 text-xl text-muted hover:text-brand transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={outOfStock || adding}
            className={`flex-1 h-12 rounded-md font-semibold text-sm transition-opacity ${
              adding
                ? "bg-brand/60 text-background"
                : "bg-brand text-background hover:opacity-90"
            } disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
          >
            {outOfStock ? "Out of stock" : adding ? "Adding..." : "Add to cart"}
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-md bg-surface border border-surface-light mb-6">
          <span className="text-brand">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z"
              />
            </svg>
          </span>
          <div className="text-sm">
            <p className="font-semibold">Delivery or pickup</p>
            <p className="text-muted">Delivery across Lagos and Ibadan, or pickup at the studio</p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3">Product details</h3>
          <ul className="space-y-2">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
