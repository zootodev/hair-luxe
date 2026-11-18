import { computeLiveDeliveryFee, getLiveProductById, getLiveSettings } from "@/lib/catalog";
import type { LiveProduct } from "@/lib/catalog";
import {
  addOrder,
  bumpSold,
  nextOrderId,
} from "@/lib/store";
import { sendOrderEmail } from "@/lib/email-server";
import { cartLineKey } from "@/lib/cart";
import { formatNigerianPhone } from "@/lib/format";
import { priceForLength } from "@/lib/product-pricing";
import type { CartItem, DeliveryMethod, Order } from "@/lib/types";

export interface CreateOrderInput {
  items?: CartItem[];
  deliveryMethod?: DeliveryMethod;
  deliveryZone?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    city?: string;
    address?: string;
    notes?: string;
  };
  paymentProof?: string;
  paymentProofName?: string;
  requestedId?: string;
}

export interface CreateOrderResult {
  ok: boolean;
  order?: Order;
  emailOk?: boolean;
  error?: string;
}

const ORDER_ID_PATTERN = /^HL-\d{4}-\d{4}$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PAYMENT_PROOF_PATTERN = /^data:image\/(png|jpe?g|webp);base64,/;

export async function createOrderServer(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const items = Array.isArray(input.items) ? input.items : [];
  const deliveryMethod: DeliveryMethod =
    input.deliveryMethod === "pickup" ? "pickup" : "delivery";
  const settings = await getLiveSettings();
  const deliveryZone = input.deliveryZone ?? settings.deliveryZones[0]?.name ?? "";
  const customer = input.customer ?? {};

  if (items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const firstName = customer.firstName?.trim() ?? "";
  const lastName = customer.lastName?.trim() ?? "";
  const email = customer.email?.trim() ?? "";
  // Always a string; normalised to +234XXXXXXXXXX. Never Number()/parseInt
  // it - that is what used to swallow the leading zero.
  const phone = formatNigerianPhone(customer.phone ?? "");
  const city = customer.city?.trim() ?? "";
  const address = customer.address?.trim() ?? "";

  if (!firstName || !lastName) {
    return { ok: false, error: "First and last name are required." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (!phone) {
    return {
      ok: false,
      error: "Please enter a valid Nigerian phone number, e.g. 08123456789.",
    };
  }
  if (!city) {
    return { ok: false, error: "City is required." };
  }
  if (deliveryMethod === "delivery" && !address) {
    return { ok: false, error: "Street address is required for delivery." };
  }

  if (
    input.paymentProof &&
    (!PAYMENT_PROOF_PATTERN.test(input.paymentProof) ||
      input.paymentProof.length > 2_500_000)
  ) {
    return { ok: false, error: "Payment proof could not be accepted. Please try another image." };
  }

  const validatedItems: CartItem[] = [];
  const productsById = new Map<string, LiveProduct>();
  const requestedByProduct = new Map<string, number>();
  for (const item of items) {
    const existingProduct = productsById.get(item.productId);
    const product: LiveProduct | undefined =
      existingProduct ?? (await getLiveProductById(item.productId));
    if (!product) {
      return { ok: false, error: `Product ${item.productId} is no longer available.` };
    }
    productsById.set(product.id, product);
    if (product.visible === false) {
      return { ok: false, error: `${product.name} is no longer available.` };
    }
    if (item.color && product.colors && !product.colors.includes(item.color)) {
      return { ok: false, error: `${product.name} is no longer available in that colour.` };
    }
    if (item.length && product.lengths && !product.lengths.includes(item.length)) {
      return { ok: false, error: `${product.name} is no longer available in that length.` };
    }

    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const requested = (requestedByProduct.get(product.id) ?? 0) + qty;
    requestedByProduct.set(product.id, requested);

    const color =
      item.color && product.colors?.includes(item.color)
        ? item.color
        : product.colors?.[0];
    const length =
      item.length && product.lengths?.includes(item.length)
        ? item.length
        : product.lengths?.[0];
    const lineKey = cartLineKey({ productId: product.id, color, length });
    const existingLine = validatedItems.find(
      (validated) => cartLineKey(validated) === lineKey
    );
    if (existingLine) {
      existingLine.quantity += qty;
    } else {
      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: priceForLength(product, length),
        image: product.image,
        quantity: qty,
        category: product.category,
        color,
        length,
      });
    }
  }

  for (const [productId, requested] of requestedByProduct) {
    const product = productsById.get(productId);
    if (!product) continue;
    const availableStock = Math.max(0, product.stockCount - product.sold);
    if (requested > availableStock) {
      return {
        ok: false,
        error: `${product.name} only has ${availableStock} in stock.`,
      };
    }
  }

  const subtotal = Number(
    validatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
  );
  const deliveryFee = Number(
    computeLiveDeliveryFee(settings, deliveryMethod, deliveryZone, subtotal).toFixed(2)
  );
  const total = Number((subtotal + deliveryFee).toFixed(2));

  const id = await nextOrderId(
    input.requestedId && ORDER_ID_PATTERN.test(input.requestedId)
      ? input.requestedId
      : undefined
  );

  const order: Order = {
    id,
    customer: {
      firstName,
      lastName,
      email,
      phone,
      city,
      address: deliveryMethod === "delivery" ? address : undefined,
      deliveryMethod,
      deliveryZone: deliveryMethod === "delivery" ? deliveryZone : undefined,
      notes: customer.notes?.trim() || undefined,
    },
    items: validatedItems,
    subtotal,
    deliveryFee,
    total,
    status: "pending",
    paymentMethod: "bank-transfer",
    date: new Date().toISOString(),
    paymentProof: input.paymentProof,
    paymentProofName: input.paymentProofName?.slice(0, 200),
  };

  await addOrder(order);
  await bumpSold(validatedItems);

  const emailResult = await sendOrderEmail(order);
  return { ok: true, order, emailOk: emailResult.ok };
}
