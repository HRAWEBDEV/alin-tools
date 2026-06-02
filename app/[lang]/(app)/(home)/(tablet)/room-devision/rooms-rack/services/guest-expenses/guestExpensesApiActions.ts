import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo } from '../../../../restaurant/utils/apiTypes';
import { type ApiPagedData } from '../../../guests-management/arrival-reserves/services/arrivalReservesApiActions';

const getRevenueInvoicesApi =
 '/Reception/RoomGuestCost/GetProgramDetailRevenues';
const getStayExpenseItemsApi = '/Reception/RoomGuestCost/GetItems';

interface InitialData {
 items: Combo[];
 programs: Combo[];
 minibarPrograms: Combo[];
 arzs: Combo[];
}

type StayExpenseItem = {
 itemID: number;
 itemName: string | null;
 price: number;
 serviceRate: number | null;
 taxRate: number | null;
};

interface Revenue {
 id: number;
 registerID: number;
 roomID: number | null;
 dateTimeDateTimeOffset: string;
 itemID: number;
 amount: number;
 sValue: number;
 discount: number;
 discountRate: number;
 service: number;
 serviceRate: number;
 tax: number;
 taxRate: number;
 arzID: number;
 totalValue: number | null;
 entityID: number | null;
 entityValue: number;
 roomLabel: string | null;
 roomNo: number | null;
 orderID: number | null;
 orderNo: number | null;
 bonNo: number | null;
 arzName: string | null;
 programName: string | null;
 progrmID: number;
 itemName: string | null;
 comment: string | null;
 refProgramName: string | null;
 refProgramID: number | null;
 userPersonID: number | null;
}

interface Invoice {
 id: number;
 itemName: string;
 itemCode: number;
 itemID: number;
 amount: number;
 sValue: number;
 discount: number;
 service: number;
 serviceRate: number;
 taxRate: number;
 tax: number;
 arzID: number;
 programID: number;
 refProgramID: number;
 roomingDateTimeOffset: string | null;
 dateTimeDateTimeOffset: string | null;
 comment: string | null;
}

type TItemProgram = {
 id: number;
 itemID: number;
 itemName: string | null;
 itemCode: number;
 price: number;
 arzID: number;
 programID: number;
 serviceRate: number;
 taxRate: number;
};

type SaveRevenuePackage = {
 registerID: number;
 roomID: number;
 revenue: Pick<
  Revenue,
  | 'id'
  | 'roomID'
  | 'dateTimeDateTimeOffset'
  | 'itemID'
  | 'amount'
  | 'sValue'
  | 'discount'
  | 'discountRate'
  | 'service'
  | 'tax'
  | 'arzID'
  | 'comment'
 >;
};

type SaveInvoicePackage = Omit<Invoice, 'itemName'>;

function getInitialData({
 registerID,
 signal,
}: {
 registerID: number;
 signal: AbortSignal;
}) {
 const searchParams = new URLSearchParams([
  ['RegisterID', registerID.toString()],
 ]);
 return axios.get<InitialData>(
  `/Reception/RoomGuestCost/GetInitDatas?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function getRevenues({
 signal,
 registerID,
 date,
 itemID,
 deleted,
}: {
 signal: AbortSignal;
 registerID: number;
 date?: string;
 itemID?: string;
 deleted: string;
}) {
 const searchParams = new URLSearchParams([
  ['registerID', registerID.toString()],
  ['deleted', deleted],
 ]);
 if (date) {
  searchParams.set('date', date);
 }
 if (itemID) {
  searchParams.set('itemID', itemID);
 }
 return axios.get<Revenue[]>(
  `/Reception/RoomGuestCost/GetItemRevenues?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function saveRevenue({ registerID, roomID, revenue }: SaveRevenuePackage) {
 return axios.post('/Reception/RoomGuestCost/SaveRegisterRevenue', {
  registerID,
  roomID,
  revenues: [revenue],
 });
}

function updateRevenue({ registerID, roomID, revenue }: SaveRevenuePackage) {
 return axios.put('/Reception/RoomGuestCost/UpdateRegisterRevenue', {
  registerID,
  roomID,
  revenues: [revenue],
 });
}

function getInvoices({
 signal,
 registerID,
 date,
 programID,
}: {
 signal: AbortSignal;
 registerID: number;
 date?: string;
 programID?: string;
}) {
 const searchParams = new URLSearchParams([
  ['registerID', registerID.toString()],
 ]);
 if (date) {
  searchParams.set('date', date);
 }
 if (programID) {
  searchParams.set('programID', programID);
 }
 return axios.get<Revenue[]>(
  `/Reception/RoomGuestCost/GetProgramRevenues?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function getRevenueInvoices({
 signal,
 orderID,
}: {
 signal: AbortSignal;
 orderID: number;
}) {
 const searchParams = new URLSearchParams([['orderID', orderID.toString()]]);
 return axios.get<{ revenues: Invoice[] }>(
  `${getRevenueInvoicesApi}?${searchParams.toString()}`,
  { signal },
 );
}

function saveGuestInvoices({
 invoices,
 registerID,
 orderID,
}: {
 invoices: SaveInvoicePackage[];
 registerID: number;
 orderID: number | null;
}) {
 const searchParams = new URLSearchParams([
  ['registerID', registerID.toString()],
  ['isCustomer', 'false'],
 ]);
 if (orderID) {
  searchParams.set('orderID', orderID.toString());
 }
 return axios.post(
  `/Reception/RoomGuestCost/SaveProgramRegisterRevenues?${searchParams.toString()}`,
  invoices,
 );
}

function getStayExpenseItems({
 limit,
 offset,
 signal,
}: {
 limit: number;
 offset: number;
 signal: AbortSignal;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
 ]);
 return axios.get<ApiPagedData<StayExpenseItem[]>>(
  `${getStayExpenseItemsApi}?${searchParams.toString()}`,
  { signal },
 );
}

export type {
 TItemProgram,
 InitialData,
 Revenue,
 SaveRevenuePackage,
 Invoice,
 SaveInvoicePackage,
 StayExpenseItem,
};
export {
 getInitialData,
 getRevenues,
 getInvoices,
 saveRevenue,
 updateRevenue,
 getRevenueInvoicesApi,
 getRevenueInvoices,
 saveGuestInvoices,
 getStayExpenseItemsApi,
 getStayExpenseItems,
};
