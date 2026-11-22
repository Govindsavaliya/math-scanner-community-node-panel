import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import PageLoader from "@/components/common/PageLoader";

const COLLAPSED_KEY = "sidebar-collapsed";

const readCollapsed = () => {
  try {
    return Boolean(localStorage.getItem(COLLAPSED_KEY));
  } catch {
    return false;
  }
};

/** Shell for every admin page: sidebar, sticky header and the routed content. */
export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      if (next) localStorage.setItem(COLLAPSED_KEY, "true");
      else localStorage.removeItem(COLLAPSED_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <div className="group/layout" data-collapsed={collapsed}>
      {drawerOpen && (
        <div className="fixed inset-0 z-10 bg-black/40 xl:hidden" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      )}
      <Sidebar
        open={drawerOpen}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        onNavigate={() => setDrawerOpen(false)}
      />
      <div className="transition-[margin-left] duration-200 ease-out xl:ml-62.5 xl:group-data-[collapsed=true]/layout:ml-18">
        <Header onOpenSidebar={() => setDrawerOpen((open) => !open)} onOpenSearch={() => setPaletteOpen(true)} />
        <main className="relative mx-auto max-w-full px-4 sm:px-6 xl:px-7 py-6">
          <Suspense fallback={<PageLoader page />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
