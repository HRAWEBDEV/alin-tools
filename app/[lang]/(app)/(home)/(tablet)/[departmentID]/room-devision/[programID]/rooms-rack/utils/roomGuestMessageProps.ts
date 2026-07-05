import { type RoomGuestMessagesRes } from '../services/guest-messages/roomGuestMessagesApiActions';

export interface RoomGuestMessageProps {
 data?: RoomGuestMessagesRes;
 isSuccess: boolean;
 isError: boolean;
 isFetching: boolean;
 refetch: () => unknown;
}
