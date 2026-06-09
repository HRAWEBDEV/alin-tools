import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import { useRackConfigContext } from '../../services/rooms-rack-config/roomsRackConfigContext';
import { getNoteTypeStyles } from '../../utils/room-notes/getNoteTypeStyles';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBaseConfig } from '@/services/base-config/baseConfigContext';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { getRackReport } from '../../utils/rackReport';

export default function RackNotifsBoard({
 dic,
 open,
 setOpen,
}: {
 dic: RoomsRackDictionary;
 open: boolean;
 setOpen: (value: boolean) => unknown;
}) {
 const [activeReport, setActiveReport] =
  useState<keyof ReturnType<typeof getRackReport>>('notes');
 const { localeInfo } = useBaseConfig();
 const {
  rackReport,
  rack: { onShowRackMenu, pageCount, paging },
 } = useRackConfigContext();
 return (
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogContent className='flex flex-col w-[min(95%,45rem)] max-h-[95svh] max-w-none! p-0 overflow-hidden gap-0'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogTitle className='text-lg'>
      {dic.rackNotificationsBoard.title}
      {pageCount > 1 && (
       <span className='ms-2 text-sm'>
        ( {dic.filters.page} {paging.offset + 1} )
       </span>
      )}
     </DialogTitle>
    </DialogHeader>
    <div className='grow overflow-auto flex flex-col'>
     <header className='p-2 sticky bottom-1 pb-0 order-2 lg:order-0 lg:pb-2 lg:top-0 lg:bottom-auto bg-background z-3'>
      <div>
       <Tabs
        dir={localeInfo.contentDirection}
        value={activeReport}
        onValueChange={(val) =>
         setActiveReport(val as keyof ReturnType<typeof getRackReport>)
        }
       >
        <TabsList className='h-11 w-[min(100%,30rem)] mx-auto bg-neutral-200 dark:bg-neutral-800'>
         <TabsTrigger value='notes'>
          {dic.options.roomNotes}
          <Badge variant='default' className='text-sm size-6'>
           {rackReport.notes.length}
          </Badge>
         </TabsTrigger>
         <TabsTrigger value='birthDays'>
          {dic.help.birtdate}
          <Badge variant='default' className='size-6 text-sm'>
           {rackReport.birthDays.length}
          </Badge>
         </TabsTrigger>
        </TabsList>
       </Tabs>
      </div>
     </header>
     {activeReport === 'notes' && (
      <div className='p-4'>
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
     {activeReport === 'birthDays' && (
      <div className='p-4'>
       <ul>
        {rackReport.birthDays.map((room) => {
         return (
          <li
           key={room.roomLabel}
           className='border-b border-input text-orange-800 dark:text-orange-200'
          >
           <button
            className='whitespace-nowrap w-full justify-start items-start text-start py-2'
            onClick={() => onShowRackMenu(room)}
           >
            <p className='text-xl font-medium'>{room.roomLabel}</p>
            <div>
             {dic.help.birtdate} {room.bornName}
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
