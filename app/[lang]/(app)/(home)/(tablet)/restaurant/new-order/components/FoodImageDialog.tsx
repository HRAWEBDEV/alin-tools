import {
 Dialog,
 DialogClose,
 DialogContent,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function FoodImageDialog({
 src,
 alt,
 activeID,
 onChangeID,
 //  setShowImage,
}: {
 src: string | undefined;
 alt: string | undefined;
 activeID: number | null;
 onChangeID: (id: number | null) => void;
 //  setShowImage: Dispatch<SetStateAction<boolean>>;
}) {
 return (
  <Dialog open={!!activeID} onOpenChange={() => onChangeID(null)}>
   <DialogContent className='p-0 gap-0'>
    <DialogHeader className='p-4'>
     <DialogTitle>{alt}</DialogTitle>
    </DialogHeader>
    <img
     alt={alt || 'image'}
     src={src}
     loading='lazy'
     className='object-center object-cover w-full h-full'
     //  onError={() => {
     //   setShowImage(false);
     //  }}
    />
    {/* <DialogFooter className='p-4'>
     <DialogClose asChild>
      <Button variant='outline' className='w-full'>
       بازگشت
      </Button>
     </DialogClose>
    </DialogFooter> */}
   </DialogContent>
  </Dialog>
 );
}
