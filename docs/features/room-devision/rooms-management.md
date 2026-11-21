# Rooms Management (room division)

Route: `/{lang}/{departmentID}/room-devision/{programID}/rooms-management`
Dictionaries: `rooms-management`, `room-statistics`, `entrance-and-exit-rooms`, `out-of-order-rooms` (loaded by `rooms-management/page.tsx`)

## Purpose

Tabbed page with three housekeeping features kept mounted via React `<Activity>`; active tab in `?tab=` (default `rooms-statistics`).

```
rooms-management/page.tsx (server)
└─ RoomsManagementWrapper → RoomsManagementTabs + RoomsManagementSlot
   ├─ ?tab=rooms-statistics     → RoomsStatisticsWrapper
   ├─ ?tab=entrance-and-exit    → EntranceAndExitRoomsWrapper
   └─ ?tab=out-of-order         → OutOfOrderRoomsWrapper
```

No shared provider — each wrapper owns form + queries (RHF FormProvider pattern).

## Tab 1 — Rooms statistics

- Query `getRoomsStatistics`; date picker + stat cards
- `roomsStatisticsApiaActions.ts`: GET `/Reception/RoomsStatists/GetDatas?date=` (filename also has a typo: `ApiaActions`)
- Known issue: `RoomsStatisticsWrapper.tsx` renders `dic.status.locked`/`lockeOut` twice (230-243) and reuses `dic.arrival.notRegistered` in the status card (193)

## Tab 2 — Entrance & exit rooms

- FormProvider(`entranceAndExitSchema`): date, type (`entrance|exit`), floor, roomType
- Init-data query + rooms query; filters + list
- `entranceAndExitApiActions.ts`:
  - GET `/Reception/CheckInCheckOutRooms/GetDatas`
  - GET `/Reception/CheckInCheckOutRooms/GetCheckinCheckouRooms?date&checkin&checkout&all=true&registered=false&notRegistered=false[&floorNo&roomTypeID]`

## Tab 3 — Out-of-order rooms

- FormProvider(`outOfOrderRoomsSchema`): fromDate, toDate (required), room (required), reason (required), roomType, floor, comment
- Init-data query + **infinite** rooms query; filters (533 lines) + list + `NewOutOfOrderRoom` (611 lines, create/edit dialog)
- `outOfOrderApiActions.ts`:
  - GET `/Reception/OutOfOrder/GetDatas`
  - GET `.../GetOutOfOrderByRoomID?RoomID=`
  - GET `.../GetOutOfOrders?limit&offset&fromDate&toDate[&floorNo&roomID&roomTypeID]`
  - POST `.../SaveOutOfOrder`; PUT `.../UpdateOutOfOrder`; DELETE `.../RemoveOutOfOrder?OutOfOrderID=`; PUT `.../UpdateOutOfOrderExpireDate?RoomID=`

No SignalR. No permissions.

## Known issues / smells

- `OutOfOrderRoomsFilters.tsx` (533) — repeated Controller+Drawer filter blocks → shared filter-field target
- `NewOutOfOrderRoom.tsx` (611) — create vs edit flow mixed; mutations should move to a `useOutOfOrderMutations` hook
- Paging inconsistency vs other tabs (useQuery here, useInfiniteQuery in out-of-order)
- `EntranceAndExitFilters.tsx` (493) — same filter pattern again
