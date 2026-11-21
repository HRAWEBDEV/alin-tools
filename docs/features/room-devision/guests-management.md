# Guests Management (room division)

Route: `/{lang}/{departmentID}/room-devision/{programID}/guests-management`
Dictionaries: `guests-management`, `resident-guests`, `arrival-reserves`, `guests-expenses` (loaded by `guests-management/page.tsx`)

## Purpose

Tabbed page (React `<Activity>`, `?tab=` state, default `guests-list`) with three front-desk features: resident guests list, arrival reservations, and guest expense charging.

```
guests-management/page.tsx (server; tab-aware generateMetadata)
└─ GuestsMangementWrapper → GuestsManagementTabs + GuestsManagementSlot
   ├─ ?tab=guests-list    → resident-guests/.../GuestsListWrapper
   ├─ ?tab=arrival-reserves → arrival-reserves/.../ArrivalReservesWrapper
   └─ ?tab=guests-expenses → guests-expenses/.../GuestsExpensesWrapper
```

## Tab 1 — Resident guests

- FormProvider(`residentGuestsSchema`): folio, reserveNo, nationality, specialGuest, group, room; debounced form watch (`useDebounce`)
- Init-data + residents queries; **client-side paging** (slices `page * PAGE_SIZE`); filters + list + `GuestDetailDrawer`
- `guestsListApiActions.ts`:
  - GET `/Reception/ResidentGuest/GetDatas`
  - GET `/Reception/ResidentGuest/GetResidentGuests?<searchQueryValues>`

## Tab 2 — Arrival reserves

- FormProvider(`arrivalReservesSchema`): date, roomTypeID, customerID, booleans (withRoomNo, withoutRoomNo, charged, notCharged, noShow, canceled); debounced watch
- Init-data query runs `getInitDatas` + `getCustomers` in parallel; **infinite** `getReserveRooms`; filters + list + `ArrivalReserveDrawer` (uses shared `DetailRow`)
- `arrivalReservesApiActions.ts`:
  - GET `/Reception/ArrivalReserves/GetDatas?<searchQueryValues>`
  - GET `/Reception/ArrivalReserves/GetCustomers?<searchQueryValues>` (module-level `AbortController` aborts previous)
  - GET `/Reception/ArrivalReserves/GetReserveRooms?<searchQueryValues>`

## Tab 3 — Guests expenses

- FormProvider(`guestsExpensesSchema`): room, item, date; debounced watch
- Init-data query (rooms + items), then `getRegisterRoomNight` → `getRegisterInfo` chain, revenues query
- Drawer `GuestsExpensesActionDrawer` (511 lines): create/edit/view/delete/revert modes with 4 mutations + internal zod `expenseFormSchema` (also duplicated in `ExpenseCreateOrEditForm.tsx`, 562 lines)
- `guestsExpensesApiActions.ts`:
  - GET `/HouseKeeping/ChargingTheCost/GetRooms?Limit&Offset`
  - GET `.../GetItems?Limit&Offset`
  - GET `.../GetRevenues?[date&itemID&roomID]`
  - GET `.../GetRegisterRoomNight?RoomID=`
  - GET `.../GetRegisterInfo?RegisterID=`
  - POST `.../SaveRegisterRevenue`; PUT `.../UpdateRegisterRevenue`
  - POST `.../RevertRevenue?RevenueID=`; DELETE `.../RemoveRevenue?RevenueID=`

No SignalR. No permissions.

## Known issues / smells

- `GuestsExpensesActionDrawer.tsx` (511) ≈ `ExpenseCreateOrEditForm.tsx` (562): duplicated schema + drawer-mode concepts → merge into one form + `ExpenseReadonlyDetails`
- `GuestsListWrapper.tsx:67-75`: fetch-all then client-side slicing (paging inconsistency)
- `GuestsExpensesWrapper.tsx:138-140`: spreads `data?.flatMap((page) => page || [])` as if paged, but uses plain `useQuery`
- Local `ApiPagedData` type defined at `arrivalReservesApiActions.ts:13` although `PagedData` exists in `room-devision/utils/apiTypes.ts`
- `Revenue`/`Invoice` types duplicated with rooms-rack `guestExpensesApiActions.ts`
- `GuestsExpensesFilters.tsx` (418) — repeated filter pattern
- Wrapper class name typo: `GuestsMangementWrapper`
