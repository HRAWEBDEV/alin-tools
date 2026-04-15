import { useQuery } from '@tanstack/react-query';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type RoomControlDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/room-control/dictionary';
import { type OutOfOrderRoomsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/out-of-order-rooms/dictionary';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { type Rack } from '../../services/roomsRackApiActions';
import {
 RoomStateGroup,
 RoomStateKind as RoomStateKindTypes,
} from '../../utils/rackStates';
import RackRoom from './RackRoom';
import { Button } from '@/components/ui/button';
import RoomStateKind from './RoomStateKind';
import RoomStateType from './RoomStateType';
import RoomControl from '../room-control/RoomControl';
import RoomControlIndicator from '../room-control/RoomControlIndicator';
import RoomGuestsWrapper from '../guests/RoomGuestsWrapper';
import { Badge } from '@/components/ui/badge';
import {
 roomGuestMessagesBaseKey,
 getRoomGuestMessages,
} from '../../services/guest-messages/roomGuestMessagesApiActions';
import { Spinner } from '@/components/ui/spinner';
import RoomGuestMessagesWrapper from '../guest-messages/RoomGuestMessagesWrapper';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
 type RoomNotesSchema,
 defaultValues,
 createRoomNotesSchema,
} from '../../schemas/room-notes/roomNotesSchema';
import {
 rackRoomNotesBaseKey,
 getRoomNotes,
} from '../../services/room-notes/RackRoomNotesApiActions';
import { useState, useEffect } from 'react';
import { type Paging } from '../../../utils/apiTypes';
import RoomNotesWrapper from '../room-notes/RoomNotesWrapper';
import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from '@/components/ui/dialog';
import { BiError } from 'react-icons/bi';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
 expiredOutOfOrder,
 outOfOrderRoomsBaseKey,
 getOutOfOrderRoom,
} from '../../../rooms-management/out-of-order-rooms/services/outOfOrderApiActions';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import NewOutOfOrderRoom from '../../../rooms-management/out-of-order-rooms/components/NewOutOfOrderRoom';

export default function RoomMenu({
 dic,
 room,
 isOpen,
 setIsOpen,
 showRoomStateKind,
 setShowRoomStateKind,
 showRoomStateType,
 setShowRoomStateType,
 setShowRoomControl,
 showRoomControl,
 showRoomGuests,
 setShowRoomGuests,
 showGuestMessages,
 setShowGuestMessages,
 showRoomNotes,
 setShowRoomNotes,
 roomControlDic,
 outOfOrderDic,
 showOutOfOrder,
 setShowOutOfOrder,
}: {
 dic: RoomsRackDictionary;
 roomControlDic: RoomControlDictionary;
 room: Rack | null;
 isOpen: boolean;
 setIsOpen: (state: boolean) => unknown;
 showRoomStateKind: boolean;
 setShowRoomStateKind: (state: boolean) => unknown;
 showRoomStateType: boolean;
 setShowRoomStateType: (state: boolean) => unknown;
 showRoomControl: boolean;
 setShowRoomControl: (state: boolean) => unknown;
 showRoomGuests: boolean;
 setShowRoomGuests: (state: boolean) => unknown;
 showGuestMessages: boolean;
 setShowGuestMessages: (state: boolean) => unknown;
 showRoomNotes: boolean;
 setShowRoomNotes: (state: boolean) => unknown;
 showOutOfOrder: boolean;
 setShowOutOfOrder: (state: boolean) => unknown;
 outOfOrderDic: OutOfOrderRoomsDictionary;
}) {
 const queryClient = useQueryClient();
 const { locale } = useBaseConfig();
 // guest messages setup
 const {
  data: guestMessages,
  isSuccess: guestMessagesIsSuccess,
  isError: guestMessagesIsError,
  isFetching: guestMessagesIsFetching,
  refetch: guestMessagesRefetch,
 } = useQuery({
  enabled: !!room && !!room.registerID,
  queryKey: [roomGuestMessagesBaseKey, 'list', room?.registerID?.toString()],
  async queryFn({ signal }) {
   const res = await getRoomGuestMessages({
    signal,
    registerId: room!.registerID!,
   });
   return res.data;
  },
 });
 // out of order
 const {
  data: outOfOrder,
  isSuccess: outOfOrderIsSuccess,
  isFetching: outOfOrderIsFetching,
 } = useQuery({
  enabled: !!room && RoomStateKindTypes.outOfService === room.roomStateKindID,
  queryKey: [outOfOrderRoomsBaseKey, 'rooms', room?.roomID.toString()],
  async queryFn({ signal }) {
   const res = await getOutOfOrderRoom({
    signal,
    roomId: room!.roomID,
   });
   return res.data;
  },
 });
 // room notes setup
 const [roomNotesPaging, setRoomNotesPaging] = useState<Paging>({
  limit: 10,
  offset: 0,
 });
 const [roomNotesRowsCount, setRoomNotesRowsCount] = useState(0);

 const roomNotesForm = useForm<RoomNotesSchema>({
  defaultValues,
  resolver: zodResolver(createRoomNotesSchema()),
 });

 const [fromDateValue, untilDateValue, noteTypeValue, noteStateValue] =
  roomNotesForm.watch(['fromDate', 'untilDate', 'noteType', 'noteState']);

 const {
  data: roomNotes,
  isError: roomNotesIsError,
  isSuccess: roomNotesIsSuccess,
  isFetching: roomNotesIsFetching,
  refetch: roomNotesRefetch,
 } = useQuery({
  enabled: !!room && !!room.registerID && !!room.roomID,
  queryKey: [
   rackRoomNotesBaseKey,
   'list',
   room?.registerID?.toString(),
   room?.roomID.toString(),
   roomNotesPaging.limit.toString(),
   roomNotesPaging.offset.toString(),
   fromDateValue?.toISOString() || 'all',
   untilDateValue?.toISOString() || 'all',
   noteTypeValue?.key || 'all',
   noteStateValue?.key || 'all',
  ],
  async queryFn({ signal }) {
   const res = await getRoomNotes({
    limit: roomNotesPaging.limit,
    offset: roomNotesPaging.offset + 1,
    registerId: room!.registerID!,
    roomId: room!.roomID!,
    signal,
    fromDate: fromDateValue?.toISOString(),
    untilDate: untilDateValue?.toISOString(),
    messageStateKey: noteStateValue!.key,
    messageTypeId: noteTypeValue?.key,
   });
   const pages = Math.ceil((res.data.rowsCount || 0) / roomNotesPaging.limit);
   const isOutOfRange = roomNotesPaging.offset + 1 >= pages;
   if (isOutOfRange) {
    setRoomNotesPaging((pre) => ({ ...pre, offset: 0 }));
   }
   return res.data;
  },
 });

 // expire
 const { mutate: confirmExpire, isPending: confirmExpireIsPending } =
  useMutation({
   mutationFn() {
    return expiredOutOfOrder(room!.roomID);
   },
   onError(err: AxiosError<string>) {
    toast.error(err.response?.data);
   },
   onSuccess() {
    queryClient.invalidateQueries({
     queryKey: [outOfOrderRoomsBaseKey, 'rooms'],
    });
   },
  });

 useEffect(() => {
  setRoomNotesRowsCount(roomNotes?.rowsCount || 0);
 }, [roomNotes]);

 const pedingAction = confirmExpireIsPending;

 return (
  <Drawer open={isOpen} onOpenChange={setIsOpen}>
   <DrawerContent className='h-[min(70svh,50rem)]'>
    <DrawerHeader className='border-b border-input'>
     <DrawerTitle className='text-2xl'>{dic.options.title}</DrawerTitle>
    </DrawerHeader>
    {room ? (
     <>
      <div className='p-4 pb-6 grid sm:grid-cols-[max-content_1fr] gap-6 w-[min(100%,50rem)] mx-auto overflow-auto'>
       <div className='sm:w-48'>
        <RackRoom
         dic={dic}
         room={room}
         mock={true}
         roomControlDic={roomControlDic}
        />
       </div>
       <div className='grid grid-cols-1 gap-2 content-start'>
        {!room.noRoom && (
         <>
          <Button
           variant='outline'
           className='justify-start text-start h-12'
           size='lg'
           disabled={pedingAction}
           onClick={() => setShowRoomStateKind(true)}
          >
           {dic.options.changeRoomStateKind}
          </Button>
          <Button
           variant='outline'
           className='justify-start text-start h-12'
           size='lg'
           disabled={pedingAction}
           onClick={() => setShowRoomStateType(true)}
          >
           {dic.options.changeRoomStateType}
          </Button>
          {RoomStateKindTypes.outOfService === room.roomStateKindID && (
           <>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             disabled={
              pedingAction ||
              outOfOrderIsFetching ||
              !outOfOrder ||
              !outOfOrderIsSuccess
             }
             onClick={() => setShowOutOfOrder(true)}
            >
             {(pedingAction || outOfOrderIsFetching) && <Spinner />}
             {dic.options.outOfOrder}
             {!!outOfOrder && (
              <div className='flex flex-wrap gap-2'>
               <span className='text-secondary'>
                {new Date(outOfOrder.fromDateTimeOffset).toLocaleDateString(
                 locale,
                )}
               </span>
               -
               <span className='text-destructive'>
                {new Date(outOfOrder.untilDateTimeOffset).toLocaleDateString(
                 locale,
                )}
               </span>
              </div>
             )}
            </Button>
            <Dialog>
             <DialogTrigger asChild>
              <Button
               variant='outline'
               className='justify-start text-start h-12'
               size='lg'
               disabled={pedingAction}
              >
               {pedingAction && <Spinner />}
               {dic.options.cancelOutOfOrder}
              </Button>
             </DialogTrigger>
             <DialogContent className='p-0 gap-0'>
              <DialogHeader className='p-4'>
               <DialogTitle className='hidden'>
                {outOfOrderDic.newOrEdit.expireConfirmMessage}
               </DialogTitle>
              </DialogHeader>
              <div className='p-4'>
               <div className='flex gap-1 items-center text-red-700 dark:text-red-400 font-medium'>
                <BiError className='size-12' />
                <p>{outOfOrderDic.newOrEdit.expireConfirmMessage}</p>
               </div>
              </div>
              <DialogFooter className='p-4'>
               <DialogClose asChild>
                <Button className='sm:w-24' variant='outline'>
                 {outOfOrderDic.newOrEdit.cancel}
                </Button>
               </DialogClose>
               <DialogClose asChild>
                <Button
                 className='sm:w-24'
                 variant='destructive'
                 onClick={() => confirmExpire()}
                >
                 {outOfOrderDic.newOrEdit.confirm}
                </Button>
               </DialogClose>
              </DialogFooter>
             </DialogContent>
            </Dialog>
           </>
          )}
          {RoomStateGroup.occupiedRoom === room.roomStateGroupID && (
           <>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             onClick={() => setShowRoomControl(true)}
            >
             {dic.options.houseControl}
             {room.hkStateID && (
              <div>
               <RoomControlIndicator
                dic={roomControlDic}
                withText
                hkStateID={room.hkStateID}
               />
              </div>
             )}
            </Button>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             onClick={() => setShowRoomNotes(true)}
            >
             {dic.options.roomNotes}
             {roomNotesIsFetching && <Spinner />}
             {roomNotesIsSuccess && (
              <Badge variant='secondary' className='size-6'>
               {roomNotes.rowsCount || 0}
              </Badge>
             )}
            </Button>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             onClick={() => setShowGuestMessages(true)}
            >
             {dic.options.guestMessages}
             {guestMessagesIsFetching && <Spinner />}
             {guestMessagesIsSuccess && (
              <Badge variant='default' className='size-6'>
               {guestMessages?.registerMessages.length || 0}
              </Badge>
             )}
            </Button>
            <Button
             variant='outline'
             className='justify-start text-start h-12'
             size='lg'
             onClick={() => setShowRoomGuests(true)}
            >
             {dic.options.guests}
             <Badge variant='destructive' className='size-6'>
              {room.guestCount}
             </Badge>
            </Button>
           </>
          )}
         </>
        )}
       </div>
      </div>
      <RoomStateKind
       dic={dic}
       room={room}
       open={showRoomStateKind}
       onChangeOpen={setShowRoomStateKind}
       onSuccess={() => {
        setIsOpen(false);
        setShowRoomStateKind(false);
       }}
      />
      <RoomStateType
       dic={dic}
       room={room}
       open={showRoomStateType}
       onChangeOpen={setShowRoomStateType}
       onSuccess={() => {
        setIsOpen(false);
        setShowRoomStateType(false);
       }}
      />
      <RoomGuestsWrapper
       dic={dic}
       room={room}
       open={showRoomGuests}
       onChangeOpen={setShowRoomGuests}
      />
      {outOfOrder && (
       <NewOutOfOrderRoom
        dic={outOfOrderDic}
        editRoom={{
         onCloseEdit: () => setShowOutOfOrder(false),
         onShowEdit: () => {},
         selectedOutOfOrderRoomID: outOfOrder.id,
         showNew: showOutOfOrder,
         targetEditRoom: outOfOrder,
        }}
       />
      )}
      <RoomControl
       dic={roomControlDic}
       roomID={room.roomID!}
       registerID={room.registerID!}
       roomLabel={room.roomLabel!}
       open={showRoomControl}
       onChangeOpen={setShowRoomControl}
       onSuccess={() => {
        setIsOpen(false);
        setShowRoomControl(false);
       }}
      />
      <FormProvider {...roomNotesForm}>
       <RoomNotesWrapper
        dic={dic}
        room={room}
        open={showRoomNotes}
        onChangeOpen={(state) => {
         if (!state) {
          roomNotesForm.setValue('fromDate', defaultValues['fromDate']);
          roomNotesForm.setValue('untilDate', defaultValues['untilDate']);
          roomNotesForm.setValue('noteState', defaultValues['noteState']);
          roomNotesForm.setValue('noteType', defaultValues['noteType']);
          setRoomNotesPaging((pre) => ({ ...pre, offset: 0 }));
         }
         setShowRoomNotes(state);
        }}
        roomNotes={{
         data: roomNotes,
         isError: roomNotesIsError,
         isSuccess: roomNotesIsSuccess,
         isFetching: roomNotesIsFetching,
         refetch: roomNotesRefetch,
         paging: roomNotesPaging,
         setPaging: setRoomNotesPaging,
         rowsCount: roomNotesRowsCount,
        }}
       />
      </FormProvider>
      <RoomGuestMessagesWrapper
       dic={dic}
       room={room}
       open={showGuestMessages}
       onChangeOpen={setShowGuestMessages}
       roomGuestMessages={{
        data: guestMessages,
        isSuccess: guestMessagesIsSuccess,
        isError: guestMessagesIsError,
        isFetching: guestMessagesIsFetching,
        refetch: guestMessagesRefetch,
       }}
      />
     </>
    ) : null}
   </DrawerContent>
  </Drawer>
 );
}
