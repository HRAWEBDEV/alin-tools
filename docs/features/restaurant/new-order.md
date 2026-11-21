# New Order (restaurant)

Route: `/{lang}/{departmentID}/restaurant/{programID}/new-order`
Dictionary: `internalization/app/dictionaries/(tablet)/restaurant/new-order/` (`getNewOrderDictionary`, from `new-order/page.tsx`)

## Purpose

Order taking: item programs/categories → order items → order-info form (sale time, waiter, table/room/delivery, customer/contract/subscriber, discounts, service) → confirm modal with tabs (OrderInfo / OrderShoppingCard / OrderInvoice) → save / close / payment (POS + wallet), invoice/cash printing.

## Entry flow

```
new-order/page.tsx (server, getNewOrderDictionary)
└─ NewOrderWrapper (client)
   └─ OrderBaseConfigProvider (services/order-tools/ — 1,415 lines, god provider)
      ├─ all order queries/mutations, order-info FormProvider (RHF),
      │  order-items reducer, pricing calculator wiring, settings, 2 confirm dialogs
      └─ NewOrderContrainer (split-panel layout)
         ├─ NewOrderHeader, OrderTools, OrderCategories, OrderItems
         ├─ ConfirmOrderModal (tabs: OrderInfo → order-info/OrderInfo.tsx (1,377 lines),
         │                     OrderShoppingCard → OrderShoppingCard,
         │                     OrderInvoice → order-invoice/OrderInvoice.tsx (917 lines))
         ├─ QuickConfirmOrderDialog
         └─ 8 find-* pickers (rooms, subscribers, customers, waiters, employees,
            contracts, customer-contracts, tags), PrintInvoiceDialog, FoodImageDialog, OTPCodeList
```

## API endpoints

### newOrderApiActions.ts (756 lines; ~40% type definitions; keys `restaurant-new-order`, `person`)

| Function | Method + Path |
|---|---|
| `getInitData` | GET `/Restaurant/SaleInvoice/GetInitDatas` |
| `getItemPrograms` | GET `/Restaurant/SaleInvoice/GetAllItemPrograms` |
| `getFreeTables` | GET `/Restaurant/tablet/GetAllocatableTables` |
| `getOrder` | GET `/Restaurant/SaleInvoice/GetOrder?orderID=` |
| `getOrderItems` | GET `/Restaurant/SaleInvoice/GetOrderItems?orderID=` |
| `saveOrder` | POST `/Restaurant/tablet/SaveOrder` / PUT `/Restaurant/tablet/UpdateOrder` |
| `getOrderServiceRates` | GET `/Restaurant/SaleInvoice/GetServiceDiscountRates` |
| `closeOrder` | POST `/Restaurant/SaleInvoice/CloseOrder?orderID=` |
| `getOrderPayment` | GET `/Restaurant/SaleInvoice/GetOrderCashPrePayment?orderID=` |
| `getSubscribers` | GET `/Restaurant/Subscriber/GetPagedSubscribers` ⚠️ param literally `searchParams` |
| `getCustomers` | GET `/Restaurant/SaleInvoice/GetPagedCustomers` |
| `getContracts` | GET `/Restaurant/SaleInvoice/GetPagedContractMenus` |
| `getRooms` | GET `/Restaurant/SaleInvoice/GetRegisterGuests` |
| `getTags` | GET `/Restaurant/SaleInvoice/GetPagedTags` |
| `getWaiters` | GET `/Restaurant/SaleInvoice/GetPagedWaiters` |
| `getPerson` | GET `/Public/Person/ReadPersonByKey?personID=` |
| `getPersonByNumber` | GET `/Restaurant/Tablet/ReadPersonByNumber?phoneNumber=` |
| `savePerson` | POST `/Restaurant/Tablet/SavePersonSubscriber` |
| `getCustomerContract` | GET `/Restaurant/Tablet/GetAssinableContracts` (typo = server contract) |
| `getEmployeeCustomer` | GET `/Restaurant/Tablet/GetEmployeeCustomer` |
| `getPagedEmployee` | POST `/Restaurant/Tablet/GetPagedEmployees` |
| `getOrderOtpCodes` | GET `/Restaurant/SaleInvoice/GetOTPCodes?orderID=` |
| `printNewOrderInvoice` | GET `/Restaurant/SaleInvoice/GenerateOrderReport?OrderID=` (blob) |
| `printNewOrderCash` | POST `/Restaurant/SaleInvoice/ManualSendPrint` (blob) |

### orderInvoicePaymentApiActions.ts (key `restaurant-new-order-payment`)

| Function | Method + Path |
|---|---|
| `getOrderInvoicePaymentInitData` | GET `/Restaurant/CloseOrder/GetInitDatas` |
| `getPcPoses` | GET `/Restaurant/Tablet/GetPCPos?bankID=` |
| `sendToPcPos` | POST `/Restaurant/CloseOrder/SendToPosWithSave` |
| `saveAndCloseOrder` | POST `/Restaurant/CloseOrder/SaveOrderAndClose` |

### orderWalletApiActions.ts

| Function | Method + Path |
|---|---|
| `getWalletInfo` | GET `/Public/Cash/GetWalletCredit?sValue&mobileNo&otpCode` |
| `sendWalletOtpCode` | GET `/Public/Cash/SendWalletOTPMessage?mobileNo` |

No SignalR in this feature.

## Zod schemas (`schemas/`)

- `orderInfoSchema.ts` — the full order-info form: nullable combo objects (saleTime, waiter, contract, customerContract, subscriber, room, customer, saleType, table, employee), `'' | number` numerics (persons, discountRate, fixedDiscount, bonNo, rounding, employeeTip, deliveryValue), booleans (hasService, hasTableNo, sendToKitchen, printCash, deliveryAgent); cross-field refines (names required when phone entered; room for saleType `room`; employee for `employee`; subscriber for `delivery`)
- `orderInvoicePaymentSchema.ts` — payment dialog (paymentType, bank, cardReader/posTablet, paymentRefNo, otpCode for wallet, walletKey)
- `wallet/invoiceWalletSchema.ts` — wallet phone number

## Hooks

- `useNewOrderPrintInvoice.ts` / `useNewOrderPrintCash.ts` — mutation → blob-open print; near-identical (dedupe target)

## Permissions (`userAccessibility['restaurant']`)

- `order.close` gates close; `order.edit` vs `order.add` chooses the save gate; `order.payment` gates payment
- `orderItem` published as `shopItem` for shopping components

## Known issues / smells

- `OrderBaseConfigProvider.tsx` (1,415 lines): dead empty effect (1204-1209), triple-duplicated `getQueriesData` block (350-395), 115-line `validateOrderInfo` with inline `savePerson` side effect, 120-line form-sync effect — split target (useOrderQueries/usePersonLookup/useOrderFormSync/useOrderMutations)
- `OrderInfo.tsx` (1,377 lines): ~10 copy-pasted Drawer picker blocks → generic `DrawerPickerField`
- `orderItemsActionsReducer.ts`: DOM side effects (`document.querySelector` + `setTimeout` scroll) inside the reducer; dangling `// TODO should calculate prices`
- `newOrderApiActions.ts:421` `searchParams` param — suspected should be `searchText`; **confirm with backend before changing**
- React Compiler: `OrderBaseConfigProvider.tsx:147`, `OrderInvoice.tsx:94` use RHF `watch()` → compiler excluded (expected `incompatible-library` warnings)
- Pricing logic in `utils/orderItemsPricingCalculator.ts` — flagged in baseline lint; prime unit-test target (Phase 3)
