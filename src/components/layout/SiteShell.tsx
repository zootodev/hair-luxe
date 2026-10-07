"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");
  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}