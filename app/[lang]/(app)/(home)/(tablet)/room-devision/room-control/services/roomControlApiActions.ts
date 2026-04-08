import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo } from '../../utils/apiTypes';

interface InitialData {
 floors: Combo[];
 roomTypes: Combo[];
}

interface RoomControl {
 id: number;
 roomID: number;
 registerID: number;
 receptionPersonID: number;
 receptionDateTimeOffset: string;
 maidPersonID: number | null;
 maidDateTimeOffset: string | null;
 minibarChecked: boolean;
 minibarDateTimeOffset: string | null;
 roomChecked: boolean;
 roomCheckDateTimeOffset: string | null;
 maidComment: string | null;
 closed: boolean;
 cancelled: boolean;
 deleted: boolean;
 ownerID: 1;
 roomNo: number;
 roomLabel: string;
 roomTypeID: number;
 floorNo: number;
 folioNo: number;
 receptionPersonFrisName: string;
 receptionPersonLatName: string;
 receptionPersonFullName: string;
 maidPersonFrisName: string | null;
 maidPersonLatName: string | null;
 maidPersonFullName: string | null;
}

const roomControlBaseKey = 'room-control-page';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get('/HouseKeeping/RoomControl/GetData', {
  signal,
 });
}

function getRoomControls({
 signal,
 floorNo,
 roomTypeID,
}: {
 signal: AbortSignal;
 floorNo?: string;
 roomTypeID?: string;
}) {
 const searchParams = new URLSearchParams([]);
 if (floorNo !== undefined) {
  searchParams.set('floorNo', floorNo);
 }
 if (roomTypeID) {
  searchParams.set('roomTypeID', roomTypeID);
 }
 return axios.get<RoomControl[]>(
  `/HouseKeeping/RoomControl/GetRoomConrols?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

export type { InitialData, RoomControl };
export { roomControlBaseKey, getInitialData, getRoomControls };
