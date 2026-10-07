"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";
import BookingModal from "@/components/services/BookingModal";

export default function ServiceDetailClient({ service }: { service: Service }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
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

      <BookingModal
        service={service}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}