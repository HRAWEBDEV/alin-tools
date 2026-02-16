import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { SlOptions } from 'react-icons/sl';
import { useRestaurantShareDictionary } from '../../../share-dictionary/restaurantShareDictionaryContext';

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
  <motion.div layout className='flex flex-col gap-2'>
   <div className='bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-4 flex flex-col items-center gap-3 min-h-[180px] justify-between'>
    {/* State Badge */}
    <div
     className={`px-4 py-1.5 rounded-full border border-dashed text-sm font-medium ${tableStyles.backgroundColor} ${tableStyles.border} ${tableStyles.text}`}
    >
     {tableStyles.badgeText}
    </div>

    {/* Table Number */}
    <div className='flex-1 flex items-center justify-center'>
     <h2 className={`text-5xl font-bold font-en-roboto ${tableStyles.text}`}>
      {table.tableNo.toString().padStart(2, '0')}
     </h2>
    </div>

    {/* Capacity */}
    <div
     className={`text-lg font-medium ${tableStyles.text}`}
     style={{ direction: 'ltr' }}
    >
     -{table.occupiedPerson || 0}/{table.tableCapacity}
    </div>
   </div>

   {/* Options Button */}
   <Button
    variant='ghost'
    className='w-full h-10 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-xl pointer-events-none'
   >
    <SlOptions className='size-5' />
   </Button>
  </motion.div>
 );
}
