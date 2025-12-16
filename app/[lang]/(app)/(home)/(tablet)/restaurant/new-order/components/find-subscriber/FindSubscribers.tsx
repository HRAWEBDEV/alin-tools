import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { type NewOrderDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/new-order/dictionary';
import {
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { FaSearch } from 'react-icons/fa';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';

export default function FindSubscribers({ dic }: { dic: NewOrderDictionary }) {
 const containerRef = useRef<HTMLDivElement>(null);
 return (
  <DrawerContent className='h-[min(80svh,35rem)]'>
   <DrawerHeader className='hidden'>
    <DrawerTitle>{dic.orderInfo.subscriber}</DrawerTitle>
   </DrawerHeader>
   <div className='p-4 pt-2 pb-4 border-b border-input flex flex-wrap justify-between gap-4'>
    <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
     {dic.orderInfo.subscriber}
    </h1>
    <div className='w-[20rem]'>
     <InputGroup>
      <InputGroupInput type='search' placeholder={dic.findSubscribers.search} />
      <InputGroupAddon align='inline-end'>
       <FaSearch className='text-primary size-4' />
      </InputGroupAddon>
     </InputGroup>
    </div>
   </div>
   <div
    ref={containerRef}
    className='overflow-hidden overflow-y-auto p-4 bg-neutral-100 dark:bg-neutral-900'
   >
    <ul className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(14rem,15rem))]'>
     {Array.from({ length: 20 }, (_, i) => i).map((i) => (
      <li key={i}>
       <Button
        variant={'outline'}
        className='items-start justify-start text-start h-auto w-full bg-background shadow-md'
       >
        <div className='grid gap-1'>
         <div>
          <span className='text-sm text-neutral-600 dark:text-neutral-400'>
           {dic.findSubscribers.code}:{' '}
          </span>
          <span>۱۱۱</span>
         </div>
         <div>
          <span className='text-sm text-neutral-600 dark:text-neutral-400'>
           {dic.findSubscribers.name}:{' '}
          </span>
          <span>حمیدرضا اکبری</span>
         </div>
         <div>
          <span className='text-sm text-neutral-600 dark:text-neutral-400'>
           {dic.findSubscribers.nationalCode}:{' '}
          </span>
          <span>001965520</span>
         </div>
         <div>
          <span className='text-sm text-neutral-600 dark:text-neutral-400'>
           {dic.findSubscribers.phoneNumber}:{' '}
          </span>
          <span>0904656</span>
         </div>
        </div>
       </Button>
      </li>
     ))}
    </ul>
   </div>
  </DrawerContent>
 );
}
