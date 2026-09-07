import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <WhyChooseUs />
      <FeaturedProducts />
      <Testimonials />
      <CtaBanner />
    </>
  );
}