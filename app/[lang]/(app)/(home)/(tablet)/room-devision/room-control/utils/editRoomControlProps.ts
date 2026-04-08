import { type RoomControl } from '../services/roomControlApiActions';

export interface EditRoomControlProps {
 targetRoomControl: RoomControl | null;
 showEditRoomControl: boolean;
 handleShowEditRoomControl: (id: number) => unknown;
 handleCloseEditRoomControl: () => unknown;
}
