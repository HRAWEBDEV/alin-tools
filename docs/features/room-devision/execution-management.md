# Execution Management (room division)

Route: `/{lang}/{departmentID}/room-devision/{programID}/execution-management`
Dictionaries: `execution-management`, `guest-checkout-checklist`, `daily-tasks-checklist` (loaded by `execution-management/page.tsx`)

## Purpose

Tabbed page (React `<Activity>`, `?tab=` state, default `daily-tasks-checklist`) with two housekeeping checklists: daily tasks (maid cleaning) and guest checkout checklist.

```
execution-management/page.tsx (server)
└─ ExecutionManagementWrapper → ExecutionManagementTabs + ExecutionManagementSlot
   ├─ ?tab=daily-tasks-checklist → DailyTasksChecklistWrapper
   └─ ?tab=guest-checkout-checklist → GuestCheckoutChecklistWrapper
```

## Tab 1 — Daily tasks checklist

- FormProvider(`dailyTasksSchema`): date, roomType, maid, timeNo enum (`firstTurn`…); init-data query auto-selects maid via `useEffect`+`setValue`
- Daily-tasks query; filters + list + `DailyTaskPreview` (note create/update/remove dialog)
- `dailyTasksApiActions.ts`:
  - GET `/HouseKeeping/DailyTasksCheckList/GetDatas`
  - GET `.../GetDailyTasks?date&maidID[&roomTypeID&timeNo]`
  - GET `/HouseKeeping/HouseKeepingNote/GetNote?DailyTaskDataID=`
  - DELETE `.../RemoveNote?DailyTaskNoteID=`
  - POST `.../SaveNote`
  - POST `.../UpdateNote` ⚠️ POST for an update — confirm with backend before "fixing"

## Tab 2 — Guest checkout checklist

- FormProvider(`checkoutChecklistSchema`): fromDate, toDate, room + maid (required via refines), comment
- Init-data query + **infinite** checklist query; filters + list + `NewGuestCheckoutChecklist` (437 lines)
- `guestCheckoutChecklistApiActions.ts`:
  - GET `/HouseKeeping/CheckOutList/GetData`
  - GET `.../GetCheckOutCheckLists?limit&offset&fromDate&toDate[&maidID&roomID]`
  - POST `.../SaveCheckOutCheckList`; PUT `.../UpdateCheckOutCheckList`
  - DELETE `.../RemoveCheckOutCheckList?CheckoutListID=`
  - GET `.../GetRegister?roomID&date`

No SignalR. No permissions.

## Known issues / smells

- Lint error: `DailyTaskPreview.tsx:112` (`set-state-in-effect` — syncing note comment state from target note)
- Lint error: `DailyTasksChecklistWrapper.tsx` (baseline)
- `DailyTasksFilters.tsx` (423) and `GuestCheckoutChecklistFilters.tsx` (449) — repeated filter-drawer pattern
- `updateNote` POST-for-update (see table) — potential API bug candidate list
- Paging inconsistency (useQuery here, useInfiniteQuery in checkout)
