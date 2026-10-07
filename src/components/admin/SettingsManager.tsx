"use client";

import { useCallback, useEffect, useState } from "react";

interface ZoneDraft {
  name: string;
  zones: string;
  fee: string;
  days: string;
}

interface SettingsDraft {
  businessName: string;
  tagline: string;
  email: string;
  phone: string;
  phoneFormatted: string;
  address: string;
  city: string;
  hours: string;
  interacEmail: string;
  deliveryFee: string;
  freeDeliveryOver: string;
  deliveryZones: ZoneDraft[];
  announcementEnabled: boolean;
  announcementText: string;
}

const inputClass =
  "w-full h-9 rounded-lg bg-background border border-surface-light px-3 text-sm focus:border-gold focus:outline-none";

const DEFAULT_ZONE: ZoneDraft = { name: "", zones: "", fee: "", days: "" };

export default function SettingsManager() {
  const [form, setForm] = useState<SettingsDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as {
        settings: {
          deliveryZones: { name: string; zones: string[]; fee: number; days: string }[];
          deliveryFee: number;
          freeDeliveryOver: number;
          business: {
            name: string;
            tagline?: string;
            email: string;
            phone: string;
            phoneFormatted: string;
            address: string;
            city: string;
            hours: string;
            interacEmail: string;
          };
          announcement: { enabled: boolean; text: string };
        };
      };
      const s = data.settings;
      setForm({
        businessName: s.business.name,
        tagline: s.business.tagline ?? "",
        email: s.business.email,
        phone: s.business.phone,
        phoneFormatted: s.business.phoneFormatted,
        address: s.business.address,
        city: s.business.city,
        hours: s.business.hours,
        interacEmail: s.business.interacEmail,
        deliveryFee: String(s.deliveryFee),
        freeDeliveryOver: String(s.freeDeliveryOver),
        deliveryZones: s.deliveryZones.map((z) => ({
          name: z.name,
          zones: z.zones.join(", "),
          fee: String(z.fee),
          days: z.days,
        })),
        announcementEnabled: s.announcement.enabled,
        announcementText: s.announcement.text,
      });
    } catch {
      setError("Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- data fetch (all setState calls are post-await) */
  useEffect(() => {
    load();
  }, [load]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const set = (patch: Partial<SettingsDraft>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const setZone = (index: number, patch: Partial<ZoneDraft>) =>
    setForm((prev) => {
      if (!prev) return prev;
      const deliveryZones = prev.deliveryZones.map((z, i) =>
        i === index ? { ...z, ...patch } : z
      );
      return { ...prev, deliveryZones };
    });

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "settings",
          data: {
            businessName: form.businessName,
            tagline: form.tagline,
            email: form.email,
            phone: form.phone,
            phoneFormatted: form.phoneFormatted,
            address: form.address,
            city: form.city,
            hours: form.hours,
            interacEmail: form.interacEmail,
            deliveryFee: Number(form.deliveryFee),
            freeDeliveryOver: Number(form.freeDeliveryOver),
            deliveryZones: form.deliveryZones
              .filter((z) => z.name.trim() !== "")
              .map((z) => ({
                name: z.name.trim(),
                zones: z.zones
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean),
                fee: Number(z.fee),
                days: z.days,
              })),
            announcement: {
              enabled: form.announcementEnabled,
              text: form.announcementText,
            },
          },
        }),
      });
      if (!res.ok) throw new Error();
      setNotice("Settings saved and live on the site.");
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">
          Store Configuration
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Settings</h1>
        <p className="text-xs text-muted mt-1">
          Business details, delivery zones and the announcement bar shown site-wide.
        </p>
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

      {loading && <p className="text-muted py-10 text-center">Loading settings...</p>}

      {!loading && form && (
        <div className="space-y-5">
          <section className="rounded-2xl bg-surface border border-surface-light p-5">
            <h2 className="font-serif text-lg text-gold mb-4">Business Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <label>
                <span className="block text-xs text-muted mb-1">Business Name</span>
                <input
                  className={inputClass}
                  value={form.businessName}
                  onChange={(e) => set({ businessName: e.target.value })}
                />
              </label>
              <label className="col-span-2">
                <span className="block text-xs text-muted mb-1">Tagline</span>
                <input
                  className={inputClass}
                  value={form.tagline}
                  onChange={(e) => set({ tagline: e.target.value })}
                />
              </label>
              <label>
                <span className="block text-xs text-muted mb-1">Email</span>
                <input
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
                />
              </label>
              <label>
                <span className="block text-xs text-muted mb-1">Phone (display)</span>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => set({ phone: e.target.value })}
                />
              </label>
              <label>
                <span className="block text-xs text-muted mb-1">Phone (tel link)</span>
                <input
                  className={inputClass}
                  value={form.phoneFormatted}
                  onChange={(e) => set({ phoneFormatted: e.target.value })}
                />
              </label>
              <label className="col-span-2">
                <span className="block text-xs text-muted mb-1">Address</span>
                <input
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => set({ address: e.target.value })}
                />
              </label>
              <label>
                <span className="block text-xs text-muted mb-1">City</span>
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => set({ city: e.target.value })}
                />
              </label>
              <label>
                <span className="block text-xs text-muted mb-1">Hours</span>
                <input
                  className={inputClass}
                  value={form.hours}
                  onChange={(e) => set({ hours: e.target.value })}
                />
              </label>
              <label>
                <span className="block text-xs text-muted mb-1">Interac e-Transfer Email</span>
                <input
                  className={inputClass}
                  value={form.interacEmail}
                  onChange={(e) => set({ interacEmail: e.target.value })}
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-surface border border-surface-light p-5">
            <h2 className="font-serif text-lg text-gold mb-4">Delivery &amp; Fees</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
              <label>
                <span className="block text-xs text-muted mb-1">Default Delivery Fee ($)</span>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.deliveryFee}
                  onChange={(e) => set({ deliveryFee: e.target.value })}
                />
              </label>
              <label>
                <span className="block text-xs text-muted mb-1">Free Delivery Over ($)</span>
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.freeDeliveryOver}
                  onChange={(e) => set({ freeDeliveryOver: e.target.value })}
                />
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Delivery Zones</span>
                <button
                  onClick={() => set({ deliveryZones: [...form.deliveryZones, DEFAULT_ZONE] })}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-light text-muted hover:text-gold transition-colors cursor-pointer"
                >
                  + Add Zone
                </button>
              </div>
              {form.deliveryZones.map((zone, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 rounded-xl bg-background border border-surface-light p-3 text-sm"
                >
                  <label>
                    <span className="block text-xs text-muted mb-1">Zone Name</span>
                    <input
                      className={inputClass}
                      value={zone.name}
                      onChange={(e) => setZone(i, { name: e.target.value })}
                    />
                  </label>
                  <label className="col-span-2">
                    <span className="block text-xs text-muted mb-1">
                      Cities / Towns (comma separated)
                    </span>
                    <input
                      className={inputClass}
                      value={zone.zones}
                      onChange={(e) => setZone(i, { zones: e.target.value })}
                    />
                  </label>
                  <label>
                    <span className="block text-xs text-muted mb-1">Fee ($)</span>
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="0.01"
                      value={zone.fee}
                      onChange={(e) => setZone(i, { fee: e.target.value })}
                    />
                  </label>
                  <label>
                    <span className="block text-xs text-muted mb-1">Days</span>
                    <input
                      className={inputClass}
                      value={zone.days}
                      onChange={(e) => setZone(i, { days: e.target.value })}
                    />
                  </label>
                  <button
                    onClick={() =>
                      set({
                        deliveryZones: form.deliveryZones.filter((_, idx) => idx !== i),
                      })
                    }
                    className="sm:col-span-4 lg:col-span-1 w-fit px-3 py-1.5 rounded-full text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors mt-auto cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-surface border border-surface-light p-5">
            <h2 className="font-serif text-lg text-gold mb-4">Announcement Bar</h2>
            <div className="flex flex-col sm:flex-row gap-3 text-sm">
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={form.announcementEnabled}
                  onChange={(e) => set({ announcementEnabled: e.target.checked })}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-muted">Show announcement</span>
              </label>
              <input
                className={inputClass}
                value={form.announcementText}
                placeholder="e.g. Free delivery on orders over $150 until Friday!"
                onChange={(e) => set({ announcementText: e.target.value })}
              />
            </div>
          </section>

          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}