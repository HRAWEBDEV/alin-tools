import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { RoomControl } from '../../../room-control/services/roomControlApiActions';

const roomControlBaseKey = 'rooms-control';

type RoomControlStep = 'alert' | 'checkNow' | 'miniBar' | 'checkRoom';

type RoomControlStepDetails = {
 [key in RoomControlStep]: {
  isChecked: boolean;
  date: string | null;
  fullName: string | null;
 };
};

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

const roomControlSteps: ReadonlyArray<RoomControlStep> = [
 'alert',
 'checkNow',
 'miniBar',
 'checkRoom',
];

export type {
 RoomControl,
 SaveRoomControl,
 RoomControlStep,
 RoomControlStepDetails,
 RoomControlStepState,
};
export {
 roomControlBaseKey,
 getRoomControlHistory,
 getRoomControl,
 getRoomControls,
 saveRoomControl,
 changeRoomControl,
 roomControlSteps,
};
