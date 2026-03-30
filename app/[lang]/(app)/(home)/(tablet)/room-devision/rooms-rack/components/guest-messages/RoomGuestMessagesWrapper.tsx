import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { type Rack } from '../../services/roomsRackApiActions';
import { type RoomGuestMessageProps } from '../../utils/roomGuestMessageProps';
import RoomGuestMessages from './RoomGuestMessages';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';

export default function RoomGuestMessagesWrapper({
 dic,
 open,
 room,
 onChangeOpen,
 roomGuestMessages,
}: {
 dic: RoomsRackDictionary;
 room: Rack;
 roomGuestMessages: RoomGuestMessageProps;
 open: boolean;
 onChangeOpen: (state: boolean) => unknown;
}) {
 return (
  <Dialog open={open} onOpenChange={onChangeOpen}>
   <DialogContent className='sm:max-w-[unset]! sm:w-[min(98%,40rem)] gap-0 p-0 max-h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogHeader>
      <DialogTitle className='text-lg'>
       {dic.roomGuestMessages.title} {room.roomLabel}
      </DialogTitle>
     </DialogHeader>
    </DialogHeader>
    {roomGuestMessages.isFetching && <LinearLoading />}
    <div className='p-4 grow overflow-auto'>
     <div className='mb-4'>
      <Button>
       <FaPlus />
       {dic.roomGuestMessages.addMessage}
      </Button>
     </div>
     <RoomGuestMessages dic={dic} roomGuestMessages={roomGuestMessages} />
    </div>
   </DialogContent>
  </Dialog>
 );
}
