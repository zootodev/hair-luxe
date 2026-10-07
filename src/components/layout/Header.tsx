"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { BUSINESS } from "@/lib/config";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, announcement } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState<{ open: boolean; path: string }>({
    open: false,
    path: "",
  });
  const mobileOpen = mobileNav.open && mobileNav.path === pathname;
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-md border-b border-gold/20 shadow-lg shadow-black/40"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      {announcement.enabled && announcement.text && (
        <div className="bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-center text-xs font-semibold py-2 px-4">
          {announcement.text}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif text-xl font-bold shadow-lg shadow-gold/20">
              HL
            </span>
            <span className="font-serif text-2xl md:text-3xl tracking-wide text-gradient-gold font-semibold">
              {BUSINESS.name.split(" ")[0]}
              <span className="text-foreground"> {BUSINESS.name.split(" ")[1]}</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors hover:text-gold ${
                    active
                      ? "text-gold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-gold"
                      : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </button>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
              aria-label="Shopping cart"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-background text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/services"
              className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-gold/20"
            >
              Book Now
            </Link>

            <button
              onClick={() => setMobileNav((v) => ({ open: !v.open, path: pathname }))}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 text-gold"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-16 6h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <form
          onSubmit={submitSearch}
          className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3"
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wigs, bundles, lashes..."
              className="w-full h-11 rounded-full bg-surface border border-gold/30 pl-11 pr-4 text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </form>
      )}

      {mobileOpen && (
        <nav className="md:hidden bg-background/98 backdrop-blur-md border-t border-gold/20 px-4 pb-6 pt-2">
          <form onSubmit={submitSearch} className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-11 rounded-full bg-surface-light border border-surface-light pl-10 pr-4 text-sm focus:border-gold focus:outline-none"
            />
          </form>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                    active
                      ? "bg-gold/10 text-gold"
                      : "text-foreground/80 hover:bg-gold/5 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/track-order"
              className="px-4 py-3 rounded-lg text-sm font-medium tracking-wide text-foreground/80 hover:bg-gold/5 hover:text-gold transition-colors"
            >
              Track Order
            </Link>
            <Link
              href="/services"
              className="mt-3 inline-flex items-center justify-center h-11 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background text-sm font-semibold"
            >
              Book Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}