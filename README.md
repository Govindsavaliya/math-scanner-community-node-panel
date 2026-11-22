# Math Scanner Community Panel

Frontend for the Math Scanner platform: an admin panel for managing users, community questions, contact messages and the trash, plus the public marketing website and contact form for the mobile app.

**Stack:** Vite · React 18 · React Router 6 · TanStack Query 5 · Tailwind CSS 4 · Axios · Lucide icons

## Features

| Area | Route | Notes |
|---|---|---|
| Website | `/`, `/contact-us` | Public landing page and contact form (signed-in admins are redirected to `/home`) |
| Login | `/login` | Admin sign-in, JWT stored client-side |
| Dashboard | `/home` | Totals, 30-day trend and users per login type |
| Users | `/users` | Search, filter by status/date, activate/deactivate, soft delete, restore |
| Maths Community | `/maths-community` | Questions list, add question, view question with answers and images, verify answers |
| Contact Us | `/contact-us-data` | Messages submitted from the website |
| Admin Users | `/admin-users` | Super admins only |
| Trash | `/trash` | Restore, permanently delete, empty trash, audit log |

All admin pages support light and dark themes (persisted in `localStorage`), a collapsible sidebar, and a `Ctrl/Cmd + K` page switcher.

## Getting started

Requires Node 20.19 or newer.

```powershell
npm install
```

Copy the example env file and set `VITE_API_URL` to your backend base URL:

```powershell
Copy-Item .env.example .env
```

```powershell
npm run dev
```

The dev server runs at http://localhost:3000.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload and React Query devtools |
| `npm run build` | Production build into `build/` |
| `npm run build:staging` | Build using `.env.staging` |
| `npm run preview` | Serve the built app locally |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |

## Configuration

`VITE_API_URL` is the REST API base URL. In production builds the API is picked from the hostname the panel is opened on, so one build serves every environment (mapping in [`src/config/env.js`](src/config/env.js)). Add a host there when a new panel domain is created; unknown hosts fall back to `VITE_API_URL`.

## Project structure

```
src/
  app/           App shell, providers, router (paths, routes, auth guards)
  components/
    ui/          Design-system primitives: Button, Card, Form, Modal, Table, Grid, Icon, Dropdown
    common/      Reusable app components: pagination, filters, status badges, empty/loading states
    layout/      Dashboard shell: sidebar, header, breadcrumbs, command palette
  config/        Constants, env resolution, navigation structure
  features/      One folder per module (api.js + pages + components)
    admin-users, auth, contact-us, dashboard, maths-community, trash, users, website
  hooks/         Shared hooks (theme)
  lib/           HTTP client, auth token handling, notifications, query client
  styles/        Tailwind entry, theme tokens, vendor overrides
  utils/         Small helpers (class names, dates)
```

Conventions:

- API calls and React Query hooks live in each feature's `api.js`; pages only consume them.
- Every route is declared in `src/app/router/paths.js` and code-split in `routes.jsx`.
- Styling uses Tailwind utilities with theme tokens from `src/styles/theme.css`; shared class strings are in `src/features/ui-classes.js`.
- The `@` alias points to `src/`.

More detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Deployment

The app is a single-page app: configure the web server to fall back to `index.html` for unknown paths. Production and staging run as PM2 processes serving `build/` (see [`ecosystem.config.cjs`](ecosystem.config.cjs)). Full steps: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
