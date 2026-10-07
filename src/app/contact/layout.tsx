import type { Metadata } from "next";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Contact Us | ${BUSINESS.name}`,
  description: `Reach out to ${BUSINESS.name} for questions about services, orders or appointments in ${BUSINESS.city}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}