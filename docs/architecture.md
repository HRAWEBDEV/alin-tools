# Architecture

Top-level view of alin-tools. Per-feature detail lives in `features/`. Source of truth for commands/stack/conventions: root [`AGENTS.md`](../AGENTS.md).

## Runtime shape

- Next.js 16 App Router, **all routes under `app/[lang]/...`** (`fa` active; `en` declared inactive). PWA manifest, tablet-first on-premise UI (tablets at restaurant/hotel desks).
- No root `app/layout.tsx` — `app/[lang]/layout.tsx` is the `<html>` shell (fonts, direction, metadata, react-scan in dev).
- Pages are thin async **server components**: load feature dictionary → render client provider/wrapper. All interactivity is client.
- Backend: separate Alin API via one shared axios instance (`app/[lang]/(app)/utils/defaultAxios.ts`, baseURL `NEXT_PUBLIC_API_URI`) + 4 SignalR hubs.

## Provider bootstrap chain (per authenticated page load)

```
proxy.ts (locale redirect, cookie app-locale, default fa)
└─ app/[lang]/layout.tsx (html shell)
   └─ ReactQueryProvider → BaseConfigProvider (theme/contrast/locale/timezone)
      └─ (app)/layout.tsx: ShareDictionaryProvider → AxiosBaseConfig(languageID, apptype) + LoginProvider(global re-login modal) + UserRegionCheck
         └─ login page — OR — (home)/(tablet)/layout.tsx:
            AxiosCredentials(Bearer) → UserInfoRouterProvider → AxiosApiPackage(tenant headers)
            → LoginInterceptor(401/403 → modal) → UserAccessibilityProvider(permissions)
            └─ [departmentID]/restaurant|room-devision/[programID]/ (division layouts + feature pages)
```

## Auth & session

- JWT in non-httpOnly cookie `app-token` (1 year). Login: `POST /Public/UI/GetJwtToken` → `{item1: token, item2: lifetimeSeconds(unused)}`.
- Bootstrap: `GET /Restaurant/Tablet/GetUIDatas` → owners→departments→programs tree (localStorage `user-router-info`); unresolved selection → select-program dialog.
- Permissions: `GET /Restaurant/Tablet/CheckAccess` → `UserAccessibility` (only `restaurant` domain today; room division has no permission checks). In DEVELOPMENT `godMode(true)` replaces the server response with all-true devAccess.
- `LoginInterceptor`: any 401/403 → global login modal. Logout: clear token + storage + `queryClient.clear()`.

## Data flow conventions

- All reads/writes: TanStack Query (`staleTime` 5 min default; retry 0 dev / 3 prod) calling `*ApiActions.ts` functions on the shared axios instance.
- Request headers installed by providers, in order: `languageID`+`apptype:tablet` → `Authorization: Bearer` → `Ownerid/Departmentid/Programid/Systemid`. No centralized error handler — per-call-site `toast.error(err.response?.data)`.
- Query keys: string bases + dynamic parts; some keys rebuilt ad-hoc in several files (known debt).
- Forms: react-hook-form + zodResolver; schemas colocated in feature `schemas/`.

## Realtime

4 SignalR hubs (details per feature doc): `/tablerackchangenotifhub` (restaurant salons), `/datachangenotifHub` + `/roomracknotifhub` (rooms-rack), `/EventBoardChangeNotifHub` (EventBoard, mounted by both divisions' layouts). Common pattern: query-param auth, `withAutomaticReconnect`, `onreconnected` refresh, `visibilitychange` refetch with 60s stale guard, `off`/`stop` cleanup.

## i18n

- Dictionaries in `internalization/app/dictionaries/<feature-path>/` (`dictionary.ts` server-only loader + `fa.json`/`en.json`), typed from `fa.json`.
- **English is not implemented**: all 21 loaders map `en` → `fa.json`; every `en.json` is a `{}` placeholder (except `meta/en.json`, Persian). `locales.en.active = false` hides it from the UI.
- Jalali calendar via `date-fns-jalali` for `fa`.

## Division layouts

Each division `[programID]/layout.tsx` (server) loads its share dictionary and nests: ShareDictionaryProvider → ReleasePreviewProvider (reads `public/releases/{locale}/{department}/v2.4.0.md` via raw axios) → SettingsProvider → ProfileProvider → NotificationsProvider, then renders Header/Nav/Main/Tabs chrome. Tabbed pages (rooms/guests/execution management) keep all tabs mounted with React `<Activity>` and `?tab=` URL state.

## Cross-cutting known risks

See `AGENTS.md` → "Known hotspots & tech debt" for the full backlog with file:line refs (11 lint errors, giant files, duplication map, suspected bugs needing backend confirmation).
