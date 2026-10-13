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
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
                required
                className="w-full h-12 rounded-xl bg-background border border-surface-light px-4 text-sm focus:border-gold focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted cursor-pointer hover:text-gold transition-colors" onClick={e => setShowPassword(prev => !prev)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.053 10.053 0 0112 19c-2.875 0-5.328-.6-7.125-1.5M9.954 5.308a9.973 9.973 0 0114.72 0 9.973 9.973 0 01-9.972 9.93M5.338 7.313a7.962 7.962 0 017.73-5.397 7.962 7.962 0 00-7.73 5.397zm0 0a4.99 4.99 0 014.995 4.994H4.343a4.99 4.99 0 01-4.995-4.994z" />
                </svg>
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