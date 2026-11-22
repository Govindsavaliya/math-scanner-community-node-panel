import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Dropdown, Icon } from "@/components/ui";
import Avatar from "@/components/common/Avatar";
import ThemeToggle from "@/components/common/ThemeToggle";
import { confirmAction } from "@/components/common/confirmDelete";
import Crumbs from "./Crumbs";
import { clearToken } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { paths } from "@/app/router/paths";

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function Header({ onOpenSidebar, onOpenSearch }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    const ok = await confirmAction({
      title: "Log out?",
      message: "You will need to sign in again to access the admin panel.",
      confirmButtonText: "Log out",
    });
    if (!ok) return;
    clearToken();
    queryClient.clear();
    notify.success("Logout SuccessFully");
    navigate(paths.login);
  };

  return (
    <header className="sticky top-0 z-9 flex h-16 items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6 xl:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Toggle navigation menu"
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:bg-surface-2 xl:hidden"
        >
          <Icon name="menu" size={18} />
        </button>
        <Link to={paths.home} className="xl:hidden" aria-label="Math Scanner home">
          <img
            src="/logo/appicon.png"
            alt="Math Scanner logo"
            className="size-8 rounded-lg border border-line"
          />
        </Link>
        <Crumbs />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search pages"
          className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface-2/60 px-3 text-[13px] text-muted transition-colors hover:bg-surface-2 hover:text-ink md:w-60"
        >
          <Icon name="search" size={16} className="shrink-0" />
          <span className="hidden flex-1 text-left md:block">Search...</span>
          <kbd className="hidden rounded-md border border-line bg-surface px-1.5 py-0.5 text-[11px] font-medium md:block">
            {IS_MAC ? "⌘" : "Ctrl"} K
          </kbd>
        </button>
        <ThemeToggle />
        <Dropdown>
          <Dropdown.Toggle
            variant="bare"
            size="none"
            noCaret
            id="profile-menu"
            aria-label="Account menu"
            className="m-0 flex items-center gap-2 rounded-lg border border-transparent p-1 pr-2 transition-colors hover:bg-surface-2"
          >
            <Avatar name="Admin" className="size-8" />
            <div className="hidden text-left sm:block">
              <p className="mb-0 text-[13px] leading-tight font-semibold text-ink">Admin</p>
              <p className="mb-0 text-[12px] leading-tight text-muted">Administrator</p>
            </div>
            <Icon name="chevron-down" size={14} className="hidden text-muted sm:block" />
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" className="mt-2 min-w-55">
            <div className="mb-1 flex items-center gap-3 border-b border-line px-3 pt-2 pb-3">
              <Avatar name="Admin" className="size-9" />
              <div>
                <p className="mb-0 text-[14px] leading-tight font-semibold text-ink">Admin</p>
                <p className="mb-0 text-[12px] leading-tight text-muted">Math Scanner</p>
              </div>
            </div>
            <Dropdown.Item onClick={logout} className="hover:no-underline">
              <span className="flex items-center gap-2">
                <Icon name="logout" size={16} className="text-muted" />
                Log out
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}
