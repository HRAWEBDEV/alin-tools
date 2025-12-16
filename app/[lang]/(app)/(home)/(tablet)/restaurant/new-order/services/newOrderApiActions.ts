import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import type { Combo, PagedData } from '../../utils/apiTypes';

const newOrderKey = 'restaurant-new-order';

interface InitialData {
 orderId: number;
 bonNo: number;
 dailyNo: number;
 orderNo: number;
 orderStateID: number;
 orderCashPrePayment: number;
 defaultSaleTimeID: number;
 defaultSaleTypeID: number;
 itemGroups: ItemGroup[];
 saleTimes: Combo[];
 saleTypes: Combo[];
 salons: Combo[];
 tables: Combo[];
 waiters: Combo[];
 sendToKitchen: boolean;
 printToCashbox: boolean;
}

type OrderServiceRates = {
 serviceRate: number;
 discountRate: number;
} | null;

type ItemGroup = Combo;
interface ItemProgram {
 id: number;
 itemID: number;
 itemCode: number;
 taxRate: number;
 serviceRate: number;
 price: number;
 itemName: string | null;
 isContract?: boolean;
 imageURL?: string | null;
}

interface Order {
 id: number;
 registerID: number | null;
 orderTypeID: number;
 saleTypeID: number;
 saleTimeID: number | null;
 customerID: number | null;
 customerName: string | null;
 customerCode: string | null;
 contractMenuID: number | null;
 contractMenuName: string | null;
 subscriberPersonID: number | null;
 employeePersonID: number | null;
 orderDateTimeOffset: string;
 dateTimeDateTimeOffset: string;
 orderNo: number;
 dailyNo: number;
 orderStateID: number;
 name: string | null;
 discountRate: number | null;
 tableID: number | null;
 tableNo: number | null;
 bonNo: number | null;
 seatID: number | null;
 persons: number | null;
 waiterPersonID: number | null;
 waiterPersonFullName: string | null;
 comment: string | null;
 sValue: number;
 discount: number;
 service: number;
 tax: number;
 roundingValue: number;
 delivaryValue: number;
 tipValue: number;
 payableValue: number;
 payment: number;
 arzID: number;
 saleTypeName: string | null;
 saleTimeName: string | null;
 roomLabel: string | null;
 subscriberCode: number | null;
 subscriberPersonFullName: string | null;
 deliveryByAgent: boolean;
 occupied: boolean;
 personID: number | null;
}

interface OrderItem {
 id: number;
 itemID: number;
 itemCode: number;
 itemName: string | null;
 orderID: number;
 price: number;
 amount: number;
 sValue: number;
 discount: number;
 service: number;
 tax: number;
 netValue: number;
 discountRate: number;
 serviceRate: number;
 taxRate: number;
 tagID: number | null;
 tagComment: string | null;
}

type SaveOrderPackage = {
 order: Omit<
  Order,
  | 'saleTypeName'
  | 'saleTimeName'
  | 'waiterPersonFullName'
  | 'customerName'
  | 'roomLabel'
  | 'subscriberCode'
  | 'subscriberPersonFullName'
  | 'tableNo'
  | 'contractMenuName'
  | 'customerCode'
 >;
 orderItems: OrderItem[];
};

interface Subscriber {
 personID: number;
 disabled: boolean;
 code: number;
 name: string;
 address: string | null;
 email: string | null;
 fatherName: string | null;
 genderID: number | null;
 mobileNo: string | null;
 nationalCode: string | null;
}

interface Customer {
 id: number;
 name: string;
 code: string;
}

interface Room {
 id: number;
 registerID: number;
 roomLabel: string;
 guestFullName: string;
}

interface Tag {
 id: number;
 comment: string;
}

function getInitData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Restaurant/SaleInvoice/GetInitDatas', {
  signal,
 });
}

function getItemPrograms({
 signal,
 itemGroupID,
 contractMenuID,
 orderDateTime,
}: {
 signal: AbortSignal;
 itemGroupID: number;
 contractMenuID: number | null;
 orderDateTime: string;
}) {
 const searchParams = new URLSearchParams([
  ['itemGroupID', itemGroupID.toString()],
  ['orderDateTime', orderDateTime],
 ]);
 if (contractMenuID) {
  searchParams.set('contractMenuID', contractMenuID.toString());
 }
 return axios.get<ItemProgram[]>(
  `/Restaurant/SaleInvoice/GetItemPrograms?${searchParams.toString()}`,
  { signal },
 );
}
// get Free tables
function getFreeTables({
 salonID,
 saleTimeID,
 orderDate,
 signal,
}: {
 salonID?: string;
 saleTimeID: string;
 orderDate: string;
 signal: AbortSignal;
}) {
 const searchPamras = new URLSearchParams([
  ['saleTimeID', saleTimeID],
  ['date', orderDate],
 ]);
 if (salonID) {
  searchPamras.set('salonID', salonID);
 }
 return axios.get<Combo[]>(
  `/Restaurant/SaleInvoice/GetAllocatableTables?${searchPamras.toString()}`,
  {
   signal,
  },
 );
}
// order
function getOrder({
 signal,
 orderID,
}: {
 signal: AbortSignal;
 orderID: number;
}) {
 return axios.get<Order>(
  `/Restaurant/SaleInvoice/GetOrder?orderID=${orderID}`,
  {
   signal,
  },
 );
}

function getOrderItems({
 signal,
 orderID,
}: {
 signal: AbortSignal;
 orderID: number;
}) {
 return axios.get<OrderItem[]>(
  `/Restaurant/SaleInvoice/GetOrderItems?orderID=${orderID}`,
  {
   signal,
  },
 );
}

function saveOrder({
 orderPackage,
 sendToKitchen,
 printToCashBox,
}: {
 sendToKitchen: boolean;
 printToCashBox: boolean;
 orderPackage: SaveOrderPackage;
}) {
 const searchParams = new URLSearchParams([
  ['sendToKitchen', String(sendToKitchen)],
  ['printToCashBox', String(printToCashBox)],
 ]);

 if (orderPackage.order.id) {
  return axios.put<{
   orderID: number;
   message: string;
  }>(`$/Restaurant/SaleInvoice/UpdateOrder?${searchParams.toString()}`);
 }
 return axios.post<{
  orderID: number;
  message: string;
 }>(`$/Restaurant/SaleInvoice/SaveOrder?${searchParams.toString()}`);
}

// service rates
function getOrderServiceRates({
 orderID,
 saleTypeID,
 registerID,
 signal,
}: {
 orderID: number;
 saleTypeID: number;
 registerID?: number;
 signal: AbortSignal;
}) {
 const searchParams = new URLSearchParams([
  ['orderID', orderID.toString()],
  ['saleTypeID', saleTypeID.toString()],
 ]);
 if (registerID) {
  searchParams.set('registerID', registerID.toString());
 }
 return axios.get<{
  serviceRate: number;
  discountRate: number;
 } | null>(
  `/Restaurant/SaleInvoice/GetServiceDiscountRates?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function closeOrder({ orderID }: { orderID: number }) {
 return axios.post(`/Restaurant/SaleInvoice/CloseOrder?orderID=${orderID}`);
}

// order payment
function getOrderPayment({
 orderID,
 signal,
}: {
 orderID: number;
 signal: AbortSignal;
}) {
 return axios.get<number>(
  `/Restaurant/SaleInvoice/GetOrderCashPrePayment?orderID=${orderID}`,
  {
   signal,
  },
 );
}

// subscribers
function getSubscribers({
 signal,
 offset,
 limit,
 programID,
 searchPhrase,
}: {
 signal: AbortSignal;
 offset: number;
 limit: number;
 programID?: number;
 searchPhrase?: string;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
 ]);
 if (searchPhrase) {
  searchParams.set('searchParams', searchPhrase);
 }
 if (programID) {
  searchParams.set('programID', programID.toString());
 }
 return axios.get<PagedData<Subscriber[]>>(
  `/Restaurant/Subscriber/GetPagedSubscribers?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

// customers
function getCustomers({
 signal,
 offset,
 limit,
 searchPhrase,
 registerID,
}: {
 signal: AbortSignal;
 offset: number;
 limit: number;
 registerID?: number;
 searchPhrase?: string;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
 ]);
 if (searchPhrase) {
  searchParams.set('searchText', searchPhrase);
 }
 if (registerID) {
  searchParams.set('registerID', registerID.toString());
 }
 return axios.get<PagedData<Customer[]>>(
  `/Restaurant/SaleInvoice/GetPagedCustomers?${searchParams.toString()}`,
  {
   signal,
  },
 );
}
// rooms
function getRooms({
 signal,
 offset,
 limit,
}: {
 signal: AbortSignal;
 offset: number;
 limit: number;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
 ]);
 return axios.get<PagedData<Room[]>>(
  `/Restaurant/SaleInvoice/GetRegisterGuests?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

// get tags
function getTags({
 signal,
 offset,
 limit,
 programID,
}: {
 signal: AbortSignal;
 offset: number;
 limit: number;
 programID?: number;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
 ]);
 if (programID) {
  searchParams.set('programID', programID.toString());
 }
 return axios.get<PagedData<Tag[]>>(
  `/Restaurant/SaleInvoice/GetPagedTags?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type {
 InitialData,
 Subscriber,
 Customer,
 ItemGroup,
 ItemProgram,
 OrderItem,
 Order,
 OrderServiceRates,
 SaveOrderPackage,
 Room,
 Tag,
};
export {
 newOrderKey,
 getFreeTables,
 getInitData,
 getItemPrograms,
 getOrderItems,
 getOrder,
 saveOrder,
 getOrderServiceRates,
 closeOrder,
 getOrderPayment,
 getSubscribers,
 getCustomers,
 getRooms,
 getTags,
};
