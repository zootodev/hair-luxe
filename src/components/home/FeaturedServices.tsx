import Link from "next/link";
import { services } from "@/lib/data/services";
import Button from "@/components/ui/Button";

export default function FeaturedServices() {
  const featured = services.filter((s) => s.featured).slice(0, 3);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Our Expertise
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            Signature Services
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            From hair revamping to flawless makeup, our experts craft beauty tailored to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((service) => (
            <Link
              key={service.id}
              href="/services"
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-surface-light hover:border-gold/40 transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-1"
            >
              <div
                className="relative h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-gold text-sm font-semibold">{service.priceRange}</p>
                <h3 className="font-serif text-2xl font-bold mt-1">{service.name}</h3>
                <p className="text-sm text-foreground/70 mt-1">
                  {service.duration} &middot; {service.category}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/services" variant="outline">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}