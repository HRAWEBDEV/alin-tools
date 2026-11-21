# Room Control (room division)

Route: `/{lang}/{departmentID}/room-devision/{programID}/room-control`
Dictionaries: `room-control` page dictionary + `rooms-rack/room-control` (loaded by `room-control/page.tsx`)

## Purpose

Standalone housekeeping room-control page: floor/room-type filtered list of room controls; editing reuses the rack's `RoomControl` dialog component (4-step check flow with history).

## Entry flow

```
room-control/page.tsx (server)
└─ RoomControlWrapper (client — owns its own form + queries; no provider)
   ├─ FormProvider(roomControlSchema)
   ├─ queries: getInitialData (init data) + getRoomControls (list)
   ├─ local selection state
   └─ RoomControlFilters + RoomControlList
      └─ room-control/RoomControl (rack-side dialog component, shared)
         └─ RoomControlHistory
```

## API endpoints (room-control/services/roomControlApiActions.ts — page-side)

| Function | Method + Path |
|---|---|
| `getInitialData` | GET `/HouseKeeping/RoomControl/GetData` |
| `getRoomControls` | GET `/HouseKeeping/RoomControl/GetRoomConrols?[floorNo&roomTypeID]` |

The shared edit dialog (from rooms-rack) additionally uses: GET `/HouseKeeping/RoomControl/GetRoomConrol?RoomID=`, POST `.../SaveRoomConrols`, PUT `.../ChangeRoomConrols`, GET `.../GetRoomControlHistory`.

⚠️ `GetRoomConrol` / `GetRoomConrols` / `SaveRoomConrols` — "Conrol" typo is the server contract.

No SignalR. No permissions.

## Zod schemas

- `roomControlSchema.ts` — page filters: `floor`, `roomType`

## Known issues / smells

- `RoomControlFilters.tsx` (504 lines) for just 2 filters — massively over-sized; includes unused `setSearchedText` state (line 36). Reduce with the shared filter-field component (Phase 4)
- Lint error: shared `RoomControl.tsx:215` (`set-state-in-effect`, syncing form state from server data in a broad effect)
- Duplicated endpoint table between this doc and rooms-rack.md — the rack-side `roomControlApiActions.ts` and page-side `roomControlApiActions.ts` are separate files in different folders with partially overlapping endpoints
