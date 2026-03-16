import { type RoomStatisticsDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/room-statistics/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import RoomsStatisticsWrapper from '../RoomsStatisticsWrapper';

export default function RoomsStatisticsDialog({
 dic,
 open,
 setOpen,
}: {
 dic: RoomStatisticsDictionary;
 open: boolean;
 setOpen: (value: boolean) => unknown;
}) {
 return (
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogContent className='flex flex-col w-[min(95%,45rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogTitle className='text-lg'>{dic.title}</DialogTitle>
    </DialogHeader>
    <div className='grow overflow-auto p-4'>
     <RoomsStatisticsWrapper dic={dic} />
    </div>
   </DialogContent>
  </Dialog>
 );
}
