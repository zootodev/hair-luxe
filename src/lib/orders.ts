import type { Order, Booking } from "@/lib/types";

const ORDERS_KEY = "zooto-luxe-orders";
const BOOKINGS_KEY = "zooto-luxe-bookings";

export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const count = getOrders().length + 1;
  return `ZL-${year}-${String(count).padStart(4, "0")}`;
}

export function generateBookingId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const count = getBookings().length + 1;
  return `BK-${year}-${String(count).padStart(4, "0")}`;
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? (JSON.parse(stored) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(orderId: string, status: Order["status"]): void {
  const orders = getOrders().map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function deleteOrder(orderId: string): void {
  const orders = getOrders().filter((o) => o.id !== orderId);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    return stored ? (JSON.parse(stored) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function deleteBooking(bookingId: string): void {
  const bookings = getBookings().filter((b) => b.id !== bookingId);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}