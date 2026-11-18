import Link from "next/link";

const facts = [
  {
    title: "Clear prices",
    text: "Service prices and appointment lengths are listed before you book.",
  },
  {
    title: "Lagos and Ibadan",
    text: "Pick up at the studio, or have your order delivered within the South-West.",
  },
  {
    title: "Bank transfer only",
    text: "Pay by bank transfer at checkout. We confirm the transfer before preparing your order.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 md:py-20 border-y border-surface-light bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-8">
          What to expect
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {facts.map((fact) => (
            <div key={fact.title}>
              <h3 className="text-sm font-semibold mb-2">{fact.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{fact.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted mt-8">
          Need help choosing? <Link href="/contact" className="text-brand font-medium hover:underline">Send us a message</Link>.
        </p>
      </div>
    </section>
  );
}
