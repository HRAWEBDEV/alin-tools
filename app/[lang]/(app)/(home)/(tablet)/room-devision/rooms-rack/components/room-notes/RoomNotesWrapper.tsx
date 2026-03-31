import { useState, useEffect } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
 DialogFooter,
} from '@/components/ui/dialog';
import { type Rack } from '../../services/roomsRackApiActions';
import { RoomNotesProps } from '../../utils/room-notes/roomNotesProps';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Button } from '@/components/ui/button';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import {
 rackRoomNotesBaseKey,
 getInitialData,
} from '../../services/room-notes/RackRoomNotesApiActions';
import { useQuery } from '@tanstack/react-query';
import RoomNotes from './RoomNotes';
import NewRoomNote from './NewRoomNote';
import { useFormContext, Controller } from 'react-hook-form';
import {
 type RoomNotesSchema,
 defaultValues,
} from '../../schemas/room-notes/roomNotesSchema';
import { Badge } from '@/components/ui/badge';
import {
 MdKeyboardDoubleArrowLeft,
 MdKeyboardDoubleArrowRight,
 MdKeyboardArrowLeft,
 MdKeyboardArrowRight,
} from 'react-icons/md';
import {
 Drawer,
 DrawerClose,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
 DrawerTrigger,
} from '@/components/ui/drawer';
import { useDateFns } from '@/hooks/useDateFns';
import { Calendar } from '@/components/ui/calendar';
import { ChevronsUpDown, ChevronDownIcon } from 'lucide-react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Field, FieldLabel } from '@/components/ui/field';
import {
 Popover,
 PopoverContent,
 PopoverTrigger,
} from '@/components/ui/popover';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';

export default function RoomNotesWrapper({
 dic,
 open,
 room,
 onChangeOpen,
 roomNotes,
}: {
 dic: RoomsRackDictionary;
 room: Rack;
 roomNotes: RoomNotesProps;
 open: boolean;
 onChangeOpen: (state: boolean) => unknown;
}) {
 const { locale } = useBaseConfig();
 const dateFns = useDateFns();
 const [showFromDatePicker, setShowFromDatePicker] = useState(false);
 const [showUntilDatePicker, setShowFromUntilPicker] = useState(false);
 const { watch, getValues, setValue, control } =
  useFormContext<RoomNotesSchema>();
 const [showEdit, setShowEdit] = useState(false);
 const [seletedNoteId, setSelectedNoteId] = useState<number | null>(null);
 const queryClient = useQueryClient();

 const { data: initialData, isLoading: initialDataIsLoading } = useQuery({
  staleTime: 'static',
  queryKey: [rackRoomNotesBaseKey, 'initial-data'],
  async queryFn({ signal }) {
   const res = await getInitialData({ signal });
   return res.data;
  },
 });

 function handleInvalidateQuery() {
  queryClient.invalidateQueries({
   queryKey: [rackRoomNotesBaseKey, 'list', room.registerID?.toString()],
  });
 }

 const [fromDateValue, untilDateValue] = watch(['fromDate', 'untilDate']);

 function handleShowEdit(id: number | null) {
  setSelectedNoteId(id);
  setShowEdit(true);
 }

 function handleCloseEdit() {
  setSelectedNoteId(null);
  setShowEdit(false);
 }

 const targetNote = seletedNoteId
  ? roomNotes.data?.rows.find((item) => item.id === seletedNoteId) || null
  : null;

 const editRoomNoteProps = {
  closeShowEdit: handleCloseEdit,
  onInvalidateQuery: handleInvalidateQuery,
  onShowEdit: handleShowEdit,
  selectedId: seletedNoteId,
  registerId: room!.registerID!,
  roomId: room!.roomID!,
  showEdit,
  targetNote,
  initialData,
  initialDataIsLoading,
 };

 const filterKeys = Object.keys(defaultValues) as (keyof RoomNotesSchema)[];
 const filterValues = watch(filterKeys);

 const filtersKeyValue = filterValues.map((value, i) => {
  return {
   key: filterKeys[i],
   value: (() => {
    if (value instanceof Date) {
     return value.toISOString();
    }
    if (typeof value === 'string') {
     return value;
    }
    return value?.value;
   })(),
  };
 });

 const activeFilters = filtersKeyValue.filter((item) => !!item.value);

 const pages = Math.ceil(roomNotes.rowsCount / roomNotes.paging.limit);
 const isFirstPage = roomNotes.paging.offset === 0;
 const isLastPage = roomNotes.paging.offset + 1 === pages;
 function goToNextPage() {
  roomNotes.setPaging((pre) => {
   if (pre.offset + 1 === pages) return pre;
   return { ...pre, offset: pre.offset + 1 };
  });
 }
 function goToPrevPage() {
  roomNotes.setPaging((pre) => {
   if (pre.offset === 0) return pre;
   return { ...pre, offset: pre.offset - 1 };
  });
 }
 function goToLastPage() {
  roomNotes.setPaging((pre) => ({ ...pre, offset: pages - 1 }));
 }
 function goToFirstPage() {
  roomNotes.setPaging((pre) => ({ ...pre, offset: 0 }));
 }

 useEffect(() => {
  if (roomNotes.isFetching || !!roomNotes.isSuccess) return;
  if (roomNotes.paging.offset + 1 > pages) {
   roomNotes.setPaging((pre) => ({ ...pre, offset: pages - 1 }));
  }
 }, [pages, roomNotes]);

 return (
  <>
   <Dialog open={open} onOpenChange={onChangeOpen}>
    <DialogContent className='sm:max-w-[unset]! sm:w-[min(98%,40rem)] gap-0 p-0 max-h-[95svh] overflow-hidden flex flex-col'>
     <DialogHeader className='p-4 border-b border-input'>
      <DialogHeader>
       <DialogTitle className='text-lg'>
        {dic.roomNotes.title} {room.roomLabel}
       </DialogTitle>
      </DialogHeader>
     </DialogHeader>
     {roomNotes.isFetching && <LinearLoading />}
     <div className='p-4 grow overflow-auto'>
      <div className='mb-4 flex gap-3'>
       <Button
        onClick={() => {
         handleShowEdit(null);
        }}
       >
        <FaPlus />
        {dic.roomNotes.addMessage}
       </Button>
       <Drawer>
        <DrawerTrigger>
         <Button
          variant='outline'
          size='lg'
          className='text-neutral-600 dark:text-neutral-400'
         >
          <FaFilter className='size-4' />
          <span className='hidden md:inline'>{dic.roomNotes.filters}</span>
          {true && (
           <Badge variant='destructive' className='size-6'>
            {activeFilters.length}
           </Badge>
          )}
         </Button>
        </DrawerTrigger>
        <DrawerContent className='h-[min(60svh,35rem)] flex flex-col'>
         <DrawerHeader>
          <DrawerTitle className='text-xl'>
           {dic.roomNotes.filters}{' '}
           <span className='text-sm text-neutral-700 dark:text-neutral-400'>
            ({dic.roomNotes.result}: {roomNotes.data?.rowsCount})
           </span>
          </DrawerTitle>
         </DrawerHeader>
         <div className='grow overflow-auto p-4'>
          <div className='mx-auto w-[min(100%,40rem)] grid grid-cols-2 gap-4'>
           <Controller
            control={control}
            name='fromDate'
            render={({ field }) => (
             <Field>
              <FieldLabel htmlFor='from-date'>
               {dic.roomNotes.fromDate}
              </FieldLabel>
              <Popover
               open={showFromDatePicker}
               onOpenChange={setShowFromDatePicker}
              >
               <PopoverTrigger asChild>
                <Button
                 variant='outline'
                 id='from-date'
                 className='justify-between font-normal h-11'
                 onBlur={field.onBlur}
                 ref={field.ref}
                >
                 <span>
                  {field.value ? field.value.toLocaleDateString(locale) : ''}
                 </span>
                 <div className='flex gap-1 items-center -me-2'>
                  {initialDataIsLoading && <Spinner />}
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
                  <ChevronDownIcon />
                 </div>
                </Button>
               </PopoverTrigger>
               <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
               >
                <Calendar
                 mode='single'
                 captionLayout='dropdown'
                 className='[&]:[--cell-size:2.6rem]'
                 disabled={(date) => {
                  if (!untilDateValue) return false;
                  return date.getTime() >= untilDateValue.getTime();
                 }}
                 defaultMonth={fromDateValue || undefined}
                 selected={field.value || undefined}
                 onSelect={(newValue) => {
                  if (newValue) {
                   field.onChange(newValue);
                   setShowFromDatePicker(false);
                  }
                 }}
                />
               </PopoverContent>
              </Popover>
             </Field>
            )}
           />
           <Controller
            control={control}
            name='untilDate'
            render={({ field }) => (
             <Field>
              <FieldLabel htmlFor='until-date'>
               {dic.roomNotes.untilDate}
              </FieldLabel>
              <Popover
               open={showUntilDatePicker}
               onOpenChange={setShowFromUntilPicker}
              >
               <PopoverTrigger asChild>
                <Button
                 variant='outline'
                 id='until-date'
                 className='justify-between font-normal h-11'
                 onBlur={field.onBlur}
                 ref={field.ref}
                >
                 <span>
                  {field.value ? field.value.toLocaleDateString(locale) : ''}
                 </span>
                 <div className='flex gap-1 items-center -me-2'>
                  {initialDataIsLoading && <Spinner />}
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
                  <ChevronDownIcon />
                 </div>
                </Button>
               </PopoverTrigger>
               <PopoverContent
                className='w-auto overflow-hidden p-0'
                align='start'
               >
                <Calendar
                 mode='single'
                 captionLayout='dropdown'
                 className='[&]:[--cell-size:2.6rem]'
                 disabled={(date) => {
                  if (!fromDateValue) return false;
                  return date.getTime() <= fromDateValue.getTime();
                 }}
                 defaultMonth={untilDateValue || undefined}
                 selected={field.value || undefined}
                 onSelect={(newValue) => {
                  if (newValue) {
                   field.onChange(newValue);
                   setShowFromUntilPicker(false);
                  }
                 }}
                />
               </PopoverContent>
              </Popover>
             </Field>
            )}
           />
           <Field>
            <FieldLabel htmlFor='note-type'>
             {dic.roomNotes.noteType}
            </FieldLabel>
            <Controller
             control={control}
             name='noteType'
             render={({ field }) => (
              <Drawer>
               <DrawerTrigger asChild>
                <Button
                 id='note-type'
                 variant='outline'
                 role='combobox'
                 className='justify-between h-11'
                 onBlur={field.onBlur}
                 ref={field.ref}
                >
                 <span className='text-start grow overflow-hidden text-ellipsis'>
                  {field.value ? field.value.value : ''}
                 </span>
                 <div className='flex gap-1 items-center -me-2'>
                  {initialDataIsLoading && <Spinner />}
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
               <DrawerContent className='h-[min(60svh,35rem)]'>
                <DrawerHeader className='hidden'>
                 <DrawerTitle>{dic.roomNotes.noteType}</DrawerTitle>
                </DrawerHeader>
                <div className='p-4 pb-6 mb-6 border-b border-input flex flex-wrap justify-between gap-4'>
                 <h1 className='text-xl font-medium text-neutral-600 dark:text-neutral-400'>
                  {dic.roomNotes.noteType}
                 </h1>
                </div>
                <div>
                 <ul>
                  {initialData?.messageTypes.map((item) => (
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
                </div>
               </DrawerContent>
              </Drawer>
             )}
            />
           </Field>
          </div>
         </div>
        </DrawerContent>
       </Drawer>
      </div>
      <RoomNotes
       dic={dic}
       roomNotes={roomNotes}
       editRoomNotes={editRoomNoteProps}
      />
     </div>
     {roomNotes.data?.rowsCount && (
      <DialogFooter className='p-4 py-2 border-t border-input'>
       <div className='flex gap-1 items-center'>
        <div className='me-4'>
         <span>{dic.roomNotes.result}: </span>
         <span>{roomNotes.rowsCount}</span>
        </div>
        <Button
         variant='outline'
         size='icon'
         onClick={goToFirstPage}
         disabled={isFirstPage}
        >
         <MdKeyboardDoubleArrowRight className='size-4 ltr:rotate-180' />
        </Button>
        <Button
         variant='outline'
         className='gap-1'
         onClick={goToPrevPage}
         disabled={isFirstPage}
        >
         <MdKeyboardArrowRight />
         <span className='hidden lg:inline'>{dic.roomNotes.prev}</span>
        </Button>
        <div
         style={{
          direction: 'ltr',
         }}
         className='text-base'
        >
         <span>{roomNotes.paging.offset + 1}</span> / <span>{pages}</span>
        </div>
        <Button
         variant='outline'
         className='gap-1 ltr:rotate-180'
         disabled={isLastPage}
         onClick={goToNextPage}
        >
         <span className='hidden lg:inline'>{dic.roomNotes.next}</span>
         <MdKeyboardArrowLeft className='ltr:rotate-180' />
        </Button>
        <Button
         variant='outline'
         size='icon'
         onClick={goToLastPage}
         disabled={isLastPage}
        >
         <MdKeyboardDoubleArrowLeft className='size-4 ltr:rotate-180' />
        </Button>
       </div>
      </DialogFooter>
     )}
    </DialogContent>
   </Dialog>
   <NewRoomNote dic={dic} editRoomNote={editRoomNoteProps} />
  </>
 );
}
