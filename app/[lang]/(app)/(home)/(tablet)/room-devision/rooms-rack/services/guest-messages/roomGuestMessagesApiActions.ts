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

export type { RoomGuestMessagesRes, RoomGuestMessage };
export { roomGuestMessagesBaseKey, getRoomGuestMessages };
