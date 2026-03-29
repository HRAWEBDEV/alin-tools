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
 return axios.get<{
  registerMessages: RoomGuestMessage[];
 }>(`/Reception/RegisterMessage/GetDatas?${searchParams.toString()}`, {
  signal,
 });
}

export type { RoomGuestMessage };
export { roomGuestMessagesBaseKey, getRoomGuestMessages };
