# Rooms Rack (room division)

Route: `/{lang}/{departmentID}/room-devision/{programID}/rooms-rack`
Dictionaries: `rooms-rack`, `room-statistics`, `rooms-rack/room-control`, `out-of-order-rooms` (all loaded by `rooms-rack/page.tsx`)

## Purpose

The hotel rooms rack: live room grid (state kind/type, in/out, occupancy), filter sidebar, paging, per-room action menu (guests, messages, notes, expenses, room control, out-of-order), and a realtime notifications board (alarms, birthdays, guest messages).

## Entry flow

```
rooms-rack/page.tsx (server, 4 dictionaries)
└─ RoomsRackConfigProvider (rooms-rack/services/rooms-rack-config/ — 940 lines)
   ├─ FormProvider(rackFiltersSchema) + URL-param sync
   ├─ 2 SignalR connections (rack rooms + rack report)
   ├─ renders RoomMenu + RackNotifsBoard
   └─ RoomsRackWrapper
      ├─ RackSidebar → RackFilters (1,015 lines, 12 filter blocks) / RackInfo / RackHelp
      ├─ RackTools
      └─ RackRooms → RackRoom → RoomStateKind/RoomStateType + RoomMenu (509 lines)
         └─ nested drawers/dialogs:
            RoomGuestsWrapper, RoomGuestMessagesWrapper, RoomNotesWrapper (566),
            GuestExpenses → StayExpenses/NewStayExpense (718) + RevenueExpenses → InvoiceDetails/NewInvoice (540),
            RoomControl (539), OutOfOrder drawers
```

## API endpoints

### roomsRackApiActions.ts

| Function | Method + Path |
|---|---|
| `getInitialData` | GET `/Reception/Rack/GetInitData` |
| `getRackInfo` | GET `/Reception/Rack/GetRackInfo?date=` |
| `changeRoomStateKind` | GET `/Reception/ChangeRoomStateKind/SaveState?Date&RoomID&Kind` |
| `changeRoomStateType` | GET `/Reception/ChangeRoomStateType/SaveState?Date&RoomID&TypeID` |

### Sub-feature actions (all under rooms-rack/services/)

| File | Endpoints |
|---|---|
| `guests/roomGuestsApiActions.ts` | GET `/Reception/RegisterGuest/GetRegisterGuests?RegisterID=` |
| `guest-messages/roomGuestMessagesApiActions.ts` | GET `/Reception/RegisterMessage/GetDatas`; DELETE `.../RemoveRegisterMessage`; POST `.../ChangeToRead`; POST `.../SaveRegisterMessage`; PUT `.../UpdateRegisterMessage` |
| `room-notes/RackRoomNotesApiActions.ts` | GET `/Reception/RoomMessage/GetDatas`; GET `.../GetPagedMessages`; POST `.../SaveRoomMessage`; PUT `.../UpdateRoomMessage` / `.../ActiveRoomMessage` / `.../DisableRoomMessage`; DELETE `.../DeletedRoomMessage` |
| `room-control/roomControlApiActions.ts` | GET `/HouseKeeping/RoomControl/GetRoomControlHistory`; GET `.../GetRoomConrol?RoomID=` (typo = server contract); GET `.../GetRoomConrols`; POST `.../SaveRoomConrols`; PUT `.../ChangeRoomConrols` |
| `guest-expenses/guestExpensesApiActions.ts` | GET `/Reception/RoomGuestCost/GetInitDatas`; GET `.../GetItemRevenues`; POST `.../SaveRegisterRevenue`; PUT `.../UpdateRegisterRevenue`; GET `.../GetProgramRevenues`; GET `.../GetProgramDetailRevenues?orderID=`; POST `.../SaveProgramRegisterRevenues`; GET `.../GetItems`; GET `.../GetProgramAccountSide`; GET `.../GetItemPrograms` |

## SignalR (2 hubs, both in RoomsRackConfigProvider.tsx)

| Hub | Invoke | Events |
|---|---|---|
| `/datachangenotifHub` | `GetRackUpdate(connectionId, limit, offset+1, filters)` | `RackLastUpdate` → set rack rooms/details/rowsCount, refetch rackInfo; `RackChanged` → re-invoke |
| `/roomracknotifhub` | `GetNotifUpdate(connectionId)` | `NotifUpdate` → rackReport state (alarms/birthdates/messages → RackNotifsBoard); `NotifChanged` → refetch + sound `/sounds/notification-sound.mp3` |

Both: `onreconnected` re-invoke, `visibilitychange` refetch with 60s stale guard, `off`/`stop` cleanup.

## Zod schemas (`schemas/`)

- `rackFiltersSchema.ts` — rackType, showType (`current|future`), date, roomType, building, floor, roomStateGroup/Type/Kind, roomStateInOutState, customers
- `room-notes/roomNotesSchema.ts` — note filters + form (noteType required, noteState enum, comment min 1)
- `room-guest-message/roomGuestMessageSchema.ts` — fromPerson/toPerson/comment
- `guest-expenses/*` — guestExpensesSchema, guestExpensesInvoice, invoiceDetailsFiltersSchema, newStayExpenseSchema (item required, amount ≥ 1, price > 0, discount ≤ 100), newInvoiceSchema

## State shape

Context `useRackConfigContext()`: `sidebar` (pin/open/activePanel), `initData`, `rackInfo` (occupancy gauges), `noteTypes`, `rack` (data, view, selectedRoom, showRackMenu, loading flags, paging, rowsCount, lastUpdate, rackDetails), `rackReport` (realtime board data), `rackReportIsLoading`.

## Permissions

**None** — `userAccessibility` is not wired into room division (only restaurant). Actions gated by data state only.

## Known issues / smells

- `RoomsRackConfigProvider.tsx` (932): duplicated `customersValue` URL-sync block (703-717, copy-paste bug) — split target (useRackConnection/useRackReportConnection/useRackFiltersForm/useRackSettings)
- `RackFilters.tsx` (1,015): 12 repeated Controller+Drawer blocks → config-driven `RackFilterField`
- `RoomMenu.tsx` (509): receives ~20 props (8 show/hide pairs) — prop drilling
- Filter-drawer pattern also repeated in `OutOfOrderRoomsFilters.tsx` (533) and `RoomControlFilters.tsx` (504)
- Lint error: `RoomControl.tsx:215` (`set-state-in-effect`)
- Unused lint warnings: `RoomControlFilters.tsx:36`
- CSS vars here reuse `--app-restaurant-*` names (copy-paste origin)
- `Duplicated Revenue`/`Invoice` types vs guests-management apiActions
