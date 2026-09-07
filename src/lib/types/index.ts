export type ServiceCategory =
  | "Hair Revamping"
  | "Wig Making"
  | "Makeup"
  | "Lash Extensions"
  | "Microblading"
  | "Skin Tag Removal";

export type ProductCategory = "Wigs" | "Hair Bundles" | "Lashes" | "Hair Care";

export type DeliveryMethod = "delivery" | "pickup";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  priceRange: string;
  startingPrice: number;
  duration: string;
  image: string;
  includes: string[];
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  stockCount: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  details: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: ProductCategory;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  deliveryMethod: DeliveryMethod;
  deliveryZone?: string;
  notes?: string;
}

export interface Order {
  id: string;
  customer: ContactInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: "interac" | "notification";
  paymentProof?: string;
  paymentProofName?: string;
  date: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  dateCreated: string;
}