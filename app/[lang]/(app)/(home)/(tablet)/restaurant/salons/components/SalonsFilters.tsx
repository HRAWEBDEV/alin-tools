'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { FaSearch } from 'react-icons/fa';

export default function SalonsFilters({ dic }: { dic: SalonsDictionary }) {
 return (
  <div className='grid gap-4 grid-cols-[max-content_minmax(0,20rem)] items-center'>
   <h1 className='font-medium text-2xl lg:text-3xl'>{dic.title}</h1>
   <div>
    <Drawer>
     <DrawerTrigger asChild>
      <Button
       variant='outline'
       role='combobox'
       className='w-full justify-between font-medium text-base bg-sky-100 dark:bg-sky-900 border-primary'
       size='lg'
      >
       سالن شماره یک
       <ChevronsUpDown className='opacity-50 size-6 -me-2' />
      </Button>
     </DrawerTrigger>
     <DrawerContent className='h-[80svh]'>
      <DrawerHeader className='hidden'>
       <DrawerTitle>{dic.filters.selectSalon}</DrawerTitle>
      </DrawerHeader>
      <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
       <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
        {dic.filters.selectSalon}
       </h1>
       <div className='w-[20rem]'>
        <InputGroup>
         <InputGroupInput placeholder={dic.filters.search} type='search' />
         <InputGroupAddon align='inline-end'>
          <FaSearch className='text-primary size-4' />
         </InputGroupAddon>
        </InputGroup>
       </div>
      </div>
      <div>
       <ul>
        {Array.from({ length: 3 }, (_, i) => i).map((i) => (
         <li className='flex gap-1 items-center ps-6 py-2' key={i}>
          <Checkbox className='size-6' defaultChecked={i === 0} />
          <Button
           variant='ghost'
           className='w-full justify-start h-auto text-lg'
          >
           <span>سالن شماره {i + 1}</span>
          </Button>
         </li>
        ))}
       </ul>
      </div>
     </DrawerContent>
    </Drawer>
   </div>
  </div>
 );
}
