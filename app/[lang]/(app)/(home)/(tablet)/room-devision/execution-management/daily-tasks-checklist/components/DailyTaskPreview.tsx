import { useState, useEffect } from 'react';
import { type DailyTasksChecklistDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/daily-tasks-checklist/dictionary';
import {
 Drawer,
 DrawerClose,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { type EditDailyTaskProps } from '../utils/editDailyTaskProps';
import { Button } from '@/components/ui/button';
import { FaCheck } from 'react-icons/fa';

export default function DailyTaskPreview({
 dic,
 editChecklist,
}: {
 dic: DailyTasksChecklistDictionary;
 editChecklist: EditDailyTaskProps;
}) {
 return (
  <Drawer
   open={editChecklist.showNew}
   onOpenChange={(newValue) => {
    if (newValue) return;
    editChecklist.onCloseEdit();
   }}
  >
   <DrawerContent className='h-[min(70svh,40rem)] flex flex-col'>
    <DrawerHeader>
     <DrawerTitle className='text-xl'>{dic.info.preview}</DrawerTitle>
    </DrawerHeader>
    <div className='grow overflow-auto p-4'>
     <div className='p-2 px-3 relative isolate w-[min(100%,30rem)] mx-auto'>
      <div className='flex flex-wrap justify-between gap-1 mb-2'>
       <div>
        <span className='font-medium text-6xl text-primary'>
         {editChecklist.targetEditChecklist?.roomLabel}
        </span>
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.occupied}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidOccupied ? '' : 'opacity-0'}`}
        />
       </div>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.ready}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidReady ? '' : 'opacity-0'}`}
        />
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.clean}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidClean ? '' : 'opacity-0'}`}
        />
       </div>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.outOfService}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidOutOfService ? '' : 'opacity-0'}`}
        />
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.outOfOrder}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidOutOfOrder ? '' : 'opacity-0'}`}
        />
       </div>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.houseUse}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.maidHouseUse ? '' : 'opacity-0'}`}
        />
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.dnd}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.dnd ? '' : 'opacity-0'}`}
        />
       </div>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.sleptOut}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.sleptOut ? '' : 'opacity-0'}`}
        />
       </div>
      </div>
      <div className='flex flex-wrap justify-between gap-1 mb-1'>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.noLuggage}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.noLuggage ? '' : 'opacity-0'}`}
        />
       </div>
       <div className='flex gap-1 items-center'>
        <span className='text-neutral-600 dark:text-neutral-400'>
         {dic.info.lightLuggage}:{' '}
        </span>
        <FaCheck
         className={`size-7 text-secondary ${editChecklist.targetEditChecklist?.lightLuggage ? '' : 'opacity-0'}`}
        />
       </div>
      </div>
     </div>
    </div>
   </DrawerContent>
  </Drawer>
 );
}
