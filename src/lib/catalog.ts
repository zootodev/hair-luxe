import { products as baseProducts } from "@/lib/data/products";
import { services as baseServices } from "@/lib/data/services";
import { BUSINESS, DELIVERY_ZONES } from "@/lib/config";
import type { Product, Service, SiteSettings } from "@/lib/types";
import {
  getCatalogProducts,
  getCatalogServices,
  getSold,
  getStoredSettings,
} from "@/lib/store";

export type LiveProduct = Product & { sold: number; visible: boolean };
export type LiveService = Service & { visible: boolean };

const PRODUCT_CATEGORIES: Product["category"][] = ["Wigs", "Hair Bundles", "Lashes", "Hair Care"];
const SERVICE_CATEGORIES: Service["category"][] = ["Hair", "Beauty", "Skin"];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1650649016849-00938690600c?q=80&w=1200&auto=format&fit=crop";

function asString(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return value === true ? true : fallback;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const arr = value.map((v) => String(v).trim()).filter(Boolean);
  return arr.length > 0 ? arr : undefined;
}

function asBankDetails(value: unknown, fallback: SiteSettings["bankDetails"]): SiteSettings["bankDetails"] {
  const o = (value && typeof value === "object" ? value : {}) as Partial<SiteSettings["bankDetails"]>;
  return {
    bankName: o.bankName ?? fallback.bankName,
    accountName: o.accountName ?? fallback.accountName,
    accountNumber: o.accountNumber ?? fallback.accountNumber,
  };
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
    bankDetails: { ...BUSINESS.bankDetails },
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
    const base = defaults.deliveryZones.find((d) => d.name === zone.name) ?? defaults.deliveryZones[defaults.deliveryZones.length - 1];
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
    bankDetails: asBankDetails(stored.bankDetails, defaults.bankDetails),
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
  const fromSeed = baseProducts.map((base) => {
    const o = (overrides[base.id] ?? {}) as Record<string, unknown>;
    const price = asNumber(o.price, base.price);
    const compareAtRaw = o.compareAtPrice;
    const compareAtPrice =
      compareAtRaw === null || compareAtRaw === "" || compareAtRaw === undefined
        ? base.compareAtPrice
        : asNumber(compareAtRaw, base.compareAtPrice ?? 0) || undefined;
    return {
      ...base,
      category: (o.category as Product["category"]) ?? base.category,
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

  // Products created from the admin that are not part of the seed catalog.
  const seedIds = new Set(baseProducts.map((p) => p.id));
  const created: LiveProduct[] = Object.entries(overrides).flatMap(([id, oRaw]) => {
    if (seedIds.has(id)) return [];
    const o = (oRaw ?? {}) as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    const price = Number(o.price);
    if (!name || !Number.isFinite(price) || price <= 0) return [];
    const category = PRODUCT_CATEGORIES.includes(o.category as Product["category"])
      ? (o.category as Product["category"])
      : "Wigs";
    const image = asString(o.image, FALLBACK_IMAGE);
    return [
      {
        id,
        slug: id,
        name,
        category,
        description: asString(o.description, ""),
        price,
        compareAtPrice: o.compareAtPrice ? asNumber(o.compareAtPrice, 0) || undefined : undefined,
        image,
        images: [image],
        stockCount: Math.max(0, asNumber(o.stockCount, 0)),
        rating: asNumber(o.rating, 0),
        reviewCount: asNumber(o.reviewCount, 0),
        featured: asBoolean(o.featured, false),
        visible: o.visible === false ? false : true,
        sold: sold[id] ?? 0,
        details: asStringArray(o.details) ?? [],
        colors: asStringArray(o.colors),
        lengths: asStringArray(o.lengths),
      },
    ];
  });

  return [...fromSeed, ...created];
}

export async function getLiveServices(): Promise<LiveService[]> {
  const overrides = await getCatalogServices();
  const fromSeed = baseServices.map((base) => {
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

  // Services created from the admin that are not part of the seed catalog.
  const seedIds = new Set(baseServices.map((s) => s.id));
  const created: LiveService[] = Object.entries(overrides).flatMap(([id, oRaw]) => {
    if (seedIds.has(id)) return [];
    const o = (oRaw ?? {}) as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name) return [];
    const category = SERVICE_CATEGORIES.includes(o.category as Service["category"])
      ? (o.category as Service["category"])
      : "Hair";
    return [
      {
        id,
        name,
        category,
        description: asString(o.description, ""),
        priceRange: asString(o.priceRange, ""),
        startingPrice: asNumber(o.startingPrice, 0),
        duration: asString(o.duration, ""),
        image: asString(o.image, FALLBACK_IMAGE),
        includes: asStringArray(o.includes) ?? [],
        featured: asBoolean(o.featured, false),
        visible: o.visible === false ? false : true,
      },
    ];
  });

  return [...fromSeed, ...created];
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
  const all = await getLiveProducts();
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export async function getVisibleProductById(
  idOrSlug: string
): Promise<LiveProduct | undefined> {
  const product = await getLiveProductById(idOrSlug);
  return product && product.visible !== false ? product : undefined;
}

export async function getLiveServiceById(id: string): Promise<LiveService | undefined> {
  const all = await getLiveServices();
  return all.find((s) => s.id === id);
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
      bankDetails: { bankName: string; accountName: string; accountNumber: string; };
    };
    announcement: { enabled: boolean; text: string };
  };
}

export async function getPublicCatalog(): Promise<PublicCatalog> {
  const [products, services, settings] = await Promise.all([getVisibleProducts(), getVisibleServices(), getLiveSettings()]);
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
        bankDetails: settings.bankDetails,
      },
      announcement: settings.announcement,
    },
  };
}