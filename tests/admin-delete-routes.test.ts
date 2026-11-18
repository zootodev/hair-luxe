import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  isAdmin: vi.fn(),
  verifyCsrf: vi.fn(),
  markCatalogProductDeleted: vi.fn(),
  markCatalogServiceDeleted: vi.fn(),
}));

vi.mock("@/lib/admin-session", () => ({
  isAdmin: mocks.isAdmin,
  verifyCsrf: mocks.verifyCsrf,
}));

vi.mock("@/lib/store", () => ({
  markCatalogProductDeleted: mocks.markCatalogProductDeleted,
  markCatalogServiceDeleted: mocks.markCatalogServiceDeleted,
}));

import { DELETE as deleteProduct } from "@/app/api/admin/catalog/[id]/route";
import { DELETE as deleteService } from "@/app/api/admin/services/[id]/route";

function request() {
  return new NextRequest("http://localhost/api/admin/catalog/wig-royal", {
    method: "DELETE",
  });
}

const context = { params: Promise.resolve({ id: "wig-royal" }) };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.verifyCsrf.mockReturnValue(true);
  mocks.markCatalogProductDeleted.mockResolvedValue(undefined);
  mocks.markCatalogServiceDeleted.mockResolvedValue(undefined);
});

describe("DELETE /api/admin/catalog/[id]", () => {
  it("returns 401 when signed out", async () => {
    mocks.isAdmin.mockResolvedValue(false);

    const res = await deleteProduct(request(), context);

    expect(res.status).toBe(401);
    expect(mocks.markCatalogProductDeleted).not.toHaveBeenCalled();
  });

  it("deletes the product for a signed-in admin", async () => {
    mocks.isAdmin.mockResolvedValue(true);

    const res = await deleteProduct(request(), context);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(mocks.markCatalogProductDeleted).toHaveBeenCalledWith("wig-royal");
  });

  it("rejects a request without a valid CSRF token", async () => {
    mocks.isAdmin.mockResolvedValue(true);
    mocks.verifyCsrf.mockReturnValue(false);

    const res = await deleteProduct(request(), context);

    expect(res.status).toBe(403);
    expect(mocks.markCatalogProductDeleted).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/admin/services/[id]", () => {
  it("returns 401 when signed out", async () => {
    mocks.isAdmin.mockResolvedValue(false);

    const res = await deleteService(request(), context);

    expect(res.status).toBe(401);
    expect(mocks.markCatalogServiceDeleted).not.toHaveBeenCalled();
  });

  it("deletes the service for a signed-in admin", async () => {
    mocks.isAdmin.mockResolvedValue(true);

    const res = await deleteService(request(), context);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(mocks.markCatalogServiceDeleted).toHaveBeenCalledWith("wig-royal");
  });
});
