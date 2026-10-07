import type { Metadata } from "next";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Shopping Cart | ${BUSINESS.name}`,
  description: `Review your shopping cart and proceed to checkout. ${BUSINESS.name} offers local delivery across Ontario and in-store pickup.`,
  alternates: { canonical: "/cart" },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}