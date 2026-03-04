import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { useRackConfigContext } from '../services/rooms-rack-config/roomsRackConfigContext';
import { useKeenSlider } from 'keen-slider/react';
import { FaFilter } from 'react-icons/fa';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFormContext } from 'react-hook-form';
import {
 type RackFiltersSchema,
 defaultValues,
} from '../schemas/rackFiltersSchema';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';

const smallBadgeKeys: (keyof RackFiltersSchema)[] = ['floor', 'building'];
const largeBadgeKeys: (keyof RackFiltersSchema)[] = [
 'customers',
 'roomStateType',
 'roomStateKind',
 'roomStateInOutState',
];

export default function RackTools({ dic }: { dic: RoomsRackDictionary }) {
 const { localeInfo } = useBaseConfig();
 const { watch, setValue } = useFormContext<RackFiltersSchema>();

 const filterKeys = Object.keys(defaultValues) as (keyof RackFiltersSchema)[];
 const filterValues = watch(filterKeys);

 const filtersKeyValue = filterValues.map((value, i) => {
  return {
   key: filterKeys[i],
   value: value?.value,
  };
 });

 const activeFilters = filtersKeyValue.filter((item) => !!item.value);

 const [sliderRef] = useKeenSlider({
  rtl: localeInfo.contentDirection === 'rtl',
  slides: { perView: 'auto', spacing: 5 },
 });

 const {
  sidebar: { toggle, isOpen, isPin },
 } = useRackConfigContext();
 return (
  <div className='py-2'>
   <h1
    data-is-sidebar-pin={isPin}
    data-is-sidebar-open={isOpen}
    className='lg:hidden data-[is-sidebar-pin=false]:block data-[is-sidebar-open=false]:block text-center md:text-start font-medium text-2xl lg:text-3xl mb-4'
   >
    {dic.title}
   </h1>
   <div className='flex gap-2 items-center'>
    <div className='flex gap-2'>
     <Button
      variant='outline'
      size='lg'
      onClick={() => toggle()}
      className='text-neutral-600 dark:text-neutral-400'
     >
      <FaFilter className='size-4' />
      <span className='hidden md:inline'>{dic.sidebar.tabs.filters}</span>
      {!!activeFilters.length && (
       <Badge variant='destructive' className='size-6'>
        {activeFilters.length}
       </Badge>
      )}
     </Button>
    </div>
    <div
     key={
      isOpen
       ? `collapse${activeFilters.length}-${isPin}`
       : `expand${activeFilters.length}-${isPin}`
     }
     ref={sliderRef}
     className='keen-slider grow relative'
    >
     {activeFilters.map((item) => {
      let badgeSizeType: 'normal' | 'small' | 'large' = 'normal';
      if (smallBadgeKeys.includes(item.key)) {
       badgeSizeType = 'small';
      } else if (largeBadgeKeys.includes(item.key)) {
       badgeSizeType = 'large';
      }

      return (
       <Badge
        key={item.key}
        variant='outline'
        data-badge-size={badgeSizeType}
        className='keen-slider__slide inline-flex justify-between items-center rounded-md py-0.5 font-medium bg-neutral-100 dark:bg-neutral-900 text-[0.85rem] data-[badge-size="small"]:basis-32 data-[badge-size="small"]:w-32 data-[badge-size="normal"]:basis-46 data-[badge-size="normal"]:w-46 data-[badge-size="large"]:basis-72 data-[badge-size="large"]:w-72'
       >
        <p className='text-start grow overflow-hidden text-ellipsis'>
         <span className='text-neutral-500'>{dic.filters[item.key]}: </span>
         {item.value}
        </p>
        <Button
         variant='ghost'
         size='icon-sm'
         className='text-destructive'
         onClick={() => {
          setValue(
           item.key,
           defaultValues[
            item.key
           ] as RackFiltersSchema[keyof RackFiltersSchema],
          );
         }}
        >
         <FaRegTrashAlt />
        </Button>
       </Badge>
      );
     })}
    </div>
   </div>
  </div>
 );
}
