'use client';
import { useState } from 'react';
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
import { getTableStateStyles } from '../utils/tableStates';
import { TableStateTypes } from '../utils/tableStates';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { TableDisplayFilters } from './TableDisplayFilters';
import { useMediaQuery } from '@/hooks/useMediaQuery';
export default function SalonsFilters({ dic }: { dic: SalonsDictionary }) {
 const [searchedSalon, setSearchedSalon] = useState('');
 const { locale } = useBaseConfig();
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
  tablesInfo: {
   tablesReport,
   filters,
   showTransferTable,
   changeFilters,
   showMergeTable,
   lastTablesUpdate,
  },
 } = useSalonBaseConfigContext();

 const filteredSalons = data.filter((item) =>
  item.value.includes(searchedSalon),
 );
 const isDesktop = useMediaQuery('(min-width: 640px)');
 const statusSwitches = (
  <>
   <div className='flex gap-2 items-center'>
    <Switch
     disabled={showTransferTable || showMergeTable}
     style={{
      direction: 'ltr',
     }}
     id='empty'
     className='scale-125'
     checked={filters.showEmptyTables}
     onCheckedChange={(newValue) =>
      changeFilters({
       ...filters,
       showEmptyTables: newValue,
      })
     }
    />
    <Label
     htmlFor='empty'
     className={
      getTableStateStyles(TableStateTypes.readyToService).text + ' font-medium'
     }
    >
     {dic.filters.empty} ({tablesReport.emptyTables})
    </Label>
   </div>
   <div className='flex gap-2 items-center'>
    <Switch
     disabled={showTransferTable || showMergeTable}
     style={{
      direction: 'ltr',
     }}
     id='occupied'
     className='scale-125'
     checked={filters.showOccupiedTables}
     onCheckedChange={(newValue) =>
      changeFilters({
       ...filters,
       showOccupiedTables: newValue,
      })
     }
    />
    <Label
     htmlFor='occupied'
     className={
      getTableStateStyles(TableStateTypes.regularCustomer).text + ' font-medium'
     }
    >
     {dic.filters.occupied} ({tablesReport.occupiedTables})
    </Label>
   </div>
   <div className='flex gap-2 items-center'>
    <Switch
     id='reserved'
     disabled={showTransferTable}
     style={{
      direction: 'ltr',
     }}
     className='scale-125'
     checked={filters.showReservedTables}
     onCheckedChange={(newValue) =>
      changeFilters({
       ...filters,
       showReservedTables: newValue,
      })
     }
    />
    <Label
     htmlFor='reserved'
     className={
      getTableStateStyles(TableStateTypes.reserved).text + ' font-medium'
     }
    >
     {dic.filters.reserved} ({tablesReport.reservedTables})
    </Label>
   </div>
  </>
 );

 return (
  <>
   <h1 className='text-center md:text-start font-medium text-2xl lg:text-3xl p-4 lg:p-6 pb-0!'>
    {dic.title}
   </h1>
   <div className='bg-background sticky top-0 z-2 p-4 lg:p-6 pt-4! pb-2!'>
    <div className='flex flex-col md:flex-row md:justify-between lg:gap-2 gap-4 sm:mb-6 mb-2 top-0 sticky z-3 w-full'>
     <div className='flex sm:gap-4 lg:gap-2 xl:gap-4 gap-4 items-center grow'>
      <div className='grid lg:max-w-[24rem] xl:max-w-md 2xl:max-w-lg grid-cols-[max-content_1fr_max-content] grow w-full'>
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
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.selectSalon}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.selectSalon}
          </h1>
          <div className='w-[20rem]'>
           <InputGroup>
            <InputGroupInput
             placeholder={dic.filters.search}
             value={searchedSalon}
             onChange={(e) => setSearchedSalon(e.target.value)}
            />
            <InputGroupAddon align='inline-end'>
             <FaSearch className='text-primary size-4' />
            </InputGroupAddon>
           </InputGroup>
          </div>
         </div>
         <div className='overflow-hidden overflow-y-auto'>
          {filteredSalons.length ? (
           <ul>
            {filteredSalons.map((item) => (
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
          ) : (
           <div className='text-center font-medium'>
            <span>{dic.noItemsFound}</span>
           </div>
          )}
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
      <TableDisplayFilters statusSwitches={statusSwitches} />
     </div>
     <div className='flex md:gap-2 lg:gap-3 xl:gap-4 items-center flex-wrap justify-between md:justify-start shrink-0 lg:flex-nowrap'>
      {isDesktop && statusSwitches}

      {/* <div className='flex gap-2 items-center'> */}
      {/*  <Switch */}
      {/*   id='outOfService' */}
      {/*   style={{ */}
      {/*    direction: 'ltr', */}
      {/*   }} */}
      {/*   className='scale-125' */}
      {/*   checked */}
      {/*  /> */}
      {/*  <Label */}
      {/*   htmlFor='outOfService' */}
      {/*   className={ */}
      {/*    getTableStateStyles(TableStateTypes.outOfService).text + ' font-medium' */}
      {/*   } */}
      {/*  > */}
      {/*   {dic.filters.outOfService} ({tablesReport.outOfServiceTables}) */}
      {/*  </Label> */}
      {/* </div> */}
     </div>
    </div>
    <div>
     <div className='text-center md:text-start text-sm font-medium text-neutral-700 dark:text-neutral-400'>
      <span>{dic.filters.lastUpdate}: </span>
      <span>
       {lastTablesUpdate
        ? lastTablesUpdate.toLocaleTimeString(locale, {
           hour: '2-digit',
           minute: '2-digit',
          })
        : ''}
      </span>
     </div>
    </div>
   </div>
  </>
 );
}

// <div className='mb-4 p-2 lg:p-6 lg:pb-2 '>
