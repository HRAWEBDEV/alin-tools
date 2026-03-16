import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

function getRoomControlHistory(roomID: number) {
 return axios.get(
  `/HouseKeeping/RoomControl/GetRoomControlHistory?RoomID=${roomID.toString()}`,
 );
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

export { getRoomControlHistory, saveRoomControl };
