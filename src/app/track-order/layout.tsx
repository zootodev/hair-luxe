import type { Metadata } from "next";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Track Your Order | ${BUSINESS.name}`,
  description: `Check the status of your ${BUSINESS.name} order using your order ID and phone number.`,
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}