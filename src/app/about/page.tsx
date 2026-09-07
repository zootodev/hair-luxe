import Image from "next/image";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/config";

const values = [
  {
    title: "Craftsmanship",
    text: "Every wig and style is a work of art - hand-finished and perfected by experienced professionals.",
  },
  {
    title: "Integrity",
    text: "We use only authentic, premium products. No shortcuts, no compromises - just honest excellence.",
  },
  {
    title: "Care",
    text: "We treat every client like royalty, listening to your vision and bringing it to life with care.",
  },
  {
    title: "Innovation",
    text: "From trending styles to advanced techniques, we stay ahead of the beauty world for you.",
  },
];

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "1K+", label: "Beauty Looks Delivered" },
  { value: "6", label: "Signature Services" },
  { value: "5★", label: "Average Rating" },
];

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
              Our Story
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-6">
              The Art of <span className="text-gradient-gold">Luxury Beauty</span>
            </h1>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                {BUSINESS.name} was founded on a simple belief: every woman deserves to feel
                luxurious. What began as a passion for hair artistry has grown into
                {BUSINESS.city}&apos;s most loved beauty destination.
              </p>
              <p>
                From custom wig making and hair revamping to flawless makeup, lash
                extensions, microblading and skin tag removal - our team of certified
                professionals combines artistry with the highest standards of hygiene and
                care.
              </p>
              <p>
                We don&apos;t just create beautiful looks; we create confidence. Whether
                you&apos;re stepping into the boardroom, walking down the aisle, or simply
                treating yourself, we&apos;re here to make you shine.
              </p>
            </div>
            <div className="mt-8">
              <Button href="/services" size="lg">
                Experience It Yourself
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gold/20">
              <Image
                src="https://images.unsplash.com/photo-1560067174-c5a3a8f37060?q=80&w=1200&auto=format&fit=crop"
                alt="Hair Luxe Studio"
                width={1200}
                height={900}
                className="object-cover w-full h-[420px]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-surface border border-gold/20 p-5 shadow-2xl shadow-black/40 max-w-[220px]">
              <p className="font-serif text-lg font-bold text-gradient-gold mb-1">
                {BUSINESS.hours.split(":")[0]}
              </p>
              <p className="text-xs text-muted">Open hours for your booking</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
              What We Stand For
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl bg-surface border border-surface-light p-6 hover:border-gold/40 transition-colors"
              >
                <h3 className="font-serif text-lg font-semibold text-gold mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="rounded-3xl bg-surface border border-surface-light p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-4xl font-bold text-gradient-gold">{s.value}</p>
                <p className="text-sm text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-20">
          <div className="rounded-3xl overflow-hidden relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1470259078422-826894b933aa?q=80&w=1600&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="relative z-10 px-8 py-20 sm:px-14 text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
                Beauty is a Journey - Let Us Walk It With You
              </h2>
              <Button href="/contact" size="lg" variant="gold">
                Get in Touch
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}