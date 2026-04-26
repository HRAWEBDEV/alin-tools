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
 roomStateTypes,
 getRackStatesStyles,
} from '../../utils/rackStates';
import {
 getStateKindIcon,
 getRoomInOutIcon,
 getStateTypeIcon,
 getRoomStateIcon,
} from '../../utils/rackStatesIcon';
import { CheckinCheckout } from '../../../components/icons/CheckinCheckout';
import { useFormContext } from 'react-hook-form';
import { RackFiltersSchema } from '../../schemas/rackFiltersSchema';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { IoNotifications } from 'react-icons/io5';
import RoomControlIndicator from '../room-control/RoomControlIndicator';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';

export default function RackRoom({
 dic,
 room,
 mock = false,
 roomControlDic,
}: {
 dic: RoomsRackDictionary;
 room: Rack;
 mock?: boolean;
 roomControlDic: RoomControlDictionary;
}) {
 const { watch } = useFormContext<RackFiltersSchema>();
 const {
  rack: { onShowRackMenu, rackView },
 } = useRackConfigContext();
 const { locale, localeInfo } = useBaseConfig();
 const roomStateKind = RoomStateKind[
  room.roomStateKindID
 ] as (typeof roomStateKinds)[number];

 const roomStateKindStyle = getRackStatesStyles().get(roomStateKind);
 const [showTypeValue] = watch(['showType']);
 const isFutureRack = showTypeValue?.value === 'future';

 const roomStateInOut = room.roomInOutStateID
  ? (RoomInOutState[room.roomInOutStateID] as (typeof roomInOutStates)[number])
  : 'none';

 const roomStateInOutStyle = getRackStatesStyles().get(roomStateInOut);

 const roomState: RoomState | 'noShow' = (() => {
  if (room.roomStateTypeID == RoomStateType.waitForCheckin) {
   return 'waitForCheckin';
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
  if (room.noShow) {
   return 'noShow';
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

 const roomStateStyle =
  roomState === 'emptyRoom'
   ? {
      ...getRackStatesStyles().get(roomState),
      text: roomStateKindStyle?.text,
      border: roomStateKindStyle?.border,
     }
   : getRackStatesStyles().get(roomState);

 const activeCompactView = rackView === 'compact' && !mock;
 const activeMinimalView = rackView === 'minimal' && !mock;

 return (
  <motion.div
   data-layout-compact={activeCompactView}
   data-layout-minimal={activeMinimalView}
   layout
   className='grid group'
   dir={localeInfo.contentDirection}
  >
   <div className='relative min-h-40 group-data-[layout-compact=true]:min-h-auto group-data-[layout-minimal=true]:min-h-auto'>
    <Button
     variant={'outline'}
     className="z-1 rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden shadow-lg [&_svg:not([class*='size-'])]:size-[unset]"
     asChild
    >
     <Link
      href='#'
      className={`relative flex! flex-col grow items-stretch p-2 ${roomStateStyle?.backgoundColor}`}
      onClick={() => {
       if (mock || isFutureRack) return;
       onShowRackMenu(room);
      }}
     >
      <div
       className={`absolute left-1/2 ${activeMinimalView || activeCompactView ? 'bottom-0' : 'bottom-2'} -translate-x-1/2`}
      >
       {!mock && room.hkStateID && (
        <RoomControlIndicator dic={roomControlDic} hkStateID={room.hkStateID} />
       )}
      </div>
      {room.msgFlag && (
       <div className='absolute top-1 end-0'>
        <IoNotifications className='size-7 text-destructive' />
       </div>
      )}
      {!isFutureRack && !activeMinimalView && (
       <div
        dir='ltr'
        className={`absolute top-12 start-1 ${room.roomStateKindID !== RoomStateKind.waitingForQC ? 'opacity-60' : 'opacity-80'}  ${roomStateKindStyle?.text}`}
       >
        {getStateKindIcon(room.roomStateKindID, {
         fontSize: '3rem',
         width: '3rem',
         height: '3rem',
         fill: 'currentColor',
        })}
       </div>
      )}
      <div
       className={`rounded-2xl border border-dashed ${roomStateStyle?.border} ${roomStateStyle?.text} ${roomStateStyle?.backgoundColor} text-center ${activeMinimalView ? 'p-0' : 'p-1'}`}
      >
       {activeMinimalView ? (
        <div className='flex justify-center'>
         {getRoomStateIcon(roomState, {
          fontSize: '2.2rem',
          width: '2.2rem',
          height: '2.2rem',
          fill: 'currentColor',
         })}
        </div>
       ) : (
        <span className='text-base font-medium'>
         {roomState === 'noShow' ? dic.help['noShowRoom'] : dic.help[roomState]}
        </span>
       )}
      </div>
      <div className='text-start ps-2 grow group-data-[layout-minimal=true]:ps-0 group-data-[layout-minimal=true]:pb-1 group-data-[layout-compact=true]:pb-1'>
       <div className='flex items-center group-data-[layout-minimal=true]:justify-center gap-1'>
        <h3
         className={`text-2xl lg:text-3xl group-data-[layout-minimal=true]:text-2xl font-en-roboto ${roomStateStyle?.text}`}
        >
         {room.roomLabel.padStart(2, '0')}
        </h3>
       </div>
       {!activeCompactView && !activeMinimalView && (
        <div className='grid grid-cols-1'>
         <p
          className={`text-sm text-primary/80 text-wrap group-data-[bold=true]:font-medium ${mock ? '' : 'text-ellipsis overflow-hidden text-start whitespace-nowrap'}`}
         >
          {room.roomTypeAliasName}
         </p>
         {room.noShow && !room.guestName && !room.guestLastName ? (
          <p
           className={`text-sm text-neutral-600 dark:text-neutral-400 text-wrap ${mock ? '' : 'text-ellipsis overflow-hidden text-start whitespace-nowrap'}`}
          >
           {dic.info.noShowRoom}
          </p>
         ) : (
          <p
           className={`text-sm text-neutral-600 dark:text-neutral-400 text-wrap ${mock ? '' : 'text-ellipsis overflow-hidden text-start whitespace-nowrap'}`}
          >
           {room.guestName} {room.guestLastName}
          </p>
         )}
         {mock && (
          <>
           {!!room.customerName && (
            <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
             {room.customerName}
            </p>
           )}

           {!!room.guestCount && (
            <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
             {room.guestCount} {dic.help.guest}
            </p>
           )}
           {!!room.arrivalDateTimeOffset && !!room.depatureDateTimeOffset && (
            <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
             <span>
              {new Date(room.arrivalDateTimeOffset).toLocaleDateString(locale, {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit',
              })}
             </span>
             {'  -  '}
             <span>
              {new Date(room.depatureDateTimeOffset).toLocaleDateString(
               locale,
               {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
               },
              )}
             </span>
            </p>
           )}
           <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
            {dic.help[roomStateKind]}
           </p>
           {room.carFlag && (
            <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
             {dic.help.parking}
            </p>
           )}
          </>
         )}
        </div>
       )}
      </div>
      {!isFutureRack && !activeCompactView && !activeMinimalView && (
       <div
        data-is-mock={mock}
        className='flex data-[is-mock=true]:flex-col items-center data-[is-mock=true]:items-start justify-between gap-2'
       >
        <div className='font-medium text-base flex items-center gap-2'>
         <div
          dir='ltr'
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
         {roomStateInOut !== 'none' && mock && (
          <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
           {dic.help[roomStateInOut]}
          </p>
         )}
        </div>
        <div
         className={`flex items-center gap-1 text-base font-medium text-neutral-600 dark:text-neutral-400`}
        >
         <div dir='ltr'>
          {getStateTypeIcon(room.roomStateTypeID, {
           fontSize: '1.4rem',
           width: '1.4rem',
           height: '1.4rem',
           fill: 'currentColor',
          })}
         </div>
         {mock && (
          <p className='text-sm text-neutral-600 dark:text-neutral-400 text-wrap'>
           {
            dic.help[
             RoomStateType[
              room.roomStateTypeID
             ] as (typeof roomStateTypes)[number]
            ]
           }
          </p>
         )}
        </div>
       </div>
      )}
      {room.hkStateID && mock && (
       <div>
        <RoomControlIndicator
         withText
         dic={roomControlDic}
         hkStateID={room.hkStateID}
        />
       </div>
      )}
     </Link>
    </Button>
   </div>
  </motion.div>
 );
}
