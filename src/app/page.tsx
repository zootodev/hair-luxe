import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";
import { getVisibleProducts, getVisibleServices } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, services] = await Promise.all([getVisibleProducts(), getVisibleServices()]);

  return (
    <>
      <Hero />
      <FeaturedServices services={services} />
      <WhyChooseUs />
      <FeaturedProducts products={products} />
      <Testimonials />
      <CtaBanner />
    </>
  );
}