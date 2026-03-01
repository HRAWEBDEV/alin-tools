import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { type TableOrder } from '../services/salonsApiActions';
import { useOrderRedirectLink } from '../hooks/useOrderRedirectLink';
import { Button } from '@/components/ui/button';
import { MdTouchApp } from 'react-icons/md';
import Link from 'next/link';

export default function TableOrder({
 order,
 orderRedirectLink,
}: {
 dic: SalonsDictionary;
 order: TableOrder;
 orderRedirectLink: ReturnType<typeof useOrderRedirectLink>;
}) {
 return (
  <Button
   key={order.key}
   variant='outline'
   className='relative h-auto w-auto flex-col justify-start items-start size-40 max-h-none bg-teal-50 dark:bg-teal-950'
   asChild
  >
   <Link
    href={orderRedirectLink ? `${orderRedirectLink}&orderID=${order.key}` : '#'}
   >
    <div className='absolute bottom-0 end-0 z-0'>
     <MdTouchApp className='size-24 text-neutral-200 dark:text-neutral-800' />
    </div>
    <div className='flex flex-col items-center z-1'>test</div>
   </Link>
  </Button>
 );
}
