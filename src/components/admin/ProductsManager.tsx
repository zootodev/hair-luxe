"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import Modal from "@/components/ui/Modal";
import type { Product, ProductCategory } from "@/lib/types";

type LiveProduct = Product & { sold: number };

const CATEGORIES: ProductCategory[] = ["Wigs", "Hair Bundles", "Lashes", "Hair Care"];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Draft {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  compareAtPrice: string;
  stockCount: string;
  image: string;
  sold: number;
  featured: boolean;
  visible: boolean;
  dirty: boolean;
  saving: boolean;
}

interface NewProduct {
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  compareAtPrice: string;
  stockCount: string;
  image: string;
  featured: boolean;
  visible: boolean;
}

const EMPTY_NEW_PRODUCT: NewProduct = {
  name: "",
  description: "",
  category: "Wigs",
  price: "",
  compareAtPrice: "",
  stockCount: "",
  image: "",
  featured: false,
  visible: true,
};

const STOCK_HELP =
  "Total units stocked. Available = total − sold (reserved for orders). This input edits the total.";

const inputClass =
  "w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none";

export default function ProductsManager() {
  const [rows, setRows] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // Last-saved values per product, used by "Discard changes".
  const pristineRef = useRef<Record<string, Draft>>({});
  const [discardTarget, setDiscardTarget] = useState<{ id: string; name: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [newProduct, setNewProduct] = useState<NewProduct>(EMPTY_NEW_PRODUCT);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { products: LiveProduct[] };
      const loaded = data.products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: String(p.price),
        compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
        stockCount: String(p.stockCount),
        image: p.image ?? "",
        sold: p.sold ?? 0,
        featured: !!p.featured,
        visible: p.visible !== false,
        dirty: false,
        saving: false,
      }));
      pristineRef.current = Object.fromEntries(loaded.map((r) => [r.id, r]));
      setRows(loaded);
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
    if (!row.name.trim()) {
      setError("Name is required.");
      return;
    }
    const price = Number(row.price);
    if (!Number.isFinite(price) || price <= 0) {
      setError(`"${row.name}": Price must be a positive number (in naira).`);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, saving: true } : r)));
    setNotice("");
    setError("");
    try {
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product",
          id: row.id,
          data: {
            name: row.name,
            description: row.description,
            category: row.category,
            price,
            compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : null,
            stockCount: Number(row.stockCount),
            image: row.image,
            featured: row.featured,
            visible: row.visible,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const saved = { ...r, dirty: false, saving: false };
          pristineRef.current[id] = saved;
          return saved;
        })
      );
      setNotice(`Saved "${row.name}".`);
    } catch {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, saving: false } : r)));
      setError("Failed to save. Please try again.");
    }
  };

  // Reverts unsaved local edits back to the last saved values (no server call).
  const discard = (id: string) => {
    const pristine = pristineRef.current[id];
    if (!pristine) return;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...pristine, saving: false } : r)));
    setNotice("Changes discarded.");
  };

  const createProduct = async () => {
    setAddError("");
    const name = newProduct.name.trim();
    if (!name) {
      setAddError("Name is required.");
      return;
    }
    const price = Number(newProduct.price);
    if (!Number.isFinite(price) || price <= 0) {
      setAddError("Price must be a positive number (in naira).");
      return;
    }
    const stock = Number(newProduct.stockCount || "0");
    if (!Number.isFinite(stock) || stock < 0) {
      setAddError("Stock must be zero or more.");
      return;
    }
    const slug = slugify(name);
    if (!slug) {
      setAddError("Name must contain letters or numbers.");
      return;
    }
    if (rows.some((r) => r.id === slug)) {
      setAddError(`A product with the id "${slug}" already exists.`);
      return;
    }
    setAdding(true);
    try {
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product",
          id: slug,
          data: {
            name,
            description: newProduct.description.trim(),
            category: newProduct.category,
            price,
            compareAtPrice: newProduct.compareAtPrice ? Number(newProduct.compareAtPrice) : null,
            stockCount: stock,
            image: newProduct.image.trim(),
            rating: 0,
            reviewCount: 0,
            details: [],
            featured: newProduct.featured,
            visible: newProduct.visible,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setShowAdd(false);
      setNewProduct(EMPTY_NEW_PRODUCT);
      await load();
      setNotice(`Added "${name}".`);
    } catch {
      setAddError("Failed to add the product. Please try again.");
    } finally {
      setAdding(false);
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
        <div className="flex items-center gap-2 w-fit">
          {dirtyCount > 0 && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {dirtyCount} unsaved product{dirtyCount > 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={() => {
              setShowAdd((v) => !v);
              setAddError("");
            }}
            aria-expanded={showAdd}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"
          >
            {showAdd ? "Close" : "Add Product"}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="rounded-2xl bg-surface border border-gold/30 p-5 mb-6">
          <h2 className="font-serif text-lg font-bold mb-4">New Product</h2>
          {addError && (
            <p className="text-sm text-red-400 mb-3" role="alert">
              {addError}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm mb-4">
            <label className="col-span-2 lg:col-span-2" htmlFor="prod-new-name">
              <span className="block text-xs text-muted mb-1">Name</span>
              <input
                id="prod-new-name"
                className={inputClass}
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </label>
            <label className="col-span-2" htmlFor="prod-new-category">
              <span className="block text-xs text-muted mb-1">Category</span>
              <select
                id="prod-new-category"
                className={inputClass}
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="prod-new-price">
              <span className="block text-xs text-muted mb-1">Price (₦)</span>
              <input
                id="prod-new-price"
                className={inputClass}
                type="number"
                min="0"
                step="1000"
                placeholder="205000"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </label>
            <label htmlFor="prod-new-compare">
              <span className="block text-xs text-muted mb-1">Compare At (₦)</span>
              <input
                id="prod-new-compare"
                className={inputClass}
                type="number"
                min="0"
                step="1000"
                value={newProduct.compareAtPrice}
                onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
              />
            </label>
            <label htmlFor="prod-new-stock">
              <span className="block text-xs text-muted mb-1" title={STOCK_HELP}>
                Stock (total)
              </span>
              <input
                id="prod-new-stock"
                className={inputClass}
                type="number"
                min="0"
                step="1"
                value={newProduct.stockCount}
                onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
              />
            </label>
            <label className="col-span-2 lg:col-span-6" htmlFor="prod-new-image">
              <span className="block text-xs text-muted mb-1">
                Image URL (shown on the storefront)
              </span>
              <input
                id="prod-new-image"
                className={inputClass}
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </label>
            <label className="col-span-2 lg:col-span-6" htmlFor="prod-new-description">
              <span className="block text-xs text-muted mb-1">Description</span>
              <textarea
                id="prod-new-description"
                className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"
                rows={2}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newProduct.visible}
                  onChange={(e) => setNewProduct({ ...newProduct, visible: e.target.checked })}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-muted">Visible on store</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newProduct.featured}
                  onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-muted">Featured on home</span>
              </label>
            </div>
            <button
              onClick={createProduct}
              disabled={adding}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {adding ? "Adding..." : "Add Product"}
            </button>
          </div>
        </div>
      )}

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
                    onClick={() => setDiscardTarget({ id: row.id, name: row.name })}
                    disabled={row.saving || !row.dirty}
                    title="Discard unsaved edits on this product"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Discard changes
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
                <label className="col-span-2 lg:col-span-2" htmlFor={`prod-${row.id}-name`}>
                  <span className="block text-xs text-muted mb-1">Name</span>
                  <input
                    id={`prod-${row.id}-name`}
                    className={inputClass}
                    value={row.name}
                    onChange={(e) => update(row.id, { name: e.target.value })}
                  />
                </label>
                <label className="col-span-2" htmlFor={`prod-${row.id}-category`}>
                  <span className="block text-xs text-muted mb-1">Category</span>
                  <select
                    id={`prod-${row.id}-category`}
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
                <label htmlFor={`prod-${row.id}-price`}>
                  <span className="block text-xs text-muted mb-1">Price (₦)</span>
                  <input
                    id={`prod-${row.id}-price`}
                    className={inputClass}
                    type="number"
                    min="0"
                    step="1000"
                    value={row.price}
                    onChange={(e) => update(row.id, { price: e.target.value })}
                  />
                </label>
                <label htmlFor={`prod-${row.id}-compare`}>
                  <span className="block text-xs text-muted mb-1">Compare At (₦)</span>
                  <input
                    id={`prod-${row.id}-compare`}
                    className={inputClass}
                    type="number"
                    min="0"
                    step="1000"
                    value={row.compareAtPrice}
                    onChange={(e) => update(row.id, { compareAtPrice: e.target.value })}
                  />
                </label>
                <label htmlFor={`prod-${row.id}-stock`}>
                  <span
                    className="block text-xs text-muted mb-1 cursor-help"
                    title={STOCK_HELP}
                  >
                    Stock (total)
                  </span>
                  <input
                    id={`prod-${row.id}-stock`}
                    className={inputClass}
                    type="number"
                    min="0"
                    step="1"
                    value={row.stockCount}
                    onChange={(e) => update(row.id, { stockCount: e.target.value })}
                  />
                </label>
                <label className="col-span-2 lg:col-span-6" htmlFor={`prod-${row.id}-image`}>
                  <span className="block text-xs text-muted mb-1">
                    Image URL (shown on the storefront)
                  </span>
                  <input
                    id={`prod-${row.id}-image`}
                    className={inputClass}
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={row.image}
                    onChange={(e) => update(row.id, { image: e.target.value })}
                  />
                </label>
                <label className="col-span-2 lg:col-span-6" htmlFor={`prod-${row.id}-description`}>
                  <span className="block text-xs text-muted mb-1">Description</span>
                  <textarea
                    id={`prod-${row.id}-description`}
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
                <span
                  className="ml-auto text-xs text-muted cursor-help"
                  title="Available = Stock (total) − sold (reserved for orders). The storefront and cart sell from Available."
                >
                  Stock (total): {row.stockCount} &middot; Available:{" "}
                  {Number(row.stockCount) - Number(row.sold)} &bull; Active listings update
                  instantly
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!discardTarget}
        onClose={() => setDiscardTarget(null)}
        title="Discard changes?"
      >
        <p className="text-sm text-muted mb-6">
          Unsaved edits to{" "}
          <span className="text-foreground font-semibold">{discardTarget?.name}</span> will be
          lost and reset to the last saved values. The live store is not affected.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDiscardTarget(null)}
            className="px-4 h-10 rounded-full text-sm font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"
          >
            Keep editing
          </button>
          <button
            onClick={() => {
              if (discardTarget) discard(discardTarget.id);
              setDiscardTarget(null);
            }}
            className="px-4 h-10 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity cursor-pointer"
          >
            Discard changes
          </button>
        </div>
      </Modal>
    </div>
  );
}