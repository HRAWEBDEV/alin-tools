import { type SalonsDictionary } from '@/internalization/app/dictionaries/(tablet)/restaurant/salons/dictionary';
import { type TableOrder as TableOrderType } from '../services/salonsApiActions';
import TableOrder from './TableOrder';
import { useOrderRedirectLink } from '../hooks/useOrderRedirectLink';
import { Skeleton } from '@/components/ui/skeleton';

export default function TableOrders({
 dic,
 data,
 isLoading,
 orderCount,
 orderRedirectLink,
}: {
 dic: SalonsDictionary;
 data?: TableOrderType[];
 orderCount: number;
 isLoading: boolean;
 orderRedirectLink: ReturnType<typeof useOrderRedirectLink>;
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
   {data?.map((order) => (
    <TableOrder
     key={order.key}
     dic={dic}
     order={order}
     orderRedirectLink={orderRedirectLink}
    />
   ))}
  </div>
 );
}
