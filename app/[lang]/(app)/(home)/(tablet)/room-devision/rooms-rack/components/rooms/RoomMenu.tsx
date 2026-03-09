import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { type Rack } from '../../services/roomsRackApiActions';
import RackRoom from './RackRoom';
import { Button } from '@/components/ui/button';

export default function RoomMenu({
 dic,
 room,
 isOpen,
 setIsOpen,
}: {
 dic: RoomsRackDictionary;
 room: Rack | null;
 isOpen: boolean;
 setIsOpen: (state: boolean) => void;
}) {
 return (
  <Drawer open={isOpen} onOpenChange={setIsOpen}>
   <DrawerContent>
    <DrawerHeader className='border-b border-input'>
     <DrawerTitle className='text-2xl'>{dic.options.title}</DrawerTitle>
    </DrawerHeader>
    {room ? (
     <div className='p-4 pb-6 grid sm:grid-cols-[max-content_1fr] gap-6 w-[min(100%,50rem)] mx-auto'>
      <div className='sm:w-48'>
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
    ) : null}
   </DrawerContent>
  </Drawer>
 );
}
