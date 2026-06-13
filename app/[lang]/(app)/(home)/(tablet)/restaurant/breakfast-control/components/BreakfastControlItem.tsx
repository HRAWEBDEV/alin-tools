import { type BreakfastControlDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/breakfastControl/dictionary';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { MdTouchApp } from 'react-icons/md';
import { type BreackfastControlRes } from '../services/BreakfastControlApiActions';

export default function BreakfastControlItem({
 dic,
 checklist,
}: {
 dic: BreakfastControlDictionary;
 checklist: BreackfastControlRes['bfCheckListDatas'][number];
}) {
 const { locale } = useBaseConfig();

 return (
  <>
   <button className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate whitespace-normal'>
    <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
     <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-2'>
     <div>
      <span className='font-medium text-2xl'>{checklist.roomNo}</span>
     </div>
    </div>
    <div className='mb-1 flex items-center justify-between gap-2'>
     <p className='text-base mb-1 font-medium text-primary text-start grow'>
      {checklist.customerName}
     </p>
    </div>
    <div className='mb-1 flex items-center justify-between gap-2'>
     <p className='text-base mb-1 font-medium text-neutral-700 dark:text-neutral-300 text-start grow'>
      {checklist.guestFullName}
     </p>
    </div>
   </button>
  </>
 );
}
