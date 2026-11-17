"use client";

import Button from "@/components/ui/Button";
import { useCart } from "@/lib/context/CartContext";

export default function CtaBanner() {
  const { business } = useCart();

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-brand-soft border border-brand/15 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-strong">
              Book your next appointment
            </h2>
            <p className="text-sm text-foreground/80 mt-3 max-w-xl leading-relaxed">
              Pick a service and a time that works for you. You can also call or
              message us at{" "}
              <a href={`tel:${business.phoneFormatted}`} className="font-medium text-brand hover:underline">
                {business.phone}
              </a>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button href="/services">Book a service</Button>
            <Button href="/contact" variant="outline">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
