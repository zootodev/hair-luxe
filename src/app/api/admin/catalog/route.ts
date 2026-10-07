import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-session";
import {
  deleteCatalogProduct,
  deleteCatalogService,
  saveCatalogProduct,
  saveCatalogService,
  saveStoredSettings,
} from "@/lib/store";
import { defaultSettings } from "@/lib/catalog";

export const runtime = "nodejs";

interface CatalogBody {
  type: "product" | "service" | "settings";
  id?: string;
  reset?: boolean;
  data?: Record<string, unknown>;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: CatalogBody;
  try {
    body = (await req.json()) as CatalogBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { type, id, reset, data } = body;

  try {
    if (type === "settings") {
      const stored: Record<string, unknown> = {
        ...(defaultSettings() as unknown as Record<string, unknown>),
        ...(data ?? {}),
      };
      await saveStoredSettings(stored);
      return NextResponse.json({ ok: true });
    }

    if (type === "product") {
      if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
      if (reset) await deleteCatalogProduct(id);
      else if (data) await saveCatalogProduct(id, data);
      return NextResponse.json({ ok: true });
    }

    if (type === "service") {
      if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
      if (reset) await deleteCatalogService(id);
      else if (data) await saveCatalogService(id, data);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown type." }, { status: 400 });
  } catch (error) {
    console.error("[api/admin/catalog] save failed", error);
    return NextResponse.json({ error: "Failed to save changes." }, { status: 500 });
  }
}