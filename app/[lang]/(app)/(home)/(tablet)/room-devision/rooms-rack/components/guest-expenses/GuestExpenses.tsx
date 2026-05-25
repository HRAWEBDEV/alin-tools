import { useState, Activity } from 'react';
import { type RoomsRackDictionary } from '@/internalization/app/dictionaries/(tablet)/room-devision/rooms-rack/dictionary';
import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
} from '@/components/ui/dialog';
import GuestExpensesTabs from './GuestExpensesTabs';
import StayExpenses from './stay/StayExpenses';
import RevenueExpenses from './revenue/RevenueExpenses';
import { type GuestExpenseTabs } from '../../utils/guest-expenses/GuestExpenseTabs';

export default function GuestExpenses({
 dic,
 open,
 onChangeOpen,
 registerID,
 roomID,
 roomLabel,
}: {
 dic: RoomsRackDictionary;
 open: boolean;
 registerID: number;
 roomID: number;
 roomLabel: string;
 onChangeOpen: (state: boolean) => unknown;
}) {
 const [activeExpenses, setActiveExpenses] = useState<GuestExpenseTabs>('stay');

 function changeActiveExpenseTab(tab: GuestExpenseTabs) {
  setActiveExpenses(tab);
 }

 function handleCloseGuestExpenses() {
  onChangeOpen(false);
 }
 function handleOpenGuestExpenses() {
  onChangeOpen(true);
 }

 return (
  <Dialog open={open} onOpenChange={onChangeOpen}>
   <DialogContent className='w-full h-full max-sm:rounded-none max-w-[unset]! sm:w-[min(98%,70rem)] gap-0 p-0 sm:h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-input'>
     <DialogHeader>
      <DialogTitle className='text-lg'>
       {dic.guestExpenses.title} _ {dic.guestExpenses.roomLabel}:{' '}
       <span className='text-primary text-xl'>{roomLabel}</span>
      </DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-2 px-4 grow overflow-auto flex flex-col [&]:[--top-offset:3.75rem]'>
     <GuestExpensesTabs
      dic={dic}
      activeExpenses={activeExpenses}
      changeActiveExpenseTab={changeActiveExpenseTab}
     />
     <div className='grow order-1'>
      <Activity mode={activeExpenses === 'stay' ? 'visible' : 'hidden'}>
       <StayExpenses dic={dic} registerID={registerID} roomID={roomID} />
      </Activity>
      <Activity
       mode={activeExpenses === 'revenue-center' ? 'visible' : 'hidden'}
      >
       <RevenueExpenses
        dic={dic}
        registerID={registerID}
        roomID={roomID}
        onCloseGuestExpenses={handleCloseGuestExpenses}
        onOpenGuestExpenses={handleOpenGuestExpenses}
       />
      </Activity>
     </div>
    </div>
   </DialogContent>
  </Dialog>
 );
}
