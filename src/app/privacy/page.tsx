import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Privacy policy | ${BUSINESS.name}`,
  description: `How ${BUSINESS.name} collects, uses, and protects your personal information when you place orders or book services.`,
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "Information we collect",
    body: [
      "When you place an order or book a service, we collect the details you provide: your name, email address, phone number, delivery address and city. For orders paid by bank transfer, a proof-of-payment image you upload is transmitted with your order.",
      "We never ask for or store credit card numbers. Payment is completed directly between you and your bank.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "We use your information solely to fulfil your order or service request: confirming payment, preparing and shipping products, scheduling appointments, and contacting you about your booking or order status.",
      "We do not sell, rent, or share your personal information with third parties for marketing purposes.",
    ],
  },
  {
    title: "Where your information is stored",
    body: [
      "Order and booking records are stored securely on our hosting provider (Vercel) and, when configured, a Redis-based data store (Upstash/Vercel KV). Our team members need a private password to view order details in the admin dashboard.",
      "Records are retained as long as needed to fulfil orders, provide support, and meet legal or tax obligations, and are then deleted.",
    ],
  },
  {
    title: "Payment proofs",
    body: [
      "Proof-of-payment images you upload are stored with your order so we can verify bank transfer payments. If you would prefer to confirm transfer details by phone instead, please contact us and we will arrange an alternative.",
    ],
  },
  {
    title: "Browser storage",
    body: [
      "Your shopping cart and delivery preferences are saved in your browser's local storage so your cart persists between visits. This data stays on your device and is not transmitted to us.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "We use EmailJS to send transactional emails (order confirmations, booking notifications, and status updates). Transactional emails are sent only in relation to an order or booking you initiated.",
      "Website images are served from Unsplash and your device connects to Unsplash's CDN to load them.",
    ],
  },
  {
    title: "Your rights",
    body: [
      `You may request a copy of the personal information we hold about you, ask us to correct inaccuracies, or request deletion at any time by emailing ${BUSINESS.email}.`,
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "This website does not use advertising or cross-site tracking cookies. If analytics are enabled in the future, they will not be used to build advertising profiles.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this privacy policy from time to time. The latest version will always be published on this page with the effective date shown below.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-brand text-xs font-medium mb-2">
          Legal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Privacy policy</h1>
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
          <p className="text-muted mb-1">Questions about this policy?</p>
          <p>
            Email{" "}
            <Link href={`mailto:${BUSINESS.email}`} className="text-brand hover:underline">
              {BUSINESS.email}
            </Link>{" "}
            or call {BUSINESS.phone}.
          </p>
        </div>
      </div>
    </div>
  );
}