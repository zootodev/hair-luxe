import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `About | ${BUSINESS.name}`,
  description:
    "Wig making, hair revamping, makeup, lashes, microblading and skin tag removal in Lagos and Ibadan. See what we do and how to book.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Clear prices",
    text: "Service prices and appointment lengths are listed on each service page, so you know what to expect before you book.",
  },
  {
    title: "Proper materials",
    text: "We use wigs, hair and products we would use ourselves, and we tell you what suits your hair and budget.",
  },
  {
    title: "Clean working space",
    text: "Tools are cleaned between clients, and we explain the aftercare before you leave the studio.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-brand text-xs font-medium mb-3">About the studio</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Hair and beauty appointments in Lagos
            </h1>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                {BUSINESS.name} makes wigs and looks after hair, skin and makeup. We work
                from a studio in Lagos and take bookings for clients in Lagos, Ibadan and
                nearby cities.
              </p>
              <p>
                You can order a wig or hair product online, or book a service. Each service
                page lists the price range, how long it takes and what is included.
              </p>
              <p>
                If you are not sure what to choose, send us a message with a photo and we
                will suggest what will work for your hair and the look you want.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/services" size="lg">
                See services and prices
              </Button>
              <Button href="/contact" size="lg" variant="outline">
                Ask us a question
              </Button>
            </div>
          </div>
          <div>
            <div className="rounded-md overflow-hidden border border-brand/20">
              <Image
                src="https://images.unsplash.com/photo-1722354142475-5b90b0ff9839?q=80&w=1200&auto=format&fit=crop"
                alt="A stylist working on a client's hair at the Hair Luxe studio"
                width={1200}
                height={900}
                className="object-cover w-full h-[420px]"
              />
            </div>
            <p className="text-xs text-muted mt-2">
              Studio hours: {BUSINESS.hours}. Pickup is available during these hours.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">
            How we work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-md bg-surface border border-surface-light p-6"
              >
                <h3 className="font-display text-lg font-semibold text-brand mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md bg-brand-soft border border-brand/20 p-8 sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Ready to book?
          </h2>
          <p className="text-sm text-muted max-w-2xl mb-6">
            Choose a service, pick a time that suits you and we will confirm your
            appointment. For wigs and hair products, you can order from the shop instead.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/services" size="lg">
              Book a service
            </Button>
            <Button href="/shop" size="lg" variant="outline">
              Shop wigs and hair
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
