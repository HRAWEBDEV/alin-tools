import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type Table } from '../services/salonsApiActions';
import { SlOptions } from 'react-icons/sl';
import { TableStateTypes, getTableStateStyles } from '../utils/tableStates';
import { getTableRows } from '../utils/getTableRows';
import { motion } from 'motion/react';

export default function SalonTable({
 table,
 dic,
}: {
 dic: SalonsDictionary;
 table: Table;
}) {
 const tableStyles = getTableStateStyles(table.tableStateTypeID);
 const { locale } = useBaseConfig();
 const tableRows = getTableRows(table.tableCapacity, 3);

 function getTableExtensionTitle() {
  switch (table.tableStateTypeID) {
   case TableStateTypes.VIPCustomer:
    return ` (${dic.tables.vip})`;
   case TableStateTypes.roomGuest:
    return ` (${dic.tables.room})`;
  }
  return '';
 }

 return (
  <motion.div layout className='grid'>
   <div className='relative min-h-40'>
    {!!tableRows.length && (
     <div
      style={{
       direction: 'ltr',
      }}
      className='absolute inset-0 z-[-1] py-2 grid gap-1 content-center'
     >
      {tableRows.map((row) => (
       <div key={row.id} className='h-5 rounded-2xl flex justify-between'>
        {Array.from({ length: row.seats }, (_, i) => i).map((seat) => (
         <div
          data-occupied={row.occupiedSeats >= seat + 1}
          key={seat}
          className='size-5 rounded-full bg-neutral-200 dark:bg-neutral-800 data-[occupied="true"]:bg-rose-400 data-[occupied="true"]:dark:bg-rose-600'
         ></div>
        ))}
       </div>
      ))}
     </div>
    )}
    <Button
     variant={'outline'}
     className='rounded-2xl h-full flex-col justify-start text-start p-0 overflow-hidden mx-4 shadow-lg'
     asChild
    >
     <Link
      href='#'
      className='relative flex! flex-col grow items-stretch bg-background! p-2'
     >
      {table.vip && (
       <div className='absolute top-11 start-0 end-0 text-end text-4xl text-amber-400/30 font-en-roboto'>
        VIP
       </div>
      )}
      <div
       className={`p-1 rounded-2xl border border-dashed text-center ${tableStyles.backgoundColor} ${tableStyles.border} ${tableStyles.text}`}
      >
       <span className='text-base font-medium'>
        {dic.tables[tableStyles.type]}
        {getTableExtensionTitle()}
       </span>
      </div>
      <div className='text-start ps-2 grow'>
       <div className='flex items-center gap-2'>
        <h3 className={`text-2xl lg:text-3xl ${tableStyles.text}`}>
         {table.tableNo.toString().padStart(2, '0')}
        </h3>
       </div>
       <div>
        <p className='text-neutral-500 dark:text-neutral-400 text-wrap'>
         {table.customerName || '---'}
        </p>
       </div>
      </div>
      <div className='flex items-center justify-between gap-4'>
       <div className='flex items-center gap-1 text-base text-neutral-600 dark:text-neutral-400 font-medium'>
        <span>
         {new Date().toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
         })}
        </span>
       </div>
       <div
        style={{
         direction: 'ltr',
        }}
        className={`font-medium text-base ${tableStyles.text}`}
       >
        --/{table.tableCapacity}
       </div>
      </div>
     </Link>
    </Button>
   </div>
   <div className='mx-4 -mt-4'>
    <Button
     variant='outline'
     className='w-full h-auto pt-5 pb-1 bg-neutral-100 dark:bg-neutral-900'
    >
     <SlOptions className='size-6 text-primary' />
    </Button>
   </div>
  </motion.div>
 );
}
