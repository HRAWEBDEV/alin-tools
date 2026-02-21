import { DrawerClose } from '@/components/ui/drawer';
import { RiCloseLargeFill } from 'react-icons/ri';
import { cx } from 'class-variance-authority';

export default function CloseButton({ className }: { className?: string }) {
 return (
  <DrawerClose
   className={cx(
    `flex items-center gap-2 border p-3 rounded-lg cursor-pointer transition-colors`,
    className,
   )}
  >
   <RiCloseLargeFill className='font-medium size-5' />
  </DrawerClose>
 );
}
