import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo } from '../../utils/apiTypes';

interface InitiData {
 salons: Combo[];
 saleTimes: Combo[];
 tableStateTypes: Combo[];
 tableTypes: Combo[];
 defaultSaleTimeID: number;
 defaultPrintCashBox: number;
}

interface Table {
 vip: boolean;
 tableID: number;
 tableNo: number;
 expired: boolean;
 orderCount: number;
 tableStateDataID: number;
 tableStateID: number;
 tableStateTypeID: number;
 tableCapacity: number;
 startTime: string | null;
 salonID: number;
 saleTimeID: number;
 orderID: number;
 orderNo: number | null;
 endTime: string | null;
 date: string;
 maxCapicity: number;
 salonName: string | null;
 tableTypeID: number;
 contractName?: string;
 customerName?: string;
 guestName?: string;
 saleTypeName?: string;
 roomLable?: number;
 customerID: number | null;
 saleTypeID: number | null;
 remained: number | null;
 occupiedPerson: number | null;
 OccupiedDateTimeOffset: string | null;
}

function generateTableMockData(updateTable: Partial<Table> = {}): Table {
 return {
  vip: true,
  tableID: 0,
  tableNo: 1,
  expired: false,
  tableStateDataID: 0,
  tableStateID: 1,
  tableStateTypeID: 1,
  tableCapacity: 2,
  startTime: null,
  salonID: 0,
  saleTimeID: 1,
  orderID: 0,
  orderNo: 0,
  endTime: null,
  date: '',
  maxCapicity: 4,
  salonName: null,
  tableTypeID: 1,
  roomLable: 1,
  customerID: null,
  saleTypeID: null,
  remained: null,
  occupiedPerson: null,
  OccupiedDateTimeOffset: null,
  orderCount: 1,
  ...updateTable,
 };
}

const getHallKey = 'restaurant-halls';

// change table state type
function changeTableStateType({
 date,
 saleTimeID,
 tableStateTypeID,
 tableID,
 tableStateDataID,
}: {
 date: string;
 saleTimeID: number;
 tableID: number;
 tableStateDataID: number;
 tableStateTypeID: string;
}) {
 const searchParams = new URLSearchParams([
  ['date', date],
  ['saleTiemID', saleTimeID.toString()],
  ['tableStateTypeID', tableStateTypeID.toString()],
  ['tableStateDataID', tableStateDataID.toString()],
  ['tableID', tableID.toString()],
  ['saleTimeID', saleTimeID.toString()],
 ]);
 return axios.put(
  `/Restaurant/RackTable/UpdateTableStateType?${searchParams.toString()}`,
 );
}
// get initData
function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitiData>('/Restaurant/RackTable/GetInitDatas', {
  signal,
 });
}
// transfer Table
function transferTable({
 orderID,
 transferToTableID,
}: {
 orderID: number;
 transferToTableID: number;
}) {
 const searchParams = new URLSearchParams([
  ['orderID', orderID.toString()],
  ['tableID', transferToTableID.toString()],
 ]);
 return axios.get(
  `/Restaurant/TableTransfer/TransferTable?${searchParams.toString()}`,
 );
}
// merge table
function mergeTable({
 mergeOrderID,
 masterOrderID,
}: {
 masterOrderID: number;
 mergeOrderID: number;
}) {
 const searchParams = new URLSearchParams([
  ['masterOrderID', masterOrderID.toString()],
  ['mergeOrderID', mergeOrderID.toString()],
 ]);
 return axios.post(
  `/Restaurant/RackTable/MergeOrder?${searchParams.toString()}`,
 );
}

// multi order
function getTableOrders({
 tableID,
 signal,
}: {
 tableID: number;
 signal: AbortSignal;
}) {
 const searchParams = new URLSearchParams([
  ['masterOrderID', tableID.toString()],
 ]);
 return axios.get(
  `/Restaurant/Tablet/ReadMultipleOrderData?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { Combo, Table, InitiData };
export {
 getHallKey,
 transferTable,
 getInitialData,
 changeTableStateType,
 mergeTable,
 generateTableMockData,
 getTableOrders,
};
