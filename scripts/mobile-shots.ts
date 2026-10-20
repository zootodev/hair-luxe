/**
 * Dev-only: full-page mobile screenshots + horizontal-overflow report.
 *
 *   npm run shots:mobile                                  -> production
 *   BASE_URL=http://localhost:3000 npm run shots:mobile   -> local dev server
 *
 * Captures every main route with Playwright's iPhone 13 and Pixel 7 device
 * profiles into mobile-shots/<device>/<route-slug>.png, plus one shot of the
 * open hamburger menu per device. Any route where
 * document.documentElement.scrollWidth > window.innerWidth is logged inline
 * and listed again at the end.
 *
 * The /admin dashboard needs a saved session: run `npm run shots:auth` once.
 * This script is tooling only - it does not touch any app code.
 */
import { chromium, devices } from "@playwright/test";
import type { Page } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const BASE_URL = (
  process.env.BASE_URL || "https://hairluxe-zootodev.vercel.app"
).replace(/\/+$/, "");
const OUT_DIR = path.join(process.cwd(), "mobile-shots");
const AUTH_FILE = path.join(process.cwd(), ".auth", "state.json");

/** Playwright device profiles to capture. */
const DEVICE_NAMES = ["iPhone 13", "Pixel 7"] as const;

/** Main pages of the app; /admin requires .auth/state.json (npm run shots:auth). */
const ROUTES: string[] = [
  "/",
  "/shop",
  "/services",
  "/about",
  "/contact",
  "/cart",
  "/checkout",
  "/track-order",
  "/privacy",
  "/terms",
  "/admin/login",
  "/admin",
];

interface Overflow {
  device: string;
  route: string;
  scrollWidth: number;
  innerWidth: number;
}

/** URL path -> file name: "/shop/wig-1" -> "shop-wig-1", "/" -> "home". */
function routeSlug(route: string): string {
  const slug = route
    .replace(/^\/+/, "")
    .replace(/\/+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "home";
}

/** One product and one service detail page, resolved from the live catalog. */
async function detailRoutes(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/catalog`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      products?: Array<{ id: string; slug?: string }>;
      services?: Array<{ id: string }>;
    };
    const routes: string[] = [];
    const product = data.products?.[0];
    const service = data.services?.[0];
    if (product) routes.push(`/shop/${product.slug || product.id}`);
    if (service) routes.push(`/services/${service.id}`);
    return routes;
  } catch {
    return []; // unreachable or unexpected shape - top-level routes still run
  }
}

/** Scroll through the page so lazy-loaded images are rendered before capture. */
async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const deadline = Date.now() + 8_000;
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    let y = 0;
    while (Date.now() < deadline) {
      y += step;
      window.scrollTo(0, y);
      await new Promise<void>((resolve) => setTimeout(resolve, 40));
      if (y > document.documentElement.scrollHeight) break;
    }
    window.scrollTo(0, 0);
  });
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message.split("\n")[0] : String(error);
}

async function main(): Promise<void> {
  const hasAuth = existsSync(AUTH_FILE);
  const routes = [...ROUTES, ...(await detailRoutes())];

  console.log(`BASE_URL: ${BASE_URL}`);
  console.log(
    `Auth state: ${
      hasAuth
        ? AUTH_FILE
        : "not found - /admin will capture the login page (run: npm run shots:auth)"
    }`
  );
  console.log(`Routes per device: ${routes.length}`);

  const browser = await chromium.launch();
  const overflows: Overflow[] = [];
  const failures: string[] = [];

  try {
    for (const deviceName of DEVICE_NAMES) {
      const context = await browser.newContext({
        ...devices[deviceName],
        ...(hasAuth ? { storageState: AUTH_FILE } : {}),
      });
      const page = await context.newPage();

      for (const route of routes) {
        const outFile = path.join(OUT_DIR, deviceName, `${routeSlug(route)}.png`);
        try {
          await page.goto(`${BASE_URL}${route}`, {
            waitUntil: "load",
            timeout: 45_000,
          });
          await page
            .waitForLoadState("networkidle", { timeout: 8_000 })
            .catch(() => undefined);
          await autoScroll(page);

          const metrics = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }));
          mkdirSync(path.dirname(outFile), { recursive: true });
          // 60s: the image-heavy homepage can exceed Playwright's 30s default
          // for a full-page capture on a cold cache.
          await page.screenshot({ path: outFile, fullPage: true, timeout: 60_000 });

          const rel = path.relative(process.cwd(), outFile);
          if (metrics.scrollWidth > metrics.innerWidth) {
            overflows.push({ device: deviceName, route, ...metrics });
            console.log(
              `[OVERFLOW] ${deviceName} ${route} -> ${rel} ` +
                `(scrollWidth ${metrics.scrollWidth} > innerWidth ${metrics.innerWidth})`
            );
          } else {
            console.log(`[ok] ${deviceName} ${route} -> ${rel}`);
          }

          if (route === "/admin") {
            // The dashboard client-redirects to /admin/login when the saved
            // session is missing or expired.
            await page
              .waitForURL((url) => url.pathname !== "/admin", { timeout: 2_500 })
              .catch(() => undefined);
            if (page.url().includes("/admin/login")) {
              console.warn(
                `[auth] ${deviceName} /admin landed on the login page - run: npm run shots:auth`
              );
            }
          }
        } catch (error) {
          const message = errorText(error);
          failures.push(`${deviceName} ${route}: ${message}`);
          console.error(`[FAIL] ${deviceName} ${route}: ${message}`);
        }
      }

      // One shot of the open hamburger menu per device (captured on /).
      try {
        await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 45_000 });
        await page.locator('button[aria-label="Toggle menu"]').click({ timeout: 10_000 });
        await page.locator("#mobile-menu").waitFor({ state: "visible", timeout: 5_000 });
        const menuFile = path.join(OUT_DIR, deviceName, "nav-menu-open.png");
        mkdirSync(path.dirname(menuFile), { recursive: true });
        await page.screenshot({ path: menuFile }); // viewport shot: the open menu
        console.log(
          `[ok] ${deviceName} nav menu -> ${path.relative(process.cwd(), menuFile)}`
        );
      } catch (error) {
        const message = errorText(error);
        failures.push(`${deviceName} nav menu: ${message}`);
        console.error(`[FAIL] ${deviceName} nav menu: ${message}`);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`\nScreenshots saved under: ${OUT_DIR}`);

  if (overflows.length > 0) {
    console.log(`\nHorizontal overflow on ${overflows.length} route/device pair(s):`);
    for (const o of overflows) {
      console.log(
        `  - ${o.device} ${o.route} (scrollWidth ${o.scrollWidth} > innerWidth ${o.innerWidth})`
      );
    }
  } else {
    console.log("\nNo horizontal overflow detected on any route.");
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} capture(s) failed:`);
    for (const f of failures) console.log(`  - ${f}`);
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error("Fatal:", errorText(error));
  process.exitCode = 1;
});
