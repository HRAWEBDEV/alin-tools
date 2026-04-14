'use client';

import { MdTouchApp } from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import type { Revenue } from '../services/guestsExpensesApiActions';
import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';

export default function GuestsExpenseCard({
 expense,
 dic,
 onClick,
}: {
 expense: Revenue;
 dic: GuestsExpensesDictionary;
 onClick: () => void;
}) {
 const { locale } = useBaseConfig();

 return (
  <button
   onClick={onClick}
   className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate cursor-pointer text-start flex flex-col gap-1'
  >
   <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>

   <div className='flex flex-wrap justify-between gap-1 w-full'>
    <div className='flex items-center justify-between gap-2 w-full whitespace-nowrap'>
     <span className='text-sm text-neutral-600 dark:text-neutral-400'>
      {dic.fields?.room}:{' '}
     </span>
     <span className='text-base font-medium text-neutral-700 dark:text-neutral-400 text-start grow overflow-hidden text-ellipsis'>
      {expense.roomLabel || expense.roomNo || '-'}
     </span>
    </div>
   </div>

   <div className='flex items-center justify-between gap-2 w-full'>
    <p className='text-sm flex-1 font-medium text-neutral-700 truncate dark:text-neutral-400 text-start'>
     {expense.itemName || '-'}
    </p>
   </div>

   <div className='flex items-center justify-between gap-2 w-full'>
    <p className='text-sm flex-1 truncate text-start text-primary font-semibold'>
     {expense.totalValue ? expense.totalValue.toLocaleString(locale) : 0}{' '}
     <span className='text-xs font-normal text-primary/80'>
      {expense.arzName || ''}
     </span>
    </p>
   </div>

   <div className='flex flex-wrap gap-1 justify-between w-full mt-1'>
    <span className='text-secondary/80 text-sm'>
     {expense.dateTimeDateTimeOffset
      ? new Date(expense.dateTimeDateTimeOffset).toLocaleDateString(locale)
      : '-'}
    </span>
    <span className='text-neutral-500/80 text-xs self-end'>
     {expense.dateTimeDateTimeOffset
      ? new Date(expense.dateTimeDateTimeOffset).toLocaleTimeString(locale, {
         hour: '2-digit',
         minute: '2-digit',
        })
      : ''}
    </span>
   </div>
  </button>
 );
}
