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
export default function SalonTableDemo({
 table,
 mode,
 isBold,
}: {
 table: MockTable;
 mode?: 'normal' | 'minimal';
 isBold?: boolean;
}) {
 const tableStyles = getTableStateStyles(table.tableStateTypeID);

 const isMinimal = mode === 'minimal';

 return (
  <motion.div
   data-minimal={isMinimal}
   data-bold={isBold}
   layout
   transition={{ type: 'spring', stiffness: 300, damping: 30 }}
   className='grid h-full group  data-[minimal=true]:max-w-[96px]'
   style={{ gridTemplateRows: isMinimal ? '1fr' : '1fr auto' }}
  >
   <div className='relative min-h-32 group-data-[minimal=true]:min-h-0 '>
    <div
     className={`z-1 rounded-2xl h-full flex flex-col justify-start text-start p-0 overflow-hidden shadow-lg ${isBold || isMinimal ? tableStyles.backgroundColor : 'bg-gray-50 dark:bg-neutral-900'}  transition-colors ${isMinimal ? `mx-1 aspect-square border-2 ${tableStyles.border} max-w-24 max-h-24` : 'mx-3 border-2 border-transparent hover:border-2 hover:border-gray-500 border-dotted'} `}
    >
     <div
      className={`relative flex flex-col grow items-stretch ${isMinimal ? 'p-1.5 gap-0.5 justify-center' : 'p-2'}`}
     >
      {table.vip && !isMinimal && (
       <div className='absolute top-11 start-0 end-0.5 text-end text-4xl text-amber-400/40 dark:text-amber-500/40 font-en-roboto group-data-[bold=true]:font-bold'>
        VIP
       </div>
      )}

      {!isMinimal && (
       <div
        className={`p-1 rounded-2xl border border-dashed text-center ${tableStyles.backgroundColor} ${tableStyles.border} ${tableStyles.text} `}
       >
        <span className='text-base font-medium group-data-[bold=true]:font-bold'>
         {tableStyles.badgeText}
        </span>
       </div>
      )}

      <div
       className={`text-start ${isMinimal ? 'text-center' : 'ps-2'} flex flex-col mt-5 grow`}
      >
       <div className='flex items-center gap-2'>
        <h3
         className={`${tableStyles.text} font-en-roboto ${isMinimal ? 'text-3xl mx-auto' : 'text-2xl lg:text-3xl'} group-data-[bold=true]:font-black`}
        >
         {table.tableNo.toString().padStart(2, '0')}
        </h3>
       </div>
      </div>
      {!isMinimal && (
       <div className='flex items-center justify-between gap-4'>
        <div></div>
        <div
         style={{
          direction: 'ltr',
         }}
         className={`font-medium text-base ${tableStyles.text} group-data-[bold=true]:font-bold`}
        >
         {table.occupiedPerson || '-'}/{table.tableCapacity}
        </div>
       </div>
      )}

      {isMinimal && (
       <div className='flex flex-col items-center gap-0'>
        <div
         style={{
          direction: 'ltr',
         }}
         className={`font-medium text-[0.8rem] ${tableStyles.text} group-data-[bold=true]:font-bold`}
        >
         {table.occupiedPerson || '-'}/{table.tableCapacity}
        </div>
        {table.vip && (
         <span className='text-[8px] text-amber-500 dark:text-amber-400 group-data-[bold=true]:font-bold'>
          VIP
         </span>
        )}
       </div>
      )}
     </div>
    </div>
   </div>

   {!isMinimal && (
    <div className='mx-3 -mt-4'>
     <Button
      variant='ghost'
      className='w-full h-auto pt-5 pb-1 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-xl rounded-ss-none rounded-se-none pointer-events-none'
     >
      <SlOptions className='size-6' />
     </Button>
    </div>
   )}
  </motion.div>
 );
}
