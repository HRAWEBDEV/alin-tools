import {
 Dialog,
 DialogHeader,
 DialogTitle,
 DialogContent,
 DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { MdTouchApp } from 'react-icons/md';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useRoomDevisionShareDictionary } from '../../share-dictionary/roomDevisionShareDictionaryContext';

export default function NewNotificationDialog({
 open,
 onChangeOpen,
}: {
 open: boolean;
 onChangeOpen: (state: boolean) => unknown;
}) {
 const {
  roomDevisionShareDictionary: {
   components: { notifications },
  },
 } = useRoomDevisionShareDictionary();
 const { mutate, isPending } = useMutation({
  mutationFn() {
   return Promise.resolve();
  },
  onSuccess() {},
  onError(err: AxiosError<string>) {
   toast.error(err.response?.data);
  },
 });

 return (
  <Dialog
   open={open}
   onOpenChange={(newValue) => {
    if (isPending) return;
    onChangeOpen(newValue);
   }}
  >
   <DialogContent className='gap-0 p-0 max-h-[95svh] overflow-hidden flex flex-col'>
    <DialogHeader className='p-4 border-b border-border'>
     <DialogHeader>
      <DialogTitle className='text-lg'></DialogTitle>
     </DialogHeader>
    </DialogHeader>
    <div className='p-4 grow overflow-auto'></div>
    {/*<DialogFooter className='p-4 border-t border-border'></DialogFooter>*/}
   </DialogContent>
  </Dialog>
 );
}
