import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSettingsContext } from '../../services/profile/settings/settingsContext';
import { MdViewComfy, MdViewCompact, MdFormatBold } from 'react-icons/md';
import { cx } from 'class-variance-authority';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
 Drawer,
 DrawerContent,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { ReactNode } from 'react';
import { IoFilterCircleOutline } from 'react-icons/io5';

export function TableDisplayFilters({
 statusSwitches,
}: {
 statusSwitches: ReactNode;
}) {
 const { tempDisplayMode, handleToggleDisplayMode, handleToggleBoldStyle } =
  useSettingsContext();
 const isDesktop = useMediaQuery('(min-width: 640px)');
 function renderFilters() {
  return (
   <>
    <ToggleGroup
     className='w-full sm:max-w-[84px] grow'
     variant='outline'
     type='single'
     value={tempDisplayMode['displayMode']}
     onValueChange={(newVal) => {
      if (newVal) handleToggleDisplayMode(newVal as 'minimal' | 'normal');
     }}
    >
     <ToggleGroupItem
      value='minimal'
      aria-label='Minimal Table View Mode'
      className='cursor-pointer grow'
     >
      <MdViewCompact className='sm:size-4 size-6' />
     </ToggleGroupItem>
     <ToggleGroupItem
      value='normal'
      aria-label='Normal Table View Mode'
      className='cursor-pointer grow'
     >
      <MdViewComfy className='sm:size-4 size-6' />
     </ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup
     variant='outline'
     type='multiple'
     className='w-full sm:w-auto grow sm:grow-0'
     value={tempDisplayMode['boldStyle'] ? ['bold'] : []}
     onValueChange={(newVal) => handleToggleBoldStyle(newVal.includes('bold'))}
    >
     <ToggleGroupItem
      value='bold'
      aria-label='Toggle bold'
      className={cx(
       'cursor-pointer grow transition-colors',
       tempDisplayMode['boldStyle'] ? 'text-orange-950! bg-orange-300!' : '',
      )}
     >
      <MdFormatBold className='size-6 sm:size-5' />
     </ToggleGroupItem>
    </ToggleGroup>
   </>
  );
 }

 return isDesktop ? (
  <div className='flex w-full sm:w-auto gap-1'>{renderFilters()}</div>
 ) : (
  <>
   <Drawer>
    <DrawerTrigger className='w-fit' asChild>
     <IoFilterCircleOutline className='text-gray-500 hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-300 size-8 cursor-pointer' />
    </DrawerTrigger>
    <DrawerContent className='p-6 gap-4'>
     <DrawerTitle className='text-center'>فیلتر‌ها</DrawerTitle>
     {renderFilters()}
     <div className='flex flex-col gap-4 my-4'>
      <h6 className='font-medium text-center'>وضعیت میز‌ها</h6>
      <div className='flex items-center justify-between'>{statusSwitches}</div>
     </div>
    </DrawerContent>
   </Drawer>
  </>
 );
}
