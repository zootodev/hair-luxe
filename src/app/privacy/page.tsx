import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BUSINESS.name}`,
  description: `How ${BUSINESS.name} collects, uses, and protects your personal information when you place orders or book services.`,
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: [
      "When you place an order or book a service, we collect the details you provide: your name, email address, phone number, delivery address and city. For orders paid by Interac e-Transfer, a proof-of-payment image you upload is transmitted with your order.",
      "We never ask for or store credit card numbers. Payment is completed directly between you and your bank through Interac e-Transfer.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use your information solely to fulfil your order or service request: confirming payment, preparing and shipping products, scheduling appointments, and contacting you about your booking or order status.",
      "We do not sell, rent, or share your personal information with third parties for marketing purposes.",
    ],
  },
  {
    title: "Where Your Information Is Stored",
    body: [
      "Order and booking records are stored securely on our hosting provider (Vercel) and, when configured, a Redis-based data store (Upstash/Vercel KV). Our team members need a private password to view order details in the admin dashboard.",
      "Records are retained as long as needed to fulfil orders, provide support, and meet legal or tax obligations, and are then deleted.",
    ],
  },
  {
    title: "Payment Proofs",
    body: [
      "Proof-of-payment images you upload are stored with your order so we can verify e-Transfer payments. If you would prefer to confirm transfer details by phone instead, please contact us and we will arrange an alternative.",
    ],
  },
  {
    title: "Browser Storage",
    body: [
      "Your shopping cart and delivery preferences are saved in your browser's local storage so your cart persists between visits. This data stays on your device and is not transmitted to us.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "We use EmailJS to send transactional emails (order confirmations, booking notifications, and status updates). Transactional emails are sent only in relation to an order or booking you initiated.",
      "Website images are served from Unsplash and your device connects to Unsplash's CDN to load them.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      `You may request a copy of the personal information we hold about you, ask us to correct inaccuracies, or request deletion at any time by emailing ${BUSINESS.email}.`,
    ],
  },
  {
    title: "Cookies & Analytics",
    body: [
      "This website does not use advertising or cross-site tracking cookies. If analytics are enabled in the future, they will not be used to build advertising profiles.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. The latest version will always be published on this page with the effective date shown below.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-2">
          Legal
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-10">
          Effective date: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-serif text-xl font-bold text-gold mb-3">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-sm text-foreground/80 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-surface border border-gold/20 p-5 text-sm">
          <p className="text-muted mb-1">Questions about this policy?</p>
          <p>
            Email{" "}
            <Link href={`mailto:${BUSINESS.email}`} className="text-gold hover:underline">
              {BUSINESS.email}
            </Link>{" "}
            or call {BUSINESS.phone}.
          </p>
        </div>
      </div>
    </div>
  );
}