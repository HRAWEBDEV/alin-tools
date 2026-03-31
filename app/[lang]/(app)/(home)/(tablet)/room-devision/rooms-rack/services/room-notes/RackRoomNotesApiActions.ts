import { axios } from '@/app/[lang]/(app)/utils/defaultAxios';
import { type Combo, type PagedData } from '../../../utils/apiTypes';

type InitialData = {
 messageTypes: Combo[];
};

type RoomNote = {
 id: number;
 userPersonName: string;
 dateTimeDateTimeOffset: string;
 registerID: number | null;
 roomID: number;
 messageTypeID: number;
 messageTypeName: string;
 message: string;
 disabled: boolean;
 deleted: boolean;
};

const rackRoomNotesBaseKey = 'rack-room-notes';

function getInitialData({ signal }: { signal: AbortSignal }) {
 return axios.get<InitialData>('/Reception/RoomMessage/GetDatas', {
  signal,
 });
}

function getRoomNotes({
 signal,
 limit,
 offset,
 registerId,
 roomId,
 messageStateKey,
 messageTypeId,
 fromDate,
 untilDate,
}: {
 signal: AbortSignal;
 limit: number;
 offset: number;
 registerId: number;
 roomId: number;
 messageStateKey: string;
 fromDate?: string;
 untilDate?: string;
 messageTypeId?: string;
}) {
 const searchParams = new URLSearchParams([
  ['limit', limit.toString()],
  ['offset', offset.toString()],
  ['registerID', registerId.toString()],
  ['roomID', roomId.toString()],
  ['roomMessageConditionEnum', messageStateKey.toString()],
 ]);
 if (fromDate) {
  searchParams.set('fromDate', fromDate);
 }
 if (untilDate) {
  searchParams.set('untilDate', untilDate);
 }
 if (messageTypeId) {
  searchParams.set('messageTypeID', messageTypeId);
 }
 return axios.get<PagedData<RoomNote[]>>(
  `/Reception/RoomMessage/GetPagedMessages?${searchParams.toString()}`,
  { signal },
 );
}

function saveRoomNote(newNote: RoomNote) {
 return axios.post('/Reception/RoomMessage/SaveRoomMessage', newNote);
}

function updateRoomNote(newNote: RoomNote) {
 return axios.put('/Reception/RoomMessage/UpdateRoomMessage', newNote);
}

function deleteRoomNote(noteId: number) {
 const searchParams = new URLSearchParams([
  ['RoomMessageID', noteId.toString()],
 ]);
 return axios.delete(
  `/Reception/RoomMessage/DeletedRoomMessage?${searchParams.toString()}`,
 );
}

function activeRoomNote(noteId: number) {
 const searchParams = new URLSearchParams([
  ['RoomMessageID', noteId.toString()],
 ]);
 return axios.put(
  `/Reception/RoomMessage/ActiveRoomMessage?${searchParams.toString()}`,
 );
}
function deactiveRoomNote(noteId: number) {
 const searchParams = new URLSearchParams([
  ['RoomMessageID', noteId.toString()],
 ]);
 return axios.put(
  `/Reception/RoomMessage/DisableRoomMessage?${searchParams.toString()}`,
 );
}

export type { InitialData, RoomNote };
export {
 rackRoomNotesBaseKey,
 getInitialData,
 getRoomNotes,
 saveRoomNote,
 updateRoomNote,
 deleteRoomNote,
 activeRoomNote,
 deactiveRoomNote,
};
