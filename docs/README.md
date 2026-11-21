# alin-tools Documentation

Generated from the full codebase scan (2026-11-21). Per-feature docs live in `features/`. Agent-facing repo guidance lives in the root [`AGENTS.md`](../AGENTS.md).

## Index

- [how_to_integrate_ai.md](./how_to_integrate_ai.md) — the AI modernization plan (Phases 0–5)
- [architecture.md](./architecture.md) — top-level architecture: routing, auth bootstrap, data flow, realtime, i18n

### Features

Restaurant division (`/{lang}/{departmentID}/restaurant/{programID}/`):

- [salons.md](./features/restaurant/salons.md) — table rack (halls, tables, SignalR, table payment)
- [new-order.md](./features/restaurant/new-order.md) — order taking, order info form, invoice/payment
- [breakfast-control.md](./features/restaurant/breakfast-control.md) — breakfast checklist

Room division (`/{lang}/{departmentID}/room-devision/{programID}/`):

- [rooms-rack.md](./features/room-devision/rooms-rack.md) — rooms rack (2 SignalR hubs, filters, room menu)
- [room-control.md](./features/room-devision/room-control.md) — housekeeping room control page
- [rooms-management.md](./features/room-devision/rooms-management.md) — tabs: statistics, entrance & exit, out-of-order
- [guests-management.md](./features/room-devision/guests-management.md) — tabs: resident guests, arrival reserves, guest expenses
- [execution-management.md](./features/room-devision/execution-management.md) — tabs: daily tasks, guest checkout checklist
- [notifications.md](./features/room-devision/notifications.md) — EventBoard notification hub (reused by restaurant)

## Conventions for these docs

Each feature doc contains: purpose & entry flow, API endpoints (method + path from `*ApiActions.ts`), SignalR hub/events where relevant, Zod schemas, hooks, permissions, and a "Known issues / smells" section that feeds the Phase 4 refactor backlog in `AGENTS.md`.

Endpoint and hub details reflect the code as of the 2026-11-21 scan. Server-side typo params (`saleTiemID`, `searchParams`, `GetRoomConrol`, `GetAssinableContracts`) are intentional API contracts — see `AGENTS.md` before "fixing" them.
