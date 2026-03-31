import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import { type RoomNotesProps } from '../../utils/room-notes/roomNotesProps';
import NoItemFound from '@/app/[lang]/(app)/components/NoItemFound';
import UnExpectedError from '@/app/[lang]/(app)/components/UnExpectedError';
import { EditRoomNotesProps } from '../../utils/room-notes/editRoomNotesProps';
import RoomNoteItem from './RoomNoteItem';

export default function RoomNotes({
 dic,
 roomNotes,
 editRoomNotes,
}: {
 dic: RoomsRackDictionary;
 editRoomNotes: EditRoomNotesProps;
 roomNotes: RoomNotesProps;
}) {
 if (roomNotes.isSuccess && !roomNotes.data?.rowsCount) {
  return <NoItemFound />;
 }
 if (!roomNotes.isFetching && roomNotes.isError) {
  return <UnExpectedError />;
 }
 return (
  <div className='grid gap-2 grid-cols-1'>
   {roomNotes.data?.rows.map((note) => (
    <RoomNoteItem
     key={note.id}
     dic={dic}
     editRoomNote={editRoomNotes}
     note={note}
    />
   ))}
  </div>
 );
}
