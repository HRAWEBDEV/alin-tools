import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';
import { getNoteTypeStyles } from '../../utils/room-notes/getNoteTypeStyles';

export default function RackNotifsBoard({
 dic,
 open,
 setOpen,
}: {
 dic: RoomsRackDictionary;
 open: boolean;
 setOpen: (value: boolean) => unknown;
}) {
 const {
  rackReport,
  rack: { onShowRackMenu },
 } = useRackConfigContext();
 return (
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogContent className='flex flex-col w-[min(95%,45rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogTitle className='text-lg'>
      {dic.rackNotificationsBoard.title}
     </DialogTitle>
    </DialogHeader>
    <div className='grow overflow-auto p-4'>
     {!!rackReport.notes.length && (
      <div>
       <ul>
        {rackReport.notes.map((room) => {
         const noteStyles = getNoteTypeStyles(room.messageTypeID);
         return (
          <li
           key={room.roomLabel}
           className={`border-b border-input ${noteStyles.text}`}
          >
           <button
            className='whitespace-nowrap w-full justify-start items-start text-start py-2'
            onClick={() => onShowRackMenu(room)}
           >
            <p className='text-xl font-medium'>{room.roomLabel}</p>
            <div>
             {dic.info.message} {room.messageTypeName}
            </div>
           </button>
          </li>
         );
        })}
       </ul>
      </div>
     )}
    </div>
   </DialogContent>
  </Dialog>
 );
}
