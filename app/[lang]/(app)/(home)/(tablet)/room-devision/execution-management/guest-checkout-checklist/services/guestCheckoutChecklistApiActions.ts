import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo, type PagedData } from '../../../utils/apiTypes';

interface InitialData {
 rooms: Combo[];
 maids: Combo[];
}

interface CheckoutChecklist {
 id: number;
 dateTimeDateTimeOffset: string;
 folioNo: number;
 registerID: number;
 roomID: number;
 roomLabel: string;
 maidUserPersonID: number;
 maidFullName: string;
 comment: string | null;
}

const guestCheckoutChecklistBaseKey = 'guest-checkout-checklist';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/HouseKeeping/CheckOutList/GetData', {
  signal,
 });
}

function getCheckoutChecklist({
 signal,
 fromDate,
 limit,
 offset,
 toDate,
 maidID,
 roomID,
}: {
 signal: AbortSignal;
 limit: string;
 offset: string;
 fromDate: string;
 toDate: string;
 roomID?: string;
 maidID?: string;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit],
  ['offset', offset],
  ['fromDate', fromDate],
  ['toDate', toDate],
 ]);
 if (!!maidID) {
  searchParams.set('maidID', maidID);
 }
 if (!!roomID) {
  searchParams.set('roomID', roomID);
 }
 return axios.get<PagedData<CheckoutChecklist[]>>(
  `/HouseKeeping/CheckOutList/GetCheckOutCheckLists?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { InitialData, CheckoutChecklist };
export { guestCheckoutChecklistBaseKey, getInitialData, getCheckoutChecklist };
