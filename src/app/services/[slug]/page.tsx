"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { services } from "@/lib/data/services";
import type { Service } from "@/lib/types";
import BookingModal from "@/components/services/BookingModal";

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const service: Service | undefined = services.find((s) => s.id === params.slug);
  const [bookingOpen, setBookingOpen] = useState(false);

  if (!service) {
    notFound();
  }

  const related = services.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-gold transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-gold">{service.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface border border-surface-light">
            <Image
              src={service.image}
              alt={service.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
              {service.category}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">{service.name}</h1>
            <p className="text-muted leading-relaxed mb-6">{service.description}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-semibold">
                From {service.priceRange}
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-surface border border-surface-light text-sm text-muted">
                {service.duration}
              </span>
            </div>

            <h3 className="font-serif text-xl font-semibold mb-4">What&apos;s Included</h3>
            <ul className="space-y-3 mb-8">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/85">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/10 text-gold shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setBookingOpen(true)}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Book This Service
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-8 text-center">
            Explore Other Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.id}`}
                className="group flex items-center gap-4 rounded-2xl bg-surface border border-surface-light p-4 hover:border-gold/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-light shrink-0">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-semibold truncate group-hover:text-gold transition-colors">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {s.priceRange} &middot; {s.duration}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BookingModal
        service={service}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}