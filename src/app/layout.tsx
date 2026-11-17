import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";
import { CartProvider } from "@/lib/context/CartContext";
import { BUSINESS, SITE_URL } from "@/lib/config";

// Self-hosted OFL fonts. No Google request at build time or in the browser.
const dmSans = localFont({
  src: "./fonts/DMSans.ttf",
  variable: "--font-dm-sans",
  weight: "100 1000",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const fraunces = localFont({
  src: "./fonts/Fraunces.ttf",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BUSINESS.name} | Wigs and hair services in Lagos`,
  description:
    "Wigs, hair revamping, makeup and lashes in Lagos. See prices and appointment lengths, then book online or pay by bank transfer.",
  keywords: [
    "wigs Lagos",
    "hair revamping Lagos",
    "wig making Lagos",
    "makeup artist Lagos",
    "lash extensions Lagos",
    "microblading Lagos",
    "human hair wigs Nigeria",
    BUSINESS.city,
  ],
  openGraph: {
    url: "/",
    title: `${BUSINESS.name} | Wigs and hair services in Lagos`,
    description: BUSINESS.description,
    type: "website",
    locale: "en_NG",
    siteName: BUSINESS.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} | Wigs and hair services in Lagos`,
    description: BUSINESS.description,
  },
  alternates: { canonical: "/" },
};

// Favicon, apple-touch and OG images are supplied by the file-based
// metadata conventions: icon.svg, favicon.ico, apple-icon.png,
// opengraph-image.png and manifest.ts in this directory.
export const viewport: Viewport = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-NG"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
