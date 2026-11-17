import Link from "next/link";
import Button from "@/components/ui/Button";
import { plainRange } from "@/lib/format";
import type { Service } from "@/lib/types";

export default function FeaturedServices({ services }: { services: Service[] }) {
  const featured = services.filter((s) => s.featured).slice(0, 3);

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Services with clear prices
            </h2>
            <p className="text-sm text-muted mt-2 max-w-xl">
              Each appointment lists what it costs and how long to set aside.
              Prices depend on hair length and the work needed.
            </p>
          </div>
          <Link href="/services" className="text-sm font-medium text-brand hover:underline self-start">
            All services
          </Link>
        </div>

        <div className="border-t border-surface-light">
          {featured.map((service) => (
            <div
              key={service.id}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center gap-x-6 gap-y-1 py-5 border-b border-surface-light"
            >
              <div>
                <h3 className="text-base font-semibold">{service.name}</h3>
                <p className="text-xs text-muted mt-1">{service.category}</p>
              </div>
              <p className="text-sm font-semibold text-brand tabular price">
                {plainRange(service.priceRange)}
              </p>
              <p className="text-sm text-muted tabular">{plainRange(service.duration)}</p>
              <Link
                href={`/services/${service.id}`}
                className="text-sm font-medium text-brand hover:underline self-start sm:self-auto"
              >
                View service
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button href="/services" variant="outline">
            See all services
          </Button>
        </div>
      </div>
    </section>
  );
}
