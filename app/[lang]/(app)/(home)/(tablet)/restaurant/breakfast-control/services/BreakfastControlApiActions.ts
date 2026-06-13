import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface BreakfastControlDetails {
 id: number;
 dateTimeDateTimeOffset: string;
}

interface BreackfastControlRes {
 bfCheckListDatas: {
  id: number;
  roomNo: number;
  customerName: string;
  guestFullName: string;
  served: boolean;
 }[];
 notServed: number;
 served: number;
 total: number;
}

const getBreakfastControlDetailsApi = '/Reception/BFCheckList/GetBFCheckList';
const getBreakfastControlDataApi = '/Reception/BFCheckList/GetBFCheckListData';

function getBreakfastControlDetails({ signal }: { signal: AbortSignal }) {
 return axios.get<BreakfastControlDetails>(getBreakfastControlDetailsApi, {
  signal,
 });
}

function getBreakfastControlData({
 signal,
 checkListId,
 roomNo,
}: {
 signal: AbortSignal;
 checkListId: number;
 roomNo?: string;
}) {
 const searchParams = new URLSearchParams([
  ['BFCheckListID', checkListId.toString()],
 ]);
 if (roomNo) {
  searchParams.set('RoomNo', roomNo);
 }
 return axios.get<BreackfastControlRes>(
  `${getBreakfastControlDataApi}?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function updateBreakfastState({ id }: { id: number }) {
 const searchParams = new URLSearchParams([
  ['BFCheckListDataID', id.toString()],
 ]);
 return axios.get(
  `/Reception/BFCheckList/UpdateBFCheckListData?${searchParams.toString()}`,
 );
}

export type { BreakfastControlDetails, BreackfastControlRes };
export {
 getBreakfastControlDetailsApi,
 getBreakfastControlDetails,
 getBreakfastControlDataApi,
 getBreakfastControlData,
 updateBreakfastState,
};
