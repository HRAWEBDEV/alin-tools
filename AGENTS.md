# AGENTS.md

This is the **canonical agent-facing documentation** for this repository. `CLAUDE.md` only points here.
Last full scan: 2026-11-21 (commit `21e0409`, branch `feature/integrated-ai`).

## Project Overview

"Alin Tools" (alin-tools) is the web UI for an online restaurant/hotel management and reservation system ("Alin"). It is a **live production application** used by real hotels and restaurants — treat every change as behavior-risk until tests say otherwise. It is a Next.js App Router application, primarily targeting tablet/kiosk on-premise usage (restaurant table rack, room division / front desk), talking to a separate Alin backend API over HTTP (Axios) and SignalR (realtime hub updates).

Prioritize: maintainability, type safety, clear separation of concerns, server-side rendering where appropriate, minimal client-side JS, reusable components, predictable data fetching, consistent error handling, accessibility, performance. Before making significant changes, inspect the existing architecture in the relevant feature folder and follow established patterns rather than introducing a new one.

## Commands

- `npm run dev` — dev server (Next.js, Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — typecheck (clean as of last scan)

There is **no test suite yet** (Phase 3 of the modernization plan adds Vitest + RTL + Playwright). Until then, `npm run build` + `npm run lint` + `npx tsc --noEmit` are the verification trio — run all three after every change.

## Stack

- **Next.js (^16)** — App Router; `typedRoutes: true`; root `proxy.ts` middleware (Next 16 renamed `middleware.ts` → `proxy.ts`); `experimental.globalNotFound: true` (`app/global-not-found.tsx`); `compiler.removeConsole` in production
- **TypeScript (^5)** — strict mode; path alias `@/*` → repo root
- **React (^19)** — React Compiler enabled via Next 16 (components using RHF `watch()` are excluded by the compiler — expect `react-hooks/incompatible-library` warnings there)
- **Tailwind CSS (^4)** — CSS-first config inside `app/globals.css`; no `tailwind.config.*`; dark variant keyed off `[data-theme=dark]` (next-themes attribute); layout knobs as CSS vars (`--app-restaurant-nav-width`, `--app-restaurant-tabs-height`, ...)
- **shadcn/ui (new-york) + Radix UI** — primitives in `components/ui`; `components.json` adds `@aceternity` and `@animate-ui` registries
- **TanStack Query (^5)** — server state; also TanStack Table, Form (login form), Pacer (debounce)
- **Axios** — one shared instance `app/[lang]/(app)/utils/defaultAxios.ts` (baseURL `NEXT_PUBLIC_API_URI`, **no interceptors in the file itself** — interceptors are added by client providers, see below)
- **@microsoft/signalr (^10)** — realtime hubs (see Realtime section)
- **react-hook-form + @hookform/resolvers + Zod (^4)** — forms; schemas colocated in feature `schemas/` folders
- **date-fns / date-fns-jalali** — Jalali calendar for `fa` (primary), Gregorian for `en`
- **Prettier**: single quotes, `tabWidth: 1` (repo indents with **tabs, width 1** — match this exactly)
- PWA manifest (`app/manifest.ts`); local fonts: IRANSansWebFaNum (`fa`), Roboto (`en`)

## Architecture

### Routing & locale

All routes live under `app/[lang]/...`. Locales defined in `internalization/app/localization.ts`: `fa` (active, rtl, Jalali, `Asia/Tehran`) and `en` (declared but `active: false`). `proxy.ts` redirects any request whose first segment isn't a valid locale to `/{locale}/...`, reading cookie `app-locale` and defaulting to `fa`.

⚠️ Fallback inconsistency: `proxy.ts` defaults to `fa`, but `getLocalInfo`/`getLocaleOrDefault` in `localization.ts` fall back to `en`. Don't rely on the fallback; pass explicit locale.

Route groups under `app/[lang]/(app)/`:
- `login/` — auth (login, forget-password), token/session
- `(home)/(tablet)/` — the authenticated tablet app:
  - `(tablet)/layout.tsx` bootstraps auth context in order: `AxiosCredentials` (Bearer token) → `UserInfoRouterProvider` (user/owner/department/program routing) → `AxiosApiPackage` (tenant headers) → `LoginInterceptor` (401/403 → global re-login modal) → `UserAccessibilityProvider` (permissions)
  - `[departmentID]/restaurant/[programID]/` — `salons` (table rack + SignalR), `new-order`, `breakfast-control`
  - `[departmentID]/room-devision/[programID]/` — `rooms-rack` (2 SignalR hubs), `room-control`, `rooms-management` (rooms-statistics, entrance-and-exit-rooms, out-of-order-rooms), `guests-management` (resident-guests, arrival-reserves, guests-expenses), `execution-management` (daily-tasks-checklist, guest-checkout-checklist), plus shared `services/notifications` (EventBoard hub; **reused by the restaurant layout too**)
- `playground/` — dev scratch console for the N950 POS WebSocket; **not production-gated**; exclude from docs/tests

`[departmentID]`/`[programID]` route params identify the operating department/program; resolved via `UserInfoRouterProvider`/`useUserInfoRouter` (`app/[lang]/(app)/login/services/userinfo-provider/`).

### Auth & session

- JWT stored in cookie `app-token` (1-year expiry, `samesite=strict`, **not httpOnly**) via `app/[lang]/(app)/login/utils/loginTokenManager.ts` on top of `utils/cookieManager.ts`. Helpers: `isUserLoggedIn`, `getUserLoginToken`, `setUserLoginToken`, `clearUserLoginToken`.
- Login: `POST /Public/UI/GetJwtToken` (TanStack Form + Zod) → `{item1: token, item2: lifetimeSeconds}` (lifetime currently unused). Forget password: OTP via `GET /Public/User/SendForgetPasswordOTPCode`, then `PUT /Public/User/RecoverPassword`.
- User info bootstrap: `GET /Restaurant/Tablet/GetUIDatas` → flattened to owners→departments→programs; selection persisted in localStorage `user-router-info`; invalid/unresolved selection → select-program dialog; program switch → `queryClient.clear()` + route push. Departments enum (`utils/systems.ts`): roomDivision=3, foodAndBeverage=4; systems: houseKeeping=107, restaurant=111.
- Permissions: `GET /Restaurant/Tablet/CheckAccess` → `UserAccessibility` consumed via `useUserAccessibilityContext()`. Shape (only domain today is `restaurant`):

```
restaurant
├─ order:     { add, edit, delete } & { close, payment, changeCustomer, changeDiscount }
├─ orderItem: { add, edit, delete }
└─ table:     { change, merge }
```

- ⚠️ `godMode(true)` is called unconditionally in `UserAccessibilityProvider` — in DEVELOPMENT the server access response is always replaced by devAccess (all-true).
- Logout (`useLogout`): route to login, clear token, clear user-router storage, `queryClient.clear()`.
- `LoginInterceptor`: any 401/403 response opens the global login modal (`LoginProvider`).

### Data fetching & interceptors

- Reads/writes go through TanStack Query calling `*ApiActions.ts` functions built on the shared axios instance. QueryClient: `staleTime` 5 min default, retry 0 (dev) / 3 (prod); per-browser singleton on client, per-request on server. ReactQueryDevtools always mounted.
- Interceptors are installed by client providers in order: `AxiosBaseConfig` (`languageID`, `apptype: 'tablet'`), `AxiosCredentials` (`Authorization: Bearer`), `AxiosApiPackage` (`Ownerid/Departmentid/Programid/Systemid` headers), `LoginInterceptor` (401/403 → modal). Error handling is ad-hoc per call site (`toast.error(err.response?.data)`); there is no centralized error handler.
- Query-key pattern: string bases like `'restaurant-halls'`, `'restaurant-new-order'`, `'user-info'` + dynamic parts; several keys are rebuilt ad-hoc in multiple files (known debt).

### Realtime (SignalR)

All hubs connect to `NEXT_PUBLIC_API_URI` + hub path with query params `token, programid, departmentid, ownerid, systemid` and use `.withAutomaticReconnect()` + explicit `onreconnected` refresh + `visibilitychange` refetch (60s stale guards) + `connection.off/stop()` cleanup.

| Hub path | Provider (file) | Events | Notes |
|---|---|---|---|
| `/tablerackchangenotifhub` | restaurant `salons/services/salon-base-config/SalonBaseConfigProvider.tsx` | `TableRackUpdated`, `TableRackChanged` | invokes `GetOrderBoardUpdate(connectionId, hall, saleTimeID, date)` |
| `/datachangenotifHub` | room-devision `rooms-rack/services/rooms-rack-config/RoomsRackConfigProvider.tsx` | `RackLastUpdate`, `RackChanged` | invokes `GetRackUpdate(connectionId, limit, offset, filters)` |
| `/roomracknotifhub` | same provider | `NotifUpdate`, `NotifChanged` | invokes `GetNotifUpdate(connectionId)`; sound on change |
| `/EventBoardChangeNotifHub` | room-devision `services/notifications/NotificationsProvider.tsx` (also mounted by restaurant layout) | `EventBoardChanged`, `EventBoardUpdated` (empty handler — dead) | no invoke; sound + toast on count increase |

When adding another realtime feature, follow `SalonBaseConfigProvider.tsx` as the reference pattern.

### Feature-folder convention

Each route/feature directory follows a consistent internal layout — mirror it:
- `components/` — feature-scoped UI (server or client)
- `services/` — context + Provider pairs (`xContext.ts` defines context + hook; `XProvider.tsx` implements) and `*ApiActions.ts` (Axios calls returning typed data)
- `hooks/` — feature-scoped hooks
- `schemas/` — Zod schemas for that feature's forms
- `utils/` — feature-scoped pure helpers

### Page → dictionary → provider → UI pattern

Pages (`page.tsx`) are async **server components**. Pattern: await `params` for `lang`, load the feature dictionary via `getXDictionary({ locale })`, then render a client `XProvider` (from `services/`) wrapping an `XWrapper`/UI component, passing `dic` down. `generateMetadata` similarly awaits params and pulls `title` from the dictionary. Typed route params come from Next's generated `PageProps<'/...'>` / `LayoutProps<'/...'>` helpers, not hand-written types.

Notable: module-home pages (`restaurant/[programID]/page.tsx`, `room-devision/[programID]/page.tsx`) are client redirect shells pushing to the division's default screen. Tabbed pages (rooms-management, guests-management, execution-management) use React `<Activity>` to keep tabs mounted, with `?tab=` state in URL search params.

### Internationalization

`internalization/app/dictionaries/<feature-path>/` holds one folder per feature with `dictionary.ts` (server-only loader, `'server-only'` directive), `fa.json`, `en.json`. Nesting mirrors the route tree, including the `(tablet)/restaurant/...` / `(tablet)/room-devision/...` split.

**Status (verified 2026-11-21): all 21 dictionaries map `en` → `fa.json`; every `en.json` is a `{}` placeholder (except `meta/en.json`, which is Persian). English is not implemented** — `locales.en.active = false` is what keeps `en` out of the UI. Dictionary types are derived from `fa.json`. Don't wire `en.json` casually; treat English as a separate project.

Jalali calendar (`date-fns-jalali`) is used for `fa`; `supportedDateFns` in `localization.ts` picks the variant per locale.

### Env vars & deployment

- `NEXT_PUBLIC_API_URI` — Alin backend API base URL (also SignalR hub origin)
- `NEXT_PUBLIC_MODE` — `DEVELOPMENT` | `PRODUCTION` (compared against `utils/env.ts` constants; gates react-scan and `godMode`)
- Separate `.env.development` / `.env.production`. Deployment is manual (see `MDEPLOY.md`): build once, ship only `node_modules`, `.next`, `package.json`; `npm start` on port 3000.

### Code style

- Tabs, width 1; single quotes (Prettier config)
- `'use client'` only where needed; pages/layouts stay server components
- Context hooks throw `OutOfContextError` when used outside their provider (`utils/OutOfContext.ts`)
- Naming debt (do not propagate): `room-devision` (misspelled division), `ModeContoller`, `RelasePreviewProvider`, `useWindowResizeWatchter`, `NewOrderContrainer`, `ConfrimOrderModal`; server-side param typos are intentional API contract: `saleTiemID`, `GetRoomConrol`, `GetAssinableContracts`
- CSS vars for room-devision reuse `--app-restaurant-*` names (copy-paste origin) — don't add new ones with those names for room-division-specific values

## Known hotspots & tech debt (scan 2026-11-21)

This is the working backlog for the modernization (Phases 2–4). Order by risk/benefit.

### Bugs / behavior risks (verify before "fixing" — some may be intentional API contracts)
1. `hooks/useCurrencyFormatter.ts:9` — `if (!options?.maximumFractionDigits === undefined)` is always false; intended fa fraction-digit logic never runs
2. `login/services/userinfo-provider/userInfoApiActions.ts:59-83` — `convertToUserInfoStore` maps every department to every owner (multi-owner tenants would show foreign departments)
3. `newOrderApiActions.ts:421` — subscriber search param literally named `searchParams` (suspected should be `searchText` — confirm with backend before changing)
4. `salonsApiActions.ts:108,112` — sends both `saleTiemID` (typo) and `saleTimeID` in `changeTableStateType`
5. `services/base-config/BaseConfigProvider.tsx:58-69` — duplicate `beforeunload` registration (assignment + addEventListener)
6. `components/Loading.tsx:5`, `app/[lang]/(app)/loading.tsx:5` — `z-(--startup-loading-zindex)` CSS var is defined nowhere
7. `app/[lang]/(app)/error.tsx` — global error boundary renders hardcoded `<p>application error</p>`, ignores `error`/`reset`
8. `RoomsRackConfigProvider.tsx:703-717` — duplicated `customersValue` URL-sync block (copy-paste)
9. Locale fallback mismatch: `proxy.ts` → `fa` vs `localization.ts` → `en`
10. `dailyTasksApiActions.ts:141-146` — `updateNote` uses POST for an update (confirm with backend)
11. Security: JWT in JS-readable cookie for 1 year; token lifetime (`item2`) unused; playground reachable in production

### Giant files (split targets — do only with tests green)
| File | Lines | Split sketch |
|---|---|---|
| `app/[lang]/(app)/components/LoadingLogo.tsx` | 46,669 | Hand-inlined 272-path SVG → external `.svg` asset |
| `restaurant/new-order/services/order-tools/OrderBaseConfigProvider.tsx` | 1,415 | → useOrderQueries / usePersonLookup / useOrderFormSync / useOrderMutations (+ extract 2 inline dialogs + settings buttons); contains dead empty effect at 1204-1209 and triple-duplicated `getQueriesData` block 350-395 |
| `restaurant/new-order/components/order-info/OrderInfo.tsx` | 1,377 | → generic `DrawerPickerField` (~10 copy-pasted picker blocks) + Person/Date/Totals/Flags sections |
| `room-devision/components/LogoShape.tsx` | 1,635 | Byte-identical duplicate of the restaurant one (diff=0) |
| `room-devision/rooms-rack/components/side-bar/RackFilters.tsx` | 1,015 | 12 repeated Controller+Drawer blocks → config-driven `RackFilterField` |
| `room-devision/rooms-rack/services/rooms-rack-config/RoomsRackConfigProvider.tsx` | 940 | → useRackConnection / useRackReportConnection / useRackFiltersForm (URL sync) / useRackSettings |
| `restaurant/new-order/components/order-invoice/OrderInvoice.tsx` | 917 | Payment-method form + POS/wallet branches → split |
| `restaurant/new-order/services/newOrderApiActions.ts` | 756 | ~40% type definitions → `types.ts`; split by domain (order/directory/person) |
| `room-devision/rooms-rack/components/guest-expenses/stay/NewStayExpense.tsx` | 718 | Form fields + calculator + item drawer |
| `room-devision/rooms-management/out-of-order-rooms/components/NewOutOfOrderRoom.tsx` | 611 | Create vs edit flow; mutations → hook |
| `restaurant/salons/components/table-payment/TablePaymentModal.tsx` | 574 | → useTablePaymentQueries / usePosPaymentFlow / status & error subcomponents |
| `room-devision/rooms-rack/components/room-notes/RoomNotesWrapper.tsx` | 566 | List / dialog / query hook |

### Duplication (dedupe targets — verified identical or near-identical)
- Byte-identical between `restaurant/components/` and `room-devision/components/`: `LogoShape`, `Header`, `Logo`, `Main`, `Nav`, `NavWrapper`, `SettingControllerButton`; near-identical: `HeaderDate`, `NavProfile`, `Tools`, `NavList`, `Tabs` (latter two differ only by links/icons/dictionary)
- Byte-identical hooks: `restaurant/hooks/useScrollWatcher.ts` = `room-devision/hooks/useScrollWatcher.ts` (**unused in both** — dead code)
- `useNewOrderPrintInvoice` ≈ `useNewOrderPrintCash` (identical blob logic)
- Close-order confirm Dialog copy-pasted: `SalonBaseConfigProvider.tsx:516-555` ≈ `OrderBaseConfigProvider.tsx:1331-1374`
- Filter-drawer pattern repeated in ~8 more files (EntranceAndExitFilters, ArrivalReservesFilters, DailyTasksFilters, GuestCheckoutChecklistFilters, OutOfOrderRoomsFilters, InvoiceDetailsFilters, GuestsExpensesFilters, RoomControlFilters) — one shared `FilterField` component collapses them
- `share-dictionary` provider pairs duplicated per division; `Revenue`/`Invoice` types duplicated across rooms-rack and guests-management apiActions; `ApiPagedData` defined locally in `arrivalReservesApiActions.ts:13` while `PagedData` exists in `room-devision/utils/apiTypes.ts`
- Platform→feature leak: `services/userAccessibilityApiActions.ts:1` imports `CrudAccess` from room-devision feature folder

### Lint errors (11 total — all `react-hooks/set-state-in-effect` except one)
Fix in Phase 4 with tests as safety net; do NOT quick-fix now:
- `services/base-config/BaseConfigProvider.tsx:72`
- `app/[lang]/(app)/components/ModeContoller.tsx:40`, `ProfileButton.tsx:25`
- `login/services/userinfo-provider/UserInfoRouterProvider.tsx:150`
- `app/[lang]/(app)/services/user-region/UserRegionCheck.tsx:29`
- `restaurant/components/NavWrapper.tsx:13` + room-devision twin
- `restaurant/new-order/.../orderItemsPricingCalculator.ts` (orderItemsPricingCalculator.ts:9 area — flagged in baseline lint)
- `room-devision/.../DailyTaskPreview.tsx:112`
- `room-devision/rooms-rack/components/room-control/RoomControl.tsx:215`
- `components/animate-ui/primitives/animate/slot.tsx:75,86` (`react-hooks/static-components` ×2 — counts toward the error total)
- `salons/components/SalonTable.tsx`, `table-payment/PaymentOrderInfo.tsx`, `TablePaymentModal.tsx`, `StayExpenses.tsx`, `execution-management/daily-tasks-checklist/DailyTasksChecklistWrapper.tsx` (remaining baseline-error sites)
- 70 warnings: mostly `@typescript-eslint/no-unused-vars`; notable: `SalonTable.tsx:50` `showPrintInvoice` state (half-removed feature)

### Dead code / cleanup candidates
- `login/services/DepartmentRouter.tsx` — entirely commented out
- `components/ui/{accordion,alert-dialog,breadcrumb,button-group,command,input-otp}.tsx` — installed, never imported
- Empty `EventBoardUpdated` handler (`NotificationsProvider.tsx:166`); empty effect `OrderBaseConfigProvider.tsx:1204-1209`; dead `handleTrackRackReportDiffs` (`RoomsRackConfigProvider.tsx:881-895`)
- `console.log('here')` in both module-home redirect pages
- `generateTableMockData` mock-table scaffolding still wired into salons UI paths
- 20 placeholder `en.json` files; settings drawer in room-devision `SettingsProvider.tsx` is an empty stub
- DOM side effects inside reducer: `orderItemsActionsReducer.ts` does `document.querySelector` + `setTimeout` scroll; dangling `// TODO should calculate prices`

### Architecture smells (fix opportunistically, not wholesale)
- Provider god-objects mixing queries/realtime/forms/modals (top two files above)
- 30-member contexts (e.g. `tablesInfo`) cause wide re-renders; split modal state from data
- Prop drilling: `RoomMenu.tsx` receives ~20 props (8 show/hide pairs)
- Paging inconsistency: some features `useQuery`, some `useInfiniteQuery`, resident-guests does client-side slicing, guests-expenses flatMaps paged data
- RoomMenu-related duplicated query keys `[getHallKey, 'ordersList', tableID]` built ad-hoc in 4 files
- Ad-hoc error toasts per call site; no centralized axios error handling

## Changelog & releases

`CHANGELOG.md` is hand-maintained — check it for recent behavioral changes. Release notes ship as markdown in `public/releases/{locale}/{department}/{version}.md` and are surfaced by `ReleasePreviewProvider` (fetches from app origin with raw `axios`, intentionally not the shared API instance).
