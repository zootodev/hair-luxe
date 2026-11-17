import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-semibold text-brand tabular mb-4">404</p>
        <h1 className="font-display text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Back to home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Shop
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Track order
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-brand text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}