"use client";

import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/config";
import { useCart } from "@/lib/context/CartContext";

const SERVICE_LINKS = [
  { name: "Hair revamping", slug: "hair-revamping" },
  { name: "Wig making", slug: "wig-making" },
  { name: "Makeup", slug: "makeup" },
  { name: "Lash extensions", slug: "lash-extensions" },
  { name: "Microblading", slug: "microblading" },
  { name: "Skin tag removal", slug: "skin-tag-removal" },
];

export default function Footer() {
  const { business } = useCart();
  return (
    <footer className="mt-16 border-t border-brand/20 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <span className="text-xl text-brand font-semibold tracking-tight">
                {business.name}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {business.tagline}. Pickup at the studio or delivery in Lagos and Ibadan.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg mb-4 text-brand">Services</h3>
            <ul className="space-y-2">
              {SERVICE_LINKS.map((s) => (
                <li key={s.name}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-muted hover:text-brand transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg mb-4 text-brand">Quick links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted hover:text-brand transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-muted hover:text-brand transition-colors"
                >
                  Shop products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-brand transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted hover:text-brand transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-sm text-muted hover:text-brand transition-colors">
                  Track order
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-brand transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted hover:text-brand transition-colors">
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg mb-4 text-brand">Get in touch</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-brand mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{business.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <span>{business.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{business.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
              aria-label="WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
              aria-label="TikTok"
            >
              TikTok
            </a>
            <span className="inline-flex items-center gap-1.5" title="Studio location">
              <span className="inline-block w-2 h-2 rounded-md bg-brand" aria-hidden="true" />
              Based in {business.city}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}