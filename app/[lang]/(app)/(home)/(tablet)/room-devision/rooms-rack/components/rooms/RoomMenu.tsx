import { useQuery } from '@tanstack/react-query';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Drawer,
 DrawerContent,
 DrawerHeader,
 DrawerTitle,
} from '@/components/ui/drawer';
import { type Rack } from '../../services/roomsRackApiActions';
import { RoomStateGroup } from '../../utils/rackStates';
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
}: {
 dic: RoomsRackDictionary;
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
}) {
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
   setRoomNotesPaging((pre) => ({ ...pre, offset: 0 }));
   return res.data;
  },
 });

 useEffect(() => {
  setRoomNotesRowsCount(roomNotes?.rowsCount || 0);
 }, [roomNotes]);

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
        <RackRoom dic={dic} room={room} mock={true} />
       </div>
       <div className='grid grid-cols-1 gap-2 content-start'>
        {!room.noRoom && (
         <>
          <Button
           variant='outline'
           className='justify-start text-start h-12'
           size='lg'
           onClick={() => setShowRoomStateKind(true)}
          >
           {dic.options.changeRoomStateKind}
          </Button>
          <Button
           variant='outline'
           className='justify-start text-start h-12'
           size='lg'
           onClick={() => setShowRoomStateType(true)}
          >
           {dic.options.changeRoomStateType}
          </Button>
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
                dic={dic}
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
      <RoomControl
       dic={dic}
       room={room}
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
