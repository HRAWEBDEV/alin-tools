import { type RoomGuestMessage } from '../services/guest-messages/roomGuestMessagesApiActions';

export interface EditRoomGuestMessagesProps {
 showEdit: boolean;
 selectedId: number | null;
 targetNote: RoomGuestMessage | null;
 onShowEdit: (id: number | null) => unknown;
 closeShowEdit: () => unknown;
}
