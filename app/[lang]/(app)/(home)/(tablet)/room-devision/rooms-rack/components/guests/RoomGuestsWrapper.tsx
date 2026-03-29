import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { type Rack } from '../../services/roomsRackApiActions';
import { useQuery } from '@tanstack/react-query';
import {
 roomGuestsBaseKey,
 getRoomGuests,
} from '../../services/guests/roomGuestsApiActions';
import RoomGuestsList from './RoomGuestsList';

export default function RoomGuestsWrapper({
 dic,
 open,
 room,
 onChangeOpen,
}: {
 dic: RoomsRackDictionary;
 room: Rack;
 open: boolean;
 onChangeOpen: (state: boolean) => unknown;
}) {
 const { data, isFetching, isError, isSuccess } = useQuery({
  enabled: !!room.registerID,
  queryKey: [roomGuestsBaseKey, 'list', room.registerID?.toString()],
  async queryFn({ signal }) {
   const res = await getRoomGuests({ signal, registerId: room.registerID! });
   return res.data;
  },
 });

 return (
  <Dialog open={open} onOpenChange={onChangeOpen}>
   <DialogContent className='sm:max-w-[unset]! sm:w-[min(98%,80rem)] gap-0 p-0 max-h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogHeader>
      <DialogTitle className='text-lg'>
       {dic.roomGuests.title} {room.roomLabel}
      </DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-4 grow overflow-auto'>
     <RoomGuestsList
      dic={dic}
      isError={isError}
      isFetching={isFetching}
      isSuccess={isSuccess}
      data={data}
     />
    </div>
   </DialogContent>
  </Dialog>
 );
}
