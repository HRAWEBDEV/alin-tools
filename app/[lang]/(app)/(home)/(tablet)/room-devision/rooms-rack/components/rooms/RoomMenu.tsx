import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { type Rack } from '../../services/roomsRackApiActions';
import RackRoom from './RackRoom';
import { Button } from '@/components/ui/button';

export default function RoomMenu({
 dic,
 room,
}: {
 dic: RoomsRackDictionary;
 room: Rack;
}) {
 return (
  <Drawer open>
   <DrawerContent>
    <div className='p-4 grid grid-cols-[max-content_1fr] gap-6 w-[min(100%,50rem)] mx-auto'>
     <div className='w-48'>
      <RackRoom dic={dic} room={room} mock={true} />
     </div>
     <div className='grid grid-cols-1 gap-2 content-start'>
      <Button
       variant='outline'
       className='justify-start text-start h-12'
       size='lg'
      >
       {dic.options.changeRoomStateKind}
      </Button>
      <Button
       variant='outline'
       className='justify-start text-start h-12'
       size='lg'
      >
       {dic.options.changeRoomStateType}
      </Button>
     </div>
    </div>
   </DrawerContent>
  </Drawer>
 );
}
