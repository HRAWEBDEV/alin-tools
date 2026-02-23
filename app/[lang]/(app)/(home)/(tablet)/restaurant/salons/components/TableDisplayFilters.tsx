import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSettingsContext } from '../../services/profile/settings/settingsContext';
import { MdViewComfy, MdViewCompact, MdFormatBold } from 'react-icons/md';
import { cx } from 'class-variance-authority';
export function TableDisplayFilters() {
 const { tempDisplayMode, handleToggleDisplayMode, handleToggleBoldStyle } =
  useSettingsContext();
 return (
  <div className='flex w-full sm:w-auto gap-1'>
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
     <MdViewCompact />
    </ToggleGroupItem>
    <ToggleGroupItem
     value='normal'
     aria-label='Normal Table View Mode'
     className='cursor-pointer grow'
    >
     <MdViewComfy />
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
     <MdFormatBold className='size-5' />
    </ToggleGroupItem>
   </ToggleGroup>
  </div>
 );
}
