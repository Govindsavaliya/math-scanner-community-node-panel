import Icon from "@/components/ui/Icon";
import { Link, useLocation } from "react-router-dom";
import { flatNav } from "@/config/navigation";
import { paths } from "@/app/router/paths";

const ACTIONS = { add: "Add", edit: "Edit", view: "View" };

/** Breadcrumb trail for the header: section › page › action, derived from the URL and the nav config. */
export default function Crumbs() {
  const { pathname } = useLocation();
  const page = [...flatNav]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));
  if (!page) return null;

  const action = ACTIONS[pathname.slice(page.to.length + 1).split("/")[0]] ?? (pathname === page.to ? null : "Details");
  const trail = [
    { label: page.section },
    { label: page.label, to: action ? page.to : undefined },
    ...(action ? [{ label: action }] : []),
  ];

  return (
    <nav aria-label="breadcrumb" className="hidden min-w-0 md:block">
      <ol className="m-0 flex list-none items-center gap-2 p-0 text-[13px] text-muted">
        <li>
          <Link to={paths.home} className="hover:text-primary">Home</Link>
        </li>
        {trail.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            <Icon name="chevron-right" />
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-primary">{crumb.label}</Link>
            ) : (
              <span className={i === trail.length - 1 ? "font-semibold text-ink" : ""} aria-current={i === trail.length - 1 ? "page" : undefined}>
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
