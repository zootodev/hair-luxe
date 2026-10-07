import type { Order, Booking } from "@/lib/types";

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

export function storeConfigured(): boolean {
  return getRestConfig() !== null;
}

export function storeKind(): string {
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

export async function getOrders(): Promise<Order[]> {
  if (storeConfigured()) {
    try {
      const raw = await getString(ORDERS_KEY);
      if (raw != null) return JSON.parse(raw) as Order[];
    } catch (error) {
      console.error("[store] failed to read orders", error);
    }
  }
  return mem.orders;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export async function addOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  await persistOrders([order, ...orders]);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<boolean> {
  const orders = await getOrders();
  const next = orders.map((o) =>
    o.id.toLowerCase() === id.toLowerCase() ? { ...o, status } : o
  );
  if (JSON.stringify(next) === JSON.stringify(orders)) return false;
  await persistOrders(next);
  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
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
  if (storeConfigured()) {
    try {
      const raw = await getString(BOOKINGS_KEY);
      if (raw != null) return JSON.parse(raw) as Booking[];
    } catch (error) {
      console.error("[store] failed to read bookings", error);
    }
  }
  return mem.bookings;
}

export async function addBooking(booking: Booking): Promise<void> {
  const bookings = await getBookings();
  await persistBookings([booking, ...bookings]);
}

export async function deleteBooking(id: string): Promise<boolean> {
  const bookings = await getBookings();
  const next = bookings.filter((b) => b.id.toLowerCase() !== id.toLowerCase());
  if (next.length === bookings.length) return false;
  await persistBookings(next);
  return true;
}

export async function getSold(): Promise<Record<string, number>> {
  if (storeConfigured()) {
    try {
      const raw = await getString(SOLD_KEY);
      if (raw != null) return JSON.parse(raw) as Record<string, number>;
    } catch (error) {
      console.error("[store] failed to read sold", error);
    }
  }
  return mem.sold;
}

export async function bumpSold(
  items: { productId: string; quantity: number }[]
): Promise<void> {
  const sold = await getSold();
  for (const item of items) {
    sold[item.productId] = (sold[item.productId] ?? 0) + item.quantity;
  }
  await persistSold(sold);
}

export async function nextOrderId(requestedId?: string): Promise<string> {
  const year = new Date().getFullYear();
  if (requestedId && /^HL-\d{4}-\d{4}$/.test(requestedId)) {
    if (!(await isOrderIdTaken(requestedId))) return requestedId;
  }
  let n: number;
  if (storeConfigured()) {
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
  if (storeConfigured()) {
    n = Number(await redis("incr", [BOOKING_SEQ_KEY]));
  } else {
    mem.bookingSeq = Math.max(mem.bookingSeq, mem.bookings.length) + 1;
    n = mem.bookingSeq;
  }
  return `BK-${year}-${String(n).padStart(4, "0")}`;
}