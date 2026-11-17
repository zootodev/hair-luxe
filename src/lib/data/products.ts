import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "fr-wig-royal",
    name: "Lace front wig, straight",
    category: "Wigs",
    description:
      "100% virgin human hair lace front wig with a 5x5 closure. The hairline is pre-plucked, so it is ready to wear.",
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
      "100% unprocessed virgin human hair",
      "Natural pre-plucked hairline with baby hairs",
      "Can be bleached, dyed, curled or straightened",
      "Skin-Friendly transparent HD lace",
      "Approximately 22 inches in length",
    ],
  },
  {
    id: "fl-wig-silk",
    name: "Full lace wig, body wave",
    category: "Wigs",
    description:
      "Full lace human hair wig that can be parted in any direction. The cap is light and has adjustable straps.",
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
      "360 lace for unlimited parting options",
      "100% virgin hair, soft and tangle-free",
      "Comfortable breathable cap",
      "Adjustable straps for secure fit",
      "24 inches - shoulder length style",
    ],
  },
  {
    id: "closure-wig-goddess",
    name: "Braid wig",
    category: "Wigs",
    description:
      "Pre-styled braided wig with a natural-looking hairline. Ready to wear, with no install appointment needed.",
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
    details: [
      "Handmade braided wig",
      "Natural-looking with a realistic hairline",
      "Ready to wear - no combing needed",
      "Lightweight and breathable cap",
      "Available in multiple lengths",
    ],
  },
  {
    id: "bundle-seamless-wave",
    name: "Ocean Body Wave Bundles (3x8oz)",
    category: "Hair Bundles",
    description:
      "Three body wave bundles for sew-ins and crochet styles. The hair is full, holds a curl and sheds very little.",
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
      "100% virgin Brazilian human hair",
      "3 bundles of 8oz each (24 inches)",
      "Swiss quality body wave pattern",
      "Zero shedding and tangle-free",
      "Can be dyed and heat styled",
    ],
  },
  {
    id: "bundle-straight-silk",
    name: "Silk Straight Bundles (4x4)",
    category: "Hair Bundles",
    description:
      "Four straight bundles with a double weft for a fuller sew-in. The hair is soft and holds a smooth finish.",
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
      "100% virgin Peruvian human hair",
      "4 bundles of 4oz each",
      "Sleek silk straight texture",
      "Double wefted for thickness",
      "Great for advanced sew-in styles",
    ],
  },
  {
    id: "bundle-highlight-ginger",
    name: "Ginger Blonde Highlight Bundles",
    category: "Hair Bundles",
    description:
      "Ginger blonde bundles in three lengths. The colour adds dimension to a sew-in or wig.",
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
      "Blond-highlighted virgin hair",
      "3 bundles set (16, 18, 20 inches)",
      "Long-lasting color treatment",
      "Low shedding",
      "Suits event styling",
    ],
  },
  {
    id: "lash-volume-mink",
    name: "Mink Volume Lash Kit",
    category: "Lashes",
    description:
      "Faux mink lash kit with ten lengths so you can build a natural or fuller lash line. Reusable and cruelty-free.",
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
      "Faux mink lashes",
      "10 individual diameters & lengths",
      "Reusable up to 20 times",
      "Cruelty-free and hypoallergenic",
      "Includes lash applicator & glue",
    ],
  },
  {
    id: "lash-strip-glam",
    name: "Strip lashes (5 pairs)",
    category: "Lashes",
    description:
      "Five pairs of wispy strip lashes with a flexible band, for events or everyday wear.",
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
      "Wispy style",
      "Comfortable flexible band",
      "Reusable multiple times",
      "Lightweight and natural",
      "Suitable for salon use",
    ],
  },
  {
    id: "care-edge-control",
    name: "Edge control gel",
    category: "Hair Care",
    description:
      "Strong-hold edge gel that smooths edges without flaking or leaving a white residue.",
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
      "24-hour strong hold",
      "No flaking or white residue",
      "Moisturizing formula with argan oil",
      "Smooths edges quickly",
      "100ml jar",
    ],
  },
  {
    id: "care-brand-oil",
    name: "Growth serum oil",
    category: "Hair Care",
    description:
      "Scalp oil with biotin, castor oil and rosemary, for hair that looks fuller and feels conditioned.",
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
      "Massaged into the scalp",
      "Strengthens roots & reduces breakage",
      "Adds natural shine",
      "60ml bottle",
    ],
  },
  {
    id: "care-revive-shampoo",
    name: "Revive + Repair Shampoo",
    category: "Hair Care",
    description:
      "Sulfate-free shampoo that cleanses while restoring moisture balance. Safe for colored and chemically treated hair.",
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
      "Sulfate & paraben free",
      "Deeply hydrating formula",
      "Safe for keratin treatments",
      "Restores natural shine",
      "350ml bottle",
    ],
  },
  {
    id: "care-silk-scarf",
    name: "Silk Bonnet Scarf Set",
    category: "Hair Care",
    description:
      "100% mulberry silk bonnet and scrunchie set. Protects hair overnight while sleeping to prevent breakage and preserve style.",
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
      "100% mulberry silk construction",
      "Reduces friction and breakage",
      "Adjustable elastic band",
      "Gentle on edges & curls",
      "Includes matching scrunchie",
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
