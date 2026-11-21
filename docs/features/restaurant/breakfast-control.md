# Breakfast Control (restaurant)

Route: `/{lang}/{departmentID}/restaurant/{programID}/breakfast-control`
Dictionary: `internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/` (`getBreakfastControlDictionary`, from `breakfast-control/page.tsx`)

## Purpose

Breakfast checklist for hotel-guest breakfast service (restaurant department controlling reception-side breakfast checklists): filters → checklist data → per-item served/not-served toggle. Shown as an extra bottom tab when `routeProgram.systemTypeID === 5`.

## Entry flow

```
breakfast-control/page.tsx (server, getBreakfastControlDictionary)
└─ BreakfastControlWrapper (client — simplest of the restaurant features; no context/provider)
   ├─ RHF filters form (breakfastControlFiltersSchema, debounced via TanStack Pacer useDebouncedValue)
   ├─ two React Query hooks (details + checklist data)
   └─ BreakfastControlFilters + BreakfastControlList → BreakfastControlItem
      (uses updateBreakfastState)
```

## API endpoints (BreakfastControlApiActions.ts)

| Function | Method + Path |
|---|---|
| `getBreakfastControlDetails` | GET `/Reception/BFCheckList/GetBFCheckList` |
| `getBreakfastControlData` | GET `/Reception/BFCheckList/GetBFCheckListData?BFCheckListID[&searchText]` |
| `updateBreakfastState` | GET `/Reception/BFCheckList/UpdateBFCheckListData?BFCheckListDataID=` |

⚠️ `updateBreakfastState` is a GET performing an update — legacy server contract, do not change without backend confirmation.

No SignalR. No permissions used.

## Zod schemas

- `breakfastControlFiltersSchema.ts` — `search: string`, `showServed: boolean`, `showNotServed: boolean`

## Known issues / smells

- `BreackfastControlRes` type-name typo (`BreakfastControlApiActions.ts:8`)
- Uses `/Reception/...` endpoints from the restaurant department (cross-domain borrow from hotel side) — intentional, but note when testing routing
- No separate feature hooks/utils — logic lives in the wrapper; low refactor priority
