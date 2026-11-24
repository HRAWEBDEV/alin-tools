# How to Integrate AI into alin-tools

This document tracks the AI-assisted modernization plan for this live production app (used by real hotels and restaurants). Follow the phases **in order** — the whole point is to make the codebase safe to change before changing it.

Golden rule: **tests before refactor, docs before both, package updates last.**

---

## Phase 0 — Baseline & safety (done 2026-11-21)

Record the current state so every later change has a reference point.

- [x] Confirm clean working tree on feature branch (`feature/integrated-ai`)
- [x] `npx tsc --noEmit` → clean (exit 0)
- [x] `npm run lint` → 81 problems (11 errors, 70 warnings) — **not green**; the 11 errors are cataloged in `AGENTS.md` → "Lint errors" and are deliberately NOT quick-fixed (behavior risk)
- [x] `npm audit` (prod) → 7 vulnerabilities (6 high, 1 critical — Zod memory exhaustion, auto-fixable but deferred to Phase 5)
- [x] `npm outdated` → logged; future majors: `@tanstack/react-table` 9, `motion` 14, `@microsoft/signalr` 11, `@hookform/resolvers` 7, `lucide-react` 1.x, `react-day-picker` 10, `nanoid` 6
- [ ] `npm run build` → still to run once on the branch as a final baseline check

## Phase 1 — Full scan → canonical `AGENTS.md` (done 2026-11-21)

1. [x] Deep-scan the whole project with three parallel explore agents:
   - restaurant division (`salons`, `new-order`, `breakfast-control`)
   - room division (`rooms-rack`, `room-control`, rooms/guests/execution management)
   - platform/shared (auth, layouts, services, hooks, i18n, ui components)
2. [x] Rewrite `AGENTS.md` as the single canonical agent-facing doc (architecture, auth, data fetching, SignalR hubs, i18n status, code style, full tech-debt backlog with file:line refs)
3. [x] Reduce `CLAUDE.md` to a pointer at `AGENTS.md`
4. [x] Verify lint/tsc unchanged

**Exit criteria met:** `AGENTS.md` contains the complete hotspot backlog that Phases 2–4 work from.

## Phase 2 — Document pages (`docs/` folder)

Create a `docs/` tree mirroring the route tree. Per feature MD file:

- Purpose of the screen and its entry files (page → provider → component flow)
- API endpoints consumed (from the feature's `*ApiActions.ts`) — method + path
- SignalR hub + events (if realtime)
- Zod schemas, feature hooks, permissions checked
- Dictionaries used
- "Known issues / smells" section feeding Phase 4

Planned files:

- [ ] `docs/README.md` — index
- [ ] `docs/architecture.md` — top-level overview (flows between divisions and backend)
- [ ] `docs/features/restaurant/salons.md`
- [ ] `docs/features/restaurant/new-order.md`
- [ ] `docs/features/restaurant/breakfast-control.md`
- [ ] `docs/features/room-devision/rooms-rack.md`
- [ ] `docs/features/room-devision/room-control.md`
- [ ] `docs/features/room-devision/rooms-management.md` (statistics, entrance-and-exit, out-of-order)
- [ ] `docs/features/room-devision/guests-management.md` (resident-guests, arrival-reserves, guests-expenses)
- [ ] `docs/features/room-devision/execution-management.md` (daily-tasks, guest-checkout)
- [ ] `docs/features/room-devision/notifications.md` (EventBoard hub, reused by restaurant)

**Exit criteria:** every page has a doc; endpoint/hub lists complete; each doc lists its known issues.

## Phase 3 — Test infrastructure & tests (BEFORE refactoring)

Set up the test stack (none exists today):

- [ ] Install: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `msw`, `@playwright/test`
- [ ] Add `vitest.config.ts`, `playwright.config.ts`, test setup file (mocks for `matchMedia`, `ResizeObserver`, `next/navigation`, cookies/localStorage)
- [ ] Add `npm test` script; wire into the verification trio

Write tests in priority order (critical business logic first):

- [ ] Pure units: `utils/`, `hooks/`, feature `schemas/` (Zod), date/Jalali helpers
- [ ] API actions: every `*ApiActions.ts` against mocked HTTP (msw) — verify URL, method, query params (incl. the intentional-typo params: `saleTiemID`, `searchParams`), payload shapes
- [ ] Realtime providers: mocked `HubConnection` — lifecycle, event handlers, reconnect refetch, cleanup
- [ ] Component tests: new-order flow, `TablePaymentModal`, rack filters, guest expenses
- [ ] Playwright e2e against the dev backend: login → department routing → new-order happy path; rooms-rack loads; table payment

Rules:

- Tests lock in **current** behavior (characterization tests) — including suspected-bug behavior — so refactors prove no regression
- Suspected bugs (see `AGENTS.md` backlog) get a `// TODO(ai): confirm with backend` note, not a fix
- `playground/` is excluded from tests and docs

**Exit criteria:** `npm test` green; all `*ApiActions.ts` covered; giant providers have at least characterization coverage.

## Phase 4 — Refactor (verified by Phase 3 tests)

One concern per change, tests green after each, no behavior change. Priority order from `AGENTS.md` backlog:

- [ ] Split `OrderBaseConfigProvider.tsx` (1,415 lines) → useOrderQueries / usePersonLookup / useOrderFormSync / useOrderMutations + extracted dialogs
- [ ] Split `RoomsRackConfigProvider.tsx` (932) → useRackConnection / useRackReportConnection / useRackFiltersForm / useRackSettings
- [ ] Extract logic from `OrderInfo.tsx` (1,377) → generic `DrawerPickerField` + section components
- [ ] Split `TablePaymentModal.tsx` (574) and `OrderInvoice.tsx` (917) payment-flow logic
- [ ] De-duplicate restaurant vs room-devision shared components (`LogoShape`, `Header`, `Nav*`, `Tabs`, `HeaderDate`, `useScrollWatcher`, print hooks, close-order dialog)
- [ ] One shared `FilterField`/`RackFilterField` component collapsing ~9 filter-drawer copies
- [ ] Move `LoadingLogo.tsx` (46,669-line inline SVG) to an external `.svg` asset
- [ ] Extract `newOrderApiActions.ts` types to `types.ts`, split by domain
- [ ] Only then: fix the 11 lint errors (setState-in-effect) with tests as the safety net, and the confirmed bugs after backend confirmation

**Exit criteria:** lint errors = 0 (or documented exceptions); no file >700 lines in feature folders; all tests green; behavior unchanged (e2e suite confirms).

## Phase 5 — Package updates (last, on a green suite)

- [ ] Re-run `npm outdated` + `npm audit`; fix the critical/high audit items first
- [ ] Minor/patch updates in one batch → build + full test suite
- [ ] Major updates **one at a time**, each followed by build + tests + manual smoke on dev backend (`@tanstack/react-table` 9, `motion` 14, `@microsoft/signalr` 11, `@hookform/resolvers` 7, `lucide-react`, `react-day-picker` 10, `nanoid` 6)
- [ ] Update `CHANGELOG.md` and release notes (`public/releases/`) per repo convention

**Exit criteria:** up-to-date deps, 0 critical/high vulnerabilities, full suite green, deploy checklist in `MDEPLOY.md` still valid.

---

## Working agreement (applies to every phase)

- Live production app → every change is behavior-risk until proven otherwise
- Never commit without explicit request; commit per logical change with a clear message
- Verify after every change: `npm run lint` + `npm run build` + `npx tsc --noEmit` (+ `npm test` once Phase 3 lands)
- Match repo style exactly: tabs width 1, single quotes
- Follow `AGENTS.md` conventions; update it (and these docs) when reality drifts from the docs
