import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "fr-wig-royal",
    name: "Royal Glam Lace Front Wig",
    category: "Wigs",
    description:
      "Premium 100% virgin human hair lace front wig with 5x5 closure. Pre-plucked hairline for a natural, undetectable finish.",
    price: 250,
    compareAtPrice: 320,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 8,
    rating: 4.9,
    reviewCount: 42,
    featured: true,
    details: [
      "100% unprocessed virgin human hair",
      "Natural pre-plucked hairline with baby hairs",
      "Can be bleached, dyed, curled or straightened",
      "Aller-Friendly transparent HD lace",
      "Approximately 22 inches in length",
    ],
  },
  {
    id: "fl-wig-silk",
    name: "Silken Diva Full Lace Wig",
    category: "Wigs",
    description:
      "360-degree full lace human hair wig offering natural parting from every angle. Lightweight construction with maximum comfort.",
    price: 350,
    compareAtPrice: 420,
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 5,
    rating: 4.8,
    reviewCount: 28,
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
    name: "Goddess Braid Wig",
    category: "Wigs",
    description:
      "Luxurious goddess braids wig with natural-looking roots. Pre-styled and ready to wear - zero install time.",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 12,
    rating: 4.7,
    reviewCount: 19,
    details: [
      "Handmade Goddess crochet braids",
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
      "Lush body wave bundles in a 3-piece set. Thick, full and bouncy with minimal shedding. Perfect for sew-ins or crochet styles.",
    price: 200,
    compareAtPrice: 260,
    image:
      "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 15,
    rating: 4.9,
    reviewCount: 56,
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
      "Buttery silk straight bundles for ice-cold sleek looks. 4-piece set with double weft for extra fullness.",
    price: 280,
    compareAtPrice: 350,
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
      "Trending ginger blonde bundles with premium color. Dimension and vibrancy for eye-catching looks.",
    price: 230,
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 10,
    rating: 4.6,
    reviewCount: 22,
    details: [
      "Premium blond-highlighted virgin hair",
      "3 bundles set (16, 18, 20 inches)",
      "Long-lasting color treatment",
      "Minimal shedding guaranteed",
      "Perfect for festive looks",
    ],
  },
  {
    id: "lash-volume-mink",
    name: "Mink Volume Lash Kit",
    category: "Lashes",
    description:
      "Professional mink volume lash kit with 10 different lengths. Reusable and cruelty-free for stunning statement eyes.",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1588515724527-074a7f566168?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588515724527-074a7f566168?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 30,
    rating: 4.7,
    reviewCount: 38,
    featured: true,
    details: [
      "Premium faux mink lashes",
      "10 individual diameters & lengths",
      "Reusable up to 20 times",
      "Cruelty-free and hypoallergenic",
      "Includes lash applicator & glue",
    ],
  },
  {
    id: "lash-strip-glam",
    name: "Glamour Strip Lashes (5 Pack)",
    category: "Lashes",
    description:
      "Wispy glamour strip lashes perfect for events and photoshoots. 5 pairs with band flexibility for polished everyday wear.",
    price: 25,
    compareAtPrice: 35,
    image:
      "https://images.unsplash.com/photo-1631214496147-fe90620e7e48?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631214496147-fe90620e7e48?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 45,
    rating: 4.5,
    reviewCount: 51,
    details: [
      "Whispy glamour style",
      "Comfortable flexible band",
      "Reusable multiple times",
      "Lightweight and natural",
      "Perfect for professional use",
    ],
  },
  {
    id: "care-edge-control",
    name: "Royal Edge Control Gel",
    category: "Hair Care",
    description:
      "Strong-hold edge control finished with a luxurious shine. Lays edges flat and smooth without flaking.",
    price: 18,
    compareAtPrice: 24,
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
      "100ml premium jar",
    ],
  },
  {
    id: "care-gold-oil",
    name: "Luxe Growth Serum Oil",
    category: "Hair Care",
    description:
      "Nourishing hair growth serum with biotin, castor oil and rosemary. Promotes healthy, thicker-looking hair.",
    price: 32,
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
      "Clinically proven ingredients",
      "Stimulates hair follicles",
      "Strengthens roots & reduces breakage",
      "Adds natural shine",
      "60ml premium bottle",
    ],
  },
  {
    id: "care-revive-shampoo",
    name: "Revive + Repair Shampoo",
    category: "Hair Care",
    description:
      "Sulfate-free shampoo that cleanses while restoring moisture balance. Safe for colored and chemically treated hair.",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1600455736745-879d5ceed324?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600455736745-879d5ceed324?q=80&w=1200&auto=format&fit=crop",
    ],
    stockCount: 50,
    rating: 4.6,
    reviewCount: 29,
    details: [
      "Sulfate & paraben free",
      "Deeply hydrating formula",
      "Safe for keratin treatments",
      "Restores natural shine",
      "350ml premium bottle",
    ],
  },
  {
    id: "care-silk-scarf",
    name: "Silk Bonnet Scarf Set",
    category: "Hair Care",
    description:
      "100% mulberry silk bonnet and scrunchie set. Protects hair overnight while sleeping to prevent breakage and preserve style.",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
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

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}