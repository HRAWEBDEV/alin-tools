import { MdTouchApp } from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import type { ReserveRoom } from '../services/arrivalReservesApiActions';
import type { ArrivalReservesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/arrival-reserves/dictionary';

export default function ArrivalReserveCard({
 reserve,
 dic,
 onClick,
}: {
 reserve: ReserveRoom;
 dic: ArrivalReservesDictionary;
 onClick: () => void;
}) {
 const { locale } = useBaseConfig();

 return (
  <button
   onClick={onClick}
   className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate cursor-pointer text-start'
  >
   <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>

   <div className='flex flex-wrap justify-between gap-1 mb-2'>
    {/* <div>
     <span className='text-sm text-neutral-600 dark:text-neutral-400'>
      {dic.fields.roomNo}:{' '}
     </span>
     <span className='font-medium text-lg'>{reserve.roomNo || '-'}</span>
    </div> */}

    <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400'>
      {dic.fields.reserveNo}:{' '}
     </span>
     <span className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-400 text-start grow overflow-hidden text-ellipsis'>
      {reserve.reserveNo}
     </span>
    </div>
   </div>

   <div className='mb-1 flex items-center justify-between gap-2'>
    <p className='text-sm flex-1 mb-1 font-medium text-neutral-700 truncate dark:text-neutral-400 text-start'>
     {reserve.name || reserve.customerName || dic.info.unnamedGuest}
    </p>
    <div className='text-end truncate max-w-[40%]'>
     <span className='text-sm text-primary w-full'>{reserve.roomTypeName}</span>
    </div>
   </div>

   <div className='flex flex-wrap gap-1 justify-between'>
    <span className='text-secondary/80'>
     {reserve.arrivalDateTimeOffset
      ? new Date(reserve.arrivalDateTimeOffset).toLocaleDateString(locale)
      : '-'}
    </span>
    <span className='text-destructive/80'>
     {reserve.depatureDateTimeOffset
      ? new Date(reserve.depatureDateTimeOffset).toLocaleDateString(locale)
      : '-'}
    </span>
   </div>
  </button>
 );
}
