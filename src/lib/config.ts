export const BUSINESS = {
  name: "Hair Luxe",
  tagline: "Where Luxury Meets Hair",
  secondaryTagline: "More Than Hair. It's a Lifestyle.",
  description:
    "Premium hair services and products. Wigs, hair revamping, makeup, lashes, microblading and more - crafted with elegance.",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "ifeoluwaniolufunmilayo@gmail.com",
  phone: "+234 812 345 6789",
  phoneFormatted: "+2348123456789",
  bankDetails: {
    bankName: "GTBank",
    accountName: "Hair Luxe",
    accountNumber: "0123456789",
  },
  address: "Lagos, Nigeria",
  city: "Lagos",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM",
  deliveryFee: 9000,
  freeDeliveryOver: 150000,
};

export const SOCIAL_LINKS = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "https://wa.me/2348123456789",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+234 812 345 6789",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK || "https://www.tiktok.com/@hairluxe",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://www.instagram.com/hairluxe",
};

export const PUBLIC_KEY = "GeLrfdQC6goeir_m2";
export const SERVICE_ID = "service_tlbd789";
export const TEMPLATE_ID = "template_rg8t7gm";

export const DELIVERY_ZONES = [
  {
    name: "Lagos Island",
    zones: [
      "Lekki Phase 1",
      "Victoria Island",
      "Ikoyi",
      "Oniru",
      "Banana Island",
      "Chevron",
      "Lagos Island",
    ],
    fee: 6000,
    days: "1-2 business days",
  },
  {
    name: "Lagos Mainland",
    zones: [
      "Ikeja",
      "Yaba",
      "Surulere",
      "Gbagada",
      "Ojota",
      "Ilupeju",
      "Apapa",
      "Ogba",
    ],
    fee: 9000,
    days: "2-3 business days",
  },
  {
    name: "Greater Lagos",
    zones: [
      "Ajah",
      "Sangotedo",
      "Badore",
      "Ikorodu",
      "Epe",
      "Badagry",
      "Other Lagos areas",
    ],
    fee: 15000,
    days: "3-5 business days",
  },
];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zooto-luxe.vercel.app";