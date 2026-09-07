# Hair Luxe - Premium Hair Business Ecommerce Website

A modern, luxury-themed ecommerce website for a hair business with Interac e-Transfer payment and EmailJS order notifications.

## Features

- **Services**: Hair revamping, wig making, makeup, lash extensions, microblading, skin tag removal with online booking
- **Products**: Wigs, hair bundles, lashes, hair care products with catalog filtering and search
- **Shopping Cart**: Persistent cart with localStorage, quantity management, delivery/pickup toggling
- **Checkout**: Customer info collection with Interac e-Transfer payment instructions
- **Order Emails**: Order details (including customer phone number) sent to your email via EmailJS
- **Admin Dashboard**: View and manage orders, bookings, and delivery queue
- **Design**: Luxury dark theme with gold accents, fully responsive

## Tech Stack

- Next.js 16 (App Router, static export)
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

**`.env.local`** (create this file):
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
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

The static site is exported to the `out/` folder. Upload this folder to your traditional hosting (GoDaddy, Hostinger, etc.) via FTP.

## Business Configuration

All business settings live in **`src/lib/config.ts`**:

```ts
export const BUSINESS = {
  name: "Hair Luxe",
  email: "ifeoluwaniolufunmilayo@gmail.com",      // your business email
  phone: "(416) 555-0199",                          // your phone
  interacEmail: "ifeoluwaniolufunmilayo@gmail.com", // Interac e-Transfer recipient
  deliveryFee: 15,
  freeDeliveryOver: 250,
};
```

Update products in **`src/lib/data/products.ts`** and services in **`src/lib/data/services.ts`**.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── services/             # Services + booking
│   ├── products/             # Product catalog + detail
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout + Interac + email
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   └── admin/                # Order management
├── components/
│   ├── layout/               # Header, Footer
│   ├── home/                 # Home sections
│   ├── products/             # Product card
│   └── ui/                   # Button, Modal
└── lib/
    ├── config.ts             # Business settings
    ├── data/                 # Products & services data
    ├── context/              # Cart state
    ├── email/                # EmailJS integration
    ├── orders.ts             # localStorage order helpers
    └── types/                # TypeScript types
```

## Notes

- The admin dashboard stores orders in the browser's localStorage. On traditional hosting, order data persists per-browser.
- Delivery is available across Ontario with zone-based fees (Toronto $10, GTA $15, Other Ontario $25).
- Interac e-Transfer is manually confirmed - the business owner verifies payment in their bank before processing.