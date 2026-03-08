import { Button } from '@/components/ui/button';
import {
 MdKeyboardDoubleArrowLeft,
 MdKeyboardDoubleArrowRight,
 MdKeyboardArrowLeft,
 MdKeyboardArrowRight,
} from 'react-icons/md';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';

export default function RackPagination({ dic }: { dic: RoomsRackDictionary }) {
 const {
  rack: { pageCount, paging, onChangePage, isFirstPage, isLastPage },
 } = useRackConfigContext();
 return (
  <>
   {false ? null : (
    <div className='py-2 flex justify-center gap-2 sticky bottom-0 z-2 bg-background'>
     <div className='flex gap-1 items-center text-neutral-600 dark:text-neutral-400'>
      <div className='flex gap-1 items-center'>
       <Button
        variant='outline'
        size='icon'
        disabled={isFirstPage}
        onClick={() => onChangePage('first')}
       >
        <MdKeyboardDoubleArrowRight className='size-4 ltr:rotate-180' />
       </Button>
       <Button
        disabled={isFirstPage}
        variant='outline'
        className='gap-1'
        onClick={() => onChangePage('prev')}
       >
        <MdKeyboardArrowRight />
        <span className='hidden lg:inline'>{dic.pagination.prev}</span>
       </Button>
       <div
        style={{
         direction: 'ltr',
        }}
        className='text-base'
       >
        <span>{paging.offset + 1}</span> / <span>{pageCount}</span>
       </div>
       <Button
        disabled={isLastPage}
        variant='outline'
        className='gap-1 ltr:rotate-180'
        onClick={() => onChangePage('next')}
       >
        <span className='hidden lg:inline'>{dic.pagination.next}</span>
        <MdKeyboardArrowLeft className='ltr:rotate-180' />
       </Button>
       <Button
        disabled={isLastPage}
        variant='outline'
        size='icon'
        onClick={() => onChangePage('last')}
       >
        <MdKeyboardDoubleArrowLeft className='size-4 ltr:rotate-180' />
       </Button>
      </div>
     </div>
    </div>
   )}
  </>
 );
}
