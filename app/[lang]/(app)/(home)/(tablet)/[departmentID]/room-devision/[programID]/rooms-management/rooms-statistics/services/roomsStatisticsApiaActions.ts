import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

type RoomsStatistics = {
 totalRooms: number;
 occupiedRooms: number;
 vacantRooms: number;
 totalGuests: number;
 totalExBed: number;
 occupiedPercentage: number;
 readyForService: number;
 awaitingForQC: number;
 awaitingForService: number;
 outOfOrder: number;
 stopSell: number;
 todayIncoming: number;
 checkInCount: number;
 notCheckInCount: number;
 earlyCheckIn: number;
 checkInGuests: number;
 todayOutGoing: number;
 checkOutCount: number;
 notCheckOutCount: number;
 lateCheckOut: number;
 checkOutGuests: number;
 awaitingReservation: number;
 awaitingRegistration: number;
 withOutGuest: number;
 doNotDisturb: number;
 noLuggage: number;
 lightLuggage: number;
 sleptOut: number;
 houseUse: number;
 lockeOut: number;
};

const roomsRackBaseKey = 'rooms-statistics';

function getRoomsStatistics({
 date,
 signal,
}: {
 date: string;
 signal: AbortSignal;
}) {
 const searchParams = new URLSearchParams([['date', date]]);
 return axios.get<RoomsStatistics>(
  `/Reception/RoomsStatists/GetDatas?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { RoomsStatistics };
export { roomsRackBaseKey, getRoomsStatistics };
