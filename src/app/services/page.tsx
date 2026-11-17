import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/lib/data/services";
import { BUSINESS } from "@/lib/config";
import { plainRange } from "@/lib/format";

export const metadata: Metadata = {
  title: `Services | ${BUSINESS.name}`,
  description:
    "Hair revamping, wig making, makeup, lashes, microblading and skin tag removal in Lagos. See prices and appointment lengths, then book online.",
};

export default function ServicesPage() {
  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">Services and prices</h1>
          <p className="text-muted max-w-2xl">
            Prices depend on hair length and the work needed. Each service shows
            the time to set aside before you book.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col rounded-md bg-surface border border-surface-light overflow-hidden"
            >
              <Link href={`/services/${service.id}`} className="relative aspect-[16/10] overflow-hidden block bg-surface-light">
                <Image
                  src={service.image}
                  alt={`${service.name} at Hair Luxe`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-col flex-1 p-5">
                <h2 className="text-lg font-semibold mb-1">
                  <Link href={`/services/${service.id}`} className="hover:text-brand transition-colors">
                    {service.name}
                  </Link>
                </h2>
                <p className="text-sm font-semibold text-brand price tabular">
                  {plainRange(service.priceRange)}
                </p>
                <p className="text-xs text-muted tabular mt-0.5">
                  {plainRange(service.duration)}
                </p>
                <p className="text-sm text-muted leading-relaxed mt-3 mb-4 flex-1">
                  {service.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-md border border-brand/40 px-3 text-xs font-semibold text-brand hover:bg-brand/10 transition-colors"
                  >
                    View service
                  </Link>
                  <Link
                    href={`/services/${service.id}?book=1`}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-brand px-3 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
                  >
                    Book service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
