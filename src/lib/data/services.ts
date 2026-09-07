import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    id: "hair-revamping",
    name: "Hair Revamping",
    category: "Hair Revamping",
    description:
      "Transform worn, dull or damaged hair into a fresh, luxurious look. Our stylists breathe new life into existing hair with deep conditioning, restyling and precision care.",
    priceRange: "$80 - $150",
    startingPrice: 80,
    duration: "2 - 3 hours",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Deep conditioning treatment",
      "Gentle detangling & repair",
      "Fresh style & color refresh",
      "Scalp nourishment treatment",
    ],
    featured: true,
  },
  {
    id: "wig-making",
    name: "Wig Making",
    category: "Wig Making",
    description:
      "Custom-made luxury wigs tailored to your head size, style and preference. We use premium virgin hair and hand-tied techniques for an undetectable look.",
    priceRange: "$150 - $300",
    startingPrice: 150,
    duration: "3 - 4 hours",
    image:
      "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Custom cap fitting",
      "Hand-sewn closures or frontals",
      "Virgin hair installation",
      "Free first install appointment",
    ],
    featured: true,
  },
  {
    id: "makeup",
    name: "Makeup",
    category: "Makeup",
    description:
      "Professional makeup artistry for every occasion - weddings, photoshoots, parties and more. Flawless, camera-ready looks that enhance your natural beauty.",
    priceRange: "$100 - $200",
    startingPrice: 100,
    duration: "1 - 2 hours",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Skin prep & priming",
      "Full glam or natural application",
      "False lashes included",
      "Touch-up kit for events",
    ],
    featured: true,
  },
  {
    id: "lash-extensions",
    name: "Lash Extensions",
    category: "Lash Extensions",
    description:
      "Volumizing and classic lash extensions for beautiful, wide-awake eyes. Applied safely with premium materials and lasting results.",
    priceRange: "$80 - $150",
    startingPrice: 80,
    duration: "1 - 1.5 hours",
    image:
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Lash consultation & mapping",
      "Classic or volume application",
      "Premium lash serum",
      "Free 7-day refill touch up",
    ],
    featured: true,
  },
  {
    id: "microblading",
    name: "Microblading",
    category: "Microblading",
    description:
      "Semi-permanent eyebrow enhancement with precise, hair-like strokes. Say goodbye to daily eyebrow makeup with results that last 1-3 years.",
    priceRange: "$200 - $400",
    startingPrice: 200,
    duration: "2 - 3 hours",
    image:
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Brow design & mapping",
      "Numbing for comfort",
      "Hair-stroke technique",
      "6-week touch-up session",
    ],
    featured: true,
  },
  {
    id: "skin-tag-removal",
    name: "Skin Tag Removal",
    category: "Skin Tag Removal",
    description:
      "Safe, hygienic and virtually painless removal of skin tags. Quick procedure with minimal downtime and discreet, professional care.",
    priceRange: "$50 - $150",
    startingPrice: 50,
    duration: "30 - 60 minutes",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Professional consultation",
      "Individual or multiple removals",
      "Aftercare products",
      "Follow-up check",
    ],
  },
];