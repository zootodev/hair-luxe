"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { isStartPriceInRange } from "@/lib/pricing";
import Modal from "@/components/ui/Modal";
import type { Service, ServiceCategory } from "@/lib/types";

const CATEGORIES: ServiceCategory[] = [
  "Hair",
  "Beauty",
  "Skin",
];

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
  category: ServiceCategory;
  startingPrice: string;
  priceRange: string;
  duration: string;
  featured: boolean;
  visible: boolean;
  dirty: boolean;
  saving: boolean;
}

interface NewService {
  name: string;
  description: string;
  category: ServiceCategory;
  startingPrice: string;
  priceRange: string;
  duration: string;
  featured: boolean;
  visible: boolean;
}

const EMPTY_NEW_SERVICE: NewService = {
  name: "",
  description: "",
  category: "Hair",
  startingPrice: "",
  priceRange: "",
  duration: "",
  featured: false,
  visible: true,
};

const inputClass =
  "w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none";

export default function ServicesManager() {
  const [rows, setRows] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  // Last-saved values per service, used by "Discard changes".
  const pristineRef = useRef<Record<string, Draft>>({});
  const [discardTarget, setDiscardTarget] = useState<{ id: string; name: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [newService, setNewService] = useState<NewService>(EMPTY_NEW_SERVICE);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { services: Service[] };
      const loaded = data.services.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        category: s.category,
        startingPrice: String(s.startingPrice),
        priceRange: s.priceRange,
        duration: s.duration,
        featured: !!s.featured,
        visible: s.visible !== false,
        dirty: false,
        saving: false,
      }));
      pristineRef.current = Object.fromEntries(loaded.map((r) => [r.id, r]));
      setRows(loaded);
    } catch {
      setError("Could not load services.");
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
    const start = Number(row.startingPrice);
    if (!Number.isFinite(start) || start <= 0) {
      setError(`"${row.name}": Start Price must be a positive number.`);
      return;
    }
    if (!isStartPriceInRange(start, row.priceRange)) {
      setError(`"${row.name}": Start Price must fall within the Price Range (e.g. ₦120,000 - ₦250,000).`);
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
          type: "service",
          id: row.id,
          data: {
            name: row.name,
            description: row.description,
            category: row.category,
            startingPrice: start,
            priceRange: row.priceRange,
            duration: row.duration,
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

  const createService = async () => {
    setAddError("");
    const name = newService.name.trim();
    if (!name) {
      setAddError("Name is required.");
      return;
    }
    if (!newService.priceRange.trim()) {
      setAddError("Price Range is required.");
      return;
    }
    if (!newService.duration.trim()) {
      setAddError("Duration is required.");
      return;
    }
    const start = Number(newService.startingPrice);
    if (!Number.isFinite(start) || start <= 0) {
      setAddError("Start Price must be a positive number (in naira).");
      return;
    }
    if (!isStartPriceInRange(start, newService.priceRange)) {
      setAddError("Start Price must fall within the Price Range.");
      return;
    }
    const slug = slugify(name);
    if (!slug) {
      setAddError("Name must contain letters or numbers.");
      return;
    }
    if (rows.some((r) => r.id === slug)) {
      setAddError(`A service with the id "${slug}" already exists.`);
      return;
    }
    setAdding(true);
    try {
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "service",
          id: slug,
          data: {
            name,
            description: newService.description.trim(),
            category: newService.category,
            startingPrice: start,
            priceRange: newService.priceRange.trim(),
            duration: newService.duration.trim(),
            includes: [],
            featured: newService.featured,
            visible: newService.visible,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setShowAdd(false);
      setNewService(EMPTY_NEW_SERVICE);
      await load();
      setNotice(`Added "${name}".`);
    } catch {
      setAddError("Failed to add the service. Please try again.");
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
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Services</h1>
          <p className="text-xs text-muted mt-1">
            Changes go live on the site immediately, including the booking page.
          </p>
        </div>
        <div className="flex items-center gap-2 w-fit">
          {dirtyCount > 0 && (
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {dirtyCount} unsaved service{dirtyCount > 1 ? "s" : ""}
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
            {showAdd ? "Close" : "Add Service"}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="rounded-2xl bg-surface border border-gold/30 p-5 mb-6">
          <h2 className="font-serif text-lg font-bold mb-4">New Service</h2>
          {addError && (
            <p className="text-sm text-red-400 mb-3" role="alert">
              {addError}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm mb-4">
            <label className="col-span-2 lg:col-span-1" htmlFor="svc-new-name">
              <span className="block text-xs text-muted mb-1">Name</span>
              <input
                id="svc-new-name"
                className={inputClass}
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </label>
            <label className="col-span-2" htmlFor="svc-new-category">
              <span className="block text-xs text-muted mb-1">Category</span>
              <select
                id="svc-new-category"
                className={inputClass}
                value={newService.category}
                onChange={(e) =>
                  setNewService({ ...newService, category: e.target.value as ServiceCategory })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="svc-new-start">
              <span className="block text-xs text-muted mb-1">Start Price (₦)</span>
              <input
                id="svc-new-start"
                className={inputClass}
                type="number"
                min="0"
                step="1000"
                placeholder="120000"
                value={newService.startingPrice}
                onChange={(e) => setNewService({ ...newService, startingPrice: e.target.value })}
              />
            </label>
            <label htmlFor="svc-new-range">
              <span className="block text-xs text-muted mb-1">Price Range</span>
              <input
                id="svc-new-range"
                className={inputClass}
                placeholder="₦120,000 - ₦250,000"
                value={newService.priceRange}
                onChange={(e) => setNewService({ ...newService, priceRange: e.target.value })}
              />
            </label>
            <label htmlFor="svc-new-duration">
              <span className="block text-xs text-muted mb-1">Duration</span>
              <input
                id="svc-new-duration"
                className={inputClass}
                placeholder="1 - 2 hours"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
              />
            </label>
            <label className="col-span-2 lg:col-span-5" htmlFor="svc-new-description">
              <span className="block text-xs text-muted mb-1">Description</span>
              <textarea
                id="svc-new-description"
                className="w-full rounded-lg bg-background border border-surface-light px-3 py-2 text-sm focus:border-gold focus:outline-none resize-y"
                rows={2}
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newService.visible}
                  onChange={(e) => setNewService({ ...newService, visible: e.target.checked })}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-muted">Visible on site</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newService.featured}
                  onChange={(e) => setNewService({ ...newService, featured: e.target.checked })}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-muted">Featured on home</span>
              </label>
            </div>
            <button
              onClick={createService}
              disabled={adding}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {adding ? "Adding..." : "Add Service"}
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

      {loading && <p className="text-muted py-10 text-center">Loading services...</p>}

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
                    title="Discard unsaved edits on this service"
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

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                <label
                  className="col-span-2 lg:col-span-1"
                  htmlFor={`svc-${row.id}-name`}
                >
                  <span className="block text-xs text-muted mb-1">Name</span>
                  <input
                    id={`svc-${row.id}-name`}
                    className={inputClass}
                    value={row.name}
                    onChange={(e) => update(row.id, { name: e.target.value })}
                  />
                </label>
                <label className="col-span-2" htmlFor={`svc-${row.id}-category`}>
                  <span className="block text-xs text-muted mb-1">Category</span>
                  <select
                    id={`svc-${row.id}-category`}
                    className={inputClass}
                    value={row.category}
                    onChange={(e) =>
                      update(row.id, { category: e.target.value as ServiceCategory })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label htmlFor={`svc-${row.id}-start`}>
                  <span className="block text-xs text-muted mb-1">
                    Start Price (₦)
                  </span>
                  <input
                    id={`svc-${row.id}-start`}
                    className={inputClass}
                    type="number"
                    min="0"
                    step="1000"
                    value={row.startingPrice}
                    onChange={(e) => update(row.id, { startingPrice: e.target.value })}
                  />
                  {!isStartPriceInRange(Number(row.startingPrice), row.priceRange) && (
                    <p className="text-xs text-red-400 mt-1">
                      Must fall within {row.priceRange}
                    </p>
                  )}
                </label>
                <label htmlFor={`svc-${row.id}-range`}>
                  <span className="block text-xs text-muted mb-1">Price Range</span>
                  <input
                    id={`svc-${row.id}-range`}
                    className={inputClass}
                    value={row.priceRange}
                    onChange={(e) => update(row.id, { priceRange: e.target.value })}
                  />
                </label>
                <label htmlFor={`svc-${row.id}-duration`}>
                  <span className="block text-xs text-muted mb-1">Duration</span>
                  <input
                    id={`svc-${row.id}-duration`}
                    className={inputClass}
                    value={row.duration}
                    onChange={(e) => update(row.id, { duration: e.target.value })}
                  />
                </label>
                <label className="col-span-2 lg:col-span-5" htmlFor={`svc-${row.id}-description`}>
                  <span className="block text-xs text-muted mb-1">Description</span>
                  <textarea
                    id={`svc-${row.id}-description`}
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
                  <span className="text-muted">Visible on site</span>
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
          lost and reset to the last saved values. The live site is not affected.
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