import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { type Rack } from '../../services/roomsRackApiActions';
import { RoomStateGroup } from '../../utils/rackStates';
import RackRoom from './RackRoom';
import { Button } from '@/components/ui/button';
import RoomStateKind from './RoomStateKind';
import RoomStateType from './RoomStateType';
import RoomControl from './RoomControl';
import RoomGuestsWrapper from '../guests/RoomGuestsWrapper';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import {
 roomGuestMessagesBaseKey,
 getRoomGuestMessages,
} from '../../services/guest-messages/roomGuestMessagesApiActions';
import { Spinner } from '@/components/ui/spinner';

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
 showRoomGuests,
 setShowRoomGuests,
 showGuestMessages,
 setShowGuestMessages,
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
 showRoomGuests: boolean;
 setShowRoomGuests: (state: boolean) => unknown;
 showGuestMessages: boolean;
 setShowGuestMessages: (state: boolean) => unknown;
}) {
 const {
  data: guestMessages,
  isSuccess: guestMessagesIsSuccess,
  isError: guestMessagesIsError,
  isFetching: guestMessagesIsFetching,
 } = useQuery({
  enabled: !!room && !!room.registerID,
  queryKey: [roomGuestMessagesBaseKey, 'list', room?.registerID?.toString()],
  async queryFn({ signal }) {
   const res = await getRoomGuestMessages({
    signal,
    registerId: room!.registerID!,
   });
   return res.data;
  },
 });

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
          {RoomStateGroup.occupiedRoom === room.roomStateGroupID && (
           <>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             onClick={() => setShowRoomControl(true)}
            >
             {dic.options.houseControl}
            </Button>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             onClick={() => setShowGuestMessages(true)}
            >
             {dic.options.guestMessages}
             {guestMessagesIsFetching && <Spinner />}
             {guestMessagesIsSuccess && (
              <Badge variant='default' className='size-6'>
               {guestMessages?.registerMessages.length || 0}
              </Badge>
             )}
            </Button>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             onClick={() => setShowRoomGuests(true)}
            >
             {dic.options.guests}
             <Badge variant='destructive' className='size-6'>
              {room.guestCount}
             </Badge>
            </Button>
           </>
          )}
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
      <RoomGuestsWrapper
       dic={dic}
       room={room}
       open={showGuestMessages}
       onChangeOpen={setShowGuestMessages}
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
