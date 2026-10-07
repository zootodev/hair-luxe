import { computeLiveDeliveryFee, getLiveProductById, getLiveSettings } from "@/lib/catalog";
import type { LiveProduct } from "@/lib/catalog";
import {
  addOrder,
  bumpSold,
  nextOrderId,
} from "@/lib/store";
import { sendOrderEmail } from "@/lib/email-server";
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
  const phone = customer.phone?.trim() ?? "";
  const city = customer.city?.trim() ?? "";
  const address = customer.address?.trim() ?? "";

  if (!firstName || !lastName) {
    return { ok: false, error: "First and last name are required." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (!/^[\d\s()+-]{7,}$/.test(phone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }
  if (!city) {
    return { ok: false, error: "City is required." };
  }
  if (deliveryMethod === "delivery" && !address) {
    return { ok: false, error: "Street address is required for delivery." };
  }

  if (
    input.paymentProof &&
    (!input.paymentProof.startsWith("data:image/") ||
      input.paymentProof.length > 2_500_000)
  ) {
    return { ok: false, error: "Payment proof could not be accepted. Please try another image." };
  }

  const validatedItems: CartItem[] = [];
  for (const item of items) {
    const product: LiveProduct | undefined = await getLiveProductById(item.productId);
    if (!product) {
      return { ok: false, error: `Product ${item.productId} is no longer available.` };
    }
    if (product.visible === false) {
      return { ok: false, error: `${product.name} is no longer available.` };
    }
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const availableStock = Math.max(0, product.stockCount - product.sold);
    if (qty > availableStock) {
      return {
        ok: false,
        error: `${product.name} only has ${availableStock} in stock.`,
      };
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
    paymentMethod: "interac",
    date: new Date().toISOString(),
    paymentProof: input.paymentProof,
    paymentProofName: input.paymentProofName?.slice(0, 200),
  };

  await addOrder(order);
  await bumpSold(validatedItems);

  const emailResult = await sendOrderEmail(order);
  return { ok: true, order, emailOk: emailResult.ok };
}