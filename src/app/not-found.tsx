import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-serif text-8xl font-bold text-gradient-gold mb-4">404</p>
        <h1 className="font-serif text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}