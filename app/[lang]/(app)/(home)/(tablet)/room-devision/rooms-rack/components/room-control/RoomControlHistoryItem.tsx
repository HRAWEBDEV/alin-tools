import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type RoomControl } from '../../services/room-control/roomControlApiActions';
import { MdTouchApp } from 'react-icons/md';
import { useMemo } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

export default function RoomControlHistoryItem({
 dic,
 history,
}: {
 dic: RoomsRackDictionary;
 history: RoomControl;
}) {
 const { locale } = useBaseConfig();
 const roomControlStepDetails = useMemo(() => {
  return {
   alert: {
    isChecked: !!history,
    fullName: history?.receptionPersonFullName || null,
    date: history?.receptionDateTimeOffset || null,
   },
   checkNow: {
    isChecked: !!history?.maidPersonID,
    fullName: history?.maidPersonFullName || null,
    date: history?.maidDateTimeOffset || null,
   },
   miniBar: {
    isChecked: !!history?.minibarChecked,
    fullName: history?.maidPersonFullName || null,
    date: history?.minibarDateTimeOffset || null,
   },
   checkRoom: {
    isChecked: !!history?.roomChecked,
    fullName: history?.maidPersonFullName || null,
    date: history?.roomCheckDateTimeOffset || null,
   },
  };
 }, [history]);

 return (
  <button className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate'>
   <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>
   <div className='flex justify-between items-center flex-wrap gap-1 mb-2'>
    <div className='flex gap-1 items-center grow'>
     <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400 text-start min-w-20'>
      {dic.houseControl.alert}:
     </span>
     <FaCheck
      className={`size-6 text-primary ${roomControlStepDetails.alert.isChecked ? '' : 'opacity-0'}`}
     />
    </div>
    {roomControlStepDetails.alert.date && (
     <div className='font-medium flex gap-1 basis-24'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400 me-1'>
       {new Date(roomControlStepDetails.alert.date).toLocaleDateString(
        locale,
       )}{' '}
      </span>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {new Date(roomControlStepDetails.alert.date).toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
       })}
      </span>
     </div>
    )}
   </div>
   <div className='flex justify-between items-center flex-wrap gap-1 mb-2'>
    <div className='flex gap-1 items-center grow'>
     <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400 text-start min-w-20'>
      {dic.houseControl.checkNow}:
     </span>
     <FaCheck
      className={`shrink-0 size-6 text-primary ${roomControlStepDetails.checkNow.isChecked ? '' : 'opacity-0'}`}
     />
    </div>
    {roomControlStepDetails.checkNow.date && (
     <div className='font-medium flex gap-1 basis-24'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400 me-1'>
       {new Date(roomControlStepDetails.checkNow.date).toLocaleDateString(
        locale,
       )}{' '}
      </span>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {new Date(roomControlStepDetails.checkNow.date).toLocaleTimeString(
        locale,
        {
         hour: '2-digit',
         minute: '2-digit',
        },
       )}
      </span>
     </div>
    )}
   </div>
   <div className='flex justify-between items-center flex-wrap gap-1 mb-2'>
    <div className='flex gap-1 items-center grow'>
     <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400 text-start min-w-20'>
      {dic.houseControl.miniBar}:
     </span>
     <FaCheck
      className={`shrink-0 size-6 text-primary ${roomControlStepDetails.miniBar.isChecked ? '' : 'opacity-0'}`}
     />
    </div>
    {roomControlStepDetails.miniBar.date && (
     <div className='font-medium flex gap-1 basis-24'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400 me-1'>
       {new Date(roomControlStepDetails.miniBar.date).toLocaleDateString(
        locale,
       )}{' '}
      </span>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {new Date(roomControlStepDetails.miniBar.date).toLocaleTimeString(
        locale,
        {
         hour: '2-digit',
         minute: '2-digit',
        },
       )}
      </span>
     </div>
    )}
   </div>
   <div className='flex justify-between items-center flex-wrap gap-1 mb-2'>
    <div className='flex gap-1 items-center grow'>
     <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400 text-start min-w-20'>
      {dic.houseControl.checkRoom}:
     </span>
     <FaCheck
      className={`shrink-0 size-6 text-primary ${roomControlStepDetails.checkRoom.isChecked ? '' : 'opacity-0'}`}
     />
    </div>
    {roomControlStepDetails.checkRoom.date && (
     <div className='font-medium flex gap-1 basis-24'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400 me-1'>
       {new Date(roomControlStepDetails.checkRoom.date).toLocaleDateString(
        locale,
       )}{' '}
      </span>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {new Date(roomControlStepDetails.checkRoom.date).toLocaleTimeString(
        locale,
        {
         hour: '2-digit',
         minute: '2-digit',
        },
       )}
      </span>
     </div>
    )}
   </div>
   <div className='flex justify-between items-center flex-wrap gap-1 mb-1 mt-4'>
    <div className='flex gap-1 items-center grow'>
     <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400 text-start min-w-14'>
      {dic.houseControl.reception}:
     </span>
     <span className='font-medium'>{history.receptionPersonFullName}</span>
    </div>
   </div>
   <div className='flex justify-between items-center flex-wrap gap-1 mb-2'>
    <div className='flex gap-1 items-center grow'>
     <span className='font-medium text-sm text-neutral-700 dark:text-neutral-400 text-start min-w-14'>
      {dic.houseControl.maid}:
     </span>
     <span className='font-medium'>{history.maidPersonFullName}</span>
    </div>
   </div>
   <div className='flex flex-col gap-1 text-start'>
    <span className='text-sm text-neutral-700 dark:text-neutral-400 text-start'>
     {dic.houseControl.comment}:
    </span>
    <p>{history.maidComment}</p>
   </div>
  </button>
 );
}
