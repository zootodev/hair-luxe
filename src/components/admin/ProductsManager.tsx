"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, ProductCategory } from "@/lib/types";

type LiveProduct = Product & { sold: number };

const CATEGORIES: ProductCategory[] = ["Wigs", "Hair Bundles", "Lashes", "Hair Care"];

interface Draft {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  compareAtPrice: string;
  stockCount: string;
  featured: boolean;
  visible: boolean;
  dirty: boolean;
  saving: boolean;
}

const inputClass =
  "w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none";

export default function ProductsManager() {
  const [rows, setRows] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { products: LiveProduct[] };
      setRows(
        data.products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: String(p.price),
          compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
          stockCount: String(p.stockCount),
          featured: !!p.featured,
          visible: p.visible !== false,
          dirty: false,
          saving: false,
        }))
      );
    } catch {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- data fetch (all setState calls are post-await) */
  useEffect(() => {
    load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const update = (id: string, patch: Partial<Draft>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, dirty: true } : r)));

  const save = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, saving: true } : r)));
    setNotice("");
    setError("");
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product",
          id: row.id,
          data: {
            name: row.name,
            description: row.description,
            category: row.category,
            price: Number(row.price),
            compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
            stockCount: Number(row.stockCount),
            featured: row.featured,
            visible: row.visible,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, dirty: false, saving: false } : r)));
      setNotice(`Saved "${row.name}".`);
    } catch {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, saving: false } : r)));
      setError("Failed to save. Please try again.");
    }
  };

  const reset = async (id: string) => {
    if (!confirm("Reset this product to the default catalog values?")) return;
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "product", id, reset: true }),
      });
      if (!res.ok) throw new Error();
      await load();
      setNotice("Reset to defaults.");
    } catch {
      setError("Failed to reset.");
    }
  };

  const dirtyCount = rows.filter((r) => r.dirty).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">
            Catalog Manager
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Products</h1>
          <p className="text-xs text-muted mt-1">
            Changes go live on the store immediately. Sold units are tracked automatically.
          </p>
        </div>
        {dirtyCount > 0 && (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 w-fit">
            {dirtyCount} unsaved product{dirtyCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 mb-5 text-sm text-red-400">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-5 text-sm text-emerald-400">
          {notice}
        </div>
      )}

      {loading && <p className="text-muted py-10 text-center">Loading products...</p>}

      {!loading && (
        <div className="space-y-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`rounded-2xl bg-surface border p-5 ${
                row.dirty ? "border-amber-500/50" : "border-surface-light"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-sm shrink-0">
                  {row.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">
                    {row.name}
                    <span className="text-muted font-normal"> &middot; {row.id}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {row.category}
                    {row.dirty && <span className="text-amber-400 font-semibold ml-2">Unsaved</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => reset(row.id)}
                    disabled={row.saving}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => save(row.id)}
                    disabled={row.saving || !row.dirty}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {row.saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                <label className="col-span-2 lg:col-span-2">
                  <span className="block text-xs text-muted mb-1">Name</span>
                  <input
                    className={inputClass}
                    value={row.name}
                    onChange={(e) => update(row.id, { name: e.target.value })}
                  />
                </label>
                <label className="col-span-2">
                  <span className="block text-xs text-muted mb-1">Category</span>
                  <select
                    className={inputClass}
                    value={row.category}
                    onChange={(e) =>
                      update(row.id, { category: e.target.value as ProductCategory })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
<span className="block text-xs text-muted mb-1">Price</span>
                <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.price}
                    onChange={(e) => update(row.id, { price: e.target.value })}
                  />
                </label>
                <label>
<span className="block text-xs text-muted mb-1">Compare At</span>
                <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.compareAtPrice}
                    onChange={(e) => update(row.id, { compareAtPrice: e.target.value })}
                  />
                </label>
                <label>
                  <span className="block text-xs text-muted mb-1">Stock</span>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    step="1"
                    value={row.stockCount}
                    onChange={(e) => update(row.id, { stockCount: e.target.value })}
                  />
                </label>
                <label className="col-span-2 lg:col-span-6">
                  <span className="block text-xs text-muted mb-1">Description</span>
                  <textarea
                    className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"
                    rows={2}
                    value={row.description}
                    onChange={(e) => update(row.id, { description: e.target.value })}
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-5 mt-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.visible}
                    onChange={(e) => update(row.id, { visible: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-muted">Visible on store</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.featured}
                    onChange={(e) => update(row.id, { featured: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-muted">Featured on home</span>
                </label>
                <span className="ml-auto text-xs text-muted">
                  In stock: {row.stockCount} &middot; Active listings update instantly
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}