# AGENTS.md

## Project Overview

This is a Next.js application built with TypeScript.

The application should prioritize:

- Maintainability
- Type safety
- Clear separation of concerns
- Server-side rendering where appropriate
- Minimal client-side JavaScript
- Reusable components
- Predictable data fetching
- Consistent error handling
- Accessibility
- Performance

Before making significant changes, inspect the existing architecture and follow established patterns rather than introducing a new pattern.

## Project Stack

1. **Next.js (^16)** — App Router framework; typed routes enabled, root `proxy.ts` middleware
2. **TypeScript (^5)** — strict mode; path alias `@/*` → repo root
3. **React (^19)** — UI library
4. **Tailwind CSS (^4)** — CSS-first config in `app/globals.css`; no tailwind.config file
5. **shadcn/ui (new-york style) + Radix UI** — component primitives in `components/ui`
6. **TanStack Query (^5)** — server state / data fetching (Table, Form, Pacer also used)
7. **Axios** — HTTP client through the shared instance in `app/[lang]/(app)/utils/defaultAxios.ts`
8. **@microsoft/signalr (^10)** — realtime hub connections (rooms-rack, salons, notifications)
9. **react-hook-form + @hookform/resolvers** — form state and validation binding
10. **Zod (^4)** — schemas in feature-level `schemas/` folders (e.g. new-order)
