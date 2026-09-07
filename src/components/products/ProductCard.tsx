"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data/products";
import { useCart } from "@/lib/context/CartContext";
import { getAvailableStock } from "@/lib/stock";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const available = getAvailableStock(product.id);
  const outOfStock = available <= 0;

  const handleQuickAdd = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
    });
  };

  return (
    <div className="group relative flex flex-col rounded-xl bg-surface border border-surface-light hover:border-gold/40 transition-all duration-300 overflow-hidden shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-surface-light">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.compareAtPrice && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-gold text-background text-[10px] font-bold uppercase tracking-wide shadow-lg">
              Sale
            </span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-4 py-1.5 rounded-full bg-surface border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
        {product.rating >= 4.8 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm text-gold text-xs font-semibold">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {product.rating}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <Link href={`/products/${product.id}`} className="group-hover:text-gold transition-colors">
          <h3 className="font-serif text-base font-semibold leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted uppercase tracking-wider mt-1">
          {product.category}
        </p>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg font-bold text-gold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleQuickAdd}
            disabled={outOfStock}
            className="flex-1 h-10 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {outOfStock ? "Sold Out" : "Add to Cart"}
          </button>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
            aria-label="View details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l6-6m-5.5.5a4.5 4.5 0 116 6l-6-6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 4.5l3.75 3.75-9 9-3.75-3.75 9-9z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}