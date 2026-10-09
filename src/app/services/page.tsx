"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data/services";
import type { Service } from "@/lib/types";
import BookingModal from "@/components/services/BookingModal";

export const metadata: Metadata = {
  title: `Services | ${BUSINESS.name}`,
  description: "Expert hair services including hair revamping, wig making, makeup, lash extensions, microblading, and skin tag removal. Book a consultation online.",
};
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [catalogServices, setCatalogServices] = useState<Service[]>(services);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<{ services?: Service[] }>) : null))
      .then((data) => {
        if (data?.services && !cancelled) setCatalogServices(data.services);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Our Expertise
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Premium beauty services delivered by certified professionals. Select a service to
            book your appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogServices.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col rounded-2xl bg-surface border border-surface-light hover:border-gold/40 overflow-hidden transition-all duration-300 shadow-lg shadow-black/20 hover:-translate-y-1"
            >
              <Link href={`/services/${service.id}`} className="relative h-56 overflow-hidden block">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold text-background text-xs font-bold">
                    {service.priceRange}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-foreground/90 text-xs">
                    {service.duration}
                  </span>
                </div>
              </Link>

              <div className="flex flex-col flex-1 p-6">
                <Link href={`/services/${service.id}`}>
                  <h2 className="font-serif text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                    {service.name}
                  </h2>
                </Link>
                <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {service.includes.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                      <svg
                        className="w-4 h-4 text-gold mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Link
                    href={`/services/${service.id}`}
                    className="flex-1 h-11 rounded-full border border-gold/40 text-gold text-xs font-semibold flex items-center justify-center hover:bg-gold/10 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => setBookingService(service)}
                    className="flex-1 h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {bookingService && (
        <BookingModal
          service={bookingService}
          isOpen={!!bookingService}
          onClose={() => setBookingService(null)}
        />
      )}
    </div>
  );
}