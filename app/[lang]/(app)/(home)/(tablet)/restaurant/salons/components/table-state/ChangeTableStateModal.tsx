import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogHeader,
 DialogFooter,
 DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';

export default function ChangeTableState({ dic }: { dic: SalonsDictionary }) {
 return (
  <Dialog>
   <DialogContent>
    <DialogHeader>
     <DialogTitle>{dic.tables.changeTableState}</DialogTitle>
    </DialogHeader>
    <div></div>
    <DialogFooter></DialogFooter>
   </DialogContent>
  </Dialog>
 );
}
