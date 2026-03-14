import { type EntranceAndExitRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/entrance-and-exit-rooms/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { FaUserFriends, FaBed } from 'react-icons/fa';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerClose,
 DrawerTrigger,
 DrawerTitle,
} from '@/components/ui/drawer';

export default function EntranceAndExitItem({
 dic,
}: {
 dic: EntranceAndExitRoomsDictionary;
}) {
 const { locale } = useBaseConfig();

 return (
  <>
   <Drawer>
    <DrawerTrigger asChild>
     <div
      className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900'
      tabIndex={0}
     >
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.info.roomNo}:{' '}
        </span>
        <span className='font-medium'>111</span>
       </div>
       <div>
        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
         {dic.info.registerNo}:{' '}
        </span>
        <span className='font-medium'>111</span>
       </div>
      </div>
      <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
       <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-400 text-start grow overflow-hidden text-ellipsis'>
        دو تخته تویین
       </p>
       <div className='flex items-center gap-1 text-neutral-600 dark:text-neutral-400'>
        <span className='font-medium'>4</span>
        <FaUserFriends className='size-5' />
       </div>
      </div>
      <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
       <p className='text-base mb-1 font-medium text-primary/80 text-start grow overflow-hidden text-ellipsis'>
        حمیدرضا اکبری
       </p>
       <div className='flex items-center gap-1 text-neutral-600 dark:text-neutral-400'>
        <span className='font-medium'>4</span>
        <FaBed className='size-5' />
       </div>
      </div>
      <div className='flex flex-wrap gap-1 justify-between'>
       <span className='text-secondary/80'>
        {new Date().toLocaleDateString(locale)}
       </span>
       <span className='text-destructive/80'>
        {new Date().toLocaleDateString(locale)}
       </span>
      </div>
     </div>
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
        <span className='font-medium text-2xl'>110</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.registerNo}:{' '}
        </span>
        <span className='font-medium text-2xl'>110</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.roomType}:{' '}
        </span>
        <span className='font-medium'>دو تخته تویین</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.customerName}:{' '}
        </span>
        <span className='font-medium text-primary/90'>حمیدرضا اکبری</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.guestCount}:{' '}
        </span>
        <span className='font-medium'>2</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.extraBed}:{' '}
        </span>
        <span className='font-medium'>2</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.arrivalDate}:{' '}
        </span>
        <span className='font-medium text-secondary/90'>
         {new Date().toLocaleDateString(locale)}
        </span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.arrivalDate}:{' '}
        </span>
        <span className='font-medium text-destructive/90'>
         {new Date().toLocaleDateString(locale)}
        </span>
       </div>
      </div>
     </div>
    </DrawerContent>
   </Drawer>
  </>
 );
}
