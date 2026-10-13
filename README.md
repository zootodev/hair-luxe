# Hair Luxe - Premium Hair Business Ecommerce Website

**Hair Luxe** is a modern, luxury-themed ecommerce website for a hair business, rebuilt from Zooto Luxe with a Nigerian focus. Live at: https://hair-luxe-28n0ri27g-zootodev.vercel.app

## 🎯 Overview

Hair Luxe offers premium hair services and products including wigs, hair revamping, makeup, lash extensions, microblading, and skin tag removal. The site features a fully responsive design with a luxury dark theme and gold accents, optimized for customers across Nigeria and Africa.

## 🌟 Features (Proud Of)

- **Server-side price validation** - All prices are validated in NGN (Nigerian Naira) using `formatPrice()` with `Intl.NumberFormat("en-NG", { currency: "NGN" })` - no dollar signs, no discrepancies between client and server
- **Admin authentication hardening** - HMAC-signed session tokens with 12-hour TTL, CSRF protection on all admin routes, timing-safe password comparison - the admin dashboard is secure by default
- **Rate limiting** - 8 orders per 60 minutes per IP, and 8 admin login attempts per 60 minutes - protects against abuse
- **Bank transfer only** - Interac e-Transfer has been fully refactored out; checkout uses GTBank Nigeria bank transfer with placeholder account details (0123456789) for demo purposes
- **Nigeria-focused localization** - Phone format +234, city Lagos, NGN currency, 6 Nigerian state testimonials (Lagos, Abuja, Kano, Ibadan, Port Harcourt, Benin City)
- **Persistent order storage** - Supabase Postgres integration keeps orders and bookings across browser visits and redeploys (set `DATABASE_URL` env var)
- **Email notifications** - Order details sent via EmailJS (configure your `NEXT_PUBLIC_EMAILJS_SERVICE_ID` and `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`)
- **Responsive admin dashboard** - Full order management, bookings, deliveries, CSV export, customer email, and product/catalog management

## 📸 Screenshots

_(Add screenshots of the checkout page, admin dashboard, and product pages here)_

## 🛠️ Tech Stack

- **Next.js 16** with App Router and Turbopack build
- **React** for interactive UI
- **EmailJS** for order notification emails
- **Supabase Postgres** for persistent order/booking storage (optional - set `DATABASE_URL`)
- **Vercel** for deployment and edge functions
- **TypeScript** for type safety (0 errors on `tsc --noEmit`)
- **ESLint** for code quality

## 🚀 Quick Start

1. Clone the repo: `git clone https://github.com/zootodev/hair-luxe.git`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the values:
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID` and `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` (from EmailJS dashboard)
   - `ADMIN_PASSWORD=hairluxe-demo` (or set your own secure password)
   - `DATABASE_URL` (Supabase Postgres URL, optional for demo mode)
   - `NEXT_PUBLIC_BUSINESS_EMAIL`, `NEXT_PUBLIC_WHATSAPP`, etc.
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production (`next build`) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` to verify 0 TypeScript errors |

## 🔐 Demo Login

**Read-only admin access** is available for reviewers:

- **URL:** `/admin`
- **Password:** `hairluxe-demo`
- **Features:** View orders, bookings, and deliveries without ability to modify data
- **Note:** Credentials are in the README and `.env.example` for security reviewers

## 📁 Key Files

- `src/lib/config.ts` - Business configuration (bank details, contact info, delivery zones)
- `src/lib/orders-server.ts` - Server-side order creation with validation and stock checks
- `src/lib/admin-auth.ts` - HMAC-signed token system (createSessionToken, verifySessionToken)
- `src/lib/admin-session.ts` - Session verification for admin route protection
- `src/app/checkout/page.tsx` - Full bank-transfer checkout flow with validation
- `src/lib/store.ts` - Order/booking/sold storage with Supabase/Postgres fallback
- `src/components/home/Testimonials.tsx` - 6 testimonials from Nigerian states
- `src/components/admin/ProductsManager.tsx` - Admin product management (dollar signs removed from labels)

## 🚧 Known & Planned

- **Demo mode:** Set `ADMIN_PASSWORD=hairluxe-demo` to enable read-only admin access
- **Persistent storage:** Set `DATABASE_URL=postgresql://...` (Supabase) to persist orders across visits
- **Email setup:** Add your EmailJS service ID and template ID to enable order notifications
- **Sold counts:** Moving sold counts from browser to database for consistency (tracked via `DATABASE_URL`)

## 📄 License

MIT - built with ❤️ for the Hair Luxe business.