import { getFeaturedProducts } from "@/lib/data/products";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-20 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Bestsellers
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Handpicked premier wigs, bundles and beauty essentials our clients love.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/products">Shop All Products</Button>
        </div>
      </div>
    </section>
  );
}