import Image from "next/image";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/config";

export default function Hero() {
  return (
    <section className="border-b border-surface-light bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-sm font-medium text-brand mb-3">
            Wigs and hair services in Lagos
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-5">
            Shop a wig or book your next appointment.
          </h1>
          <p className="text-base text-muted max-w-xl mb-8 leading-relaxed">
            Browse ready-to-wear wigs, or book hair revamping, wig making, makeup
            and lashes. We serve Lagos and Ibadan, with studio pickup or delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button href="/services" size="lg">
              See services and prices
            </Button>
            <Button href="/shop" size="lg" variant="outline">
              Shop wigs
            </Button>
          </div>
          <p className="text-xs text-muted mt-6">{BUSINESS.hours}</p>
        </div>

        <div>
          <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-surface-light">
            <Image
              src="https://images.unsplash.com/photo-1650649016849-00938690600c?q=80&w=1200&auto=format&fit=crop"
              alt="A finished wig styled at the Hair Luxe studio"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="text-xs text-muted mt-2">Finished in our Lagos studio.</p>
        </div>
      </div>
    </section>
  );
}
