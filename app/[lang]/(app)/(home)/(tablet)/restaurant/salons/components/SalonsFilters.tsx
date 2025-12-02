'use client';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
 Drawer,
 DrawerTrigger,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerClose,
} from '@/components/ui/drawer';
import {
 InputGroup,
 InputGroupInput,
 InputGroupAddon,
} from '@/components/ui/input-group';
import { FaSearch } from 'react-icons/fa';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TiArrowLeft } from 'react-icons/ti';
import { TiArrowRight } from 'react-icons/ti';
import { Spinner } from '@/components/ui/spinner';
import { useSalonBaseConfigContext } from '../services/salon-base-config/salonBaseConfigContext';
import next from 'next';

export default function SalonsFilters({ dic }: { dic: SalonsDictionary }) {
 const {
  hallsInfo: {
   isFetching,
   isLoading,
   data,
   selectedHall,
   hasNext,
   hasPrev,
   nextHall,
   prevHall,
   changeHall,
  },
 } = useSalonBaseConfigContext();
 return (
  <div className='mb-4 p-4 lg:p-6 lg:pb-4 bg-background top-0 sticky z-3'>
   <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl mb-4'>
    {dic.title}
   </h1>
   <div className='grid md:grid-cols-[minmax(0,20rem)_max-content] md:justify-between gap-4'>
    <div className='grid grid-cols-[max-content_1fr_max-content]'>
     <Button
      size='icon'
      variant='outline'
      className='h-auto rounded-se-none rounded-ee-none border-e-0 px-6'
      disabled={isLoading || !hasPrev}
      onClick={prevHall}
     >
      <TiArrowRight className='size-8' />
     </Button>
     <Drawer>
      <DrawerTrigger asChild>
       <Button
        variant='outline'
        role='combobox'
        className='font-medium text-base p-2 pe-1! h-auto text-start rounded-none grow overflow-hidden'
        size='lg'
        disabled={isLoading}
       >
        <p className='grow text-ellipsis overflow-hidden'>
         {selectedHall?.value || ''}
        </p>
        <div className='flex gap-1 items-center'>
         {isFetching && <Spinner className='text-primary' />}
         <ChevronsUpDown className='opacity-50 size-6' />
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
         {data.map((item) => (
          <DrawerClose asChild key={item.key}>
           <li
            className='flex gap-1 items-center ps-6 py-2'
            onClick={() => changeHall(item)}
           >
            <Checkbox
             className='size-6'
             checked={item.key === selectedHall?.key}
            />
            <Button
             tabIndex={-1}
             variant='ghost'
             className='w-full justify-start h-auto text-lg'
            >
             <span>{item.value}</span>
            </Button>
           </li>
          </DrawerClose>
         ))}
        </ul>
       </div>
      </DrawerContent>
     </Drawer>
     <Button
      size='icon'
      variant='outline'
      className='h-auto rounded-ss-none rounded-es-none border-s-0 px-6'
      disabled={isLoading || !hasNext}
      onClick={nextHall}
     >
      <TiArrowLeft className='size-8' />
     </Button>
    </div>
    <div className='flex gap-4 items-center flex-wrap justify-center md:justify-start'>
     <div className='flex gap-2 items-center'>
      <Switch
       style={{
        direction: 'ltr',
       }}
       id='empty'
       className='scale-125'
       checked
      />
      <Label htmlFor='empty'>{dic.filters.empty} (10)</Label>
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
      <Label htmlFor='occupied'>{dic.filters.occupied} (10)</Label>
     </div>
     <div className='flex gap-2 items-center'>
      <Switch
       style={{
        direction: 'ltr',
       }}
       className='scale-125'
       checked
      />
      <Label htmlFor='reserved'>{dic.filters.reserved} (10)</Label>
     </div>
    </div>
   </div>
  </div>
 );
}
