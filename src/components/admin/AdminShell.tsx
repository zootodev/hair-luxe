"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Modal from "@/components/ui/Modal";
import { adminFetch } from "@/lib/admin-fetch";

interface UnsavedChangesContextValue {
  registerDirty: (owner: symbol, dirty: boolean) => void;
  unregister: (owner: symbol) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

/**
 * Register a manager's unsaved-changes state with the admin shell. The shell
 * then shows an in-app dialog before a nav pill switch and a native
 * beforeunload prompt when the tab/page is closed.
 */
export function useUnsavedChanges(dirty: boolean): void {
  const context = useContext(UnsavedChangesContext);
  const owner = useRef<symbol>(Symbol("unsaved-owner"));

  useEffect(() => {
    if (!context) return;
    const key = owner.current;
    context.registerDirty(key, dirty);
    return () => context.unregister(key);
  }, [context, dirty]);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const dirtyOwners = useRef(new Set<symbol>());
  const [dirty, setDirty] = useState(false);

  const registerDirty = useCallback((owner: symbol, value: boolean) => {
    if (value) dirtyOwners.current.add(owner);
    else dirtyOwners.current.delete(owner);
    setDirty(dirtyOwners.current.size > 0);
  }, []);

  const unregister = useCallback((owner: symbol) => {
    dirtyOwners.current.delete(owner);
    setDirty(dirtyOwners.current.size > 0);
  }, []);

  const contextValue = useMemo(
    () => ({ registerDirty, unregister }),
    [registerDirty, unregister]
  );

  // Native prompt when the tab is closed, reloaded or the URL is changed
  // outside the in-app nav (e.g. typed address).
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const navigate = (href: string) => {
    if (href === pathname) return;
    if (dirty) {
      setPendingHref(href);
      return;
    }
    router.push(href);
  };

  const handleLogout = () => {
    adminFetch("/api/admin/logout", { method: "POST" }).then(() => {
      router.push("/");
    });
  };

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      <div className="pt-24 md:pt-28 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <AdminSidebar activePath={pathname} onNavigate={navigate} onLogout={handleLogout} />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={pendingHref !== null}
        onClose={() => setPendingHref(null)}
        title="Unsaved changes"
      >
        <p className="text-sm text-muted mb-6">
          You have unsaved changes. Leave this section and lose them?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setPendingHref(null)}
            className="px-4 py-2 rounded-md text-sm font-semibold bg-surface-light text-muted hover:text-brand transition-colors cursor-pointer"
          >
            Keep editing
          </button>
          <button
            onClick={() => {
              const target = pendingHref;
              setPendingHref(null);
              dirtyOwners.current.clear();
              setDirty(false);
              if (target) router.push(target);
            }}
            className="px-4 py-2 rounded-md text-sm font-semibold text-background bg-danger hover:opacity-90 transition-opacity cursor-pointer"
          >
            Leave without saving
          </button>
        </div>
      </Modal>
    </UnsavedChangesContext.Provider>
  );
}
