import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface Combo {
 key: string;
 value: string;
}

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

export type { Combo, Table, InitiData };
export { getHallKey, getInitialData, changeTableStateType };
