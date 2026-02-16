import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { SlOptions } from 'react-icons/sl';

function getTableStateStyles(state: number): {
 type: 'readyToService' | 'outOfService' | 'reserved' | 'occupied';
 border: string;
 text: string;
 backgroundColor: string;
 badgeText: string;
} {
 switch (state) {
  case 1:
   return {
    type: 'readyToService',
    border: 'border-teal-600 dark:border-teal-400',
    text: 'text-teal-600 dark:text-teal-400',
    backgroundColor: 'bg-teal-50 dark:bg-teal-950',
    badgeText: 'میز خالی',
   };
  case 2:
   return {
    type: 'outOfService',
    border: 'border-neutral-400 dark:border-neutral-500',
    text: 'text-neutral-400 dark:text-neutral-500',
    backgroundColor: 'bg-neutral-50 dark:bg-neutral-950',
    badgeText: 'میز خارج از سرویس',
   };
  case 3:
   return {
    type: 'reserved',
    border: 'border-amber-600 dark:border-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    backgroundColor: 'bg-amber-50 dark:bg-amber-950',
    badgeText: 'میز رزرو شده',
   };
  case 4:
  case 5:
  case 6:
   return {
    type: 'occupied',
    border: 'border-rose-600 dark:border-rose-400',
    text: 'text-rose-600 dark:text-rose-400',
    backgroundColor: 'bg-rose-50 dark:bg-rose-950',
    badgeText: 'میز اشغال',
   };
 }
 return {
  type: 'outOfService',
  border: '',
  text: '',
  backgroundColor: '',
  badgeText: 'میز خارج از سرویس',
 };
}

interface MockTable {
 tableNo: number;
 tableCapacity: number;
 occupiedPerson: number;
 tableStateTypeID: number;
 tableTypeID: number;
 vip: boolean;
 saleTypeName: string;
 customerName: string;
 OccupiedDateTimeOffset: string | null;
 orderID: number | null;
}

export default function SalonTableDemo({ table }: { table: MockTable }) {
 const tableStyles = getTableStateStyles(table.tableStateTypeID);

 return (
  <motion.div layout className='grid h-full grid-rows-[1fr_auto]'>
   <div className='relative min-h-40'>
    <div className='z-1 rounded-2xl h-full flex flex-col justify-start text-start p-0 overflow-hidden mx-3 shadow-lg bg-gray-50 border-2 border-transparent hover:border-2 hover:border-gray-500 border-dotted dark:bg-neutral-900 transition-colors'>
     <div className='relative flex flex-col grow items-stretch p-2 gap-4'>
      {table.vip && (
       <div className='absolute top-11 start-0 end-0.5 text-end text-4xl text-amber-400/40 dark:text-amber-500/40 font-en-roboto'>
        VIP
       </div>
      )}

      {/* State Badge */}
      <div
       className={`p-1 rounded-2xl border border-dashed text-center ${tableStyles.backgroundColor} ${tableStyles.border} ${tableStyles.text}`}
      >
       <span className='text-base font-medium'>{tableStyles.badgeText}</span>
      </div>

      {/* Table Number */}
      <div className='text-start ps-2 grow'>
       <div className='flex items-center gap-2'>
        <h3
         className={`text-2xl lg:text-3xl ${tableStyles.text} font-en-roboto`}
        >
         {table.tableNo.toString().padStart(2, '0')}
        </h3>
       </div>
       <div>
        <p className='text-sm text-primary text-wrap'>
         {table.saleTypeName || ''}
        </p>
        <p className='text-md text-neutral-500 dark:text-neutral-400 text-wrap'>
         {table.customerName || ''}
        </p>
       </div>
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between gap-4'>
       <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium'>
        <span>
         {table.OccupiedDateTimeOffset
          ? new Date(table.OccupiedDateTimeOffset).toLocaleTimeString('fa-IR', {
             hour: '2-digit',
             minute: '2-digit',
            })
          : ''}
        </span>
       </div>
       <div
        style={{
         direction: 'ltr',
        }}
        className={`font-medium text-base ${tableStyles.text}`}
       >
        {table.occupiedPerson || '-'}/{table.tableCapacity}
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Options Button */}
   <div className='mx-3 -mt-4'>
    <Button
     variant='ghost'
     className='w-full h-auto pt-5 pb-1 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-xl rounded-ss-none rounded-se-none pointer-events-none'
    >
     <SlOptions className='size-6' />
    </Button>
   </div>
  </motion.div>
 );
}
