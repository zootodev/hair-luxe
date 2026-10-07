import type { Metadata } from "next";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Checkout | ${BUSINESS.name}`,
  description:
    "Secure checkout with Interac e-Transfer payment. Delivery across Ontario or in-store pickup.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}