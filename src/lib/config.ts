export const BUSINESS = {
  name: "Hair Luxe",
  tagline: "Where Luxury Meets Hair",
  secondaryTagline: "More Than Hair. It's a Lifestyle.",
  description:
    "Premium hair services and products. Wigs, hair revamping, makeup, lashes, microblading and more - crafted with elegance.",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "ifeoluwaniolufunmilayo@gmail.com",
  phone: "(416) 555-0199",
  phoneFormatted: "416-555-0199",
  interacEmail:
    process.env.NEXT_PUBLIC_INTERAC_EMAIL || "ifeoluwaniolufunmilayo@gmail.com",
  address: "Ontario, Canada",
  city: "Ontario",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM",
  deliveryFee: 15,
  freeDeliveryOver: 250,
};

export const SOCIAL_LINKS = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "https://wa.me/14378982207",
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+1 437 898 2207",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK || "https://www.tiktok.com/@hairluxe",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://www.instagram.com/hairluxe.ca",
};

export const PUBLIC_KEY = "GeLrfdQC6goeir_m2";
export const SERVICE_ID = "service_tlbd789";
export const TEMPLATE_ID = "template_rg8t7gm";

export const DELIVERY_ZONES = [
  {
    name: "Local (Toronto)",
    zones: ["Toronto", "North York", "Scarborough", "Etobicoke", "York"],
    fee: 10,
    days: "1-2 business days",
  },
  {
    name: "GTA Region",
    zones: [
      "Mississauga",
      "Brampton",
      "Markham",
      "Richmond Hill",
      "Vaughan",
      "Ajax",
      "Pickering",
      "Whitby",
      "Oshawa",
      "Oakville",
      "Burlington",
      "Milton",
      "Caledon",
    ],
    fee: 15,
    days: "2-3 business days",
  },
  {
    name: "Other Ontario",
    zones: ["Ottawa", "Hamilton", "London", "Kitchener", "Waterloo", "Other Ontario areas"],
    fee: 25,
    days: "3-5 business days",
  },
];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zooto-luxe.vercel.app";