import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo, type PagedData } from '../../../utils/apiTypes';

interface InitialData {
 rooms: Combo[];
 maids: Combo[];
}

interface Register {
 roomID: number;
 registerID: number;
 folioNo: number;
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

type SaveCheckoutChecklist = Pick<
 CheckoutChecklist,
 'id' | 'dateTimeDateTimeOffset' | 'roomID' | 'maidUserPersonID' | 'comment'
> & {
 registerID: number | null;
};

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

function saveCheckoutlist(newChecklist: SaveCheckoutChecklist) {
 return axios.post(
  '/HouseKeeping/CheckOutList/SaveCheckOutCheckList',
  newChecklist,
 );
}
function updateCheckoutlist(newChecklist: SaveCheckoutChecklist) {
 return axios.put(
  '/HouseKeeping/CheckOutList/UpdateCheckOutCheckList',
  newChecklist,
 );
}
function removeCheckoutlist(id: number) {
 return axios.delete(
  `/HouseKeeping/CheckOutList/RemoveCheckOutCheckList?CheckoutListID=${id.toString()}`,
 );
}

function getRegisterInfo({ roomID, date }: { roomID: number; date: string }) {
 const searchParams = new URLSearchParams([
  ['roomID', roomID.toString()],
  ['date', date],
 ]);
 return axios.get<Register>(
  `/HouseKeeping/CheckOutList/GetRegister?${searchParams.toString()}`,
 );
}

export type { InitialData, CheckoutChecklist, SaveCheckoutChecklist };
export {
 guestCheckoutChecklistBaseKey,
 getInitialData,
 getCheckoutChecklist,
 saveCheckoutlist,
 updateCheckoutlist,
 removeCheckoutlist,
 getRegisterInfo,
};
