import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type Room } from '../services/outOfOrderApiActions';

export default function OutOfOrderRoom({
 dic,
 room,
}: {
 dic: OutOfOrderRoomsDictionary;
 room: Room;
}) {
 const { locale } = useBaseConfig();

 return (
  <>
   <button className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900'>
    <div className='flex flex-wrap justify-between gap-1 mb-2'>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.roomNo}:{' '}
      </span>
      <span className='font-medium text-lg'>{room.roomLabel}</span>
     </div>
     <div>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.floor}:{' '}
      </span>
      <span className='font-medium'>{room.floorNo}</span>
     </div>
    </div>
    <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-400 text-start grow overflow-hidden text-ellipsis'>
      {room.roomTypeName}
     </p>
    </div>
    <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
     <p className='text-base mb-1 font-medium text-destructive/70 text-start grow overflow-hidden text-ellipsis'>
      {room.reasonName}
     </p>
    </div>
    <div className='flex flex-wrap gap-1 justify-between'>
     <span className='text-secondary/80'>
      {new Date(room.fromDateTimeOffset).toLocaleDateString(locale)}
     </span>
     <span className='text-destructive/80'>
      {new Date(room.untilDateTimeOffset).toLocaleDateString(locale)}
     </span>
    </div>
   </button>
  </>
 );
}
