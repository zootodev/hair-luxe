import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/config";

export default function CtaBanner() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1600&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div className="relative z-10 px-8 py-16 sm:px-14 md:px-20 max-w-2xl">
            <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
              Ready For a Transformation?
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Book Your Appointment Today
            </h2>
            <p className="text-foreground/80 mb-8 leading-relaxed">
              Reserve your spot for wigs, makeup, lashes, microblading and more. Call us at{" "}
              <a href={`tel:${BUSINESS.phoneFormatted}`} className="text-gold hover:underline">
                {BUSINESS.phone}
              </a>{" "}
              or book instantly online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/services" size="lg">
                Book a Service
              </Button>
              <Button href="/contact" size="lg" variant="outline">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}