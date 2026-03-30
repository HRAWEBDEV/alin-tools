import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';

interface RoomGuestMessage {
 id: number;
 dateTimeDateTimeOffset: string;
 registerID: number;
 messageFrom: string;
 messageTo: string;
 message: string;
 readed: boolean;
}
interface RoomGuestMessagesRes {
 registerMessages: RoomGuestMessage[];
}

type SaveRoomGuestMessage = RoomGuestMessage;

const roomGuestMessagesBaseKey = 'room-guest-messages';

function getRoomGuestMessages({
 signal,
 registerId,
}: {
 signal: AbortSignal;
 registerId: number;
}) {
 const searchParams = new URLSearchParams([
  ['RegisterID', registerId.toString()],
 ]);
 return axios.get<RoomGuestMessagesRes>(
  `/Reception/RegisterMessage/GetDatas?${searchParams.toString()}`,
  {
   signal,
  },
 );
}

function removeGuestMessage(messageId: number) {
 const searchParams = new URLSearchParams([
  ['RegisterMessageID', messageId.toString()],
 ]);
 return axios.delete(
  `/Reception/RegisterMessage/RemoveRegisterMessage?${searchParams.toString()}`,
 );
}

function receiveMessage(messageId: number) {
 const searchParams = new URLSearchParams([
  ['RegisterMessageID', messageId.toString()],
 ]);
 return axios.post(
  `/Reception/RegisterMessage/ChangeToRead?${searchParams.toString()}`,
 );
}

function saveMessage(message: SaveRoomGuestMessage) {
 return axios.post('/Reception/RegisterMessage/SaveRegisterMessage', message);
}
function updateMessage(message: SaveRoomGuestMessage) {
 return axios.put('/Reception/RegisterMessage/UpdateRegisterMessage', message);
}

export type { RoomGuestMessagesRes, RoomGuestMessage, SaveRoomGuestMessage };
export {
 roomGuestMessagesBaseKey,
 getRoomGuestMessages,
 removeGuestMessage,
 receiveMessage,
 saveMessage,
 updateMessage,
};
