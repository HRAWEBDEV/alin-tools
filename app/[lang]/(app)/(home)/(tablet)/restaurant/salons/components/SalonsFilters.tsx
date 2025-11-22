'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SalonsFilters({ dic }: { dic: SalonsDictionary }) {
 return (
  <div className='grid gap-4 md:grid-cols-[max-content_1fr] lg:grid-cols-[max-content_minmax(0,40rem)] items-center mb-4 p-4 lg:p-8 bg-background top-0 sticky z-3'>
   <h1 className='font-medium text-2xl lg:text-3xl'>{dic.title}</h1>
   <div>
    <Drawer>
     <DrawerTrigger asChild>
      <Button
       variant='outline'
       role='combobox'
       className='w-full grid grid-cols-[1fr_max-content] md:grid-cols-[1fr_max-content_max-content] justify-items-start justify-start font-medium text-base bg-sky-100 dark:bg-sky-900 border-primary p-2 h-auto'
       size='lg'
      >
       <span>سالن شماره یک</span>
       <div className='flex flex-wrap gap-2 row-start-2 md:row-start-auto'>
        <Badge className='font-medium border-primary' variant='outline'>
         <span>{dic.filters.tables}: </span>
         <span>10</span>
        </Badge>
        <Badge className='font-medium border-secondary' variant='outline'>
         <span>{dic.filters.empty}: </span>
         <span>10</span>
        </Badge>
        <Badge
         className='font-medium border-red-600 dark:border-red-400'
         variant='outline'
        >
         <span>{dic.filters.occupied}: </span>
         <span>10</span>
        </Badge>
        <Badge
         className='font-medium border-yellow-600 dark:border-yellow-400'
         variant='outline'
        >
         <span>{dic.filters.reserved}: </span>
         <span>10</span>
        </Badge>
       </div>
       <div className='flex gap-2'>
        <ChevronsUpDown className='opacity-50 size-6 ' />
       </div>
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
          <Checkbox tabIndex={-1} className='size-6' defaultChecked={i === 0} />
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
   <div className='hidden md:block'></div>
   <div className='flex gap-6 flex-wrap items-center'>
    <div className='flex gap-2 items-center'>
     <Switch
      style={{
       direction: 'ltr',
      }}
      id='empty'
      className='scale-125'
      checked
     />
     <Label htmlFor='empty'>{dic.filters.empty}</Label>
    </div>
    <div className='flex gap-2 items-center'>
     <Switch
      style={{
       direction: 'ltr',
      }}
      id='occupied'
      className='scale-125'
      checked
     />
     <Label htmlFor='occupied'>{dic.filters.occupied}</Label>
    </div>
    <div className='flex gap-2 items-center'>
     <Switch
      style={{
       direction: 'ltr',
      }}
      id='reserved'
      className='scale-125'
      checked
     />
     <Label htmlFor='reserved'>{dic.filters.reserved}</Label>
    </div>
   </div>
  </div>
 );
}
