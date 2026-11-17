import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CtaBanner from "@/components/home/CtaBanner";
import { getVisibleProducts, getVisibleServices } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, services] = await Promise.all([getVisibleProducts(), getVisibleServices()]);

  return (
    <>
      <Hero />
      <FeaturedServices services={services} />
      <FeaturedProducts products={products} />
      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
