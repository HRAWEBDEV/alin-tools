import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { useSalonBaseConfigContext } from '../../services/salon-base-config/salonBaseConfigContext';
import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlineBlock } from 'react-icons/md';

export default function ChangeTableState({ dic }: { dic: SalonsDictionary }) {
 const {
  tablesInfo: { selectedTable, showChangeTableState, onShowChangeTableState },
 } = useSalonBaseConfigContext();
 return (
  <Dialog
   open={showChangeTableState}
   onOpenChange={(newValue) => onShowChangeTableState(newValue)}
  >
   <DialogContent className='gap-0 p-0'>
    <DialogHeader className='p-4 py-6'>
     <DialogTitle>{dic.tableStateModal.title}</DialogTitle>
    </DialogHeader>
    <div className='p-4'>
     <p className='mb-4 text-base font-medium text-center'>
      <span>
       {dic.tableStateModal.currentTableState} {selectedTable?.tableNo} :
      </span>
      <span className='text-teal-800 dark:text-teal-200'>
       {dic.tableStateModal.readyToService}
      </span>
     </p>
     <div className='flex gap-4 justify-center flex-wrap'>
      <Button
       variant='outline'
       className='h-auto w-auto flex-col size-48 max-h-none bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200'
      >
       <FaCheckCircle className='size-14' />
       <span className='text-base font-medium'>
        {dic.tableStateModal.readyToService}
       </span>
      </Button>
      <Button
       variant='outline'
       className='h-auto w-auto flex-col size-48 max-h-none bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
      >
       <MdOutlineBlock className='size-14' />
       <span className='text-base font-medium'>
        {dic.tableStateModal.outOfOrder}
       </span>
      </Button>
     </div>
    </div>
   </DialogContent>
  </Dialog>
 );
}
