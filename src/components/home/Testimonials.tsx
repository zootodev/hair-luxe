const samples = [
  {
    text: "The wig was ready on the date I needed it, and the fitting was quick.",
    service: "Wig making",
  },
  {
    text: "My hair felt softer after the revamping session and the style held well.",
    service: "Hair revamping",
  },
  {
    text: "Booking took a few minutes and the price I saw online was the price I paid.",
    service: "Makeup",
  },
];

export default function Testimonials() {
  return (
    <div className="mt-12 pt-10 border-t border-surface-light">
      <p className="text-xs font-medium text-brand mb-5">Sample reviews</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {samples.map((sample) => (
          <figure key={sample.service} className="rounded-md bg-background border border-surface-light p-5">
            <blockquote className="text-sm leading-relaxed">&ldquo;{sample.text}&rdquo;</blockquote>
            <figcaption className="text-xs text-muted mt-3">{sample.service}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
