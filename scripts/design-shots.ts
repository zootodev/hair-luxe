/**
 * Dev-only design audit screenshots (desktop + mobile) with overflow report.
 *
 *   BASE_URL=http://localhost:3000 SHOT_DIR=design-shots/before npm run shots:design
 *
 * Captures the routes named in the design brief plus empty states. Auth for
 * /admin comes from .auth/state.json (npm run shots:auth). Output is ignored
 * by git so no customer data or secrets can be committed.
 */
import { chromium, devices } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const OUT_DIR = path.resolve(process.cwd(), process.env.SHOT_DIR || "design-shots/before");
const AUTH_FILE = path.join(process.cwd(), ".auth", "state.json");

const PROFILES = [
  { name: "desktop", options: { viewport: { width: 1440, height: 900 } } },
  { name: "iphone-13", options: devices["iPhone 13"] },
  { name: "pixel-7", options: devices["Pixel 7"] },
] as const;

interface Shot {
  route: string;
  slug: string;
  seedCart?: boolean;
  fillOrder?: string;
}

const BASE_SHOTS: Shot[] = [
  { route: "/", slug: "home" },
  { route: "/shop", slug: "shop" },
  { route: "/services", slug: "services" },
  { route: "/about", slug: "about" },
  { route: "/contact", slug: "contact" },
  { route: "/cart", slug: "cart-empty" },
  { route: "/cart", slug: "cart-with-items", seedCart: true },
  { route: "/checkout", slug: "checkout", seedCart: true },
  { route: "/track-order", slug: "track-order" },
  { route: "/track-order", slug: "track-order-no-orders", fillOrder: "HL-2099-9999" },
  { route: "/admin/login", slug: "admin-login" },
  { route: "/admin", slug: "admin" },
  { route: "/admin/orders", slug: "admin-orders" },
  { route: "/admin/bookings", slug: "admin-bookings" },
  { route: "/admin/products", slug: "admin-products" },
  { route: "/admin/services", slug: "admin-services" },
  { route: "/admin/settings", slug: "admin-settings" },
  { route: "/shop/no-such-product", slug: "product-not-found" },
];

const CART_KEY = "hair-luxe-cart";

async function catalog(): Promise<{ product?: string; service?: string }> {
  // The seeded ids are stable. Keeping them here means detail screenshots are
  // still captured when /api/catalog is briefly unavailable during a cold
  // dev compile.
  const fallback = {
    product: "/shop/fr-wig-royal",
    service: "/services/hair-revamping",
  };
  try {
    const res = await fetch(`${BASE_URL}/api/catalog`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return fallback;
    const data = (await res.json()) as {
      products?: Array<{ id: string; slug?: string; image: string; name: string; price: number; category: string }>;
      services?: Array<{ id: string }>;
    };
    const p = data.products?.[0];
    return {
      product: p ? `/shop/${p.slug || p.id}` : fallback.product,
      service: data.services?.[0] ? `/services/${data.services[0].id}` : fallback.service,
      ...(p ? { cartItem: JSON.stringify([{ productId: p.id, name: p.name, price: p.price, image: p.image, quantity: 1, category: p.category }]) } : {}),
    } as { product?: string; service?: string; cartItem?: string };
  } catch {
    return fallback;
  }
}

async function seedCart(page: Page, item?: string): Promise<void> {
  const payload = item || JSON.stringify([{
    productId: "fr-wig-royal",
    name: "Lace front wig, straight",
    price: 250000,
    image: "https://images.unsplash.com/photo-1650649016849-00938690600c?q=80&w=1200&auto=format&fit=crop",
    quantity: 1,
    category: "Wigs",
  }]);
  await page.addInitScript(([key, value]) => {
    window.localStorage.setItem(key, value);
  }, [CART_KEY, payload]);
}

async function scroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(240, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 25));
    }
    window.scrollTo(0, 0);
  });
}

async function main(): Promise<void> {
  const info = await catalog();
  const shots: Shot[] = [...BASE_SHOTS];
  if (info.product) shots.splice(1, 0, { route: info.product, slug: "product" });
  if (info.service) shots.splice(shots.findIndex((s) => s.slug === "services") + 1, 0, { route: info.service, slug: "service" });
  const orderId = "HL-2026-0001";
  shots.splice(shots.findIndex((s) => s.slug === "track-order-no-orders") + 1, 0, { route: `/order/${orderId}`, slug: "order-sample" });

  const hasAuth = existsSync(AUTH_FILE);
  mkdirSync(OUT_DIR, { recursive: true });
  const report: Array<{ profile: string; shot: string; route: string; scrollWidth: number; innerWidth: number; overflow: boolean }> = [];
  const browser = await chromium.launch();

  try {
    for (const profile of PROFILES) {
      const context: BrowserContext = await browser.newContext({
        ...profile.options,
        ...(hasAuth ? { storageState: AUTH_FILE } : {}),
      });
      const page = await context.newPage();
      for (const shot of shots) {
        // A fresh page per shot keeps injected cart state isolated.
        const shotPage = await context.newPage();
        try {
          if (shot.seedCart) await seedCart(shotPage, (info as { cartItem?: string }).cartItem);
          await shotPage.goto(`${BASE_URL}${shot.route}`, { waitUntil: "load", timeout: 45_000 });
          if (shot.fillOrder) {
            const input = shotPage.getByPlaceholder("HL-2026-0123");
            await input.waitFor({ state: "visible", timeout: 15_000 });
            await input.fill(shot.fillOrder);
            const phone = shotPage.getByPlaceholder("+234 812 345 6789");
            if (await phone.count()) await phone.fill("+234 812 345 6789");
            const button = shotPage.getByRole("button", { name: /look up|track|search/i }).first();
            if (await button.count()) await button.click();
            await shotPage.waitForTimeout(800);
          }
          await shotPage.waitForLoadState("networkidle", { timeout: 6_000 }).catch(() => undefined);
          await scroll(shotPage);
          const metrics = await shotPage.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }));
          const dir = path.join(OUT_DIR, profile.name);
          mkdirSync(dir, { recursive: true });
          await shotPage.screenshot({ path: path.join(dir, `${shot.slug}.png`), fullPage: true, timeout: 60_000 });
          report.push({ profile: profile.name, shot: shot.slug, route: shot.route, ...metrics, overflow: metrics.scrollWidth > metrics.innerWidth });
          console.log(`${metrics.scrollWidth > metrics.innerWidth ? "[OVERFLOW]" : "[ok]"} ${profile.name} ${shot.slug}`);
        } catch (error) {
          console.error(`[FAIL] ${profile.name} ${shot.slug}: ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`);
        } finally {
          await shotPage.close();
        }
      }
      await page.close();
      await context.close();
    }
  } finally {
    await browser.close();
  }

  writeFileSync(path.join(OUT_DIR, "overflow.json"), JSON.stringify(report, null, 2));
  const overflows = report.filter((r) => r.overflow);
  console.log(`\n${report.length} shots, ${overflows.length} overflows -> ${OUT_DIR}`);
  if (overflows.length) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error("Fatal:", error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
