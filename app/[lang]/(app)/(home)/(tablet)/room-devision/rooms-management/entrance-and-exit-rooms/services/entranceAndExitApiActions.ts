import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { Combo, PagedData } from '../../../utils/apiTypes';

interface InitialData {
 floors: Combo[];
 roomTypes: Combo[];
}

interface Room {
 id: number;
}

const entranceAndExitBaseKey = 'entrance-and-exit-rooms';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Reception/CheckInCheckOutRooms/GetDatas', {
  signal,
 });
}

function getRooms({
 date,
 signal,
 isCheckin,
 isCheckout,
 limit,
 offset,
 floorNo,
 roomTypeID,
}: {
 signal: AbortSignal;
 limit: string;
 offset: string;
 date: string;
 isCheckin: boolean;
 isCheckout: boolean;
 floorNo?: string;
 roomTypeID?: string;
}) {
 const searchParams = new URLSearchParams([
  ['date', date],
  ['limit', limit],
  ['offset', offset],
  ['checkin', String(isCheckin)],
  ['checkout', String(isCheckout)],
 ]);
 if (floorNo !== undefined) {
  searchParams.set('floorNo', floorNo);
 }
 if (!!roomTypeID) {
  searchParams.set('roomTypeID', roomTypeID);
 }
 return axios.get<PagedData<Room[]>>(
  `/Reception/CheckInCheckOutRooms/GetCheckinCheckouRooms?${searchParams.toString()}`,
 );
}

export type { InitialData, Room };
export { entranceAndExitBaseKey, getInitialData, getRooms };
