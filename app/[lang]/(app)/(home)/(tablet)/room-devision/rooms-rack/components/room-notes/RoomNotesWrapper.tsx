import { useState } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { type Rack } from '../../services/roomsRackApiActions';
import { RoomNotesProps } from '../../utils/room-notes/roomNotesProps';
import LinearLoading from '@/app/[lang]/(app)/components/LinearLoading';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import {
 rackRoomNotesBaseKey,
 getInitialData,
} from '../../services/room-notes/RackRoomNotesApiActions';
import { useQuery } from '@tanstack/react-query';
import RoomNotes from './RoomNotes';
import NewRoomNote from './NewRoomNote';

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
      <div className='mb-4'>
       <Button
        onClick={() => {
         handleShowEdit(null);
        }}
       >
        <FaPlus />
        {dic.roomNotes.addMessage}
       </Button>
      </div>
      <RoomNotes
       dic={dic}
       roomNotes={roomNotes}
       editRoomNotes={editRoomNoteProps}
      />
     </div>
    </DialogContent>
   </Dialog>
   <NewRoomNote dic={dic} editRoomNote={editRoomNoteProps} />
  </>
 );
}
