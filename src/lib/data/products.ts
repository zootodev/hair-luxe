import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "fr-wig-royal",
    name: "Lace Front Wig, Straight",
    category: "Wigs",
    description:
      "Straight human hair wig with a 5x5 lace closure and a pre-plucked hairline. It is 22 inches long and has adjustable straps inside the cap. Use heat protectant when styling and store it on a wig stand.",
    price: 250000,
    compareAtPrice: 320000,
    image:
      "https://images.unsplash.com/photo-1650649016849-00938690600c?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1650649016849-00938690600c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613730318129-bf0ca2a12364?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 8,
    rating: 4.9,
    reviewCount: 42,
    colors: ["Natural Black", "Dark Brown"],
    lengths: ["22 inches"],
    featured: true,
    details: [
      "Straight human hair, 22 inches",
      "5x5 lace closure with a pre-plucked hairline",
      "Adjustable straps inside the cap",
      "Can be dyed or heat-styled by a professional",
      "Store on a wig stand and detangle gently",
    ],
  },
  {
    id: "fl-wig-silk",
    name: "Full Lace Wig, Body Wave",
    category: "Wigs",
    description:
      "Body-wave human hair wig with a full lace cap that can be parted in any direction. It is 24 inches long and has adjustable straps. Detangle with a wide-tooth comb and keep it on a stand when you are not wearing it.",
    price: 350000,
    compareAtPrice: 420000,
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 5,
    rating: 4.8,
    reviewCount: 28,
    colors: ["Natural Black", "Off Black"],
    lengths: ["24 inches"],
    featured: true,
    details: [
      "Body-wave human hair, 24 inches",
      "Full lace cap, can be parted in any direction",
      "Adjustable straps for fit",
      "Breathable cap",
      "Detangle with a wide-tooth comb and store on a stand",
    ],
  },
  {
    id: "closure-wig-goddess",
    name: "Braid Wig",
    category: "Wigs",
    description:
      "Hand-braided wig with a natural-looking hairline and a lightweight cap. It is available in 16, 20 and 24 inches, and it is ready to wear without an install appointment. Store it flat and wipe the hairline with a soft cloth.",
    price: 180000,
    image:
      "https://plus.unsplash.com/premium_photo-1683140447258-d5b56eafa1ea?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://plus.unsplash.com/premium_photo-1683140447258-d5b56eafa1ea?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 12,
    rating: 4.7,
    reviewCount: 19,
    colors: ["Natural Black", "Dark Brown", "Honey Blonde"],
    lengths: ["16 inches", "20 inches", "24 inches"],
    lengthPrices: {
      "16 inches": 180000,
      "20 inches": 205000,
      "24 inches": 230000,
    },
    details: [
      "Hand-braided wig",
      "Natural-looking hairline",
      "Lightweight breathable cap",
      "Ready to wear; no install appointment",
      "Store flat and wipe the hairline with a soft cloth",
    ],
  },
  {
    id: "bundle-seamless-wave",
    name: "Ocean Body Wave Bundles (3x8oz)",
    category: "Hair Bundles",
    description:
      "Three body-wave bundles, 8oz each and 24 inches long, for sew-ins and crochet styles. The hair has a double weft. Wash it with a sulfate-free shampoo, condition, and let it air-dry.",
    price: 200000,
    compareAtPrice: 260000,
    image:
      "https://images.unsplash.com/photo-1588527962980-72746d95973e?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588527962980-72746d95973e?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 15,
    rating: 4.9,
    reviewCount: 56,
    lengths: ["24 inches"],
    featured: true,
    details: [
      "Body-wave hair, 24 inches",
      "3 bundles, 8oz each",
      "Double weft",
      "Can be dyed and heat-styled",
      "Wash with sulfate-free shampoo and air-dry",
    ],
  },
  {
    id: "bundle-straight-silk",
    name: "Silk Straight Bundles (4x4)",
    category: "Hair Bundles",
    description:
      "Four straight bundles, 4oz each and 24 inches long, with a double weft for a fuller sew-in. Wash with a sulfate-free shampoo, condition, and let the hair air-dry.",
    price: 280000,
    compareAtPrice: 350000,
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 6,
    rating: 4.8,
    reviewCount: 31,
    details: [
      "Straight hair, 24 inches",
      "4 bundles, 4oz each",
      "Double weft",
      "Suits sew-in styles",
      "Wash with sulfate-free shampoo and air-dry",
    ],
  },
  {
    id: "bundle-highlight-ginger",
    name: "Ginger Blonde Highlight Bundles",
    category: "Hair Bundles",
    description:
      "Three ginger-blonde bundles in 16, 18 and 20 inches, ready for a sew-in or wig. The colour is already applied. Use a colour-safe shampoo and keep heat low when styling.",
    price: 230000,
    image:
      "https://images.unsplash.com/photo-1607093699882-27ca1cb89a3b?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607093699882-27ca1cb89a3b?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 10,
    rating: 4.6,
    reviewCount: 22,
    colors: ["Ginger Blonde"],
    lengths: ["16 inches", "18 inches", "20 inches"],
    details: [
      "Ginger-blonde hair",
      "3 bundles: 16, 18 and 20 inches",
      "Colour already applied",
      "Use colour-safe shampoo",
      "Keep heat low when styling",
    ],
  },
  {
    id: "lash-volume-mink",
    name: "Mink Volume Lash Kit",
    category: "Lashes",
    description:
      "Faux-mink lash clusters in ten lengths, with an applicator and glue. The lashes are reusable. Clean them after each wear and store them in the tray.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1639629509821-c54cdd984227?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1639629509821-c54cdd984227?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 30,
    rating: 4.7,
    reviewCount: 38,
    featured: true,
    details: [
      "Faux-mink lash clusters",
      "10 lengths",
      "Reusable",
      "Includes applicator and glue",
      "Clean after each wear and store in the tray",
    ],
  },
  {
    id: "lash-strip-glam",
    name: "Strip Lashes (5 Pairs)",
    category: "Lashes",
    description:
      "Five pairs of wispy strip lashes with a flexible band. Apply with lash glue, remove them before sleeping, and clean the band after each wear.",
    price: 25000,
    compareAtPrice: 35000,
    image:
      "https://images.unsplash.com/photo-1715195060250-b321e5cd5171?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1715195060250-b321e5cd5171?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 45,
    rating: 4.5,
    reviewCount: 51,
    details: [
      "5 pairs of strip lashes",
      "Wispy style",
      "Flexible band",
      "Apply with lash glue",
      "Remove before sleeping and clean after each wear",
    ],
  },
  {
    id: "care-edge-control",
    name: "Edge Control Gel",
    category: "Hair Care",
    description:
      "Strong-hold edge gel in a 100ml jar. Apply a small amount with an edge brush to smooth your edges, then close the jar.",
    price: 18000,
    compareAtPrice: 24000,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 60,
    rating: 4.8,
    reviewCount: 73,
    details: [
      "100ml jar",
      "Strong hold",
      "Apply with an edge brush",
      "Close the jar after use",
      "Wipe the rim clean",
    ],
  },
  {
    id: "care-brand-oil",
    name: "Growth Serum Oil",
    category: "Hair Care",
    description:
      "Scalp oil with biotin, castor oil and rosemary in a 60ml bottle. Massage a small amount into the scalp. Keep it out of your eyes and store it away from sunlight.",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 38,
    rating: 4.7,
    reviewCount: 44,
    featured: true,
    details: [
      "Biotin, castor oil and rosemary",
      "60ml bottle",
      "Massage into the scalp",
      "Avoid contact with eyes",
      "Store away from sunlight",
    ],
  },
  {
    id: "care-revive-shampoo",
    name: "Revive + Repair Shampoo",
    category: "Hair Care",
    description:
      "Sulfate-free shampoo for coloured and chemically treated hair. The bottle is 350ml. Massage it into wet hair, rinse, then follow with conditioner.",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 50,
    rating: 4.6,
    reviewCount: 29,
    details: [
      "350ml bottle",
      "Sulfate-free",
      "For coloured and chemically treated hair",
      "Massage into wet hair and rinse",
      "Follow with conditioner",
    ],
  },
  {
    id: "care-silk-scarf",
    name: "Silk Bonnet Scarf Set",
    category: "Hair Care",
    description:
      "A mulberry silk bonnet and matching scrunchie. The bonnet has an adjustable elastic band. Hand-wash both pieces in cool water and let them air-dry.",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1661879206759-465a93950df5?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1661879206759-465a93950df5?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 40,
    rating: 4.9,
    reviewCount: 25,
    details: [
      "Mulberry silk bonnet",
      "Matching scrunchie",
      "Adjustable elastic band",
      "Hand-wash in cool water",
      "Air-dry",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.id === slug || p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

const priceFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}
