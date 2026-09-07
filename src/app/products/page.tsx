"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/products/ProductCard";
import type { ProductCategory } from "@/lib/types";

const CATEGORIES: ("All" | ProductCategory)[] = [
  "All",
  "Wigs",
  "Hair Bundles",
  "Lashes",
  "Hair Care",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export default function ProductsPage() {
  const [category, setCategory] = useState<"All" | ProductCategory>("All");
  const [sort, setSort] = useState<SortValue>("featured");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (search.trim() === "" ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()))
    );

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        result = [...result].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return result;
  }, [category, sort, search]);

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Premium Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Shop Products</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Luxury wigs, virgin hair bundles, lashes and hair care essentials.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === c
                    ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"
                    : "bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-56">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full h-11 rounded-full bg-surface border border-surface-light pl-9 pr-4 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              className="h-11 rounded-full bg-surface border border-surface-light px-4 text-sm focus:border-gold focus:outline-none appearance-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}