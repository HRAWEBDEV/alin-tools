import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';
import { CheckList } from '../services/dailyTasksApiActions';
import { MdTouchApp } from 'react-icons/md';
import { type EditDailyTaskProps } from '../utils/editDailyTaskProps';
import { FaCheck } from 'react-icons/fa';

export default function DailyTaskItem({
 dic,
 checkoutItem,
 editChecklist,
}: {
 dic: DailyTasksChecklistDictionary;
 checkoutItem: CheckList;
 editChecklist: EditDailyTaskProps;
}) {
 return (
  <>
   <button
    className='border border-input rounded-md p-2 px-3 bg-neutral-100 dark:bg-neutral-900 relative isolate'
    onClick={() => editChecklist.onShowEdit(checkoutItem.id)}
   >
    <div className='absolute bottom-0 end-0 -z-1 opacity-60'>
     <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
    </div>
    <div className='flex flex-wrap justify-between gap-1'>
     <div>
      <span className='font-medium text-4xl text-primary'>
       {checkoutItem.roomLabel}
      </span>
     </div>
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-1'>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.occupied}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.maidOccupied ? '' : 'opacity-0'}`}
      />
     </div>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.ready}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.maidReady ? '' : 'opacity-0'}`}
      />
     </div>
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-1'>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.clean}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.maidClean ? '' : 'opacity-0'}`}
      />
     </div>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.outOfService}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.maidOutOfService ? '' : 'opacity-0'}`}
      />
     </div>
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-1'>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.outOfOrder}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.maidOutOfOrder ? '' : 'opacity-0'}`}
      />
     </div>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.houseUse}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.maidHouseUse ? '' : 'opacity-0'}`}
      />
     </div>
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-1'>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.dnd}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.dnd ? '' : 'opacity-0'}`}
      />
     </div>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.sleptOut}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.sleptOut ? '' : 'opacity-0'}`}
      />
     </div>
    </div>
    <div className='flex flex-wrap justify-between gap-1 mb-1'>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.noLuggage}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.noLuggage ? '' : 'opacity-0'}`}
      />
     </div>
     <div className='flex gap-1 items-center'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>
       {dic.info.lightLuggage}:{' '}
      </span>
      <FaCheck
       className={`size-5 text-secondary ${checkoutItem.lightLuggage ? '' : 'opacity-0'}`}
      />
     </div>
    </div>
   </button>
  </>
 );
}
