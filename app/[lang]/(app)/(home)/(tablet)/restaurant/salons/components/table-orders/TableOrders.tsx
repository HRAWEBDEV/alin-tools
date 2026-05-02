import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { type TableOrder as TableOrderType } from '../../services/salonsApiActions';
import TableOrder from './TableOrder';
import { useOrderRedirectLink } from '../../hooks/useOrderRedirectLink';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa6';
import { DrawerClose } from '@/components/ui/drawer';

export default function TableOrders({
 dic,
 data,
 isLoading,
 orderCount,
 orderRedirectLink,
 tableCapacity,
 tableStateType,
 canAddNewOrder = true,
}: {
 dic: SalonsDictionary['multiOrder'];
 data?: TableOrderType[];
 tableCapacity: number;
 tableStateType: number;
 orderCount: number;
 isLoading: boolean;
 orderRedirectLink: ReturnType<typeof useOrderRedirectLink>;
 canAddNewOrder?: boolean;
}) {
 if (isLoading)
  return (
   <div className='flex flex-wrap gap-4'>
    {Array.from({ length: orderCount }, (_, i) => i).map((i) => (
     <Skeleton key={i} className='size-40 border-4 border-input' />
    ))}
   </div>
  );
 return (
  <div className='flex gap-4 flex-wrap'>
   {canAddNewOrder && (
    <DrawerClose asChild>
     <Link
      className='size-40 border border-input rounded-md grid place-content-center bg-secondary/10 text-secondary'
      href={orderRedirectLink ? `${orderRedirectLink}&orderID=0` : '#'}
     >
      <FaPlus className='size-10' />
     </Link>
    </DrawerClose>
   )}
   {data?.map((order) => (
    <TableOrder
     key={order.key}
     dic={dic}
     order={order}
     orderRedirectLink={orderRedirectLink}
     tableCapacity={tableCapacity}
     tableStateType={tableStateType}
    />
   ))}
  </div>
 );
}
