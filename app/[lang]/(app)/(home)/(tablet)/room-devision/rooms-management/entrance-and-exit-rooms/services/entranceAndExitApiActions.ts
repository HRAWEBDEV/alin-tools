import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { Combo, PagedData } from '../../../utils/apiTypes';

interface InitialData {
 floors: Combo[];
 roomTypes: Combo[];
}

interface Room {
 roomLabel: string;
 folioNo: number;
 roomTypeAliasName: string;
 customerName: string;
 checkinDateOffset: string | null;
 checkoutDateOffset: string | null;
 guestCount: number;
 exBedCount: number;
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
 floorNo,
 roomTypeID,
}: {
 signal: AbortSignal;
 date: string;
 isCheckin: boolean;
 isCheckout: boolean;
 floorNo?: string;
 roomTypeID?: string;
}) {
 const searchParams = new URLSearchParams([
  ['date', date],
  ['checkin', String(isCheckin)],
  ['checkout', String(isCheckout)],
  ['all', String(true)],
  ['registered', String(false)],
  ['notRegistered', String(false)],
 ]);
 if (floorNo !== undefined) {
  searchParams.set('floorNo', floorNo);
 }
 if (!!roomTypeID) {
  searchParams.set('roomTypeID', roomTypeID);
 }
 return axios.get<Room[]>(
  `/Reception/CheckInCheckOutRooms/GetCheckinCheckouRooms?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { InitialData, Room };
export { entranceAndExitBaseKey, getInitialData, getRooms };
