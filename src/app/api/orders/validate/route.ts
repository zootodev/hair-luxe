import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/data/products";
import { DELIVERY_ZONES, BUSINESS } from "@/lib/config";
import { rateLimit } from "@/lib/rate-limit";
import type { CartItem, DeliveryMethod } from "@/lib/types";

export const runtime = "nodejs";

interface ValidateBody {
  items?: CartItem[];
  deliveryMethod?: DeliveryMethod;
  deliveryZone?: string;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = rateLimit(`validate:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limited.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  let body: ValidateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const deliveryMethod: DeliveryMethod = body.deliveryMethod === "pickup" ? "pickup" : "delivery";
  const deliveryZone = body.deliveryZone ?? DELIVERY_ZONES[1].name;

  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const validatedItems: CartItem[] = [];
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} is no longer available.` },
        { status: 400 }
      );
    }
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    if (qty > product.stockCount) {
      return NextResponse.json(
        { error: `${product.name} only has ${product.stockCount} in stock.` },
        { status: 400 }
      );
    }
    validatedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      category: product.category,
    });
  }

  const subtotal = validatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let deliveryFee = 0;
  if (deliveryMethod === "delivery") {
    const zone = DELIVERY_ZONES.find((z) => z.name === deliveryZone);
    deliveryFee = zone ? zone.fee : BUSINESS.deliveryFee;
  }

  const total = subtotal + deliveryFee;

  return NextResponse.json({
    ok: true,
    items: validatedItems,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    total: Number(total.toFixed(2)),
    deliveryMethod,
    deliveryZone: deliveryMethod === "delivery" ? deliveryZone : undefined,
  });
}