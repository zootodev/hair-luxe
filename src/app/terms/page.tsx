import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Terms and conditions | ${BUSINESS.name}`,
  description: `Terms and conditions for placing orders, paying by bank transfer, and booking services with ${BUSINESS.name} in Lagos, Nigeria.`,
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    title: "Orders and payment",
    body: [
      "Orders are placed through our website and paid by bank transfer. An order is confirmed once a completed bank transfer is received; we verify payment before preparing your items.",
      "We reserve the right to cancel or adjust any order that appears fraudulent or was placed with incorrect pricing.",
    ],
  },
  {
    title: "Delivery and pickup",
    body: [
      "Delivery is available within our listed zones. Delivery fees and estimated times depend on your zone, and delivery is free on orders over the amount shown at checkout. Pickup orders can be collected from our location during business hours.",
      "While we make every effort to meet estimated delivery times, they are estimates and not guaranteed. We are not liable for delays outside our control (for example, courier or weather).",
    ],
  },
  {
    title: "Cancellations and refunds",
    body: [
      "Orders that have not shipped may be cancelled or refunded. Custom-made and hygiene-sensitive items (including wigs, hair, and lash products) cannot be returned once opened or prepared.",
      "If an item arrives damaged or incorrect, contact us within 7 days and we will arrange a replacement or refund.",
    ],
  },
  {
    title: "Bookings",
    body: [
      "Service bookings are subject to availability. Please contact us at least 24 hours in advance to reschedule or cancel an appointment so we can offer the slot to another client.",
      "Arriving more than 15 minutes late may result in a shortened appointment or rescheduling at our discretion.",
    ],
  },
  {
    title: "Product information",
    body: [
      "We do our best to display product colours and imagery accurately; however, screens vary and small colour differences are normal for human hair products.",
      "Availability updates when stock is sold. We are not liable for outcomes of use contrary to care instructions provided with your product.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      `All content on this website - text, design, logos, and imagery belonging to ${BUSINESS.name} - is protected by copyright and may not be reused without written permission.`,
    ],
  },
  {
    title: "Liability",
    body: [
      "Our liability is limited to the amount you paid for your order. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of this website or our services.",
    ],
  },
  {
    title: "Governing law",
    body: [
      "These terms are governed by the laws of Lagos State, Nigeria, and any disputes will be resolved in the Nigerian courts.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about these terms? Email ${BUSINESS.email} or call ${BUSINESS.phone}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-brand text-xs font-medium mb-2">
          Legal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Terms and conditions</h1>
        <p className="text-sm text-muted mb-10">
          Effective date: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl font-bold text-brand mb-3">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-sm text-foreground/80 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-md bg-surface border border-brand/20 p-5 text-sm">
          <p className="text-muted mb-1">
            For more detail, also see our{" "}
            <Link href="/privacy" className="text-brand hover:underline">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}