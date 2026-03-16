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
import RoomStateKind from './RoomStateKind';
import RoomStateType from './RoomStateType';
import RoomControl from './RoomControl';

export default function RoomMenu({
 dic,
 room,
 isOpen,
 setIsOpen,
 showRoomStateKind,
 setShowRoomStateKind,
 showRoomStateType,
 setShowRoomStateType,
 setShowRoomControl,
 showRoomControl,
}: {
 dic: RoomsRackDictionary;
 room: Rack | null;
 isOpen: boolean;
 setIsOpen: (state: boolean) => unknown;
 showRoomStateKind: boolean;
 setShowRoomStateKind: (state: boolean) => unknown;
 showRoomStateType: boolean;
 setShowRoomStateType: (state: boolean) => unknown;
 showRoomControl: boolean;
 setShowRoomControl: (state: boolean) => unknown;
}) {
 return (
  <Drawer open={isOpen} onOpenChange={setIsOpen}>
   <DrawerContent className='h-[min(60svh,50rem)]'>
    <DrawerHeader className='border-b border-input'>
     <DrawerTitle className='text-2xl'>{dic.options.title}</DrawerTitle>
    </DrawerHeader>
    {room ? (
     <>
      <div className='p-4 pb-6 grid sm:grid-cols-[max-content_1fr] gap-6 w-[min(100%,50rem)] mx-auto overflow-auto'>
       <div className='sm:w-48'>
        <RackRoom dic={dic} room={room} mock={true} />
       </div>
       <div className='grid grid-cols-1 gap-2 content-start'>
        {!room.noRoom && (
         <>
          <Button
           variant='outline'
           className='justify-start text-start h-12'
           size='lg'
           onClick={() => setShowRoomStateKind(true)}
          >
           {dic.options.changeRoomStateKind}
          </Button>
          <Button
           variant='outline'
           className='justify-start text-start h-12'
           size='lg'
           onClick={() => setShowRoomStateType(true)}
          >
           {dic.options.changeRoomStateType}
          </Button>
          <Button
           variant='outline'
           className='justify-start text-start h-12'
           size='lg'
           onClick={() => setShowRoomControl(true)}
          >
           {dic.options.houseControl}
          </Button>
         </>
        )}
       </div>
      </div>
      <RoomStateKind
       dic={dic}
       room={room}
       open={showRoomStateKind}
       onChangeOpen={setShowRoomStateKind}
       onSuccess={() => {
        setIsOpen(false);
        setShowRoomStateKind(false);
       }}
      />
      <RoomStateType
       dic={dic}
       room={room}
       open={showRoomStateType}
       onChangeOpen={setShowRoomStateType}
       onSuccess={() => {
        setIsOpen(false);
        setShowRoomStateType(false);
       }}
      />
      <RoomControl
       dic={dic}
       room={room}
       open={showRoomControl}
       onChangeOpen={setShowRoomControl}
       onSuccess={() => {
        setIsOpen(false);
        setShowRoomControl(false);
       }}
      />
     </>
    ) : null}
   </DrawerContent>
  </Drawer>
 );
}
