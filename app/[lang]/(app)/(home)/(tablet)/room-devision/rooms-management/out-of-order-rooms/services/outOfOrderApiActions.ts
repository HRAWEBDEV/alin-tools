import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { Combo, PagedData } from '../../../utils/apiTypes';

interface InitialData {
 floors: Combo[];
 roomTypes: Combo[];
 rooms: Combo[];
 reasons: Combo[];
}

interface OutOfOrderResult {
 rooms: number;
 outOfOrders: PagedData<Room[]>;
}

type SaveOutOfOrder = Pick<
 Room,
 | 'id'
 | 'reasonID'
 | 'roomID'
 | 'fromDateTimeOffset'
 | 'untilDateTimeOffset'
 | 'comment'
>;

interface Room {
 id: number;
 roomID: number;
 fromDateTimeOffset: string;
 untilDateTimeOffset: string;
 reasonID: number;
 comment: string | null;
 date: string;
 roomNo: number;
 roomLabel: string;
 floorNo: number;
 roomTypeID: number;
 roomTypeName: string;
 userPersonName: string;
 reasonName: string | null;
}

const outOfOrderRoomsBaseKey = 'out-of-order-rooms';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Reception/OutOfOrder/GetDatas', {
  signal,
 });
}

function getOutOfOrderRooms({
 signal,
 fromDate,
 limit,
 offset,
 toDate,
 floorNo,
 roomID,
 roomTypeID,
}: {
 signal: AbortSignal;
 fromDate: string;
 toDate: string;
 floorNo?: string;
 roomID?: string;
 roomTypeID?: string;
 limit: string;
 offset: string;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit],
  ['offset', offset],
  ['fromDate', fromDate],
  ['toDate', toDate],
 ]);
 if (floorNo !== undefined) {
  searchParams.set('floorNo', floorNo);
 }
 if (!!roomID) {
  searchParams.set('roomID', roomID);
 }
 if (!!roomTypeID) {
  searchParams.set('roomTypeID', roomTypeID);
 }
 return axios.get<OutOfOrderResult>(
  `/Reception/OutOfOrder/GetOutOfOrders?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function saveOutOfOrderRoom(room: SaveOutOfOrder) {
 return axios.post('/Reception/OutOfOrder/SaveOutOfOrder', room);
}
function updateOutOfOrderRoom(room: SaveOutOfOrder) {
 return axios.put('/Reception/OutOfOrder/UpdateOutOfOrder', room);
}

export type { InitialData, Room, OutOfOrderResult, SaveOutOfOrder };
export {
 outOfOrderRoomsBaseKey,
 getInitialData,
 getOutOfOrderRooms,
 saveOutOfOrderRoom,
 updateOutOfOrderRoom,
};
