import type { Metadata } from "next";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Our Services | ${BUSINESS.name}`,
  description:
    "Hair revamping, custom wig making, makeup, lash extensions, microblading and skin tag removal. Book your appointment online at " +
    BUSINESS.name +
    ".",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}