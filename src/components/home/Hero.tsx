import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560067174-c5a3a8f37060?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <p className="text-gold uppercase tracking-[0.3em] text-sm font-medium animate-fade-in-up mb-4">
          {BUSINESS.tagline}
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up animate-delay-200">
          <span className="text-gradient-gold">Where Luxury</span>
          <br />
          Meets Your Beautiful Hair
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-400 leading-relaxed">
          Premium wigs, hair revamping, makeup &amp; lash artistry. Expert craftsmanship,
          personalized care, and elegance in every strand.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-600">
          <Button href="/services" size="lg">
            Book a Service
          </Button>
          <Button href="/products" size="lg" variant="outline">
            Shop Products
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "1K+", label: "Wigs Crafted" },
            { value: "5★", label: "Rated Service" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-gradient-gold">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gold/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}