import { NextResponse } from "next/server";
import { adminFetch } from "@/lib/admin-fetch";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await adminFetch(`/api/admin/catalog/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      return NextResponse.json({ error: err.error ?? "Failed to delete." }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin catalog delete error:", err);
    return NextResponse.json({ error: err.message ?? "Failed to delete." }, { status: 500 });
  }
}