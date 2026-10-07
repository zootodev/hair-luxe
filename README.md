# Hair Luxe - Premium Hair Business Ecommerce Website

A modern, luxury-themed ecommerce website for a hair business with Interac e-Transfer payment and EmailJS order notifications. Rebranded from Zooto Luxe to **Hair Luxe**.

## Features

- **Services**: Hair revamping, wig making, makeup, lash extensions, microblading, skin tag removal with online booking
- **Products**: Wigs, hair bundles, lashes, hair care products with catalog filtering (`/shop`) and search
- **Product Pages**: `/shop/[slug]` with related products, SEO metadata, and canonical URLs
- **Shopping Cart**: Persistent cart with localStorage, quantity management, delivery/pickup toggling
- **Checkout**: Customer info collection, Interac e-Transfer payment instructions, server-side price validation
- **Order Confirmation**: `/order/[orderNumber]` page shown after placing an order
- **Order Emails**: Order details (including customer phone number) sent to your email via EmailJS
- **Admin Dashboard**: View and manage orders, bookings, and delivery queue
- **Design**: Luxury dark theme with gold accents, fully responsive

## Tech Stack

- Next.js 16 (App Router, Vercel serverless deployment)
- React 19
- TypeScript
- Tailwind CSS 4
- EmailJS (browser)
- localStorage persistence

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure EmailJS (for order notifications)

1. Create a free account at [emailjs.com](https://www.emailjs.com)
2. Add an **Email Service** (e.g., Gmail, Outlook) in the Email Services tab
3. Create an **Email Template** in the Templates tab
4. Copy the Service ID, Template ID, and Public Key

Update these files:

**`.env.local`** (create this file - see `.env.example`):
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
NEXT_PUBLIC_INTERAC_EMAIL=payment@yourbusiness.com
NEXT_PUBLIC_BUSINESS_EMAIL=hello@yourbusiness.com
NEXT_PUBLIC_WHATSAPP=https://wa.me/14378982207
NEXT_PUBLIC_WHATSAPP_PHONE=+1 437 898 2207
NEXT_PUBLIC_TIKTOK=https://www.tiktok.com/@yourhandle
NEXT_PUBLIC_INSTAGRAM=https://www.instagram.com/yourhandle
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
```

**`src/lib/config.ts`**:
```ts
export const PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
```

### 3. Email Template

Create an EmailJS template with these parameters (use them in the Subject/Body with the `{{param}}` syntax):

| Parameter | Description |
|-----------|-------------|
| `order_id` | Order reference # |
| `customer_name` | Customer full name |
| `customer_phone` | Customer phone number |
| `customer_email` | Customer email |
| `customer_city` | Customer city |
| `customer_address` | Delivery address |
| `delivery_method` | Delivery or Pickup |
| `delivery_zone` | Delivery zone |
| `items` | Ordered items list |
| `subtotal` | Items subtotal |
| `delivery_fee` | Delivery fee |
| `total` | Order total |
| `payment_method` | Interac e-Transfer |
| `order_date` | Order date/time |
| `notes` | Customer notes |
| `business_name` | Business name |
| `interac_email` | Interac email |

Example template body:

```
Subject: New Order {{order_id}} - {{business_name}}

Customer: {{customer_name}}
Phone: {{customer_phone}}
Email: {{customer_email}}

Items:
{{items}}

Subtotal: ${{subtotal}}
Delivery Fee: ${{delivery_fee}}
Total: ${{total}}

Delivery: {{delivery_method}} ({{delivery_zone}})
Address: {{customer_address}}, {{customer_city}}

Payment: {{payment_method}} (Sent to {{interac_email}})
```

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

### 5. Build for production

```bash
npm run build
```

This app deploys to **Vercel** (serverless). Connect the GitHub repo to Vercel and push to `main` to auto-deploy. Set all env vars above in the Vercel dashboard too.

## Business Configuration

Most business settings live in **`src/lib/config.ts`** and can be overridden with env vars (see `.env.example`):

```ts
export const BUSINESS = {
  name: "Hair Luxe",
  interacEmail: process.env.NEXT_PUBLIC_INTERAC_EMAIL ?? "payment@yourbusiness.com",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "hello@yourbusiness.com",
  tagline: "Where Luxury Meets Hair",
  secondaryTagline: "More Than Hair. It's a Lifestyle.",
  deliveryFee: 15,
};

export const DELIVERY_ZONES = [
  { name: "Toronto", fee: 10 },
  { name: "GTA", fee: 15 },
  { name: "Other Ontario", fee: 25 },
];
```

Update products in **`src/lib/data/products.ts`**, services in **`src/lib/data/services.ts`**, and the EmailJS keys in **`src/lib/config.ts`**.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── shop/                 # Product catalog + product detail (SEO)
│   ├── services/             # Services + booking + service detail
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout + Interac + email
│   ├── order/[orderNumber]/  # Order confirmation page
│   ├── track-order/          # Track order lookup
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   ├── admin/                # Order management (password protected)
│   ├── api/                  # API routes (admin login, order validation)
│   ├── sitemap.ts            # SEO sitemap
│   └── robots.ts             # SEO robots
├── components/
│   ├── layout/               # Header, Footer
│   ├── home/                 # Home sections
│   ├── products/             # Product card, shop grid
│   ├── services/             # Booking modal
│   └── ui/                   # Button, Modal
└── lib/
    ├── config.ts             # Business settings + social links
    ├── data/                 # Products & services data
    ├── context/              # Cart state
    ├── email/                # EmailJS integration
    ├── orders.ts             # localStorage order helpers
    ├── stock.ts              # Sold products tracking
    ├── rate-limit.ts         # In-memory rate limiting
    └── types/                # TypeScript types
```

## Notes

- The admin dashboard stores orders in the browser's localStorage. Data persists per-browser.
- Delivery is available across Ontario with zone-based fees (Toronto $10, GTA $15, Other Ontario $25).
- Interac e-Transfer is manually confirmed - the business owner verifies payment in their bank before processing.
- The `DELIVERY_FEE_PLACEHOLDER` value in `src/lib/config.ts` is a placeholder - replace with the business's real fees before going live.
- Demo content (products, prices, testimonials) in `src/lib/data/` serves as placeholder sample data - replace with real business content before launch.