import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/catalog";

export const runtime = "nodejs";

export async function GET() {
  const catalog = await getPublicCatalog();
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}