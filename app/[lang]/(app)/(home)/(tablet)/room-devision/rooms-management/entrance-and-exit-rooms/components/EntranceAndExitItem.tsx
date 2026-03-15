import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaUserFriends, FaBed } from 'react-icons/fa';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTrigger,
 DrawerTitle,
} from '@/components/ui/drawer';
import { MdTouchApp } from 'react-icons/md';
import { type Room } from '../services/entranceAndExitApiActions';

export default function EntranceAndExitItem({
 dic,
 room,
}: {
 dic: EntranceAndExitRoomsDictionary;
 room: Room;
}) {
 const { locale } = useBaseConfig();

 return (
  <>
   <Drawer>
    <DrawerTrigger asChild>
     <button className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 isolate relative'>
      <div className='absolute bottom-0 end-6 -z-1'>
       <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.info.roomNo}:{' '}
        </span>
        <span className='font-medium text-lg'>{room.roomLabel}</span>
       </div>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.info.registerNo}:{' '}
        </span>
        <span className='font-medium text-lg'>{room.folioNo}</span>
       </div>
      </div>
      <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
       <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-400 text-start grow overflow-hidden text-ellipsis'>
        {room.roomTypeAliasName}
       </p>
       <div className='flex items-center gap-1 text-neutral-600 dark:text-neutral-400'>
        <span className='font-medium'>{room.guestCount}</span>
        <FaUserFriends className='size-5' />
       </div>
      </div>
      <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
       <p className='text-base mb-1 font-medium text-primary/80 text-start grow overflow-hidden text-ellipsis'>
        {room.customerName}
       </p>
       <div className='flex items-center gap-1 text-neutral-600 dark:text-neutral-400'>
        <span className='font-medium'>{room.exBedCount}</span>
        <FaBed className='size-5' />
       </div>
      </div>
      <div className='flex flex-wrap gap-1 justify-between'>
       <span className='text-secondary/80'>
        {room.checkinDateOffset
         ? new Date(room.checkinDateOffset).toLocaleDateString(locale)
         : ''}
       </span>
       <span className='text-destructive/80'>
        {room.checkoutDateOffset
         ? new Date(room.checkoutDateOffset).toLocaleDateString(locale)
         : ''}
       </span>
      </div>
     </button>
    </DrawerTrigger>
    <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
     <DrawerHeader>
      <DrawerTitle className='text-lg'>{dic.info.moreInfo}</DrawerTitle>
     </DrawerHeader>
     <div className='grow overflow-auto p-4'>
      <div className='w-[min(100%,50rem)] mx-auto grid grid-cols-2 gap-4'>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.roomNo}:{' '}
        </span>
        <span className='font-medium text-2xl'>{room.roomLabel}</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.registerNo}:{' '}
        </span>
        <span className='font-medium text-2xl'>{room.folioNo}</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.roomType}:{' '}
        </span>
        <span className='font-medium'>{room.roomLabel}</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.customerName}:{' '}
        </span>
        <span className='font-medium text-primary/90'>{room.customerName}</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.guestCount}:{' '}
        </span>
        <span className='font-medium'>{room.guestCount}</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.extraBed}:{' '}
        </span>
        <span className='font-medium'>{room.exBedCount}</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.arrivalDate}:{' '}
        </span>
        <span className='font-medium text-secondary/90'>
         {room.checkinDateOffset
          ? new Date(room.checkinDateOffset).toLocaleDateString(locale)
          : ''}
        </span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.arrivalDate}:{' '}
        </span>
        <span className='font-medium text-destructive/90'>
         {room.checkoutDateOffset
          ? new Date(room.checkoutDateOffset).toLocaleDateString(locale)
          : ''}
        </span>
       </div>
      </div>
     </div>
    </DrawerContent>
   </Drawer>
  </>
 );
}
