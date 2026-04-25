'use client';
import { MdTouchApp } from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import type { Revenue } from '../services/guestsExpensesApiActions';
import type { GuestsExpensesDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/guests-expenses/dictionary';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

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
 const { format } = useCurrencyFormatter();

 return (
  <button
   onClick={onClick}
   className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate cursor-pointer text-start flex flex-col'
  >
   <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
    <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
   </div>
   <div className='flex flex-wrap justify-between gap-1 w-full'>
    <div className='flex items-center justify-between gap-2 w-full whitespace-nowrap'>
     <span className='text-3xl font-medium text-primary text-start grow overflow-hidden text-ellipsis'>
      {expense.roomLabel || expense.roomNo || '-'}
     </span>
    </div>
   </div>
   <div className='flex items-center justify-between gap-2 w-full mb-1'>
    <p className='text-lg flex-1 font-medium text-neutral-700 truncate dark:text-neutral-400 text-start'>
     {expense.itemName || '-'}
    </p>
   </div>
   <div className='flex gap-1 mb-1 items-center'>
    <span className='text-sm text-neutral-600 dark:text-neutral-400'>
     {dic.fields.total}:{' '}
    </span>
    <div className='text-secondary'>
     <span className='text-xl font-medium'>
      {format(expense.totalValue || 0)}
     </span>
     <span className='ms-1 text-sm'>{expense.arzName}</span>
    </div>
   </div>
   <div className='flex gap-1 mb-2 items-center'>
    <span className='text-sm text-neutral-600 dark:text-neutral-400'>
     {dic.fields.discount}:{' '}
    </span>
    <div className='text-destructive'>
     <span className='font-medium'>{format(expense.discount || 0)}</span>
     <span className='ms-1 text-sm'>{expense.arzName}</span>
    </div>
   </div>
   <div className='flex flex-wrap justify-end gap-2 font-medium text-sm text-neutral-700 dark:text-neutral-400'>
    <span>
     {expense.dateTimeDateTimeOffset
      ? new Date(expense.dateTimeDateTimeOffset).toLocaleDateString(locale)
      : '-'}
    </span>
    <span className=' self-end'>
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
