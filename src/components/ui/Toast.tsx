"use client";

import { useEffect } from "react";

export interface ToastProps {
  message: string;
  variant?: "success" | "error";
  onDismiss: () => void;
  /** Auto-dismiss delay in ms (0 keeps it until dismissed). */
  duration?: number;
}

/**
 * Lightweight transient toast. role="status" announces the message to
 * screen readers without stealing focus.
 */
export default function Toast({
  message,
  variant = "success",
  onDismiss,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold shadow-2xl shadow-black/50 backdrop-blur-sm ${
        variant === "error"
          ? "bg-red-500/15 border-red-500/40 text-red-300"
          : "bg-surface border-gold/40 text-gold"
      }`}
    >
      {variant === "success" ? (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-1 text-muted hover:text-current transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
