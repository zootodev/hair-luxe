import type { Metadata } from "next";
import { Suspense } from "react";
import ShopGrid from "@/components/products/ShopGrid";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: `Shop Products | ${BUSINESS.name}`,
  description:
    "Luxury wigs, virgin hair bundles, lashes and hair care essentials. Shop the premium collection online.",
  alternates: {
    canonical: "/shop",
  },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Premium Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Shop Products</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Luxury wigs, virgin hair bundles, lashes and hair care essentials.
          </p>
        </div>

        <Suspense fallback={null}>
          <ShopGrid initialSearch={q ?? ""} />
        </Suspense>
      </div>
    </div>
  );
}