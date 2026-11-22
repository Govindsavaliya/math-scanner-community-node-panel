import { paths } from "@/app/router/paths";

/** Sidebar structure: labeled sections of items. `icon` is an Icon name (components/ui/Icon.jsx). */
export const sidebarSections = [
  { title: "Overview", items: [{ label: "Dashboard", icon: "dashboard", to: paths.home }] },
  {
    title: "Community",
    items: [
      { label: "Maths Community", icon: "chat", to: paths.mathsCommunity.list },
      { label: "Users", icon: "users", to: paths.users },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Contact Us", icon: "mail", to: paths.contactUsData },
      { label: "Admin Users", icon: "shield-check", to: paths.adminUsers },
      { label: "Trash", icon: "trash", to: paths.trash },
    ],
  },
];

/** Flat list of every navigable page (breadcrumbs and the command palette). */
export const flatNav = sidebarSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title })),
);
