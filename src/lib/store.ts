import type { Order, Booking } from "@/lib/types";
import { Pool } from "pg";

const ORDERS_KEY = "hl:orders:v1";
const BOOKINGS_KEY = "hl:bookings:v1";
const SOLD_KEY = "hl:sold:v1";
const ORDER_SEQ_KEY = "hl:seq:order";
const BOOKING_SEQ_KEY = "hl:seq:booking";

const mem = {
  orders: [] as Order[],
  bookings: [] as Booking[],
  sold: {} as Record<string, number>,
  orderSeq: 0,
  bookingSeq: 0,
  catalogProducts: {} as Record<string, Record<string, unknown>>,
  catalogServices: {} as Record<string, Record<string, unknown>>,
  settings: {} as Record<string, unknown>,
};

function getRestConfig(): { url: string; token: string } | null {
  const kvUrl = (process.env.KV_REST_API_URL ?? "").trim();
  const kvToken = (process.env.KV_REST_API_TOKEN ?? "").trim();
  const upstashUrl = (process.env.UPSTASH_REDIS_REST_URL ?? "").trim();
  const upstashToken = (process.env.UPSTASH_REDIS_REST_TOKEN ?? "").trim();
  const url = (kvUrl || upstashUrl).replace(/\/+$/, "");
  const token = kvUrl ? kvToken : upstashToken;
  return url && token ? { url, token } : null;
}

function getPgUrl(): string | null {
  const url = (process.env.DATABASE_URL ?? "").trim();
  return url || null;
}

function isPostgres(): boolean {
  return getPgUrl() !== null;
}

export function storeConfigured(): boolean {
  return getRestConfig() !== null || getPgUrl() !== null;
}

export function storeKind(): string {
  if (process.env.DATABASE_URL) return "Supabase Postgres";
  if (process.env.KV_REST_API_URL) return "Vercel KV";
  if (process.env.UPSTASH_REDIS_REST_URL) return "Upstash Redis";
  return "memory (not persistent)";
}

async function redis(cmd: string, args: (string | number)[]): Promise<unknown> {
  const cfg = getRestConfig();
  if (!cfg) throw new Error("store-not-configured");
  const res = await fetch(`${cfg.url}/${cmd}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`store:${cmd}:${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`store:${cmd}:${json.error}`);
  return json.result;
}

async function getString(key: string): Promise<string | null> {
  const raw = await redis("get", [key]);
  return raw == null ? null : String(raw);
}

async function setString(key: string, value: string): Promise<void> {
  await redis("set", [key, value]);
}

async function persistOrders(orders: Order[]): Promise<void> {
  if (storeConfigured()) {
    await setString(ORDERS_KEY, JSON.stringify(orders));
  }
  mem.orders = orders;
}

async function persistBookings(bookings: Booking[]): Promise<void> {
  if (storeConfigured()) {
    await setString(BOOKINGS_KEY, JSON.stringify(bookings));
  }
  mem.bookings = bookings;
}

async function persistSold(sold: Record<string, number>): Promise<void> {
  if (storeConfigured()) {
    await setString(SOLD_KEY, JSON.stringify(sold));
  }
  mem.sold = sold;
}

// ---------- Postgres (Supabase) adapter ----------

let pool: Pool | null = null;
let pgInitPromise: Promise<void> | null = null;

function pg(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getPgUrl() ?? undefined,
      max: 1,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8_000,
      idleTimeoutMillis: 30_000,
    });
    pool.on("error", (err) => console.error("[store] pg pool error", err));
  }
  return pool;
}

function pgInit(): Promise<void> {
  if (!pgInitPromise) {
    pgInitPromise = pg()
      .query(`
        CREATE TABLE IF NOT EXISTS app_meta (
          key text PRIMARY KEY,
          value text NOT NULL
        );
        CREATE TABLE IF NOT EXISTS orders (
          id text PRIMARY KEY,
          data jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS bookings (
          id text PRIMARY KEY,
          data jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        );
        ALTER TABLE app_meta ENABLE ROW LEVEL SECURITY;
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
        CREATE TABLE IF NOT EXISTS catalog_products (
          key text PRIMARY KEY,
          data jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS catalog_services (
          key text PRIMARY KEY,
          data jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        );
        ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE catalog_services ENABLE ROW LEVEL SECURITY;
      `)
      .then(() => undefined)
      .catch((err) => {
        pgInitPromise = null;
        throw err;
      });
  }
  return pgInitPromise;
}

async function pgGetOrders(): Promise<Order[]> {
  await pgInit();
  const result = await pg().query<{ data: Order }>(
    "SELECT data FROM orders ORDER BY created_at DESC"
  );
  return result.rows.map((r) => r.data);
}

async function pgUpsertOrder(order: Order): Promise<void> {
  await pgInit();
  await pg().query(
    "INSERT INTO orders (id, data) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data",
    [order.id, JSON.stringify(order)]
  );
}

async function pgGetOrderById(id: string): Promise<Order | undefined> {
  await pgInit();
  const result = await pg().query<{ data: Order }>(
    "SELECT data FROM orders WHERE LOWER(id) = LOWER($1)",
    [id]
  );
  return result.rows[0]?.data;
}

async function pgDeleteOrder(id: string): Promise<boolean> {
  await pgInit();
  const result = await pg().query("DELETE FROM orders WHERE LOWER(id) = LOWER($1)", [id]);
  return (result.rowCount ?? 0) > 0;
}

async function pgGetBookings(): Promise<Booking[]> {
  await pgInit();
  const result = await pg().query<{ data: Booking }>(
    "SELECT data FROM bookings ORDER BY created_at DESC"
  );
  return result.rows.map((r) => r.data);
}

async function pgUpsertBooking(booking: Booking): Promise<void> {
  await pgInit();
  await pg().query(
    "INSERT INTO bookings (id, data) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data",
    [booking.id, JSON.stringify(booking)]
  );
}

async function pgDeleteBooking(id: string): Promise<boolean> {
  await pgInit();
  const result = await pg().query("DELETE FROM bookings WHERE LOWER(id) = LOWER($1)", [id]);
  return (result.rowCount ?? 0) > 0;
}

async function pgGetSold(): Promise<Record<string, number>> {
  await pgInit();
  const result = await pg().query<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'sold'"
  );
  return result.rows[0] ? (JSON.parse(result.rows[0].value) as Record<string, number>) : {};
}

async function pgSetSold(sold: Record<string, number>): Promise<void> {
  await pgInit();
  await pg().query(
    "INSERT INTO app_meta (key, value) VALUES ('sold', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [JSON.stringify(sold)]
  );
}

async function pgNextId(key: string): Promise<number> {
  await pgInit();
  const result = await pg().query<{ value: number }>(
    "INSERT INTO app_meta (key, value) VALUES ($1, '1') ON CONFLICT (key) DO UPDATE SET value = (app_meta.value::int + 1)::text RETURNING value::int AS value",
    [key]
  );
  return result.rows[0].value;
}

async function pgGetMeta(key: string): Promise<Record<string, unknown> | null> {
  await pgInit();
  const result = await pg().query<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = $1",
    [key]
  );
  if (!result.rows[0]) return null;
  try {
    return JSON.parse(result.rows[0].value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function pgSetMeta(key: string, obj: Record<string, unknown>): Promise<void> {
  await pgInit();
  await pg().query(
    "INSERT INTO app_meta (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [key, JSON.stringify(obj)]
  );
}

async function pgGetCatalogProducts(): Promise<Record<string, Record<string, unknown>>> {
  await pgInit();
  const result = await pg().query<{ key: string; data: Record<string, unknown> }>(
    "SELECT key, data FROM catalog_products"
  );
  return Object.fromEntries(result.rows.map((r) => [r.key, r.data]));
}

async function pgUpsertCatalogProduct(
  key: string,
  data: Record<string, unknown>
): Promise<void> {
  await pgInit();
  await pg().query(
    "INSERT INTO catalog_products (key, data) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()",
    [key, JSON.stringify(data)]
  );
}

async function pgDeleteCatalogProduct(key: string): Promise<void> {
  await pgInit();
  await pg().query("DELETE FROM catalog_products WHERE key = $1", [key]);
}

async function pgGetCatalogServices(): Promise<Record<string, Record<string, unknown>>> {
  await pgInit();
  const result = await pg().query<{ key: string; data: Record<string, unknown> }>(
    "SELECT key, data FROM catalog_services"
  );
  return Object.fromEntries(result.rows.map((r) => [r.key, r.data]));
}

async function pgUpsertCatalogService(
  key: string,
  data: Record<string, unknown>
): Promise<void> {
  await pgInit();
  await pg().query(
    "INSERT INTO catalog_services (key, data) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()",
    [key, JSON.stringify(data)]
  );
}

async function pgDeleteCatalogService(key: string): Promise<void> {
  await pgInit();
  await pg().query("DELETE FROM catalog_services WHERE key = $1", [key]);
}

async function pgGetSettingsObject(): Promise<Record<string, unknown> | null> {
  return pgGetMeta("settings");
}

async function pgSaveSettingsObject(obj: Record<string, unknown>): Promise<void> {
  await pgSetMeta("settings", obj);
}

// ---------- Public API ----------

export async function getOrders(): Promise<Order[]> {
  try {
    if (isPostgres()) return await pgGetOrders();
    if (storeConfigured()) {
      const raw = await getString(ORDERS_KEY);
      if (raw != null) return JSON.parse(raw) as Order[];
    }
  } catch (error) {
    console.error("[store] failed to read orders", error);
  }
  return mem.orders;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (isPostgres()) {
    try {
      return await pgGetOrderById(id);
    } catch (error) {
      console.error("[store] failed to read order", error);
      return undefined;
    }
  }
  const orders = await getOrders();
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export async function addOrder(order: Order): Promise<void> {
  if (isPostgres()) {
    await pgUpsertOrder(order);
  } else {
    const orders = await getOrders();
    await persistOrders([order, ...orders]);
  }
  mem.orders = [order, ...mem.orders];
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<boolean> {
  if (isPostgres()) {
    const order = await getOrderById(id);
    if (!order) return false;
    await pgUpsertOrder({ ...order, status });
    mem.orders = mem.orders.map((o) =>
      o.id.toLowerCase() === id.toLowerCase() ? { ...o, status } : o
    );
    return true;
  }
  const orders = await getOrders();
  const next = orders.map((o) =>
    o.id.toLowerCase() === id.toLowerCase() ? { ...o, status } : o
  );
  if (JSON.stringify(next) === JSON.stringify(orders)) return false;
  await persistOrders(next);
  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (isPostgres()) {
    const removed = await pgDeleteOrder(id);
    if (removed) {
      mem.orders = mem.orders.filter((o) => o.id.toLowerCase() !== id.toLowerCase());
    }
    return removed;
  }
  const orders = await getOrders();
  const next = orders.filter((o) => o.id.toLowerCase() !== id.toLowerCase());
  if (next.length === orders.length) return false;
  await persistOrders(next);
  return true;
}

export async function isOrderIdTaken(id: string): Promise<boolean> {
  return (await getOrderById(id)) !== undefined;
}

export async function getBookings(): Promise<Booking[]> {
  try {
    if (isPostgres()) return await pgGetBookings();
    if (storeConfigured()) {
      const raw = await getString(BOOKINGS_KEY);
      if (raw != null) return JSON.parse(raw) as Booking[];
    }
  } catch (error) {
    console.error("[store] failed to read bookings", error);
  }
  return mem.bookings;
}

export async function addBooking(booking: Booking): Promise<void> {
  if (isPostgres()) {
    await pgUpsertBooking(booking);
  } else {
    const bookings = await getBookings();
    await persistBookings([booking, ...bookings]);
  }
  mem.bookings = [booking, ...mem.bookings];
}

export async function deleteBooking(id: string): Promise<boolean> {
  if (isPostgres()) {
    const removed = await pgDeleteBooking(id);
    if (removed) {
      mem.bookings = mem.bookings.filter((b) => b.id.toLowerCase() !== id.toLowerCase());
    }
    return removed;
  }
  const bookings = await getBookings();
  const next = bookings.filter((b) => b.id.toLowerCase() !== id.toLowerCase());
  if (next.length === bookings.length) return false;
  await persistBookings(next);
  return true;
}

export async function getSold(): Promise<Record<string, number>> {
  try {
    if (isPostgres()) return await pgGetSold();
    if (storeConfigured()) {
      const raw = await getString(SOLD_KEY);
      if (raw != null) return JSON.parse(raw) as Record<string, number>;
    }
  } catch (error) {
    console.error("[store] failed to read sold", error);
  }
  return mem.sold;
}

// ---------- Catalog overrides + settings ----------

export async function getCatalogProducts(): Promise<Record<string, Record<string, unknown>>> {
  try {
    if (isPostgres()) return await pgGetCatalogProducts();
  } catch (error) {
    console.error("[store] failed to read catalog products", error);
  }
  return mem.catalogProducts;
}

export async function saveCatalogProduct(
  key: string,
  data: Record<string, unknown>
): Promise<void> {
  if (isPostgres()) {
    await pgUpsertCatalogProduct(key, data);
  }
  mem.catalogProducts[key] = data;
}

export async function deleteCatalogProduct(key: string): Promise<void> {
  if (isPostgres()) {
    await pgDeleteCatalogProduct(key);
  }
  delete mem.catalogProducts[key];
}

export async function getCatalogServices(): Promise<Record<string, Record<string, unknown>>> {
  try {
    if (isPostgres()) return await pgGetCatalogServices();
  } catch (error) {
    console.error("[store] failed to read catalog services", error);
  }
  return mem.catalogServices;
}

export async function saveCatalogService(
  key: string,
  data: Record<string, unknown>
): Promise<void> {
  if (isPostgres()) {
    await pgUpsertCatalogService(key, data);
  }
  mem.catalogServices[key] = data;
}

export async function deleteCatalogService(key: string): Promise<void> {
  if (isPostgres()) {
    await pgDeleteCatalogService(key);
  }
  delete mem.catalogServices[key];
}

export async function getStoredSettings(): Promise<Record<string, unknown>> {
  try {
    if (isPostgres()) {
      const stored = await pgGetSettingsObject();
      if (stored) return stored;
    } else if (storeConfigured()) {
      const raw = await getString("hl:settings:v1");
      if (raw != null) return JSON.parse(raw) as Record<string, unknown>;
    }
  } catch (error) {
    console.error("[store] failed to read settings", error);
  }
  return mem.settings;
}

export async function saveStoredSettings(obj: Record<string, unknown>): Promise<void> {
  if (isPostgres()) {
    await pgSaveSettingsObject(obj);
  } else if (storeConfigured()) {
    await setString("hl:settings:v1", JSON.stringify(obj));
  }
  mem.settings = obj;
}

export async function bumpSold(
  items: { productId: string; quantity: number }[]
): Promise<void> {
  const sold = await getSold();
  for (const item of items) {
    sold[item.productId] = (sold[item.productId] ?? 0) + item.quantity;
  }
  if (isPostgres()) {
    await pgSetSold(sold);
  } else {
    await persistSold(sold);
  }
  mem.sold = sold;
}

export async function nextOrderId(requestedId?: string): Promise<string> {
  const year = new Date().getFullYear();
  if (requestedId && /^HL-\d{4}-\d{4}$/.test(requestedId)) {
    if (!(await isOrderIdTaken(requestedId))) return requestedId;
  }
  let n: number;
  if (isPostgres()) {
    n = await pgNextId(ORDER_SEQ_KEY);
  } else if (storeConfigured()) {
    n = Number(await redis("incr", [ORDER_SEQ_KEY]));
  } else {
    mem.orderSeq = Math.max(mem.orderSeq, mem.orders.length) + 1;
    n = mem.orderSeq;
  }
  return `HL-${year}-${String(n).padStart(4, "0")}`;
}

export async function nextBookingId(): Promise<string> {
  const year = new Date().getFullYear();
  let n: number;
  if (isPostgres()) {
    n = await pgNextId(BOOKING_SEQ_KEY);
  } else if (storeConfigured()) {
    n = Number(await redis("incr", [BOOKING_SEQ_KEY]));
  } else {
    mem.bookingSeq = Math.max(mem.bookingSeq, mem.bookings.length) + 1;
    n = mem.bookingSeq;
  }
  return `BK-${year}-${String(n).padStart(4, "0")}`;
}