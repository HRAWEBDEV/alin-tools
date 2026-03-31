import { type RoomNote } from '../../services/room-notes/RackRoomNotesApiActions';

export interface EditRoomNotesProps {
 showEdit: boolean;
 selectedId: number | null;
 registerId: number;
 targetNote: RoomNote | null;
 onShowEdit: (id: number | null) => unknown;
 closeShowEdit: () => unknown;
 onInvalidateQuery: () => unknown;
}
