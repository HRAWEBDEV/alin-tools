import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

const roomControlBaseKey = 'rooms-control';

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

type RoomControlStep = 'alert' | 'checkNow' | 'miniBar' | 'checkRoom';
type RoomControlStepState = Record<RoomControlStep, boolean>;
type SaveRoomControl = {
 roomControl: Pick<RoomControl, 'id' | 'roomID' | 'registerID' | 'maidComment'>;
} & RoomControlStepState;

function getRoomControlHistory({
 roomID,
 signal,
}: {
 roomID: number;
 signal: AbortSignal;
}) {
 return axios.get<RoomControl[]>(
  `/HouseKeeping/RoomControl/GetRoomControlHistory?RoomID=${roomID.toString()}`,
  {
   signal,
  },
 );
}

function getRoomControl({
 roomID,
 signal,
}: {
 roomID: number;
 signal: AbortSignal;
}) {
 return axios.get<RoomControl>(
  `/HouseKeeping/RoomControl/GetRoomConrol?RoomID=${roomID.toString()}`,
  {
   signal,
  },
 );
}

function getRoomControls({ signal }: { signal: AbortSignal }) {
 return axios.get<RoomControl[]>(`/HouseKeeping/RoomControl/GetRoomConrols`, {
  signal,
 });
}

function saveRoomControl(roomControl: SaveRoomControl) {
 return axios.post('/HouseKeeping/RoomControl/SaveRoomConrols', roomControl);
}

function changeRoomControl({
 roomID,
 registerID,
}: {
 roomID: number;
 registerID: number;
}) {
 const searchParams = new URLSearchParams([
  ['roomID', roomID.toString()],
  ['registerID', registerID.toString()],
 ]);
 return axios.put(
  `/HouseKeeping/RoomControl/ChangeRoomConrols?${searchParams.toString()}`,
 );
}

export type {
 RoomControl,
 SaveRoomControl,
 RoomControlStep,
 RoomControlStepState,
};
export {
 roomControlBaseKey,
 getRoomControlHistory,
 getRoomControl,
 getRoomControls,
 saveRoomControl,
 changeRoomControl,
};
