import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/context/CartContext";
import { BUSINESS } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${BUSINESS.name} | Premium Hair Services & Luxury Wigs`,
  description:
    `${BUSINESS.description} Wigs, hair revamping, makeup, lash extensions, microblading and skin tag removal in ${BUSINESS.city}. Order online with easy Interac e-Transfer payment.`,
  keywords: [
    "hair luxury",
    "hair revamping",
    "wig making",
    "makeup artist",
    "lash extensions",
    "microblading",
    "skin tag removal",
    "human hair wigs",
    "hair bundles",
    BUSINESS.city,
  ],
  openGraph: {
    title: `${BUSINESS.name} | Premium Hair Services & Luxury Wigs`,
    description: BUSINESS.description,
    type: "website",
    locale: "en_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}