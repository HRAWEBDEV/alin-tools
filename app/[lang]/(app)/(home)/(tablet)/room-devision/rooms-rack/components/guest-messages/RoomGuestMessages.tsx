import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { RoomGuestMessageProps } from '../../utils/roomGuestMessageProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import RoomGuestMessage from './RoomGuestMessage';
import { EditRoomGuestMessagesProps } from '../../utils/editRoomGuestMessagesProps';

export default function RoomGuestMessages({
 dic,
 roomGuestMessages,
 editRoomGuestMessages,
 onInvalidateQuery,
}: {
 dic: RoomsRackDictionary;
 editRoomGuestMessages: EditRoomGuestMessagesProps;
 roomGuestMessages: RoomGuestMessageProps;
 onInvalidateQuery: () => unknown;
}) {
 if (
  roomGuestMessages.isSuccess &&
  !roomGuestMessages.data?.registerMessages?.length
 ) {
  return <NoItemFound />;
 }
 if (!roomGuestMessages.isFetching && roomGuestMessages.isError) {
  return <UnExpectedError />;
 }
 return (
  <div className='grid gap-2 grid-cols-1'>
   {roomGuestMessages.data?.registerMessages.map((message) => (
    <RoomGuestMessage
     key={message.id}
     dic={dic}
     message={message}
     onInvalidateQuery={onInvalidateQuery}
     editRoomGuestMessages={editRoomGuestMessages}
    />
   ))}
  </div>
 );
}
