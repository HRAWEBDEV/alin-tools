import { useState } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { Controller, useFormContext } from 'react-hook-form';
import {
 type RackFiltersSchema,
 defaultValues,
} from '../../schemas/rackFiltersSchema';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import {
 Drawer,
 DrawerClose,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, ChevronDownIcon } from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import {
 RackView,
 useRackConfigContext,
} from '../../services/rooms-rack-config/roomsRackConfigContext';
import { rackShowTypes } from '../../utils/rackShowTypes';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { rackLimitOptions } from '../../utils/rackLimitOptions';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IoAppsOutline, IoGridOutline } from 'react-icons/io5';
import { BsGripHorizontal } from 'react-icons/bs';

export default function RackFilters({ dic }: { dic: RoomsRackDictionary }) {
 const { locale } = useBaseConfig();
 const {
  initData,
  rack: {
   paging,
   onChangePaging,
   rowsCount,
   rackFutureDateStart,
   rackView,
   onChangeRackView,
  },
 } = useRackConfigContext();
 const { control, setValue, watch } = useFormContext<RackFiltersSchema>();
 const [showDatePicker, setShowDatePicker] = useState(false);
 const [rackShowTypeValue] = watch(['showType']);

 return (
  <>
   <div className='px-2'>
    <Tabs
     value={rackView}
     onValueChange={(newValue) => {
      onChangeRackView(newValue as RackView);
     }}
    >
     <TabsList className='h-11'>
      <TabsTrigger value='minimal'>
       <BsGripHorizontal className='size-7' />
      </TabsTrigger>
      <TabsTrigger value='compact'>
       <IoAppsOutline className='size-7' />
      </TabsTrigger>
      <TabsTrigger value='detailed'>
       <IoGridOutline className='size-7' />
      </TabsTrigger>
     </TabsList>
    </Tabs>
   </div>
   <div className='grid grid-cols-1 gap-5 p-4 pt-2'>
    <Field>
     <FieldLabel htmlFor='rack-limit'>{dic.filters.rackRoomsLimit}</FieldLabel>
     <Drawer>
      <DrawerTrigger asChild>
       <Button
        id='rack-limit'
        variant='outline'
        role='combobox'
        className='justify-between h-11'
       >
        <span className='text-start grow overflow-hidden text-ellipsis'>
         {paging.limit}
        </span>
        <div className='flex gap-1 items-center -me-2'>
         {initData.isLoading && <Spinner />}
         <ChevronsUpDown className='opacity-50' />
        </div>
       </Button>
      </DrawerTrigger>
      <DrawerContent className='h-[min(80svh,35rem)]'>
       <DrawerHeader className='hidden'>
        <DrawerTitle>{dic.filters.rackRoomsLimit}</DrawerTitle>
       </DrawerHeader>
       <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
        <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
         {dic.filters.rackRoomsLimit}
        </h1>
       </div>
       <div>
        <ul>
         {rackLimitOptions.map((item) => (
          <DrawerClose asChild key={item}>
           <li
            className='flex gap-1 items-center ps-6 py-2'
            onClick={() => {
             onChangePaging((pre) => ({ ...pre, limit: item }));
            }}
           >
            <Checkbox className='size-6' checked={item === paging.limit} />
            <Button
             tabIndex={-1}
             variant='ghost'
             className='w-full justify-start h-auto text-lg'
            >
             <span>{item}</span>
            </Button>
           </li>
          </DrawerClose>
         ))}
        </ul>
       </div>
      </DrawerContent>
     </Drawer>
    </Field>
    <Field>
     <FieldLabel htmlFor='rack-type'>{dic.filters.rackType}</FieldLabel>
     <Controller
      control={control}
      name='rackType'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='rack-type'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.rackType}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.rackType}
          </h1>
         </div>
         <div>
          {initData.data?.racks?.length ? (
           <ul>
            {initData.data?.racks?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.key === item.key}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='rack-show-type'>{dic.filters.showType}</FieldLabel>
     <Controller
      control={control}
      name='showType'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='rack-show-type'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value ? dic.filters[field.value.value] : ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.showType}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.showType}
          </h1>
         </div>
         <div>
          <ul>
           {rackShowTypes.map((item) => (
            <DrawerClose asChild key={item.key}>
             <li
              className='flex gap-1 items-center ps-6 py-2'
              onClick={() => {
               field.onChange(item);
              }}
             >
              <Checkbox
               className='size-6'
               checked={field.value?.value === item.value}
              />
              <Button
               tabIndex={-1}
               variant='ghost'
               className='w-full justify-start h-auto text-lg'
              >
               <span>{dic.filters[item.value]}</span>
              </Button>
             </li>
            </DrawerClose>
           ))}
          </ul>
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    {rackShowTypeValue?.value === 'future' && (
     <Controller
      control={control}
      name='date'
      render={({ field }) => (
       <Field>
        <FieldLabel htmlFor='date'>{dic.filters.date}</FieldLabel>
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
         <PopoverTrigger asChild>
          <Button
           variant='outline'
           id='date'
           className='justify-between font-normal h-11'
           onBlur={field.onBlur}
           ref={field.ref}
          >
           <span>
            {field.value ? field.value.toLocaleDateString(locale) : ''}
           </span>
           <ChevronDownIcon />
          </Button>
         </PopoverTrigger>
         <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
           mode='single'
           captionLayout='dropdown'
           className='[&]:[--cell-size:2.6rem]'
           disabled={(date) => date.getTime() < rackFutureDateStart.getTime()}
           selected={field.value || undefined}
           onSelect={(newValue) => {
            if (newValue) {
             field.onChange(newValue);
             setShowDatePicker(false);
            }
           }}
          />
         </PopoverContent>
        </Popover>
       </Field>
      )}
     />
    )}
    <Field>
     <FieldLabel htmlFor='room-type'>{dic.filters.roomType}</FieldLabel>
     <Controller
      control={control}
      name='roomType'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='room-type'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.roomType}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.roomType}
          </h1>
         </div>
         <div>
          {initData.data?.roomTypes?.length ? (
           <ul>
            {initData.data?.roomTypes?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='building'>{dic.filters.building}</FieldLabel>
     <Controller
      control={control}
      name='building'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='building'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.building}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.building}
          </h1>
         </div>
         <div>
          {initData.data?.buildings?.length ? (
           <ul>
            {initData.data?.buildings?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='floor'>{dic.filters.floor}</FieldLabel>
     <Controller
      control={control}
      name='floor'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='floor'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.floor}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.floor}
          </h1>
         </div>
         <div>
          {initData.data?.floors?.length ? (
           <ul>
            {initData.data?.floors?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='room-state-group'>
      {dic.filters.roomStateGroup}
     </FieldLabel>
     <Controller
      control={control}
      name='roomStateGroup'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='room-state-group'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.roomStateGroup}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.roomStateGroup}
          </h1>
         </div>
         <div>
          {initData.data?.roomStateGroups?.length ? (
           <ul>
            {initData.data?.roomStateGroups?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='room-state-in-out'>
      {dic.filters.roomStateInOutState}
     </FieldLabel>
     <Controller
      control={control}
      name='roomStateInOutState'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='room-state-in-out'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.roomStateInOutState}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.roomStateInOutState}
          </h1>
         </div>
         <div>
          {initData.data?.roomStateInOutStates?.length ? (
           <ul>
            {initData.data?.roomStateInOutStates?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='room-state-kind'>
      {dic.filters.roomStateKind}
     </FieldLabel>
     <Controller
      control={control}
      name='roomStateKind'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='room-state-kind'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.roomStateKind}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.roomStateKind}
          </h1>
         </div>
         <div>
          {initData.data?.roomStateKinds?.length ? (
           <ul>
            {initData.data?.roomStateKinds?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='room-state-type'>
      {dic.filters.roomStateType}
     </FieldLabel>
     <Controller
      control={control}
      name='roomStateType'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='room-state-type'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.roomStateType}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.roomStateType}
          </h1>
         </div>
         <div>
          {initData.data?.roomStateTypes?.length ? (
           <ul>
            {initData.data?.roomStateTypes?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
    <Field>
     <FieldLabel htmlFor='customers'>{dic.filters.customers}</FieldLabel>
     <Controller
      control={control}
      name='customers'
      render={({ field }) => (
       <Drawer>
        <DrawerTrigger asChild>
         <Button
          id='customers'
          variant='outline'
          role='combobox'
          className='justify-between h-11'
          onBlur={field.onBlur}
          ref={field.ref}
         >
          <span className='text-start grow overflow-hidden text-ellipsis'>
           {field.value?.value || ''}
          </span>
          <div className='flex gap-1 items-center -me-2'>
           {initData.isLoading && <Spinner />}
           {field.value && (
            <Button
             type='button'
             variant={'ghost'}
             size={'icon'}
             onClick={(e) => {
              e.stopPropagation();
              field.onChange(null);
             }}
             className='text-rose-700 dark:text-rose-400'
            >
             <FaRegTrashAlt />
            </Button>
           )}
           <ChevronsUpDown className='opacity-50' />
          </div>
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(80svh,35rem)]'>
         <DrawerHeader className='hidden'>
          <DrawerTitle>{dic.filters.customers}</DrawerTitle>
         </DrawerHeader>
         <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
          <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
           {dic.filters.customers}
          </h1>
         </div>
         <div>
          {initData.data?.customers?.length ? (
           <ul>
            {initData.data?.customers?.map((item) => (
             <DrawerClose asChild key={item.key}>
              <li
               className='flex gap-1 items-center ps-6 py-2'
               onClick={() => {
                field.onChange(item);
               }}
              >
               <Checkbox
                className='size-6'
                checked={field.value?.value === item.value}
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
           <div className='text-center font-medium'></div>
          )}
         </div>
        </DrawerContent>
       </Drawer>
      )}
     />
    </Field>
   </div>
   <div className='sticky bottom-0 bg-background p-2 border-t border-input'>
    <Button
     className='w-full text-destructive border-destructive'
     variant='outline'
     onClick={() => {
      Object.keys(defaultValues).forEach((key) => {
       const typedKey = key as keyof RackFiltersSchema;
       if (typedKey === 'rackType') {
        if (initData.isSuccess) {
         setValue(typedKey, initData.data!.racks[0]);
        }
        return;
       }
       if (typedKey === 'showType') {
        setValue(typedKey, rackShowTypes[0]);
        return;
       }
       setValue(
        typedKey,
        defaultValues[typedKey] as RackFiltersSchema[keyof RackFiltersSchema],
       );
      });
     }}
    >
     <span className='basis-80'></span>
     {dic.filters.clearFilters}
     <span className='basis-80 text-xs text-neutral-500'>
      ({dic.tools.results}: {rowsCount})
     </span>
    </Button>
   </div>
  </>
 );
}
