/**
 * Dev-only: opens a headed Chromium window on the admin login page so you can
 * sign in once manually. The resulting session is saved to .auth/state.json,
 * which `npm run shots:mobile` reuses to capture the /admin dashboard.
 *
 *   npm run shots:auth                                   -> against production
 *   BASE_URL=http://localhost:3000 npm run shots:auth    -> local dev server
 *
 * This script is tooling only - it does not touch any app code.
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE_URL = (
  process.env.BASE_URL || "https://hairluxe-zootodev.vercel.app"
).replace(/\/+$/, "");
const AUTH_FILE = path.join(process.cwd(), ".auth", "state.json");

function errorText(error: unknown): string {
  return error instanceof Error ? error.message.split("\n")[0] : String(error);
}

async function main(): Promise<void> {
  mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  console.log(`Opening a browser window at ${BASE_URL}/admin/login ...`);
  console.log("Sign in there once (demo password: see README). Waiting up to 3 minutes.");

  const browser = await chromium.launch({ headless: false });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "load", timeout: 45_000 });

    // The login page client-redirects to /admin on success.
    await page.waitForURL((url) => url.pathname !== "/admin/login", {
      timeout: 180_000,
    });

    await context.storageState({ path: AUTH_FILE });
    console.log(`Signed in. Saved session to ${path.relative(process.cwd(), AUTH_FILE)}`);
    console.log("`npm run shots:mobile` will now capture the /admin dashboard too.");
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(`Could not capture auth: ${errorText(error)}`);
  process.exitCode = 1;
});
