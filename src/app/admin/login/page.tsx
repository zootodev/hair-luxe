"use client";

import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      const next = new URLSearchParams(window.location.search).get("next");
      const target =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
      window.location.assign(target);
    } catch (err) {
      clearTimeout(timeout);
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "Sign in timed out. Please check your connection and try again."
          : "Network error. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 md:pt-28 pb-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-surface border border-surface-light p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background font-serif font-bold text-xl">
              HL
            </div>
            <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-1">
              Private Dashboard
            </p>
            <h1 className="font-serif text-2xl font-bold">Admin Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-xs text-muted uppercase tracking-wide mb-2"
              >
                Password
              </label>
              <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
                required
                className="w-full h-12 rounded-xl bg-background border border-surface-light pl-4 pr-12 text-sm focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-muted hover:text-gold focus-visible:text-gold transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={e => setShowPassword(prev => !prev)}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0M12 22c1.103 0 2-.897 2-2v-6.375c.371-1.55 1.538-2.648 3.117-2.153v5.85h2.075v-5.85c1.579.504 3.156.058 3.117-2.153v-5.85h-2.075v5.85z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}