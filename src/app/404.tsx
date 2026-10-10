import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found | Hair Luxe",
  description: "The page you are looking for does not exist.",
};

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="p-8 max-w-md">
        <div className="rounded-2xl bg-surface border border-gold/20 p-8 max-w-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-2xl bg-gold/15 text-gold mb-4">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Page Not Found</h1>
          </div>
          <p className="text-muted text-lg max-w-md mx-auto">
            The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="mt-8 text-center">
            <Button href="/" size="lg" variant="gold">
              Go Home
            </Button>
            <a
              href="/shop"
              className="mt-2 inline-flex items-center gap-2 text-sm text-gold hover:text-gold/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 8l2-2M5 13l2-2m0 8l2-2M9 5l2-2m0 8l2-2M13 9l2-2m0 8l2-2M17 5l2-2m0 8l2-2" />
              </svg>
              Shop Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}