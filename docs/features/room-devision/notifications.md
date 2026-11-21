# Notifications — EventBoard (room division, reused by restaurant)

Provider: `room-devision/services/notifications/` (`NotificationsProvider.tsx` + `notificationsContext.ts` + `notificationApiActions.ts` + `schemas/newNotificationSchema.ts`)
Mounted by **both** division layouts: `room-devision/[programID]/layout.tsx` and `restaurant/[programID]/layout.tsx` (imported across division folders).

## Purpose

Notification drawer over the EventBoard: lists event-board entries (infinite query), lets authorized users create/update/delete board events, plays a sound + toast when new notifications arrive.

## Component flow

```
NotificationsProvider (mounted in division layout)
├─ owns: isOpen state, init-data query, infinite event-board query, SignalR connection
├─ renders: Notifications Drawer → NotificationsWrapper
│           (list + NewNotificationDialog with newNotificationSchema)
└─ side effect: on event count increase → play /sounds/notification-sound.mp3 + toast.success
```

## API endpoints (notificationApiActions.ts)

| Function | Method + Path |
|---|---|
| `getInitialData` | GET `/Public/EventBoard/GetData` |
| `getEventBoard` | GET `/Public/EventBoard/GetEventBoard?limit&offset[&programID&userID]` |
| `saveEventBoard` | POST `/Public/EventBoard/SaveEventBoard` |
| `updateEventBoard` | PUT `/Public/EventBoard/UpdateEventBoard` |
| `deleteEventBoard` | DELETE `/Public/EventBoard/RemoveEventBoard?EventBoardID=` |

## SignalR

Hub: `/EventBoardChangeNotifHub` (standard query-param auth; `withAutomaticReconnect`; `off`/`stop` cleanup; no invoke — server pushes).

- `EventBoardChanged` → `refetch()` of the infinite event-board query
- `EventBoardUpdated` → **empty handler (dead code, line 166)**

## State shape

Context `useNotificationContext()`: `isOpen`, `toggleProfile`, `initialData`, `eventBoards` (InfiniteData + hasNextPage/fetchNextPage/isFetching/refetch/onInvalidateEventBoard).

## Zod schemas

- `newNotificationSchema.ts` — `title`, `description` min 1 (for `NewNotificationDialog.tsx`)

## Known issues / smells

- Dead empty `EventBoardUpdated` handler (`NotificationsProvider.tsx:166`)
- The provider is imported cross-division (`restaurant/[programID]/layout.tsx:12`) — candidate to lift into a shared location during Phase 4 dedupe
- Naming: context exposes `toggleProfile` (copy-paste from profile provider) for a notification drawer
