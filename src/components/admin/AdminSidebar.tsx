"use client";

import type { ReactNode } from "react";

export type AdminView = "dashboard" | "products" | "services" | "settings";

interface AdminSidebarProps {
  active: AdminView;
  onChange: (view: AdminView) => void;
  onLogout: () => void;
}

const NAV: { key: AdminView; label: string; icon: ReactNode }[] = [
  {
    key: "dashboard",
    label: "Orders & Bookings",
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
  {
    key: "products",
    label: "Products",
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
  },
  {
    key: "services",
    label: "Services",
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ active, onChange, onLogout }: AdminSidebarProps) {
  return (
    <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-28 h-fit">
      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full lg:rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              active === item.key
                ? "bg-gradient-to-r from-gold-light via-gold to-gold-dark text-background shadow-lg shadow-gold/20"
                : "bg-surface border border-surface-light text-muted hover:text-gold hover:border-gold/40"
            }`}
          >
            <span className="w-4.5 h-4.5">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full lg:rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors whitespace-nowrap ml-auto lg:ml-0 lg:mt-2 cursor-pointer"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          Log out
        </button>
      </nav>
    </aside>
  );
}