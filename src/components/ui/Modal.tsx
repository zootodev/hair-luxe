"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const wasOpen = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) {
      wasOpen.current = false;
      return;
    }
    const justOpened = !wasOpen.current;
    wasOpen.current = true;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    if (justOpened) {
      focusTimer = setTimeout(() => {
        panelRef.current?.querySelector<HTMLElement>(
          'button[aria-label="Close"], input, select, textarea, a[href]'
        )?.focus();
      }, 0);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      if (focusTimer !== undefined) clearTimeout(focusTimer);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-gold/20 shadow-2xl shadow-black/60 gold-border-gradient"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
          {title && (
            <h3 id={titleId} className="font-serif text-xl text-gold">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-gold hover:bg-gold/10 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}