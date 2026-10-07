import {
  products as baseProducts,
  getProductBySlug as baseGetProductBySlug,
} from "@/lib/data/products";
import { services as baseServices } from "@/lib/data/services";
import { BUSINESS, DELIVERY_ZONES } from "@/lib/config";
import {
  getCatalogProducts,
  getCatalogServices,
  getSold,
  getStoredSettings,
} from "@/lib/store";
import type { Product, Service, SiteSettings } from "@/lib/types";

export type LiveProduct = Product & { sold: number; visible: boolean };
export type LiveService = Service & { visible: boolean };

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function defaultSettings(): SiteSettings {
  return {
    businessName: BUSINESS.name,
    tagline: BUSINESS.tagline,
    email: BUSINESS.email,
    phone: BUSINESS.phone,
    phoneFormatted: BUSINESS.phoneFormatted,
    address: BUSINESS.address,
    city: BUSINESS.city,
    hours: BUSINESS.hours,
    interacEmail: BUSINESS.interacEmail,
    deliveryFee: BUSINESS.deliveryFee,
    freeDeliveryOver: BUSINESS.freeDeliveryOver,
    deliveryZones: DELIVERY_ZONES.map((z) => ({ ...z })),
    announcement: { enabled: false, text: "" },
  };
}

export async function getLiveSettings(): Promise<SiteSettings> {
  const defaults = defaultSettings();
  const stored = await getStoredSettings();
  if (!stored || Object.keys(stored).length === 0) return defaults;

  const zonesRaw = Array.isArray(stored.deliveryZones) ? stored.deliveryZones : defaults.deliveryZones;
  const deliveryZones = zonesRaw.map((z) => {
    const zone = z as Partial<{ name: string; zones: unknown; fee: unknown; days: string }>;
    const base =
      defaults.deliveryZones.find((d) => d.name === zone.name) ??
      defaults.deliveryZones[defaults.deliveryZones.length - 1];
    return {
      name: asString(zone.name, base.name),
      zones: Array.isArray(zone.zones)
        ? (zone.zones as unknown[]).map((c) => String(c))
        : base.zones,
      fee: asNumber(zone.fee, base.fee),
      days: asString(zone.days, base.days),
    };
  });

  const announcementRaw = stored.announcement as
    | { enabled?: unknown; text?: unknown }
    | undefined;

  return {
    businessName: asString(stored.businessName, defaults.businessName),
    tagline: asString(stored.tagline, defaults.tagline),
    email: asString(stored.email, defaults.email),
    phone: asString(stored.phone, defaults.phone),
    phoneFormatted: asString(stored.phoneFormatted, defaults.phoneFormatted),
    address: asString(stored.address, defaults.address),
    city: asString(stored.city, defaults.city),
    hours: asString(stored.hours, defaults.hours),
    interacEmail: asString(stored.interacEmail, defaults.interacEmail),
    deliveryFee: asNumber(stored.deliveryFee, defaults.deliveryFee),
    freeDeliveryOver: asNumber(stored.freeDeliveryOver, defaults.freeDeliveryOver),
    deliveryZones,
    announcement: {
      enabled: asBoolean(announcementRaw?.enabled, defaults.announcement.enabled),
      text: asString(announcementRaw?.text, defaults.announcement.text),
    },
  };
}

export async function getLiveProducts(): Promise<LiveProduct[]> {
  const [overrides, sold] = await Promise.all([getCatalogProducts(), getSold()]);
  return baseProducts.map((base) => {
    const o = (overrides[base.id] ?? {}) as Record<string, unknown>;
    const price = asNumber(o.price, base.price);
    const compareAtRaw = o.compareAtPrice;
    const compareAtPrice =
      compareAtRaw === null || compareAtRaw === "" || compareAtRaw === undefined
        ? base.compareAtPrice
        : asNumber(compareAtRaw, base.compareAtPrice ?? 0) || undefined;
    return {
      ...base,
      category:
        (o.category as Product["category"]) ?? base.category,
      name: asString(o.name, base.name),
      description: asString(o.description, base.description),
      price,
      compareAtPrice,
      image: asString(o.image, base.image),
      stockCount: asNumber(o.stockCount, base.stockCount),
      featured: asBoolean(o.featured, base.featured ?? false),
      visible: o.visible === false ? false : true,
      sold: sold[base.id] ?? 0,
    };
  });
}

export async function getLiveServices(): Promise<LiveService[]> {
  const overrides = await getCatalogServices();
  return baseServices.map((base) => {
    const o = (overrides[base.id] ?? {}) as Record<string, unknown>;
    return {
      ...base,
      category: (o.category as Service["category"]) ?? base.category,
      name: asString(o.name, base.name),
      description: asString(o.description, base.description),
      startingPrice: asNumber(o.startingPrice, base.startingPrice),
      priceRange: asString(o.priceRange, base.priceRange),
      duration: asString(o.duration, base.duration),
      image: asString(o.image, base.image),
      featured: asBoolean(o.featured, base.featured ?? false),
      visible: o.visible === false ? false : true,
    };
  });
}

export async function getVisibleProducts(): Promise<LiveProduct[]> {
  const all = await getLiveProducts();
  return all.filter((p) => p.visible !== false);
}

export async function getVisibleServices(): Promise<LiveService[]> {
  const all = await getLiveServices();
  return all.filter((s) => s.visible !== false);
}

export async function getLiveProductById(idOrSlug: string): Promise<LiveProduct | undefined> {
  const base = baseGetProductBySlug(idOrSlug);
  if (!base) return undefined;
  const all = await getLiveProducts();
  return all.find((p) => p.id === base.id);
}

export async function getVisibleProductById(
  idOrSlug: string
): Promise<LiveProduct | undefined> {
  const product = await getLiveProductById(idOrSlug);
  return product && product.visible !== false ? product : undefined;
}

export async function getLiveServiceById(id: string): Promise<LiveService | undefined> {
  const base = baseServices.find((s) => s.id === id);
  if (!base) return undefined;
  const all = await getLiveServices();
  return all.find((s) => s.id === base.id);
}

export async function getVisibleServiceById(id: string): Promise<LiveService | undefined> {
  const service = await getLiveServiceById(id);
  return service && service.visible !== false ? service : undefined;
}

export function computeLiveDeliveryFee(
  settings: SiteSettings,
  method: "delivery" | "pickup",
  zone: string,
  subtotal: number
): number {
  if (method === "pickup") return 0;
  const info = settings.deliveryZones.find((z) => z.name === zone);
  const fee = info?.fee ?? settings.deliveryFee;
  if (settings.freeDeliveryOver > 0 && subtotal >= settings.freeDeliveryOver) {
    return 0;
  }
  return fee;
}

export interface PublicCatalog {
  products: LiveProduct[];
  services: LiveService[];
  settings: {
    deliveryZones: SiteSettings["deliveryZones"];
    deliveryFee: number;
    freeDeliveryOver: number;
    business: {
      name: string;
      tagline: string;
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
}

export async function getPublicCatalog(): Promise<PublicCatalog> {
  const [products, services, settings] = await Promise.all([
    getVisibleProducts(),
    getVisibleServices(),
    getLiveSettings(),
  ]);
  return {
    products,
    services,
    settings: {
      deliveryZones: settings.deliveryZones,
      deliveryFee: settings.deliveryFee,
      freeDeliveryOver: settings.freeDeliveryOver,
      business: {
        name: settings.businessName,
        tagline: settings.tagline,
        email: settings.email,
        phone: settings.phone,
        phoneFormatted: settings.phoneFormatted,
        address: settings.address,
        city: settings.city,
        hours: settings.hours,
        interacEmail: settings.interacEmail,
      },
      announcement: settings.announcement,
    },
  };
}