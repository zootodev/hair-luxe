import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    id: "hair-revamping",
    name: "Hair revamping",
    category: "Hair",
    description:
      "For hair that needs a reset. We wash, deep condition, detangle and restyle, then talk you through how to care for it at home. Bring your own hair or ask us what will work best.",
    priceRange: "₦120,000 to ₦250,000",
    startingPrice: 120000,
    duration: "2 to 3 hours",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Deep conditioning treatment",
      "Detangling and repair",
      "Restyling and colour refresh",
      "Scalp treatment",
    ],
    featured: true,
  },
  {
    id: "wig-making",
    name: "Wig making",
    category: "Hair",
    description:
      "A wig made to your head measurements and chosen style. We fit the cap, sew in the closure or frontal, and show you how to fit and care for it before you leave.",
    priceRange: "₦150,000 to ₦300,000",
    startingPrice: 150000,
    duration: "3 to 4 hours",
    image:
      "https://images.unsplash.com/photo-1663582816182-15cf69d87665?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Cap fitting and measurements",
      "Hand-sewn closure or frontal",
      "Hair installation",
      "First fitting appointment",
    ],
    featured: true,
  },
  {
    id: "makeup",
    name: "Makeup",
    category: "Beauty",
    description:
      "Makeup for weddings, photos, parties and everyday events in Lagos and Ibadan. Tell us the look you want and we will prepare the skin and work to suit it.",
    priceRange: "₦150,000 to ₦250,000",
    startingPrice: 150000,
    duration: "1 to 2 hours",
    image:
      "https://images.unsplash.com/photo-1713771295889-eacfced8de80?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Skin preparation and priming",
      "Natural or full event look",
      "False lashes included",
      "Small touch-up kit",
    ],
    featured: true,
  },
  {
    id: "lash-extensions",
    name: "Lash extensions",
    category: "Beauty",
    description:
      "Classic or volume lashes applied strand by strand. We map the shape to your eye and use a suitable weight so the lashes stay comfortable.",
    priceRange: "₦120,000 to ₦250,000",
    startingPrice: 120000,
    duration: "1 to 1.5 hours",
    image:
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Lash consultation and mapping",
      "Classic or volume application",
      "Aftercare instructions",
      "Refill within seven days",
    ],
    featured: true,
  },
  {
    id: "microblading",
    name: "Microblading",
    category: "Skin",
    description:
      "Semi-permanent brow strokes shaped to your face. We map the brows first, use a numbing cream and book your six-week top-up before you leave.",
    priceRange: "₦350,000 to ₦650,000",
    startingPrice: 350000,
    duration: "2 to 3 hours",
    image:
      "https://images.unsplash.com/photo-1785860945533-918a531bcdeb?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Brow design and mapping",
      "Numbing for comfort",
      "Hair-stroke technique",
      "Six-week top-up session",
    ],
    featured: true,
  },
  {
    id: "skin-tag-removal",
    name: "Skin tag removal",
    category: "Skin",
    description:
      "Removal of skin tags in a clean, private setting. We check the area first, explain the method and give you aftercare instructions.",
    priceRange: "₦80,000 to ₦250,000",
    startingPrice: 80000,
    duration: "30 to 60 minutes",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
    includes: [
      "Consultation and assessment",
      "One or several removals",
      "Aftercare products",
      "Follow-up check",
    ],
  },
];
