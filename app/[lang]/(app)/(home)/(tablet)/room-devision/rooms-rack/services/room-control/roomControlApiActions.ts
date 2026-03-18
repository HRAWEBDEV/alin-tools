import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

const roomControlBaseKey = 'rooms-control';

interface RoomControl {}

function getRoomControlHistory({
 roomID,
 signal,
}: {
 roomID: number;
 signal: AbortSignal;
}) {
 return axios.get(
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

function saveRoomControl(roomID: number, registerID: number) {
 return axios.post('/HouseKeeping/RoomControl/SaveRoomConrols', {
  roomControl: {
   id: 0,
   roomID,
   registerID,
  },
  alert: true,
  checkNow: false,
  miniBar: false,
  checkRoom: false,
 });
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

export type { RoomControl };
export {
 roomControlBaseKey,
 getRoomControlHistory,
 getRoomControl,
 getRoomControls,
 saveRoomControl,
 changeRoomControl,
};
