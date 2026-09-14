# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Alin Tools" (alin-tools) is the web UI for an online restaurant/hotel management and reservation system ("Alin"). It is a Next.js App Router application, primarily targeting tablet/kiosk usage on-premise (restaurant salons, room division, front desk), talking to a separate Alin backend API over HTTP (Axios) and SignalR (realtime hub updates).

Prioritize: maintainability, type safety, clear separation of concerns, server-side rendering where appropriate, minimal client-side JS, reusable components, predictable data fetching, consistent error handling, accessibility, and performance. Before making significant changes, inspect existing architecture in the relevant feature folder and follow established patterns rather than introducing a new one.

## Commands

- `npm run dev` — start the dev server (Next.js, Turbopack default)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)

There is no test suite/framework configured in this repo.

## Stack

- **Next.js (^16)** — App Router; typed routes enabled (`typedRoutes: true`); root `proxy.ts` middleware (Next 16 renamed `middleware.ts` to `proxy.ts`)
- **TypeScript (^5)**, strict mode, path alias `@/*` → repo root
- **React (^19)**
- **Tailwind CSS (^4)** — CSS-first config inside `app/globals.css`; there is no `tailwind.config.*`
- **shadcn/ui (new-york style) + Radix UI** — primitives in `components/ui`; `components.json` defines aliases (`@/components`, `@/lib`, `@/hooks`, `@/components/ui`) and two extra registries (`@aceternity`, `@animate-ui`)
- **TanStack Query (^5)** — server state/data fetching; also TanStack Table and TanStack Form/Pacer where relevant
- **Axios** — HTTP client via the shared instance at `app/[lang]/(app)/utils/defaultAxios.ts` (base URL from `NEXT_PUBLIC_API_URI`)
- **@microsoft/signalr (^10)** — realtime hub connections for salons/tables, rooms-rack, and notifications
- **react-hook-form + @hookform/resolvers + Zod (^4)** — forms, with schemas colocated in feature-level `schemas/` folders
- **date-fns / date-fns-jalali** — Jalali (Persian) calendar is the primary/default calendar; see Internationalization below
- Prettier: single quotes, `tabWidth: 1` (this repo indents with tabs, width 1 — match this exactly when editing)

## Architecture

### Routing & locale

All routes live under `app/[lang]/...`. `[lang]` is the only supported locale segment (`fa` | `en`, defined in `internalization/app/localization.ts`); `fa` is the active/default locale, `en` is currently marked inactive. `getLocaleOrDefault` / `getLocalInfo` resolve locale metadata (content direction, calendar, timezone).

`proxy.ts` (Next 16's replacement for `middleware.ts`) redirects any request whose first path segment isn't a valid locale to `/<userLocale>/...`, reading the user's locale from a cookie (`utils/userLocaleManager.ts`) and defaulting to `fa`. It ignores `/api`, `/static`, and any path containing a `.` (static assets).

Route group structure under `app/[lang]/(app)/`:
- `(app)/login/...` — auth flow (login, forget-password), token/session management
- `(app)/(home)/(tablet)/[departmentID]/...` — the main authenticated tablet app, scoped per department:
  - `restaurant/[programID]/` — `salons` (table/hall management + SignalR), `new-order`, `breakfast-control`
  - `room-devision/[programID]/` — `rooms-rack` (SignalR), `room-control`, `rooms-management` (`entrance-and-exit-rooms`, `out-of-order-rooms`, `rooms-statistics`), `guests-management` (`arrival-reserves`, `resident-guests`, `guests-expenses`), `execution-management` (`daily-tasks-checklist`, `guest-checkout-checklist`), plus a `notifications` service (SignalR)

`[departmentID]` and `[programID]` are dynamic route params identifying the active department and program (module instance) the logged-in user is operating in; department/program context is resolved via `UserInfoRouterProvider`/`useUserInfoRouter` (`app/[lang]/(app)/login/services/userinfo-provider/`).

### Feature-folder convention

Each route/feature directory follows a consistent internal layout — mirror it when adding to an existing feature or creating a new one:
- `components/` — feature-scoped UI (server or client)
- `services/` — context + Provider pairs (`xContext.ts` defines a React context + hook, `XProvider.tsx` implements it) and `*ApiActions.ts` (Axios calls returning typed data)
- `hooks/` — feature-scoped hooks
- `schemas/` — Zod schemas for forms in that feature
- `utils/` — feature-scoped pure helpers

### Page → dictionary → provider → UI pattern

Pages (`page.tsx`) are async server components. Pattern: await `params` for `lang`, load the feature's dictionary via `getXDictionary({ locale })`, then render a client `XProvider` (from `services/`) wrapping a `XWrapper`/UI component, passing `dic` down. `generateMetadata` similarly awaits params and pulls `title` from the dictionary. Typed route params come from Next's generated `PageProps<'/...'>` / `LayoutProps<'/...'>` helpers (typed routes), not hand-written prop types.

### Internationalization

`internalization/app/dictionaries/<feature-path>/` holds one folder per feature with `dictionary.ts` (server-only loader, `'server-only'` directive, maps `Locale -> () => Promise<Dictionary>`), `fa.json`, and `en.json`. Nesting mirrors the route tree, including a `(tablet)/restaurant/...` and `(tablet)/room-devision/...` split matching `app/[lang]/(app)/(home)/(tablet)/...`. Note: several dictionaries (e.g. login) currently resolve both `fa` and `en` to the `fa.json` import — `en` is not fully wired up; check the specific `dictionary.ts` before assuming `en.json` is actually served.

Jalali calendar (`date-fns-jalali`) is used for `fa`; `supportedDateFns` in `internalization/app/localization.ts` picks the right `date-fns` variant per locale.

### Auth & session

Login token is stored in a cookie (`app-token`, 1-year expiry) via `app/[lang]/(app)/login/utils/loginTokenManager.ts` (`getUserLoginToken`/`setUserLoginToken`/`clearUserLoginToken`/`isUserLoggedIn`), built on `utils/cookieManager.ts`. `LoginInterceptor` and `UserAccessibilityProvider`/`userAccessibilityContext` (under `login/services/`) gate feature access — permission checks look like `userAccessibility['restaurant']['table']['merge']`. `DepartmentRouter` handles routing the user into their department/program after login.

### Data fetching & realtime

- Standard reads/writes go through TanStack Query (`useQuery`/`useMutation`) calling `*ApiActions.ts` functions built on the shared `axios` instance (`app/[lang]/(app)/utils/defaultAxios.ts`, base URL `NEXT_PUBLIC_API_URI`).
- Realtime-heavy screens (salons/tables, rooms-rack, notifications) additionally open a `signalR.HubConnectionBuilder` connection (URL built from `NEXT_PUBLIC_API_URI` + hub path, with `token`/`programid`/`departmentid`/`ownerid`/`systemid` query params from `getUserLoginToken()` and `useUserInfoRouter()`), with `.withAutomaticReconnect()`. These providers set up connection lifecycle in `useEffect`, subscribe to hub events (`connection.on(...)`), re-fetch on `visibilitychange`/`onreconnected`, and clean up (`connection.off`, `connection.stop()`) on unmount/dep change. Follow the pattern in `.../salons/services/salon-base-config/SalonBaseConfigProvider.tsx` when adding another realtime feature.
- Context/Provider pairs are the standard way to expose feature state + actions to a subtree (see any `xContext.ts` + `XProvider.tsx` pair) — prefer this over prop drilling or ad hoc global state.

### Env vars

`NEXT_PUBLIC_API_URI` — Alin backend API base URL (also reused as the SignalR hub origin). `NEXT_PUBLIC_MODE` — build mode flag (compared against `utils/env.ts`'s `DEVELOPMENT` constant, e.g. to conditionally load `react-scan` in the root layout). Separate `.env.development` / `.env.production` files hold these; see `MDEPLOY.md` for manual production deployment steps (build once, then only `node_modules`, `.next`, and `package.json` are needed to run `npm start`).

### Changelog

`CHANGELOG.md` is maintained by hand in this repo — check it for recent behavioral changes when relevant.
