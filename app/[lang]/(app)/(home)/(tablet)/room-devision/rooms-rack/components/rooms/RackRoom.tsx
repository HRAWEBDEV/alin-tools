import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { type Rack } from '../../services/roomsRackApiActions';
import { motion } from 'motion/react';
import {
 RoomState,
 RoomStateType,
 RoomInOutState,
 RoomStateGroup,
 RoomStateKind,
 roomStateKinds,
 roomInOutStates,
 getRackStatesStyles,
} from '../../utils/rackStates';
import {
 getStateKindIcon,
 getRoomInOutIcon,
 getStateTypeIcon,
} from '../../utils/rackStatesIcon';
import { CheckinCheckout } from '../../../components/icons/CheckinCheckout';

export default function RackRoom({
 dic,
 room,
}: {
 dic: RoomsRackDictionary;
 room: Rack;
}) {
 const roomStateKind = RoomStateKind[
  room.roomStateKindID
 ] as (typeof roomStateKinds)[number];

 const roomStateKindStyle = getRackStatesStyles().get(roomStateKind);

 const roomStateInOut = room.roomInOutStateID
  ? (RoomInOutState[room.roomInOutStateID] as (typeof roomInOutStates)[number])
  : 'none';

 const roomStateInOutStyle = getRackStatesStyles().get(roomStateInOut);

 const roomState: RoomState = (() => {
  if (room.roomStateTypeID == RoomStateType.waitForCheckin) {
   return 'closedRoom';
  }
  if (room.registerStateID == 4) {
   return 'closedRoom';
  }
  if (room.dayUse) {
   return 'dayUse';
  }
  if (
   room.roomStateGroupID == RoomStateGroup.reservedOrEmptyRoom &&
   room.reserveID
  ) {
   return 'reservedRoom';
  }
  if (
   room.roomStateGroupID == RoomStateGroup.occupiedRoom &&
   room.customerID === 1
  ) {
   return 'occupiedCustomerRoom';
  }
  if (room.roomStateGroupID == RoomStateGroup.occupiedRoom) {
   return 'occupiedRoom';
  }
  if (room.roomStateGroupID == RoomStateGroup.reservedOrEmptyRoom) {
   return 'emptyRoom';
  }
  return 'emptyRoom';
 })();

 const roomStateStyle = getRackStatesStyles().get(roomState);

 return (
  <motion.div layout className='grid group'>
   <div className='relative min-h-40 group-data-[layout-minimal="true"]:min-h-auto'>
    <Button
     variant={'outline'}
     className="z-1 rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden shadow-lg [&_svg:not([class*='size-'])]:size-[unset]"
     asChild
    >
     <Link
      href='#'
      className={`relative flex! flex-col grow items-stretch p-2 ${roomStateStyle?.backgoundColor}`}
     >
      <div
       dir='ltr'
       className={`absolute top-12 start-1 opacity-25 ${roomStateKindStyle?.text}`}
      >
       {getStateKindIcon(room.roomStateKindID, {
        fontSize: '2.5rem',
        width: '2.5rem',
        height: '2.5rem',
        fill: 'currentColor',
       })}
      </div>
      <div
       className={`p-1 rounded-2xl border border-dashed ${roomStateStyle?.border} ${roomStateStyle?.text} ${roomStateStyle?.backgoundColor} text-center`}
      >
       <span className='text-base font-medium'>{dic.help[roomState]}</span>
      </div>
      <div className='text-start ps-2 grow'>
       <div className='flex items-center gap-1'>
        <h3
         className={`text-2xl lg:text-3xl font-en-roboto ${roomStateStyle?.text}`}
        >
         {room.roomLabel.padStart(2, '0')}
        </h3>
       </div>
       <div>
        <p className='text-sm text-primary text-wrap group-data-[bold=true]:font-medium'>
         {room.roomTypeAliasName}
        </p>
        <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
         {room.guestName} {room.guestLastName}
        </p>
       </div>
      </div>
      <div className='flex items-center justify-between gap-4'>
       <div dir='ltr' className='font-medium text-base flex items-center gap-2'>
        <div
         className={`${roomStateInOutStyle?.text || 'text-neutral-600 dark:text-neutral-400'}`}
        >
         {room.roomInOutStateID ? (
          getRoomInOutIcon(room.roomInOutStateID, {
           fontSize: '1.5rem',
           width: '1.5rem',
           height: '1.5rem',
           fill: 'currentColor',
          })
         ) : (
          <CheckinCheckout
           width='1.5rem'
           height='1.5rem'
           fontSize='1.5rem'
           fill='currentColor'
          />
         )}
        </div>
       </div>
       <div
        dir='ltr'
        className={`flex items-center gap-1 text-base font-medium`}
       >
        {getStateTypeIcon(room.roomStateTypeID, {
         fontSize: '1.4rem',
         width: '1.4rem',
         height: '1.4rem',
         fill: 'currentColor',
        })}
       </div>
      </div>
     </Link>
    </Button>
   </div>
  </motion.div>
 );
}
