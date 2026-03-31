import {
 type RoomNote,
 type InitialData,
} from '../../services/room-notes/RackRoomNotesApiActions';

export interface EditRoomNotesProps {
 initialData?: InitialData;
 initialDataIsLoading: boolean;
 showEdit: boolean;
 selectedId: number | null;
 registerId: number;
 roomId: number;
 targetNote: RoomNote | null;
 onShowEdit: (id: number | null) => unknown;
 closeShowEdit: () => unknown;
 onInvalidateQuery: () => unknown;
}
