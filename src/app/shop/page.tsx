import type { Metadata } from "next";
import { Suspense } from "react";
import ShopGrid from "@/components/products/ShopGrid";
import { getVisibleProducts } from "@/lib/catalog";
import { BUSINESS } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Shop products | ${BUSINESS.name}`,
  description:
    "Wigs, hair bundles, lashes and hair care, with prices in naira. Delivery in Lagos and Ibadan or pickup at the studio.",
  alternates: {
    canonical: "/shop",
  },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = await getVisibleProducts();

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">Shop wigs and hair products</h1>
          <p className="text-muted max-w-2xl">
            Prices are in naira. Each listing shows the length, texture or lace
            before you buy. Delivery in Lagos and Ibadan, or pickup at the studio.
          </p>
        </div>

        <Suspense fallback={null}>
          <ShopGrid products={products} initialSearch={q ?? ""} />
        </Suspense>
      </div>
    </div>
  );
}