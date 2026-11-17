import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";
import type { Product } from "@/lib/types";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const wigs = products.filter((p) => p.category === "Wigs").slice(0, 3);

  return (
    <section className="py-14 md:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Wigs in the shop
            </h2>
            <p className="text-sm text-muted mt-2 max-w-xl">
              Each listing shows the length, lace and texture before you buy.
              Prices are in naira.
            </p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-brand hover:underline self-start">
            Shop all products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wigs.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8">
          <Button href="/shop" variant="outline">
            Browse the full shop
          </Button>
        </div>
      </div>
    </section>
  );
}
