# Salons — Table Rack (restaurant)

Route: `/{lang}/{departmentID}/restaurant/{programID}/salons`
Dictionary: `internalization/app/dictionaries/(tablet)/restaurant/salons/` (`getSalonsDictionary`, from `salons/page.tsx`)

## Purpose

The restaurant table rack: halls → tables with live state (free/occupied/reserved...), table reports, and the entry point for new orders (deep-links into new-order with salon/table context). Also hosts table payment (POS) and close-order flows.

## Entry flow

```
salons/page.tsx (server, getSalonsDictionary)
└─ SalonBaseConfigProvider (client — salons/services/salon-base-config/)
   ├─ owns: init-data query, SignalR connection, hall selection,
   │        table filters, modal state, close-order mutation, URL param sync
   ├─ renders: TablePaymentModal (gated by restaurant.order.payment), close-order confirm Dialog
   └─ SalonsWrapper
      ├─ SalonsFilters (hall select, filters, tables report)
      └─ SalonTables → SalonTable (per-table card; fetches getTableOrders per table)
         └─ MergeTableModal, TransferTableModal, ChangeTableStateModal,
            TableOrders, PaymentInvoice / PaymentShop / PaymentOrderInfo
```

Also uses `useOrderRedirectLink` (`salons/hooks/`) to build new-order deep links (`?salonID&salonName&tableID&tableNo&fromSalons=true`).

## API endpoints (salonsApiActions.ts, key `restaurant-halls`)

| Function | Method + Path |
|---|---|
| `getInitialData` | GET `/Restaurant/RackTable/GetInitDatas` |
| `changeTableStateType` | PUT `/Restaurant/RackTable/UpdateTableStateType` |
| `transferTable` | GET `/Restaurant/TableTransfer/TransferTable?orderID&tableID` |
| `mergeTable` | POST `/Restaurant/RackTable/MergeOrder?masterOrderID&mergeOrderID` |
| `getTableOrders` | GET `/Restaurant/Tablet/ReadMultipleOrderData?tableID` |

Order data shared with new-order via `closeOrder` from `newOrderApiActions.ts` (`POST /Restaurant/SaleInvoice/CloseOrder?orderID=`).

⚠️ `changeTableStateType` sends **both** `saleTiemID` (typo) and `saleTimeID` (lines 108/112) — API contract; see AGENTS.md.

## SignalR

Hub: `/tablerackchangenotifhub` (query params `token, programid, departmentid, ownerid, systemid`), built in `SalonBaseConfigProvider.tsx` after init-data query succeeds.

- Invoke: `GetOrderBoardUpdate(connectionId, hall, defaultSaleTimeID, date)` on connect / hall change
- `TableRackUpdated` → replaces the whole tables array
- `TableRackChanged` → re-invoke `GetOrderBoardUpdate`
- `onreconnected` → refetch; `visibilitychange` → refetch if stale >60s; cleanup `off`/`stop`

## Permissions (`userAccessibility['restaurant']`)

- `table.merge` — gates merge modal; `table.change` — gates transfer modal
- `order` + `table` published wholesale as provider `access`
- `order.payment` — gates rendering `TablePaymentModal`

## State shape

Context `SalonBaseConfig`: `initData`, `salonsSettings` (localStorage `salons-settings`), `hallsInfo` (selected hall + paging), `tablesInfo` (data/filtered, filters, report, 15 modal/handler controls), `access`.

## Known issues / smells

- `SalonBaseConfigProvider.tsx` (558 lines) mixes queries + SignalR + modal state machine + URL sync; `tablesInfo` context has 30 members → wide re-renders
- Close-order confirm Dialog copy-pasted from `OrderBaseConfigProvider.tsx:1331-1374`
- `generateTableMockData` mock-table factory still wired into UI paths (`salonsApiActions.ts:54-88`)
- `SalonTable.tsx:50` unused `showPrintInvoice` state (half-removed print feature)
- Duplicated ad-hoc query key `[getHallKey, 'ordersList', tableID]` (also built in `TablePaymentModal.tsx`, `NewOrderHeader.tsx`, `OrderBaseConfigProvider.tsx`)
- Lint error: `restaurant/components/NavWrapper.tsx:13` (`set-state-in-effect`, layout twin)
- No Zod schemas (filters are untyped useState + URL params)
