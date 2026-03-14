import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTrigger,
 DrawerTitle,
} from '@/components/ui/drawer';

export default function OutOfOrderRoom({
 dic,
}: {
 dic: OutOfOrderRoomsDictionary;
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
         {dic.info.floor}:{' '}
        </span>
        <span className='font-medium'>1</span>
       </div>
      </div>
      <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
       <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-400 text-start grow overflow-hidden text-ellipsis'>
        دو تخته تویین
       </p>
      </div>
      <div className='mb-1 flex items-center justify-between gap-2 whitespace-nowrap'>
       <p className='text-base mb-1 font-medium text-destructive/70 text-start grow overflow-hidden text-ellipsis'>
        خرابی تجهیزات
       </p>
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
         {dic.info.floor}:{' '}
        </span>
        <span className='font-medium text-2xl'>1</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.roomType}:{' '}
        </span>
        <span className='font-medium'>دو تخته تویین</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.reason}:{' '}
        </span>
        <span className='font-medium text-destructive/90'>خرابی تجهیزات</span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.fromDate}:{' '}
        </span>
        <span className='font-medium text-secondary/90'>
         {new Date().toLocaleDateString(locale)}
        </span>
       </div>
       <div className='text-lg'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.toDate}:{' '}
        </span>
        <span className='font-medium text-destructive/90'>
         {new Date().toLocaleDateString(locale)}
        </span>
       </div>
       <div className='col-span-full flex flex-col'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.comment}:{' '}
        </span>
        <p>شرح علت خارج از سرویس بودن اتاق</p>
       </div>
      </div>
     </div>
    </DrawerContent>
   </Drawer>
  </>
 );
}
