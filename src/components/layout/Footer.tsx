import Link from "next/link";
import { BUSINESS } from "@/lib/config";

const SERVICE_LINKS = [
  "Hair Revamping",
  "Wig Making",
  "Makeup",
  "Lash Extensions",
  "Microblading",
  "Skin Tag Removal",
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gold/20 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold">
                HL
              </span>
              <span className="font-serif text-xl tracking-wide text-gradient-gold font-semibold">
                {BUSINESS.name}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Where luxury meets hair. Premium services and products crafted with elegance for
              beauty that speaks for itself.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-gold">Services</h3>
            <ul className="space-y-2">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-sm text-muted hover:text-gold transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  Shop Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-muted hover:text-gold transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-gold">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{BUSINESS.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <span>{BUSINESS.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <span>{BUSINESS.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />{" "}
            {BUSINESS.instagram}
          </p>
        </div>
      </div>
    </footer>
  );
}