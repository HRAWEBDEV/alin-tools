import { useRef } from 'react';
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
  <DrawerContent className='h-[80svh]'>
   <DrawerHeader className='hidden'>
    <DrawerTitle>{dic.orderInfo.subscriber}</DrawerTitle>
   </DrawerHeader>
   <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
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
   <div ref={containerRef} className='overflow-hidden overflow-y-auto py-4'>
    <div></div>
   </div>
  </DrawerContent>
 );
}
