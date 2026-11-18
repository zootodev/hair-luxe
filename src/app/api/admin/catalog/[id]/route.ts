import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdmin, verifyCsrf } from "@/lib/admin-session";
import { markCatalogProductDeleted } from "@/lib/store";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!verifyCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }

  const { id } = await params;
  try {
    await markCatalogProductDeleted(id);
  } catch (error) {
    console.error("[api/admin/catalog] delete failed", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
