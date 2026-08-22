'use client';
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogDescription,
} from '@/components/ui/dialog';
import { useRestaurantShareDictionary } from '../../../../services/share-dictionary/restaurantShareDictionaryContext';
import { Button } from '@/components/ui/button';

export default function PrintInvoiceDialog({
 open,
 onToggle,
}: {
 open: boolean;
 onToggle: (state?: boolean) => unknown;
}) {
 const {
  restaurantShareDictionary: {
   components: { newOrderPrintInvoice: dic },
  },
 } = useRestaurantShareDictionary();
 return (
  <Dialog open={open} onOpenChange={(state) => onToggle(state)}>
   <DialogContent className='gap-0 p-0'>
    <DialogHeader className='p-4 border-b border-border'>
     <DialogTitle>{dic.title}</DialogTitle>
     <DialogDescription className='hidden'>{dic.title}</DialogDescription>
    </DialogHeader>
    <div className='p-4'>
     <div>
      <Button>{dic.close}</Button>
      <Button>{dic.confirm}</Button>
     </div>
    </div>
   </DialogContent>
  </Dialog>
 );
}
