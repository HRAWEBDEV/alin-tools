import { type RoomGuestMessage } from '../services/guest-messages/roomGuestMessagesApiActions';

export interface EditRoomGuestMessagesProps {
 showEdit: boolean;
 targetNote: RoomGuestMessage | null;
 onShowEdit: (id: number | null) => unknown;
 closeShowEdit: () => unknown;
}
