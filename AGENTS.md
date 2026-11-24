# AGENTS.md

Canonical agent-facing documentation for this repository. `CLAUDE.md` only points here.

**Where to find what:**
- Commands, stack quirks, conventions, verified tech-debt backlog → **this file**
- Top-level architecture (provider bootstrap chain, auth, data flow, SignalR hubs, i18n) → `docs/architecture.md`
- Per-feature pages (endpoints, hubs, schemas, known issues) → `docs/features/{restaurant,room-devision}/*.md` — read the relevant one before touching a feature
- Modernization plan (Phases 0–5) → `docs/how_to_integrate_ai.md`

Last verified 2026-11-24: `npx tsc --noEmit` clean; `npm run lint` = 26 problems (11 errors, 15 warnings) — this is the **baseline**, cataloged below. If your numbers are higher, you broke it.

## Project overview

"Alin Tools" (alin-tools) is the web UI for an online restaurant/hotel management and reservation system ("Alin"). It is a **live production application** used by real hotels and restaurants — treat every change as behavior-risk until tests say otherwise. Next.js App Router, tablet/kiosk on-premise UI (restaurant table rack, room division / front desk), talking to a separate Alin backend API over HTTP (Axios) and SignalR.

Before making significant changes, read the feature doc in `docs/features/` and follow the established patterns in that feature folder rather than introducing new ones.

## Commands & verification

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build (port 3000)
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — typecheck

**There is no test suite yet** (Phase 3 of the modernization plan adds Vitest + RTL + Playwright). Until then, the verification trio after every change is: `npm run lint` + `npx tsc --noEmit` + `npm run build`. Lint has a **deliberate 11-error baseline** (see Lint errors below) — do not quick-fix them; compare counts, don't aim for zero yet.

**Test placement convention:** tests live in a `__tests__/` directory **inside the directory of the code under test** (colocated). When testing a directory, create `<feature-dir>/__tests__/` and put that directory's test files there — e.g. tests for `restaurant/new-order/services/newOrderApiActions.ts` go in `restaurant/new-order/services/__tests__/`. Do not gather tests in a single top-level `tests/` or `src/__tests__` tree.

## Stack quirks (things you'd guess wrong)

- **Next.js ^16** — `typedRoutes: true` (typed route params come from generated `PageProps<'/...'>` / `LayoutProps<'/...'>` helpers, not hand-written types); middleware is `proxy.ts` at root (Next 16 renamed `middleware.ts`); `experimental.globalNotFound: true`; `compiler.removeConsole` in production.
- **React ^19 with React Compiler** — components using RHF `watch()` are excluded by the compiler; expect `react-hooks/incompatible-library` warnings there.
- **Tailwind CSS ^4** — CSS-first config inside `app/globals.css`; **no `tailwind.config.*`**; dark variant keyed off `[data-theme=dark]` (next-themes attribute); layout knobs are CSS vars (`--app-restaurant-nav-width`, `--app-restaurant-tabs-height`, ...).
- **Formatting** — Prettier: single quotes, `tabWidth: 1`. The repo indents with **tabs, width 1** — match exactly.
- **Axios** — one shared instance `app/[lang]/(app)/utils/defaultAxios.ts` (baseURL `NEXT_PUBLIC_API_URI`, **no interceptors in the file itself** — installed by client providers, see architecture doc). `ReleasePreviewProvider` fetches release notes with raw `axios`, intentionally not this instance.
- **Forms** — react-hook-form + `@hookform/resolvers` + Zod ^4; schemas colocated in feature `schemas/` folders.
- **Dates** — `date-fns-jalali` for `fa` (primary locale), Gregorian `date-fns` for `en`; `supportedDateFns` in `internalization/app/localization.ts` picks per locale.
- **Fonts** — local: IRANSansWebFaNum (`fa`), Roboto (`en`); PWA manifest at `app/manifest.ts`.

## Conventions that differ from defaults

### Feature-folder layout (mirror it)
Each route/feature directory: `components/`, `services/` (context+Provider pairs: `xContext.ts` defines context+hook, `XProvider.tsx` implements; `*ApiActions.ts` = Axios calls), `hooks/`, `schemas/` (Zod), `utils/`.

### Page → dictionary → provider → UI
Pages (`page.tsx`) are async **server components**: await `params` for `lang`, load feature dictionary via `getXDictionary({ locale })`, render a client `XProvider` wrapping the UI, pass `dic` down. `generateMetadata` awaits params and pulls `title` from the dictionary.

### i18n — English is NOT implemented
`internalization/app/dictionaries/<feature-path>/` per feature: `dictionary.ts` (server-only loader), `fa.json`, `en.json`. **All loaders map `en` → `fa.json`; every `en.json` is an empty `{}` placeholder** (except `meta/en.json`, which is Persian) — verified 2026-11-24. `locales.en.active = false` keeps `en` out of the UI. Dictionary types derive from `fa.json`. Don't wire `en.json` casually; English is a separate project.

### Naming debt — do not "fix"
- `room-devision` (misspelled "division"), `ModeContoller`, `RelasePreviewProvider`, `useWindowResizeWatchter`, `NewOrderContrainer`, `ConfrimOrderModal`
- **Server-side param typos are intentional API contracts — do not change without backend confirmation:** `saleTiemID`, `searchParams` (subscriber search), `GetRoomConrol`, `GetAssinableContracts`

### Misc
- Context hooks throw `OutOfContextError` when used outside their provider (`utils/OutOfContext.ts`).
- `'use client'` only where needed; pages/layouts stay server components.
- CSS vars for room-devision reuse `--app-restaurant-*` names (copy-paste origin) — don't add more with those names for room-division-specific values.
- Realtime additions follow `salons/services/salon-base-config/SalonBaseConfigProvider.tsx` as the reference pattern (query-param auth, `withAutomaticReconnect`, `onreconnected` refresh, `visibilitychange` refetch with 60s stale guard, `connection.off/stop()` cleanup).

## Auth & data flow (condensed — full detail in `docs/architecture.md`)

- JWT in non-httpOnly cookie `app-token` (1 year) via `login/utils/loginTokenManager.ts` on `utils/cookieManager.ts`. Login: `POST /Public/UI/GetJwtToken` → `{item1: token, item2: lifetimeSeconds(unused)}`.
- Bootstrap: `GET /Restaurant/Tablet/GetUIDatas` → owners→departments→programs; selection in localStorage `user-router-info`. Departments enum (`utils/systems.ts`): roomDivision=3, foodAndBeverage=4.
- Permissions: `GET /Restaurant/Tablet/CheckAccess` → `UserAccessibility` (only `restaurant` domain exists today; room division has no permission checks). ⚠️ `godMode(true)` is called unconditionally — in DEVELOPMENT the server response is always replaced by all-true `devAccess`.
- ⚠️ Locale fallback mismatch: `proxy.ts` defaults to `fa`, but `getLocalInfo`/`getLocaleOrDefault` in `localization.ts` fall back to `en`. Don't rely on either fallback; pass explicit locale.
- No centralized error handler — per-call-site `toast.error(err.response?.data)`.
- 4 SignalR hubs (table rack, rack data, rack notif, EventBoard); hub/provider mapping in `docs/architecture.md`.

## Known hotspots & tech debt (scan 2026-11-21, spot-verified 2026-11-24)

Working backlog for the modernization (Phases 2–4, see `docs/how_to_integrate_ai.md`). Order by risk/benefit.

### Bugs / behavior risks (verify before "fixing" — some are intentional API contracts)
1. `hooks/useCurrencyFormatter.ts:9` — `if (!options?.maximumFractionDigits === undefined)` is always false; intended fa fraction-digit logic never runs
2. `login/services/userinfo-provider/userInfoApiActions.ts:59-83` — `convertToUserInfoStore` maps every department to every owner (multi-owner tenants would show foreign departments)
3. `newOrderApiActions.ts:421` — subscriber search param literally named `searchParams` (suspected should be `searchText` — confirm with backend before changing)
4. `salonsApiActions.ts:108,112` — sends both `saleTiemID` (typo) and `saleTimeID` in `changeTableStateType`
5. `services/base-config/BaseConfigProvider.tsx:58-69` — duplicate `beforeunload` registration (assignment + addEventListener)
6. `components/Loading.tsx:5`, `app/[lang]/(app)/loading.tsx:5` — `z-(--startup-loading-zindex)` CSS var is defined nowhere
7. `app/[lang]/(app)/error.tsx` — global error boundary renders hardcoded `<p>application error</p>`, ignores `error`/`reset`
8. `RoomsRackConfigProvider.tsx:703-717` — duplicated `customersValue` URL-sync block (copy-paste)
9. Locale fallback mismatch (see Auth above)
10. `dailyTasksApiActions.ts:141-146` — `updateNote` uses POST for an update (confirm with backend)
11. Security: JWT in JS-readable cookie for 1 year; token lifetime (`item2`) unused; `playground/` (N950 POS WebSocket scratch console) is reachable in production — exclude it from docs/tests

### Giant files (split targets — do only with tests green, per Phase 4)
| File | Lines | Split sketch |
|---|---|---|
| `app/[lang]/(app)/components/LoadingLogo.tsx` | 46,669 | Hand-inlined 272-path SVG → external `.svg` asset |
| `restaurant/new-order/services/order-tools/OrderBaseConfigProvider.tsx` | 1,415 | → useOrderQueries / usePersonLookup / useOrderFormSync / useOrderMutations (+ extract 2 inline dialogs + settings buttons); contains dead empty effect at 1204-1209 and triple-duplicated `getQueriesData` block 350-395 |
| `restaurant/new-order/components/order-info/OrderInfo.tsx` | 1,377 | → generic `DrawerPickerField` (~10 copy-pasted picker blocks) + Person/Date/Totals/Flags sections |
| `room-devision/components/LogoShape.tsx` | 1,635 | Byte-identical duplicate of the restaurant one (diff=0) |
| `room-devision/rooms-rack/components/side-bar/RackFilters.tsx` | 1,015 | 12 repeated Controller+Drawer blocks → config-driven `RackFilterField` |
| `room-devision/rooms-rack/services/rooms-rack-config/RoomsRackConfigProvider.tsx` | 932 | → useRackConnection / useRackReportConnection / useRackFiltersForm (URL sync) / useRackSettings |
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
- Filter-drawer pattern repeated in ~8 files (EntranceAndExitFilters, ArrivalReservesFilters, DailyTasksFilters, GuestCheckoutChecklistFilters, OutOfOrderRoomsFilters, InvoiceDetailsFilters, GuestsExpensesFilters, RoomControlFilters) — one shared `FilterField` component collapses them
- `share-dictionary` provider pairs duplicated per division; `Revenue`/`Invoice` types duplicated across rooms-rack and guests-management apiActions; `ApiPagedData` defined locally in `arrivalReservesApiActions.ts:13` while `PagedData` exists in `room-devision/utils/apiTypes.ts`
- Platform→feature leak: `services/userAccessibilityApiActions.ts:1` imports `CrudAccess` from a room-devision feature folder

### Lint errors (11 total, baseline as of 2026-11-24 — do NOT quick-fix; Phase 4 fixes them with tests as safety net)
All `react-hooks/set-state-in-effect` except where noted:
- `services/base-config/BaseConfigProvider.tsx:72`
- `app/[lang]/(app)/components/ModeContoller.tsx:40`, `ProfileButton.tsx:25`
- `login/services/userinfo-provider/UserInfoRouterProvider.tsx:150`
- `app/[lang]/(app)/services/user-region/UserRegionCheck.tsx:29`
- `restaurant/components/NavWrapper.tsx:13` + room-devision twin
- `restaurant/new-order/.../orderItemsPricingCalculator.ts` (~line 9)
- `room-devision/.../DailyTaskPreview.tsx:112`
- `room-devision/rooms-rack/components/room-control/RoomControl.tsx:215`
- `components/animate-ui/primitives/animate/slot.tsx:75,86` (`react-hooks/static-components` ×2)
- `salons/components/SalonTable.tsx`, `table-payment/PaymentOrderInfo.tsx`, `TablePaymentModal.tsx`, `StayExpenses.tsx`, `execution-management/daily-tasks-checklist/DailyTasksChecklistWrapper.tsx` (remaining baseline sites)
- 15 warnings: all `react-hooks/incompatible-library` (RHF `watch()` blocks React Compiler memoization; expected)

### Dead code / cleanup candidates
- `login/services/DepartmentRouter.tsx` — entirely commented out
- `components/ui/{accordion,alert-dialog,breadcrumb,button-group,command,input-otp}.tsx` — installed, never imported
- Empty `EventBoardUpdated` handler (`NotificationsProvider.tsx:166`); empty effect `OrderBaseConfigProvider.tsx:1204-1209`
- `console.log('here')` in both module-home redirect pages
- `generateTableMockData` mock-table scaffolding still wired into salons UI paths
- 20 placeholder `en.json` files; settings drawer in room-devision `SettingsProvider.tsx` is an empty stub
- DOM side effects inside reducer: `orderItemsActionsReducer.ts` does `document.querySelector` + `setTimeout` scroll; dangling `// TODO should calculate prices`

### Architecture smells (fix opportunistically, not wholesale)
- Provider god-objects mixing queries/realtime/forms/modals (top two giant files)
- 30-member contexts (e.g. `tablesInfo`) cause wide re-renders; split modal state from data
- Prop drilling: `RoomMenu.tsx` receives ~20 props (8 show/hide pairs)
- Paging inconsistency: some features `useQuery`, some `useInfiniteQuery`, resident-guests does client-side slicing, guests-expenses flatMaps paged data
- RoomMenu-related duplicated query keys `[getHallKey, 'ordersList', tableID]` built ad-hoc in 4 files
- Ad-hoc error toasts per call site; no centralized axios error handling

## Env vars & deployment

- `NEXT_PUBLIC_API_URI` — Alin backend API base URL (also the SignalR hub origin)
- `NEXT_PUBLIC_MODE` — `DEVELOPMENT` | `PRODUCTION` (compared against `utils/env.ts` constants; gates react-scan and `godMode`)
- Separate `.env.development` / `.env.production`. Deployment is **manual** (see `MDEPLOY.md`): build once, ship only `node_modules`, `.next`, `package.json`; `npm start` on port 3000.

## Changelog & releases

`CHANGELOG.md` is hand-maintained — check it for recent behavioral changes. Release notes ship as markdown in `public/releases/{locale}/{department}/{version}.md` and are surfaced by `ReleasePreviewProvider`.
