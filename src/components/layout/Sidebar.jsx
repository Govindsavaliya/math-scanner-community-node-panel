import { Link, NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { sidebarSections } from "@/config/navigation";
import { paths } from "@/app/router/paths";
import { cn } from "@/utils/cn";

// `group/layout` (DashboardLayout) carries data-collapsed; labels and titles hide when collapsed (desktop only).
const COLLAPSED_HIDE = "group-data-[collapsed=true]/layout:xl:hidden";

const LINK =
  "group/link relative mx-3 my-0.5 flex h-9 items-center gap-3 rounded-lg px-3 text-[14px] font-medium no-underline transition-colors duration-150 group-data-[collapsed=true]/layout:xl:justify-center group-data-[collapsed=true]/layout:xl:px-0";
const ACTIVE = "bg-primary/10 font-semibold text-primary";
const INACTIVE = "text-muted hover:bg-surface-2 hover:text-ink";

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      aria-label={item.label}
      className={({ isActive }) => cn(LINK, isActive ? ACTIVE : INACTIVE)}
    >
      <Icon name={item.icon} size={18} className="shrink-0" />
      <span className={cn("truncate", COLLAPSED_HIDE)}>{item.label}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 hidden -translate-y-1/2 rounded-md bg-ink px-2 py-1 text-[12px] font-medium whitespace-nowrap text-surface opacity-0 shadow-dropdown transition-opacity duration-150 group-data-[collapsed=true]/layout:xl:block group-hover/link:opacity-100 group-focus-visible/link:opacity-100"
      >
        {item.label}
      </span>
    </NavLink>
  );
}

export default function Sidebar({ open, onNavigate, onToggleCollapse, collapsed }) {
  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "fixed top-0 bottom-0 z-20 flex w-62.5 flex-col border-r border-line bg-surface [transition:width_0.2s_ease-out,transform_0.2s_ease-out] xl:group-data-[collapsed=true]/layout:w-18",
        open ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-line px-5 group-data-[collapsed=true]/layout:xl:justify-center group-data-[collapsed=true]/layout:xl:px-0">
        <Link to={paths.home} onClick={onNavigate} className="flex items-center" aria-label="Math Scanner home">
          <img src="/logo/appicon.png" alt="Math Scanner logo" className="size-9 shrink-0 rounded-lg border border-line" />
          <span className={cn("ml-3 text-[16px] font-semibold tracking-tight text-ink", COLLAPSED_HIDE)}>Math Scanner</span>
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 overflow-x-hidden overflow-y-auto py-3" onClick={onNavigate}>
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-3">
            <p className={cn("mx-6 mb-1 text-[11px] font-semibold tracking-wider text-muted uppercase", COLLAPSED_HIDE)}>
              {section.title}
            </p>
            <div className="mx-5 mb-2 hidden border-t border-line group-data-[collapsed=true]/layout:xl:block"></div>
            {section.items.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <div className="hidden shrink-0 border-t border-line p-3 xl:block">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-transparent px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink group-data-[collapsed=true]/layout:justify-center group-data-[collapsed=true]/layout:px-0"
        >
          <Icon name={collapsed ? "panel-open" : "panel-close"} size={18} className="shrink-0" />
          <span className={COLLAPSED_HIDE}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
