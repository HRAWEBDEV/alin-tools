import { Button } from '@/components/ui/button';
import {
 Select,
 SelectItem,
 SelectTrigger,
 SelectContent,
 SelectGroup,
 SelectValue,
} from '@/components/ui/select';
import {
 MdKeyboardDoubleArrowLeft,
 MdKeyboardDoubleArrowRight,
 MdKeyboardArrowLeft,
 MdKeyboardArrowRight,
} from 'react-icons/md';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { rackLimitOptions } from '../../utils/rackLimitOptions';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';

export default function RackPagination({ dic }: { dic: RoomsRackDictionary }) {
 const { localeInfo } = useBaseConfig();
 const {
  rack: { paging, onChangePaging },
 } = useRackConfigContext();
 return (
  <div className='py-2 flex justify-between gap-2 sticky bottom-0 z-1 bg-background'>
   <div className='md:basis-52'>
    <Select
     dir={localeInfo.contentDirection}
     value={paging.limit.toString()}
     onValueChange={(newValue) =>
      onChangePaging((pre) => ({ ...pre, limit: Number(newValue) }))
     }
    >
     <SelectTrigger>
      <SelectValue />
     </SelectTrigger>
     <SelectContent>
      <SelectGroup>
       {rackLimitOptions.map((item) => (
        <SelectItem key={item} value={item.toString()}>
         {item}
        </SelectItem>
       ))}
      </SelectGroup>
     </SelectContent>
    </Select>
   </div>
   <div className='flex gap-1 items-center text-neutral-600 dark:text-neutral-400'>
    <div className='flex gap-1 items-center'>
     <Button variant='outline' size='icon'>
      <MdKeyboardDoubleArrowRight className='size-4 ltr:rotate-180' />
     </Button>
     <Button variant='outline' className='gap-1'>
      <MdKeyboardArrowRight />
      <span className='hidden lg:inline'>{dic.pagination.prev}</span>
     </Button>
     <div
      style={{
       direction: 'ltr',
      }}
      className='text-base'
     >
      <span>2</span> / <span>1</span>
     </div>
     <Button variant='outline' className='gap-1 ltr:rotate-180'>
      <span className='hidden lg:inline'>{dic.pagination.next}</span>
      <MdKeyboardArrowLeft className='ltr:rotate-180' />
     </Button>
     <Button variant='outline' size='icon'>
      <MdKeyboardDoubleArrowLeft className='size-4 ltr:rotate-180' />
     </Button>
    </div>
   </div>
   <div className='basis-52 hidden md:block'></div>
  </div>
 );
}
