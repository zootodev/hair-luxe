const testimonials = [
  {
    name: "Adebisi O.",
    location: "Toronto",
    text: "My custom wig from Hair Luxe is absolutely stunning! The install was seamless and I get compliments everywhere I go. Truly luxury from start to finish.",
    service: "Wig Making",
  },
  {
    name: "Sarah M.",
    location: "Mississauga",
    text: "The hair revamping service saved my damaged hair. Three weeks later it's shinier and healthier than ever. I can't recommend them enough!",
    service: "Hair Revamping",
  },
  {
    name: "Jennifer P.",
    location: "North York",
    text: "From microblading to lashes, every service is top tier. The studio is clean, elegant, and the team treats you like royalty. 10/10 experience.",
    service: "Microblading",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">
            Client Love
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl bg-surface border border-surface-light p-7 shadow-lg shadow-black/20 hover:border-gold/40 transition-colors"
            >
              <div className="flex gap-1 text-gold mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/85 leading-relaxed text-sm flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-gold/10 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted">
                    {t.location} &middot; <span className="text-gold">{t.service}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}